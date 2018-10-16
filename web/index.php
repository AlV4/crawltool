<?php

$resultFolder = '/var/www/test.loc/seo_results';

$link = $_REQUEST['link'];

if ( ! filter_var($link, FILTER_VALIDATE_URL) ){
    echo "Invalid url!";;
    throw new ErrorException();
}

$folder = strtr( $link, ['http://' => '', 'https://' => '', '.' => '_'] );

$resultFolder .= DIRECTORY_SEPARATOR.$folder;

$tabs = [
    "Internal:All",
    "H1:All",
    "H2:All",
    "Page Titles:All",
    "Page Titles:Duplicate",
    "Meta Description:All",
    "Meta Description:Duplicate",
];

$allTabs = implode( ", ", $tabs );

$conf = [
    "dockerRun" =>
        "docker run -v $resultFolder:/home/crawls screamingfrog --crawl $link --headless --overwrite --save-crawl --output-folder /home/crawls --export-format xls --export-tabs \"$allTabs\"",
    "dockerBuildMsg" =>
        "Need to build the docker image: 'docker build -t screamingfrog .'",
    "dockerCheckImageExists" =>
        "docker inspect --type=image screamingfrog"
];

if ( empty( json_decode( shell_exec($conf['dockerCheckImageExists']) ) ) ){
    echo $conf['dockerBuildMsg'];
    throw new ErrorException();
}
//echo shell_exec( $conf['dockerRun'] );

$dirContent = array_values( array_diff( scandir( $resultFolder ), ['.','..','crawl.seospider'] ) );

print_r($dirContent);
