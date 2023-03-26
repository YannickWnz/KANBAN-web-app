<?php
include '../config/dbh.php';
include '../classes/sanitize.class.php';
include '../classes/Account.class.php';

$insert = new Account($con);

// get data from js file
$jsonReqUrl = "php://input";
$reqjson = file_get_contents($jsonReqUrl);
$data = json_decode($reqjson, true);

$taskTitle = Sanitize::sanitizeInput($data['edit_task_title']);
$taskDescription = Sanitize::sanitizeDescription($data['edit_task_description']);
$substask1 = Sanitize::sanitizeInput($data['edit_task_subtask1']);
$substask2 = Sanitize::sanitizeInput($data['edit_task_subtask2']);
$substask3 = Sanitize::sanitizeInput($data['edit_task_subtask3']);
$taskID = Sanitize::sanitizeId($data['selected_task_id']);
$taskStatus = Sanitize::sanitizeStatus($data['edit_task_status']);


if(strlen($substask2) == 0 && strlen($substask3) == 0){
    $sub = array("$substask1");
    $completedSub = array("false");
} else if (strlen($substask3) == 0) {
    $sub = array("$substask1", "$substask2");
    $completedSub = array("false", "false");
} else {
    $sub = array("$substask1", "$substask2", "$substask3");
    $completedSub = array("false", "false", "false");
}


// turn array into json format
$subtasks = json_encode($sub);
$completeSubtask = json_encode($completedSub);

$insert->updateTaskData($taskID, $taskTitle, $taskDescription, $subtasks, $completeSubtask, $taskStatus);


