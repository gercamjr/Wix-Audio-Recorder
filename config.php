<?php
$host = 'gator3240.hostgator.com';
$user = 'legacder_dev';
$password = '55841921';
$port = '3306';
$dbname = 'legacder_gerardotest';

$con = mysqli_connect($host, $user, $password, $dbname);

if (!$con) {
    die('Connection failed: ' . mysqli_connect_error());
}