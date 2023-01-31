<?php
include '../config/dbh.php';
include '../classes/sanitize.class.php';
include '../classes/Account.class.php';

$insert = new Account($con);

// check 

// $user = $_SESSION['visited'];

// get data from js file
$jsonReqUrl = "php://input";
$reqjson = file_get_contents($jsonReqUrl);
$data = json_decode($reqjson, true);

$taskTitle = Sanitize::sanitizeInput($data['taskTitle']);
$taskDescription = Sanitize::sanitizeDescription($data['taskDescription']);
$substask1 = Sanitize::sanitizeInput($data['substask1']);
$substask2 = Sanitize::sanitizeInput($data['substask2']);
$substask3 = Sanitize::sanitizeInput($data['substask3']);
$boardId = $data['boardId'];
$taskStatus = Sanitize::sanitizeStatus($data['taskStatus']);

if(strlen($substask2) == 0 && strlen($substask3) == 0){
    $sub = array("$substask1");
} else if (strlen($substask3) == 0) {
    $sub = array("$substask1", "$substask2");
} else {
    $sub = array("$substask1", "$substask2", "$substask3");
}

// turn array into json format
$json = json_encode($sub);

$taskSuccessfulInsert = $insert->insertTask($boardId, $taskTitle, $taskDescription, $json, $taskStatus);

// echo $json;
// $insert->insertTask($boardId, $taskTitle, $taskDescription, $json, $taskStatus);

// if(!$taskSuccessfulInsert) {
//     echo "Error occurred";
// }



