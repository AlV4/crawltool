<?php

require_once '../vendor/autoload.php';
require_once '../config/config.php';
require_once '../app/ReportItem.php';

$begin = microtime(true);

define('IDX_TITLE', 0);
define('IDX_FIELDS', 1);
define('IDX_DATA_START', 2);

$link = $_REQUEST['link'];
$logs = [];
$printLogs = isset($_REQUEST['logs']);
if (!filter_var($link, FILTER_VALIDATE_URL)) {
    echo "Invalid url!";
    exit(1);
}

$folder = strtr($link, ['http://' => '', 'https://' => '', '.' => '_', '/' => '', ':' => '__']);

$resultFolder = RESULT_FOLDER . DIRECTORY_SEPARATOR . $folder;

$dataFormat = 'csv';

$tabs = [
    "Internal:All",
    "Page Titles:All",
    "Page Titles:Duplicate",
    "Page Titles:Missing",
    "Meta Description:All",
    "Meta Description:Duplicate",
    "Meta Description:Missing",
    "H1:All",
    "H1:Duplicate",
    "H1:Missing",
    "H2:All",
    "H2:Duplicate",
    "H2:Missing",
    "Images:All",
    "Images:Missing Alt Text",
];

$tabsTree = tabsToFields($tabs);
//print_r($tabsTree);
//exit;
$allTabs = implode(", ", $tabs);
$objects = createReport($tabs, $resultFolder, $dataFormat);
$timeSpent = microtime(true) - $begin;
print_r(
    [
        'first' => reset($objects),
        'last' => end($objects),
        'time' => $timeSpent
    ]
);
$fileName = getFilenameFromTab($tabs[1], $resultFolder, $dataFormat);
print_r($fileName . PHP_EOL);
//exit;
$writer = new XLSXWriter();
$writer->setAuthor('Screaming Frog Automatic Report Builder');
$headers = [ 'Technical SEO Report' ] + $tabs;
$widths = [ 80 ];
$headerValues = [ '' => 'string' ];
//print_r([$headers, $widths]);exit;
$writer->writeSheetHeader( $folder, $headerValues, [ 'widths' => $widths, 'halign' =>'center' ] );
$format = [
    'font'=>'Arial',
    'font-size'=>14,
    'fill'=>'#eee',
    'border'=>'top,bottom,left,right',
    'valign' => 'center',
    'height'=> 20,
    'halign'=>'center',
];
$writer->markMergedCell($folder, $start_row=1, $start_col=1, $end_row=1, $end_col=3);
$writer->markMergedCell($folder, $start_row=1, $start_col=4, $end_row=1, $end_col=6);
$writer->markMergedCell($folder, $start_row=1, $start_col=7, $end_row=1, $end_col=9);
$writer->markMergedCell($folder, $start_row=1, $start_col=10, $end_row=1, $end_col=12);
$writer->markMergedCell($folder, $start_row=1, $start_col=13, $end_row=1, $end_col=14);
$groupsMerged = ['Technical SEO Report'];
$itemsOfGroups = ['URL'];
$delimiter = ":";
foreach ($tabs as $tab) {
    $delimiterPos = strpos( $tab, $delimiter );
    $groupsMerged[] = substr( $tab, 0, $delimiterPos );
    $itemsOfGroups[] = substr( $tab, $delimiterPos + 1 );
}
unset( $groupsMerged[1] ); //get rid of internal tab
unset( $itemsOfGroups[1] ); //get rid of internal tab
$writer->writeSheetRow( $folder, $groupsMerged , $format );
$format['font-size'] = 10;
$writer->writeSheetRow( $folder, $itemsOfGroups , $format );

$format['font-size'] = 10;
$format['height'] = 12;
unset( $format['halign'] );

