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

?>