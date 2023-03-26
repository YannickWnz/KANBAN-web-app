<?php
include './config/dbh.php';
include './classes/sanitize.class.php';

$userID = Sanitize::sanitizeId($_SESSION['userID']);

$query = $con->prepare('SELECT COUNT(boardName) AS boardNo FROM board WHERE userID = :id');
$query->bindValue(':id', $userID);
$query->execute();
$result = $query->fetchAll();
echo json_encode($result);



