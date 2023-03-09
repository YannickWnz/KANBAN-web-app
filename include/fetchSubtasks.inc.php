<?php
include '../config/dbh.php';
include '../classes/sanitize.class.php';
include '../classes/Account.class.php';

$insert = new Account($con);

if(isset($_GET['taskID'])) {
    $taskID = Sanitize::sanitizeId($_GET['taskID']);
}

echo $insert->fetchSubtask($taskID);



