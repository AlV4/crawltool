<?php

class GoogleSpreadSheet
{
    private $logs = [];

    /**
     * @return mixed
     */
    public function getLogs ()
    {
        return print_r( $this->logs, true );
    }

    /**
     * @param mixed $message
     */
    public function log ( $message )
    {
        $this->logs[] = $message;
    }

    /**
     * @param $folder
     * @param $resultFolder
     * @param $dataFormat
     * @return Google_Service_Script_Operation|string
     * @throws Google_Exception
     */
    public function spreadSheetExport( $folder, $resultFolder, $dataFormat ) {
        $client = $this->getClient();

        $sheetId = $this->createSpreadSheet( $client, $folder, $resultFolder, $dataFormat );

        $reportTplId = $this->createReport( $client, $folder );

        $service = new Google_Service_Script($client);

        $request = new Google_Service_Script_ExecutionRequest();

        $functions = [
            SCRIPT_FUNCTION_NAME,
        ];
        $request->setDevMode(true);
        $request->setParameters([ $sheetId, $reportTplId ]);
        $result = '';
        foreach ( $functions as $function ) {
            $request->setFunction( $function );
            try {
                $result = $service->scripts->run( SCRIPT_ID, $request );
            }catch ( \Exception $e ){
                $this->log( $e->getMessage() );
            }
        }
        return $result;
    }

    /**
     * @param Google_Client $client
     * @param               $name
     * @param               $resultFolder
     * @param               $dataFormat
     *
     * @return string
     */
    function createSpreadSheet( Google_Client $client, $name, $resultFolder,$dataFormat ){

        $sheetService = new Google_Service_Sheets( $client );

        $requestBody = new Google_Service_Sheets_Spreadsheet([
            'properties' => [
                'title' => $name
            ]
        ]);
        $fileSheet = $sheetService->spreadsheets->create($requestBody);

        $firstSheetId = $sheetService->spreadsheets->get($fileSheet->getSpreadsheetId())->getSheets()[0]->properties->sheetId;

        $dirContent = array_values( array_diff( scandir( $resultFolder ), ['.','..','crawl.seospider'] ) );

        $updateRequest = [];
        foreach ( $dirContent as $tab ) { // add sheets with tab names according to export files
            $updateRequest['requests'][] = [
                'addSheet' => [
                    'properties'=>[ 'title'=> substr( $tab, 0, strpos($tab, '.') )  ]
                ]
            ];
        }
        $updateRequest['requests'][] = [ 'deleteSheet' => [ 'sheetId' => $firstSheetId ] ]; // delete first unnecessary sheet, if needed
        try {
            $body = new Google_Service_Sheets_BatchUpdateSpreadsheetRequest($updateRequest);
            $result = $sheetService->spreadsheets->batchUpdate($fileSheet->getSpreadsheetId(),$body);
        } catch(Exception $ignore) {}
        $sheets = $sheetService->spreadsheets->get($fileSheet->getSpreadsheetId())->getSheets();

        $insertRequest = [];
        foreach ( $sheets as $sheet ) {
            $id = $sheet->getProperties()['sheetId'];
            $tabName = $sheet->getProperties()['title'];
            $insertRequest['requests'][] = [ 'pasteData' => [
                'coordinate' => [ "sheetId" => $id,  "rowIndex" => 0,  "columnIndex" => 0 ],
                "data" => file_get_contents("$resultFolder/$tabName.$dataFormat" ),
                "delimiter" => ","
            ] ];
        }
        try {
            $body = new Google_Service_Sheets_BatchUpdateSpreadsheetRequest($insertRequest);
            $result = $sheetService->spreadsheets->batchUpdate($fileSheet->getSpreadsheetId(),$body);
        } catch(Exception $ignore) {}

        return $fileSheet->getSpreadsheetId();
    }

    function createReport ( Google_Client $client, $folder )
    {
        $driveService = new Google_Service_Drive( $client );
        $fileTpl = new \Google_Service_Drive_DriveFile();
        $fileTpl->setName( $folder."_".TEMPLATE_SHEET_NAME );
        $copiedFile = $driveService->files->copy( TEMPLATE_SHEET_ID, $fileTpl );
        return $copiedFile->getId();
    }

    /**
     * Returns an authorized API client.
     *
     * @return Google_Client the authorized client object
     * @throws Exception
     * @throws Google_Exception
     * @throws InvalidArgumentException
     * @throws LogicException
     */
    function getClient()
    {
        $client = new Google_Client();
        $client->setApplicationName('ScreamingFrog');
        $client->setScopes([
            Google_Service_Sheets::SPREADSHEETS,
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/script.projects",
            "https://www.googleapis.com/auth/script.container.ui",
            "https://www.googleapis.com/auth/script.send_mail",
        ]);
        $client->setAuthConfig( CREDENTIALS_FILE );
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

}