<?php
include '../config/dbh.php';
include '../classes/sanitize.class.php';
include '../classes/Account.class.php';

$insert = new Account($con);

if(isset($_GET['bid'])) {
    $boardId = Sanitize::sanitizeId($_GET['bid']);
    // $boardId = $_GET['bid'];
}

echo $insert->fetchTodoTasks($boardId);

// echo $boardID;


