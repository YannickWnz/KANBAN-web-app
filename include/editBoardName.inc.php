<?php
include '../config/dbh.php';
include '../classes/sanitize.class.php';
include '../classes/Account.class.php';

$insert = new Account($con);

// get data from js file
$jsonReqUrl = "php://input";
$reqjson = file_get_contents($jsonReqUrl);
$data = json_decode($reqjson, true);

$newBoardName = Sanitize::sanitizeInput($data['newBoardName']);
$boardID = Sanitize::sanitizeId($data['currentBoardID']);


$insert->editBoardName($boardID, $newBoardName);


