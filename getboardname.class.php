<?php

include './config/dbh.php';

$query = $con->prepare('SELECT * FROM board');

$query->execute();

$result = $query->fetchAll();

// $result = $query->fetch(PDO::FETCH_ASSOC);

// echo $result['boardName'];

echo json_encode($result);



