<?php

require_once '../vendor/autoload.php';
require_once '../config/config.php';

if (php_sapi_name() != 'cli') {
    throw new Exception('This application must be run on the command line.');
}

$client = new Google_Client();
$client->setApplicationName('ScreamingFrog');
$client->setScopes([
    Google_Service_Sheets::SPREADSHEETS,
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/script.projects"
]);
$client->setAuthConfig(CREDENTIALS_FILE);
$client->setAccessType('offline');
$client->setPrompt('select_account consent');

// Load previously authorized token from a file, if it exists.
if (file_exists(TOKEN)) {
    $accessToken = json_decode(file_get_contents(TOKEN), true);
    $client->setAccessToken($accessToken);
}

// If there is no previous token or it's expired.
if ($client->isAccessTokenExpired()) {
    // Refresh the token if possible, else fetch a new one.
    if ($client->getRefreshToken()) {
        $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
    } else {
        // Request authorization from the user.
        $authUrl = $client->createAuthUrl();
        printf("Open the following link in your browser:\n%s\n", $authUrl);
        print 'Enter verification code: ';
        $authCode = trim(fgets(STDIN));

        // Exchange authorization code for an access token.
        $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);
        $client->setAccessToken($accessToken);

        // Check to see if there was an error.
        if (array_key_exists('error', $accessToken)) {
            throw new Exception(join(', ', $accessToken));
        }
    }
    // Save the token to a file.
    if (!file_exists(dirname(TOKEN))) {
        mkdir(dirname(TOKEN), 0700, true);
    }
    file_put_contents(TOKEN, json_encode($client->getAccessToken()));
}
print "Access granted!" . PHP_EOL;