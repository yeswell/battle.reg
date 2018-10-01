<?php

header('Content-Type: application/json');
define('SOCKETLABS_URL', 'https://inject.socketlabs.com/api/v1/email');
define('SOCKETLABS_SERVERID', 'YOUR SERVER ID HERE');
define('SOCKETLABS_KEY', 'YOUR API KEY HERE');

// Create JSON object to POST to SocketLabs
$data = new stdClass();
$data->ServerId = SOCKETLABS_SERVERID;
$data->ApiKey = SOCKETLABS_KEY;
$data->Messages = json_decode(file_get_contents('php://input'))->Messages;

$bodyJson = json_encode($data);
//echo $bodyJson;

//use CURL to POST the JSON to SocketLabs
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, SOCKETLABS_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $bodyJson);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

$result = curl_exec($ch);
curl_close($ch);

// process result
if ($result == false)
{
    echo 'HTTP Error';
}
else
{
    $result_obj = json_decode($result);
    if ($result_obj->ErrorCode == 'Success')
    {
        echo 'Вы успешно зарегистрировали команду!';
    }
    elseif ($result_obj->ErrorCode == 'Warning')
    {
        echo 'Произошла ошибка, попробуйте ещё раз.';
    }
    else
    {
        echo 'Произошла ошибка, попробуйте ещё раз.';
        //'Failure Code: ' . $result_obj->ErrorCode;
    }
}
?>