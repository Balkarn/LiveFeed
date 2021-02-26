CREATE DATABASE  IF NOT EXISTS `db-data` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `db-data`;
-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: db-data
-- ------------------------------------------------------
-- Server version	5.7.33-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `FeedbackID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) DEFAULT NULL,
  `MeetingID` int(11) NOT NULL,
  `TimeSent` datetime NOT NULL,
  PRIMARY KEY (`FeedbackID`),
  KEY `feedback-userid_idx` (`UserID`),
  KEY `feedback-meetingid_idx` (`MeetingID`),
  CONSTRAINT `feedback-meetingid` FOREIGN KEY (`MeetingID`) REFERENCES `meetings` (`MeetingID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `feedback-userid` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `general_feedback`
--

DROP TABLE IF EXISTS `general_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `general_feedback` (
  `FeedbackID` int(11) NOT NULL,
  `Feedback` varchar(144) NOT NULL,
  PRIMARY KEY (`FeedbackID`),
  CONSTRAINT `general_feedback-feedbackid` FOREIGN KEY (`FeedbackID`) REFERENCES `feedback` (`FeedbackID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(45) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username_UNIQUE` (`Username`),
  CONSTRAINT `login-userid` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `meeting_templates`
--

DROP TABLE IF EXISTS `meeting_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meeting_templates` (
  `TemplateID` int(11) NOT NULL,
  `MeetingID` int(11) NOT NULL,
  PRIMARY KEY (`TemplateID`,`MeetingID`),
  KEY `meeting_templates-meetingid_idx` (`MeetingID`),
  CONSTRAINT `meeting_templates-meetingid` FOREIGN KEY (`MeetingID`) REFERENCES `meetings` (`MeetingID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `meeting_templates-templateid` FOREIGN KEY (`TemplateID`) REFERENCES `templates` (`TemplateID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `meetings`
--

DROP TABLE IF EXISTS `meetings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meetings` (
  `MeetingID` int(11) NOT NULL AUTO_INCREMENT,
  `MeetingName` varchar(45) NOT NULL,
  `MeetingCode` varchar(11) NOT NULL,
  `StartTime` datetime NOT NULL,
  `EndTime` datetime DEFAULT NULL,
  `HostID` int(11) NOT NULL,
  PRIMARY KEY (`MeetingID`),
  KEY `meeting-hostid_idx` (`HostID`),
  CONSTRAINT `meeting-hostid` FOREIGN KEY (`HostID`) REFERENCES `users` (`UserID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mood_average`
--

DROP TABLE IF EXISTS `mood_average`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mood_average` (
  `MeetingID` int(11) NOT NULL,
  `Mood` enum('happy','neutral','sad') NOT NULL,
  PRIMARY KEY (`MeetingID`),
  CONSTRAINT `mood_average-meetingid` FOREIGN KEY (`MeetingID`) REFERENCES `meetings` (`MeetingID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mood_feedback`
--

DROP TABLE IF EXISTS `mood_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mood_feedback` (
  `FeedbackID` int(11) NOT NULL,
  `Mood` enum('happy','neutral','sad') NOT NULL,
  PRIMARY KEY (`FeedbackID`),
  CONSTRAINT `mood_feedback-feedbackid` FOREIGN KEY (`FeedbackID`) REFERENCES `feedback` (`FeedbackID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question_options`
--

DROP TABLE IF EXISTS `question_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_options` (
  `QuestionID` int(11) NOT NULL,
  `OptionA` varchar(50) NOT NULL,
  `OptionB` varchar(50) NOT NULL,
  `OptionC` varchar(50) NOT NULL,
  `OptionD` varchar(50) NOT NULL,
  PRIMARY KEY (`QuestionID`),
  CONSTRAINT `question_options-questionid` FOREIGN KEY (`QuestionID`) REFERENCES `template_questions` (`QuestionID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question_ratings`
--

DROP TABLE IF EXISTS `question_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_ratings` (
  `QuestionID` int(11) NOT NULL,
  `MinRating` int(11) NOT NULL,
  `MaxRating` int(11) NOT NULL,
  PRIMARY KEY (`QuestionID`),
  CONSTRAINT `question_ratings-questionid` FOREIGN KEY (`QuestionID`) REFERENCES `template_questions` (`QuestionID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `template_feedback`
--

DROP TABLE IF EXISTS `template_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `template_feedback` (
  `FeedbackID` int(11) NOT NULL,
  `QuestionID` int(11) NOT NULL,
  `Feedback` varchar(144) NOT NULL,
  PRIMARY KEY (`FeedbackID`),
  KEY `template_feedback-questionid_idx` (`QuestionID`),
  CONSTRAINT `template_feedback-feedbackid` FOREIGN KEY (`FeedbackID`) REFERENCES `feedback` (`FeedbackID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `template_feedback-questionid` FOREIGN KEY (`QuestionID`) REFERENCES `template_questions` (`QuestionID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `db-data`.`template_feedback_BEFORE_INSERT` BEFORE INSERT ON `template_feedback` FOR EACH ROW
BEGIN
	IF ((SELECT COUNT(*) FROM template_questions
        WHERE QuestionID = NEW.QuestionID AND QuestionType = 'mood') = 1) THEN
        INSERT INTO mood_feedback VALUES (NEW.FeedbackID, NEW.Feedback);
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `template_questions`
--

DROP TABLE IF EXISTS `template_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `template_questions` (
  `QuestionID` int(11) NOT NULL AUTO_INCREMENT,
  `TemplateID` int(11) NOT NULL,
  `Question` varchar(100) NOT NULL,
  `QuestionType` enum('multiple','open','mood','rating') NOT NULL,
  PRIMARY KEY (`QuestionID`),
  KEY `template_questions-templateid_idx` (`TemplateID`),
  CONSTRAINT `template_questions-templateid` FOREIGN KEY (`TemplateID`) REFERENCES `templates` (`TemplateID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `templates`
--

DROP TABLE IF EXISTS `templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `templates` (
  `TemplateID` int(11) NOT NULL AUTO_INCREMENT,
  `TemplateName` varchar(45) NOT NULL,
  `TemplateCreator` int(11) NOT NULL,
  PRIMARY KEY (`TemplateID`),
  KEY `templates-templatecreator_idx` (`TemplateCreator`),
  CONSTRAINT `templates-templatecreator` FOREIGN KEY (`TemplateCreator`) REFERENCES `users` (`UserID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(45) NOT NULL,
  `LastName` varchar(45) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Role` enum('host','user') NOT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'db-data'
--

--
-- Dumping routines for database 'db-data'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-26 21:56:49
