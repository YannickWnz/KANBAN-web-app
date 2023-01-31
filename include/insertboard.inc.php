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
$boardName = $data['boardName'];

// sanitize data sent from js file
$boardName = Sanitize::sanitizeInput($boardName);

// generate board unique identifier
$boardUniqID = uniqid();

// echo $boardName;

// send board name to account class file
$insert->insertBoard($boardName, $boardUniqID);




