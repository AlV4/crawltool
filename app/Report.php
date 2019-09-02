<?php

require_once '../vendor/autoload.php';
require_once 'ReportFormatter.php';
require_once 'ReportItem.php';

class Report
{
    const IDX_TITLE = 0;
    const IDX_FIELDS = 1;
    const IDX_DATA_START = 2;

    private $tabs;
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
     * Report constructor.
     * @param array $tabs
     * @param $folder
     * @param $resultFolder
     * @param $dataFormat
     */
    public function __construct ( array $tabs, $folder, $resultFolder, $dataFormat )
    {
        $this->setTabs( $tabs );
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
                if ( $item->$tab ){
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
            $arrFromFile = $this->getArrayFromCsv($fileName);
            $this->assembleLinksData($reportItems, $arrFromFile);
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
            $dataContainer = isset($objects[$link]) ? $objects[$link] : new ReportItem($link);

            $classSubclass = explode( "-", $arrFromFile[self::IDX_TITLE][self::IDX_TITLE] );
            $group = trim ( $classSubclass[0] );
            $item = trim ( $classSubclass[1] );
            $prop = $this->str_low_underscore( "$group:$item" );
            $dataContainer->$prop = true;
            //TODO more complicated data, not sure is it needed
//        foreach ($arrFromFile[IDX_FIELDS] as $key => $field) {
//            $dataContainer->$group[$item][$field] = $arrFromFile[$lineNumber][$key];
//        }
            $objects[$link] = $dataContainer;
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
     * @return array
     */
    private function getArrayFromCsv($fileName)
    {
        if (!file_exists($fileName)) {
            return ["ERROR" => "File not found: [ $fileName ]"];
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

    /**
     * @param array $tabs
     */
    public function setTabs ( array $tabs )
    {
        $res = [];
        $group = explode( ":", $tabs[0] )[0];
        foreach ( $tabs as $tab ) {
            $nextGroup = explode( ":", $tab )[0];
            if ( $group !== $nextGroup ){
                $res [] = "$group:Over 70 Characters";
                $group = $nextGroup;
            }
            $res [] = $tab;
        }
        print_r( $res );
        exit;
        $this->tabs = $tabs;
    }
}