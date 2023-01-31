<?php
ob_start();
session_start();

// date_default_timezone_set();

date_default_timezone_set("Africa/Accra");
// echo date_default_timezone_get();

try {
    $con = new PDO('mysql:dbname=kanban-web-app;host=localhost', "root", "");
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
} catch (PDOException $e) {
    exit('Connection failed: ' . $e->getMessage());
}
