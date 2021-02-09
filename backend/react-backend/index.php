<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

class DatabaseInteraction {

  private $db_cred;
  private $conn;

  function __construct() {
    $this->db_cred = parse_ini_file('config.ini', true);
  }

  function connect() {
    // To connect to your local DB, rename /react-backend/config.ini.bak to /react-backend/config.ini and edit
    // it with your details.
    $this->conn = new mysqli($this->db_cred['DatabaseCredentials']['serverName'],
        $this->db_cred['DatabaseCredentials']['username'],
        $this->db_cred['DatabaseCredentials']['password'],
        $this->db_cred['DatabaseCredentials']['databaseName']);
    if ($this->conn->connect_errno) {
      die("-[ConnectionError] Failed to connect to MySQL: ".$this->conn->connect_error);
    }
  }
  /*
   *  
   *
   * */
  function prepared_stmt($query, $result, $var_types, ...$bind_vars) {
    try {
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param($var_types, ...$bind_vars);
      $stmt->execute();
      if (!$result) {
        $stmt->close();
      }
      return $stmt;
    } catch (mysqli_sql_exception $e) {
      echo "-[SQLError] Query failed: (" . $this->conn->errno . ") " . $this->conn->error . "\n";
      throw $e;
    }
  }

  function add_user($username, $password) {
    $this->connect();
    $this->conn->autocommit(false);
    try {
      $this->prepared_stmt("INSERT INTO users VALUES (NULL, 'Fred', 'George', 'fred@livefeed.com', ?)", false, "s", "user");

      $id = $this->conn->insert_id;
      if (!($hash = password_hash($password, PASSWORD_DEFAULT))) {
        echo "-Error generating the password hash. \n";
        $this->conn->rollback();
        $this->conn->close();
        return false;
      }

      $this->prepared_stmt("INSERT INTO login VALUES (?, ?, ?)", false, "iss", $id, $username, $hash);
      echo "Successfully inserted user.\n";
      $this->conn->autocommit(true);
      return true;
    } catch (mysqli_sql_exception $e) {
      $this->conn->rollback();
      return false;
    } finally {
      $this->conn->close();
    }
  }

  function login($username, $password) {
    $this->connect();
    if (($stmt = $this->prepared_stmt("SELECT * FROM login WHERE Username=? LIMIT 1", true, "s", $username)) == null) {
      $this->conn->close();
      return false;
    }
    if (!($res = $stmt->get_result())){
      $this->conn->close();
      return false;
    }
    $row = $res->fetch_assoc();
    $stmt->close();
    $this->conn->close();

    if ($row && password_verify($password, $row['PasswordHash']))
      return $row['UserID'];
    else
      return -1;
  }

}

<<<<<<< HEAD
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

=======

$database = new DatabaseInteraction();

function signup() {
  global $database;

  $db_username = $_POST['username'];
  $db_password = $_POST['password'];
  $database->add_user($db_username, $db_password);
}

// Basic tests
// Need to replace with PHPUnit unit tests
echo "Create User: \n";
echo ''.$database->add_user("adrian", "ABCDE") . "\n";
echo ''.$database->add_user("adrian1", "ABCDE") . "\n";
echo ''.$database->add_user("al2", "IDWEDRP(*&89") . "\n";
echo "Login: \n";
echo 'adrian, ABCDE, '.$database->login("adrian", "ABCDE") . "\n";
echo 'adriann, ABCDE, '.$database->login("adriann", "ABCDE") . "\n";
echo 'adrian, IDWEDRP(*&89, '.$database->login("adrian", "IDWEDRP(*&89") . "\n";
echo 'adriann, IDWEDRP(*&89, '.$database->login("adriann", "IDWEDRP(*&89") . "\n";
>>>>>>> 16954139ede1d7459ce9c664d45fe0eaf307a3db

?> 



