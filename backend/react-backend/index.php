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

	function check_meeting_templates(&$reqResult, $userId, $templates) {
		$this->connect();
		if (count($templates) >= 1) {
			$placeholders = str_repeat("?, ", count($templates)-1);
			$placeholders .= "?";
			$placeholders = "(".$placeholders.")";
		}
		$varTypes = "i".str_repeat("i", count($templates));
		if (!($stmt = $this->prepared_stmt($reqResult,
						"SELECT COUNT(*) FROM templates WHERE templatecreator=? AND templateid IN ".$placeholders, true,
						$varTypes, $userId, ...$templates))) {
			$this->conn->close();
			return false;
		}
		if (!($res = $stmt->get_result())) {
			$this->conn->close();
			return false;
		}
		$row = $res->fetch_assoc();
		$stmt->close();
		$this->conn->close();
		if ($row["COUNT(*)"] === count($templates)) {
			return true;
		} else {
			return false;
		}
	}

  function add_template(&$reqResult, $templateName, $templateCreator, $questionsArray) {
	  $this->connect();
	  $this->conn->autocommit(false);
	  try {
	  	// $questionsArray = [[question, questionType, options1..4, ratingmin..max], [...]]
		  $this->prepared_stmt($reqResult, "INSERT INTO templates VALUES (NULL, ?, ?)", false, "si", $templateName, $templateCreator);

		  $templateId = $this->conn->insert_id;

		  $simpleQArray = array();
		  $multipleArray = array();
		  $ratingArray = array();
		  for ($i=0; $i<count($questionsArray); $i++) {
		  	if (($questionsArray[$i][1] == 'open' || $questionsArray[$i][1] == 'mood') && count($questionsArray[$i]) == 2) {
				  $simpleQArray[] = $templateId;
				  $simpleQArray[] = $questionsArray[$i][0];
				  $simpleQArray[] = $questionsArray[$i][1];
			  } elseif ($questionsArray[$i][1] == 'multiple' && count($questionsArray[$i]) == 6) {
		  		$multipleArray[] = $i;
			  } elseif ($questionsArray[$i][1] == 'rating' && count($questionsArray[$i]) == 4) {
		  		$ratingArray[] = $i;
			  }
		  }

		  if (count($simpleQArray) >= 1) {
		  	$arraySize = count($simpleQArray) / 3;
			  $inserts = str_repeat("(NULL, ?, ?, ?), ", $arraySize-1);
			  $inserts .= "(NULL, ?, ?, ?)";
			  $insertsTypes = str_repeat("iss", $arraySize);
			  $this->prepared_stmt($reqResult, "INSERT INTO template_questions VALUES ".$inserts, false, $insertsTypes, ...$simpleQArray);
		  }

		  foreach($multipleArray as $itemIdx) {
		  	$item = $questionsArray[$itemIdx];
			  $this->prepared_stmt($reqResult, "INSERT INTO template_questions VALUES (NULL, ?, ?, ?)", false, "iss", $templateId, $item[0], $item[1]);
			  $questionId = $this->conn->insert_id;
			  $this->prepared_stmt($reqResult, "INSERT INTO question_options VALUES (?, ?, ?, ?, ?)", false, "issss", $questionId, ...array_slice($item, 2, 4));
		  }

		  foreach($ratingArray as $itemIdx) {
			  $item = $questionsArray[$itemIdx];
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

  function get_user_templates(&$reqResult, $userId) {
		$this->connect();
		$query = "SELECT TemplateID, TemplateName, QuestionID, Question, QuestionType, OptionA, OptionB, OptionC, OptionD, MinRating, MaxRating
	FROM `db-data`.templates
	INNER JOIN `db-data`.template_questions USING (TemplateID)
	LEFT JOIN `db-data`.question_options USING (QuestionID)
	LEFT JOIN `db-data`.question_ratings USING (QuestionID)
	WHERE TemplateCreator=?";
		if (($stmt = $this->prepared_stmt($reqResult, $query, true, "s", $userId)) == null) {
			$this->conn->close();
			return false;
		}
		if (!($res = $stmt->get_result())) {
			$this->conn->close();
			return false;
		}
		$reqResult['result'] = array();
	    /* Response structure
			 * {
			 *  TemplateID:
			 *   {
			 *    TemplateName
			 *    {Question1}
			 *    {Question2}
	     *    {...}
			 *   }
			 * }
			 */
		while ($row=$res->fetch_assoc()) {
			if (!isset($reqResult['result'][$row['TemplateID']])) {
				$reqResult['result'][$row['TemplateID']] = array();
				$reqResult['result'][$row['TemplateID']][] = $row['TemplateName'];
			}
			switch ($row['QuestionType']) {
				case 'open':
				case 'mood':
					$reqResult['result'][$row['TemplateID']][] = array_slice($row, 2, 3);
					break;
				case 'multiple':
					$reqResult['result'][$row['TemplateID']][] = array_slice($row, 2, 7);
					break;
				case 'rating':
					$reqResult['result'][$row['TemplateID']][] = array_merge(array_slice($row, 2, 3), array_slice($row, 9, 2));
					break;
				default:
					break;
			}

		}

		$stmt->close();
		$this->conn->close();

		return true;
  }

  function generate_meeting_code($length) {
		$keyspace = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

		$codestr = "";
		for ($i=0; $i<$length; $i++) {
			$codeint = random_int(0, 61);
			$codestr .= $keyspace[$codeint];
		}
		return $codestr;
  }

  /*
   * @param meetingName
   * @param meetingStart A string of format "yyyy-mm-dd hh:mm:ss"
   * @param meetingEnd A string of format "yyyy-mm-dd hh:mm:ss"
   * @param templates A list of templateIds that are assigned to the meeting
   */
  function add_meeting(&$reqResult, $meetingName, $meetingStart, $userId, $templates) {
	  if (!$this->check_meeting_templates($reqResult, $userId, $templates)) {
		  return false;
	  }
  	$this->connect();
	  $this->conn->autocommit(false);
	  $code = $this->generate_meeting_code(7);
	  try {
		  $this->prepared_stmt($reqResult, "INSERT INTO meetings VALUES (NULL, ?, ?, ?, NULL, ?)", false,
				  "sssi", $meetingName, $code, $meetingStart, $userId);

			$id = $this->conn->insert_id;
			if (count($templates) >= 1) {
				$placeholders = str_repeat("(?,?), ", count($templates)-1);
				$placeholders .= "(?,?)";
			}
		  $varTypes = str_repeat("ii", count($templates));
			$vars = array();
			foreach ($templates as $t) {
				$vars[] = $t;
				$vars[] = $id;
		  }

			$code = $id.$code;

		  $this->prepared_stmt($reqResult, "UPDATE meetings SET meetingcode=? WHERE meetingid=?", false,
				  "si", $code, $id);

			$this->prepared_stmt($reqResult, "INSERT INTO meeting_templates VALUES ".$placeholders, false, $varTypes, ...$vars);

		  $this->conn->autocommit(true);
		  return true;
	  } catch (mysqli_sql_exception $e) {
		  $this->conn->rollback();
		  return false;
	  } finally {
		  $this->conn->close();
	  }
  }

  function validate_meeting_code(&$reqResult, $meetingCode) {
	  $this->connect();
	  if (($stmt = $this->prepared_stmt($reqResult, "SELECT * FROM meetings WHERE MeetingCode=? AND EndTime=NULL 
                         AND StartTime<=(now() + INTERVAL 10 MINUTE) LIMIT 1", true, "s", $meetingCode)) == null) {
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

	  return $row['StartTime'];

  }

  function add_general_feedback(&$reqResult, $userId, $meetingId, $feedback) {
	  $this->connect();
	  $this->conn->autocommit(false);
	  try {
		  $this->prepared_stmt($reqResult, "INSERT INTO feedback VALUES (NULL, ?, ?, now())", false,
				  "ii", $userId, $meetingId);
		  $id = $this->conn->insert_id;

		  $this->prepared_stmt($reqResult, "INSERT INTO general_feedback VALUES (?,?)", false, "is",
				  $id, $feedback);

		  $this->conn->autocommit(true);
		  return true;
	  } catch (mysqli_sql_exception $e) {
		  $this->conn->rollback();
		  return false;
	  } finally {
		  $this->conn->close();
	  }
  }

	function add_mood_feedback(&$reqResult, $userId, $meetingId, $feedback) {
		$this->connect();
		$this->conn->autocommit(false);
		try {
			$this->prepared_stmt($reqResult, "INSERT INTO feedback VALUES (NULL, ?, ?, CURRENT_TIMESTAMP)", false,
					"ii", $userId, $meetingId);
			$id = $this->conn->insert_id;

			$this->prepared_stmt($reqResult, "INSERT INTO mood_feedback VALUES (?,?)", false, "is",
					$id, $feedback);

			$this->conn->autocommit(true);
			return true;
		} catch (mysqli_sql_exception $e) {
			$this->conn->rollback();
			return false;
		} finally {
			$this->conn->close();
		}
	}

	function add_template_feedback(&$reqResult, $templateId, $questionId, $userId, $meetingId, $feedback) {
		$this->connect();
		$this->conn->autocommit(false);
		try {
			$this->prepared_stmt($reqResult, "INSERT INTO feedback VALUES (NULL, ?, ?, CURRENT_TIMESTAMP)", false,
					"ii", $userId, $meetingId);
			$id = $this->conn->insert_id;

			$this->prepared_stmt($reqResult, "INSERT INTO template_feedback VALUES (?,?,?,?)", false,
					"iiis", $id, $templateId, $questionId, $feedback);

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
/*
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
		case 'getusertemplates':
			if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 1) {
				$reqResult['error'] = "Invalid arguments used.";
			} else { # argument format: templateCreatorId
				$database->get_user_templates($reqResult, ...$_POST['arguments']);
			}
			break;
		case 'addmeeting':
			if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 5) {
				$reqResult['error'] = "Invalid arguments used.";
			} else { # argument format: meetingName, meetingStart, userId, [templateId1, Id2, ...]
				$database->add_meeting($reqResult, ...$_POST['arguments']);
			}
			break;
		case 'addgeneralfeedback':
			if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 3) {
				$reqResult['error'] = "Invalid arguments used.";
			} else { # argument format: userId, meetingId, feedback
				$database->add_general_feedback($reqResult, ...$_POST['arguments']);
			}
			break;
		case 'addmoodfeedback':
			if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 3) {
				$reqResult['error'] = "Invalid arguments used.";
			} else { # argument format: userId, meetingId, mood
				$database->add_mood_feedback($reqResult, ...$_POST['arguments']);
			}
			break;
		case 'addtemplatefeedback':
			if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 5) {
				$reqResult['error'] = "Invalid arguments used.";
			} else { # argument format: templateId, questionId, userId, meetingId, feedback
				$database->add_template_feedback($reqResult, ...$_POST['arguments']);
			}
			break;
		case 'validatemeetingcode':
			if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 1) {
				$reqResult['error'] = "Invalid arguments used.";
			} else { # argument format: meetingcode
				$database->validate_meeting_code($reqResult, ...$_POST['arguments']);
			}
			break;
		default:
			$reqResult['error'] = 'Function named: '.$_POST['function'].' was not found.';
			break;
	}
}


echo json_encode($reqResult);
*/

// Basic tests
// Need to replace with PHPUnit unit tests
$reqResult = array();
$users = array(
		array('test', 'testpwd', 'test1', 'test', 'test@test.com', 'user'), //1
		array('testadmin', 'testpwd', 'test2', 'test', 'test@test.com', 'host'), //2
		array('test2', 'testpwd', 'test3', 'test', 'test@test.com', 'user'), //3
		array('test3', 'testpwd', 'test4', 'test', 'test@test.com', 'user'), //4
		array('testadmin2', 'testpwd', 'test5', 'test', 'test@test.com', 'host'), //5
);
foreach ($users as $user) {
	$database->add_user($reqResult, ...$user);
}
echo "Add users: \n";
var_dump($reqResult);

$templates = array(
		array('Template 1', 2,
				array(
						array("Q1", "multiple", "A", "B", "C", "D"),
						array("What do you think about the company?", "open"),
						array("What do you think about this workshop? ", "open"),
						array("Q4", "rating", 1, 9),
						array("Q5", "mood")
				)
		),
		array('Template 2', 2,
				array(
						array("i", "multiple", "A", "B", "C", "D"),
						array("ii", "open"),
						array("iii", "open"),
						array("iv", "rating", 1, 9),
						array("v", "mood")
				)
		),
		array('Template Uno', 5,
				array(
						array("alpha", "multiple", "A", "B", "C", "D"),
						array("bravo", "open"),
						array("charlie", "open"),
						array("delta", "rating", 1, 9),
						array("echo", "mood")
				)
		)
);
foreach ($templates as $template) {
	$database->add_template($reqResult, ...$template);
}
echo "\nAdd templates: \n";
var_dump($reqResult);

$meetings = array(
		array("Test Meeting 1", "2021-02-19 10:10:10", "2", array(1,2)),
		array("Test Meeting 2", "2021-02-19 10:10:10", "2", array(3))
);
foreach ($meetings as $meeting) {
	$database->add_meeting($reqResult, ...$meeting);
}
echo "\nAdd meetings: \n";
var_dump($reqResult);

$general_feedback = array(
		array(1, 1, "This workshop is terrible."),
		array(3, 1, "This talk is interesting."),
		array(4, 1, "This guy is killing it!"),
		array(1, 1, "This company is bad ass."),
		array(3, 1, "Please speed up. "),
		array(4, 1, "Zzzzz."),
		array(1, 1, "What are you doing!"),
		array(3, 1, "Cool cool."),
		array(4, 1, "Can you skip the safety briefing."),
);
foreach ($general_feedback as $feedback) {
	$database->add_general_feedback($reqResult, ...$feedback);
}
echo "\nAdd general feedback: \n";
var_dump($reqResult);

$template_feedback = array(
		array(1, 1, 1, 1, "This doesn't seem like a good organisation. "),
		array(1, 2, 1, 1, "This was a very challenging workshop. "),
		array(1, 3, 1, 1, "happy"),
		array(1, 4, 1, 1, "A"),
		array(1, 5, 1, 1, "1"),

		array(1, 1, 3, 1, "I think I would like to work here someday. "),
		array(1, 2, 3, 1, "I enjoyed the challenge. "),
		array(1, 3, 3, 1, "neutral"),
		array(1, 4, 3, 1, "A"),
		array(1, 5, 3, 1, "3"),

		array(1, 1, 4, 1, "It's decent. "),
		array(1, 2, 4, 1, "It was too difficult. "),
		array(1, 4, 4, 1, "C"),
		array(1, 5, 4, 1, "7")
);
foreach ($template_feedback as $feedback) {
	$database->add_template_feedback($reqResult, ...$feedback);
}
echo "\nAdd template feedback: \n";
var_dump($reqResult);

?>



