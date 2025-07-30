mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 9.4.0, for Linux (aarch64)
--
-- Host: localhost    Database: portfolio
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cash_accounts`
--

DROP TABLE IF EXISTS `cash_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cash_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `balance` decimal(15,2) NOT NULL,
  `last_updated` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash_accounts`
--

LOCK TABLES `cash_accounts` WRITE;
/*!40000 ALTER TABLE `cash_accounts` DISABLE KEYS */;
INSERT INTO `cash_accounts` VALUES (1,'Fidelity Cash',2291.90,'2025-07-30 05:07:32'),(2,'Wells Fargo (Checking)',309.13,'2025-07-30 05:07:32'),(3,'Wells Fargo (Savings)',2000.67,'2025-07-30 05:07:32');
/*!40000 ALTER TABLE `cash_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `investments`
--

DROP TABLE IF EXISTS `investments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `investments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shares` int NOT NULL,
  `symbol` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_updated` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`name`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `investments`
--

LOCK TABLES `investments` WRITE;
/*!40000 ALTER TABLE `investments` DISABLE KEYS */;
INSERT INTO `investments` VALUES (9,'ATLANTIC UNION BANKSHARES CO',9782,'AUB','2025-07-30 05:07:42'),(4,'CME GROUP INC',5917,'CME','2025-07-30 05:07:42'),(7,'ISHARES IBONDS 2029 TM HY IN',5123,'IBHI','2025-07-30 05:07:42'),(8,'KRANESHARES MSCI ONE BELT ON',4548,'OBOR','2025-07-30 05:07:42'),(2,'NET POWER INC',6553,'NPWR','2025-07-30 05:07:41'),(5,'PERIMETER ACQUISITION CORP I',9247,'PMTRU','2025-07-30 05:07:42'),(6,'PIMCO RAFI DYNAMIC MULTI-FAC',4929,'MFUS','2025-07-30 05:07:42'),(10,'RHI MAGNESITA NV',1453,'RMGNF','2025-07-30 05:07:42'),(1,'SOUTHERN MICHIGAN BANCORP',5095,'SOMC','2025-07-30 05:07:41'),(3,'TARKU RESOURCES LTD',4247,'TRKUF','2025-07-30 05:07:42');
/*!40000 ALTER TABLE `investments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `net_worth`
--

DROP TABLE IF EXISTS `net_worth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `net_worth` (
  `date` date NOT NULL,
  `net_worth` double DEFAULT NULL,
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `net_worth`
--

LOCK TABLES `net_worth` WRITE;
/*!40000 ALTER TABLE `net_worth` DISABLE KEYS */;
INSERT INTO `net_worth` VALUES ('2025-06-29',2300100),('2025-06-30',2300500),('2025-07-01',2300900),('2025-07-02',2301300),('2025-07-03',2301700),('2025-07-04',2302100),('2025-07-05',2302500),('2025-07-06',2302900),('2025-07-07',2303300),('2025-07-08',2303700),('2025-07-09',2304100),('2025-07-10',2304500),('2025-07-11',2304900),('2025-07-12',2305300),('2025-07-13',2305700),('2025-07-14',2306100),('2025-07-15',2306500),('2025-07-16',2306900),('2025-07-17',2307300),('2025-07-18',2307700),('2025-07-19',2308100),('2025-07-20',2308500),('2025-07-21',2308900),('2025-07-22',2309300),('2025-07-23',2309700),('2025-07-24',2310100),('2025-07-25',2310500),('2025-07-26',2310900),('2025-07-27',2311300),('2025-07-28',2317000);
/*!40000 ALTER TABLE `net_worth` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-30  7:13:47
