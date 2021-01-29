<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

$serverName = "localhost";
$username = "root";
$password = "";
$databaseName = "db-data";
$conn = mysqli_connect($serverName, $username, $password, $databaseName);

$db_username = $_POST['username'];
$db_password = $_POST['password'];

$query = "INSERT INTO users (username, password) VALUES('$db_username', '$db_password')";

$result = mysqli_query($conn, $query);
if ( false===$result ) {
  printf("error: %s\n", mysqli_error($conn));
}
else {
  echo 'done.';
}

?> 