foreach ($objects as $object) {
    $answers = [ $object->getUrl() ];
    $format[] = [ 'halign' => 'left' ];
    foreach ($tabsTree as $tab) {
        $cellFormat = [ 'halign' => 'center' ];
        if ( $object->$tab ){
//            $cellFormat['fill'] = '#333';
            $answers[] = "v";
        } else {
//            $cellFormat['fill'] = '#aca';
            $answers[] = "x";
        }
        $format[] = $cellFormat;
    }
    $writer->writeSheetRow( $folder, $answers , $format );
}

//$writer->writeSheetRow($sheetName, $tabs);
$result = $writer->writeToString();
$dir = "../tmp";
$writer->writeToFile( "$dir/ex3.xls" );

print_r($result);

//print_r(array_map('str_getcsv', file($fileName)));
exit;
$conf = [
    "dockerRun" =>
        "docker run -v $resultFolder:/home/crawls screamingfrog --crawl $link --headless --overwrite --save-crawl --output-folder /home/crawls --export-format $dataFormat --export-tabs \"$allTabs\"",
    "dockerBuildMsg" =>
        "Need to build the docker image: 'docker build -t screamingfrog .'",
    "dockerCheckImageExists" =>
        "docker inspect --type=image screamingfrog"
];

if (empty(json_decode(shell_exec($conf['dockerCheckImageExists'])))) {
    echo $conf['dockerBuildMsg'];
    exit(1);
}

echo "Job started successfully, you will receive an email after process end.\n";

//session_write_close();
//fastcgi_finish_request();


//$logs['frog_output'] = shell_exec( $conf['dockerRun'] );

if ($printLogs && !empty($logs)) {
    print_r($logs);
}
//log_to_file( $logs );

/**
 * @param array $tabs
 * @return array
 */
function tabsToFields(array $tabs)
{
    $tabsTree = [];
    foreach ($tabs as $tab) {
        if ( $tab === "Internal:All" ) { //don't need in report, contains all data
            continue;
        }
        $tabsTree[] = str_low_underscore( $tab );
    }
    return $tabsTree;
}

/**
 * @param $tabs
 * @param $resultFolder
 * @param $dataFormat
 * @return array
 */
function createReport($tabs, $resultFolder, $dataFormat)
{
    $objects = [];
    foreach ($tabs as $tab) {
        $fileName = getFilenameFromTab($tab, $resultFolder, $dataFormat);
        $arrFromFile = getArrayFromCsv($fileName);
        assembleLinksData($objects, $arrFromFile);
    }
    return $objects;
}

/**
 * @param $objects
 * @param $arrFromFile
 */
function assembleLinksData(&$objects, $arrFromFile)
{
    $totalLines = count($arrFromFile);
    for ($lineNumber = IDX_DATA_START; $lineNumber < $totalLines; $lineNumber++) {

        $link = $arrFromFile[$lineNumber][0];
        $dataContainer = isset($objects[$link]) ? $objects[$link] : new ReportItem($link);

        $classSubclass = explode( "-", $arrFromFile[IDX_TITLE][IDX_TITLE] );
        $group = trim ( $classSubclass[0] );
        $item = trim ( $classSubclass[1] );
        $prop = str_low_underscore( "$group:$item" );
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
function getFilenameFromTab($tabName, $folderName, $extension)
{
    return "$folderName/" . str_low_underscore($tabName) . ".$extension";
}

/**
 * @param $string
 * @return string
 */
function str_low_underscore($string)
{
    return strtr(strtolower(trim($string)), [":" => "_", " " => "_", "-" => '']);
}

/**
 * @param $fileName
 * @return array
 */
function getArrayFromCsv($fileName)
{
    if (!file_exists($fileName)) {
        return ["ERROR" => "File not found: [ $fileName ]"];
    }
    return array_map('str_getcsv', file($fileName));
}

/**
 * @param $data
 */
function log_to_file($data)
{
    if (!empty($data)) {
        file_put_contents("log.txt", print_r($data, true), FILE_APPEND);
    }
}
