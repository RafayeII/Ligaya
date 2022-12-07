-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: ligaya
-- ------------------------------------------------------
-- Server version	8.0.31

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
-- Table structure for table `festivals`
--

DROP TABLE IF EXISTS `festivals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `festivals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `date` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `festivals`
--

LOCK TABLES `festivals` WRITE;
/*!40000 ALTER TABLE `festivals` DISABLE KEYS */;
INSERT INTO `festivals` VALUES (1,'rafayell','More Cultural Events!','People should particiapte more in festivals to know more about our country\'s culture.','11/21/2022'),(2,'emilee','Filipinos should be Proud','Festivals like this and other out there emphasize our unique culture and traditions.','11/19/2022');
/*!40000 ALTER TABLE `festivals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funruns`
--

DROP TABLE IF EXISTS `funruns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funruns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `date` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funruns`
--

LOCK TABLES `funruns` WRITE;
/*!40000 ALTER TABLE `funruns` DISABLE KEYS */;
INSERT INTO `funruns` VALUES (1,'rafayell','Best Funrun in a While!','I never had seen work put in a funrun before but the organization really did there best.','11/21/2022'),(2,'briann','I am Happy to be Part of this!','I met many new friends along the way I hope these kinds of events happen more often.','11/17/2022'),(3,'kylee','Impressed with the Management','The work they put to make this a successful funrun is evident and well thought out.','11/10/2022');
/*!40000 ALTER TABLE `funruns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `biography` varchar(45) DEFAULT NULL,
  `hobbies` varchar(45) DEFAULT NULL,
  `contacts` varchar(45) DEFAULT NULL,
  `links` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12020006 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile`
--

LOCK TABLES `profile` WRITE;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
INSERT INTO `profile` VALUES (12020001,'rafayell','I Love Reading!','Manga and Novels','09123123451','facebook.com/rafael'),(12020002,'briann','I\'m good at Web Development','Creating New Websites','09768756781','facebook.com/brian'),(12020003,'kylee','I Like to Code New Applications','Learning Coding Languages','09867546675','instagram.com/kyle'),(12020004,'emilee','I Want to become a SuperStar','Instruments and Making Songs','09665785253','twitter.com/emily'),(12020005,'anihart','I Like to Meet New People','Attending Parties and Events','09836123451','facebook.com/annie');
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` VALUES ('A1uk7cDIkOiCw6rUDv3lGIwmgQB6BK80',1670086619,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"userinfo\":\"rafayell\"}');
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tournaments`
--

DROP TABLE IF EXISTS `tournaments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tournaments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `date` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tournaments`
--

LOCK TABLES `tournaments` WRITE;
/*!40000 ALTER TABLE `tournaments` DISABLE KEYS */;
INSERT INTO `tournaments` VALUES (1,'rafayell','Higher Prize Pool!','The organizers should consider increasing the prizes for players.','11/21/022'),(2,'anihart','Girl Division Rocks!','Other tournament should take notes from this and allow girl players.','11/12/2022');
/*!40000 ALTER TABLE `tournaments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12020006 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (12020001,'Rafael Sanchez','rafael_sanchez@dlsu.edu.ph','rafayell','$2b$04$RuutAByweUFjRZticl9WA.j1DCNDW/72Cm3rFCF9PUjZnp89gqMV6'),(12020002,'Brian Salangsang','brian_salangsang@dlsu.edu.ph','briann','$2b$04$h2NLHRMzV0iLZ.ztCqDXxOXdNJ2EQVEqwLJ66WhlIuFUAtAc2iGzu'),(12020003,'Kyle Santiago','kyle_santiago@dlsu.edu.ph','kylee','$2b$04$IgcgQnD9A.IG9EBgIrQYIen2ooTo37qUrlg68.QqCWmWY5u.YMTdy'),(12020004,'Emily Constantino','emilyconstantino@gmail.com','emilee','$2b$04$z8lgt8r/ygqa1lTDg/7UKujUGC9Gfsb420NTmLdL3mxECnSkUZxPG'),(12020005,'Annie Heart','annieheart123@yahoo.com','anihart','$2b$04$rVfpXUS5HQZhGiFRhiABH..qoTGTe1SCjvQrg66Z.45oYYR6ItC9m');
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

-- Dump completed on 2022-12-04 13:04:42
