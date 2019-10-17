<?php

require '../app/phpmailer/PHPMailer.php';
require '../app/phpmailer/SMTP.php';
require '../app/phpmailer/Exception.php';

/**
 * @param $email
 * @param $text
 * @param $reportName
 * @param $fileAbsPath
 */
function send( $email, $text, $reportName, $fileAbsPath ){

    $mail = new PHPMailer\PHPMailer\PHPMailer();
    try {
        $msg = "Mail sent\n";
        $mail->isSMTP();
        $mail->CharSet = "UTF-8";
        $mail->SMTPAuth   = true;

        // Email settings
        $mail->Host       = MAIL_HOST;
        $mail->Username   = MAIL_USERNAME;
        $mail->Password   = MAIL_PASS;
        $mail->SMTPSecure = MAIL_SMTP_SECURE;
        $mail->Port       = MAIL_PORT;
        $mail->setFrom(MAIL_SENDER_ADDRESS, MAIL_SENDER_NAME);

        $mail->addAddress($email);
        $mail->addAttachment($fileAbsPath, $reportName);

        $mail->isHTML(true);

        $mail->Subject = "Screaming frog report $reportName";
        $mail->Body    = $text;

        if ($mail->send()) {
            echo "$msg";
        } else {
            echo "Wrong mail settings\n";
        }

    } catch (Exception $e) {
        echo "Mail not sent. Error: {$mail->ErrorInfo}\n{$e->getMessage()}\n";
    }
}