<?php

$containers = shell_exec( "docker ps" );
$containersList = array_filter( explode( "\n", $containers ) );
if ( ! empty( $containersList ) && count( $containersList ) > 1 ){
    $keys = outputLineToArray( $containersList[0] );
    unset( $containersList[0] );
    $runningContainers = [];
    foreach ( $containersList as $item ) {
        $runningContainers[ runningContainerName( $item ) ] = runningContainerImageName( $item );
    }
    foreach ( $runningContainers as $runningContainer => $image ) {
        if ( strpos( $image, "screamingfrog") !== false ) {
            print_r( "[$runningContainer] : " . shell_exec( "docker logs --tail 1 $runningContainer" ) );
        }
    }
} else {
    echo "No Docker activity...";
}

/**
 * @param string $line
 *
 * @return array
 */
function outputLineToArray ( $line )
{
    $delimiter = "^";
    return array_values( explode( $delimiter, preg_replace( '/\s\s+/', $delimiter, $line ) ) );
}

/**
 * @param $line
 *
 * @return mixed
 */
function runningContainerName( $line )
{
    $linesArr = outputLineToArray( $line );
    return end( $linesArr );
}

/**
 * @param $line
 *
 * @return mixed
 */
function runningContainerImageName( $line )
{
    return ( ( array ) outputLineToArray( $line ) )[1];
}