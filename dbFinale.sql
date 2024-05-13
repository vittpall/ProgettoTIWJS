CREATE DATABASE  IF NOT EXISTS `tiw_project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tiw_project`;
-- MySQL dump 10.13  Distrib 8.0.36, for macos14 (arm64)
--
-- Host: 127.0.0.1    Database: tiw_project
-- ------------------------------------------------------
-- Server version	8.3.0

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
-- Table structure for table `album`
--

DROP TABLE IF EXISTS `album`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `album` (
  `Username` varchar(255) DEFAULT NULL,
  `User_id` int NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Creation_Date` datetime DEFAULT NULL,
  KEY `fk_Album_1_idx` (`User_id`,`Title`),
  CONSTRAINT `fk_Album_2` FOREIGN KEY (`User_id`) REFERENCES `user` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `album`
--

LOCK TABLES `album` WRITE;
/*!40000 ALTER TABLE `album` DISABLE KEYS */;
INSERT INTO `album` VALUES ('user1',14,'Primo','2024-05-13 00:00:00'),('user1',14,'secondo','2024-05-13 00:00:00'),('user1',14,'Terzo','2024-05-13 00:00:00'),('user1',14,'Quarto','2024-05-13 00:00:00'),('user1',14,'quinto','2024-05-13 00:00:00'),('user1',14,'sesto','2024-05-13 00:00:00'),('user1',14,'settimo','2024-05-13 00:00:00'),('user1',14,'ottavo','2024-05-13 00:00:00'),('user1',14,'nono','2024-05-13 00:00:00'),('user1',14,'decimo','2024-05-13 00:00:00'),('user1',14,'undicesimo','2024-05-13 00:00:00'),('user1',14,'dodici(Piu immagini)','2024-05-13 00:00:00'),('user1',14,'vuoto','2024-05-13 00:00:00'),('user1',14,'commenti','2024-05-13 00:00:00'),('user2',15,'First','2024-05-13 00:00:00');
/*!40000 ALTER TABLE `album` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `Image_Id` int NOT NULL,
  `Id` int NOT NULL,
  `Publication_date` datetime NOT NULL,
  `Text` varchar(255) NOT NULL,
  PRIMARY KEY (`Image_Id`,`Id`,`Publication_date`),
  KEY `fk_Comment_1_idx` (`Id`),
  CONSTRAINT `fk_Comment_1` FOREIGN KEY (`Id`) REFERENCES `user` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Comment_2` FOREIGN KEY (`Image_Id`) REFERENCES `image` (`Image_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (223,14,'2024-05-13 09:09:02','Primo Commento'),(223,14,'2024-05-13 09:57:42','terzocomment'),(223,14,'2024-05-13 10:02:45','quartocommento'),(223,14,'2024-05-13 10:02:55','quintocommento'),(223,15,'2024-05-13 09:53:42','ciao'),(223,15,'2024-05-13 10:03:35','sestocommento');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contains_images`
--

DROP TABLE IF EXISTS `contains_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contains_images` (
  `Image_Id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `User_Id` int NOT NULL,
  `Order_Index` int DEFAULT '0',
  PRIMARY KEY (`Image_Id`,`title`,`User_Id`),
  KEY `fk_Contains_Images_1_idx` (`User_Id`,`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contains_images`
--

LOCK TABLES `contains_images` WRITE;
/*!40000 ALTER TABLE `contains_images` DISABLE KEYS */;
INSERT INTO `contains_images` VALUES (223,'commenti',14,0),(223,'dodici(Piu immagini)',14,0),(223,'Primo',14,0),(224,'dodici(Piu immagini)',14,0),(224,'secondo',14,0),(225,'dodici(Piu immagini)',14,0),(225,'Terzo',14,0),(226,'dodici(Piu immagini)',14,0),(226,'Quarto',14,0),(227,'dodici(Piu immagini)',14,0),(227,'quinto',14,0),(228,'dodici(Piu immagini)',14,0),(228,'sesto',14,0),(229,'dodici(Piu immagini)',14,0),(229,'settimo',14,0),(230,'dodici(Piu immagini)',14,0),(230,'ottavo',14,0),(231,'dodici(Piu immagini)',14,0),(231,'nono',14,0),(232,'decimo',14,0),(232,'dodici(Piu immagini)',14,0),(233,'dodici(Piu immagini)',14,0),(233,'undicesimo',14,0),(234,'First',15,0);
/*!40000 ALTER TABLE `contains_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `image`
--

DROP TABLE IF EXISTS `image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `image` (
  `Image_id` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) DEFAULT NULL,
  `Creation_Date` date DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `System_Path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Image_id`)
) ENGINE=InnoDB AUTO_INCREMENT=235 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image`
--

LOCK TABLES `image` WRITE;
/*!40000 ALTER TABLE `image` DISABLE KEYS */;
INSERT INTO `image` VALUES (223,'1.jpeg','2024-05-13','1','/images/1715591075112_1.jpeg'),(224,'2.jpeg','2024-05-13','2','/images/1715591085542_2.jpeg'),(225,'3.jpeg','2024-05-13','3','/images/1715591094657_3.jpeg'),(226,'4.jpeg','2024-05-13','4','/images/1715591104970_4.jpeg'),(227,'5.jpeg','2024-05-13','5','/images/1715591114508_5.jpeg'),(228,'6.jpeg','2024-05-13','6','/images/1715591147912_6.jpeg'),(229,'7.jpeg','2024-05-13','7','/images/1715591157520_7.jpeg'),(230,'8.jpeg','2024-05-13','8','/images/1715591170341_8.jpeg'),(231,'9.jpeg','2024-05-13','9','/images/1715591183090_9.jpeg'),(232,'10.jpeg','2024-05-13','10','/images/1715591191883_10.jpeg'),(233,'11.jpeg','2024-05-13','','/images/1715591203621_11.jpeg'),(234,'1.jpeg','2024-05-13','First','/images/1715592555961_1.jpeg');
/*!40000 ALTER TABLE `image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publish_image`
--

DROP TABLE IF EXISTS `publish_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publish_image` (
  `image_Id` int NOT NULL,
  `User_Id` int NOT NULL,
  PRIMARY KEY (`image_Id`,`User_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publish_image`
--

LOCK TABLES `publish_image` WRITE;
/*!40000 ALTER TABLE `publish_image` DISABLE KEYS */;
/*!40000 ALTER TABLE `publish_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Reg_Date` date DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (14,'user1','user1@gmail.com','user1','2024-05-13'),(15,'user2','user2@gmail.com','user2','2024-05-13');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-13 13:37:21
