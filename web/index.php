<?php

$resultFolder = '/var/www/test.loc/seo_results';

$link = $_REQUEST['link'];

$conf = [
    "dockerRun" =>
        "docker run -v $resultFolder:/home/crawls screamingfrog --crawl $link --headless --overwrite --save-crawl --output-folder /home/crawls --bulk-export 'All Outlinks'",
    "dockerBuildMsg" =>
        "Need to build the docker image: 'docker build -t screamingfrog .'",
    "dockerCheckImageExists" =>
        "docker inspect --type=image screamingfrog"
];

if ( ! filter_var($link, FILTER_VALIDATE_URL) ){
    echo "Invalid url!";;
    throw new ErrorException();
}
if ( empty( json_decode( shell_exec($conf['dockerCheckImageExists']) ) ) ){
    echo $conf['dockerBuildMsg'];
    throw new ErrorException();
}
echo shell_exec( $conf['dockerRun'] );