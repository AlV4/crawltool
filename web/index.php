<?php

require_once '../vendor/autoload.php';
require_once '../config/config.php';
require_once '../app/Report.php';

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

$allTabs = implode(", ", $tabs);

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

$logs['frog_output'] = shell_exec( $conf['dockerRun'] );

$report = new Report( $tabs, $folder, $resultFolder, $dataFormat );
$timeSpent = microtime(true) - $begin;
$logs[] = "time spent: $timeSpent";

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
