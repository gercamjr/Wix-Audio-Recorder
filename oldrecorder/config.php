<?php
$host = 'gator3240.hostgator.com';
$user = 'legacder_vaultof';
$password = '0H]y)OxrB4RL';
$port = '3306';
$dbname = 'legacder_vaultofus';

$con = mysqli_connect($host, $user, $password, $dbname);

if (!$con) {
    die('Connection failed: ' . mysqli_connect_error());
}