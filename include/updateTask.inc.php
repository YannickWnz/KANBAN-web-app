<?php
include '../config/dbh.php';
include '../classes/sanitize.class.php';
include '../classes/Account.class.php';

$insert = new Account($con);

// get data from js file
$jsonReqUrl = "php://input";
$reqjson = file_get_contents($jsonReqUrl);
$data = json_decode($reqjson, true);

$completedSubtasks = trim(json_encode($data['myarr']));
$taskID = Sanitize::sanitizeId($data['taskID']);

$updateSuccess = $insert->updateCompletedSubtasks($taskID, $completedSubtasks);



