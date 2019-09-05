<?php

require_once '../vendor/autoload.php';
require_once 'ReportFormatter.php';
require_once 'ReportItem.php';

class Report
{
    const IDX_TITLE = 0;
    const IDX_FIELDS = 1;
    const IDX_DATA_START = 2;

    private $tabs = [
        "Page Titles:All",
        "Page Titles:Duplicate",
        "Page Titles:Missing",
        "Page Titles:Below 30 Characters",
        "Page Titles:Over 65 Characters",
        "Meta Description:All",
        "Meta Description:Duplicate",
        "Meta Description:Missing",
        "Meta Description:Over 155 Characters",
        "Meta Description:Below 70 Characters",
        "H1:All",
        "H1:Duplicate",
        "H1:Missing",
        "H1:Over 70 Characters",
        "H2:All",
        "H2:Duplicate",
        "H2:Missing",
        "H2:Over 70 Characters",
    ];

    private $resultFolder;
    private $dataFormat;
    /**
     * @var ReportFormatter $reportFormatter
     */
    private $reportFormatter;

    /**
     * @var string $reportString
     */
    private $reportString;

    private $outputDir = '../tmp';

    /**
     * @param $folder
     * @param $resultFolder
     * @param $dataFormat
     */
    public function __construct ( $folder, $resultFolder, $dataFormat )
    {
        $this->reportFormatter = new ReportFormatter( new XLSXWriter(), $this->tabs, $folder );
        $this->resultFolder = $resultFolder;
        $this->dataFormat = $dataFormat;
        $this->buildReport();
    }

    private function buildReport ()
    {
        $reportItems = $this->createReport();
        $tabsTree = $this->tabsToFields($this->tabs);
        $folder = $this->reportFormatter->getFolder();
        foreach ($reportItems as $item) {
            $answers = [ $item->getUrl() ];
            $format[] = [ 'halign' => 'left', 'color' => '#00f', 'border' => 'left,right,top,bottom' ];
            foreach ($tabsTree as $tab) {
                $cellFormat = [ 'halign' => 'center', 'border' => 'left,right,top,bottom' ];
                if ( ! empty( $item->$tab ) ){
                    $cellFormat['color'] = '#080';
                    $answers[] = "v";
                } else {
                    $cellFormat['color'] = '#000';
                    $answers[] = "x";
                }
                $format[] = $cellFormat;
            }
            $this->reportFormatter->getWriter()->writeSheetRow( $folder, $answers , $format );
            $format = [];
        }
        $this->reportString = $this->reportFormatter->getWriter()->writeToString();
        $this->reportFormatter->getWriter()->writeToFile( $this->outputDir."/$folder.xls" );
    }

    /**
     * @param array $tabs
     * @return array
     */
    private function tabsToFields(array $tabs)
    {
        $tabsTree = [];
        foreach ($tabs as $tab) {
            $tabsTree[] = $this->str_low_underscore( $tab );
        }
        return $tabsTree;
    }

    /**
     * @return array
     */
    private function createReport()
    {
        $reportItems = [];
        foreach ($this->tabs as $tab) {
            $fileName = $this->getFilenameFromTab($tab, $this->resultFolder, $this->dataFormat);
            $reportData = $this->getArrayFromCsv($fileName, $tab);
            if ( is_string( $reportData ) ) {
                $this->calculateParameter( $reportItems, $reportData, $tab );
                continue;
            }
            $this->assembleLinksData($reportItems, $reportData);
        }
        return $reportItems;
    }

    /**
     * @param $objects
     * @param $arrFromFile
     */
    private function assembleLinksData(&$objects, $arrFromFile)
    {
        $totalLines = count($arrFromFile);
        for ($lineNumber = self::IDX_DATA_START; $lineNumber < $totalLines; $lineNumber++) {

            $link = $arrFromFile[$lineNumber][0];
            $reportItem = isset($objects[$link]) ? $objects[$link] : new ReportItem($link);

            $classSubclass = explode( "-", $arrFromFile[self::IDX_TITLE][self::IDX_TITLE] );
            $group = trim ( $classSubclass[0] );
            $item = trim ( $classSubclass[1] );
            $prop = $this->str_low_underscore( "$group:$item" );
            $reportItem->$prop = $arrFromFile[$lineNumber][self::IDX_FIELDS];
            $reportItem->storeCsvLine( $arrFromFile[$lineNumber], $prop );
            $objects[$link] = $reportItem;
        }
    }

    /**
     * @param $reportItems
     * @param $paramName
     * @param $tab
     */
    private function calculateParameter( &$reportItems, $paramName, $tab ) {
        /** @var ReportItem $reportItem */
        foreach ( $reportItems as $reportItem ) {
            $reportItem->$paramName = $reportItem->calculate( $tab );
        }
    }

    /**
     * @param $tabName
     * @param $folderName
     * @param $extension
     * @return string
     */
    private function getFilenameFromTab($tabName, $folderName, $extension)
    {
        return "$folderName/" . $this->str_low_underscore($tabName) . ".$extension";
    }

    /**
     * @param $string
     * @return string
     */
    private function str_low_underscore($string)
    {
        return strtr(strtolower(trim($string)), [":" => "_", " " => "_", "-" => '']);
    }

    /**
     * @param $fileName
     * @param $tab
     * @return array|string
     */
    private function getArrayFromCsv($fileName, $tab)
    {
        if (!file_exists($fileName)) {
            return $this->str_low_underscore( $tab );
        }
        return array_map('str_getcsv', file($fileName));
    }

    /**
     * @return string
     */
    public function getReportString ()
    {
        return $this->reportString;
    }
}