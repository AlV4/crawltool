<?php

require_once '../vendor/autoload.php';
require_once '../config/config.php';

$begin = microtime(true);

define( 'IDX_TITLE', 0 );
define( 'IDX_FIELDS', 1 );
define( 'IDX_DATA_START', 2 );

$link = $_REQUEST['link'];
$logs = [];
$printLogs = isset( $_REQUEST['logs'] );
if ( ! filter_var($link, FILTER_VALIDATE_URL) ){
    echo "Invalid url!";
    exit( 1 );
}

$folder = strtr( $link, ['http://' => '', 'https://' => '', '.' => '_', '/' => '', ':' => '__'] );

$resultFolder = RESULT_FOLDER.DIRECTORY_SEPARATOR.$folder;

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
    "Images:Missing Alt Text",
    "Images:All",
];

$allTabs = implode( ", ", $tabs );
$objects = createReport( $tabs, $resultFolder, $dataFormat );
$timeSpent = microtime( true ) - $begin;
print_r (
    [
    'first' => reset( $objects ),
    'last' => end( $objects ),
    'time' => $timeSpent
    ]
);
exit;
$conf = [
    "dockerRun" =>
        "docker run -v $resultFolder:/home/crawls screamingfrog --crawl $link --headless --overwrite --save-crawl --output-folder /home/crawls --export-format $dataFormat --export-tabs \"$allTabs\"",
    "dockerBuildMsg" =>
        "Need to build the docker image: 'docker build -t screamingfrog .'",
    "dockerCheckImageExists" =>
        "docker inspect --type=image screamingfrog"
];

if ( empty( json_decode( shell_exec($conf['dockerCheckImageExists']) ) ) ){
    echo $conf['dockerBuildMsg'];
    exit( 1 );
}

echo "Job started successfully, you will receive an email after process end.\n";

//session_write_close();
//fastcgi_finish_request();



//$logs['frog_output'] = shell_exec( $conf['dockerRun'] );

if( $printLogs && ! empty( $logs ) ){
    print_r( $logs );
}
//log_to_file( $logs );

/**
 * @param $tabs
 * @param $resultFolder
 * @param $dataFormat
 * @return array
 */
function createReport( $tabs, $resultFolder, $dataFormat ){
    $objects = [];
    foreach ( $tabs as $tab ) {
        $fileName = getFilenameFromTab( $tab, $resultFolder, $dataFormat ) ;
        $arrFromFile = getArrayFromCsv( $fileName );
        assembleLinksData( $objects, $arrFromFile );
    }
    return $objects;
}

/**
 * @param $objects
 * @param $arrFromFile
 */
function assembleLinksData( &$objects, $arrFromFile ) {
    $totalLines = count( $arrFromFile );
    for ( $lineNumber = IDX_DATA_START; $lineNumber < $totalLines; $lineNumber++ ) {

        $link = $arrFromFile[ $lineNumber ][ 0 ];
        $dataContainer = isset( $objects[ $link ] ) ? $objects[ $link ] : new class {};

        foreach ( $arrFromFile[ IDX_FIELDS ] as $key => $field ) {
            $field = str_low_underscore( $field );
            $reportName = $arrFromFile[ IDX_TITLE ][ IDX_TITLE ];
            $dataContainer->$reportName[ $field ] = $arrFromFile[ $lineNumber ][ $key ];
        }

        $objects[ $link ] = $dataContainer;
    }
}

/**
 * @param $tabName
 * @param $folderName
 * @param $extension
 * @return string
 */
function getFilenameFromTab( $tabName, $folderName, $extension ){
    return "$folderName/" . str_low_underscore( $tabName ) . ".$extension";
}

/**
 * @param $string
 * @return string
 */
function str_low_underscore( $string ) {
    return strtr( strtolower( trim ( $string ) ), [ ":" => "_", " " => "_", "-" => '' ] );
}

/**
 * @param $fileName
 * @return array
 */
function getArrayFromCsv( $fileName ){
    if( ! file_exists( $fileName ) ) {
        return [ "ERROR" => "File not found: [ $fileName ]" ];
    }
    return array_map('str_getcsv', file($fileName) );
}

/**
 * @param $data
 */
function log_to_file( $data )
{
    if ( ! empty($data) ){
        file_put_contents("log.txt", print_r($data , true), FILE_APPEND );
    }
}
