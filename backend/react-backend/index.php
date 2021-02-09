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

switch ($_POST['action']) {

  case 'SIGN-UP':
    userSignUp($conn);
    break;
  
  case 'LOGIN':
    userLogin($conn);
    break;

  default:
    break;

}

// Add new user to database
function userSignUp($conn){

  $db_username = $_POST['username'];
  $db_password = $_POST['password'];

  $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
  $stmt->bind_param("ss", $db_username, $db_password);
  if ($stmt->execute())
    echo 'Sign Up Successful!';
  else
    echo "Error: ". mysqli_error($conn);
  $stmt->close();

  $conn->close();

}

// Validate user credentials and grant them permission to login
function userLogin($conn){

  $db_username = $_POST['username'];
  $db_password = $_POST['password'];

  $sql = "SELECT id FROM users WHERE username = '$db_username' and password = '$db_password'";
  $result = mysqli_query($conn,$sql);
  $row = mysqli_fetch_array($result,MYSQLI_ASSOC);

  $count = mysqli_num_rows($result);

  if($count == 1) {

    $data = "LOGIN_SUCCESS";
    echo $data;

  }else {

    $error = "LOGIN_FAIL";
    echo $error;

  }

}


?> 



