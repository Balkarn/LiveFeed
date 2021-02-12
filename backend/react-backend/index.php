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
   * Function to abstract the creation and execution of a prepared statement. Used for executing queries which include
   * values derived from user input.
   *
   * @param query A string of the sql query to be executed
   * @param result A boolean value to describe whether the query is expected to return a result: false means no result
   * is expected and the function should execute stmt->close; true means the function should not close the stmt, so the
   * user should close it manually after calling the function and manipulating the results
   * @param var_types A string with letters for the variable types of each value in bind_vars e.g. "iss". (i:integer,
   * d:double, s:string, b:blob)
   * @param bind_vars The values to replace the '?' placeholders in the query
   *
   * @return Returns the created mysqli_stmt object
   * */
	function prepared_stmt(&$reqResult, $query, $result, $var_types, ...$bind_vars) {
		try {
			$stmt = $this->conn->prepare($query);
			$stmt->bind_param($var_types, ...$bind_vars);
			$stmt->execute();
			if (!$result) {
				$stmt->close();
			}
			return $stmt;
		} catch (mysqli_sql_exception $e) {
			$reqResult['error'] = "-[SQLError] Query failed: (" . $this->conn->errno . ") " . $this->conn->error . "\n";
			throw $e;
		}
	}

  function add_user(&$reqResult, $username, $password, $fname, $lname, $email, $role) {
		$this->connect();
		$this->conn->autocommit(false);
		try {
		  $this->prepared_stmt($reqResult, "INSERT INTO users VALUES (NULL, ?, ?, ?, ?)", false, "ssss", $fname, $lname, $email, $role);

		  $id = $this->conn->insert_id;
		  if (!($hash = password_hash($password, PASSWORD_DEFAULT))) {
			  $reqResult['error'] = "-Error generating the password hash. \n";
			$this->conn->rollback();
			$this->conn->close();
			return false;
		  }

		  $this->prepared_stmt($reqResult, "INSERT INTO login VALUES (?, ?, ?)", false, "iss", $id, $username, $hash);
		  $this->conn->autocommit(true);
		  return true;
		} catch (mysqli_sql_exception $e) {
		  $this->conn->rollback();
		  return false;
		} finally {
		  $this->conn->close();
		}
  }

  function login(&$reqResult, $username, $password) {
		$this->connect();
		if (($stmt = $this->prepared_stmt($reqResult, "SELECT * FROM login WHERE Username=? LIMIT 1", true, "s", $username)) == null) {
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
		  return false;
  }

  function add_template(&$reqResult, $templateName, $templateCreator, $questionsArray) {
	  $this->connect();
	  $this->conn->autocommit(false);
	  try {
	  	// $questionsArray = [[question, questionType, options1..4, ratingmin..max], [...]]
		  $this->prepared_stmt($reqResult, "INSERT INTO templates VALUES (NULL, ?, ?)", false, "si", $templateName, $templateCreator);

		  $templateId = $this->conn->insert_id;

		  $simpleQArray = array();
		  $simpleQCounter = 0;
		  $multipleArray = array();
		  $multipleCounter = 0;
		  $ratingArray = array();
		  $ratingCounter = 0;
		  for ($i=0; $i<count($questionsArray); $i++) {
		  	if (($questionsArray[$i][1] == 'open' || $questionsArray[$i][1] == 'mood') && count($questionsArray[$i]) == 2) {
				  $simpleQArray[] = $templateId;
				  $simpleQArray[] = $questionsArray[$i][0];
				  $simpleQArray[] = $questionsArray[$i][1];
				  $simpleQCounter ++;
			  } elseif ($questionsArray[$i][1] == 'multiple' && count($questionsArray[$i]) == 6) {
		  		$multipleArray[$multipleCounter] = array();
				  $multipleArray[$multipleCounter][] = $questionsArray[$i][0]; //Question
				  $multipleArray[$multipleCounter][] = $questionsArray[$i][1]; //Question Type
				  $multipleArray[$multipleCounter][] = $questionsArray[$i][2]; //Op1
				  $multipleArray[$multipleCounter][] = $questionsArray[$i][3]; //Op2
				  $multipleArray[$multipleCounter][] = $questionsArray[$i][4]; //Op3
				  $multipleArray[$multipleCounter][] = $questionsArray[$i][5]; //Op4
				  $multipleCounter ++;
			  } elseif ($questionsArray[$i][1] == 'rating' && count($questionsArray[$i]) == 4) {
		  		$ratingArray[$ratingCounter] = array();
				  $ratingArray[$ratingCounter][] = $questionsArray[$i][0]; //Question
				  $ratingArray[$ratingCounter][] = $questionsArray[$i][1]; //Question Type
				  $ratingArray[$ratingCounter][] = $questionsArray[$i][2]; //Min
				  $ratingArray[$ratingCounter][] = $questionsArray[$i][3]; //Max
				  $ratingCounter ++;
			  }
		  }

		  if ($simpleQCounter >= 1) {
			  $inserts = str_repeat("(NULL, ?, ?, ?), ", $simpleQCounter-1);
			  $inserts .= "(NULL, ?, ?, ?)";
			  $insertsTypes = str_repeat("iss", $simpleQCounter);
			  $this->prepared_stmt($reqResult, "INSERT INTO template_questions VALUES ".$inserts, false, $insertsTypes, ...$simpleQArray);
		  }

		  foreach($multipleArray as $item) {
			  $this->prepared_stmt($reqResult, "INSERT INTO template_questions VALUES (NULL, ?, ?, ?)", false, "iss", $templateId, $item[0], $item[1]);
			  $questionId = $this->conn->insert_id;
			  $this->prepared_stmt($reqResult, "INSERT INTO question_options VALUES (?, ?, ?, ?, ?)", false, "issss", $questionId, ...array_slice($item, 2, 4));
		  }

		  foreach($ratingArray as $item) {
			  $this->prepared_stmt($reqResult, "INSERT INTO template_questions VALUES (NULL, ?, ?, ?)", false, "iss", $templateId, $item[0], $item[1]);
			  $questionId = $this->conn->insert_id;
			  $this->prepared_stmt($reqResult, "INSERT INTO question_ratings VALUES (?, ?, ?)", false, "iii", $questionId, ...array_slice($item, 2, 2));
		  }

		  $this->conn->autocommit(true);
		  return true;
	  } catch (mysqli_sql_exception $e) {
		  $this->conn->rollback();
		  return false;
	  } finally {
		  $this->conn->close();
	  }

  }

}
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Origin, Content-Type, POST');
header('Content-Type: application/json, multipart/form-data');


