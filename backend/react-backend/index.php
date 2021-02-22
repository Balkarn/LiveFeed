<?php

include 'modules.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Origin, Content-Type, POST');
header('Content-Type: application/json, multipart/form-data');

$database = new DatabaseInteraction();

// ob_start();
// var_dump($_POST);
// error_log(ob_get_clean(), 4);

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

?>



