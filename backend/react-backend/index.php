<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// To connect to your local DB, rename /react-backend/config.ini.bak to /react-backend/config.ini and edit
// it with your details.
$db_cred = parse_ini_file('config.ini', true);
$conn = mysqli_connect($db_cred['DatabaseCredentials']['serverName'], $db_cred['DatabaseCredentials']['username'], $db_cred['DatabaseCredentials']['password'], $db_cred['DatabaseCredentials']['databaseName']);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$db_username = $_POST['username'];
$db_password = $_POST['password'];

$stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
$stmt->bind_param("ss", $db_username, $db_password);
if ($stmt->execute())
  echo 'done.';
else
  echo "Error: ". mysqli_error($conn);
$stmt->close();

$conn->close();

?> 



