$(document).ready(function() {

    var pathToFrogLauncher = "index.php";

    var formReady = true;

    $(".container").append($('<div id="result" style="max-height: 400px; overflow-wrap: break-word; overflow-x:hidden"></div>'));

    var resultConsole = $('#result');

    $('#settings_form').on( 'submit', function ( e ) {
        e.preventDefault();

        if ( ! formReady ){
            log("Frog is busy!", 50);
            return false;
        } else {
            formReady = false;
            log("Link processing...", 50);
            var serializedData = $( '#settings_form' ).serialize();

            $.post( pathToFrogLauncher, serializedData ).done( function ( response ) {
                log( response, 2000 );
                formReady = true;
            } ).fail( function ( response ) {
                log( response.responseText, 50 );
                formReady = true;
            } );
        }
    } );

    $('#clear_log').on( 'click', function ( e ) {
        e.preventDefault();
        resultConsole.html('');
    } );

    $('#status').on( 'click', function(){
        $.get( "check_status.php" ).done( function( responce ){
            log( responce, 50 );
        } ).fail( function( error ){
            log( error, 50 );
        });
    } );
    function log( data, scrollTime ){
        if (data) {
            resultConsole.html( '<pre>' + resultConsole.text() + "\n\n" + data + '</pre>' );
            resultConsole.animate( { scrollTop : resultConsole.prop( "scrollHeight" ) }, scrollTime );
        }
    }
});