$database = new DatabaseInteraction();
/*
ob_start();
var_dump($_POST);
error_log(ob_get_clean(), 4);
*/
$reqResult = array();
if (!isset($_POST['function'])) { $reqResult['error'] = "No function name."; }
if (!isset($_POST['arguments'])) { $reqResult['error'] = "No function arguments."; }
if (!isset($_POST['error'])) {
	$reqResult['error'] = '';
	switch($_POST['function']) {
		case 'login':
			if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 2) {
				$reqResult['error'] = "Invalid arguments used.";
			} else { # argument format: username, password
				$reqResult['result'] = $database->login($reqResult, ...$_POST['arguments']);
			}
			break;
		case 'signup':
			if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 6) {
				$reqResult['error'] = "Invalid arguments used.";
			} else { # argument format: username, password, fname, lname, email, role
				$reqResult['result'] = $database->add_user($reqResult, ...$_POST['arguments']);
			}
			break;
		case 'addtemplate':
			if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 3) {
				$reqResult['error'] = "Invalid arguments used.";
			} else { # argument format: templateName, templateCreatorId, [[question, questionType, options1..4, ratingmin..max], [...]]
				$reqResult['result'] = $database->add_template($reqResult, ...$_POST['arguments']);
			}
			break;
		default:
			$reqResult['error'] = 'Function named: '.$_POST['function'].' was not found.';
			break;
	}
}

echo json_encode($reqResult);

// Basic tests
// Need to replace with PHPUnit unit tests
/*
echo "Create User: \n";
echo ''.$database->add_user("adrian2", "ABCDE", "a", "b", "c", "user") . "\n";
echo "Login: \n";
echo 'adrian, ABCDE, '.$database->login("adrian", "ABCDE") . "\n";
echo 'adriann, ABCDE, '.$database->login("adriann", "ABCDE") . "\n";
echo 'adrian, IDWEDRP(*&89, '.$database->login("adrian", "IDWEDRP(*&89") . "\n";
echo 'adriann, IDWEDRP(*&89, '.$database->login("adriann", "IDWEDRP(*&89") . "\n";

$reqResult = array();
$questions = array(
		array("Q1", "multiple", "A", "B", "C", "D"),
		array("Q2", "open"),
		array("Q3", "open"),
		array("Q4", "rating", 1, 9),
);
$database->add_template($reqResult, "ABC", 1, $questions);
var_dump($reqResult)
*/

?>



