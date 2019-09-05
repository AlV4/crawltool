<?php

$containers = shell_exec( "docker ps" );
$containersList = array_filter( explode( "\n", $containers ) );
if ( ! empty( $containersList ) && count( $containersList ) > 1 ){
    $keys = outputLineToArray( $containersList[0] );
    unset( $containersList[0] );
    $runningContainers = [];
    foreach ( $containersList as $item ) {
        $runningContainers[] = runningContainerName( $item );
    }
    foreach ( $runningContainers as $runningContainer ) {
        print_r( "[$runningContainer] : " . shell_exec( "docker logs --tail 1 $runningContainer" ) );
    }
} else {
    echo "No Docker activity...";
}

function outputLineToArray ( $line )
{
    $delimiter = "^";
    return array_values( explode( $delimiter, preg_replace( '/\s\s+/', $delimiter, $line ) ) );
}

function runningContainerName( $line )
{
    return end(outputLineToArray( $line ) );
}