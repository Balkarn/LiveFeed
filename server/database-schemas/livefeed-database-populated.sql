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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,1,1,'2021-02-23 14:27:57'),(2,3,1,'2021-02-23 14:27:57'),(3,4,1,'2021-02-23 14:27:57'),(4,1,1,'2021-02-23 14:27:57'),(5,3,1,'2021-02-23 14:27:57'),(6,4,1,'2021-02-23 14:27:57'),(7,1,1,'2021-02-23 14:27:57'),(8,3,1,'2021-02-23 14:27:57'),(9,4,1,'2021-02-23 14:27:57'),(10,1,1,'2021-02-23 14:27:57'),(11,1,1,'2021-02-23 14:27:57'),(12,1,1,'2021-02-23 14:27:57'),(13,1,1,'2021-02-23 14:27:57'),(14,1,1,'2021-02-23 14:27:57'),(15,3,1,'2021-02-23 14:27:57'),(16,3,1,'2021-02-23 14:27:57'),(17,3,1,'2021-02-23 14:27:57'),(18,3,1,'2021-02-23 14:27:57'),(19,3,1,'2021-02-23 14:27:57'),(20,4,1,'2021-02-23 14:27:57'),(21,4,1,'2021-02-23 14:27:57'),(22,4,1,'2021-02-23 14:27:58'),(23,4,1,'2021-02-23 14:27:58');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_clauses`
--

DROP TABLE IF EXISTS `feedback_clauses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback_clauses` (
  `ClauseID` int(11) NOT NULL AUTO_INCREMENT,
  `FeedbackID` int(11) NOT NULL,
  `Clause` varchar(144) NOT NULL,
  PRIMARY KEY (`ClauseID`),
  KEY `feedback_clauses-feedbackid_idx` (`FeedbackID`),
  CONSTRAINT `feedback_clauses-feedbackid` FOREIGN KEY (`FeedbackID`) REFERENCES `feedback` (`FeedbackID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback_clauses`
--

LOCK TABLES `feedback_clauses` WRITE;
/*!40000 ALTER TABLE `feedback_clauses` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback_clauses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `frequent_feedback`
--

DROP TABLE IF EXISTS `frequent_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `frequent_feedback` (
  `MatchID` int(11) NOT NULL AUTO_INCREMENT,
  `ClauseID` int(11) NOT NULL,
  `Closeness` decimal(6,5) NOT NULL,
  PRIMARY KEY (`MatchID`,`ClauseID`),
  KEY `frequent_feedback-clauseid_idx` (`ClauseID`),
  CONSTRAINT `frequent_feedback-clauseid` FOREIGN KEY (`ClauseID`) REFERENCES `feedback_clauses` (`ClauseID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `frequent_feedback`
--

LOCK TABLES `frequent_feedback` WRITE;
/*!40000 ALTER TABLE `frequent_feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `frequent_feedback` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `general_feedback`
--

LOCK TABLES `general_feedback` WRITE;
/*!40000 ALTER TABLE `general_feedback` DISABLE KEYS */;
INSERT INTO `general_feedback` VALUES (1,'This workshop is terrible.'),(2,'This talk is interesting.'),(3,'This guy is killing it!'),(4,'This company is bad ass.'),(5,'Please speed up. '),(6,'Zzzzz.'),(7,'What are you doing!'),(8,'Cool cool.'),(9,'Can you skip the safety briefing.');
/*!40000 ALTER TABLE `general_feedback` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES (1,'test','$2y$10$rbQ8b9fdIA.QICBPZRlMEOL3/m9sljGG94TO95SCd1LkgUDD9M0Fq'),(2,'testadmin','$2y$10$EDlysKIxDSnHPPNgoGBCBOZ0nQZLmRH6Oysfw.8CcFWcZVKoXG8Eq'),(3,'test2','$2y$10$CQieTM9TbYmiMAUJQvjTuOYVpYwLvKp.SXaYeFoYG7bG/CwpO7m2K'),(4,'test3','$2y$10$uIezijtVhzSS/aZiDPBK3Oa5TUNtVNApXdvzP2Cny1c6IYvW7TXuq'),(5,'testadmin2','$2y$10$6dlBM5fQF8/5BELmnY6jWuW3nU3dvkZQESwsZV2zAwQd7QetRNlGi');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `meeting_templates`
--

LOCK TABLES `meeting_templates` WRITE;
/*!40000 ALTER TABLE `meeting_templates` DISABLE KEYS */;
INSERT INTO `meeting_templates` VALUES (1,1),(2,1);
/*!40000 ALTER TABLE `meeting_templates` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meetings`
--

LOCK TABLES `meetings` WRITE;
/*!40000 ALTER TABLE `meetings` DISABLE KEYS */;
INSERT INTO `meetings` VALUES (1,'Test Meeting 1','125jggv1','2021-02-19 10:10:10',NULL,2);
/*!40000 ALTER TABLE `meetings` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `mood_average`
--

LOCK TABLES `mood_average` WRITE;
/*!40000 ALTER TABLE `mood_average` DISABLE KEYS */;
/*!40000 ALTER TABLE `mood_average` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `mood_feedback`
--

LOCK TABLES `mood_feedback` WRITE;
/*!40000 ALTER TABLE `mood_feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `mood_feedback` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `question_options`
--

LOCK TABLES `question_options` WRITE;
/*!40000 ALTER TABLE `question_options` DISABLE KEYS */;
INSERT INTO `question_options` VALUES (4,'A','B','C','D'),(9,'A','B','C','D'),(14,'A','B','C','D');
/*!40000 ALTER TABLE `question_options` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `question_ratings`
--

LOCK TABLES `question_ratings` WRITE;
/*!40000 ALTER TABLE `question_ratings` DISABLE KEYS */;
INSERT INTO `question_ratings` VALUES (5,1,9),(10,1,9),(15,1,9);
/*!40000 ALTER TABLE `question_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `template_feedback`
--

DROP TABLE IF EXISTS `template_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `template_feedback` (
  `FeedbackID` int(11) NOT NULL,
  `TemplateID` int(11) NOT NULL,
  `QuestionID` int(11) NOT NULL,
  `Feedback` varchar(144) NOT NULL,
  PRIMARY KEY (`FeedbackID`),
  KEY `template_feedback-templateid_idx` (`TemplateID`),
  KEY `template_feedback-questionid_idx` (`QuestionID`),
  CONSTRAINT `template_feedback-feedbackid` FOREIGN KEY (`FeedbackID`) REFERENCES `feedback` (`FeedbackID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `template_feedback-questionid` FOREIGN KEY (`QuestionID`) REFERENCES `template_questions` (`QuestionID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `template_feedback-templateid` FOREIGN KEY (`TemplateID`) REFERENCES `templates` (`TemplateID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `template_feedback`
--

LOCK TABLES `template_feedback` WRITE;
/*!40000 ALTER TABLE `template_feedback` DISABLE KEYS */;
INSERT INTO `template_feedback` VALUES (10,1,1,'This doesn\'t seem like a good organisation. '),(11,1,2,'This was a very challenging workshop. '),(12,1,3,'happy'),(13,1,4,'A'),(14,1,5,'1'),(15,1,1,'I think I would like to work here someday. '),(16,1,2,'I enjoyed the challenge. '),(17,1,3,'neutral'),(18,1,4,'A'),(19,1,5,'3'),(20,1,1,'It\'s decent. '),(21,1,2,'It was too difficult. '),(22,1,4,'C'),(23,1,5,'7');
/*!40000 ALTER TABLE `template_feedback` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `template_questions`
--

LOCK TABLES `template_questions` WRITE;
/*!40000 ALTER TABLE `template_questions` DISABLE KEYS */;
INSERT INTO `template_questions` VALUES (1,1,'What do you think about the company?','open'),(2,1,'What do you think about this workshop? ','open'),(3,1,'Q5','mood'),(4,1,'Q1','multiple'),(5,1,'Q4','rating'),(6,2,'ii','open'),(7,2,'iii','open'),(8,2,'v','mood'),(9,2,'i','multiple'),(10,2,'iv','rating'),(11,3,'bravo','open'),(12,3,'charlie','open'),(13,3,'echo','mood'),(14,3,'alpha','multiple'),(15,3,'delta','rating');
/*!40000 ALTER TABLE `template_questions` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `templates`
--

LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;
INSERT INTO `templates` VALUES (1,'Template 1',2),(2,'Template 2',2),(3,'Template Uno',5);
/*!40000 ALTER TABLE `templates` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test1','test','test@test.com','user'),(2,'test2','test','test@test.com','host'),(3,'test3','test','test@test.com','user'),(4,'test4','test','test@test.com','user'),(5,'test5','test','test@test.com','host');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-24 16:56:21
