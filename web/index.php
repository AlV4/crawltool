<?php

require_once '../vendor/autoload.php';
require_once '../config/config.php';

$link = $_REQUEST['link'];

if ( ! filter_var($link, FILTER_VALIDATE_URL) ){
    echo "Invalid url!";;
    throw new ErrorException();
}

$folder = strtr( $link, ['http://' => '', 'https://' => '', '.' => '_', '/' => ''] );

$resultFolder .= RESULT_FOLDER.DIRECTORY_SEPARATOR.$folder;

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

$client = getClient( CREDENTIALS_FILE );

$service = new Google_Service_Sheets($client);
$driveService = new Google_Service_Drive( $client );

$fileTpl = new \Google_Service_Drive_DriveFile();
$fileTpl->setName( $folder );
$copiedFile = $driveService->files->copy( TEMPLATE_SHEET_ID, $fileTpl );



$dirContent = array_values( array_diff( scandir( $resultFolder ), ['.','..','crawl.seospider'] ) );

$request = [];
foreach ( $dirContent as $tab ) {
    $request['requests'][] = [ 'addSheet' =>[ 'properties'=>[ 'title'=> substr( $tab, 0, strpos($tab, '.') )  ] ] ];
}
try {
    $body = new Google_Service_Sheets_BatchUpdateSpreadsheetRequest($request);
    $result = $service->spreadsheets->batchUpdate($copiedFile->getId(),$body);
} catch(Exception $ignore) {}

echo "Job started successfully, you will receive an email after process end.\n";

session_write_close();
fastcgi_finish_request();

shell_exec( $conf['dockerRun'] );

//TODO import tada from result files to sheets, then remover result folder with data

//file_put_contents("log.txt", print_r($dirContent, true), FILE_APPEND );


/**
 * Returns an authorized API client.
 *
 * @param $configPath
 *
 * @return Google_Client the authorized client object
 * @throws Exception
 * @throws Google_Exception
 * @throws InvalidArgumentException
 * @throws LogicException
 */
function getClient( $configPath )
{
    $client = new Google_Client();
    $client->setApplicationName('ScreamingFrog');
    $client->setScopes([ Google_Service_Sheets::SPREADSHEETS, "https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file" ]);
    $client->setAuthConfig($configPath);
    $client->setAccessType('offline');

    // Load previously authorized token from a file, if it exists.
    $tokenPath = TOKEN;
    if (file_exists($tokenPath)) {
        $accessToken = json_decode(file_get_contents($tokenPath), true);
        $client->setAccessToken($accessToken);
    }

    // If there is no previous token or it's expired.
    if ($client->isAccessTokenExpired()) {
        // Refresh the token if possible, else fetch a new one.
        if ($client->getRefreshToken()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
        } else {
            echo "You need to run 'grant_acces.php' file using php cli interface! No access to Google Spreadsheets!!";
            throw new ErrorException();
        }
        // Save the token to a file.
        if (!file_exists(dirname($tokenPath))) {
            mkdir(dirname($tokenPath), 0700, true);
        }
        file_put_contents($tokenPath, json_encode($client->getAccessToken()));
    }

    return $client;
}