<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

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

  function add_user($username, $password) {
    $this->connect();
    // INSERT INTO users (FirstName, LastName, Email, Role) VALUES ("Fred", "George", "fred@livefeed.com", "attendee");
    // INSERT INTO login VALUES (?, ?, ?)
    $stmt = $this->conn->prepare("INSERT INTO users (FirstName, LastName, Email, Role) VALUES ('Fred', 'George', 'fred@livefeed.com', 'attendee')");
    if (!$stmt->execute())
      die("-[DatabaseError]: ". mysqli_error($this->conn));
    $stmt->close();

    $id = $this->conn->insert_id;
    $hash = password_hash($password, 'PASSWORD_DEFAULT');

    $stmt = $this->conn->prepare("INSERT INTO users VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $id, $username, $hash);
    if ($stmt->execute())
      echo 'Successfully inserted user.';
    else
      echo "-[DatabaseError]: ". mysqli_error($this->conn);
    $stmt->close();

    $this->conn->close();
  }
}


$database = new DatabaseInteraction();

function signup() {
  global $database;

  $db_username = $_POST['username'];
  $db_password = $_POST['password'];
  $database->add_user($db_username, $db_password);
}


?> 



