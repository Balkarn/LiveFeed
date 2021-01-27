<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

$serverName = "localhost";
$username = "root";
$password = "";
$databaseName = "php_react";
$conn = mysqli_connect($serverName, $username, $password, $databaseName);

$recText = $_POST['text'];

$query = "INSERT INTO messages (message) VALUES('$recText')";

$result = mysqli_query($conn, $query);
if ( false===$result ) {
  printf("error: %s\n", mysqli_error($conn));
}
else {
  echo 'done.';
}

?> 



