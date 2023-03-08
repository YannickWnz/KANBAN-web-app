<?php
include '../config/dbh.php';
include '../classes/sanitize.class.php';
include '../classes/Account.class.php';

$insert = new Account($con);

// get data from js file
$jsonReqUrl = "php://input";
$reqjson = file_get_contents($jsonReqUrl);
$data = json_decode($reqjson, true);

// echo trim(json_encode($data['myarr'])) . ' ' . Sanitize::sanitizeId($data['taskID']);
$completedSubtasks = trim(json_encode($data['myarr']));
$taskID = Sanitize::sanitizeId($data['taskID']);

$updateSuccess = $insert->updateCompletedSubtasks($taskID, $completedSubtasks);
if($updateSuccess) {
    echo "Subtasks updated successfully";
}



// echo Sanitize::sanitizeArrayInput(json_encode($data['myarr'])) . ' ' . Sanitize::sanitizeId($data['taskID']);



// $newCompletedSubArray = array('false', 'false', 'false');
// $newCompletedSubArray[$index] = 'true';

// echo $newCompletedSubArray[$index];





// echo $insert->fetchTasksDataUsingBoardID($boardId);



