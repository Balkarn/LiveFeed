<?php

include 'modules.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Origin, Content-Type, POST');
header('Content-Type: application/json, multipart/form-data');

$database = new DatabaseInteraction();
$reqResult = &$database->reqResult;

ob_start();
var_dump($_POST);
error_log(ob_get_clean(), 4);


if (!isset($_POST['function'])) { $reqResult['error'] = "No function name."; }
if (!isset($_POST['arguments'])) { $reqResult['error'] = "No function arguments."; }
if (!isset($_POST['error'])) {
	$reqResult['error'] = '';
	switch($_POST['function']) {
	  case 'login':
	    if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 2) {
	      $reqResult['error'] = "Invalid arguments used.";
	    } else { # argument format: username, password
	      $reqResult['result'] = $database->login(...$_POST['arguments']);
	    }
	    break;
	  case 'signup':
	    if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 6) {
	      $reqResult['error'] = "Invalid arguments used.";
	    } else { # argument format: username, password, fname, lname, email, role
	      $reqResult['result'] = $database->add_user(...$_POST['arguments']);
	    }
	    break;
	  case 'addtemplate':
	    if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 3) {
	      $reqResult['error'] = "Invalid arguments used.";
	    } else { # argument format: templateName, templateCreatorId, [[question, questionType, options1..4, ratingmin..max], [...]]
	      $reqResult['result'] = $database->add_template(...$_POST['arguments']);
	    }
	    break;
	  case 'getusertemplates':
	    if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 1) {
	      $reqResult['error'] = "Invalid arguments used.";
	    } else { # argument format: templateCreatorId
	      $database->get_user_templates(...$_POST['arguments']);
	    }
	    break;
	  case 'addmeeting':
	    if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 4) {
	      $reqResult['error'] = "Invalid arguments used.";
	    } else { # argument format: meetingName, meetingStart, userId, [templateId1, Id2, ...]
	      $database->add_meeting(...$_POST['arguments']);
	    }
	    break;
		case 'getmeeting':
			if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 1) {
				$reqResult['error'] = "Invalid arguments used.";
			} else { # argument format: meetingCode
				$database->get_meeting(...$_POST['arguments']);
			}
			break;
	  case 'addgeneralfeedback':
	    if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 2) {
	      $reqResult['error'] = "Invalid arguments used.";
	    } else { # argument format: userId, meetingId, feedback
	      $database->add_general_feedback(...$_POST['arguments']);
	    }
		$notif = file_get_contents("http://localhost:81/feedbackreceived");
	    break;
	  case 'addmoodfeedback':
	    if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 2) {
	      $reqResult['error'] = "Invalid arguments used.";
	    } else { # argument format: userId, meetingId, mood
	      $database->add_mood_feedback(...$_POST['arguments']);
	    }
		$notif = file_get_contents("http://localhost:81/feedbackreceived");
	    break;
	  case 'addtemplatefeedback':
	    if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 4) {
	      $reqResult['error'] = "Invalid arguments used.";
	    } else { # argument format: templateId, questionId, userId, meetingId, feedback
	      $database->add_template_feedback(...$_POST['arguments']);
	    }
		$notif = file_get_contents("http://localhost:81/feedbackreceived");
	    break;
	  case 'validatemeetingcode':
	    if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 1) {
	      $reqResult['error'] = "Invalid arguments used.";
	    } else { # argument format: meetingcode
	      $database->validate_meeting_code(...$_POST['arguments']);
	    }
	    break;
		case 'getmeetings':
			if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 1) {
				$reqResult['error'] = "Invalid arguments used.";
			} else { # argument format: hostid
				$database->get_meetings(...$_POST['arguments']);
			}
			break;
		case 'getmeetinginfo':
			if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 2) {
				$reqResult['error'] = "Invalid arguments used.";
			} else { # argument format: userId, meetingId
				$database->get_meeting_info(...$_POST['arguments']);
			}
			break;
		case 'getmeetingtemplates':
			if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 1) {
				$reqResult['error'] = "Invalid arguments used.";
			} else { # argument format: meetingId
				$database->get_meeting_templates(...$_POST['arguments']);
			}
			break;
		case 'gettemplatequestions':
			if (!is_array($_POST['arguments']) || count($_POST['arguments']) < 1) {
				$reqResult['error'] = "Invalid arguments used.";
			} else { # argument format: templateId
				$database->get_template_questions(...$_POST['arguments']);
			}
			break;
	  default:
	    $reqResult['error'] = 'Function named: '.$_POST['function'].' was not found.';
	    break;
	}
}

if (is_resource($database->conn)) {
	$database->conn->close();
}
echo json_encode($reqResult);

?>



