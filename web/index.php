<?php

$begin = microtime( true );

require_once '../vendor/autoload.php';
require_once '../config/config.php';
require_once '../app/Report.php';
require_once 'send.php';

$request = json_decode( file_get_contents("php://input") );

$link = $request->link;
$email = $request->email;
$outputDataFormat = $request->outputFormat;
$printLogs = $request->logs;
$outputDataFormat = in_array( $outputDataFormat, [ 'csv', 'xls' ] ) ? $outputDataFormat : 'csv';

$logs = [];
if (!filter_var($link, FILTER_VALIDATE_URL)) {
    echo "Invalid url!";
    exit(1);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Invalid email!";
    exit(1);
}

$folder = strtr($link, ['http://' => '', 'https://' => '', '.' => '_', '/' => '', ':' => '__']);

$resultFolder = RESULT_FOLDER . DIRECTORY_SEPARATOR . $folder;

$dataFormat = 'csv';

$tabs = [
//    "Internal:All",
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
//    "Images:All",
//    "Images:Missing Alt Text",
];

$allTabs = implode(", ", $tabs);

$conf = [
    "dockerRun" =>
        "docker run -v $resultFolder:/home/crawls alvcher/screamingfrog:1.1.1 --crawl $link --headless --overwrite --save-crawl --output-folder /home/crawls --export-format $dataFormat --export-tabs \"$allTabs\"",
    "dockerBuildMsg" =>
        "Need to build the docker container: 'docker-compose up -d --build'",
    "dockerCheckImageExists" =>
        "docker inspect screamingfrog"
];

if (empty(json_decode(shell_exec($conf['dockerCheckImageExists'])))) {
    echo $conf['dockerBuildMsg'];
    exit(1);
}

//session_write_close();
//fastcgi_finish_request();

$logs['frog_output'] = shell_exec( $conf['dockerRun'] );

$report = new Report( $folder, $resultFolder, $dataFormat, $outputDataFormat );
$timeSpent = microtime( true ) - $begin;
$time =  gmdate("H:i:s", $timeSpent );
$logs['timing'] = "Time spent: $time";

send( $email, $logs['timing'], $report->getResultFileName(), $report->getResultFilePath( $outputDataFormat ) );

if ($printLogs && !empty($logs)) {
    print_r($logs);
}
//log_to_file( $logs );

/**
 * @param $data
 */
function log_to_file($data)
{
    if (!empty($data)) {
        file_put_contents("log.txt", print_r($data, true), FILE_APPEND);
    }
}