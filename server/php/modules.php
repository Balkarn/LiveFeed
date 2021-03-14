<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

class DatabaseInteraction {
	private $db_cred;
	public $conn;

	function __construct() {
		$this->db_cred = parse_ini_file('../config.ini', true);
		$this->reqResult = array();
	}

	function connect() {
		// To connect to your local DB, rename /react-backend/config.ini.bak to /react-backend/config.ini and edit
		// it with your details.
		$this->conn = new mysqli($this->db_cred['DatabaseCredentials']['host'],
				$this->db_cred['DatabaseCredentials']['username'],
				$this->db_cred['DatabaseCredentials']['password'],
				$this->db_cred['DatabaseCredentials']['database']);
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
	 * @param throw_error A boolean value to dictate whether the function should re-throw the error to be handled in the
	 * calling method or not
	 * user should close it manually after calling the function and manipulating the results
	 * @param var_types A string with letters for the variable types of each value in bind_vars e.g. "iss". (i:integer,
	 * d:double, s:string, b:blob)
	 * @param bind_vars The values to replace the '?' placeholders in the query
	 *
	 * @return Returns the created mysqli_stmt object
	 * */
	function prepared_stmt($query, $result, $throw_error, $var_types, ...$bind_vars) {
		try {
			$stmt = $this->conn->prepare($query);
			$stmt->bind_param($var_types, ...$bind_vars);
			$stmt->execute();
			if (!$result) {
				$stmt->close();
			}
			return $stmt;
		} catch (mysqli_sql_exception $e) {
			$this->reqResult['error'] = "-[SQLError] Query failed: (" . $this->conn->errno . ") " . $this->conn->error . "\n";
			if ($throw_error) {
				throw $e;
			} else {
				return null;
			}
		}
	}

	/*
	 * Function to abstract the execution of a standard query with no user input.
	 * @param query A string of the sql query to be executed
	 * @param result A boolean value to describe whether the query is expected to return a result: false means no result
	 * is expected and the function should execute stmt->close; true means the function should not close the stmt, so the
	 * @param throw_error A boolean value to dictate whether the function should re-throw the error to be handled in the
	 * calling method or not
	 *
	 * @return Returns the created mysqli_stmt object
	 */
	function non_prepared_stmt($query, $result, $throw_error) {
		try {
			$stmt = $this->conn->query($query);
			if (!$result) {
				$stmt->close();
			}
			return $stmt;
		} catch (mysqli_sql_exception $e) {
			$this->reqResult['error'] = "-[SQLError] Query failed: (" . $this->conn->errno . ") " . $this->conn->error . "\n";
			if ($throw_error) {
				throw $e;
			} else {
				return null;
			}
		}
	}

	function check_username() {

	}

	function add_user($username, $password, $fname, $lname, $email, $role) {
		$this->connect();
		$this->conn->autocommit(false);
		try {
			$this->prepared_stmt("INSERT INTO users VALUES (NULL, ?, ?, ?, ?)", false, true, "ssss", $fname, $lname, $email, $role);

			$id = $this->conn->insert_id;
			if (!($hash = password_hash($password, PASSWORD_DEFAULT))) {
				$this->reqResult['error'] = "-Error generating the password hash. \n";
				$this->conn->rollback();
				$this->conn->close();
				return false;
			}

			$this->prepared_stmt("INSERT INTO login VALUES (?, ?, ?)", false, true, "iss", $id, $username, $hash);
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
		if (($stmt = $this->prepared_stmt("SELECT * FROM login WHERE Username=? LIMIT 1", true, false, "s", $username)) == null) {
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


	function get_meeting ($meetingCode) {
		$this->connect();
		$query = "SELECT * FROM meetings WHERE MeetingID=?";
		if (!($stmt = $this->prepared_stmt($query, true, false,"i", $meetingCode))) {
			$this->conn->close();
			return false;
		}
		if (!($res = $stmt->get_result())) {
			$this->conn->close();
			return false;
		}
		$row = $res->fetch_assoc();
		$this->reqResult['result'] = $row;

		$stmt->close();
		$this->conn->close();

		return true;
	}

	function check_meeting_templates($userId, $templates) {
		if (count($templates) == 0) {
			return true;
		}
		$this->connect();
		$placeholders = str_repeat("?, ", count($templates)-1);
		$placeholders .= "?";
		$placeholders = "(".$placeholders.")";
		$varTypes = "i".str_repeat("i", count($templates));
		if (!($stmt = $this->prepared_stmt(
				"SELECT COUNT(*) FROM templates WHERE templatecreator=? AND templateid IN ".$placeholders, true, false,
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

	function add_template($templateName, $templateCreator, $questionsArray) {
		$this->connect();
		$this->conn->autocommit(false);
		try {
			// $questionsArray = [[question, questionType, options1..4, ratingmin..max], [...]]
			$this->prepared_stmt("INSERT INTO templates VALUES (NULL, ?, ?)", false, true, "si", $templateName, $templateCreator);

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
				$this->prepared_stmt("INSERT INTO template_questions VALUES ".$inserts, false, true, $insertsTypes, ...$simpleQArray);
			}

			foreach($multipleArray as $itemIdx) {
				$item = $questionsArray[$itemIdx];
				$this->prepared_stmt("INSERT INTO template_questions VALUES (NULL, ?, ?, ?)", false, true, "iss", $templateId, $item[0], $item[1]);
				$questionId = $this->conn->insert_id;
				$this->prepared_stmt("INSERT INTO question_options VALUES (?, ?, ?, ?, ?)", false, true, "issss", $questionId, ...array_slice($item, 2, 4));
			}

			foreach($ratingArray as $itemIdx) {
				$item = $questionsArray[$itemIdx];
				$this->prepared_stmt("INSERT INTO template_questions VALUES (NULL, ?, ?, ?)", false, true, "iss", $templateId, $item[0], $item[1]);
				$questionId = $this->conn->insert_id;
				$this->prepared_stmt("INSERT INTO question_ratings VALUES (?, ?, ?)", false, true, "iii", $questionId, ...array_slice($item, 2, 2));
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

	function get_user_templates($userId) {
		$this->connect();
		$query = "SELECT TemplateID, TemplateName, QuestionID, Question, QuestionType, OptionA, OptionB, OptionC, OptionD, MinRating, MaxRating
			FROM `db-data`.templates
			INNER JOIN `db-data`.template_questions USING (TemplateID)
			LEFT JOIN `db-data`.question_options USING (QuestionID)
			LEFT JOIN `db-data`.question_ratings USING (QuestionID)
			WHERE TemplateCreator=?";
		if (!($stmt = $this->prepared_stmt($query, true, false,"i", $userId))) {
			$this->conn->close();
			return false;
		}
		if (!($res = $stmt->get_result())) {
			$this->conn->close();
			return false;
		}
		$this->reqResult['result'] = array();
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
			if (!isset($this->reqResult['result'][$row['TemplateID']])) {
				$this->reqResult['result'][$row['TemplateID']] = array();
				$this->reqResult['result'][$row['TemplateID']][] = $row['TemplateName'];
			}
			switch ($row['QuestionType']) {
				case 'open':
				case 'mood':
					$this->reqResult['result'][$row['TemplateID']][] = array_slice($row, 2, 3);
					break;
				case 'multiple':
					$this->reqResult['result'][$row['TemplateID']][] = array_slice($row, 2, 7);
					break;
				case 'rating':
					$this->reqResult['result'][$row['TemplateID']][] = array_merge(array_slice($row, 2, 3), array_slice($row, 9, 2));
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
	function add_meeting($meetingName, $meetingStart, $userId, $templates) {
		if (!$this->check_meeting_templates($userId, $templates)) {
			return false;
		}
		$this->connect();
		$this->conn->autocommit(false);
		$code = $this->generate_meeting_code(7);
		try {
			if ($meetingStart == "") {
				$this->prepared_stmt("INSERT INTO meetings VALUES (NULL, ?, ?, current_timestamp(), NULL, ?)", false, true,
						"ssi", $meetingName, $code, $userId);
			} else {
				$this->prepared_stmt("INSERT INTO meetings VALUES (NULL, ?, ?, ?, NULL, ?)", false, true,
						"sssi", $meetingName, $code, $meetingStart, $userId);
			}
			$id = $this->conn->insert_id;

			$code = $id.$code;

			$this->prepared_stmt("UPDATE meetings SET meetingcode=? WHERE meetingid=?", false, true,
					"si", $code, $id);

			if (count($templates) >= 1) {
				$varTypes = str_repeat("ii", count($templates));
				$vars = array();
				foreach ($templates as $t) {
					$vars[] = $t;
					$vars[] = $id;
				}
				$placeholders = str_repeat("(?,?), ", count($templates)-1);
				$placeholders .= "(?,?)";
				$this->prepared_stmt("INSERT INTO meeting_templates VALUES ".$placeholders, false, true, $varTypes, ...$vars);
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

	/*
	 * Fetches an array of users in the form: { {UserID:x, Role:y, Username:z}, {...} }
	 */
	function get_users() {
		$this->connect();
		$query = "SELECT UserID, Role, Username FROM users INNER JOIN login USING (UserID);";
		if (!($stmt = $this->non_prepared_stmt($query, true, false))) {
			$this->conn->close();
			return false;
		}
		$this->reqResult['result'] = array();
		while ($user = $stmt->fetch_assoc()) {
			$this->reqResult['result'][] = $user;
		}
		$stmt->close();
		$this->conn->close();

		return true;
	}

	/*
	 * Fetches an array of meetings created by the user in the form:
	 * { {MeetingID:a, MeetingName:b, MeetingCode:c, StartTime: "YYYY-MM-DD HH-MM-SS", EndTime: "...", HostID:f}, {...} }
	 */
	function get_meetings($userId) {
		$this->connect();
		$query = "SELECT * FROM meetings WHERE HostID=?";
		if (!($stmt = $this->prepared_stmt($query, true, false,"i", $userId))) {
			$this->conn->close();
			return false;
		}
		if (!($res = $stmt->get_result())) {
			$this->conn->close();
			return false;
		}
		$this->reqResult['result'] = array();
		while ($meeting = $res->fetch_assoc()) {
			$this->reqResult['result'][] = $meeting;
		}
		$stmt->close();
		$this->conn->close();

		return true;

	}

	/*
	 * Fetches an array of templates for a given meeting in the form:
	 * { {TemplateID:x, TemplateName:y}, {...} }
	 */
	function get_meeting_templates($meetingId) {
		$this->connect();
		$query = "
				SELECT TemplateID, TemplateName FROM meeting_templates
				INNER JOIN templates USING (TemplateID)
				WHERE MeetingID=?
		";
		if (!($stmt = $this->prepared_stmt($query, true, false,"i", $meetingId))) {
			$this->conn->close();
			return false;
		}
		if (!($res = $stmt->get_result())) {
			$this->conn->close();
			return false;
		}
		$this->reqResult['result'] = array();
		while ($row=$res->fetch_assoc()) {
			$this->reqResult['result'][] = $row;
		}
		$stmt->close();
		$this->conn->close();
		return true;
	}

	/*
	 * Fetches an array of questions for a given template in the form:
	 * { QuestionID: { Question, QuestionType, {OptionA..D}, {Min..MaxRating} }, ... }
	 */
	function get_template_questions($templateId) {
		$this->connect();
		$query = "
				SELECT QuestionID, Question, QuestionType, OptionA, OptionB, OptionC, OptionD, MinRating, MaxRating 
				FROM template_questions
				LEFT JOIN question_options USING (QuestionID)
				LEFT JOIN question_ratings USING (QuestionID)
				WHERE TemplateID=?
		";
		if (!($stmt = $this->prepared_stmt($query, true, false,"i", $templateId))) {
			$this->conn->close();
			return false;
		}
		if (!($res = $stmt->get_result())) {
			$this->conn->close();
			return false;
		}
		$this->reqResult['result'] = array();
		while ($row=$res->fetch_assoc()) {
			$this->reqResult['result'][$row['QuestionID']] = array();
			$this->reqResult['result'][$row['QuestionID']][] = $row['Question'];
			$this->reqResult['result'][$row['QuestionID']][] = $row['QuestionType'];
			switch ($row['QuestionType']) {
				case 'multiple':
					$this->reqResult['result'][$row['QuestionID']][] = array_slice($row, 3, 4);
					break;
				case 'rating':
					$this->reqResult['result'][$row['QuestionID']][] = array_slice($row, 7, 2);
					break;
				default:
					break;
			}
		}
		$stmt->close();
		$this->conn->close();
		return true;
	}

	function validate_meeting_code($meetingCode) {
		$this->connect();
		if (($stmt = $this->prepared_stmt("SELECT * FROM meetings WHERE MeetingCode=? AND EndTime IS NULL 
                         AND StartTime<=(now() + INTERVAL 10 MINUTE) LIMIT 1", true, false, "s", $meetingCode)) == null) {
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

	function get_meeting_info($userId, $meetingId) {
		$this->connect();
		$query = "SELECT * FROM meetings WHERE HostID=? AND MeetingID=?";
		if (!($stmt = $this->prepared_stmt($query, true, false,"ii", $userId, $meetingId))) {
			$this->conn->close();
			return false;
		}
		if (!($res = $stmt->get_result())) {
			$this->conn->close();
			return false;
		}
		$row = $res->fetch_assoc();
		$this->reqResult['result'] = $row;

		$stmt->close();
		$this->conn->close();

		return true;

	}

	function add_general_feedback($userId, $meetingId, $feedback) {
		$this->connect();
		$this->conn->autocommit(false);
		try {
			if ($userId == 'null') {
				$this->prepared_stmt("INSERT INTO feedback VALUES (NULL, NULL, ?, now())", false, true,
						"i", $meetingId);
			} else {
				$this->prepared_stmt("INSERT INTO feedback VALUES (NULL, ?, ?, now())", false, true,
						"ii", $userId, $meetingId);
			}
			$id = $this->conn->insert_id;

			$this->prepared_stmt("INSERT INTO general_feedback VALUES (?,?)", false, true,"is",
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

	function add_mood_feedback($userId, $meetingId, $feedback) {
		$this->connect();
		$this->conn->autocommit(false);
		try {
			if ($userId == 'null') {
				$this->prepared_stmt("INSERT INTO feedback VALUES (NULL, NULL, ?, now())", false, true,
						"i", $meetingId);
			} else {
				$this->prepared_stmt("INSERT INTO feedback VALUES (NULL, ?, ?, now())", false, true,
						"ii", $userId, $meetingId);
			}
			$id = $this->conn->insert_id;

			$this->prepared_stmt("INSERT INTO mood_feedback VALUES (?,?)", false, true, "is",
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

	function add_template_feedback($questionId, $userId, $meetingId, $feedback) {
		$this->connect();
		$this->conn->autocommit(false);
		try {
			if ($userId == 'null') {
				$this->prepared_stmt("INSERT INTO feedback VALUES (NULL, NULL, ?, now())", false, true,
						"i", $meetingId);
			} else {
				$this->prepared_stmt("INSERT INTO feedback VALUES (NULL, ?, ?, now())", false, true,
						"ii", $userId, $meetingId);
			}
			$id = $this->conn->insert_id;

			$this->prepared_stmt("INSERT INTO template_feedback VALUES (?,?,?)", false, true,
					"iis", $id, $questionId, $feedback);

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
