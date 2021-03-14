<?php

include 'modules.php';

// Basic tests
// Need to replace with PHPUnit unit tests
$database = new DatabaseInteraction();
$reqResult = &$database->reqResult;

function insert_data() {
	global $database;
	global $reqResult;
	$users = array(
			array('test', 'testpwd', 'test1', 'test', 'test@test.com', 'user'), //1
			array('testadmin', 'testpwd', 'test2', 'test', 'test@test.com', 'host'), //2
			array('test2', 'testpwd', 'test3', 'test', 'test@test.com', 'user'), //3
			array('test3', 'testpwd', 'test4', 'test', 'test@test.com', 'user'), //4
			array('testadmin2', 'testpwd', 'test5', 'test', 'test@test.com', 'host'), //5
	);
	foreach ($users as $user) {
		$database->add_user(...$user);
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
		$database->add_template(...$template);
	}
	echo "\nAdd templates: \n";
	var_dump($reqResult);

	$meetings = array(
			array("Test Meeting 1", "2021-02-19 10:10:10", "2", array(1,2)),
			array("Test Meeting 2", "2021-02-19 10:10:10", "2", array())
	);
	foreach ($meetings as $meeting) {
		$database->add_meeting(...$meeting);
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
			array(4, 1, "This workshop was very hard!"),
	);
	foreach ($general_feedback as $feedback) {
		$database->add_general_feedback(...$feedback);
	}
	echo "\nAdd general feedback: \n";
	var_dump($reqResult);

	$template_feedback = array(
			array(1, 1, 1, "This doesn't seem like a good organisation. "),
			array(2, 1, 1, "This was a very challenging workshop. "),
			array(2, 1, 1, "This workshop was very hard!"),
			array(3, 1, 1, "happy"),
			array(4, 1, 1, "A"),
			array(5, 1, 1, "1"),

			array(1, 3, 1, "I think I would like to work here someday. "),
			array(2, 3, 1, "I enjoyed the challenge. "),
			array(3, 3, 1, "neutral"),
			array(4, 3, 1, "A"),
			array(5, 3, 1, "3"),

			array(1, 4, 1, "It's decent. "),
			array(2, 4, 1, "It was too difficult. "),
			array(4, 4, 1, "C"),
			array(5, 4, 1, "7")
	);
	foreach ($template_feedback as $feedback) {
		$database->add_template_feedback(...$feedback);
	}
	echo "\nAdd template feedback: \n";
	var_dump($reqResult);

	$mood_feedback = array(
			array(2, 1, "sad"),
			array(3, 1, "happy"),
			array(4, 1, "neutral"),
			array(5, 1, "sad"),
			array(1, 1, "happy"),
			array(3, 1, "happy"),
			array(4, 1, "sad"),
			array(5, 1, "sad"),
	);
	foreach ($mood_feedback as $mood) {
		$database->add_mood_feedback(...$mood);
	}
	echo "\nAdd mood feedback: \n";
	var_dump($reqResult);
}
#insert_data();
echo "\nGet User Templates: \n";
$database->get_user_templates(2);
var_dump($reqResult);

echo "\nGet Users: \n";
$database->get_users();
var_dump($reqResult);

echo "\nGet Meetings: \n";
$database->get_meetings(2);
var_dump($reqResult);

echo "\nGet Templates: \n";
$database->get_meeting_templates(1);
var_dump($reqResult);

echo "\nGet Template Questions: \n";
$database->get_template_questions(1);
var_dump($reqResult);

echo "\nGet Meeting Info: \n";
$database->get_meeting_info(2, 1);
var_dump($reqResult);

?>