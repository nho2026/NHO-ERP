-- MySQL dump 10.13  Distrib 8.4.11, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: nho_erp
-- ------------------------------------------------------
-- Server version	8.4.11-0ubuntu0.26.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!50503 SET NAMES utf8mb4 */
;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */
;
/*!40103 SET TIME_ZONE='+00:00' */
;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */
;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;

--
-- Table structure for table `InventoryCustomer`
--

DROP TABLE IF EXISTS `InventoryCustomer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `InventoryCustomer` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `phone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
    `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
    `address` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
    `note` text COLLATE utf8mb4_unicode_ci,
    `debtThreshold` decimal(14, 2) NOT NULL DEFAULT '0.00',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `InventoryCustomer`
--

LOCK TABLES `InventoryCustomer` WRITE;
/*!40000 ALTER TABLE `InventoryCustomer` DISABLE KEYS */
;
/*!40000 ALTER TABLE `InventoryCustomer` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `InventoryIcuCase`
--

DROP TABLE IF EXISTS `InventoryIcuCase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `InventoryIcuCase` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `patientName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `entry` datetime(3) NOT NULL,
    `exit` datetime(3) DEFAULT NULL,
    `items` json NOT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    `patientId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `unit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'icu',
    `isBypass` tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `InventoryIcuCase_patientId_idx` (`patientId`),
    KEY `InventoryIcuCase_unit_idx` (`unit`),
    CONSTRAINT `InventoryIcuCase_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `healthcare_Patient` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `InventoryIcuCase`
--

LOCK TABLES `InventoryIcuCase` WRITE;
/*!40000 ALTER TABLE `InventoryIcuCase` DISABLE KEYS */
;
/*!40000 ALTER TABLE `InventoryIcuCase` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `InventoryProductionCompany`
--

DROP TABLE IF EXISTS `InventoryProductionCompany`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `InventoryProductionCompany` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `country` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `InventoryProductionCompany_name_key` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `InventoryProductionCompany`
--

LOCK TABLES `InventoryProductionCompany` WRITE;
/*!40000 ALTER TABLE `InventoryProductionCompany` DISABLE KEYS */
;
/*!40000 ALTER TABLE `InventoryProductionCompany` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `InventoryRetailer`
--

DROP TABLE IF EXISTS `InventoryRetailer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `InventoryRetailer` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `phone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
    `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
    `note` text COLLATE utf8mb4_unicode_ci,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `InventoryRetailer_name_key` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `InventoryRetailer`
--

LOCK TABLES `InventoryRetailer` WRITE;
/*!40000 ALTER TABLE `InventoryRetailer` DISABLE KEYS */
;
/*!40000 ALTER TABLE `InventoryRetailer` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `_prisma_migrations` (
    `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
    `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
    `finished_at` datetime(3) DEFAULT NULL,
    `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `logs` text COLLATE utf8mb4_unicode_ci,
    `rolled_back_at` datetime(3) DEFAULT NULL,
    `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */
;
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `access_Permission`
--

DROP TABLE IF EXISTS `access_Permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `access_Permission` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `module` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `Permission_key_key` (`key`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `access_Permission`
--

LOCK TABLES `access_Permission` WRITE;
/*!40000 ALTER TABLE `access_Permission` DISABLE KEYS */
;
INSERT INTO
    `access_Permission`
VALUES (
        'cmt8rdox60000gsxc59hp29w4',
        'pos.use',
        'Use point of sale',
        'Point of Sale',
        NULL,
        '2026-08-25 14:26:55.722'
    ),
    (
        'cmt8rdoxd0001gsxc658d7b7x',
        'tasks.list.view',
        'View Task List',
        'Tasks / Task List',
        NULL,
        '2026-08-25 14:26:55.729'
    ),
    (
        'cmt8rdoxk0002gsxc7ofi3sqt',
        'tasks.list.create',
        'Create Task List',
        'Tasks / Task List',
        NULL,
        '2026-08-25 14:26:55.736'
    ),
    (
        'cmt8rdoxp0003gsxcgpww7sie',
        'tasks.list.update',
        'Update Task List',
        'Tasks / Task List',
        NULL,
        '2026-08-25 14:26:55.741'
    ),
    (
        'cmt8rdoxu0004gsxct7yqob1u',
        'tasks.list.delete',
        'Delete Task List',
        'Tasks / Task List',
        NULL,
        '2026-08-25 14:26:55.747'
    ),
    (
        'cmt8rdoxz0005gsxcpg73ytmf',
        'tasks.list.manage',
        'Manage Task List',
        'Tasks / Task List',
        NULL,
        '2026-08-25 14:26:55.752'
    ),
    (
        'cmt8rdoy60006gsxckras56l3',
        'tasks.reports.view',
        'View Reports',
        'Tasks / Reports',
        NULL,
        '2026-08-25 14:26:55.759'
    ),
    (
        'cmt8rdoyb0007gsxc469hkkgg',
        'tasks.reports.create',
        'Create Reports',
        'Tasks / Reports',
        NULL,
        '2026-08-25 14:26:55.764'
    ),
    (
        'cmt8rdoyg0008gsxcfptrbbn5',
        'tasks.reports.update',
        'Update Reports',
        'Tasks / Reports',
        NULL,
        '2026-08-25 14:26:55.769'
    ),
    (
        'cmt8rdoym0009gsxcsk0qlauz',
        'tasks.reports.delete',
        'Delete Reports',
        'Tasks / Reports',
        NULL,
        '2026-08-25 14:26:55.774'
    ),
    (
        'cmt8rdoyq000agsxcf4fv1p2o',
        'tasks.reports.manage',
        'Manage Reports',
        'Tasks / Reports',
        NULL,
        '2026-08-25 14:26:55.779'
    ),
    (
        'cmt8rdoyv000bgsxcrvvblgst',
        'attendance.devices.view',
        'View Devices',
        'Attendance / Devices',
        NULL,
        '2026-08-25 14:26:55.784'
    ),
    (
        'cmt8rdoz2000cgsxcayou9981',
        'attendance.devices.create',
        'Create Devices',
        'Attendance / Devices',
        NULL,
        '2026-08-25 14:26:55.790'
    ),
    (
        'cmt8rdoz6000dgsxcyzuwefzo',
        'attendance.devices.update',
        'Update Devices',
        'Attendance / Devices',
        NULL,
        '2026-08-25 14:26:55.795'
    ),
    (
        'cmt8rdozc000egsxcvru84rrt',
        'attendance.devices.delete',
        'Delete Devices',
        'Attendance / Devices',
        NULL,
        '2026-08-25 14:26:55.801'
    ),
    (
        'cmt8rdozh000fgsxckc6re1on',
        'attendance.devices.manage',
        'Manage Devices',
        'Attendance / Devices',
        NULL,
        '2026-08-25 14:26:55.806'
    ),
    (
        'cmt8rdozn000ggsxck2im674g',
        'attendance.users.view',
        'View Users',
        'Attendance / Users',
        NULL,
        '2026-08-25 14:26:55.812'
    ),
    (
        'cmt8rdozs000hgsxc33i9fo4z',
        'attendance.users.create',
        'Create Users',
        'Attendance / Users',
        NULL,
        '2026-08-25 14:26:55.817'
    ),
    (
        'cmt8rdozx000igsxcqiob8vcs',
        'attendance.users.update',
        'Update Users',
        'Attendance / Users',
        NULL,
        '2026-08-25 14:26:55.822'
    ),
    (
        'cmt8rdp02000jgsxcpzck3nwd',
        'attendance.users.delete',
        'Delete Users',
        'Attendance / Users',
        NULL,
        '2026-08-25 14:26:55.827'
    ),
    (
        'cmt8rdp08000kgsxcuctqplrx',
        'attendance.users.manage',
        'Manage Users',
        'Attendance / Users',
        NULL,
        '2026-08-25 14:26:55.833'
    ),
    (
        'cmt8rdp0d000lgsxc2dlbsyed',
        'attendance.events.view',
        'View Events',
        'Attendance / Events',
        NULL,
        '2026-08-25 14:26:55.838'
    ),
    (
        'cmt8rdp0i000mgsxcvp7cli17',
        'attendance.events.create',
        'Create Events',
        'Attendance / Events',
        NULL,
        '2026-08-25 14:26:55.843'
    ),
    (
        'cmt8rdp0p000ngsxcaifyw3bs',
        'attendance.events.update',
        'Update Events',
        'Attendance / Events',
        NULL,
        '2026-08-25 14:26:55.850'
    ),
    (
        'cmt8rdp0u000ogsxckv6znv8h',
        'attendance.events.delete',
        'Delete Events',
        'Attendance / Events',
        NULL,
        '2026-08-25 14:26:55.855'
    ),
    (
        'cmt8rdp0z000pgsxcwwdchmfe',
        'attendance.events.manage',
        'Manage Events',
        'Attendance / Events',
        NULL,
        '2026-08-25 14:26:55.860'
    ),
    (
        'cmt8rdp14000qgsxcv426zp1w',
        'hr.employees.view',
        'View Employees',
        'Human Resources / Employees',
        NULL,
        '2026-08-25 14:26:55.865'
    ),
    (
        'cmt8rdp19000rgsxc5p6usaeh',
        'hr.employees.create',
        'Create Employees',
        'Human Resources / Employees',
        NULL,
        '2026-08-25 14:26:55.870'
    ),
    (
        'cmt8rdp1e000sgsxcjndc7ey4',
        'hr.employees.update',
        'Update Employees',
        'Human Resources / Employees',
        NULL,
        '2026-08-25 14:26:55.875'
    ),
    (
        'cmt8rdp1j000tgsxcfxtjyjvt',
        'hr.employees.delete',
        'Delete Employees',
        'Human Resources / Employees',
        NULL,
        '2026-08-25 14:26:55.880'
    ),
    (
        'cmt8rdp1o000ugsxcefp0od4j',
        'hr.employees.manage',
        'Manage Employees',
        'Human Resources / Employees',
        NULL,
        '2026-08-25 14:26:55.885'
    ),
    (
        'cmt8rdp1t000vgsxci0vwy1q9',
        'hr.positions.view',
        'View Positions',
        'Human Resources / Positions',
        NULL,
        '2026-08-25 14:26:55.890'
    ),
    (
        'cmt8rdp1y000wgsxc6kk4hdqn',
        'hr.positions.create',
        'Create Positions',
        'Human Resources / Positions',
        NULL,
        '2026-08-25 14:26:55.895'
    ),
    (
        'cmt8rdp23000xgsxcyvsxw1gl',
        'hr.positions.update',
        'Update Positions',
        'Human Resources / Positions',
        NULL,
        '2026-08-25 14:26:55.900'
    ),
    (
        'cmt8rdp28000ygsxczz7op110',
        'hr.positions.delete',
        'Delete Positions',
        'Human Resources / Positions',
        NULL,
        '2026-08-25 14:26:55.905'
    ),
    (
        'cmt8rdp2d000zgsxcflc3rdyo',
        'hr.positions.manage',
        'Manage Positions',
        'Human Resources / Positions',
        NULL,
        '2026-08-25 14:26:55.910'
    ),
    (
        'cmt8rdp2j0010gsxcmyvxm7uw',
        'hr.contracts.view',
        'View Contracts',
        'Human Resources / Contracts',
        NULL,
        '2026-08-25 14:26:55.915'
    ),
    (
        'cmt8rdp2n0011gsxcpa52tlok',
        'hr.contracts.create',
        'Create Contracts',
        'Human Resources / Contracts',
        NULL,
        '2026-08-25 14:26:55.920'
    ),
    (
        'cmt8rdp2s0012gsxcnyshffev',
        'hr.contracts.update',
        'Update Contracts',
        'Human Resources / Contracts',
        NULL,
        '2026-08-25 14:26:55.925'
    ),
    (
        'cmt8rdp2x0013gsxc35x8atwm',
        'hr.contracts.delete',
        'Delete Contracts',
        'Human Resources / Contracts',
        NULL,
        '2026-08-25 14:26:55.930'
    ),
    (
        'cmt8rdp320014gsxc6dg8nq4n',
        'hr.contracts.manage',
        'Manage Contracts',
        'Human Resources / Contracts',
        NULL,
        '2026-08-25 14:26:55.935'
    ),
    (
        'cmt8rdp3a0015gsxcoqfw1imc',
        'hr.salaries.view',
        'View Salaries',
        'Human Resources / Salaries',
        NULL,
        '2026-08-25 14:26:55.943'
    ),
    (
        'cmt8rdp3f0016gsxc99ao9yqo',
        'hr.salaries.create',
        'Create Salaries',
        'Human Resources / Salaries',
        NULL,
        '2026-08-25 14:26:55.948'
    ),
    (
        'cmt8rdp3k0017gsxcvs87jqkj',
        'hr.salaries.update',
        'Update Salaries',
        'Human Resources / Salaries',
        NULL,
        '2026-08-25 14:26:55.953'
    ),
    (
        'cmt8rdp3p0018gsxcb6agy58z',
        'hr.salaries.delete',
        'Delete Salaries',
        'Human Resources / Salaries',
        NULL,
        '2026-08-25 14:26:55.958'
    ),
    (
        'cmt8rdp3u0019gsxc3dxc4rp5',
        'hr.salaries.manage',
        'Manage Salaries',
        'Human Resources / Salaries',
        NULL,
        '2026-08-25 14:26:55.963'
    ),
    (
        'cmt8rdp3z001agsxcba9wfp1u',
        'hr.attendance.view',
        'View Attendance',
        'Human Resources / Attendance',
        NULL,
        '2026-08-25 14:26:55.968'
    ),
    (
        'cmt8rdp44001bgsxcjvbp7zdq',
        'hr.attendance.create',
        'Create Attendance',
        'Human Resources / Attendance',
        NULL,
        '2026-08-25 14:26:55.973'
    ),
    (
        'cmt8rdp49001cgsxc095u8mab',
        'hr.attendance.update',
        'Update Attendance',
        'Human Resources / Attendance',
        NULL,
        '2026-08-25 14:26:55.978'
    ),
    (
        'cmt8rdp4e001dgsxc0ftzebkf',
        'hr.attendance.delete',
        'Delete Attendance',
        'Human Resources / Attendance',
        NULL,
        '2026-08-25 14:26:55.983'
    ),
    (
        'cmt8rdp4j001egsxcwkux06l1',
        'hr.attendance.manage',
        'Manage Attendance',
        'Human Resources / Attendance',
        NULL,
        '2026-08-25 14:26:55.988'
    ),
    (
        'cmt8rdp4p001fgsxcpv4d771w',
        'hr.payrolls.view',
        'View Payrolls',
        'Human Resources / Payrolls',
        NULL,
        '2026-08-25 14:26:55.993'
    ),
    (
        'cmt8rdp4t001ggsxc9qcdcg86',
        'hr.payrolls.create',
        'Create Payrolls',
        'Human Resources / Payrolls',
        NULL,
        '2026-08-25 14:26:55.998'
    ),
    (
        'cmt8rdp4y001hgsxcjwl1uqko',
        'hr.payrolls.update',
        'Update Payrolls',
        'Human Resources / Payrolls',
        NULL,
        '2026-08-25 14:26:56.003'
    ),
    (
        'cmt8rdp53001igsxck72rynl1',
        'hr.payrolls.delete',
        'Delete Payrolls',
        'Human Resources / Payrolls',
        NULL,
        '2026-08-25 14:26:56.008'
    ),
    (
        'cmt8rdp58001jgsxce26p94u6',
        'hr.payrolls.manage',
        'Manage Payrolls',
        'Human Resources / Payrolls',
        NULL,
        '2026-08-25 14:26:56.013'
    ),
    (
        'cmt8rdp5d001kgsxcuen538wb',
        'hr.advances.view',
        'View Salary Advances',
        'Human Resources / Salary Advances',
        NULL,
        '2026-08-25 14:26:56.018'
    ),
    (
        'cmt8rdp5i001lgsxc0f50npoq',
        'hr.advances.create',
        'Create Salary Advances',
        'Human Resources / Salary Advances',
        NULL,
        '2026-08-25 14:26:56.023'
    ),
    (
        'cmt8rdp5q001mgsxcsg4vntsy',
        'hr.advances.update',
        'Update Salary Advances',
        'Human Resources / Salary Advances',
        NULL,
        '2026-08-25 14:26:56.031'
    ),
    (
        'cmt8rdp5v001ngsxcr5dsq9qt',
        'hr.advances.delete',
        'Delete Salary Advances',
        'Human Resources / Salary Advances',
        NULL,
        '2026-08-25 14:26:56.036'
    ),
    (
        'cmt8rdp60001ogsxcrwpyxkan',
        'hr.advances.manage',
        'Manage Salary Advances',
        'Human Resources / Salary Advances',
        NULL,
        '2026-08-25 14:26:56.041'
    ),
    (
        'cmt8rdp65001pgsxcq73jbunl',
        'healthcare.departments.view',
        'View Departments',
        'Healthcare / Departments',
        NULL,
        '2026-08-25 14:26:56.046'
    ),
    (
        'cmt8rdp6a001qgsxcj54e4x9z',
        'healthcare.departments.create',
        'Create Departments',
        'Healthcare / Departments',
        NULL,
        '2026-08-25 14:26:56.051'
    ),
    (
        'cmt8rdp6f001rgsxc9l2ty2n8',
        'healthcare.departments.update',
        'Update Departments',
        'Healthcare / Departments',
        NULL,
        '2026-08-25 14:26:56.056'
    ),
    (
        'cmt8rdp6k001sgsxctxn625oc',
        'healthcare.departments.delete',
        'Delete Departments',
        'Healthcare / Departments',
        NULL,
        '2026-08-25 14:26:56.061'
    ),
    (
        'cmt8rdp6r001tgsxc68oufksz',
        'healthcare.departments.manage',
        'Manage Departments',
        'Healthcare / Departments',
        NULL,
        '2026-08-25 14:26:56.068'
    ),
    (
        'cmt8rdp6z001ugsxcjzu9exlk',
        'healthcare.staff.view',
        'View Staff',
        'Healthcare / Staff',
        NULL,
        '2026-08-25 14:26:56.076'
    ),
    (
        'cmt8rdp75001vgsxczrwd9t8v',
        'healthcare.staff.create',
        'Create Staff',
        'Healthcare / Staff',
        NULL,
        '2026-08-25 14:26:56.082'
    ),
    (
        'cmt8rdp7a001wgsxc1nq9rf9t',
        'healthcare.staff.update',
        'Update Staff',
        'Healthcare / Staff',
        NULL,
        '2026-08-25 14:26:56.087'
    ),
    (
        'cmt8rdp7f001xgsxcra9gaqn2',
        'healthcare.staff.delete',
        'Delete Staff',
        'Healthcare / Staff',
        NULL,
        '2026-08-25 14:26:56.092'
    ),
    (
        'cmt8rdp7k001ygsxcvdshmxqz',
        'healthcare.staff.manage',
        'Manage Staff',
        'Healthcare / Staff',
        NULL,
        '2026-08-25 14:26:56.097'
    ),
    (
        'cmt8rdp7p001zgsxc4mmuhel5',
        'healthcare.appointments.view',
        'View Appointments',
        'Healthcare / Appointments',
        NULL,
        '2026-08-25 14:26:56.102'
    ),
    (
        'cmt8rdp7u0020gsxcbg2txp1t',
        'healthcare.appointments.create',
        'Create Appointments',
        'Healthcare / Appointments',
        NULL,
        '2026-08-25 14:26:56.107'
    ),
    (
        'cmt8rdp7z0021gsxc9sn6tly3',
        'healthcare.appointments.update',
        'Update Appointments',
        'Healthcare / Appointments',
        NULL,
        '2026-08-25 14:26:56.112'
    ),
    (
        'cmt8rdp850022gsxc2syinlxu',
        'healthcare.appointments.delete',
        'Delete Appointments',
        'Healthcare / Appointments',
        NULL,
        '2026-08-25 14:26:56.117'
    ),
    (
        'cmt8rdp8b0023gsxcd9jhyfut',
        'healthcare.appointments.manage',
        'Manage Appointments',
        'Healthcare / Appointments',
        NULL,
        '2026-08-25 14:26:56.124'
    ),
    (
        'cmt8rdp8g0024gsxcungawhdf',
        'healthcare.feedback.view',
        'View Feedback',
        'Healthcare / Feedback',
        NULL,
        '2026-08-25 14:26:56.129'
    ),
    (
        'cmt8rdp8m0025gsxc8ju322p7',
        'healthcare.feedback.create',
        'Create Feedback',
        'Healthcare / Feedback',
        NULL,
        '2026-08-25 14:26:56.135'
    ),
    (
        'cmt8rdp8s0026gsxcqkea210b',
        'healthcare.feedback.update',
        'Update Feedback',
        'Healthcare / Feedback',
        NULL,
        '2026-08-25 14:26:56.141'
    ),
    (
        'cmt8rdp8z0027gsxcc0o8zy75',
        'healthcare.feedback.delete',
        'Delete Feedback',
        'Healthcare / Feedback',
        NULL,
        '2026-08-25 14:26:56.148'
    ),
    (
        'cmt8rdp950028gsxco85hcdcu',
        'healthcare.feedback.manage',
        'Manage Feedback',
        'Healthcare / Feedback',
        NULL,
        '2026-08-25 14:26:56.154'
    ),
    (
        'cmt8rdp9b0029gsxc341gxcjh',
        'accounting.accounts.view',
        'View accounts',
        'Accounting / Accounts',
        NULL,
        '2026-08-25 14:26:56.160'
    ),
    (
        'cmt8rdp9g002agsxcqt5hcja1',
        'accounting.accounts.create',
        'Create accounts',
        'Accounting / Accounts',
        NULL,
        '2026-08-25 14:26:56.165'
    ),
    (
        'cmt8rdp9m002bgsxc5mffemnf',
        'accounting.accounts.update',
        'Update accounts',
        'Accounting / Accounts',
        NULL,
        '2026-08-25 14:26:56.171'
    ),
    (
        'cmt8rdp9r002cgsxc6f9lws1e',
        'accounting.accounts.delete',
        'Delete accounts',
        'Accounting / Accounts',
        NULL,
        '2026-08-25 14:26:56.176'
    ),
    (
        'cmt8rdp9x002dgsxc7thot10h',
        'accounting.accounts.manage',
        'Manage Accounts',
        'Accounting / Accounts',
        NULL,
        '2026-08-25 14:26:56.182'
    ),
    (
        'cmt8rdpa3002egsxcq2zuk1kj',
        'accounting.journals.view',
        'View journals',
        'Accounting / Journals',
        NULL,
        '2026-08-25 14:26:56.188'
    ),
    (
        'cmt8rdpa8002fgsxcrazj6m7e',
        'accounting.journals.create',
        'Create journals',
        'Accounting / Journals',
        NULL,
        '2026-08-25 14:26:56.193'
    ),
    (
        'cmt8rdpae002ggsxcxhgcq79s',
        'accounting.journals.update',
        'Update Journals',
        'Accounting / Journals',
        NULL,
        '2026-08-25 14:26:56.199'
    ),
    (
        'cmt8rdpak002hgsxc7tgdjv1z',
        'accounting.journals.delete',
        'Delete journals',
        'Accounting / Journals',
        NULL,
        '2026-08-25 14:26:56.205'
    ),
    (
        'cmt8rdpap002igsxcpal1g1dh',
        'accounting.journals.manage',
        'Manage Journals',
        'Accounting / Journals',
        NULL,
        '2026-08-25 14:26:56.210'
    ),
    (
        'cmt8rdpav002jgsxceaqvjpsg',
        'accounting.customers.view',
        'View customers',
        'Accounting / Customers',
        NULL,
        '2026-08-25 14:26:56.216'
    ),
    (
        'cmt8rdpb2002kgsxcch5rf40h',
        'accounting.customers.create',
        'Create customers',
        'Accounting / Customers',
        NULL,
        '2026-08-25 14:26:56.223'
    ),
    (
        'cmt8rdpb7002lgsxcsej9r9nc',
        'accounting.customers.update',
        'Update customers',
        'Accounting / Customers',
        NULL,
        '2026-08-25 14:26:56.228'
    ),
    (
        'cmt8rdpbc002mgsxc3rvqbhap',
        'accounting.customers.delete',
        'Delete customers',
        'Accounting / Customers',
        NULL,
        '2026-08-25 14:26:56.233'
    ),
    (
        'cmt8rdpbi002ngsxcghby9a6p',
        'accounting.customers.manage',
        'Manage Customers',
        'Accounting / Customers',
        NULL,
        '2026-08-25 14:26:56.239'
    ),
    (
        'cmt8rdpbp002ogsxcmif51561',
        'accounting.invoices.view',
        'View invoices',
        'Accounting / Invoices',
        NULL,
        '2026-08-25 14:26:56.245'
    ),
    (
        'cmt8rdpbu002pgsxc1gf9nkrf',
        'accounting.invoices.create',
        'Create invoices',
        'Accounting / Invoices',
        NULL,
        '2026-08-25 14:26:56.251'
    ),
    (
        'cmt8rdpc0002qgsxck3okg71p',
        'accounting.invoices.update',
        'Update invoices',
        'Accounting / Invoices',
        NULL,
        '2026-08-25 14:26:56.257'
    ),
    (
        'cmt8rdpc5002rgsxceogh47k3',
        'accounting.invoices.delete',
        'Delete invoices',
        'Accounting / Invoices',
        NULL,
        '2026-08-25 14:26:56.262'
    ),
    (
        'cmt8rdpcb002sgsxcg2uzft0m',
        'accounting.invoices.manage',
        'Manage Invoices',
        'Accounting / Invoices',
        NULL,
        '2026-08-25 14:26:56.268'
    ),
    (
        'cmt8rdpcg002tgsxcjtzw33a9',
        'accounting.payments.view',
        'View payments',
        'Accounting / Payments',
        NULL,
        '2026-08-25 14:26:56.273'
    ),
    (
        'cmt8rdpcm002ugsxc3suf5glo',
        'accounting.payments.create',
        'Create payments',
        'Accounting / Payments',
        NULL,
        '2026-08-25 14:26:56.279'
    ),
    (
        'cmt8rdpcr002vgsxcnyvr2cxf',
        'accounting.payments.update',
        'Update Payments',
        'Accounting / Payments',
        NULL,
        '2026-08-25 14:26:56.284'
    ),
    (
        'cmt8rdpcy002wgsxckjnp2uod',
        'accounting.payments.delete',
        'Delete Payments',
        'Accounting / Payments',
        NULL,
        '2026-08-25 14:26:56.290'
    ),
    (
        'cmt8rdpd2002xgsxcu0a50qwk',
        'accounting.payments.manage',
        'Manage Payments',
        'Accounting / Payments',
        NULL,
        '2026-08-25 14:26:56.295'
    ),
    (
        'cmt8rdpd7002ygsxcebv84lg9',
        'accounting.service_advances.view',
        'View service advances',
        'Accounting / Service Advances',
        NULL,
        '2026-08-25 14:26:56.300'
    ),
    (
        'cmt8rdpdd002zgsxc6c7mdnoo',
        'accounting.service_advances.create',
        'Create service advances',
        'Accounting / Service Advances',
        NULL,
        '2026-08-25 14:26:56.306'
    ),
    (
        'cmt8rdpdk0030gsxc9s5ut3d7',
        'accounting.service_advances.update',
        'Update service advances',
        'Accounting / Service Advances',
        NULL,
        '2026-08-25 14:26:56.313'
    ),
    (
        'cmt8rdpdp0031gsxcu22f7prz',
        'accounting.service_advances.delete',
        'Delete service advances',
        'Accounting / Service Advances',
        NULL,
        '2026-08-25 14:26:56.318'
    ),
    (
        'cmt8rdpdu0032gsxcwm7uz169',
        'accounting.service_advances.manage',
        'Manage Service Advances',
        'Accounting / Service Advances',
        NULL,
        '2026-08-25 14:26:56.323'
    ),
    (
        'cmt8rdpe00033gsxcx6qcrzox',
        'accounting.reports.view',
        'View accounting reports',
        'Accounting / Reports',
        NULL,
        '2026-08-25 14:26:56.329'
    ),
    (
        'cmt8rdpe50034gsxc5op9e8hx',
        'accounting.reports.create',
        'Create Reports',
        'Accounting / Reports',
        NULL,
        '2026-08-25 14:26:56.334'
    ),
    (
        'cmt8rdpea0035gsxcpavml4ej',
        'accounting.reports.update',
        'Update Reports',
        'Accounting / Reports',
        NULL,
        '2026-08-25 14:26:56.339'
    ),
    (
        'cmt8rdpeg0036gsxc5jlhmzgh',
        'accounting.reports.delete',
        'Delete Reports',
        'Accounting / Reports',
        NULL,
        '2026-08-25 14:26:56.345'
    ),
    (
        'cmt8rdpem0037gsxcekumt4ka',
        'accounting.reports.manage',
        'Manage Reports',
        'Accounting / Reports',
        NULL,
        '2026-08-25 14:26:56.351'
    ),
    (
        'cmt8rdpet0038gsxcsvzmea45',
        'finance.budgets.view',
        'View Budgets',
        'Finance / Budgets',
        NULL,
        '2026-08-25 14:26:56.357'
    ),
    (
        'cmt8rdpex0039gsxcef8pbn7l',
        'finance.budgets.create',
        'Create Budgets',
        'Finance / Budgets',
        NULL,
        '2026-08-25 14:26:56.362'
    ),
    (
        'cmt8rdpf3003agsxcreed0sg5',
        'finance.budgets.update',
        'Update Budgets',
        'Finance / Budgets',
        NULL,
        '2026-08-25 14:26:56.368'
    ),
    (
        'cmt8rdpf8003bgsxcgvhhk8cs',
        'finance.budgets.delete',
        'Delete Budgets',
        'Finance / Budgets',
        NULL,
        '2026-08-25 14:26:56.373'
    ),
    (
        'cmt8rdpfe003cgsxc6aq9cr66',
        'finance.budgets.manage',
        'Manage Budgets',
        'Finance / Budgets',
        NULL,
        '2026-08-25 14:26:56.379'
    ),
    (
        'cmt8rdpfj003dgsxcnuqg6ic0',
        'finance.cash-flow.view',
        'View Cash Flow',
        'Finance / Cash Flow',
        NULL,
        '2026-08-25 14:26:56.384'
    ),
    (
        'cmt8rdpfq003egsxcuo3wcjie',
        'finance.cash-flow.create',
        'Create Cash Flow',
        'Finance / Cash Flow',
        NULL,
        '2026-08-25 14:26:56.390'
    ),
    (
        'cmt8rdpfu003fgsxc9dvlj8mi',
        'finance.cash-flow.update',
        'Update Cash Flow',
        'Finance / Cash Flow',
        NULL,
        '2026-08-25 14:26:56.395'
    ),
    (
        'cmt8rdpg0003ggsxc45es3muk',
        'finance.cash-flow.delete',
        'Delete Cash Flow',
        'Finance / Cash Flow',
        NULL,
        '2026-08-25 14:26:56.401'
    ),
    (
        'cmt8rdpg5003hgsxcmdsn1u6g',
        'finance.cash-flow.manage',
        'Manage Cash Flow',
        'Finance / Cash Flow',
        NULL,
        '2026-08-25 14:26:56.406'
    ),
    (
        'cmt8rdpgc003igsxcf9qnvoz3',
        'finance.forecasts.view',
        'View Forecasts',
        'Finance / Forecasts',
        NULL,
        '2026-08-25 14:26:56.413'
    ),
    (
        'cmt8rdpgh003jgsxcdikwbcqz',
        'finance.forecasts.create',
        'Create Forecasts',
        'Finance / Forecasts',
        NULL,
        '2026-08-25 14:26:56.418'
    ),
    (
        'cmt8rdpgn003kgsxccee9u9jl',
        'finance.forecasts.update',
        'Update Forecasts',
        'Finance / Forecasts',
        NULL,
        '2026-08-25 14:26:56.424'
    ),
    (
        'cmt8rdpgs003lgsxcc6um1nk0',
        'finance.forecasts.delete',
        'Delete Forecasts',
        'Finance / Forecasts',
        NULL,
        '2026-08-25 14:26:56.429'
    ),
    (
        'cmt8rdpgz003mgsxc1n376zl6',
        'finance.forecasts.manage',
        'Manage Forecasts',
        'Finance / Forecasts',
        NULL,
        '2026-08-25 14:26:56.435'
    ),
    (
        'cmt8rdph3003ngsxczuay38cn',
        'finance.analysis.view',
        'View Analysis',
        'Finance / Analysis',
        NULL,
        '2026-08-25 14:26:56.440'
    ),
    (
        'cmt8rdphb003ogsxcox7hjnd1',
        'finance.analysis.create',
        'Create Analysis',
        'Finance / Analysis',
        NULL,
        '2026-08-25 14:26:56.448'
    ),
    (
        'cmt8rdphi003pgsxc3lkicnm7',
        'finance.analysis.update',
        'Update Analysis',
        'Finance / Analysis',
        NULL,
        '2026-08-25 14:26:56.455'
    ),
    (
        'cmt8rdpho003qgsxc19n96z9t',
        'finance.analysis.delete',
        'Delete Analysis',
        'Finance / Analysis',
        NULL,
        '2026-08-25 14:26:56.461'
    ),
    (
        'cmt8rdpht003rgsxcvljqrwa8',
        'finance.analysis.manage',
        'Manage Analysis',
        'Finance / Analysis',
        NULL,
        '2026-08-25 14:26:56.466'
    ),
    (
        'cmt8rdphz003sgsxc8tt02nt1',
        'finance.funding.view',
        'View Funding',
        'Finance / Funding',
        NULL,
        '2026-08-25 14:26:56.472'
    ),
    (
        'cmt8rdpi6003tgsxco8qu6sm5',
        'finance.funding.create',
        'Create Funding',
        'Finance / Funding',
        NULL,
        '2026-08-25 14:26:56.478'
    ),
    (
        'cmt8rdpia003ugsxcaz6zzcb9',
        'finance.funding.update',
        'Update Funding',
        'Finance / Funding',
        NULL,
        '2026-08-25 14:26:56.483'
    ),
    (
        'cmt8rdpif003vgsxccku4edmg',
        'finance.funding.delete',
        'Delete Funding',
        'Finance / Funding',
        NULL,
        '2026-08-25 14:26:56.488'
    ),
    (
        'cmt8rdpil003wgsxc6y5uqhu3',
        'finance.funding.manage',
        'Manage Funding',
        'Finance / Funding',
        NULL,
        '2026-08-25 14:26:56.494'
    ),
    (
        'cmt8rdpiq003xgsxcu5lkacyg',
        'inventory.brands.view',
        'View Brands',
        'Inventory / Brands',
        NULL,
        '2026-08-25 14:26:56.499'
    ),
    (
        'cmt8rdpiv003ygsxcwajzh0rr',
        'inventory.brands.create',
        'Create Brands',
        'Inventory / Brands',
        NULL,
        '2026-08-25 14:26:56.504'
    ),
    (
        'cmt8rdpj1003zgsxc1bz6tipc',
        'inventory.brands.update',
        'Update Brands',
        'Inventory / Brands',
        NULL,
        '2026-08-25 14:26:56.510'
    ),
    (
        'cmt8rdpj60040gsxcadqs6cww',
        'inventory.brands.delete',
        'Delete Brands',
        'Inventory / Brands',
        NULL,
        '2026-08-25 14:26:56.515'
    ),
    (
        'cmt8rdpjc0041gsxcciwhezwu',
        'inventory.brands.manage',
        'Manage Brands',
        'Inventory / Brands',
        NULL,
        '2026-08-25 14:26:56.521'
    ),
    (
        'cmt8rdpjh0042gsxcxjacyazf',
        'inventory.products.view',
        'View Products',
        'Inventory / Products',
        NULL,
        '2026-08-25 14:26:56.526'
    ),
    (
        'cmt8rdpjo0043gsxc28guwbx2',
        'inventory.products.create',
        'Create Products',
        'Inventory / Products',
        NULL,
        '2026-08-25 14:26:56.533'
    ),
    (
        'cmt8rdpjt0044gsxcn8qv7cc8',
        'inventory.products.update',
        'Update Products',
        'Inventory / Products',
        NULL,
        '2026-08-25 14:26:56.538'
    ),
    (
        'cmt8rdpjy0045gsxc2fw4o5ax',
        'inventory.products.delete',
        'Delete Products',
        'Inventory / Products',
        NULL,
        '2026-08-25 14:26:56.543'
    ),
    (
        'cmt8rdpk40046gsxcsg3z3nw8',
        'inventory.products.manage',
        'Manage Products',
        'Inventory / Products',
        NULL,
        '2026-08-25 14:26:56.549'
    ),
    (
        'cmt8rdpk90047gsxc88049xxa',
        'inventory.barcodes.view',
        'View Barcodes',
        'Inventory / Barcodes',
        NULL,
        '2026-08-25 14:26:56.554'
    ),
    (
        'cmt8rdpkf0048gsxcqgdcl5ry',
        'inventory.barcodes.create',
        'Create Barcodes',
        'Inventory / Barcodes',
        NULL,
        '2026-08-25 14:26:56.560'
    ),
    (
        'cmt8rdpkk0049gsxc9aadrr0w',
        'inventory.barcodes.update',
        'Update Barcodes',
        'Inventory / Barcodes',
        NULL,
        '2026-08-25 14:26:56.565'
    ),
    (
        'cmt8rdpkq004agsxch3wez6it',
        'inventory.barcodes.delete',
        'Delete Barcodes',
        'Inventory / Barcodes',
        NULL,
        '2026-08-25 14:26:56.571'
    ),
    (
        'cmt8rdpkv004bgsxczf7v9v0u',
        'inventory.barcodes.manage',
        'Manage Barcodes',
        'Inventory / Barcodes',
        NULL,
        '2026-08-25 14:26:56.576'
    ),
    (
        'cmt8rdpl0004cgsxc9q27h02v',
        'inventory.categories.view',
        'View Categories',
        'Inventory / Categories',
        NULL,
        '2026-08-25 14:26:56.581'
    ),
    (
        'cmt8rdpl5004dgsxc5q5o5yhv',
        'inventory.categories.create',
        'Create Categories',
        'Inventory / Categories',
        NULL,
        '2026-08-25 14:26:56.586'
    ),
    (
        'cmt8rdpla004egsxc6r0padc1',
        'inventory.categories.update',
        'Update Categories',
        'Inventory / Categories',
        NULL,
        '2026-08-25 14:26:56.591'
    ),
    (
        'cmt8rdplf004fgsxcrrnclhx0',
        'inventory.categories.delete',
        'Delete Categories',
        'Inventory / Categories',
        NULL,
        '2026-08-25 14:26:56.596'
    ),
    (
        'cmt8rdplk004ggsxc2gtqwsw0',
        'inventory.categories.manage',
        'Manage Categories',
        'Inventory / Categories',
        NULL,
        '2026-08-25 14:26:56.601'
    ),
    (
        'cmt8rdplp004hgsxcp1ic8iv2',
        'inventory.warehouses.view',
        'View Warehouses',
        'Inventory / Warehouses',
        NULL,
        '2026-08-25 14:26:56.606'
    ),
    (
        'cmt8rdplu004igsxcsbukzzny',
        'inventory.warehouses.create',
        'Create Warehouses',
        'Inventory / Warehouses',
        NULL,
        '2026-08-25 14:26:56.611'
    ),
    (
        'cmt8rdplz004jgsxcava68yuv',
        'inventory.warehouses.update',
        'Update Warehouses',
        'Inventory / Warehouses',
        NULL,
        '2026-08-25 14:26:56.616'
    ),
    (
        'cmt8rdpm6004kgsxckfrwwuab',
        'inventory.warehouses.delete',
        'Delete Warehouses',
        'Inventory / Warehouses',
        NULL,
        '2026-08-25 14:26:56.623'
    ),
    (
        'cmt8rdpmb004lgsxcwfu73b3b',
        'inventory.warehouses.manage',
        'Manage Warehouses',
        'Inventory / Warehouses',
        NULL,
        '2026-08-25 14:26:56.628'
    ),
    (
        'cmt8rdpmg004mgsxc69cai7ay',
        'inventory.stock.view',
        'View Stock',
        'Inventory / Stock',
        NULL,
        '2026-08-25 14:26:56.633'
    ),
    (
        'cmt8rdpml004ngsxcu4n0v1zt',
        'inventory.stock.create',
        'Create Stock',
        'Inventory / Stock',
        NULL,
        '2026-08-25 14:26:56.638'
    ),
    (
        'cmt8rdpmq004ogsxck8v644ak',
        'inventory.stock.update',
        'Update Stock',
        'Inventory / Stock',
        NULL,
        '2026-08-25 14:26:56.643'
    ),
    (
        'cmt8rdpmw004pgsxcacxw9iug',
        'inventory.stock.delete',
        'Delete Stock',
        'Inventory / Stock',
        NULL,
        '2026-08-25 14:26:56.649'
    ),
    (
        'cmt8rdpn2004qgsxcfvoe7c8g',
        'inventory.stock.manage',
        'Manage Stock',
        'Inventory / Stock',
        NULL,
        '2026-08-25 14:26:56.654'
    ),
    (
        'cmt8rdpn6004rgsxc2xj38px3',
        'inventory.movements.view',
        'View Movements',
        'Inventory / Movements',
        NULL,
        '2026-08-25 14:26:56.659'
    ),
    (
        'cmt8rdpnb004sgsxcto4ejsej',
        'inventory.movements.create',
        'Create Movements',
        'Inventory / Movements',
        NULL,
        '2026-08-25 14:26:56.664'
    ),
    (
        'cmt8rdpng004tgsxc7ukb3yka',
        'inventory.movements.update',
        'Update Movements',
        'Inventory / Movements',
        NULL,
        '2026-08-25 14:26:56.669'
    ),
    (
        'cmt8rdpnl004ugsxcw4ytjorm',
        'inventory.movements.delete',
        'Delete Movements',
        'Inventory / Movements',
        NULL,
        '2026-08-25 14:26:56.674'
    ),
    (
        'cmt8rdpnq004vgsxckz6jaax8',
        'inventory.movements.manage',
        'Manage Movements',
        'Inventory / Movements',
        NULL,
        '2026-08-25 14:26:56.679'
    ),
    (
        'cmt8rdpnv004wgsxcbwn769zr',
        'pos.checkout.view',
        'View Checkout',
        'Point of Sale / Checkout',
        NULL,
        '2026-08-25 14:26:56.684'
    ),
    (
        'cmt8rdpo0004xgsxc61646ru1',
        'pos.checkout.create',
        'Create Checkout',
        'Point of Sale / Checkout',
        NULL,
        '2026-08-25 14:26:56.689'
    ),
    (
        'cmt8rdpo5004ygsxc9z0sijjn',
        'pos.checkout.update',
        'Update Checkout',
        'Point of Sale / Checkout',
        NULL,
        '2026-08-25 14:26:56.694'
    ),
    (
        'cmt8rdpoa004zgsxcp65sbqu3',
        'pos.checkout.delete',
        'Delete Checkout',
        'Point of Sale / Checkout',
        NULL,
        '2026-08-25 14:26:56.699'
    ),
    (
        'cmt8rdpof0050gsxc3cv8121p',
        'pos.checkout.manage',
        'Manage Checkout',
        'Point of Sale / Checkout',
        NULL,
        '2026-08-25 14:26:56.704'
    ),
    (
        'cmt8rdpol0051gsxc1yig8xsj',
        'pos.sales.view',
        'View Sales History',
        'Point of Sale / Sales History',
        NULL,
        '2026-08-25 14:26:56.709'
    ),
    (
        'cmt8rdpos0052gsxcgxcjofqi',
        'pos.sales.create',
        'Create Sales History',
        'Point of Sale / Sales History',
        NULL,
        '2026-08-25 14:26:56.717'
    ),
    (
        'cmt8rdpoy0053gsxcaopg25p3',
        'pos.sales.update',
        'Update Sales History',
        'Point of Sale / Sales History',
        NULL,
        '2026-08-25 14:26:56.723'
    ),
    (
        'cmt8rdpp30054gsxcf3nig5d0',
        'pos.sales.delete',
        'Delete Sales History',
        'Point of Sale / Sales History',
        NULL,
        '2026-08-25 14:26:56.728'
    ),
    (
        'cmt8rdpp80055gsxc4gc5kcf2',
        'pos.sales.manage',
        'Manage Sales History',
        'Point of Sale / Sales History',
        NULL,
        '2026-08-25 14:26:56.733'
    ),
    (
        'cmt8rdppd0056gsxcxshzqt4h',
        'accounting.journals.post',
        'Post journals',
        'Accounting / Journals',
        NULL,
        '2026-08-25 14:26:56.738'
    ),
    (
        'cmt8rjfac0000gsuzjeypk89d',
        'users.view',
        'View users',
        'Users',
        NULL,
        '2026-08-25 14:31:23.173'
    ),
    (
        'cmt8rjfal0001gsuzrbhn4p30',
        'users.create',
        'Create users',
        'Users',
        NULL,
        '2026-08-25 14:31:23.181'
    ),
    (
        'cmt8rjfar0002gsuzqlqdo74t',
        'users.update',
        'Update users',
        'Users',
        NULL,
        '2026-08-25 14:31:23.187'
    ),
    (
        'cmt8rjfay0003gsuz08bptu6o',
        'users.delete',
        'Delete users',
        'Users',
        NULL,
        '2026-08-25 14:31:23.194'
    ),
    (
        'cmt8rjfb30004gsuz7v2rz5jx',
        'roles.view',
        'View roles',
        'Access Control',
        NULL,
        '2026-08-25 14:31:23.199'
    ),
    (
        'cmt8rjfb80005gsuz28tqfet9',
        'roles.create',
        'Create roles',
        'Access Control',
        NULL,
        '2026-08-25 14:31:23.204'
    ),
    (
        'cmt8rjfbd0006gsuztyyrwj77',
        'roles.update',
        'Update roles',
        'Access Control',
        NULL,
        '2026-08-25 14:31:23.209'
    ),
    (
        'cmt8rjfbi0007gsuzp47azlmg',
        'roles.delete',
        'Delete roles',
        'Access Control',
        NULL,
        '2026-08-25 14:31:23.214'
    ),
    (
        'cmt8rjfbn0008gsuzmxtt562h',
        'roles.assign_permissions',
        'Assign permissions',
        'Access Control',
        NULL,
        '2026-08-25 14:31:23.219'
    ),
    (
        'cmt8rjfbs0009gsuzs60ikxa0',
        'permissions.view',
        'View permissions',
        'Access Control',
        NULL,
        '2026-08-25 14:31:23.224'
    ),
    (
        'cmt8rjfbz000agsuzooxerubi',
        'dashboard.view',
        'View dashboard',
        'Dashboard',
        NULL,
        '2026-08-25 14:31:23.231'
    ),
    (
        'cmt8rjfc4000bgsuz9pm5mutx',
        'employees.view',
        'View employees',
        'Human Resources',
        NULL,
        '2026-08-25 14:31:23.236'
    ),
    (
        'cmt8rjfce000cgsuzda49ut8h',
        'employees.manage',
        'Manage employees',
        'Human Resources',
        NULL,
        '2026-08-25 14:31:23.246'
    ),
    (
        'cmt8rjfck000dgsuzktvu9gxo',
        'payroll.process',
        'Process payroll',
        'Human Resources',
        NULL,
        '2026-08-25 14:31:23.253'
    ),
    (
        'cmt8rjfct000egsuzl8to9b5w',
        'inventory.view',
        'View inventory',
        'Inventory',
        NULL,
        '2026-08-25 14:31:23.261'
    ),
    (
        'cmt8rjfcz000fgsuz30vxahkb',
        'inventory.manage',
        'Manage inventory',
        'Inventory',
        NULL,
        '2026-08-25 14:31:23.267'
    ),
    (
        'cmt8rjfd3000ggsuz2ks6wheu',
        'inventory.adjust',
        'Adjust stock',
        'Inventory',
        NULL,
        '2026-08-25 14:31:23.272'
    ),
    (
        'cmt8rjfd9000igsuzrgplc4f9',
        'finance.view',
        'View finances',
        'Accounting',
        NULL,
        '2026-08-25 14:31:23.278'
    ),
    (
        'cmt8rjfdf000jgsuzhuqdhjfe',
        'journal.create',
        'Create journals',
        'Accounting',
        NULL,
        '2026-08-25 14:31:23.284'
    ),
    (
        'cmt8rjfdk000kgsuzumlgg948',
        'reports.generate',
        'Generate reports',
        'Reports',
        NULL,
        '2026-08-25 14:31:23.289'
    ),
    (
        'cmtewcnum0001gs94qyieie6r',
        'meetings.create',
        'Create department meetings',
        'Meetings',
        NULL,
        '2026-08-29 21:32:42.815'
    );
/*!40000 ALTER TABLE `access_Permission` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `access_Role`
--

DROP TABLE IF EXISTS `access_Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `access_Role` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `Role_name_key` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `access_Role`
--

LOCK TABLES `access_Role` WRITE;
/*!40000 ALTER TABLE `access_Role` DISABLE KEYS */
;
INSERT INTO
    `access_Role`
VALUES (
        'cmt8rdppj0057gsxcdiyzh1w0',
        'Cashier',
        'Point-of-sale and own-profile access only',
        '2026-08-25 14:26:56.744',
        '2026-08-31 21:55:56.155'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'Super Administrator',
        'Unrestricted access to every current and future system capability',
        '2026-08-25 14:31:23.413',
        '2026-08-31 21:55:56.114'
    ),
    (
        'cmt8rjfv0001cgsuzhs7cbkmx',
        'Employee',
        'Standard employee self-service access',
        '2026-08-25 14:31:23.916',
        '2026-08-31 21:55:56.627'
    ),
    (
        'cmths28a6001agssld7e6abmq',
        'Accountant',
        'Manages accounts, journal entries and financial reports',
        '2026-08-31 21:55:56.143',
        '2026-08-31 21:55:56.143'
    ),
    (
        'cmths2915003rgssl3ri32ina',
        'Seed Role 01',
        'SEED: Access role 01',
        '2026-08-31 21:55:57.113',
        '2026-08-31 21:55:57.113'
    ),
    (
        'cmths292w0041gsslcxupwrxy',
        'Seed Role 02',
        'SEED: Access role 02',
        '2026-08-31 21:55:57.177',
        '2026-08-31 21:55:57.177'
    ),
    (
        'cmths294g004bgsslu9c8f0qs',
        'Seed Role 03',
        'SEED: Access role 03',
        '2026-08-31 21:55:57.233',
        '2026-08-31 21:55:57.233'
    ),
    (
        'cmths295z004lgssl8pk916qe',
        'Seed Role 04',
        'SEED: Access role 04',
        '2026-08-31 21:55:57.288',
        '2026-08-31 21:55:57.288'
    ),
    (
        'cmths297c004vgsslhf0h7yth',
        'Seed Role 05',
        'SEED: Access role 05',
        '2026-08-31 21:55:57.337',
        '2026-08-31 21:55:57.337'
    ),
    (
        'cmths298q0055gsslkoaaiant',
        'Seed Role 06',
        'SEED: Access role 06',
        '2026-08-31 21:55:57.387',
        '2026-08-31 21:55:57.387'
    ),
    (
        'cmths29a6005fgsslpksi41et',
        'Seed Role 07',
        'SEED: Access role 07',
        '2026-08-31 21:55:57.439',
        '2026-08-31 21:55:57.439'
    ),
    (
        'cmths29bm005pgssl6neourf9',
        'Seed Role 08',
        'SEED: Access role 08',
        '2026-08-31 21:55:57.491',
        '2026-08-31 21:55:57.491'
    ),
    (
        'cmths29cx005zgsslfwnnyznm',
        'Seed Role 09',
        'SEED: Access role 09',
        '2026-08-31 21:55:57.538',
        '2026-08-31 21:55:57.538'
    ),
    (
        'cmths29ei0069gssl09hkvfo7',
        'Seed Role 10',
        'SEED: Access role 10',
        '2026-08-31 21:55:57.595',
        '2026-08-31 21:55:57.595'
    );
/*!40000 ALTER TABLE `access_Role` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `access_RolePermission`
--

DROP TABLE IF EXISTS `access_RolePermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `access_RolePermission` (
    `roleId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `permissionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`roleId`, `permissionId`),
    KEY `role_permission_permissionId_fkey` (`permissionId`),
    CONSTRAINT `role_permission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `access_Permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `role_permission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `access_Role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `access_RolePermission`
--

LOCK TABLES `access_RolePermission` WRITE;
/*!40000 ALTER TABLE `access_RolePermission` DISABLE KEYS */
;
INSERT INTO
    `access_RolePermission`
VALUES (
        'cmt8rdppj0057gsxcdiyzh1w0',
        'cmt8rdox60000gsxc59hp29w4'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdox60000gsxc59hp29w4'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdoxd0001gsxc658d7b7x'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdoxk0002gsxc7ofi3sqt'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdoxp0003gsxcgpww7sie'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdoxu0004gsxct7yqob1u'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdoxz0005gsxcpg73ytmf'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdoy60006gsxckras56l3'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdoyb0007gsxc469hkkgg'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdoyg0008gsxcfptrbbn5'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdoym0009gsxcsk0qlauz'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdoyq000agsxcf4fv1p2o'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdoyv000bgsxcrvvblgst'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdoz2000cgsxcayou9981'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdoz6000dgsxcyzuwefzo'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdozc000egsxcvru84rrt'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdozh000fgsxckc6re1on'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdozn000ggsxck2im674g'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdozs000hgsxc33i9fo4z'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdozx000igsxcqiob8vcs'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp02000jgsxcpzck3nwd'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp08000kgsxcuctqplrx'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp0d000lgsxc2dlbsyed'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp0i000mgsxcvp7cli17'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp0p000ngsxcaifyw3bs'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp0u000ogsxckv6znv8h'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp0z000pgsxcwwdchmfe'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp14000qgsxcv426zp1w'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp19000rgsxc5p6usaeh'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp1e000sgsxcjndc7ey4'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp1j000tgsxcfxtjyjvt'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp1o000ugsxcefp0od4j'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp1t000vgsxci0vwy1q9'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp1y000wgsxc6kk4hdqn'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp23000xgsxcyvsxw1gl'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp28000ygsxczz7op110'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp2d000zgsxcflc3rdyo'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp2j0010gsxcmyvxm7uw'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp2n0011gsxcpa52tlok'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp2s0012gsxcnyshffev'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp2x0013gsxc35x8atwm'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp320014gsxc6dg8nq4n'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp3a0015gsxcoqfw1imc'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp3f0016gsxc99ao9yqo'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp3k0017gsxcvs87jqkj'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp3p0018gsxcb6agy58z'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp3u0019gsxc3dxc4rp5'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp3z001agsxcba9wfp1u'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp44001bgsxcjvbp7zdq'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp49001cgsxc095u8mab'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp4e001dgsxc0ftzebkf'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp4j001egsxcwkux06l1'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp4p001fgsxcpv4d771w'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp4t001ggsxc9qcdcg86'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp4y001hgsxcjwl1uqko'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp53001igsxck72rynl1'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp58001jgsxce26p94u6'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp5d001kgsxcuen538wb'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp5i001lgsxc0f50npoq'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp5q001mgsxcsg4vntsy'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp5v001ngsxcr5dsq9qt'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp60001ogsxcrwpyxkan'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp65001pgsxcq73jbunl'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp6a001qgsxcj54e4x9z'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp6f001rgsxc9l2ty2n8'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp6k001sgsxctxn625oc'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp6r001tgsxc68oufksz'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp6z001ugsxcjzu9exlk'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp75001vgsxczrwd9t8v'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp7a001wgsxc1nq9rf9t'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp7f001xgsxcra9gaqn2'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp7k001ygsxcvdshmxqz'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp7p001zgsxc4mmuhel5'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp7u0020gsxcbg2txp1t'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp7z0021gsxc9sn6tly3'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp850022gsxc2syinlxu'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp8b0023gsxcd9jhyfut'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp8g0024gsxcungawhdf'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp8m0025gsxc8ju322p7'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp8s0026gsxcqkea210b'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp8z0027gsxcc0o8zy75'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp950028gsxco85hcdcu'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp9b0029gsxc341gxcjh'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp9g002agsxcqt5hcja1'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp9m002bgsxc5mffemnf'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp9r002cgsxc6f9lws1e'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdp9x002dgsxc7thot10h'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpa3002egsxcq2zuk1kj'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpa8002fgsxcrazj6m7e'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpae002ggsxcxhgcq79s'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpak002hgsxc7tgdjv1z'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpap002igsxcpal1g1dh'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpav002jgsxceaqvjpsg'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpb2002kgsxcch5rf40h'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpb7002lgsxcsej9r9nc'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpbc002mgsxc3rvqbhap'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpbi002ngsxcghby9a6p'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpbp002ogsxcmif51561'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpbu002pgsxc1gf9nkrf'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpc0002qgsxck3okg71p'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpc5002rgsxceogh47k3'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpcb002sgsxcg2uzft0m'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpcg002tgsxcjtzw33a9'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpcm002ugsxc3suf5glo'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpcr002vgsxcnyvr2cxf'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpcy002wgsxckjnp2uod'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpd2002xgsxcu0a50qwk'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpd7002ygsxcebv84lg9'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpdd002zgsxc6c7mdnoo'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpdk0030gsxc9s5ut3d7'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpdp0031gsxcu22f7prz'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpdu0032gsxcwm7uz169'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpe00033gsxcx6qcrzox'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpe50034gsxc5op9e8hx'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpea0035gsxcpavml4ej'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpeg0036gsxc5jlhmzgh'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpem0037gsxcekumt4ka'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpet0038gsxcsvzmea45'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpex0039gsxcef8pbn7l'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpf3003agsxcreed0sg5'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpf8003bgsxcgvhhk8cs'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpfe003cgsxc6aq9cr66'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpfj003dgsxcnuqg6ic0'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpfq003egsxcuo3wcjie'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpfu003fgsxc9dvlj8mi'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpg0003ggsxc45es3muk'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpg5003hgsxcmdsn1u6g'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpgc003igsxcf9qnvoz3'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpgh003jgsxcdikwbcqz'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpgn003kgsxccee9u9jl'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpgs003lgsxcc6um1nk0'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpgz003mgsxc1n376zl6'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdph3003ngsxczuay38cn'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdphb003ogsxcox7hjnd1'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdphi003pgsxc3lkicnm7'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpho003qgsxc19n96z9t'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpht003rgsxcvljqrwa8'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdphz003sgsxc8tt02nt1'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpi6003tgsxco8qu6sm5'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpia003ugsxcaz6zzcb9'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpif003vgsxccku4edmg'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpil003wgsxc6y5uqhu3'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpiq003xgsxcu5lkacyg'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpiv003ygsxcwajzh0rr'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpj1003zgsxc1bz6tipc'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpj60040gsxcadqs6cww'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpjc0041gsxcciwhezwu'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpjh0042gsxcxjacyazf'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpjo0043gsxc28guwbx2'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpjt0044gsxcn8qv7cc8'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpjy0045gsxc2fw4o5ax'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpk40046gsxcsg3z3nw8'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpk90047gsxc88049xxa'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpkf0048gsxcqgdcl5ry'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpkk0049gsxc9aadrr0w'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpkq004agsxch3wez6it'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpkv004bgsxczf7v9v0u'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpl0004cgsxc9q27h02v'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpl5004dgsxc5q5o5yhv'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpla004egsxc6r0padc1'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdplf004fgsxcrrnclhx0'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdplk004ggsxc2gtqwsw0'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdplp004hgsxcp1ic8iv2'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdplu004igsxcsbukzzny'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdplz004jgsxcava68yuv'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpm6004kgsxckfrwwuab'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpmb004lgsxcwfu73b3b'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpmg004mgsxc69cai7ay'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpml004ngsxcu4n0v1zt'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpmq004ogsxck8v644ak'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpmw004pgsxcacxw9iug'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpn2004qgsxcfvoe7c8g'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpn6004rgsxc2xj38px3'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpnb004sgsxcto4ejsej'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpng004tgsxc7ukb3yka'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpnl004ugsxcw4ytjorm'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpnq004vgsxckz6jaax8'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpnv004wgsxcbwn769zr'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpo0004xgsxc61646ru1'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpo5004ygsxc9z0sijjn'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpoa004zgsxcp65sbqu3'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpof0050gsxc3cv8121p'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpol0051gsxc1yig8xsj'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpos0052gsxcgxcjofqi'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpoy0053gsxcaopg25p3'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpp30054gsxcf3nig5d0'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdpp80055gsxc4gc5kcf2'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rdppd0056gsxcxshzqt4h'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfac0000gsuzjeypk89d'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfal0001gsuzrbhn4p30'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfar0002gsuzqlqdo74t'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfay0003gsuz08bptu6o'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfb30004gsuz7v2rz5jx'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfb80005gsuz28tqfet9'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfbd0006gsuztyyrwj77'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfbi0007gsuzp47azlmg'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfbn0008gsuzmxtt562h'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfbs0009gsuzs60ikxa0'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfbz000agsuzooxerubi'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfc4000bgsuz9pm5mutx'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfce000cgsuzda49ut8h'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfck000dgsuzktvu9gxo'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfct000egsuzl8to9b5w'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfcz000fgsuz30vxahkb'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfd3000ggsuz2ks6wheu'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfd9000igsuzrgplc4f9'
    ),
    (
        'cmths28a6001agssld7e6abmq',
        'cmt8rjfd9000igsuzrgplc4f9'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfdf000jgsuzhuqdhjfe'
    ),
    (
        'cmths28a6001agssld7e6abmq',
        'cmt8rjfdf000jgsuzhuqdhjfe'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmt8rjfdk000kgsuzumlgg948'
    ),
    (
        'cmths28a6001agssld7e6abmq',
        'cmt8rjfdk000kgsuzumlgg948'
    ),
    (
        'cmt8rjfh10018gsuz4e7wcuca',
        'cmtewcnum0001gs94qyieie6r'
    );
/*!40000 ALTER TABLE `access_RolePermission` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `access_User`
--

DROP TABLE IF EXISTS `access_User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `access_User` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `pinHash` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `pinLookup` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `department` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `User_username_key` (`username`),
    UNIQUE KEY `User_email_key` (`email`),
    UNIQUE KEY `User_pinLookup_key` (`pinLookup`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `access_User`
--

LOCK TABLES `access_User` WRITE;
/*!40000 ALTER TABLE `access_User` DISABLE KEYS */
;
INSERT INTO
    `access_User`
VALUES (
        'cmt8rjfuk001bgsuzytd7r9gq',
        'superadmin',
        'superadmin@nho.local',
        'Super Administrator',
        '$2b$12$U69JCghzYtpWNJGlVr6jquQQfdKeIzlttNS8fJPCPAS199fm6yRXS',
        '$2b$12$R/Pu1ppopon4eErlW83s1e5IDyFEcVqJjIP19Xrc4fZMwvRuBDa7C',
        'befaa04a41daf52778ff20a3ff40bc122b1cfba26cf0044ac550c672f00e3488',
        'Administration',
        'active',
        '2026-08-25 14:31:23.901',
        '2026-08-31 21:55:56.614'
    ),
    (
        'cmt8rjfvv001hgsuz8s70rz74',
        'nasim.2003',
        'nasem.muhammad@gmail.com',
        'Nasim Muhammad',
        '$2b$12$G9w/DbSzMdkORQp1OYJz/ex14rshElG7EbfbzmyGSGlz2VAmLnMH6',
        NULL,
        NULL,
        'Marketing',
        'active',
        '2026-08-25 14:31:23.947',
        '2026-08-29 21:40:58.289'
    ),
    (
        'cmt8rjfw2001igsuzj4qwnrgc',
        'qasem0822',
        'accountant.dem1@nho.local',
        'Qasem Najm',
        '$2b$12$TKed0qx0wBaMz9ofWWiu6OYbrAF7youy3bTkM.aJVfO6BvGybGIbO',
        NULL,
        NULL,
        'Marketing',
        'active',
        '2026-08-25 14:31:23.954',
        '2026-08-29 15:36:22.498'
    ),
    (
        'cmtejqldw0025gsq6kslih6ov',
        'muhammad.2005',
        'muhammad@gmail.com',
        'Muhammad Azad',
        '$2b$12$TPkfPTBbfl7zhk4pV9IxNu6WJ4M.qzbe6oqw1lOpKUHJitjG.wKWO',
        NULL,
        NULL,
        'Marketing',
        'active',
        '2026-08-29 15:39:37.797',
        '2026-08-29 15:39:37.797'
    ),
    (
        'cmtity5ly002wgs458ggps2wx',
        'nahri.sadiq',
        'nahrisadiq111@gmail.com',
        'Nahri Sadiq Hussain',
        '$2b$12$6F1hPkaxxbpky8JireoFku825g9cmH3nTESPpul4sWu2R9aXUXWgq',
        NULL,
        NULL,
        'Marketing',
        'active',
        '2026-09-01 15:36:31.463',
        '2026-09-01 15:36:31.463'
    ),
    (
        'cmton6n1p0060gs1bsrbmjaj9',
        'sonya.nadir',
        'Sonya.nadir@nho.com',
        'Sonya Nadir',
        '$2b$12$VjKhdzKuVPxDn2lwhRroaOG0w1HRYxFaZJx2HMd4SZNz2DfoxFRza',
        NULL,
        NULL,
        'Marketing',
        'active',
        '2026-09-05 17:13:47.054',
        '2026-09-05 17:13:47.054'
    ),
    (
        'cmton7fr90063gs1bdwokmrc2',
        'soma.nadir',
        'Soma.nadir@nho.com',
        'Soma Nadir',
        '$2b$12$yl4Xnkg2AKxR45GrGYTiF.jrWK1b57gpWbdWNewBPWx7c041Yiv2i',
        NULL,
        NULL,
        'Marketing',
        'active',
        '2026-09-05 17:14:24.262',
        '2026-09-05 17:14:24.262'
    ),
    (
        'cmton8vnj0065gs1b2n9rlxwa',
        'Lana.omer',
        'lana.omer@nho.com',
        'Lana Omer',
        '$2b$12$RsmyNQNPPeUk7xJgJGPmC.wC.Hhx8synEkoKBhFGlT7ZWSpwkmRh2',
        NULL,
        NULL,
        'Marketing',
        'active',
        '2026-09-05 17:15:31.520',
        '2026-09-05 17:16:36.164'
    ),
    (
        'cmton9rb50067gs1bfkp5oh89',
        'bary.nho',
        'bary.nho@nho.com',
        'Bery',
        '$2b$12$YwSVIUImG7jjUmafkZIU4esSOL5un7ge/L9NZffYThMWy3ws4XXJO',
        NULL,
        NULL,
        'Marketing',
        'active',
        '2026-09-05 17:16:12.545',
        '2026-09-05 17:16:12.545'
    ),
    (
        'cmtonb1le006ags1bgt7r1h50',
        'ashna.arshad',
        'ashna.arshad@nho.com',
        'Ashna Arshad',
        '$2b$12$gQdYJ5NF3DisEspnihMrZea7JmArWF36O/3Rgq9UIeb8DP9NvF0VK',
        NULL,
        NULL,
        'Marketing',
        'active',
        '2026-09-05 17:17:12.530',
        '2026-09-05 17:17:12.530'
    );
/*!40000 ALTER TABLE `access_User` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `access_UserRole`
--

DROP TABLE IF EXISTS `access_UserRole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `access_UserRole` (
    `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `roleId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`userId`, `roleId`),
    KEY `UserRole_roleId_fkey` (`roleId`),
    CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `access_Role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `access_User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `access_UserRole`
--

LOCK TABLES `access_UserRole` WRITE;
/*!40000 ALTER TABLE `access_UserRole` DISABLE KEYS */
;
INSERT INTO
    `access_UserRole`
VALUES (
        'cmt8rjfuk001bgsuzytd7r9gq',
        'cmt8rjfh10018gsuz4e7wcuca'
    ),
    (
        'cmt8rjfvv001hgsuz8s70rz74',
        'cmt8rjfv0001cgsuzhs7cbkmx'
    ),
    (
        'cmt8rjfw2001igsuzj4qwnrgc',
        'cmt8rjfv0001cgsuzhs7cbkmx'
    ),
    (
        'cmtejqldw0025gsq6kslih6ov',
        'cmt8rjfv0001cgsuzhs7cbkmx'
    ),
    (
        'cmtity5ly002wgs458ggps2wx',
        'cmt8rjfv0001cgsuzhs7cbkmx'
    ),
    (
        'cmton6n1p0060gs1bsrbmjaj9',
        'cmt8rjfv0001cgsuzhs7cbkmx'
    ),
    (
        'cmton7fr90063gs1bdwokmrc2',
        'cmt8rjfv0001cgsuzhs7cbkmx'
    ),
    (
        'cmton8vnj0065gs1b2n9rlxwa',
        'cmt8rjfv0001cgsuzhs7cbkmx'
    ),
    (
        'cmton9rb50067gs1bfkp5oh89',
        'cmt8rjfv0001cgsuzhs7cbkmx'
    ),
    (
        'cmtonb1le006ags1bgt7r1h50',
        'cmt8rjfv0001cgsuzhs7cbkmx'
    );
/*!40000 ALTER TABLE `access_UserRole` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `accounting_AccountingAccount`
--

DROP TABLE IF EXISTS `accounting_AccountingAccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `accounting_AccountingAccount` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `parentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IQD',
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `AccountingAccount_code_key` (`code`),
    KEY `AccountingAccount_type_idx` (`type`),
    KEY `AccountingAccount_parentId_idx` (`parentId`),
    CONSTRAINT `AccountingAccount_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `accounting_AccountingAccount` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `accounting_AccountingAccount`
--

LOCK TABLES `accounting_AccountingAccount` WRITE;
/*!40000 ALTER TABLE `accounting_AccountingAccount` DISABLE KEYS */
;
INSERT INTO
    `accounting_AccountingAccount`
VALUES (
        'cmt8rjfyw0021gsuzxrdkbisr',
        '1000',
        'Cash',
        'asset',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:24.056',
        '2026-08-31 21:55:56.749'
    ),
    (
        'cmt8rjfz30022gsuzx299rcuc',
        '1100',
        'Accounts receivable',
        'asset',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:24.063',
        '2026-08-31 21:55:56.757'
    ),
    (
        'cmt8rjfz80023gsuza33kznlf',
        '1200',
        'Salary advances',
        'asset',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:24.068',
        '2026-08-31 21:55:56.764'
    ),
    (
        'cmt8rjfzd0024gsuzwckirs2x',
        '2100',
        'Patient service advances',
        'liability',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:24.073',
        '2026-08-31 21:55:56.771'
    ),
    (
        'cmt8rjfzl0025gsuzwg4g9onf',
        '3000',
        'Owner equity',
        'equity',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:24.081',
        '2026-08-31 21:55:56.776'
    ),
    (
        'cmt8rjfzr0026gsuzpvu381sk',
        '4000',
        'Medical service revenue',
        'revenue',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:24.087',
        '2026-08-31 21:55:56.781'
    ),
    (
        'cmt8rjfzw0027gsuzvlp6jvoz',
        '5000',
        'Salary expense',
        'expense',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:24.093',
        '2026-08-31 21:55:56.786'
    ),
    (
        'cmt8rjgq50086gsuzlnfl1lqj',
        'S1001',
        'Seed Account 01',
        'liability',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:25.037',
        '2026-08-31 21:55:57.676'
    ),
    (
        'cmt8rjgqc0087gsuzip178zul',
        'S1002',
        'Seed Account 02',
        'equity',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:25.044',
        '2026-08-31 21:55:57.683'
    ),
    (
        'cmt8rjgqg0088gsuzudhaj0iq',
        'S1003',
        'Seed Account 03',
        'revenue',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:25.049',
        '2026-08-31 21:55:57.688'
    ),
    (
        'cmt8rjgqn0089gsuz7jpusdik',
        'S1004',
        'Seed Account 04',
        'expense',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:25.055',
        '2026-08-31 21:55:57.693'
    ),
    (
        'cmt8rjgqs008agsuzglqj5yaz',
        'S1005',
        'Seed Account 05',
        'asset',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:25.060',
        '2026-08-31 21:55:57.698'
    ),
    (
        'cmt8rjgqx008bgsuzpp95zs29',
        'S1006',
        'Seed Account 06',
        'liability',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:25.065',
        '2026-08-31 21:55:57.703'
    ),
    (
        'cmt8rjgr2008cgsuze81ago3n',
        'S1007',
        'Seed Account 07',
        'equity',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:25.070',
        '2026-08-31 21:55:57.708'
    ),
    (
        'cmt8rjgr7008dgsuzzo2vch5p',
        'S1008',
        'Seed Account 08',
        'revenue',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:25.075',
        '2026-08-31 21:55:57.713'
    ),
    (
        'cmt8rjgrd008egsuzqc934icv',
        'S1009',
        'Seed Account 09',
        'expense',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:25.081',
        '2026-08-31 21:55:57.718'
    ),
    (
        'cmt8rjgrk008fgsuzn3pm6ri9',
        'S1010',
        'Seed Account 10',
        'asset',
        NULL,
        'IQD',
        'active',
        '2026-08-25 14:31:25.088',
        '2026-08-31 21:55:57.723'
    );
/*!40000 ALTER TABLE `accounting_AccountingAccount` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `accounting_JournalEntry`
--

DROP TABLE IF EXISTS `accounting_JournalEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `accounting_JournalEntry` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `entryNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `entryDate` datetime(3) NOT NULL,
    `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `reference` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `JournalEntry_entryNumber_key` (`entryNumber`),
    KEY `JournalEntry_entryDate_idx` (`entryDate`),
    KEY `JournalEntry_status_idx` (`status`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `accounting_JournalEntry`
--

LOCK TABLES `accounting_JournalEntry` WRITE;
/*!40000 ALTER TABLE `accounting_JournalEntry` DISABLE KEYS */
;
INSERT INTO
    `accounting_JournalEntry`
VALUES (
        'cmt8rjg0p0028gsuzbupru92f',
        'JE-SEED-0001',
        '2026-08-01 00:00:00.000',
        'Opening capital',
        NULL,
        'posted',
        '2026-08-25 14:31:24.122',
        '2026-08-25 14:31:24.122'
    ),
    (
        'cmths29ig007xgsslk3o2taz6',
        'JE-SEED-BULK-001',
        '2026-02-02 00:00:00.000',
        'SEED: Medical revenue journal 1',
        'SEED-JR-1',
        'posted',
        '2026-08-31 21:55:57.737',
        '2026-08-31 21:55:57.737'
    ),
    (
        'cmths29im0081gsslhhxnzfn9',
        'JE-SEED-BULK-002',
        '2026-03-03 00:00:00.000',
        'SEED: Medical revenue journal 2',
        'SEED-JR-2',
        'posted',
        '2026-08-31 21:55:57.743',
        '2026-08-31 21:55:57.743'
    ),
    (
        'cmths29it0085gssl7yxo84qz',
        'JE-SEED-BULK-003',
        '2026-04-04 00:00:00.000',
        'SEED: Medical revenue journal 3',
        'SEED-JR-3',
        'posted',
        '2026-08-31 21:55:57.750',
        '2026-08-31 21:55:57.750'
    ),
    (
        'cmths29iy0089gsslucnmrvic',
        'JE-SEED-BULK-004',
        '2026-05-05 00:00:00.000',
        'SEED: Medical revenue journal 4',
        'SEED-JR-4',
        'posted',
        '2026-08-31 21:55:57.755',
        '2026-08-31 21:55:57.755'
    ),
    (
        'cmths29j3008dgsslgosqm1b8',
        'JE-SEED-BULK-005',
        '2026-06-06 00:00:00.000',
        'SEED: Medical revenue journal 5',
        'SEED-JR-5',
        'posted',
        '2026-08-31 21:55:57.760',
        '2026-08-31 21:55:57.760'
    ),
    (
        'cmths29j8008hgssl87ltj1tm',
        'JE-SEED-BULK-006',
        '2026-07-07 00:00:00.000',
        'SEED: Medical revenue journal 6',
        'SEED-JR-6',
        'posted',
        '2026-08-31 21:55:57.765',
        '2026-08-31 21:55:57.765'
    ),
    (
        'cmths29jd008lgssl1cgtznle',
        'JE-SEED-BULK-007',
        '2026-08-08 00:00:00.000',
        'SEED: Medical revenue journal 7',
        'SEED-JR-7',
        'posted',
        '2026-08-31 21:55:57.770',
        '2026-08-31 21:55:57.770'
    ),
    (
        'cmths29ji008pgsslnvsjw5ps',
        'JE-SEED-BULK-008',
        '2026-09-09 00:00:00.000',
        'SEED: Medical revenue journal 8',
        'SEED-JR-8',
        'posted',
        '2026-08-31 21:55:57.775',
        '2026-08-31 21:55:57.775'
    ),
    (
        'cmths29jp008tgssli0jxwgtt',
        'JE-SEED-BULK-009',
        '2026-10-10 00:00:00.000',
        'SEED: Medical revenue journal 9',
        'SEED-JR-9',
        'posted',
        '2026-08-31 21:55:57.782',
        '2026-08-31 21:55:57.782'
    ),
    (
        'cmths29jw008xgssltouycnqy',
        'JE-SEED-BULK-010',
        '2026-11-11 00:00:00.000',
        'SEED: Medical revenue journal 10',
        'SEED-JR-10',
        'posted',
        '2026-08-31 21:55:57.789',
        '2026-08-31 21:55:57.789'
    );
/*!40000 ALTER TABLE `accounting_JournalEntry` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `accounting_JournalLine`
--

DROP TABLE IF EXISTS `accounting_JournalLine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `accounting_JournalLine` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `entryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `accountId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `debit` double NOT NULL DEFAULT '0',
    `credit` double NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `JournalLine_entryId_idx` (`entryId`),
    KEY `JournalLine_accountId_idx` (`accountId`),
    CONSTRAINT `JournalLine_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `accounting_AccountingAccount` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `JournalLine_entryId_fkey` FOREIGN KEY (`entryId`) REFERENCES `accounting_JournalEntry` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `accounting_JournalLine`
--

LOCK TABLES `accounting_JournalLine` WRITE;
/*!40000 ALTER TABLE `accounting_JournalLine` DISABLE KEYS */
;
INSERT INTO
    `accounting_JournalLine`
VALUES (
        'cmt8rjg0q002agsuzxpg7s44c',
        'cmt8rjg0p0028gsuzbupru92f',
        'cmt8rjfyw0021gsuzxrdkbisr',
        NULL,
        10000000,
        0
    ),
    (
        'cmt8rjg0q002bgsuzk2u9y2j3',
        'cmt8rjg0p0028gsuzbupru92f',
        'cmt8rjfzl0025gsuzwg4g9onf',
        NULL,
        0,
        10000000
    ),
    (
        'cmths29ig007zgsslqjfquuij',
        'cmths29ig007xgsslk3o2taz6',
        'cmt8rjfyw0021gsuzxrdkbisr',
        NULL,
        125000,
        0
    ),
    (
        'cmths29ig0080gsslwx5yh9tq',
        'cmths29ig007xgsslk3o2taz6',
        'cmt8rjfzr0026gsuzpvu381sk',
        NULL,
        0,
        125000
    ),
    (
        'cmths29im0083gsslbifz0hcn',
        'cmths29im0081gsslhhxnzfn9',
        'cmt8rjfyw0021gsuzxrdkbisr',
        NULL,
        150000,
        0
    ),
    (
        'cmths29im0084gssl4uzo9a09',
        'cmths29im0081gsslhhxnzfn9',
        'cmt8rjfzr0026gsuzpvu381sk',
        NULL,
        0,
        150000
    ),
    (
        'cmths29it0087gssla1q52dxx',
        'cmths29it0085gssl7yxo84qz',
        'cmt8rjfyw0021gsuzxrdkbisr',
        NULL,
        175000,
        0
    ),
    (
        'cmths29it0088gsslgkovkg0c',
        'cmths29it0085gssl7yxo84qz',
        'cmt8rjfzr0026gsuzpvu381sk',
        NULL,
        0,
        175000
    ),
    (
        'cmths29iy008bgssla5cgdq0h',
        'cmths29iy0089gsslucnmrvic',
        'cmt8rjfyw0021gsuzxrdkbisr',
        NULL,
        200000,
        0
    ),
    (
        'cmths29iy008cgsslh4lkk5rx',
        'cmths29iy0089gsslucnmrvic',
        'cmt8rjfzr0026gsuzpvu381sk',
        NULL,
        0,
        200000
    ),
    (
        'cmths29j3008fgssla0e1rblz',
        'cmths29j3008dgsslgosqm1b8',
        'cmt8rjfyw0021gsuzxrdkbisr',
        NULL,
        225000,
        0
    ),
    (
        'cmths29j3008ggsslqjyzay3j',
        'cmths29j3008dgsslgosqm1b8',
        'cmt8rjfzr0026gsuzpvu381sk',
        NULL,
        0,
        225000
    ),
    (
        'cmths29j8008jgssl0vv5u27s',
        'cmths29j8008hgssl87ltj1tm',
        'cmt8rjfyw0021gsuzxrdkbisr',
        NULL,
        250000,
        0
    ),
    (
        'cmths29j8008kgsslmqmdmpx9',
        'cmths29j8008hgssl87ltj1tm',
        'cmt8rjfzr0026gsuzpvu381sk',
        NULL,
        0,
        250000
    ),
    (
        'cmths29jd008ngssllldj16kr',
        'cmths29jd008lgssl1cgtznle',
        'cmt8rjfyw0021gsuzxrdkbisr',
        NULL,
        275000,
        0
    ),
    (
        'cmths29jd008ogsslgixvfl2k',
        'cmths29jd008lgssl1cgtznle',
        'cmt8rjfzr0026gsuzpvu381sk',
        NULL,
        0,
        275000
    ),
    (
        'cmths29ji008rgsslcqdxpgrg',
        'cmths29ji008pgsslnvsjw5ps',
        'cmt8rjfyw0021gsuzxrdkbisr',
        NULL,
        300000,
        0
    ),
    (
        'cmths29ji008sgsslqgvdiqic',
        'cmths29ji008pgsslnvsjw5ps',
        'cmt8rjfzr0026gsuzpvu381sk',
        NULL,
        0,
        300000
    ),
    (
        'cmths29jp008vgsslt0su2r4g',
        'cmths29jp008tgssli0jxwgtt',
        'cmt8rjfyw0021gsuzxrdkbisr',
        NULL,
        325000,
        0
    ),
    (
        'cmths29jp008wgsslmw1lz3su',
        'cmths29jp008tgssli0jxwgtt',
        'cmt8rjfzr0026gsuzpvu381sk',
        NULL,
        0,
        325000
    ),
    (
        'cmths29jw008zgssly61rk680',
        'cmths29jw008xgssltouycnqy',
        'cmt8rjfyw0021gsuzxrdkbisr',
        NULL,
        350000,
        0
    ),
    (
        'cmths29jw0090gsslz9lzojr6',
        'cmths29jw008xgssltouycnqy',
        'cmt8rjfzr0026gsuzpvu381sk',
        NULL,
        0,
        350000
    );
/*!40000 ALTER TABLE `accounting_JournalLine` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `attendance_AttendanceDevice`
--

DROP TABLE IF EXISTS `attendance_AttendanceDevice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `attendance_AttendanceDevice` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `model` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DS-K1T342MFWX-E1',
    `ipAddress` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `port` int NOT NULL DEFAULT '80',
    `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `serialNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'offline',
    `lastSeenAt` datetime(3) DEFAULT NULL,
    `eventsClearedAt` datetime(3) DEFAULT NULL,
    `workingDaysPerMonth` int NOT NULL DEFAULT '22',
    `checkInTime` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '09:00',
    `checkOutTime` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '17:00',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `AttendanceDevice_ipAddress_port_key` (`ipAddress`, `port`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `attendance_AttendanceDevice`
--

LOCK TABLES `attendance_AttendanceDevice` WRITE;
/*!40000 ALTER TABLE `attendance_AttendanceDevice` DISABLE KEYS */
;
INSERT INTO
    `attendance_AttendanceDevice`
VALUES (
        'cmt8rqkjx0000gsu4r6quy0fp',
        'Main Attendance',
        'DS-K1T342MFWX-E1',
        '192.168.1.96',
        80,
        'admin',
        'nho112233',
        NULL,
        'offline',
        '2026-09-08 23:11:11.103',
        '2026-08-26 17:41:22.898',
        22,
        '09:00',
        '17:00',
        '2026-08-25 14:36:56.589',
        '2026-09-08 23:11:11.271'
    );
/*!40000 ALTER TABLE `attendance_AttendanceDevice` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `attendance_AttendanceEvent`
--

DROP TABLE IF EXISTS `attendance_AttendanceEvent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `attendance_AttendanceEvent` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `deviceId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `personId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `employeeNo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `personName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `eventType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `occurredAt` datetime(3) NOT NULL,
    `verification` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `deviceEventId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `AttendanceEvent_deviceId_deviceEventId_key` (`deviceId`, `deviceEventId`),
    KEY `AttendanceEvent_occurredAt_idx` (`occurredAt`),
    KEY `AttendanceEvent_employeeNo_idx` (`employeeNo`),
    KEY `AttendanceEvent_personId_fkey` (`personId`),
    CONSTRAINT `AttendanceEvent_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `attendance_AttendanceDevice` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `AttendanceEvent_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `attendance_AttendancePerson` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `attendance_AttendanceEvent`
--

LOCK TABLES `attendance_AttendanceEvent` WRITE;
/*!40000 ALTER TABLE `attendance_AttendanceEvent` DISABLE KEYS */
;
INSERT INTO
    `attendance_AttendanceEvent`
VALUES (
        'cmtsyviel004sgsbt02r7j53e',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmt8ukijy0009gsm8ocufyk7g',
        '55',
        'Nasim Muhammad',
        'check_in',
        '2026-09-08 17:52:02.000',
        'fingerprint',
        '1548',
        '2026-09-08 17:52:07.918'
    ),
    (
        'cmtsywetm004vgsbtxq8j2ffc',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmt8ukijy0009gsm8ocufyk7g',
        '55',
        'Nasim Muhammad',
        'check_out',
        '2026-09-08 17:52:46.000',
        'fingerprint',
        '1551',
        '2026-09-08 17:52:49.931'
    ),
    (
        'cmtsyxwlf0055gsbtzss706ej',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmt8ukijy0009gsm8ocufyk7g',
        '55',
        'Nasim Muhammad',
        'check_in',
        '2026-09-08 17:53:55.000',
        'fingerprint',
        '1554',
        '2026-09-08 17:53:59.620'
    ),
    (
        'cmtsyz3qk005agsbt5vn45q14',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmt8ukijy0009gsm8ocufyk7g',
        '55',
        'Nasim Muhammad',
        'check_out',
        '2026-09-08 17:54:32.000',
        'fingerprint',
        '1557',
        '2026-09-08 17:54:55.532'
    ),
    (
        'cmtsyz3qv005cgsbtqj4mc8k1',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmt8ukijy0009gsm8ocufyk7g',
        '55',
        'Nasim Muhammad',
        'check_in',
        '2026-09-08 17:54:55.000',
        'fingerprint',
        '1560',
        '2026-09-08 17:54:55.543'
    ),
    (
        'cmtsyzfbp005ggsbtd9eg8n8c',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmt8ukijy0009gsm8ocufyk7g',
        '55',
        'Nasim Muhammad',
        'check_out',
        '2026-09-08 17:55:04.000',
        'fingerprint',
        '1563',
        '2026-09-08 17:55:10.549'
    ),
    (
        'cmtsyznam005lgsbtjvhpuy1s',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmt8ukijy0009gsm8ocufyk7g',
        '55',
        'Nasim Muhammad',
        'check_in',
        '2026-09-08 17:55:19.000',
        'fingerprint',
        '1566',
        '2026-09-08 17:55:20.878'
    ),
    (
        'cmtsyzxuq005ugsbt77mt3ptk',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmt8ukijy0009gsm8ocufyk7g',
        '55',
        'Nasim Muhammad',
        'check_out',
        '2026-09-08 17:55:34.000',
        'fingerprint',
        '1569',
        '2026-09-08 17:55:34.563'
    ),
    (
        'cmtsz0l7o0063gsbtth3rhb46',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmt8ukijy0009gsm8ocufyk7g',
        '55',
        'Nasim Muhammad',
        'check_in',
        '2026-09-08 17:56:04.000',
        'fingerprint',
        '1572',
        '2026-09-08 17:56:04.836'
    ),
    (
        'cmtsz18m6006igsbt1mvfcpf7',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmt8ukijy0009gsm8ocufyk7g',
        '55',
        'Nasim Muhammad',
        'check_out',
        '2026-09-08 17:56:34.000',
        'fingerprint',
        '1575',
        '2026-09-08 17:56:35.166'
    ),
    (
        'cmtt4f520002ags6zbe0w20z5',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmt8ukijy0009gsm8ocufyk7g',
        '55',
        'Nasim Muhammad',
        'check_in',
        '2026-09-08 17:57:58.000',
        'fingerprint',
        '1578',
        '2026-09-08 20:27:21.817'
    ),
    (
        'cmtt4f528002cgs6z0dhgtk3s',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmt8ukijy0009gsm8ocufyk7g',
        '55',
        'Nasim Muhammad',
        'check_out',
        '2026-09-08 17:58:03.000',
        'fingerprint',
        '1580',
        '2026-09-08 20:27:21.825'
    ),
    (
        'cmtt4f52g002egs6z5bd6r7ht',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmt8rs0yd0002gsu4jslf34ma',
        '2',
        'Qasem Najm',
        'check_out',
        '2026-09-08 19:49:53.000',
        'fingerprint',
        '1582',
        '2026-09-08 20:27:21.833'
    );
/*!40000 ALTER TABLE `attendance_AttendanceEvent` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `attendance_AttendancePerson`
--

DROP TABLE IF EXISTS `attendance_AttendancePerson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `attendance_AttendancePerson` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `deviceId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `employeeNo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `cardNo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `hasFingerprint` tinyint(1) NOT NULL DEFAULT '0',
    `hasFace` tinyint(1) NOT NULL DEFAULT '0',
    `hasPassword` tinyint(1) NOT NULL DEFAULT '0',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `AttendancePerson_deviceId_employeeNo_key` (`deviceId`, `employeeNo`),
    KEY `AttendancePerson_employeeId_idx` (`employeeId`),
    CONSTRAINT `AttendancePerson_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `attendance_AttendanceDevice` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `AttendancePerson_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `hr_Employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `attendance_AttendancePerson`
--

LOCK TABLES `attendance_AttendancePerson` WRITE;
/*!40000 ALTER TABLE `attendance_AttendancePerson` DISABLE KEYS */
;
INSERT INTO
    `attendance_AttendancePerson`
VALUES (
        'cmt8rs0yd0002gsu4jslf34ma',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmt8rjfwt001mgsuza9e8zkde',
        '2',
        'Qasem Najm',
        NULL,
        1,
        0,
        1,
        '2026-08-25 14:38:04.501',
        '2026-09-08 21:23:35.779'
    ),
    (
        'cmt8ukijy0009gsm8ocufyk7g',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmt8rjfwl001kgsuzbwmza8rr',
        '55',
        'Nasim Muhammad',
        NULL,
        1,
        0,
        1,
        '2026-08-25 15:56:12.911',
        '2026-09-08 21:23:35.788'
    ),
    (
        'cmtejs336002ggsq61dwfijjf',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmtejrmbi0026gsq6kwta0vvc',
        '56',
        'Muhammad Azad',
        NULL,
        1,
        0,
        1,
        '2026-08-29 15:40:47.395',
        '2026-09-08 21:23:35.794'
    ),
    (
        'cmtitz3wg003ags45119xsfb1',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmths29cb005ugsslwfprjw4y',
        '57',
        'Nahri Sadiq',
        NULL,
        1,
        0,
        1,
        '2026-09-01 15:37:15.904',
        '2026-09-08 21:23:35.801'
    ),
    (
        'cmtiu454k004ggs45u0y6ew5i',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmtoodx3u0001gszfupsyin5h',
        '58',
        'Ashna Arshad',
        NULL,
        1,
        0,
        1,
        '2026-09-01 15:41:10.772',
        '2026-09-08 21:23:35.807'
    ),
    (
        'cmtiu5lbn005cgs458jjx3tyy',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmtoohliz000fgszf38tu3wm3',
        '59',
        'Sonya Nadir',
        NULL,
        1,
        0,
        1,
        '2026-09-01 15:42:18.420',
        '2026-09-08 21:23:35.814'
    ),
    (
        'cmtiu6r54006egs458pmri3fd',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmtooh1p7000dgszf2agpvblv',
        '60',
        'Soma nadir saeed',
        NULL,
        1,
        0,
        1,
        '2026-09-01 15:43:12.617',
        '2026-09-08 21:23:35.821'
    ),
    (
        'cmtiu8hml007mgs45lcn216us',
        'cmt8rqkjx0000gsu4r6quy0fp',
        'cmtoogc6q000bgszfmrzdipra',
        '61',
        'Lana omer gharib',
        NULL,
        1,
        0,
        1,
        '2026-09-01 15:44:33.597',
        '2026-09-08 21:23:35.827'
    ),
    (
        'cmtpy68tc000jgsvf4msx1zvk',
        'cmt8rqkjx0000gsu4r6quy0fp',
        NULL,
        '01',
        'Shazad Abdullah',
        NULL,
        1,
        1,
        0,
        '2026-09-06 15:09:10.560',
        '2026-09-08 21:23:35.835'
    ),
    (
        'cmtsvqhfa000jgskbx931qqy8',
        'cmt8rqkjx0000gsu4r6quy0fp',
        NULL,
        '62',
        'Bery NHO',
        NULL,
        1,
        0,
        0,
        '2026-09-08 16:24:14.518',
        '2026-09-08 21:23:35.842'
    );
/*!40000 ALTER TABLE `attendance_AttendancePerson` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `billing_BillingCustomer`
--

DROP TABLE IF EXISTS `billing_BillingCustomer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `billing_BillingCustomer` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `address` text COLLATE utf8mb4_unicode_ci,
    `taxNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `BillingCustomer_code_key` (`code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `billing_BillingCustomer`
--

LOCK TABLES `billing_BillingCustomer` WRITE;
/*!40000 ALTER TABLE `billing_BillingCustomer` DISABLE KEYS */
;
INSERT INTO
    `billing_BillingCustomer`
VALUES (
        'cmt8rjg0z002cgsuzu3qf7cks',
        'CUST-1001',
        'Ali Karim',
        '07500000001',
        'ali@example.com',
        'Erbil',
        NULL,
        'active',
        '2026-08-25 14:31:24.132',
        '2026-08-31 21:55:56.793'
    ),
    (
        'cmt8rjgtc009kgsuzetzue5fi',
        'SEED-CUST-001',
        'Baran Mohammed',
        '07520000001',
        'seed.customer001@example.com',
        'Erbil',
        NULL,
        'active',
        '2026-08-25 14:31:25.153',
        '2026-08-31 21:55:57.805'
    ),
    (
        'cmt8rjgtu009qgsuz1u6e4ckp',
        'SEED-CUST-002',
        'Avin Jalal',
        '07520000002',
        'seed.customer002@example.com',
        'Erbil',
        NULL,
        'active',
        '2026-08-25 14:31:25.171',
        '2026-08-31 21:55:57.823'
    ),
    (
        'cmt8rjgua009wgsuzstvfftiu',
        'SEED-CUST-003',
        'Dilshad Rahman',
        '07520000003',
        'seed.customer003@example.com',
        'Erbil',
        NULL,
        'active',
        '2026-08-25 14:31:25.186',
        '2026-08-31 21:55:57.838'
    ),
    (
        'cmt8rjgup00a2gsuz9594qut7',
        'SEED-CUST-004',
        'Zana Farhad',
        '07520000004',
        'seed.customer004@example.com',
        'Erbil',
        NULL,
        'active',
        '2026-08-25 14:31:25.201',
        '2026-08-31 21:55:57.858'
    ),
    (
        'cmt8rjgv600a8gsuz7yu5adrl',
        'SEED-CUST-005',
        'Hana Ibrahim',
        '07520000005',
        'seed.customer005@example.com',
        'Erbil',
        NULL,
        'active',
        '2026-08-25 14:31:25.218',
        '2026-08-31 21:55:57.876'
    ),
    (
        'cmt8rjgvl00aegsuzlad2l8po',
        'SEED-CUST-006',
        'Karwan Ismail',
        '07520000006',
        'seed.customer006@example.com',
        'Erbil',
        NULL,
        'active',
        '2026-08-25 14:31:25.233',
        '2026-08-31 21:55:57.891'
    ),
    (
        'cmt8rjgw200akgsuz6vpczjmx',
        'SEED-CUST-007',
        'Nawroz Kamal',
        '07520000007',
        'seed.customer007@example.com',
        'Erbil',
        NULL,
        'active',
        '2026-08-25 14:31:25.250',
        '2026-08-31 21:55:57.908'
    ),
    (
        'cmt8rjgwh00aqgsuzcudm2j8l',
        'SEED-CUST-008',
        'Zhino Adnan',
        '07520000008',
        'seed.customer008@example.com',
        'Erbil',
        NULL,
        'active',
        '2026-08-25 14:31:25.265',
        '2026-08-31 21:55:57.925'
    ),
    (
        'cmt8rjgx300awgsuzmrftany1',
        'SEED-CUST-009',
        'Sirwan Latif',
        '07520000009',
        'seed.customer009@example.com',
        'Erbil',
        NULL,
        'active',
        '2026-08-25 14:31:25.287',
        '2026-08-31 21:55:57.943'
    ),
    (
        'cmt8rjgxi00b2gsuzre1avp9m',
        'SEED-CUST-010',
        'Tara Yousif',
        '07520000010',
        'seed.customer010@example.com',
        'Erbil',
        NULL,
        'active',
        '2026-08-25 14:31:25.302',
        '2026-08-31 21:55:57.966'
    );
/*!40000 ALTER TABLE `billing_BillingCustomer` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `billing_BillingInvoice`
--

DROP TABLE IF EXISTS `billing_BillingInvoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `billing_BillingInvoice` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `invoiceNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `customerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `issueDate` datetime(3) NOT NULL,
    `dueDate` datetime(3) DEFAULT NULL,
    `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IQD',
    `subtotal` double NOT NULL,
    `discountAmount` double NOT NULL DEFAULT '0',
    `taxAmount` double NOT NULL DEFAULT '0',
    `totalAmount` double NOT NULL,
    `paidAmount` double NOT NULL DEFAULT '0',
    `balanceAmount` double NOT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
    `notes` text COLLATE utf8mb4_unicode_ci,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `BillingInvoice_invoiceNumber_key` (`invoiceNumber`),
    KEY `BillingInvoice_customerId_idx` (`customerId`),
    KEY `BillingInvoice_issueDate_idx` (`issueDate`),
    KEY `BillingInvoice_status_idx` (`status`),
    CONSTRAINT `BillingInvoice_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `billing_BillingCustomer` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `billing_BillingInvoice`
--

LOCK TABLES `billing_BillingInvoice` WRITE;
/*!40000 ALTER TABLE `billing_BillingInvoice` DISABLE KEYS */
;
INSERT INTO
    `billing_BillingInvoice`
VALUES (
        'cmt8rjg17002egsuz349h2vta',
        'INV-SEED-0001',
        'cmt8rjg0z002cgsuzu3qf7cks',
        '2026-08-20 00:00:00.000',
        '2026-08-27 00:00:00.000',
        'IQD',
        100000,
        0,
        0,
        100000,
        50000,
        50000,
        'partial',
        'Integrated seed invoice',
        '2026-08-25 14:31:24.139',
        '2026-08-25 14:31:24.139'
    ),
    (
        'cmths29ki0093gsslbrmyxh5z',
        'INV-SEED-BULK-001',
        'cmt8rjgtc009kgsuzetzue5fi',
        '2026-02-02 00:00:00.000',
        '2026-02-09 00:00:00.000',
        'IQD',
        80000,
        0,
        0,
        80000,
        80000,
        0,
        'paid',
        'SEED: Invoice 001',
        '2026-08-31 21:55:57.811',
        '2026-08-31 21:55:57.811'
    ),
    (
        'cmths29kz0099gsslew64rm6f',
        'INV-SEED-BULK-002',
        'cmt8rjgtu009qgsuz1u6e4ckp',
        '2026-03-03 00:00:00.000',
        '2026-03-10 00:00:00.000',
        'IQD',
        85000,
        0,
        0,
        85000,
        1000,
        84000,
        'partial',
        'SEED: Invoice 002',
        '2026-08-31 21:55:57.828',
        '2026-08-31 21:55:57.828'
    ),
    (
        'cmths29le009fgsslxb4q7qll',
        'INV-SEED-BULK-003',
        'cmt8rjgua009wgsuzstvfftiu',
        '2026-04-04 00:00:00.000',
        '2026-04-11 00:00:00.000',
        'IQD',
        90000,
        0,
        0,
        90000,
        90000,
        0,
        'paid',
        'SEED: Invoice 003',
        '2026-08-31 21:55:57.843',
        '2026-08-31 21:55:57.843'
    ),
    (
        'cmths29ly009lgsslzn214wk7',
        'INV-SEED-BULK-004',
        'cmt8rjgup00a2gsuz9594qut7',
        '2026-05-05 00:00:00.000',
        '2026-05-12 00:00:00.000',
        'IQD',
        95000,
        0,
        0,
        95000,
        1000,
        94000,
        'partial',
        'SEED: Invoice 004',
        '2026-08-31 21:55:57.863',
        '2026-08-31 21:55:57.863'
    ),
    (
        'cmths29mg009rgsslysetsgkq',
        'INV-SEED-BULK-005',
        'cmt8rjgv600a8gsuz7yu5adrl',
        '2026-06-06 00:00:00.000',
        '2026-06-13 00:00:00.000',
        'IQD',
        100000,
        0,
        0,
        100000,
        100000,
        0,
        'paid',
        'SEED: Invoice 005',
        '2026-08-31 21:55:57.881',
        '2026-08-31 21:55:57.881'
    ),
    (
        'cmths29mx009xgssl3ufh40jk',
        'INV-SEED-BULK-006',
        'cmt8rjgvl00aegsuzlad2l8po',
        '2026-07-07 00:00:00.000',
        '2026-07-14 00:00:00.000',
        'IQD',
        105000,
        0,
        0,
        105000,
        1000,
        104000,
        'partial',
        'SEED: Invoice 006',
        '2026-08-31 21:55:57.898',
        '2026-08-31 21:55:57.898'
    ),
    (
        'cmths29ne00a3gssls3isnp5f',
        'INV-SEED-BULK-007',
        'cmt8rjgw200akgsuz6vpczjmx',
        '2026-08-08 00:00:00.000',
        '2026-08-15 00:00:00.000',
        'IQD',
        110000,
        0,
        0,
        110000,
        110000,
        0,
        'paid',
        'SEED: Invoice 007',
        '2026-08-31 21:55:57.915',
        '2026-08-31 21:55:57.915'
    ),
    (
        'cmths29nu00a9gssl9zk4acc5',
        'INV-SEED-BULK-008',
        'cmt8rjgwh00aqgsuzcudm2j8l',
        '2026-09-09 00:00:00.000',
        '2026-09-16 00:00:00.000',
        'IQD',
        115000,
        0,
        0,
        115000,
        1000,
        114000,
        'partial',
        'SEED: Invoice 008',
        '2026-08-31 21:55:57.931',
        '2026-08-31 21:55:57.931'
    ),
    (
        'cmths29oe00afgsslf3p1l9y0',
        'INV-SEED-BULK-009',
        'cmt8rjgx300awgsuzmrftany1',
        '2026-10-10 00:00:00.000',
        '2026-10-17 00:00:00.000',
        'IQD',
        120000,
        0,
        0,
        120000,
        120000,
        0,
        'paid',
        'SEED: Invoice 009',
        '2026-08-31 21:55:57.951',
        '2026-08-31 21:55:57.951'
    ),
    (
        'cmths29oy00algssl5jffzb5j',
        'INV-SEED-BULK-010',
        'cmt8rjgxi00b2gsuzre1avp9m',
        '2026-11-11 00:00:00.000',
        '2026-11-18 00:00:00.000',
        'IQD',
        125000,
        0,
        0,
        125000,
        1000,
        124000,
        'partial',
        'SEED: Invoice 010',
        '2026-08-31 21:55:57.971',
        '2026-08-31 21:55:57.971'
    );
/*!40000 ALTER TABLE `billing_BillingInvoice` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `billing_BillingInvoiceItem`
--

DROP TABLE IF EXISTS `billing_BillingInvoiceItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `billing_BillingInvoiceItem` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `invoiceId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `quantity` double NOT NULL,
    `unitPrice` double NOT NULL,
    `discount` double NOT NULL DEFAULT '0',
    `taxRate` double NOT NULL DEFAULT '0',
    `lineTotal` double NOT NULL,
    PRIMARY KEY (`id`),
    KEY `BillingInvoiceItem_invoiceId_idx` (`invoiceId`),
    CONSTRAINT `BillingInvoiceItem_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `billing_BillingInvoice` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `billing_BillingInvoiceItem`
--

LOCK TABLES `billing_BillingInvoiceItem` WRITE;
/*!40000 ALTER TABLE `billing_BillingInvoiceItem` DISABLE KEYS */
;
INSERT INTO
    `billing_BillingInvoiceItem`
VALUES (
        'cmt8rjg17002fgsuzhaf9imxz',
        'cmt8rjg17002egsuz349h2vta',
        'Cardiology consultation',
        1,
        100000,
        0,
        0,
        100000
    ),
    (
        'cmths29kj0094gssly5p5f68u',
        'cmths29ki0093gsslbrmyxh5z',
        'SEED: Medical service 001',
        1,
        80000,
        0,
        0,
        80000
    ),
    (
        'cmths29kz009agsslmvbc7l80',
        'cmths29kz0099gsslew64rm6f',
        'SEED: Medical service 002',
        1,
        85000,
        0,
        0,
        85000
    ),
    (
        'cmths29le009ggssljcjp89v2',
        'cmths29le009fgsslxb4q7qll',
        'SEED: Medical service 003',
        1,
        90000,
        0,
        0,
        90000
    ),
    (
        'cmths29ly009mgssln2bx6n5w',
        'cmths29ly009lgsslzn214wk7',
        'SEED: Medical service 004',
        1,
        95000,
        0,
        0,
        95000
    ),
    (
        'cmths29mg009sgssl4oemxkq3',
        'cmths29mg009rgsslysetsgkq',
        'SEED: Medical service 005',
        1,
        100000,
        0,
        0,
        100000
    ),
    (
        'cmths29mx009ygsslcmgwq3xy',
        'cmths29mx009xgssl3ufh40jk',
        'SEED: Medical service 006',
        1,
        105000,
        0,
        0,
        105000
    ),
    (
        'cmths29ne00a4gsslk0hc4m47',
        'cmths29ne00a3gssls3isnp5f',
        'SEED: Medical service 007',
        1,
        110000,
        0,
        0,
        110000
    ),
    (
        'cmths29nu00aagsslse9phhvz',
        'cmths29nu00a9gssl9zk4acc5',
        'SEED: Medical service 008',
        1,
        115000,
        0,
        0,
        115000
    ),
    (
        'cmths29oe00aggsslj7rgcdw2',
        'cmths29oe00afgsslf3p1l9y0',
        'SEED: Medical service 009',
        1,
        120000,
        0,
        0,
        120000
    ),
    (
        'cmths29oy00amgsslbijzf4r5',
        'cmths29oy00algssl5jffzb5j',
        'SEED: Medical service 010',
        1,
        125000,
        0,
        0,
        125000
    );
/*!40000 ALTER TABLE `billing_BillingInvoiceItem` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `billing_BillingPayment`
--

DROP TABLE IF EXISTS `billing_BillingPayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `billing_BillingPayment` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `invoiceId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `amount` double NOT NULL,
    `method` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `reference` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `paidAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    KEY `BillingPayment_invoiceId_idx` (`invoiceId`),
    KEY `BillingPayment_paidAt_idx` (`paidAt`),
    CONSTRAINT `BillingPayment_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `billing_BillingInvoice` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `billing_BillingPayment`
--

LOCK TABLES `billing_BillingPayment` WRITE;
/*!40000 ALTER TABLE `billing_BillingPayment` DISABLE KEYS */
;
INSERT INTO
    `billing_BillingPayment`
VALUES (
        'cmt8rjg1e002hgsuztr2q8jxd',
        'cmt8rjg17002egsuz349h2vta',
        50000,
        'cash',
        'PAY-SEED-0001',
        '2026-08-20 00:00:00.000',
        NULL,
        '2026-08-25 14:31:24.147'
    ),
    (
        'cmths29kp0096gsslivjl9feq',
        'cmths29ki0093gsslbrmyxh5z',
        80000,
        'card',
        'SEED-PAY-001',
        '2026-02-03 00:00:00.000',
        'SEED: Integrated payment',
        '2026-08-31 21:55:57.818'
    ),
    (
        'cmths29l4009cgsslqa2jz199',
        'cmths29kz0099gsslew64rm6f',
        1000,
        'bank_transfer',
        'SEED-PAY-002',
        '2026-03-04 00:00:00.000',
        'SEED: Integrated payment',
        '2026-08-31 21:55:57.833'
    ),
    (
        'cmths29lm009igsslanizelz0',
        'cmths29le009fgsslxb4q7qll',
        90000,
        'cash',
        'SEED-PAY-003',
        '2026-04-05 00:00:00.000',
        'SEED: Integrated payment',
        '2026-08-31 21:55:57.851'
    ),
    (
        'cmths29m4009ogsslekye9one',
        'cmths29ly009lgsslzn214wk7',
        1000,
        'card',
        'SEED-PAY-004',
        '2026-05-06 00:00:00.000',
        'SEED: Integrated payment',
        '2026-08-31 21:55:57.869'
    ),
    (
        'cmths29ml009ugsslwq481u6s',
        'cmths29mg009rgsslysetsgkq',
        100000,
        'bank_transfer',
        'SEED-PAY-005',
        '2026-06-07 00:00:00.000',
        'SEED: Integrated payment',
        '2026-08-31 21:55:57.886'
    ),
    (
        'cmths29n200a0gssltkuzqb39',
        'cmths29mx009xgssl3ufh40jk',
        1000,
        'cash',
        'SEED-PAY-006',
        '2026-07-08 00:00:00.000',
        'SEED: Integrated payment',
        '2026-08-31 21:55:57.903'
    ),
    (
        'cmths29nj00a6gsslvonu0qrp',
        'cmths29ne00a3gssls3isnp5f',
        110000,
        'card',
        'SEED-PAY-007',
        '2026-08-09 00:00:00.000',
        'SEED: Integrated payment',
        '2026-08-31 21:55:57.920'
    ),
    (
        'cmths29o100acgssl2hb1jefk',
        'cmths29nu00a9gssl9zk4acc5',
        1000,
        'bank_transfer',
        'SEED-PAY-008',
        '2026-09-10 00:00:00.000',
        'SEED: Integrated payment',
        '2026-08-31 21:55:57.938'
    ),
    (
        'cmths29om00aigsslt4t61pb7',
        'cmths29oe00afgsslf3p1l9y0',
        120000,
        'cash',
        'SEED-PAY-009',
        '2026-10-11 00:00:00.000',
        'SEED: Integrated payment',
        '2026-08-31 21:55:57.959'
    ),
    (
        'cmths29p400aogsslivu3oqy9',
        'cmths29oy00algssl5jffzb5j',
        1000,
        'card',
        'SEED-PAY-010',
        '2026-11-12 00:00:00.000',
        'SEED: Integrated payment',
        '2026-08-31 21:55:57.976'
    );
/*!40000 ALTER TABLE `billing_BillingPayment` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `billing_ServiceAdvance`
--

DROP TABLE IF EXISTS `billing_ServiceAdvance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `billing_ServiceAdvance` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `receiptNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `patientName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `patientPhone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `departmentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `appointmentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `amount` double NOT NULL,
    `appliedAmount` double NOT NULL DEFAULT '0',
    `balanceAmount` double NOT NULL,
    `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IQD',
    `method` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `reference` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `receivedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
    `notes` text COLLATE utf8mb4_unicode_ci,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `ServiceAdvance_receiptNumber_key` (`receiptNumber`),
    KEY `ServiceAdvance_departmentId_idx` (`departmentId`),
    KEY `ServiceAdvance_appointmentId_idx` (`appointmentId`),
    KEY `ServiceAdvance_receivedAt_idx` (`receivedAt`),
    KEY `ServiceAdvance_status_idx` (`status`),
    CONSTRAINT `ServiceAdvance_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `crm_Appointment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `ServiceAdvance_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `hr_Department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `billing_ServiceAdvance`
--

LOCK TABLES `billing_ServiceAdvance` WRITE;
/*!40000 ALTER TABLE `billing_ServiceAdvance` DISABLE KEYS */
;
INSERT INTO
    `billing_ServiceAdvance`
VALUES (
        'cmt8rjg1r002lgsuz5vfycabz',
        'ADV-SEED-0001',
        'Ali Karim',
        '07500000001',
        'cmt8rjfvj001fgsuz5r0t0a49',
        NULL,
        150000,
        50000,
        100000,
        'IQD',
        'cash',
        'SERVICE-SEED',
        '2026-08-20 00:00:00.000',
        'partially_applied',
        'Integrated hospital service advance',
        '2026-08-25 14:31:24.159',
        '2026-08-25 14:31:24.159'
    ),
    (
        'cmths29pg00apgsslpkwfcxld',
        'SEED-SVC-001',
        'Baran Mohammed',
        '07530000001',
        NULL,
        NULL,
        100000,
        0,
        50000,
        'IQD',
        'cash',
        'SEED-SVC-REF-1',
        '2026-08-01 00:00:00.000',
        'open',
        'SEED: Hospital service advance',
        '2026-08-31 21:55:57.988',
        '2026-08-31 21:55:57.988'
    ),
    (
        'cmths29pg00aqgsslraz0cb1m',
        'SEED-SVC-002',
        'Avin Jalal',
        '07530000002',
        NULL,
        NULL,
        105000,
        50000,
        55000,
        'IQD',
        'card',
        'SEED-SVC-REF-2',
        '2026-08-02 00:00:00.000',
        'partially_applied',
        'SEED: Hospital service advance',
        '2026-08-31 21:55:57.988',
        '2026-08-31 21:55:57.988'
    ),
    (
        'cmths29pg00argssld3b7amsr',
        'SEED-SVC-003',
        'Dilshad Rahman',
        '07530000003',
        NULL,
        NULL,
        110000,
        0,
        60000,
        'IQD',
        'bank_transfer',
        'SEED-SVC-REF-3',
        '2026-08-03 00:00:00.000',
        'open',
        'SEED: Hospital service advance',
        '2026-08-31 21:55:57.988',
        '2026-08-31 21:55:57.988'
    ),
    (
        'cmths29pg00asgssl2k9asp2p',
        'SEED-SVC-004',
        'Zana Farhad',
        '07530000004',
        NULL,
        NULL,
        115000,
        50000,
        65000,
        'IQD',
        'cash',
        'SEED-SVC-REF-4',
        '2026-08-04 00:00:00.000',
        'partially_applied',
        'SEED: Hospital service advance',
        '2026-08-31 21:55:57.988',
        '2026-08-31 21:55:57.988'
    ),
    (
        'cmths29pg00atgssl9unqxwlp',
        'SEED-SVC-005',
        'Hana Ibrahim',
        '07530000005',
        NULL,
        NULL,
        120000,
        0,
        70000,
        'IQD',
        'card',
        'SEED-SVC-REF-5',
        '2026-08-05 00:00:00.000',
        'open',
        'SEED: Hospital service advance',
        '2026-08-31 21:55:57.988',
        '2026-08-31 21:55:57.988'
    ),
    (
        'cmths29pg00augsslcdy1k0z6',
        'SEED-SVC-006',
        'Karwan Ismail',
        '07530000006',
        NULL,
        NULL,
        125000,
        50000,
        75000,
        'IQD',
        'bank_transfer',
        'SEED-SVC-REF-6',
        '2026-08-06 00:00:00.000',
        'partially_applied',
        'SEED: Hospital service advance',
        '2026-08-31 21:55:57.988',
        '2026-08-31 21:55:57.988'
    ),
    (
        'cmths29pg00avgsslqgfg6jc9',
        'SEED-SVC-007',
        'Nawroz Kamal',
        '07530000007',
        NULL,
        NULL,
        130000,
        0,
        80000,
        'IQD',
        'cash',
        'SEED-SVC-REF-7',
        '2026-08-07 00:00:00.000',
        'open',
        'SEED: Hospital service advance',
        '2026-08-31 21:55:57.988',
        '2026-08-31 21:55:57.988'
    ),
    (
        'cmths29pg00awgsslar5wxzux',
        'SEED-SVC-008',
        'Zhino Adnan',
        '07530000008',
        NULL,
        NULL,
        135000,
        50000,
        85000,
        'IQD',
        'card',
        'SEED-SVC-REF-8',
        '2026-08-08 00:00:00.000',
        'partially_applied',
        'SEED: Hospital service advance',
        '2026-08-31 21:55:57.988',
        '2026-08-31 21:55:57.988'
    ),
    (
        'cmths29pg00axgsslmb6qy5wd',
        'SEED-SVC-009',
        'Sirwan Latif',
        '07530000009',
        NULL,
        NULL,
        140000,
        0,
        90000,
        'IQD',
        'bank_transfer',
        'SEED-SVC-REF-9',
        '2026-08-09 00:00:00.000',
        'open',
        'SEED: Hospital service advance',
        '2026-08-31 21:55:57.988',
        '2026-08-31 21:55:57.988'
    ),
    (
        'cmths29pg00aygssl7k1y7lwt',
        'SEED-SVC-010',
        'Tara Yousif',
        '07530000010',
        NULL,
        NULL,
        145000,
        50000,
        95000,
        'IQD',
        'cash',
        'SEED-SVC-REF-10',
        '2026-08-10 00:00:00.000',
        'partially_applied',
        'SEED: Hospital service advance',
        '2026-08-31 21:55:57.988',
        '2026-08-31 21:55:57.988'
    );
/*!40000 ALTER TABLE `billing_ServiceAdvance` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `crm_Appointment`
--

DROP TABLE IF EXISTS `crm_Appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `crm_Appointment` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `patientName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `patientPhone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `patientEmail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `doctorId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `departmentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `scheduledAt` datetime(3) NOT NULL,
    `durationMinutes` int NOT NULL DEFAULT '30',
    `reason` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `notes` text COLLATE utf8mb4_unicode_ci,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
    `source` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `Appointment_scheduledAt_idx` (`scheduledAt`),
    KEY `Appointment_doctorId_scheduledAt_idx` (`doctorId`, `scheduledAt`),
    KEY `Appointment_departmentId_idx` (`departmentId`),
    CONSTRAINT `Appointment_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `hr_Department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `crm_Appointment_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `healthcare_HealthStaff` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `crm_Appointment`
--

LOCK TABLES `crm_Appointment` WRITE;
/*!40000 ALTER TABLE `crm_Appointment` DISABLE KEYS */
;
INSERT INTO
    `crm_Appointment`
VALUES (
        'cmt8rjfyq0020gsuzlpatiyvd',
        'Ali Karim',
        '07500000001',
        'ali@example.com',
        NULL,
        'cmt8rjfvj001fgsuz5r0t0a49',
        '2026-08-25 09:00:00.000',
        30,
        'Cardiology consultation',
        NULL,
        'confirmed',
        'website',
        '2026-08-25 14:31:24.050',
        '2026-08-25 14:31:24.050'
    ),
    (
        'cmths29gm007ggssl0147jgbe',
        'Zana Farhad',
        '07510000004',
        'seed.patient04@example.com',
        'cmths2977004ugssliwve3gup',
        NULL,
        '2026-09-04 10:00:00.000',
        30,
        'SEED: Consultation 4',
        NULL,
        'pending',
        'admin',
        '2026-08-31 21:55:57.670',
        '2026-08-31 21:55:57.670'
    ),
    (
        'cmths29gm007kgssl6i2igmge',
        'Zhino Adnan',
        '07510000008',
        'seed.patient08@example.com',
        NULL,
        NULL,
        '2026-09-08 14:00:00.000',
        30,
        'SEED: Consultation 8',
        NULL,
        'confirmed',
        'admin',
        '2026-08-31 21:55:57.670',
        '2026-08-31 21:55:57.670'
    );
/*!40000 ALTER TABLE `crm_Appointment` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `crm_CrmFormTemplate`
--

DROP TABLE IF EXISTS `crm_CrmFormTemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `crm_CrmFormTemplate` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` text COLLATE utf8mb4_unicode_ci,
    `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'clinical',
    `fields` json NOT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `CrmFormTemplate_code_key` (`code`),
    KEY `CrmFormTemplate_category_status_idx` (`category`, `status`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `crm_CrmFormTemplate`
--

LOCK TABLES `crm_CrmFormTemplate` WRITE;
/*!40000 ALTER TABLE `crm_CrmFormTemplate` DISABLE KEYS */
;
INSERT INTO
    `crm_CrmFormTemplate`
VALUES (
        'cmtkjscfi000kgsylj7uytn3l',
        'PED-ASSESSMENT',
        'Pediatric Patient ID & Clinical Assessment',
        'Pediatric vital signs, history, examination, diagnosis, and management.',
        'examination',
        '[{\"id\": \"visitDate\", \"type\": \"date\", \"label\": \"Date of visit\", \"required\": true}, {\"id\": \"weight\", \"type\": \"number\", \"label\": \"Weight (kg)\", \"required\": true}, {\"id\": \"height\", \"type\": \"number\", \"label\": \"Height / length (cm)\", \"required\": true}, {\"id\": \"headCircumference\", \"type\": \"number\", \"label\": \"Head circumference (cm)\", \"required\": false}, {\"id\": \"temperature\", \"type\": \"number\", \"label\": \"Temperature (°C)\", \"required\": false}, {\"id\": \"heartRate\", \"type\": \"number\", \"label\": \"Heart rate (/min)\", \"required\": false}, {\"id\": \"respiratoryRate\", \"type\": \"number\", \"label\": \"Respiratory rate (/min)\", \"required\": false}, {\"id\": \"spo2\", \"type\": \"number\", \"label\": \"SpO₂ (%)\", \"required\": false}, {\"id\": \"mainComplaint\", \"type\": \"textarea\", \"label\": \"Main complaint\", \"required\": true}, {\"id\": \"onset\", \"type\": \"select\", \"label\": \"Onset\", \"options\": [\"Sudden\", \"Gradual\"], \"required\": false}, {\"id\": \"reason\", \"type\": \"select\", \"label\": \"Reason for visit\", \"options\": [\"Fever\", \"Cough / respiratory problem\", \"Vomiting\", \"Diarrhea\", \"Abdominal pain\", \"Poor feeding\", \"Growth concern\", \"Developmental concern\", \"Skin problem\", \"Follow-up\", \"Vaccination\", \"Other\"], \"required\": true}, {\"id\": \"clinicalHistory\", \"type\": \"textarea\", \"label\": \"History of present illness\", \"required\": false}, {\"id\": \"pastMedicalHistory\", \"type\": \"textarea\", \"label\": \"Past medical history\", \"required\": false}, {\"id\": \"birthHistory\", \"type\": \"textarea\", \"label\": \"Birth and neonatal history\", \"required\": false}, {\"id\": \"immunization\", \"type\": \"select\", \"label\": \"Immunization status\", \"options\": [\"Up to date\", \"Incomplete\", \"Unknown\"], \"required\": false}, {\"id\": \"allergyMedication\", \"type\": \"textarea\", \"label\": \"Allergy and medication history\", \"required\": false}, {\"id\": \"familySocialHistory\", \"type\": \"textarea\", \"label\": \"Family and social history\", \"required\": false}, {\"id\": \"generalExamination\", \"type\": \"textarea\", \"label\": \"General condition\", \"required\": false}, {\"id\": \"respiratoryExam\", \"type\": \"textarea\", \"label\": \"Respiratory examination\", \"required\": false}, {\"id\": \"cardiovascularExam\", \"type\": \"textarea\", \"label\": \"Cardiovascular examination\", \"required\": false}, {\"id\": \"abdominalExam\", \"type\": \"textarea\", \"label\": \"Abdominal examination\", \"required\": false}, {\"id\": \"neurologicalExam\", \"type\": \"textarea\", \"label\": \"Neurological examination\", \"required\": false}, {\"id\": \"skinExam\", \"type\": \"textarea\", \"label\": \"Skin examination\", \"required\": false}, {\"id\": \"provisionalDiagnosis\", \"type\": \"textarea\", \"label\": \"Provisional diagnosis\", \"required\": false}, {\"id\": \"finalDiagnosis\", \"type\": \"textarea\", \"label\": \"Final diagnosis\", \"required\": false}, {\"id\": \"investigations\", \"type\": \"textarea\", \"label\": \"Investigations\", \"required\": false}, {\"id\": \"treatment\", \"type\": \"textarea\", \"label\": \"Treatment\", \"required\": false}, {\"id\": \"followUpDate\", \"type\": \"date\", \"label\": \"Follow-up date\", \"required\": false}, {\"id\": \"referrals\", \"type\": \"textarea\", \"label\": \"Referrals\", \"required\": false}]',
        'active',
        '2026-09-02 20:27:36.559',
        '2026-09-04 18:04:42.977'
    );
/*!40000 ALTER TABLE `crm_CrmFormTemplate` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `crm_CrmLead`
--

DROP TABLE IF EXISTS `crm_CrmLead`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `crm_CrmLead` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `source` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `interest` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `notes` text COLLATE utf8mb4_unicode_ci,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    `convertedPatientId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `age` int DEFAULT NULL,
    `code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `gender` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `competitorsNote` text COLLATE utf8mb4_unicode_ci,
    `contactMethod` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `country` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `dateOfBirth` datetime(3) DEFAULT NULL,
    `leadSourceChannel` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `maritalStatus` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `patientType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `preferredLanguage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `satisfactionScore` int DEFAULT '0',
    `secondaryPhone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `referralAddress` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `referralName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `referralNote` text COLLATE utf8mb4_unicode_ci,
    `referralPersona` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `referralPhone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `budgetRange` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `decisionInfluencers` text COLLATE utf8mb4_unicode_ci,
    `knowledgeRating` int DEFAULT NULL,
    `painPoints` text COLLATE utf8mb4_unicode_ci,
    PRIMARY KEY (`id`),
    UNIQUE KEY `CrmLead_code_key` (`code`),
    KEY `CrmLead_status_createdAt_idx` (`status`, `createdAt`),
    KEY `CrmLead_convertedPatientId_fkey` (`convertedPatientId`),
    KEY `CrmLead_phone_idx` (`phone`),
    CONSTRAINT `CrmLead_convertedPatientId_fkey` FOREIGN KEY (`convertedPatientId`) REFERENCES `healthcare_Patient` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `crm_CrmLead`
--

LOCK TABLES `crm_CrmLead` WRITE;
/*!40000 ALTER TABLE `crm_CrmLead` DISABLE KEYS */
;
INSERT INTO
    `crm_CrmLead`
VALUES (
        'seed-crm-lead-001',
        'Baran Mohammed',
        '07504000001',
        'crm.patient001@example.com',
        'website',
        'General consultation',
        'SEED: CRM lead 1',
        'new',
        '2026-08-31 22:00:45.887',
        '2026-09-04 18:04:42.463',
        NULL,
        'Erbil',
        20,
        'LEAD-001',
        'male',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        0,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-lead-002',
        'Avin Jalal',
        '07504000002',
        'crm.patient002@example.com',
        'phone',
        'Dental treatment',
        'SEED: CRM lead 2',
        'contacted',
        '2026-08-31 22:00:45.921',
        '2026-09-04 18:04:42.523',
        NULL,
        'Sulaymaniyah',
        23,
        'LEAD-002',
        'female',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        0,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-lead-003',
        'Dilshad Rahman',
        '07504000003',
        'crm.patient003@example.com',
        'referral',
        'Eye examination',
        'SEED: CRM lead 3',
        'qualified',
        '2026-08-31 22:00:45.958',
        '2026-09-04 18:04:42.571',
        NULL,
        'Duhok',
        26,
        'LEAD-003',
        'male',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        0,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-lead-004',
        'Zana Farhad',
        '07504000004',
        'crm.patient004@example.com',
        'social_media',
        'Surgery consultation',
        'SEED: CRM lead 4',
        'converted',
        '2026-08-31 22:00:45.989',
        '2026-09-06 19:13:56.221',
        'cmtq6x0c900eugssfwaqev7vb',
        'Kirkuk',
        29,
        'LEAD-004',
        'female',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        0,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-lead-005',
        'Hana Ibrahim',
        '07504000005',
        'crm.patient005@example.com',
        'website',
        'General consultation',
        'SEED: CRM lead 5',
        'contacted',
        '2026-08-31 22:00:46.014',
        '2026-09-06 19:13:51.401',
        NULL,
        'Erbil',
        32,
        'LEAD-005',
        'male',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        0,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-lead-006',
        'Karwan Ismail',
        '07504000006',
        'crm.patient006@example.com',
        'phone',
        'Dental treatment',
        'SEED: CRM lead 6',
        'converted',
        '2026-08-31 22:00:46.041',
        '2026-09-04 18:04:42.747',
        'cmths8fz2000agstlc2wxoloo',
        'Sulaymaniyah',
        35,
        'LEAD-006',
        'female',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        0,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-lead-007',
        'Nawroz Kamal',
        '07504000007',
        'crm.patient007@example.com',
        'referral',
        'Eye examination',
        'SEED: CRM lead 7',
        'contacted',
        '2026-08-31 22:00:46.066',
        '2026-09-04 18:04:42.771',
        NULL,
        'Duhok',
        38,
        'LEAD-007',
        'male',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        0,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-lead-008',
        'Zhino Adnan',
        '07504000008',
        'crm.patient008@example.com',
        'social_media',
        'Surgery consultation',
        'SEED: CRM lead 8',
        'qualified',
        '2026-08-31 22:00:46.093',
        '2026-09-04 18:04:42.813',
        NULL,
        'Kirkuk',
        41,
        'LEAD-008',
        'female',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        0,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-lead-009',
        'Sirwan Latif',
        '07504000009',
        'crm.patient009@example.com',
        'website',
        'General consultation',
        'SEED: CRM lead 9',
        'new',
        '2026-09-02 19:43:28.191',
        '2026-09-04 18:18:24.535',
        NULL,
        'Erbil',
        44,
        'LEAD-009',
        'male',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        0,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-lead-010',
        'Tara Yousif',
        '07504000010',
        'crm.patient010@example.com',
        'phone',
        'Dental treatment',
        'SEED: CRM lead 10',
        'new',
        '2026-09-02 19:43:28.219',
        '2026-09-08 20:37:08.718',
        'cmths8g21000igstl3gwqvvvz',
        'Sulaymaniyah',
        47,
        'LEAD-010',
        'female',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        0,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    );
/*!40000 ALTER TABLE `crm_CrmLead` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `crm_CrmLeadAttachment`
--

DROP TABLE IF EXISTS `crm_CrmLeadAttachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `crm_CrmLeadAttachment` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `leadId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `fileName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `fileUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `mimeType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `fileSize` int DEFAULT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    KEY `CrmLeadAttachment_leadId_createdAt_idx` (`leadId`, `createdAt`),
    CONSTRAINT `CrmLeadAttachment_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `crm_CrmLead` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `crm_CrmLeadAttachment`
--

LOCK TABLES `crm_CrmLeadAttachment` WRITE;
/*!40000 ALTER TABLE `crm_CrmLeadAttachment` DISABLE KEYS */
;
/*!40000 ALTER TABLE `crm_CrmLeadAttachment` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `crm_CrmLeadStatusHistory`
--

DROP TABLE IF EXISTS `crm_CrmLeadStatusHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `crm_CrmLeadStatusHistory` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `leadId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `fromStatus` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `toStatus` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    KEY `CrmLeadStatusHistory_leadId_createdAt_idx` (`leadId`, `createdAt`),
    CONSTRAINT `CrmLeadStatusHistory_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `crm_CrmLead` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `crm_CrmLeadStatusHistory`
--

LOCK TABLES `crm_CrmLeadStatusHistory` WRITE;
/*!40000 ALTER TABLE `crm_CrmLeadStatusHistory` DISABLE KEYS */
;
INSERT INTO
    `crm_CrmLeadStatusHistory`
VALUES (
        'cmtn6p5tz000dgsl04exhaext',
        'seed-crm-lead-006',
        'converted',
        'new',
        '2026-09-04 16:44:31.560'
    ),
    (
        'cmtn6p753000ggsl0tvpvj3t8',
        'seed-crm-lead-006',
        'new',
        'qualified',
        '2026-09-04 16:44:33.255'
    ),
    (
        'cmtna1w9k0001gshp2ad35i9r',
        'seed-crm-lead-009',
        'appointment_requested',
        'new',
        '2026-09-04 18:18:24.536'
    ),
    (
        'cmtq6wt3y00epgssf3bvy6rrm',
        'seed-crm-lead-005',
        'lost',
        'appointment_requested',
        '2026-09-06 19:13:46.847'
    ),
    (
        'cmtq6wwmi00esgssfx5aumnk2',
        'seed-crm-lead-005',
        'appointment_requested',
        'contacted',
        '2026-09-06 19:13:51.403'
    ),
    (
        'cmtq6x0ce00ewgssfptzvfnef',
        'seed-crm-lead-004',
        'appointment_requested',
        'converted',
        '2026-09-06 19:13:56.223'
    ),
    (
        'cmtt4rno30001gscieulktkan',
        'seed-crm-lead-010',
        'converted',
        'lost',
        '2026-09-08 20:37:05.811'
    ),
    (
        'cmtt4rpwv0004gscigmxi068l',
        'seed-crm-lead-010',
        'lost',
        'new',
        '2026-09-08 20:37:08.720'
    ),
    (
        'seed-crm-lead-history-001-1',
        'seed-crm-lead-001',
        NULL,
        'new',
        '2026-08-15 08:00:00.000'
    ),
    (
        'seed-crm-lead-history-002-1',
        'seed-crm-lead-002',
        NULL,
        'new',
        '2026-08-16 08:02:00.000'
    ),
    (
        'seed-crm-lead-history-002-2',
        'seed-crm-lead-002',
        'new',
        'contacted',
        '2026-08-16 11:02:00.000'
    ),
    (
        'seed-crm-lead-history-003-1',
        'seed-crm-lead-003',
        NULL,
        'new',
        '2026-08-17 08:04:00.000'
    ),
    (
        'seed-crm-lead-history-003-2',
        'seed-crm-lead-003',
        'new',
        'contacted',
        '2026-08-17 11:04:00.000'
    ),
    (
        'seed-crm-lead-history-003-3',
        'seed-crm-lead-003',
        'contacted',
        'qualified',
        '2026-08-17 14:04:00.000'
    ),
    (
        'seed-crm-lead-history-004-1',
        'seed-crm-lead-004',
        NULL,
        'new',
        '2026-08-18 08:06:00.000'
    ),
    (
        'seed-crm-lead-history-004-2',
        'seed-crm-lead-004',
        'new',
        'contacted',
        '2026-08-18 11:06:00.000'
    ),
    (
        'seed-crm-lead-history-004-3',
        'seed-crm-lead-004',
        'contacted',
        'qualified',
        '2026-08-18 14:06:00.000'
    ),
    (
        'seed-crm-lead-history-004-4',
        'seed-crm-lead-004',
        'qualified',
        'appointment_requested',
        '2026-08-18 17:06:00.000'
    ),
    (
        'seed-crm-lead-history-005-1',
        'seed-crm-lead-005',
        NULL,
        'new',
        '2026-08-19 08:08:00.000'
    ),
    (
        'seed-crm-lead-history-005-2',
        'seed-crm-lead-005',
        'new',
        'contacted',
        '2026-08-19 11:08:00.000'
    ),
    (
        'seed-crm-lead-history-005-3',
        'seed-crm-lead-005',
        'contacted',
        'lost',
        '2026-08-19 14:08:00.000'
    ),
    (
        'seed-crm-lead-history-006-1',
        'seed-crm-lead-006',
        NULL,
        'new',
        '2026-08-20 08:10:00.000'
    ),
    (
        'seed-crm-lead-history-006-2',
        'seed-crm-lead-006',
        'new',
        'contacted',
        '2026-08-20 11:10:00.000'
    ),
    (
        'seed-crm-lead-history-006-3',
        'seed-crm-lead-006',
        'contacted',
        'qualified',
        '2026-08-20 14:10:00.000'
    ),
    (
        'seed-crm-lead-history-006-4',
        'seed-crm-lead-006',
        'qualified',
        'appointment_requested',
        '2026-08-20 17:10:00.000'
    ),
    (
        'seed-crm-lead-history-006-5',
        'seed-crm-lead-006',
        'appointment_requested',
        'converted',
        '2026-08-20 20:10:00.000'
    ),
    (
        'seed-crm-lead-history-007-1',
        'seed-crm-lead-007',
        NULL,
        'new',
        '2026-08-21 08:12:00.000'
    ),
    (
        'seed-crm-lead-history-007-2',
        'seed-crm-lead-007',
        'new',
        'contacted',
        '2026-08-21 11:12:00.000'
    ),
    (
        'seed-crm-lead-history-008-1',
        'seed-crm-lead-008',
        NULL,
        'new',
        '2026-08-22 08:14:00.000'
    ),
    (
        'seed-crm-lead-history-008-2',
        'seed-crm-lead-008',
        'new',
        'contacted',
        '2026-08-22 11:14:00.000'
    ),
    (
        'seed-crm-lead-history-008-3',
        'seed-crm-lead-008',
        'contacted',
        'qualified',
        '2026-08-22 14:14:00.000'
    ),
    (
        'seed-crm-lead-history-009-1',
        'seed-crm-lead-009',
        NULL,
        'new',
        '2026-08-23 08:16:00.000'
    ),
    (
        'seed-crm-lead-history-009-2',
        'seed-crm-lead-009',
        'new',
        'contacted',
        '2026-08-23 11:16:00.000'
    ),
    (
        'seed-crm-lead-history-009-3',
        'seed-crm-lead-009',
        'contacted',
        'qualified',
        '2026-08-23 14:16:00.000'
    ),
    (
        'seed-crm-lead-history-009-4',
        'seed-crm-lead-009',
        'qualified',
        'appointment_requested',
        '2026-08-23 17:16:00.000'
    ),
    (
        'seed-crm-lead-history-010-1',
        'seed-crm-lead-010',
        NULL,
        'new',
        '2026-08-24 08:18:00.000'
    ),
    (
        'seed-crm-lead-history-010-2',
        'seed-crm-lead-010',
        'new',
        'contacted',
        '2026-08-24 11:18:00.000'
    ),
    (
        'seed-crm-lead-history-010-3',
        'seed-crm-lead-010',
        'contacted',
        'qualified',
        '2026-08-24 14:18:00.000'
    ),
    (
        'seed-crm-lead-history-010-4',
        'seed-crm-lead-010',
        'qualified',
        'appointment_requested',
        '2026-08-24 17:18:00.000'
    ),
    (
        'seed-crm-lead-history-010-5',
        'seed-crm-lead-010',
        'appointment_requested',
        'converted',
        '2026-08-24 20:18:00.000'
    );
/*!40000 ALTER TABLE `crm_CrmLeadStatusHistory` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `crm_Feedback`
--

DROP TABLE IF EXISTS `crm_Feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `crm_Feedback` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `targetType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `productId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `serviceId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `customerName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `customerEmail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `rating` int NOT NULL,
    `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
    `source` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'website',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `Feedback_targetType_status_idx` (`targetType`, `status`),
    KEY `Feedback_productId_idx` (`productId`),
    KEY `Feedback_serviceId_idx` (`serviceId`),
    KEY `Feedback_createdAt_idx` (`createdAt`),
    CONSTRAINT `Feedback_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `inventory_InventoryProduct` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Feedback_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `healthcare_HealthcareService` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `crm_Feedback`
--

LOCK TABLES `crm_Feedback` WRITE;
/*!40000 ALTER TABLE `crm_Feedback` DISABLE KEYS */
;
/*!40000 ALTER TABLE `crm_Feedback` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `finance_FinanceBudget`
--

DROP TABLE IF EXISTS `finance_FinanceBudget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `finance_FinanceBudget` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `fiscalYear` int NOT NULL,
    `department` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `plannedAmount` double NOT NULL,
    `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IQD',
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
    `notes` text COLLATE utf8mb4_unicode_ci,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `FinanceBudget_fiscalYear_idx` (`fiscalYear`),
    KEY `FinanceBudget_status_idx` (`status`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `finance_FinanceBudget`
--

LOCK TABLES `finance_FinanceBudget` WRITE;
/*!40000 ALTER TABLE `finance_FinanceBudget` DISABLE KEYS */
;
INSERT INTO
    `finance_FinanceBudget`
VALUES (
        'cmths28t9002ngsslga4op6jn',
        'Operating budget 01',
        2024,
        'Cardiology',
        'Clinical services',
        5000000,
        'IQD',
        'draft',
        'SEED: Integrated finance budget 1',
        '2026-08-31 21:55:56.829',
        '2026-08-31 21:55:56.829'
    ),
    (
        'cmths28t9002ogsslbyqjmmnc',
        'Operating budget 02',
        2025,
        'Administration',
        'Payroll',
        5275000,
        'IQD',
        'approved',
        'SEED: Integrated finance budget 2',
        '2026-08-31 21:55:56.829',
        '2026-08-31 21:55:56.829'
    ),
    (
        'cmths28t9002pgssln8nw2brp',
        'Operating budget 03',
        2026,
        'Pharmacy',
        'Medical supplies',
        5550000,
        'IQD',
        'approved',
        'SEED: Integrated finance budget 3',
        '2026-08-31 21:55:56.829',
        '2026-08-31 21:55:56.829'
    ),
    (
        'cmths28t9002qgssl69h53qzz',
        'Operating budget 04',
        2027,
        'Laboratory',
        'Equipment',
        5825000,
        'IQD',
        'closed',
        'SEED: Integrated finance budget 4',
        '2026-08-31 21:55:56.829',
        '2026-08-31 21:55:56.829'
    ),
    (
        'cmths28t9002rgsslqhcm8ol8',
        'Operating budget 05',
        2028,
        'Emergency',
        'Operations',
        6100000,
        'IQD',
        'draft',
        'SEED: Integrated finance budget 5',
        '2026-08-31 21:55:56.829',
        '2026-08-31 21:55:56.829'
    ),
    (
        'cmths28t9002sgsslnqosf1em',
        'Operating budget 06',
        2024,
        'Cardiology',
        'Clinical services',
        6375000,
        'IQD',
        'approved',
        'SEED: Integrated finance budget 6',
        '2026-08-31 21:55:56.829',
        '2026-08-31 21:55:56.829'
    ),
    (
        'cmths28t9002tgssl3ssgqy52',
        'Operating budget 07',
        2025,
        'Administration',
        'Payroll',
        6650000,
        'IQD',
        'approved',
        'SEED: Integrated finance budget 7',
        '2026-08-31 21:55:56.829',
        '2026-08-31 21:55:56.829'
    ),
    (
        'cmths28t9002ugssl1x568nmb',
        'Operating budget 08',
        2026,
        'Pharmacy',
        'Medical supplies',
        6925000,
        'IQD',
        'closed',
        'SEED: Integrated finance budget 8',
        '2026-08-31 21:55:56.829',
        '2026-08-31 21:55:56.829'
    ),
    (
        'cmths28t9002vgsslrj9i2kzw',
        'Operating budget 09',
        2027,
        'Laboratory',
        'Equipment',
        7200000,
        'IQD',
        'draft',
        'SEED: Integrated finance budget 9',
        '2026-08-31 21:55:56.829',
        '2026-08-31 21:55:56.829'
    ),
    (
        'cmths28t9002wgssle1m621vz',
        'Operating budget 10',
        2028,
        'Emergency',
        'Operations',
        7475000,
        'IQD',
        'approved',
        'SEED: Integrated finance budget 10',
        '2026-08-31 21:55:56.829',
        '2026-08-31 21:55:56.829'
    );
/*!40000 ALTER TABLE `finance_FinanceBudget` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `finance_FinanceCashFlow`
--

DROP TABLE IF EXISTS `finance_FinanceCashFlow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `finance_FinanceCashFlow` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `flowDate` datetime(3) NOT NULL,
    `flowType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `amount` double NOT NULL,
    `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IQD',
    `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'planned',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `FinanceCashFlow_flowDate_idx` (`flowDate`),
    KEY `FinanceCashFlow_flowType_idx` (`flowType`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `finance_FinanceCashFlow`
--

LOCK TABLES `finance_FinanceCashFlow` WRITE;
/*!40000 ALTER TABLE `finance_FinanceCashFlow` DISABLE KEYS */
;
INSERT INTO
    `finance_FinanceCashFlow`
VALUES (
        'cmths28u6002xgsslfwynajql',
        '2026-01-01 00:00:00.000',
        'outflow',
        'Clinical services',
        250000,
        'IQD',
        'SEED: Planned operating payment 1',
        'planned',
        '2026-08-31 21:55:56.863',
        '2026-08-31 21:55:56.863'
    ),
    (
        'cmths28u6002ygssl99x1kyjd',
        '2026-02-02 00:00:00.000',
        'inflow',
        'Payroll',
        335000,
        'IQD',
        'SEED: Expected service receipt 2',
        'confirmed',
        '2026-08-31 21:55:56.863',
        '2026-08-31 21:55:56.863'
    ),
    (
        'cmths28u6002zgsslf04woet9',
        '2026-03-03 00:00:00.000',
        'inflow',
        'Medical supplies',
        420000,
        'IQD',
        'SEED: Expected service receipt 3',
        'confirmed',
        '2026-08-31 21:55:56.863',
        '2026-08-31 21:55:56.863'
    ),
    (
        'cmths28u60030gsslijj99gzg',
        '2026-04-04 00:00:00.000',
        'outflow',
        'Equipment',
        505000,
        'IQD',
        'SEED: Planned operating payment 4',
        'planned',
        '2026-08-31 21:55:56.863',
        '2026-08-31 21:55:56.863'
    ),
    (
        'cmths28u60031gsslwzw1m0fs',
        '2026-05-05 00:00:00.000',
        'inflow',
        'Operations',
        590000,
        'IQD',
        'SEED: Expected service receipt 5',
        'confirmed',
        '2026-08-31 21:55:56.863',
        '2026-08-31 21:55:56.863'
    ),
    (
        'cmths28u60032gsslnr3egtq3',
        '2026-06-06 00:00:00.000',
        'inflow',
        'Clinical services',
        675000,
        'IQD',
        'SEED: Expected service receipt 6',
        'confirmed',
        '2026-08-31 21:55:56.863',
        '2026-08-31 21:55:56.863'
    ),
    (
        'cmths28u60033gsslpo2sh1rc',
        '2026-07-07 00:00:00.000',
        'outflow',
        'Payroll',
        760000,
        'IQD',
        'SEED: Planned operating payment 7',
        'planned',
        '2026-08-31 21:55:56.863',
        '2026-08-31 21:55:56.863'
    ),
    (
        'cmths28u60034gssl5vk84guv',
        '2026-08-08 00:00:00.000',
        'inflow',
        'Medical supplies',
        845000,
        'IQD',
        'SEED: Expected service receipt 8',
        'confirmed',
        '2026-08-31 21:55:56.863',
        '2026-08-31 21:55:56.863'
    ),
    (
        'cmths28u60035gsslgs3aop2w',
        '2026-09-09 00:00:00.000',
        'inflow',
        'Equipment',
        930000,
        'IQD',
        'SEED: Expected service receipt 9',
        'confirmed',
        '2026-08-31 21:55:56.863',
        '2026-08-31 21:55:56.863'
    ),
    (
        'cmths28u60036gsslohhbwt90',
        '2026-10-10 00:00:00.000',
        'outflow',
        'Operations',
        1015000,
        'IQD',
        'SEED: Planned operating payment 10',
        'planned',
        '2026-08-31 21:55:56.863',
        '2026-08-31 21:55:56.863'
    );
/*!40000 ALTER TABLE `finance_FinanceCashFlow` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `finance_FinanceForecast`
--

DROP TABLE IF EXISTS `finance_FinanceForecast`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `finance_FinanceForecast` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `scenario` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'base',
    `periodStart` datetime(3) NOT NULL,
    `periodEnd` datetime(3) NOT NULL,
    `projectedRevenue` double NOT NULL,
    `projectedExpense` double NOT NULL,
    `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IQD',
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
    `notes` text COLLATE utf8mb4_unicode_ci,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `FinanceForecast_periodStart_periodEnd_idx` (`periodStart`, `periodEnd`),
    KEY `FinanceForecast_scenario_idx` (`scenario`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `finance_FinanceForecast`
--

LOCK TABLES `finance_FinanceForecast` WRITE;
/*!40000 ALTER TABLE `finance_FinanceForecast` DISABLE KEYS */
;
INSERT INTO
    `finance_FinanceForecast`
VALUES (
        'cmths28uj0037gssl80lrgldb',
        'Monthly forecast 01',
        'base',
        '2024-01-01 00:00:00.000',
        '2024-01-31 00:00:00.000',
        8000000,
        5200000,
        'IQD',
        'draft',
        'SEED: Integrated financial forecast 1',
        '2026-08-31 21:55:56.875',
        '2026-08-31 21:55:56.875'
    ),
    (
        'cmths28uj0038gsslhdm5opvv',
        'Monthly forecast 02',
        'optimistic',
        '2024-02-01 00:00:00.000',
        '2024-02-29 00:00:00.000',
        8310000,
        5390000,
        'IQD',
        'approved',
        'SEED: Integrated financial forecast 2',
        '2026-08-31 21:55:56.875',
        '2026-08-31 21:55:56.875'
    ),
    (
        'cmths28uj0039gsslyjuvho2r',
        'Monthly forecast 03',
        'conservative',
        '2024-03-01 00:00:00.000',
        '2024-03-31 00:00:00.000',
        8620000,
        5580000,
        'IQD',
        'approved',
        'SEED: Integrated financial forecast 3',
        '2026-08-31 21:55:56.875',
        '2026-08-31 21:55:56.875'
    ),
    (
        'cmths28uj003agssl3ezmvmbb',
        'Monthly forecast 04',
        'base',
        '2024-04-01 00:00:00.000',
        '2024-04-30 00:00:00.000',
        8930000,
        5770000,
        'IQD',
        'approved',
        'SEED: Integrated financial forecast 4',
        '2026-08-31 21:55:56.875',
        '2026-08-31 21:55:56.875'
    ),
    (
        'cmths28uj003bgsslhzevwb9m',
        'Monthly forecast 05',
        'optimistic',
        '2024-05-01 00:00:00.000',
        '2024-05-31 00:00:00.000',
        9240000,
        5960000,
        'IQD',
        'approved',
        'SEED: Integrated financial forecast 5',
        '2026-08-31 21:55:56.875',
        '2026-08-31 21:55:56.875'
    ),
    (
        'cmths28uj003cgssl1jbxiypb',
        'Monthly forecast 06',
        'conservative',
        '2024-06-01 00:00:00.000',
        '2024-06-30 00:00:00.000',
        9550000,
        6150000,
        'IQD',
        'draft',
        'SEED: Integrated financial forecast 6',
        '2026-08-31 21:55:56.875',
        '2026-08-31 21:55:56.875'
    ),
    (
        'cmths28uj003dgssll4vsutrn',
        'Monthly forecast 07',
        'base',
        '2024-07-01 00:00:00.000',
        '2024-07-31 00:00:00.000',
        9860000,
        6340000,
        'IQD',
        'approved',
        'SEED: Integrated financial forecast 7',
        '2026-08-31 21:55:56.875',
        '2026-08-31 21:55:56.875'
    ),
    (
        'cmths28uj003egssli61fi08r',
        'Monthly forecast 08',
        'optimistic',
        '2024-08-01 00:00:00.000',
        '2024-08-31 00:00:00.000',
        10170000,
        6530000,
        'IQD',
        'approved',
        'SEED: Integrated financial forecast 8',
        '2026-08-31 21:55:56.875',
        '2026-08-31 21:55:56.875'
    ),
    (
        'cmths28uj003fgssl5pspd9jl',
        'Monthly forecast 09',
        'conservative',
        '2024-09-01 00:00:00.000',
        '2024-09-30 00:00:00.000',
        10480000,
        6720000,
        'IQD',
        'approved',
        'SEED: Integrated financial forecast 9',
        '2026-08-31 21:55:56.875',
        '2026-08-31 21:55:56.875'
    ),
    (
        'cmths28uj003ggsslar56omo4',
        'Monthly forecast 10',
        'base',
        '2024-10-01 00:00:00.000',
        '2024-10-31 00:00:00.000',
        10790000,
        6910000,
        'IQD',
        'approved',
        'SEED: Integrated financial forecast 10',
        '2026-08-31 21:55:56.875',
        '2026-08-31 21:55:56.875'
    );
/*!40000 ALTER TABLE `finance_FinanceForecast` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `finance_FinanceFunding`
--

DROP TABLE IF EXISTS `finance_FinanceFunding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `finance_FinanceFunding` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `sourceName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `fundingType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `committedAmount` double NOT NULL,
    `receivedAmount` double NOT NULL DEFAULT '0',
    `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IQD',
    `startDate` datetime(3) NOT NULL,
    `endDate` datetime(3) DEFAULT NULL,
    `interestRate` double NOT NULL DEFAULT '0',
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'planned',
    `notes` text COLLATE utf8mb4_unicode_ci,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `FinanceFunding_status_idx` (`status`),
    KEY `FinanceFunding_startDate_idx` (`startDate`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `finance_FinanceFunding`
--

LOCK TABLES `finance_FinanceFunding` WRITE;
/*!40000 ALTER TABLE `finance_FinanceFunding` DISABLE KEYS */
;
INSERT INTO
    `finance_FinanceFunding`
VALUES (
        'cmths28ur003hgssl212jiwq4',
        'Health Ministry 1',
        'grant',
        10000000,
        4000000,
        'IQD',
        '2025-01-01 00:00:00.000',
        '2027-01-01 00:00:00.000',
        0,
        'planned',
        'SEED: Integrated funding source 1',
        '2026-08-31 21:55:56.883',
        '2026-08-31 21:55:56.883'
    ),
    (
        'cmths28ur003igssl4rdw2z3g',
        'Development Fund 2',
        'loan',
        10450000,
        4225000,
        'IQD',
        '2026-02-01 00:00:00.000',
        '2028-02-01 00:00:00.000',
        4.5,
        'active',
        'SEED: Integrated funding source 2',
        '2026-08-31 21:55:56.883',
        '2026-08-31 21:55:56.883'
    ),
    (
        'cmths28ur003jgssltx2vr4x0',
        'Private Partner 3',
        'investment',
        10900000,
        4450000,
        'IQD',
        '2027-03-01 00:00:00.000',
        '2029-03-01 00:00:00.000',
        0,
        'active',
        'SEED: Integrated funding source 3',
        '2026-08-31 21:55:56.883',
        '2026-08-31 21:55:56.883'
    ),
    (
        'cmths28ur003kgssl2utj2rpj',
        'Community Donor 4',
        'donation',
        11350000,
        4675000,
        'IQD',
        '2025-04-01 00:00:00.000',
        '2027-04-01 00:00:00.000',
        0,
        'completed',
        'SEED: Integrated funding source 4',
        '2026-08-31 21:55:56.883',
        '2026-08-31 21:55:56.883'
    ),
    (
        'cmths28ur003lgssluhkpe6rm',
        'Internal Reserve 5',
        'internal',
        11800000,
        4900000,
        'IQD',
        '2026-05-01 00:00:00.000',
        '2028-05-01 00:00:00.000',
        0,
        'planned',
        'SEED: Integrated funding source 5',
        '2026-08-31 21:55:56.883',
        '2026-08-31 21:55:56.883'
    ),
    (
        'cmths28ur003mgssl5r7j8rnz',
        'Health Ministry 6',
        'grant',
        12250000,
        5125000,
        'IQD',
        '2027-06-01 00:00:00.000',
        '2029-06-01 00:00:00.000',
        0,
        'active',
        'SEED: Integrated funding source 6',
        '2026-08-31 21:55:56.883',
        '2026-08-31 21:55:56.883'
    ),
    (
        'cmths28ur003ngsslj0akmm8b',
        'Development Fund 7',
        'loan',
        12700000,
        5350000,
        'IQD',
        '2025-07-01 00:00:00.000',
        '2027-07-01 00:00:00.000',
        4.5,
        'active',
        'SEED: Integrated funding source 7',
        '2026-08-31 21:55:56.883',
        '2026-08-31 21:55:56.883'
    ),
    (
        'cmths28ur003ogssl6x2w28t0',
        'Private Partner 8',
        'investment',
        13150000,
        5575000,
        'IQD',
        '2026-08-01 00:00:00.000',
        '2028-08-01 00:00:00.000',
        0,
        'completed',
        'SEED: Integrated funding source 8',
        '2026-08-31 21:55:56.883',
        '2026-08-31 21:55:56.883'
    ),
    (
        'cmths28ur003pgsslasv5jo03',
        'Community Donor 9',
        'donation',
        13600000,
        5800000,
        'IQD',
        '2027-09-01 00:00:00.000',
        '2029-09-01 00:00:00.000',
        0,
        'planned',
        'SEED: Integrated funding source 9',
        '2026-08-31 21:55:56.883',
        '2026-08-31 21:55:56.883'
    ),
    (
        'cmths28ur003qgssltfqqudjp',
        'Internal Reserve 10',
        'internal',
        14050000,
        6025000,
        'IQD',
        '2025-10-01 00:00:00.000',
        '2027-10-01 00:00:00.000',
        0,
        'active',
        'SEED: Integrated funding source 10',
        '2026-08-31 21:55:56.883',
        '2026-08-31 21:55:56.883'
    );
/*!40000 ALTER TABLE `finance_FinanceFunding` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `healthcare_DoctorSpecialization`
--

DROP TABLE IF EXISTS `healthcare_DoctorSpecialization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `healthcare_DoctorSpecialization` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `healthcare_DoctorSpecialization_name_key` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `healthcare_DoctorSpecialization`
--

LOCK TABLES `healthcare_DoctorSpecialization` WRITE;
/*!40000 ALTER TABLE `healthcare_DoctorSpecialization` DISABLE KEYS */
;
INSERT INTO
    `healthcare_DoctorSpecialization`
VALUES (
        '5356a1ca-a964-11f1-9946-b42e993c4261',
        'Diagnostic imaging'
    );
/*!40000 ALTER TABLE `healthcare_DoctorSpecialization` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `healthcare_HealthStaff`
--

DROP TABLE IF EXISTS `healthcare_HealthStaff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `healthcare_HealthStaff` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `departmentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `staffType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `specialization` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `licenseNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `biography` text COLLATE utf8mb4_unicode_ci,
    `publicBookingEnabled` tinyint(1) NOT NULL DEFAULT '0',
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `HealthStaff_employeeId_key` (`employeeId`),
    UNIQUE KEY `HealthStaff_licenseNumber_key` (`licenseNumber`),
    KEY `HealthStaff_departmentId_idx` (`departmentId`),
    KEY `HealthStaff_staffType_idx` (`staffType`),
    KEY `healthcare_HealthStaff_specialization_fkey` (`specialization`),
    CONSTRAINT `healthcare_HealthStaff_specialization_fkey` FOREIGN KEY (`specialization`) REFERENCES `healthcare_DoctorSpecialization` (`name`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `HealthStaff_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `hr_Department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `HealthStaff_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `hr_Employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `healthcare_HealthStaff`
--

LOCK TABLES `healthcare_HealthStaff` WRITE;
/*!40000 ALTER TABLE `healthcare_HealthStaff` DISABLE KEYS */
;
INSERT INTO
    `healthcare_HealthStaff`
VALUES (
        'cmths2977004ugssliwve3gup',
        'cmths296q004qgsslesug1lk2',
        NULL,
        'doctor',
        'Diagnostic imaging',
        'SEED-LIC-04',
        'SEED: Health professional 04',
        1,
        'active',
        '2026-08-31 21:55:57.332',
        '2026-08-31 21:55:57.332'
    );
/*!40000 ALTER TABLE `healthcare_HealthStaff` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `healthcare_HealthcareService`
--

DROP TABLE IF EXISTS `healthcare_HealthcareService`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `healthcare_HealthcareService` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` text COLLATE utf8mb4_unicode_ci,
    `price` double DEFAULT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `HealthcareService_code_key` (`code`),
    KEY `HealthcareService_status_idx` (`status`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `healthcare_HealthcareService`
--

LOCK TABLES `healthcare_HealthcareService` WRITE;
/*!40000 ALTER TABLE `healthcare_HealthcareService` DISABLE KEYS */
;
/*!40000 ALTER TABLE `healthcare_HealthcareService` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `healthcare_Patient`
--

DROP TABLE IF EXISTS `healthcare_Patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `healthcare_Patient` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `patientCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `dateOfBirth` datetime(3) DEFAULT NULL,
    `gender` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `bloodType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `allergies` text COLLATE utf8mb4_unicode_ci,
    `medicalNotes` text COLLATE utf8mb4_unicode_ci,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    `childrenCount` int NOT NULL DEFAULT '0',
    `hasDiabetes` tinyint(1) NOT NULL DEFAULT '0',
    `hasHypertension` tinyint(1) NOT NULL DEFAULT '0',
    `heightCm` double DEFAULT NULL,
    `isMarried` tinyint(1) NOT NULL DEFAULT '0',
    `weightKg` double DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `Patient_patientCode_key` (`patientCode`),
    KEY `Patient_phone_idx` (`phone`),
    KEY `Patient_status_idx` (`status`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `healthcare_Patient`
--

LOCK TABLES `healthcare_Patient` WRITE;
/*!40000 ALTER TABLE `healthcare_Patient` DISABLE KEYS */
;
INSERT INTO
    `healthcare_Patient`
VALUES (
        'cmths8fuv0000gstl622h03ye',
        'PAT-0001',
        'Baran',
        'Mohammed',
        '07505000001',
        'patient001@example.com',
        '1980-01-05 00:00:00.000',
        'male',
        'Erbil',
        'A+',
        'Penicillin',
        'SEED: Patient medical profile 1',
        'active',
        '2026-08-31 22:00:45.896',
        '2026-09-04 18:04:42.489',
        0,
        0,
        0,
        NULL,
        0,
        NULL
    ),
    (
        'cmths8fvr0002gstlas8rdp6b',
        'PAT-0002',
        'Avin',
        'Jalal',
        '07505000002',
        'patient002@example.com',
        '1983-02-06 00:00:00.000',
        'female',
        'Sulaymaniyah',
        'O+',
        NULL,
        'SEED: Patient medical profile 2',
        'active',
        '2026-08-31 22:00:45.927',
        '2026-09-04 18:04:42.540',
        0,
        0,
        0,
        NULL,
        0,
        NULL
    ),
    (
        'cmths8fwt0004gstl34erljez',
        'PAT-0003',
        'Dilshad',
        'Rahman',
        '07505000003',
        'patient003@example.com',
        '1986-03-07 00:00:00.000',
        'male',
        'Duhok',
        'B+',
        NULL,
        'SEED: Patient medical profile 3',
        'active',
        '2026-08-31 22:00:45.965',
        '2026-09-04 18:04:42.589',
        0,
        0,
        0,
        NULL,
        0,
        NULL
    ),
    (
        'cmths8fxm0006gstliphbbzd7',
        'PAT-0004',
        'Zana',
        'Farhad',
        '07505000004',
        'patient004@example.com',
        '1989-04-08 00:00:00.000',
        'female',
        'Kirkuk',
        'AB+',
        'Penicillin',
        'SEED: Patient medical profile 4',
        'active',
        '2026-08-31 22:00:45.994',
        '2026-09-04 18:04:42.641',
        0,
        0,
        0,
        NULL,
        0,
        NULL
    ),
    (
        'cmths8fyb0008gstlptsl3ja7',
        'PAT-0005',
        'Hana',
        'Ibrahim',
        '07505000005',
        'patient005@example.com',
        '1992-05-09 00:00:00.000',
        'male',
        'Erbil',
        'A-',
        NULL,
        'SEED: Patient medical profile 5',
        'active',
        '2026-08-31 22:00:46.019',
        '2026-09-04 18:04:42.688',
        0,
        0,
        0,
        NULL,
        0,
        NULL
    ),
    (
        'cmths8fz2000agstlc2wxoloo',
        'PAT-0006',
        'Karwan',
        'Ismail',
        '07505000006',
        'patient006@example.com',
        '1995-06-10 00:00:00.000',
        'female',
        'Sulaymaniyah',
        'A+',
        NULL,
        'SEED: Patient medical profile 6',
        'active',
        '2026-08-31 22:00:46.046',
        '2026-09-04 18:04:42.735',
        0,
        0,
        0,
        NULL,
        0,
        NULL
    ),
    (
        'cmths8fzr000cgstltkk7pjj9',
        'PAT-0007',
        'Nawroz',
        'Kamal',
        '07505000007',
        'patient007@example.com',
        '1998-07-11 00:00:00.000',
        'male',
        'Duhok',
        'O+',
        'Penicillin',
        'SEED: Patient medical profile 7',
        'active',
        '2026-08-31 22:00:46.071',
        '2026-09-04 18:04:42.786',
        0,
        0,
        0,
        NULL,
        0,
        NULL
    ),
    (
        'cmths8g0i000egstl0aa6f7bd',
        'PAT-0008',
        'Zhino',
        'Adnan',
        '07505000008',
        'patient008@example.com',
        '2001-08-12 00:00:00.000',
        'female',
        'Kirkuk',
        'B+',
        NULL,
        'SEED: Patient medical profile 8',
        'active',
        '2026-08-31 22:00:46.098',
        '2026-09-04 18:04:42.830',
        0,
        0,
        0,
        NULL,
        0,
        NULL
    ),
    (
        'cmths8g1c000ggstlh2uibxmi',
        'PAT-0009',
        'Sirwan',
        'Latif',
        '07505000009',
        'patient009@example.com',
        '2004-09-13 00:00:00.000',
        'male',
        'Erbil',
        'AB+',
        NULL,
        'SEED: Patient medical profile 9',
        'active',
        '2026-08-31 22:00:46.128',
        '2026-09-04 18:04:42.893',
        0,
        0,
        0,
        NULL,
        0,
        NULL
    ),
    (
        'cmths8g21000igstl3gwqvvvz',
        'PAT-0010',
        'Tara',
        'Yousif',
        '07505000010',
        'patient010@example.com',
        '2007-10-14 00:00:00.000',
        'female',
        'Sulaymaniyah',
        'A-',
        'Penicillin',
        'SEED: Patient medical profile 10',
        'active',
        '2026-08-31 22:00:46.153',
        '2026-09-04 18:04:42.941',
        0,
        0,
        0,
        50,
        0,
        3
    ),
    (
        'cmtq6x0c900eugssfwaqev7vb',
        'LEAD-CRMLEAD004',
        'Zana',
        'Farhad',
        '07504000004',
        'crm.patient004@example.com',
        '1997-01-01 00:00:00.000',
        'female',
        'Kirkuk',
        NULL,
        NULL,
        'Converted from CRM lead. SEED: CRM lead 4',
        'active',
        '2026-09-06 19:13:56.218',
        '2026-09-06 19:13:56.218',
        0,
        0,
        0,
        NULL,
        0,
        NULL
    );
/*!40000 ALTER TABLE `healthcare_Patient` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `healthcare_PatientFormSubmission`
--

DROP TABLE IF EXISTS `healthcare_PatientFormSubmission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `healthcare_PatientFormSubmission` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `patientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `formTemplateId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `data` json NOT NULL,
    `submittedById` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `PatientFormSubmission_patientId_createdAt_idx` (`patientId`, `createdAt`),
    KEY `PatientFormSubmission_formTemplateId_idx` (`formTemplateId`),
    CONSTRAINT `PatientFormSubmission_formTemplateId_fkey` FOREIGN KEY (`formTemplateId`) REFERENCES `crm_CrmFormTemplate` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `PatientFormSubmission_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `healthcare_Patient` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `healthcare_PatientFormSubmission`
--

LOCK TABLES `healthcare_PatientFormSubmission` WRITE;
/*!40000 ALTER TABLE `healthcare_PatientFormSubmission` DISABLE KEYS */
;
/*!40000 ALTER TABLE `healthcare_PatientFormSubmission` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `healthcare_PatientPayment`
--

DROP TABLE IF EXISTS `healthcare_PatientPayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `healthcare_PatientPayment` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `patientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `surgeryAppointmentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `amount` decimal(12, 2) NOT NULL,
    `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `reference` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `notes` text COLLATE utf8mb4_unicode_ci,
    `paidAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'paid',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `PatientPayment_patientId_paidAt_idx` (`patientId`, `paidAt`),
    KEY `PatientPayment_surgeryAppointmentId_idx` (`surgeryAppointmentId`),
    CONSTRAINT `PatientPayment_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `healthcare_Patient` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `PatientPayment_surgeryAppointmentId_fkey` FOREIGN KEY (`surgeryAppointmentId`) REFERENCES `healthcare_SurgeryAppointment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `healthcare_PatientPayment`
--

LOCK TABLES `healthcare_PatientPayment` WRITE;
/*!40000 ALTER TABLE `healthcare_PatientPayment` DISABLE KEYS */
;
INSERT INTO
    `healthcare_PatientPayment`
VALUES (
        'seed-crm-payment-001',
        'cmths8fuv0000gstl622h03ye',
        'seed-crm-surgery-appointment-001',
        250000.00,
        'cash',
        'CRM-PAY-0001',
        'SEED: Surgery payment 1',
        '2026-08-02 09:00:00.000',
        'pending',
        '2026-08-31 22:00:45.914',
        '2026-09-04 18:04:42.517'
    ),
    (
        'seed-crm-payment-002',
        'cmths8fvr0002gstlas8rdp6b',
        'seed-crm-surgery-appointment-002',
        375000.00,
        'card',
        'CRM-PAY-0002',
        'SEED: Surgery payment 2',
        '2026-09-03 09:00:00.000',
        'paid',
        '2026-08-31 22:00:45.950',
        '2026-09-04 18:04:42.566'
    ),
    (
        'seed-crm-payment-003',
        'cmths8fwt0004gstl34erljez',
        'seed-crm-surgery-appointment-003',
        500000.00,
        'bank_transfer',
        'CRM-PAY-0003',
        'SEED: Surgery payment 3',
        '2026-10-04 09:00:00.000',
        'paid',
        '2026-08-31 22:00:45.982',
        '2026-09-04 18:04:42.615'
    ),
    (
        'seed-crm-payment-004',
        'cmths8fxm0006gstliphbbzd7',
        'seed-crm-surgery-appointment-004',
        625000.00,
        'insurance',
        'CRM-PAY-0004',
        'SEED: Surgery payment 4',
        '2026-08-05 09:00:00.000',
        'paid',
        '2026-08-31 22:00:46.009',
        '2026-09-04 18:04:42.666'
    ),
    (
        'seed-crm-payment-005',
        'cmths8fyb0008gstlptsl3ja7',
        'seed-crm-surgery-appointment-005',
        750000.00,
        'cash',
        'CRM-PAY-0005',
        'SEED: Surgery payment 5',
        '2026-09-06 09:00:00.000',
        'pending',
        '2026-08-31 22:00:46.036',
        '2026-09-04 18:04:42.710'
    ),
    (
        'seed-crm-payment-006',
        'cmths8fz2000agstlc2wxoloo',
        'seed-crm-surgery-appointment-006',
        875000.00,
        'card',
        'CRM-PAY-0006',
        'SEED: Surgery payment 6',
        '2026-10-07 09:00:00.000',
        'paid',
        '2026-08-31 22:00:46.061',
        '2026-09-04 18:04:42.766'
    ),
    (
        'seed-crm-payment-007',
        'cmths8fzr000cgstltkk7pjj9',
        'seed-crm-surgery-appointment-007',
        1000000.00,
        'bank_transfer',
        'CRM-PAY-0007',
        'SEED: Surgery payment 7',
        '2026-08-08 09:00:00.000',
        'paid',
        '2026-08-31 22:00:46.088',
        '2026-09-04 18:04:42.808'
    ),
    (
        'seed-crm-payment-008',
        'cmths8g0i000egstl0aa6f7bd',
        'seed-crm-surgery-appointment-008',
        1125000.00,
        'insurance',
        'CRM-PAY-0008',
        'SEED: Surgery payment 8',
        '2026-09-09 09:00:00.000',
        'paid',
        '2026-08-31 22:00:46.118',
        '2026-09-04 18:04:42.859'
    ),
    (
        'seed-crm-payment-009',
        'cmths8g1c000ggstlh2uibxmi',
        'seed-crm-surgery-appointment-009',
        1250000.00,
        'cash',
        'CRM-PAY-0009',
        'SEED: Surgery payment 9',
        '2026-10-10 09:00:00.000',
        'pending',
        '2026-08-31 22:00:46.143',
        '2026-09-04 18:04:42.916'
    ),
    (
        'seed-crm-payment-010',
        'cmths8g21000igstl3gwqvvvz',
        'seed-crm-surgery-appointment-010',
        1375000.00,
        'card',
        'CRM-PAY-0010',
        'SEED: Surgery payment 10',
        '2026-08-11 09:00:00.000',
        'paid',
        '2026-08-31 22:00:46.168',
        '2026-09-04 18:04:42.971'
    );
/*!40000 ALTER TABLE `healthcare_PatientPayment` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `healthcare_PatientPrescription`
--

DROP TABLE IF EXISTS `healthcare_PatientPrescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `healthcare_PatientPrescription` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `requestId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `patientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `prescriberId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `patientName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `patientCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `prescriberName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `notes` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `items` json NOT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `healthcare_PatientPrescription_requestId_key` (`requestId`),
    KEY `healthcare_PatientPrescription_patientId_createdAt_idx` (`patientId`, `createdAt`),
    KEY `healthcare_PatientPrescription_prescriberId_idx` (`prescriberId`),
    CONSTRAINT `healthcare_PatientPrescription_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `healthcare_Patient` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `healthcare_PatientPrescription_prescriberId_fkey` FOREIGN KEY (`prescriberId`) REFERENCES `access_User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `healthcare_PatientPrescription`
--

LOCK TABLES `healthcare_PatientPrescription` WRITE;
/*!40000 ALTER TABLE `healthcare_PatientPrescription` DISABLE KEYS */
;
INSERT INTO
    `healthcare_PatientPrescription`
VALUES (
        'cmtt6xzjx0002gsmvaagkx4ys',
        'd43249be-7cc1-4a43-9db5-5655fee069d4',
        'cmths8fzr000cgstltkk7pjj9',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Nawroz Kamal',
        'PAT-0007',
        'NHO Super Administrator',
        '',
        '[{\"dosage\": \"2\", \"duration\": \"12\", \"medicine\": \"Aneroid Blood Pressure Monitor\", \"quantity\": 1, \"frequency\": \"3\", \"instructions\": \"\"}]',
        '2026-09-08 21:38:00.382'
    );
/*!40000 ALTER TABLE `healthcare_PatientPrescription` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `healthcare_PatientReferral`
--

DROP TABLE IF EXISTS `healthcare_PatientReferral`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `healthcare_PatientReferral` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `patientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `referrerName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `referrerPhone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `referralType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'patient',
    `referredAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` text COLLATE utf8mb4_unicode_ci,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    `direction` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inbound',
    `referralPersona` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `referrerAddress` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `referrerProfession` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `referringPatientName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `PatientReferral_patientId_referredAt_idx` (`patientId`, `referredAt`),
    KEY `PatientReferral_status_idx` (`status`),
    CONSTRAINT `PatientReferral_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `healthcare_Patient` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `healthcare_PatientReferral`
--

LOCK TABLES `healthcare_PatientReferral` WRITE;
/*!40000 ALTER TABLE `healthcare_PatientReferral` DISABLE KEYS */
;
INSERT INTO
    `healthcare_PatientReferral`
VALUES (
        'seed-crm-referral-001',
        'cmths8fuv0000gstl622h03ye',
        'Ahmed Hassan',
        '07506000001',
        'patient',
        '2026-08-10 00:00:00.000',
        'SEED: Patient referral 1',
        'active',
        '2026-09-04 18:04:42.497',
        '2026-09-04 18:04:42.497',
        'inbound',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-referral-002',
        'cmths8fvr0002gstlas8rdp6b',
        'Dr. Shirin Karim',
        '07506000002',
        'doctor',
        '2026-09-11 00:00:00.000',
        'SEED: Patient referral 2',
        'completed',
        '2026-09-04 18:04:42.548',
        '2026-09-04 18:04:42.548',
        'inbound',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-referral-003',
        'cmths8fwt0004gstl34erljez',
        'NHO Outreach Team',
        '07506000003',
        'employee',
        '2026-08-12 00:00:00.000',
        'SEED: Patient referral 3',
        'active',
        '2026-09-04 18:04:42.596',
        '2026-09-04 18:04:42.596',
        'inbound',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-referral-004',
        'cmths8fxm0006gstliphbbzd7',
        'Sara Mahmood',
        '07506000004',
        'organization',
        '2026-09-13 00:00:00.000',
        'SEED: Patient referral 4',
        'cancelled',
        '2026-09-04 18:04:42.649',
        '2026-09-04 18:04:42.649',
        'inbound',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-referral-005',
        'cmths8fyb0008gstlptsl3ja7',
        'Kurdistan Health Center',
        '07506000005',
        'other',
        '2026-08-14 00:00:00.000',
        'SEED: Patient referral 5',
        'active',
        '2026-09-04 18:04:42.695',
        '2026-09-04 18:04:42.695',
        'inbound',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-referral-006',
        'cmths8fz2000agstlc2wxoloo',
        'Ahmed Hassan',
        '07506000006',
        'patient',
        '2026-09-15 00:00:00.000',
        'SEED: Patient referral 6',
        'completed',
        '2026-09-04 18:04:42.742',
        '2026-09-04 18:04:42.742',
        'inbound',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-referral-007',
        'cmths8fzr000cgstltkk7pjj9',
        'Dr. Shirin Karim',
        '07506000007',
        'doctor',
        '2026-08-16 00:00:00.000',
        'SEED: Patient referral 7',
        'active',
        '2026-09-04 18:04:42.793',
        '2026-09-04 18:04:42.793',
        'inbound',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-referral-008',
        'cmths8g0i000egstl0aa6f7bd',
        'NHO Outreach Team',
        '07506000008',
        'employee',
        '2026-09-17 00:00:00.000',
        'SEED: Patient referral 8',
        'cancelled',
        '2026-09-04 18:04:42.837',
        '2026-09-04 18:04:42.837',
        'inbound',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-referral-009',
        'cmths8g1c000ggstlh2uibxmi',
        'Sara Mahmood',
        '07506000009',
        'organization',
        '2026-08-18 00:00:00.000',
        'Patient referral 9',
        'active',
        '2026-09-04 18:04:42.899',
        '2026-09-05 19:43:02.571',
        'inbound',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'seed-crm-referral-010',
        'cmths8g21000igstl3gwqvvvz',
        'Kurdistan Health Center',
        '07506000010',
        'other',
        '2026-09-19 00:00:00.000',
        'SEED: Patient referral 10',
        'completed',
        '2026-09-04 18:04:42.948',
        '2026-09-04 18:04:42.948',
        'inbound',
        NULL,
        NULL,
        NULL,
        NULL
    );
/*!40000 ALTER TABLE `healthcare_PatientReferral` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `healthcare_Surgery`
--

DROP TABLE IF EXISTS `healthcare_Surgery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `healthcare_Surgery` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` text COLLATE utf8mb4_unicode_ci,
    `durationMinutes` int NOT NULL,
    `basePrice` decimal(12, 2) NOT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `Surgery_code_key` (`code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `healthcare_Surgery`
--

LOCK TABLES `healthcare_Surgery` WRITE;
/*!40000 ALTER TABLE `healthcare_Surgery` DISABLE KEYS */
;
INSERT INTO
    `healthcare_Surgery`
VALUES (
        'cmths8fv10001gstlas1dm189',
        'SUR-001',
        'Appendectomy',
        'SEED: Appendectomy procedure',
        45,
        500000.00,
        'active',
        '2026-08-31 22:00:45.901',
        '2026-09-04 18:04:42.504'
    ),
    (
        'cmths8fvy0003gstlywudc507',
        'SUR-002',
        'Cataract surgery',
        'SEED: Cataract surgery procedure',
        60,
        675000.00,
        'active',
        '2026-08-31 22:00:45.934',
        '2026-09-04 18:04:42.556'
    ),
    (
        'cmths8fwy0005gstldzu8vdrh',
        'SUR-003',
        'Knee arthroscopy',
        'SEED: Knee arthroscopy procedure',
        75,
        850000.00,
        'active',
        '2026-08-31 22:00:45.970',
        '2026-09-04 18:04:42.602'
    ),
    (
        'cmths8fxr0007gstl4rywgv24',
        'SUR-004',
        'Hernia repair',
        'SEED: Hernia repair procedure',
        90,
        1025000.00,
        'active',
        '2026-08-31 22:00:45.999',
        '2026-09-04 18:04:42.656'
    ),
    (
        'cmths8fyg0009gstljihzjh6f',
        'SUR-005',
        'Tonsillectomy',
        'SEED: Tonsillectomy procedure',
        105,
        1200000.00,
        'active',
        '2026-08-31 22:00:46.024',
        '2026-09-04 18:04:42.700'
    ),
    (
        'cmths8fz7000bgstl3j49ebhx',
        'SUR-006',
        'Gallbladder removal',
        'SEED: Gallbladder removal procedure',
        120,
        1375000.00,
        'active',
        '2026-08-31 22:00:46.051',
        '2026-09-04 18:04:42.756'
    ),
    (
        'cmths8fzw000dgstlbf11m1vh',
        'SUR-007',
        'Cesarean section',
        'SEED: Cesarean section procedure',
        135,
        1550000.00,
        'active',
        '2026-08-31 22:00:46.076',
        '2026-09-04 18:04:42.798'
    ),
    (
        'cmths8g0q000fgstl2yw0uw40',
        'SUR-008',
        'Coronary angioplasty',
        'SEED: Coronary angioplasty procedure',
        150,
        1725000.00,
        'active',
        '2026-08-31 22:00:46.106',
        '2026-09-04 18:04:42.842'
    ),
    (
        'cmths8g1h000hgstlct6oiyb0',
        'SUR-009',
        'Sinus surgery',
        'SEED: Sinus surgery procedure',
        165,
        1900000.00,
        'active',
        '2026-08-31 22:00:46.133',
        '2026-09-04 18:04:42.906'
    ),
    (
        'cmths8g26000jgstlm66g80m1',
        'SUR-010',
        'Carpal tunnel release',
        'SEED: Carpal tunnel release procedure',
        180,
        2075000.00,
        'active',
        '2026-08-31 22:00:46.158',
        '2026-09-04 18:04:42.959'
    );
/*!40000 ALTER TABLE `healthcare_Surgery` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `healthcare_SurgeryAppointment`
--

DROP TABLE IF EXISTS `healthcare_SurgeryAppointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `healthcare_SurgeryAppointment` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `patientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `doctorId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `surgeryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `scheduledAt` datetime(3) NOT NULL,
    `operatingRoom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'scheduled',
    `preOpNotes` text COLLATE utf8mb4_unicode_ci,
    `postOpNotes` text COLLATE utf8mb4_unicode_ci,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `SurgeryAppointment_scheduledAt_status_idx` (`scheduledAt`, `status`),
    KEY `SurgeryAppointment_patientId_idx` (`patientId`),
    KEY `SurgeryAppointment_doctorId_idx` (`doctorId`),
    KEY `SurgeryAppointment_surgeryId_fkey` (`surgeryId`),
    CONSTRAINT `healthcare_SurgeryAppointment_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `healthcare_HealthStaff` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `SurgeryAppointment_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `healthcare_Patient` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `SurgeryAppointment_surgeryId_fkey` FOREIGN KEY (`surgeryId`) REFERENCES `healthcare_Surgery` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `healthcare_SurgeryAppointment`
--

LOCK TABLES `healthcare_SurgeryAppointment` WRITE;
/*!40000 ALTER TABLE `healthcare_SurgeryAppointment` DISABLE KEYS */
;
INSERT INTO
    `healthcare_SurgeryAppointment`
VALUES (
        'seed-crm-surgery-appointment-001',
        'cmths8fuv0000gstl622h03ye',
        NULL,
        'cmths8fv10001gstlas1dm189',
        '2026-09-03 07:00:00.000',
        'OR-1',
        'scheduled',
        'SEED: Pre-operation assessment 1',
        NULL,
        '2026-08-31 22:00:45.908',
        '2026-09-04 18:04:42.510'
    ),
    (
        'seed-crm-surgery-appointment-002',
        'cmths8fvr0002gstlas8rdp6b',
        'cmths2977004ugssliwve3gup',
        'cmths8fvy0003gstlywudc507',
        '2026-10-04 08:00:00.000',
        'OR-2',
        'confirmed',
        'SEED: Pre-operation assessment 2',
        NULL,
        '2026-08-31 22:00:45.941',
        '2026-09-04 18:04:42.561'
    ),
    (
        'seed-crm-surgery-appointment-003',
        'cmths8fwt0004gstl34erljez',
        NULL,
        'cmths8fwy0005gstldzu8vdrh',
        '2026-11-05 09:00:00.000',
        'OR-3',
        'in_progress',
        'SEED: Pre-operation assessment 3',
        NULL,
        '2026-08-31 22:00:45.977',
        '2026-09-04 18:04:42.608'
    ),
    (
        'seed-crm-surgery-appointment-004',
        'cmths8fxm0006gstliphbbzd7',
        NULL,
        'cmths8fxr0007gstl4rywgv24',
        '2026-09-06 10:00:00.000',
        'OR-4',
        'completed',
        'SEED: Pre-operation assessment 4',
        'SEED: Procedure completed successfully',
        '2026-08-31 22:00:46.004',
        '2026-09-04 18:04:42.661'
    ),
    (
        'seed-crm-surgery-appointment-005',
        'cmths8fyb0008gstlptsl3ja7',
        'cmths2977004ugssliwve3gup',
        'cmths8fyg0009gstljihzjh6f',
        '2026-10-07 11:00:00.000',
        'OR-1',
        'scheduled',
        'SEED: Pre-operation assessment 5',
        NULL,
        '2026-08-31 22:00:46.029',
        '2026-09-04 18:04:42.705'
    ),
    (
        'seed-crm-surgery-appointment-006',
        'cmths8fz2000agstlc2wxoloo',
        NULL,
        'cmths8fz7000bgstl3j49ebhx',
        '2026-11-08 12:00:00.000',
        'OR-2',
        'confirmed',
        'SEED: Pre-operation assessment 6',
        NULL,
        '2026-08-31 22:00:46.056',
        '2026-09-04 18:04:42.761'
    ),
    (
        'seed-crm-surgery-appointment-007',
        'cmths8fzr000cgstltkk7pjj9',
        NULL,
        'cmths8fzw000dgstlbf11m1vh',
        '2026-09-09 07:00:00.000',
        'OR-3',
        'completed',
        'SEED: Pre-operation assessment 7',
        NULL,
        '2026-08-31 22:00:46.081',
        '2026-09-08 21:43:11.824'
    ),
    (
        'seed-crm-surgery-appointment-008',
        'cmths8g0i000egstl0aa6f7bd',
        'cmths2977004ugssliwve3gup',
        'cmths8g0q000fgstl2yw0uw40',
        '2026-10-10 08:00:00.000',
        'OR-4',
        'completed',
        'SEED: Pre-operation assessment 8',
        'SEED: Procedure completed successfully',
        '2026-08-31 22:00:46.113',
        '2026-09-04 18:04:42.848'
    ),
    (
        'seed-crm-surgery-appointment-009',
        'cmths8g1c000ggstlh2uibxmi',
        NULL,
        'cmths8g1h000hgstlct6oiyb0',
        '2026-11-11 09:00:00.000',
        'OR-1',
        'scheduled',
        'SEED: Pre-operation assessment 9',
        NULL,
        '2026-08-31 22:00:46.138',
        '2026-09-04 18:04:42.911'
    ),
    (
        'seed-crm-surgery-appointment-010',
        'cmths8g21000igstl3gwqvvvz',
        NULL,
        'cmths8g26000jgstlm66g80m1',
        '2026-09-12 10:00:00.000',
        'OR-2',
        'confirmed',
        'SEED: Pre-operation assessment 10',
        NULL,
        '2026-08-31 22:00:46.163',
        '2026-09-04 18:04:42.964'
    );
/*!40000 ALTER TABLE `healthcare_SurgeryAppointment` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `hr_AttendancePermission`
--

DROP TABLE IF EXISTS `hr_AttendancePermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `hr_AttendancePermission` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `permissionType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `fromDate` datetime(3) NOT NULL,
    `toDate` datetime(3) NOT NULL,
    `permittedMinutes` int DEFAULT NULL,
    `reason` text COLLATE utf8mb4_unicode_ci,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'approved',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    `leaveType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `AttendancePermission_employeeId_fromDate_toDate_idx` (
        `employeeId`,
        `fromDate`,
        `toDate`
    ),
    KEY `AttendancePermission_status_idx` (`status`),
    CONSTRAINT `AttendancePermission_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `hr_Employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `hr_AttendancePermission`
--

LOCK TABLES `hr_AttendancePermission` WRITE;
/*!40000 ALTER TABLE `hr_AttendancePermission` DISABLE KEYS */
;
INSERT INTO
    `hr_AttendancePermission`
VALUES (
        'cmtosbd9o009ngsud9nfig8dn',
        'cmt8rjfwt001mgsuza9e8zkde',
        'full_day',
        '2026-09-05 00:00:00.000',
        '2026-09-05 00:00:00.000',
        NULL,
        NULL,
        'approved',
        '2026-09-05 19:37:25.740',
        '2026-09-05 19:37:25.740',
        NULL
    );
/*!40000 ALTER TABLE `hr_AttendancePermission` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `hr_Department`
--

DROP TABLE IF EXISTS `hr_Department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `hr_Department` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `managerId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `Department_code_key` (`code`),
    UNIQUE KEY `Department_name_key` (`name`),
    KEY `Department_managerId_idx` (`managerId`),
    CONSTRAINT `Department_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `hr_Employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `hr_Department`
--

LOCK TABLES `hr_Department` WRITE;
/*!40000 ALTER TABLE `hr_Department` DISABLE KEYS */
;
INSERT INTO
    `hr_Department`
VALUES (
        'cmt8rjfvj001fgsuz5r0t0a49',
        'CARD',
        'Marketing',
        'Cardiology and cardiovascular services',
        'cmt8rjfwl001kgsuzbwmza8rr',
        'active',
        '2026-08-25 14:31:23.935',
        '2026-09-05 17:19:35.696'
    ),
    (
        'cmt8rjfvq001ggsuzrupsrxku',
        'FIN',
        'Finance',
        'Finance and accounting department',
        'cmt8rjfwt001mgsuza9e8zkde',
        'active',
        '2026-08-25 14:31:23.942',
        '2026-08-31 21:55:56.706'
    );
/*!40000 ALTER TABLE `hr_Department` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `hr_EmployeeAttendance`
--

DROP TABLE IF EXISTS `hr_EmployeeAttendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `hr_EmployeeAttendance` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `attendanceDate` datetime(3) NOT NULL,
    `checkIn` datetime(3) DEFAULT NULL,
    `checkOut` datetime(3) DEFAULT NULL,
    `workedMinutes` int NOT NULL DEFAULT '0',
    `lateMinutes` int NOT NULL DEFAULT '0',
    `earlyLeaveMinutes` int NOT NULL DEFAULT '0',
    `overtimeMinutes` int NOT NULL DEFAULT '0',
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'present',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `EmployeeAttendance_employeeId_attendanceDate_key` (
        `employeeId`,
        `attendanceDate`
    ),
    KEY `EmployeeAttendance_attendanceDate_idx` (`attendanceDate`),
    CONSTRAINT `EmployeeAttendance_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `hr_Employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `hr_EmployeeAttendance`
--

LOCK TABLES `hr_EmployeeAttendance` WRITE;
/*!40000 ALTER TABLE `hr_EmployeeAttendance` DISABLE KEYS */
;
INSERT INTO
    `hr_EmployeeAttendance`
VALUES (
        'cmths29g0006mgssl0pqsl54p',
        'cmths296q004qgsslesug1lk2',
        '2026-08-04 00:00:00.000',
        '2026-08-04 06:00:00.000',
        '2026-08-04 14:00:00.000',
        480,
        0,
        0,
        0,
        'present',
        '2026-08-31 21:55:57.648',
        '2026-08-31 21:55:57.648'
    ),
    (
        'cmths29g0006qgsslosopmhsg',
        'cmths29cb005ugsslwfprjw4y',
        '2026-08-08 00:00:00.000',
        '2026-08-08 06:00:00.000',
        '2026-08-08 14:00:00.000',
        480,
        0,
        0,
        30,
        'present',
        '2026-08-31 21:55:57.648',
        '2026-08-31 21:55:57.648'
    );
/*!40000 ALTER TABLE `hr_EmployeeAttendance` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `hr_EmployeeIdea`
--

DROP TABLE IF EXISTS `hr_EmployeeIdea`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `hr_EmployeeIdea` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'submitted',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `EmployeeIdea_userId_createdAt_idx` (`userId`, `createdAt`),
    CONSTRAINT `EmployeeIdea_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `access_User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `hr_EmployeeIdea`
--

LOCK TABLES `hr_EmployeeIdea` WRITE;
/*!40000 ALTER TABLE `hr_EmployeeIdea` DISABLE KEYS */
;
/*!40000 ALTER TABLE `hr_EmployeeIdea` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `hr_EmployeeSalary`
--

DROP TABLE IF EXISTS `hr_EmployeeSalary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `hr_EmployeeSalary` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `baseSalary` double NOT NULL,
    `currencyId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `payType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `effectiveFrom` datetime(3) NOT NULL,
    `effectiveTo` datetime(3) DEFAULT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `EmployeeSalary_employeeId_idx` (`employeeId`),
    CONSTRAINT `EmployeeSalary_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `hr_Employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `hr_EmployeeSalary`
--

LOCK TABLES `hr_EmployeeSalary` WRITE;
/*!40000 ALTER TABLE `hr_EmployeeSalary` DISABLE KEYS */
;
INSERT INTO
    `hr_EmployeeSalary`
VALUES (
        'cmt8rjfxv001sgsuz6f97kbn8',
        'cmt8rjfwl001kgsuzbwmza8rr',
        600000,
        'IQD',
        'monthly',
        '2026-01-01 00:00:00.000',
        NULL,
        '2026-08-25 14:31:24.020',
        '2026-09-05 21:12:43.622'
    ),
    (
        'cmt8rjfy2001ugsuz17gw7os1',
        'cmt8rjfwt001mgsuza9e8zkde',
        650000,
        'IQD',
        'monthly',
        '2026-01-01 00:00:00.000',
        NULL,
        '2026-08-25 14:31:24.027',
        '2026-09-05 21:12:52.672'
    ),
    (
        'cmths29co005wgssliozwbdny',
        'cmths29cb005ugsslwfprjw4y',
        350000,
        'IQD',
        'monthly',
        '2026-01-01 00:00:00.000',
        NULL,
        '2026-08-31 21:55:57.528',
        '2026-09-05 21:13:40.913'
    ),
    (
        'cmtovek87004lgssdy0g4t7ck',
        'cmtooh1p7000dgszf2agpvblv',
        350000,
        'IQD',
        'monthly',
        '2026-09-01 00:00:00.000',
        '2026-09-30 00:00:00.000',
        '2026-09-05 21:03:53.575',
        '2026-09-05 21:03:53.575'
    ),
    (
        'cmtovf128004ogssdy5gs7fm7',
        'cmtoogc6q000bgszfmrzdipra',
        350000,
        'IQD',
        'monthly',
        '2026-09-01 00:00:00.000',
        '2026-09-30 00:00:00.000',
        '2026-09-05 21:04:15.393',
        '2026-09-05 21:04:15.393'
    ),
    (
        'cmtovfg0w004rgssdh3kncx1a',
        'cmtooflbl0009gszfetww3j5s',
        350000,
        'IQD',
        'monthly',
        '2026-09-01 00:00:00.000',
        '2026-09-30 00:00:00.000',
        '2026-09-05 21:04:34.784',
        '2026-09-05 21:04:34.784'
    ),
    (
        'cmtovgbnk004ugssddjaw0h8d',
        'cmtoodx3u0001gszfupsyin5h',
        350000,
        'IQD',
        'monthly',
        '2026-09-01 00:00:00.000',
        '2026-09-30 00:00:00.000',
        '2026-09-05 21:05:15.776',
        '2026-09-05 21:05:15.776'
    ),
    (
        'cmtovh594004xgssdk9aesbyk',
        'cmtejrmbi0026gsq6kwta0vvc',
        350000,
        'IQD',
        'monthly',
        '2026-09-01 00:00:00.000',
        '2026-09-30 00:00:00.000',
        '2026-09-05 21:05:54.137',
        '2026-09-05 21:05:54.137'
    );
/*!40000 ALTER TABLE `hr_EmployeeSalary` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `hr_EmployeeTarget`
--

DROP TABLE IF EXISTS `hr_EmployeeTarget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `hr_EmployeeTarget` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` text COLLATE utf8mb4_unicode_ci,
    `metric` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `unit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `targetValue` double NOT NULL,
    `currentValue` double NOT NULL DEFAULT '0',
    `startDate` datetime(3) NOT NULL,
    `dueDate` datetime(3) NOT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `createdById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `EmployeeTarget_employeeId_status_idx` (`employeeId`, `status`),
    KEY `EmployeeTarget_createdById_idx` (`createdById`),
    KEY `EmployeeTarget_dueDate_idx` (`dueDate`),
    CONSTRAINT `EmployeeTarget_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `access_User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `EmployeeTarget_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `hr_Employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `hr_EmployeeTarget`
--

LOCK TABLES `hr_EmployeeTarget` WRITE;
/*!40000 ALTER TABLE `hr_EmployeeTarget` DISABLE KEYS */
;
/*!40000 ALTER TABLE `hr_EmployeeTarget` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `hr_Employees`
--

DROP TABLE IF EXISTS `hr_Employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `hr_Employees` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `employeeCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `departmentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `positionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `hireDate` datetime(3) NOT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    `checkInTime` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '09:00',
    `checkOutTime` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '17:00',
    `isTeamLeader` tinyint(1) NOT NULL DEFAULT '0',
    `teamLeaderId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `Employee_employeeCode_key` (`employeeCode`),
    UNIQUE KEY `Employee_userId_key` (`userId`),
    KEY `Employee_departmentId_idx` (`departmentId`),
    KEY `Employee_positionId_idx` (`positionId`),
    KEY `Employee_teamLeaderId_idx` (`teamLeaderId`),
    CONSTRAINT `Employee_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `hr_Department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `Employee_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `hr_Position` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `Employee_teamLeaderId_fkey` FOREIGN KEY (`teamLeaderId`) REFERENCES `hr_Employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `Employee_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `access_User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `hr_Employees`
--

LOCK TABLES `hr_Employees` WRITE;
/*!40000 ALTER TABLE `hr_Employees` DISABLE KEYS */
;
INSERT INTO
    `hr_Employees`
VALUES (
        'cmt8rjfwl001kgsuzbwmza8rr',
        'EMP-1001',
        NULL,
        'Nasim',
        'Muhammad',
        'cmt8rjfvj001fgsuz5r0t0a49',
        'cmt8rjfv5001dgsuzad84mtxp',
        '2023-01-15 00:00:00.000',
        'active',
        '2026-08-25 14:31:23.973',
        '2026-09-05 17:19:35.705',
        '09:00',
        '16:00',
        0,
        NULL
    ),
    (
        'cmt8rjfwt001mgsuza9e8zkde',
        'EMP-1002',
        NULL,
        'Qasem',
        'Najm',
        'cmt8rjfvq001ggsuzrupsrxku',
        'cmtnf0ny800cpgsizxvpws2pr',
        '2024-02-01 00:00:00.000',
        'active',
        '2026-08-25 14:31:23.981',
        '2026-09-04 20:37:41.331',
        '17:00',
        '22:00',
        0,
        NULL
    ),
    (
        'cmtejrmbi0026gsq6kwta0vvc',
        'EMP-1003',
        'cmtejqldw0025gsq6kslih6ov',
        'Muhammad',
        'Azad',
        'cmt8rjfvj001fgsuz5r0t0a49',
        'cmtejioyp001cgsq6y7zlx2n6',
        '2026-08-29 00:00:00.000',
        'active',
        '2026-08-29 15:40:25.662',
        '2026-09-05 17:47:59.641',
        '09:00',
        '16:00',
        0,
        NULL
    ),
    (
        'cmths296q004qgsslesug1lk2',
        'EMP-004',
        NULL,
        'Darya',
        'Nadir',
        'cmt8rjfvj001fgsuz5r0t0a49',
        'cmths2964004mgssl9u0agpue',
        '2022-05-05 00:00:00.000',
        'active',
        '2026-08-31 21:55:57.315',
        '2026-09-05 17:47:54.873',
        '09:00',
        '16:00',
        0,
        NULL
    ),
    (
        'cmths29cb005ugsslwfprjw4y',
        'EMP-008',
        NULL,
        'Nahri',
        'Sadiq',
        'cmt8rjfvj001fgsuz5r0t0a49',
        'cmths29br005qgsslzqt9xyi6',
        '2022-09-09 00:00:00.000',
        'active',
        '2026-08-31 21:55:57.516',
        '2026-09-05 17:47:49.344',
        '09:00',
        '16:00',
        0,
        NULL
    ),
    (
        'cmtoodx3u0001gszfupsyin5h',
        'EMP-20202',
        'cmtonb1le006ags1bgt7r1h50',
        'Ashna',
        'Arshad',
        'cmt8rjfvj001fgsuz5r0t0a49',
        'cmt8rjfvc001egsuzgsulvca0',
        '2026-09-05 00:00:00.000',
        'active',
        '2026-09-05 17:47:26.298',
        '2026-09-05 17:47:26.298',
        '09:00',
        '16:00',
        0,
        NULL
    ),
    (
        'cmtooflbl0009gszfetww3j5s',
        'EMP-009',
        'cmton9rb50067gs1bfkp5oh89',
        'Bery',
        'NHO',
        'cmt8rjfvj001fgsuz5r0t0a49',
        'cmths298v0056gssljhx9jopg',
        '2026-09-05 00:00:00.000',
        'active',
        '2026-09-05 17:48:44.337',
        '2026-09-05 17:48:44.337',
        '09:00',
        '16:00',
        0,
        NULL
    ),
    (
        'cmtoogc6q000bgszfmrzdipra',
        'EMP-0019',
        'cmton8vnj0065gs1b2n9rlxwa',
        'Lana',
        'Omer',
        'cmt8rjfvj001fgsuz5r0t0a49',
        'cmths298v0056gssljhx9jopg',
        '2026-09-05 00:00:00.000',
        'active',
        '2026-09-05 17:49:19.155',
        '2026-09-05 17:49:19.155',
        '09:00',
        '16:00',
        0,
        NULL
    ),
    (
        'cmtooh1p7000dgszf2agpvblv',
        'EMP-0010',
        'cmton7fr90063gs1bdwokmrc2',
        'Soma',
        'Nadir',
        'cmt8rjfvj001fgsuz5r0t0a49',
        'cmths298v0056gssljhx9jopg',
        '2026-09-05 00:00:00.000',
        'active',
        '2026-09-05 17:49:52.220',
        '2026-09-05 17:49:52.220',
        '09:00',
        '16:00',
        0,
        NULL
    ),
    (
        'cmtoohliz000fgszf38tu3wm3',
        'EMP-011',
        'cmton6n1p0060gs1bsrbmjaj9',
        'Sonya',
        'Nadir',
        'cmt8rjfvj001fgsuz5r0t0a49',
        'cmths298v0056gssljhx9jopg',
        '2026-09-05 00:00:00.000',
        'active',
        '2026-09-05 17:50:17.915',
        '2026-09-05 19:07:40.809',
        '09:00',
        '16:00',
        0,
        NULL
    );
/*!40000 ALTER TABLE `hr_Employees` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `hr_Payroll`
--

DROP TABLE IF EXISTS `hr_Payroll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `hr_Payroll` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `salaryId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `year` int NOT NULL,
    `month` int NOT NULL,
    `baseSalary` double NOT NULL,
    `overtimeAmount` double NOT NULL DEFAULT '0',
    `bonusAmount` double NOT NULL DEFAULT '0',
    `allowanceAmount` double NOT NULL DEFAULT '0',
    `lateDeduction` double NOT NULL DEFAULT '0',
    `absenceDeduction` double NOT NULL DEFAULT '0',
    `otherDeduction` double NOT NULL DEFAULT '0',
    `grossSalary` double NOT NULL,
    `totalDeduction` double NOT NULL,
    `netSalary` double NOT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
    `paidAt` datetime(3) DEFAULT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `Payroll_employeeId_year_month_key` (`employeeId`, `year`, `month`),
    KEY `Payroll_salaryId_idx` (`salaryId`),
    CONSTRAINT `hr_Payroll_salaryId_fkey` FOREIGN KEY (`salaryId`) REFERENCES `hr_EmployeeSalary` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `Payroll_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `hr_Employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `hr_Payroll`
--

LOCK TABLES `hr_Payroll` WRITE;
/*!40000 ALTER TABLE `hr_Payroll` DISABLE KEYS */
;
INSERT INTO
    `hr_Payroll`
VALUES (
        'cmt8rjfya001wgsuzzwta30ph',
        'cmt8rjfwt001mgsuza9e8zkde',
        'cmt8rjfy2001ugsuz17gw7os1',
        2026,
        8,
        1500000,
        100000,
        50000,
        75000,
        25000,
        0,
        0,
        1725000,
        25000,
        1700000,
        'approved',
        NULL,
        '2026-08-25 14:31:24.034',
        '2026-08-25 14:31:24.034'
    ),
    (
        'cmths29g6006wgssl5c9anwc2',
        'cmths296q004qgsslesug1lk2',
        NULL,
        2026,
        8,
        1040000,
        0,
        0,
        0,
        25000,
        0,
        0,
        1040000,
        25000,
        1015000,
        'paid',
        '2026-08-28 00:00:00.000',
        '2026-08-31 21:55:57.654',
        '2026-08-31 21:55:57.654'
    ),
    (
        'cmths29g60070gsslzw116y5u',
        'cmths29cb005ugsslwfprjw4y',
        'cmths29co005wgssliozwbdny',
        2026,
        8,
        1180000,
        0,
        0,
        0,
        25000,
        0,
        0,
        1180000,
        25000,
        1155000,
        'approved',
        NULL,
        '2026-08-31 21:55:57.654',
        '2026-08-31 21:55:57.654'
    );
/*!40000 ALTER TABLE `hr_Payroll` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `hr_PayrollAdjustment`
--

DROP TABLE IF EXISTS `hr_PayrollAdjustment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `hr_PayrollAdjustment` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `year` int NOT NULL,
    `month` int NOT NULL,
    `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `amount` double NOT NULL,
    `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    `appliedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sourceId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `sourceType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `PayrollAdjustment_sourceType_sourceId_key` (`sourceType`, `sourceId`),
    KEY `PayrollAdjustment_employeeId_year_month_idx` (`employeeId`, `year`, `month`),
    KEY `PayrollAdjustment_year_month_type_idx` (`year`, `month`, `type`),
    KEY `PayrollAdjustment_appliedAt_idx` (`appliedAt`),
    CONSTRAINT `PayrollAdjustment_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `hr_Employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `hr_PayrollAdjustment`
--

LOCK TABLES `hr_PayrollAdjustment` WRITE;
/*!40000 ALTER TABLE `hr_PayrollAdjustment` DISABLE KEYS */
;
/*!40000 ALTER TABLE `hr_PayrollAdjustment` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `hr_Position`
--

DROP TABLE IF EXISTS `hr_Position`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `hr_Position` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `Position_name_key` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `hr_Position`
--

LOCK TABLES `hr_Position` WRITE;
/*!40000 ALTER TABLE `hr_Position` DISABLE KEYS */
;
INSERT INTO
    `hr_Position`
VALUES (
        'cmt8rjfv5001dgsuzad84mtxp',
        'Specialist Doctor',
        'Clinical specialist',
        'active',
        '2026-08-25 14:31:23.921',
        '2026-08-31 21:55:56.634'
    ),
    (
        'cmt8rjfvc001egsuzgsulvca0',
        'Accountant',
        'Finance and accounting',
        'active',
        '2026-08-25 14:31:23.928',
        '2026-08-31 21:55:56.641'
    ),
    (
        'cmtejioyp001cgsq6y7zlx2n6',
        'Graphic Designer',
        'make and editing video',
        'active',
        '2026-08-29 15:33:29.186',
        '2026-08-29 15:33:50.435'
    ),
    (
        'cmths291c003sgsslbejsxm94',
        'Emergency Physician',
        'SEED: Emergency Physician',
        'active',
        '2026-08-31 21:55:57.121',
        '2026-08-31 21:55:57.121'
    ),
    (
        'cmths29330042gssl4gpargcw',
        'Registered Nurse',
        'SEED: Registered Nurse',
        'active',
        '2026-08-31 21:55:57.184',
        '2026-08-31 21:55:57.184'
    ),
    (
        'cmths294l004cgsslnwse7vqv',
        'Pediatric Specialist',
        'SEED: Pediatric Specialist',
        'active',
        '2026-08-31 21:55:57.238',
        '2026-08-31 21:55:57.238'
    ),
    (
        'cmths2964004mgssl9u0agpue',
        'Radiology Technician',
        'SEED: Radiology Technician',
        'active',
        '2026-08-31 21:55:57.293',
        '2026-08-31 21:55:57.293'
    ),
    (
        'cmths297h004wgsslk2gv3slm',
        'General Surgeon',
        'General Surgeon',
        'active',
        '2026-08-31 21:55:57.342',
        '2026-09-08 21:15:40.833'
    ),
    (
        'cmths298v0056gssljhx9jopg',
        'Clinical Pharmacist',
        'SEED: Clinical Pharmacist',
        'active',
        '2026-08-31 21:55:57.392',
        '2026-08-31 21:55:57.392'
    ),
    (
        'cmths29ab005ggsslwsmkk81m',
        'Laboratory Technician',
        'SEED: Laboratory Technician',
        'active',
        '2026-08-31 21:55:57.444',
        '2026-08-31 21:55:57.444'
    ),
    (
        'cmths29br005qgsslzqt9xyi6',
        'Patient Coordinator',
        'SEED: Patient Coordinator',
        'active',
        '2026-08-31 21:55:57.496',
        '2026-08-31 21:55:57.496'
    ),
    (
        'cmths29d20060gsslrbtcihwx',
        'Medical Receptionist',
        'SEED: Medical Receptionist',
        'active',
        '2026-08-31 21:55:57.543',
        '2026-08-31 21:55:57.543'
    ),
    (
        'cmths29en006agsslqlh89kr6',
        'Healthcare Administrator',
        'SEED: Healthcare Administrator',
        'active',
        '2026-08-31 21:55:57.600',
        '2026-08-31 21:55:57.600'
    ),
    (
        'cmtnf0ny800cpgsizxvpws2pr',
        'Full Stack Developer',
        'IT Supporter and system Manager',
        'active',
        '2026-09-04 20:37:25.185',
        '2026-09-04 20:37:25.185'
    );
/*!40000 ALTER TABLE `hr_Position` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `hr_SalaryAdvance`
--

DROP TABLE IF EXISTS `hr_SalaryAdvance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `hr_SalaryAdvance` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `amount` double NOT NULL,
    `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IQD',
    `requestedAt` datetime(3) NOT NULL,
    `approvedAt` datetime(3) DEFAULT NULL,
    `deductionStartDate` datetime(3) DEFAULT NULL,
    `installments` int NOT NULL DEFAULT '1',
    `deductedAmount` double NOT NULL DEFAULT '0',
    `remainingAmount` double NOT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'requested',
    `notes` text COLLATE utf8mb4_unicode_ci,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `SalaryAdvance_employeeId_idx` (`employeeId`),
    KEY `SalaryAdvance_status_idx` (`status`),
    KEY `SalaryAdvance_requestedAt_idx` (`requestedAt`),
    CONSTRAINT `SalaryAdvance_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `hr_Employees` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `hr_SalaryAdvance`
--

LOCK TABLES `hr_SalaryAdvance` WRITE;
/*!40000 ALTER TABLE `hr_SalaryAdvance` DISABLE KEYS */
;
INSERT INTO
    `hr_SalaryAdvance`
VALUES (
        'cmt8rjg1l002jgsuzzicwptq9',
        'cmt8rjfwt001mgsuza9e8zkde',
        300000,
        'IQD',
        '2026-08-10 00:00:00.000',
        '2026-08-11 00:00:00.000',
        '2026-09-01 00:00:00.000',
        3,
        0,
        300000,
        'approved',
        'Integrated seed advance',
        '2026-08-25 14:31:24.154',
        '2026-08-25 14:31:24.154'
    ),
    (
        'cmths29gf0076gssl7uzwn3vx',
        'cmths296q004qgsslesug1lk2',
        130000,
        'IQD',
        '2026-07-04 00:00:00.000',
        '2026-07-05 00:00:00.000',
        '2026-09-01 00:00:00.000',
        5,
        0,
        130000,
        'approved',
        'SEED: Salary advance 4',
        '2026-08-31 21:55:57.663',
        '2026-08-31 21:55:57.663'
    ),
    (
        'cmths29gf007agssl6au8gq9l',
        'cmths29cb005ugsslwfprjw4y',
        170000,
        'IQD',
        '2026-07-08 00:00:00.000',
        '2026-07-09 00:00:00.000',
        '2026-09-01 00:00:00.000',
        5,
        0,
        170000,
        'approved',
        'SEED: Salary advance 8',
        '2026-08-31 21:55:57.663',
        '2026-08-31 21:55:57.663'
    );
/*!40000 ALTER TABLE `hr_SalaryAdvance` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `hr_Warning`
--

DROP TABLE IF EXISTS `hr_Warning`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `hr_Warning` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `senderId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `severity` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'warning',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    KEY `Warning_createdAt_idx` (`createdAt`),
    KEY `Warning_senderId_fkey` (`senderId`),
    CONSTRAINT `Warning_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `access_User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `hr_Warning`
--

LOCK TABLES `hr_Warning` WRITE;
/*!40000 ALTER TABLE `hr_Warning` DISABLE KEYS */
;
INSERT INTO
    `hr_Warning`
VALUES (
        'cmtacymbp0027gsrfa6xnfck9',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Hello',
        'We need Developer',
        'warning',
        '2026-08-26 17:18:50.245'
    );
/*!40000 ALTER TABLE `hr_Warning` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `hr_WarningRecipient`
--

DROP TABLE IF EXISTS `hr_WarningRecipient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `hr_WarningRecipient` (
    `warningId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `readAt` datetime(3) DEFAULT NULL,
    PRIMARY KEY (`warningId`, `userId`),
    KEY `WarningRecipient_userId_readAt_idx` (`userId`, `readAt`),
    CONSTRAINT `WarningRecipient_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `access_User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `WarningRecipient_warningId_fkey` FOREIGN KEY (`warningId`) REFERENCES `hr_Warning` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `hr_WarningRecipient`
--

LOCK TABLES `hr_WarningRecipient` WRITE;
/*!40000 ALTER TABLE `hr_WarningRecipient` DISABLE KEYS */
;
INSERT INTO
    `hr_WarningRecipient`
VALUES (
        'cmtacymbp0027gsrfa6xnfck9',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-26 17:18:59.954'
    ),
    (
        'cmtacymbp0027gsrfa6xnfck9',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 21:42:04.111'
    ),
    (
        'cmtacymbp0027gsrfa6xnfck9',
        'cmt8rjfw2001igsuzj4qwnrgc',
        NULL
    );
/*!40000 ALTER TABLE `hr_WarningRecipient` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `inventory_InventoryDepartmentOrder`
--

DROP TABLE IF EXISTS `inventory_InventoryDepartmentOrder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `inventory_InventoryDepartmentOrder` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `departmentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `departmentName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `deadline` datetime(3) DEFAULT NULL,
    `note` text COLLATE utf8mb4_unicode_ci,
    `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `items` json NOT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
    `price` decimal(18, 2) DEFAULT NULL,
    `reason` text COLLATE utf8mb4_unicode_ci,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `inventory_InventoryDepartmentOrder`
--

LOCK TABLES `inventory_InventoryDepartmentOrder` WRITE;
/*!40000 ALTER TABLE `inventory_InventoryDepartmentOrder` DISABLE KEYS */
;
INSERT INTO
    `inventory_InventoryDepartmentOrder`
VALUES (
        'cmtru6spr0000gsvtic5m0gsz',
        'cmt8rjfvq001ggsuzrupsrxku',
        'Finance',
        'equipment',
        NULL,
        '',
        NULL,
        '[{\"name\": \"Urine Drainage Bag — 2 L\", \"quantity\": 100, \"productId\": \"health_seed_044\", \"warehouseId\": \"cmt8rjgz300bngsuzr8a8c9co\", \"warehouseName\": \"Wherehouse Gullan\"}]',
        'pending',
        NULL,
        NULL,
        '2026-09-07 22:53:10.239'
    );
/*!40000 ALTER TABLE `inventory_InventoryDepartmentOrder` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `inventory_InventoryDepartmentOrderComment`
--

DROP TABLE IF EXISTS `inventory_InventoryDepartmentOrderComment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `inventory_InventoryDepartmentOrderComment` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `orderId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `note` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    KEY `inventory_InventoryDepartmentOrderComment_orderId_idx` (`orderId`),
    CONSTRAINT `inventory_InventoryDepartmentOrderComment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `inventory_InventoryDepartmentOrder` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `inventory_InventoryDepartmentOrderComment`
--

LOCK TABLES `inventory_InventoryDepartmentOrderComment` WRITE;
/*!40000 ALTER TABLE `inventory_InventoryDepartmentOrderComment` DISABLE KEYS */
;
/*!40000 ALTER TABLE `inventory_InventoryDepartmentOrderComment` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `inventory_InventoryMovement`
--

DROP TABLE IF EXISTS `inventory_InventoryMovement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `inventory_InventoryMovement` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `warehouseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `movementType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `quantity` double NOT NULL,
    `reference` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `occurredAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    KEY `InventoryMovement_occurredAt_idx` (`occurredAt`),
    KEY `InventoryMovement_productId_idx` (`productId`),
    KEY `InventoryMovement_warehouseId_idx` (`warehouseId`),
    CONSTRAINT `InventoryMovement_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `inventory_InventoryProduct` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `InventoryMovement_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `inventory_InventoryWarehouse` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `inventory_InventoryMovement`
--

LOCK TABLES `inventory_InventoryMovement` WRITE;
/*!40000 ALTER TABLE `inventory_InventoryMovement` DISABLE KEYS */
;
INSERT INTO
    `inventory_InventoryMovement`
VALUES (
        'cmths29v200bygsslc99z5h7y',
        'cmt8rjh2n00cdgsuz5t8lh4uu',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'purchase',
        100,
        'SEED-OPEN-001',
        'SEED: Opening stock',
        '2026-08-31 21:55:58.190'
    ),
    (
        'cmths29vl00c8gssl2vtjumrb',
        'cmt8rjh3d00cngsuz847jgzrb',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'purchase',
        100,
        'SEED-OPEN-002',
        'SEED: Opening stock',
        '2026-08-31 21:55:58.210'
    ),
    (
        'cmths29w500cigsslwrn20pno',
        'cmt8rjh4400cxgsuzn99cs2o4',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'purchase',
        100,
        'SEED-OPEN-003',
        'SEED: Opening stock',
        '2026-08-31 21:55:58.230'
    ),
    (
        'cmths29wr00csgssl4tka65sg',
        'cmt8rjh4t00d7gsuzxzo0xokr',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'purchase',
        100,
        'SEED-OPEN-004',
        'SEED: Opening stock',
        '2026-08-31 21:55:58.252'
    ),
    (
        'cmths29xj00d2gssl6jyl4xvr',
        'cmt8rjh5d00dhgsuzv7dj909p',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'purchase',
        100,
        'SEED-OPEN-005',
        'SEED: Opening stock',
        '2026-08-31 21:55:58.280'
    ),
    (
        'cmths29y100dcgsslqigjd91a',
        'cmt8rjh6900drgsuzpval91o7',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'purchase',
        100,
        'SEED-OPEN-006',
        'SEED: Opening stock',
        '2026-08-31 21:55:58.298'
    ),
    (
        'cmths29yl00dmgsslnzyia9lg',
        'cmt8rjh6w00e1gsuz4jb8fted',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'purchase',
        100,
        'SEED-OPEN-007',
        'SEED: Opening stock',
        '2026-08-31 21:55:58.318'
    ),
    (
        'cmths29z500dwgsslv45r312o',
        'cmt8rjh7j00ebgsuzw2snte8z',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'purchase',
        100,
        'SEED-OPEN-008',
        'SEED: Opening stock',
        '2026-08-31 21:55:58.338'
    ),
    (
        'cmths29zq00e6gssl09hnkr7f',
        'cmt8rjh8300elgsuzdxx97st1',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'purchase',
        100,
        'SEED-OPEN-009',
        'SEED: Opening stock',
        '2026-08-31 21:55:58.359'
    ),
    (
        'cmths2a0i00eggsslhrxpnv93',
        'cmt8rjh8p00evgsuzzmqp0s05',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'purchase',
        100,
        'SEED-OPEN-010',
        'SEED: Opening stock',
        '2026-08-31 21:55:58.386'
    ),
    (
        'cmtitgv8k002hgs456bda6eoi',
        'cmt8rjh4400cxgsuzn99cs2o4',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'sale',
        -1,
        'POS-1788276184864-685',
        'POS sale POS-1788276184864-685',
        '2026-09-01 15:23:04.868'
    ),
    (
        'cmtitgv8l002jgs45gdv324t7',
        'cmt8rjh4t00d7gsuzxzo0xokr',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'sale',
        -1,
        'POS-1788276184864-685',
        'POS sale POS-1788276184864-685',
        '2026-09-01 15:23:04.870'
    ),
    (
        'cmtithcv5002pgs4588kiepz0',
        'cmt8rjh3d00cngsuz847jgzrb',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'sale',
        -2,
        'POS-1788276207711-579',
        'POS sale POS-1788276207711-579',
        '2026-09-01 15:23:27.714'
    ),
    (
        'cmtithq1o002vgs45yx1tz50t',
        'cmt8rjh4t00d7gsuzxzo0xokr',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'sale',
        -1,
        'POS-1788276224793-444',
        'POS sale POS-1788276224793-444',
        '2026-09-01 15:23:44.797'
    ),
    (
        'cmtrq2c1j0002gsaxxou80q7y',
        'cmt8rjh2n00cdgsuz5t8lh4uu',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'transfer_out',
        -3,
        'TR-d88dac14-022a-4af7-8c60-28962f82af31',
        NULL,
        '2026-09-07 20:57:43.543'
    ),
    (
        'cmtrq2c1j0003gsaxehh0uruc',
        'cmt8rjh2n00cdgsuz5t8lh4uu',
        'cmt8rjgz300bngsuzr8a8c9co',
        'transfer_in',
        3,
        'TR-d88dac14-022a-4af7-8c60-28962f82af31',
        NULL,
        '2026-09-07 20:57:43.543'
    );
/*!40000 ALTER TABLE `inventory_InventoryMovement` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `inventory_InventoryOrder`
--

DROP TABLE IF EXISTS `inventory_InventoryOrder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `inventory_InventoryOrder` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `requestId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `note` text COLLATE utf8mb4_unicode_ci,
    `items` json NOT NULL,
    `totalPrice` decimal(18, 2) NOT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `inventory_InventoryOrder_requestId_key` (`requestId`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `inventory_InventoryOrder`
--

LOCK TABLES `inventory_InventoryOrder` WRITE;
/*!40000 ALTER TABLE `inventory_InventoryOrder` DISABLE KEYS */
;
/*!40000 ALTER TABLE `inventory_InventoryOrder` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `inventory_InventoryProduct`
--

DROP TABLE IF EXISTS `inventory_InventoryProduct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `inventory_InventoryProduct` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `sku` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `barcode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `brandId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `unit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'item',
    `costPrice` double NOT NULL,
    `sellingPrice` double NOT NULL,
    `taxRate` double NOT NULL DEFAULT '0',
    `discountType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `discountValue` double NOT NULL DEFAULT '0',
    `discountStart` datetime(3) DEFAULT NULL,
    `discountEnd` datetime(3) DEFAULT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    `isSpecial` tinyint(1) NOT NULL DEFAULT '0',
    `size` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `boxPrice` double NOT NULL DEFAULT '0',
    `specialProfitRate` double NOT NULL DEFAULT '0',
    `specialPrice` double NOT NULL DEFAULT '0',
    `productType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'patient_use',
    `productionCompany` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `expiryDate` date DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `InventoryProduct_sku_key` (`sku`),
    UNIQUE KEY `InventoryProduct_barcode_key` (`barcode`),
    KEY `InventoryProduct_categoryId_idx` (`categoryId`),
    KEY `InventoryProduct_brandId_idx` (`brandId`),
    KEY `InventoryProduct_status_idx` (`status`),
    CONSTRAINT `InventoryProduct_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `inventory_ProductBrand` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `InventoryProduct_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `inventory_ProductCategory` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `inventory_InventoryProduct`
--

LOCK TABLES `inventory_InventoryProduct` WRITE;
/*!40000 ALTER TABLE `inventory_InventoryProduct` DISABLE KEYS */
;
INSERT INTO
    `inventory_InventoryProduct`
VALUES (
        'cmt8rjh2n00cdgsuz5t8lh4uu',
        'SEED-SKU-001',
        NULL,
        'Seed Medical Product 001',
        NULL,
        NULL,
        'item',
        2600,
        4150,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'inactive',
        '2026-08-25 14:31:25.487',
        '2026-09-07 21:16:40.701',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'cmt8rjh3d00cngsuz847jgzrb',
        'SEED-SKU-002',
        NULL,
        'Seed Medical Product 002',
        NULL,
        NULL,
        'item',
        2700,
        4300,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'inactive',
        '2026-08-25 14:31:25.513',
        '2026-09-07 21:16:40.703',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'cmt8rjh4400cxgsuzn99cs2o4',
        'SEED-SKU-003',
        '990000003',
        'Seed Medical Product 003',
        NULL,
        NULL,
        'item',
        2800,
        4450,
        5,
        NULL,
        0,
        NULL,
        NULL,
        'inactive',
        '2026-08-25 14:31:25.541',
        '2026-09-07 21:16:40.705',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'cmt8rjh4t00d7gsuzxzo0xokr',
        'SEED-SKU-004',
        '990000004',
        'Seed Medical Product 004',
        NULL,
        NULL,
        'item',
        2900,
        4600,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'inactive',
        '2026-08-25 14:31:25.565',
        '2026-09-07 21:16:40.706',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'cmt8rjh5d00dhgsuzv7dj909p',
        'SEED-SKU-005',
        '990000005',
        'Seed Medical Product 005',
        NULL,
        NULL,
        'item',
        3000,
        4750,
        0,
        'percentage',
        10,
        '2026-08-01 00:00:00.000',
        '2026-09-30 00:00:00.000',
        'inactive',
        '2026-08-25 14:31:25.585',
        '2026-09-07 21:16:40.708',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'cmt8rjh6900drgsuzpval91o7',
        'SEED-SKU-006',
        '990000006',
        'Seed Medical Product 006',
        NULL,
        NULL,
        'item',
        3100,
        4900,
        5,
        NULL,
        0,
        NULL,
        NULL,
        'inactive',
        '2026-08-25 14:31:25.617',
        '2026-09-07 21:16:40.710',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'cmt8rjh6w00e1gsuz4jb8fted',
        'SEED-SKU-007',
        '990000007',
        'Seed Medical Product 007',
        NULL,
        NULL,
        'item',
        3200,
        5050,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'inactive',
        '2026-08-25 14:31:25.640',
        '2026-09-07 21:16:40.711',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'cmt8rjh7j00ebgsuzw2snte8z',
        'SEED-SKU-008',
        '990000008',
        'Seed Medical Product 008',
        NULL,
        NULL,
        'item',
        3300,
        5200,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'inactive',
        '2026-08-25 14:31:25.663',
        '2026-09-07 21:16:40.712',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'cmt8rjh8300elgsuzdxx97st1',
        'SEED-SKU-009',
        '990000009',
        'Seed Medical Product 009',
        NULL,
        NULL,
        'item',
        3400,
        5350,
        5,
        NULL,
        0,
        NULL,
        NULL,
        'inactive',
        '2026-08-25 14:31:25.683',
        '2026-09-07 21:16:40.714',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'cmt8rjh8p00evgsuzzmqp0s05',
        'SEED-SKU-010',
        '990000010',
        'Seed Medical Product 010',
        NULL,
        NULL,
        'item',
        3500,
        5500,
        0,
        'fixed',
        500,
        '2026-08-01 00:00:00.000',
        '2026-09-30 00:00:00.000',
        'inactive',
        '2026-08-25 14:31:25.705',
        '2026-09-07 21:16:40.715',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_001',
        'HEALTH-001',
        NULL,
        'Nitrile Examination Gloves — Small',
        'cmtrqqpho0000gserutxjjhpg',
        NULL,
        'box',
        5,
        6.25,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.717',
        '2026-09-07 21:16:40.717',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_002',
        'HEALTH-002',
        NULL,
        'Nitrile Examination Gloves — Medium',
        'cmtrqqpho0000gserutxjjhpg',
        NULL,
        'box',
        5,
        6.25,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.719',
        '2026-09-07 21:16:40.719',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_003',
        'HEALTH-003',
        NULL,
        'Nitrile Examination Gloves — Large',
        'cmtrqqpho0000gserutxjjhpg',
        NULL,
        'box',
        5,
        6.25,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.720',
        '2026-09-07 21:16:40.720',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_004',
        'HEALTH-004',
        NULL,
        'Surgical Face Masks',
        'cmtrqqpho0000gserutxjjhpg',
        NULL,
        'box',
        3,
        3.75,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.721',
        '2026-09-07 21:16:40.721',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_005',
        'HEALTH-005',
        NULL,
        'Disposable Isolation Gown',
        'cmtrqqpho0000gserutxjjhpg',
        NULL,
        'item',
        1.5,
        1.88,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.722',
        '2026-09-07 21:16:40.722',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_006',
        'HEALTH-006',
        NULL,
        'Disposable Surgical Cap',
        'cmtrqqpho0000gserutxjjhpg',
        NULL,
        'pack',
        3,
        3.75,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.723',
        '2026-09-07 21:16:40.723',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_007',
        'HEALTH-007',
        NULL,
        'Disposable Shoe Covers',
        'cmtrqqpho0000gserutxjjhpg',
        NULL,
        'pack',
        3,
        3.75,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.724',
        '2026-09-07 21:16:40.724',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_008',
        'HEALTH-008',
        NULL,
        'Protective Face Shield',
        'cmtrqqpho0000gserutxjjhpg',
        NULL,
        'item',
        2,
        2.5,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.725',
        '2026-09-07 21:16:40.725',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_009',
        'HEALTH-009',
        NULL,
        'Safety Goggles',
        'cmtrqqpho0000gserutxjjhpg',
        NULL,
        'item',
        4,
        5,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.726',
        '2026-09-07 21:16:40.726',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_010',
        'HEALTH-010',
        NULL,
        'Sterile Surgical Gloves — Size 7',
        'cmtrqqpho0000gserutxjjhpg',
        NULL,
        'pair',
        1,
        1.25,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.727',
        '2026-09-07 21:16:40.727',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_011',
        'HEALTH-011',
        NULL,
        'Sterile Gauze Swabs — 5 × 5 cm',
        'cmtrqqpi00001gsertl9rn4hf',
        NULL,
        'pack',
        1,
        1.25,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.729',
        '2026-09-07 21:16:40.729',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_012',
        'HEALTH-012',
        NULL,
        'Sterile Gauze Swabs — 10 × 10 cm',
        'cmtrqqpi00001gsertl9rn4hf',
        NULL,
        'pack',
        1.5,
        1.88,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.730',
        '2026-09-07 21:16:40.730',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_013',
        'HEALTH-013',
        NULL,
        'Adhesive Bandages — Assorted',
        'cmtrqqpi00001gsertl9rn4hf',
        'cmtrs5u67000rgs4dx31nwc7v',
        'box',
        2,
        2.5,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.731',
        '2026-09-08 22:48:00.644',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        '2026-09-09'
    ),
    (
        'health_seed_014',
        'HEALTH-014',
        NULL,
        'Medical Adhesive Tape — 2.5 cm',
        'cmtrqqpi00001gsertl9rn4hf',
        NULL,
        'roll',
        1,
        1.25,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.732',
        '2026-09-07 21:16:40.732',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_015',
        'HEALTH-015',
        NULL,
        'Elastic Bandage — 10 cm',
        'cmtrqqpi00001gsertl9rn4hf',
        NULL,
        'roll',
        2,
        2.5,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.733',
        '2026-09-07 21:16:40.733',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_016',
        'HEALTH-016',
        NULL,
        'Cotton Wool — 500 g',
        'cmtrqqpi00001gsertl9rn4hf',
        NULL,
        'pack',
        3,
        3.75,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.734',
        '2026-09-07 21:16:40.734',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_017',
        'HEALTH-017',
        NULL,
        'Non-adherent Dressing — 10 × 10 cm',
        'cmtrqqpi00001gsertl9rn4hf',
        NULL,
        'item',
        1,
        1.25,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.735',
        '2026-09-07 21:16:40.735',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_018',
        'HEALTH-018',
        NULL,
        'Transparent Film Dressing — 6 × 7 cm',
        'cmtrqqpi00001gsertl9rn4hf',
        NULL,
        'item',
        1.2,
        1.5,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.736',
        '2026-09-07 21:16:40.736',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_019',
        'HEALTH-019',
        NULL,
        'Wound Closure Strips',
        'cmtrqqpi00001gsertl9rn4hf',
        NULL,
        'pack',
        2,
        2.5,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.737',
        '2026-09-07 21:16:40.737',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_020',
        'HEALTH-020',
        NULL,
        'Sterile Abdominal Pad — 10 × 20 cm',
        'cmtrqqpi00001gsertl9rn4hf',
        NULL,
        'item',
        1.5,
        1.88,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.738',
        '2026-09-07 21:16:40.738',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_021',
        'HEALTH-021',
        NULL,
        'Disposable Syringe — 2 mL',
        'cmtrqqpib0002gserh5jf4cpe',
        NULL,
        'item',
        0.15,
        0.19,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.740',
        '2026-09-07 21:16:40.740',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_022',
        'HEALTH-022',
        NULL,
        'Disposable Syringe — 5 mL',
        'cmtrqqpib0002gserh5jf4cpe',
        NULL,
        'item',
        0.2,
        0.25,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.741',
        '2026-09-07 21:16:40.741',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_023',
        'HEALTH-023',
        NULL,
        'Disposable Syringe — 10 mL',
        'cmtrqqpib0002gserh5jf4cpe',
        NULL,
        'item',
        0.3,
        0.38,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.742',
        '2026-09-07 21:16:40.742',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_024',
        'HEALTH-024',
        NULL,
        'Disposable Syringe — 20 mL',
        'cmtrqqpib0002gserh5jf4cpe',
        NULL,
        'item',
        0.5,
        0.63,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.743',
        '2026-09-07 21:16:40.743',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_025',
        'HEALTH-025',
        NULL,
        'Hypodermic Needle — 21G',
        'cmtrqqpib0002gserh5jf4cpe',
        NULL,
        'item',
        0.08,
        0.1,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.744',
        '2026-09-07 21:16:40.744',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_026',
        'HEALTH-026',
        NULL,
        'Hypodermic Needle — 23G',
        'cmtrqqpib0002gserh5jf4cpe',
        NULL,
        'item',
        0.08,
        0.1,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.745',
        '2026-09-07 21:16:40.745',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_027',
        'HEALTH-027',
        NULL,
        'Peripheral IV Cannula — 18G',
        'cmtrqqpib0002gserh5jf4cpe',
        NULL,
        'item',
        0.6,
        0.75,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.746',
        '2026-09-07 21:16:40.746',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_028',
        'HEALTH-028',
        NULL,
        'Peripheral IV Cannula — 20G',
        'cmtrqqpib0002gserh5jf4cpe',
        NULL,
        'item',
        0.6,
        0.75,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.747',
        '2026-09-07 21:16:40.747',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_029',
        'HEALTH-029',
        NULL,
        'IV Administration Set',
        'cmtrqqpib0002gserh5jf4cpe',
        NULL,
        'item',
        0.8,
        1,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.748',
        '2026-09-07 21:16:40.748',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_030',
        'HEALTH-030',
        NULL,
        'Three-way Stopcock',
        'cmtrqqpib0002gserh5jf4cpe',
        NULL,
        'item',
        0.5,
        0.63,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.749',
        '2026-09-07 21:16:40.749',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_031',
        'HEALTH-031',
        NULL,
        'Digital Thermometer',
        'cmtrqqpim0003gsert0g7eove',
        NULL,
        'item',
        3,
        3.75,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.751',
        '2026-09-07 21:16:40.751',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_032',
        'HEALTH-032',
        NULL,
        'Infrared Forehead Thermometer',
        'cmtrqqpim0003gsert0g7eove',
        NULL,
        'item',
        15,
        18.75,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.751',
        '2026-09-07 21:16:40.751',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_033',
        'HEALTH-033',
        NULL,
        'Fingertip Pulse Oximeter',
        'cmtrqqpim0003gsert0g7eove',
        NULL,
        'item',
        12,
        15,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.753',
        '2026-09-07 21:16:40.753',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_034',
        'HEALTH-034',
        NULL,
        'Aneroid Blood Pressure Monitor',
        'cmtrqqpim0003gsert0g7eove',
        NULL,
        'item',
        18,
        22.5,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.754',
        '2026-09-07 21:16:40.754',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_035',
        'HEALTH-035',
        NULL,
        'Adult Blood Pressure Cuff',
        'cmtrqqpim0003gsert0g7eove',
        NULL,
        'item',
        6,
        7.5,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.755',
        '2026-09-07 22:18:39.983',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        '2026-09-08'
    ),
    (
        'health_seed_036',
        'HEALTH-036',
        NULL,
        'Pediatric Blood Pressure Cuff',
        'cmtrqqpim0003gsert0g7eove',
        NULL,
        'item',
        6,
        7.5,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.755',
        '2026-09-07 21:16:40.755',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_037',
        'HEALTH-037',
        NULL,
        'Dual-head Stethoscope',
        'cmtrqqpim0003gsert0g7eove',
        NULL,
        'item',
        10,
        12.5,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.757',
        '2026-09-07 21:16:40.757',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_038',
        'HEALTH-038',
        NULL,
        'Diagnostic Penlight',
        'cmtrqqpim0003gsert0g7eove',
        NULL,
        'item',
        2,
        2.5,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.758',
        '2026-09-07 21:16:40.758',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_039',
        'HEALTH-039',
        NULL,
        'Disposable Tongue Depressors',
        'cmtrqqpim0003gsert0g7eove',
        NULL,
        'box',
        2,
        2.5,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.759',
        '2026-09-07 21:16:40.759',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_040',
        'HEALTH-040',
        NULL,
        'ECG Electrodes',
        'cmtrqqpim0003gsert0g7eove',
        NULL,
        'pack',
        4,
        5,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.759',
        '2026-09-07 21:16:40.759',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_041',
        'HEALTH-041',
        NULL,
        'Adult Nasal Oxygen Cannula',
        'cmtrqqpiw0004gsero02jsoso',
        NULL,
        'item',
        0.8,
        1,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.761',
        '2026-09-07 22:19:44.062',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        '2026-09-30'
    ),
    (
        'health_seed_042',
        'HEALTH-042',
        NULL,
        'Adult Oxygen Mask',
        'cmtrqqpiw0004gsero02jsoso',
        NULL,
        'item',
        1.2,
        1.5,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.762',
        '2026-09-07 21:16:40.762',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_043',
        'HEALTH-043',
        NULL,
        'Adult Nebulizer Mask Kit',
        'cmtrqqpiw0004gsero02jsoso',
        NULL,
        'item',
        2,
        2.5,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.763',
        '2026-09-07 21:16:40.763',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_044',
        'HEALTH-044',
        NULL,
        'Urine Drainage Bag — 2 L',
        'cmtrqqpiw0004gsero02jsoso',
        NULL,
        'item',
        0.8,
        1,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.764',
        '2026-09-07 21:16:40.764',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_045',
        'HEALTH-045',
        NULL,
        'Sterile Specimen Container — 60 mL',
        'cmtrqqpiw0004gsero02jsoso',
        NULL,
        'item',
        0.25,
        0.31,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.765',
        '2026-09-07 21:16:40.765',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_046',
        'HEALTH-046',
        NULL,
        'Disposable Underpads — 60 × 90 cm',
        'cmtrqqpiw0004gsero02jsoso',
        NULL,
        'pack',
        4,
        5,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.766',
        '2026-09-07 21:16:40.766',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_047',
        'HEALTH-047',
        NULL,
        'Emesis Basin',
        'cmtrqqpiw0004gsero02jsoso',
        NULL,
        'item',
        1.5,
        1.88,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.767',
        '2026-09-07 21:16:40.767',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_048',
        'HEALTH-048',
        NULL,
        'Sharps Container — 5 L',
        'cmtrqqpiw0004gsero02jsoso',
        NULL,
        'item',
        3,
        3.75,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.768',
        '2026-09-07 21:16:40.768',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_049',
        'HEALTH-049',
        NULL,
        'Disposable Bed Sheet',
        'cmtrqqpiw0004gsero02jsoso',
        NULL,
        'item',
        1,
        1.25,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.769',
        '2026-09-07 21:16:40.769',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    ),
    (
        'health_seed_050',
        'HEALTH-050',
        NULL,
        'Patient Identification Wristband',
        'cmtrqqpiw0004gsero02jsoso',
        NULL,
        'item',
        0.15,
        0.19,
        0,
        NULL,
        0,
        NULL,
        NULL,
        'active',
        '2026-09-07 21:16:40.770',
        '2026-09-07 21:16:40.770',
        0,
        NULL,
        0,
        0,
        0,
        'patient_use',
        NULL,
        NULL
    );
/*!40000 ALTER TABLE `inventory_InventoryProduct` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `inventory_InventoryProductImage`
--

DROP TABLE IF EXISTS `inventory_InventoryProductImage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `inventory_InventoryProductImage` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `isMain` tinyint(1) NOT NULL DEFAULT '0',
    `sortOrder` int NOT NULL DEFAULT '0',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    KEY `products_images_productId_sortOrder_idx` (`productId`, `sortOrder`),
    CONSTRAINT `products_images_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `inventory_InventoryProduct` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `inventory_InventoryProductImage`
--

LOCK TABLES `inventory_InventoryProductImage` WRITE;
/*!40000 ALTER TABLE `inventory_InventoryProductImage` DISABLE KEYS */
;
/*!40000 ALTER TABLE `inventory_InventoryProductImage` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `inventory_InventoryPurchase`
--

DROP TABLE IF EXISTS `inventory_InventoryPurchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `inventory_InventoryPurchase` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `requestId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `invoiceNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `buyDate` datetime(3) NOT NULL,
    `retailer` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `salesperson` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `isDebt` tinyint(1) NOT NULL DEFAULT '0',
    `note` text COLLATE utf8mb4_unicode_ci,
    `attachmentUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `totalPrice` decimal(18, 2) NOT NULL,
    `items` json NOT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'completed',
    `paidAmount` decimal(18, 2) NOT NULL DEFAULT '0.00',
    PRIMARY KEY (`id`),
    UNIQUE KEY `inventory_InventoryPurchase_requestId_key` (`requestId`),
    UNIQUE KEY `inventory_InventoryPurchase_retailer_invoiceNumber_key` (`retailer`, `invoiceNumber`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `inventory_InventoryPurchase`
--

LOCK TABLES `inventory_InventoryPurchase` WRITE;
/*!40000 ALTER TABLE `inventory_InventoryPurchase` DISABLE KEYS */
;
/*!40000 ALTER TABLE `inventory_InventoryPurchase` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `inventory_InventoryPurchasePayment`
--

DROP TABLE IF EXISTS `inventory_InventoryPurchasePayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `inventory_InventoryPurchasePayment` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `requestId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `purchaseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `amount` decimal(18, 2) NOT NULL,
    `paidAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `note` text COLLATE utf8mb4_unicode_ci,
    PRIMARY KEY (`id`),
    UNIQUE KEY `inventory_InventoryPurchasePayment_requestId_key` (`requestId`),
    KEY `inventory_InventoryPurchasePayment_purchaseId_idx` (`purchaseId`),
    CONSTRAINT `inventory_InventoryPurchasePayment_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `inventory_InventoryPurchase` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `inventory_InventoryPurchasePayment`
--

LOCK TABLES `inventory_InventoryPurchasePayment` WRITE;
/*!40000 ALTER TABLE `inventory_InventoryPurchasePayment` DISABLE KEYS */
;
/*!40000 ALTER TABLE `inventory_InventoryPurchasePayment` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `inventory_InventoryStock`
--

DROP TABLE IF EXISTS `inventory_InventoryStock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `inventory_InventoryStock` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `warehouseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `quantity` double NOT NULL DEFAULT '0',
    `reorderLevel` double NOT NULL DEFAULT '0',
    `anesthesiaMinimum` double NOT NULL DEFAULT '0',
    `scrubNurseMinimum` double NOT NULL DEFAULT '0',
    `perfusionMinimum` double NOT NULL DEFAULT '0',
    `cardiologyMinimum` double NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`),
    UNIQUE KEY `InventoryStock_productId_warehouseId_key` (`productId`, `warehouseId`),
    KEY `InventoryStock_warehouseId_idx` (`warehouseId`),
    CONSTRAINT `InventoryStock_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `inventory_InventoryProduct` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `InventoryStock_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `inventory_InventoryWarehouse` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `inventory_InventoryStock`
--

LOCK TABLES `inventory_InventoryStock` WRITE;
/*!40000 ALTER TABLE `inventory_InventoryStock` DISABLE KEYS */
;
INSERT INTO
    `inventory_InventoryStock`
VALUES (
        'cmt8rjh2u00cfgsuzijb31tom',
        'cmt8rjh2n00cdgsuz5t8lh4uu',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        97,
        20,
        0,
        0,
        0,
        0
    ),
    (
        'cmt8rjh3k00cpgsuzb7ajstmv',
        'cmt8rjh3d00cngsuz847jgzrb',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        98,
        20,
        0,
        0,
        0,
        0
    ),
    (
        'cmt8rjh4c00czgsuzs2awruu3',
        'cmt8rjh4400cxgsuzn99cs2o4',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        99,
        20,
        0,
        0,
        0,
        0
    ),
    (
        'cmt8rjh4y00d9gsuz58ycvi7b',
        'cmt8rjh4t00d7gsuzxzo0xokr',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        98,
        20,
        0,
        0,
        0,
        0
    ),
    (
        'cmt8rjh5s00djgsuzu0xoswde',
        'cmt8rjh5d00dhgsuzv7dj909p',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        100,
        20,
        0,
        0,
        0,
        0
    ),
    (
        'cmt8rjh6e00dtgsuziih2xfsn',
        'cmt8rjh6900drgsuzpval91o7',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        100,
        20,
        0,
        0,
        0,
        0
    ),
    (
        'cmt8rjh7100e3gsuzvbs7kbif',
        'cmt8rjh6w00e1gsuz4jb8fted',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        100,
        20,
        0,
        0,
        0,
        0
    ),
    (
        'cmt8rjh7o00edgsuzpw71drzf',
        'cmt8rjh7j00ebgsuzw2snte8z',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        100,
        20,
        0,
        0,
        0,
        0
    ),
    (
        'cmt8rjh8800engsuzskgpl16g',
        'cmt8rjh8300elgsuzdxx97st1',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        100,
        20,
        0,
        0,
        0,
        0
    ),
    (
        'cmt8rjh9000exgsuzy62mb6vp',
        'cmt8rjh8p00evgsuzzmqp0s05',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        100,
        20,
        0,
        0,
        0,
        0
    ),
    (
        'cmtrq2c1h0001gsaxr0ohl9w8',
        'cmt8rjh2n00cdgsuz5t8lh4uu',
        'cmt8rjgz300bngsuzr8a8c9co',
        3,
        0,
        0,
        0,
        0,
        0
    );
/*!40000 ALTER TABLE `inventory_InventoryStock` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `inventory_InventoryWarehouse`
--

DROP TABLE IF EXISTS `inventory_InventoryWarehouse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `inventory_InventoryWarehouse` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `InventoryWarehouse_code_key` (`code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `inventory_InventoryWarehouse`
--

LOCK TABLES `inventory_InventoryWarehouse` WRITE;
/*!40000 ALTER TABLE `inventory_InventoryWarehouse` DISABLE KEYS */
;
INSERT INTO
    `inventory_InventoryWarehouse`
VALUES (
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'WH-001',
        'Wherehouse Arzheen',
        'Erbil Brayate',
        'active',
        '2026-08-25 14:31:25.341',
        '2026-09-07 22:01:49.683'
    ),
    (
        'cmt8rjgz300bngsuzr8a8c9co',
        'WH-002',
        'Wherehouse Gullan',
        'Erbil , Raparin',
        'active',
        '2026-08-25 14:31:25.359',
        '2026-09-07 22:01:54.500'
    );
/*!40000 ALTER TABLE `inventory_InventoryWarehouse` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `inventory_ProductBrand`
--

DROP TABLE IF EXISTS `inventory_ProductBrand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `inventory_ProductBrand` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `product_brands_name_key` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `inventory_ProductBrand`
--

LOCK TABLES `inventory_ProductBrand` WRITE;
/*!40000 ALTER TABLE `inventory_ProductBrand` DISABLE KEYS */
;
INSERT INTO
    `inventory_ProductBrand`
VALUES (
        'cmtrs5u62000kgs4dd2lnidoj',
        'BD',
        'Medical technology brand associated with injection, infusion and specimen collection products.',
        'active',
        '2026-09-07 21:56:26.235',
        '2026-09-07 21:59:32.482'
    ),
    (
        'cmtrs5u63000lgs4d91rm4128',
        'B. Braun',
        'Healthcare brand associated with infusion therapy, surgical instruments and clinical supplies.',
        'active',
        '2026-09-07 21:56:26.236',
        '2026-09-07 21:59:32.483'
    ),
    (
        'cmtrs5u64000mgs4d808dio3m',
        'Baxter',
        'Healthcare brand associated with hospital therapies and infusion products.',
        'active',
        '2026-09-07 21:56:26.236',
        '2026-09-07 21:59:32.484'
    ),
    (
        'cmtrs5u65000ngs4djhn7ssy3',
        'Medtronic',
        'Medical technology brand associated with surgical devices and patient therapies.',
        'active',
        '2026-09-07 21:56:26.237',
        '2026-09-07 21:59:32.485'
    ),
    (
        'cmtrs5u65000ogs4dwa1t2ozb',
        'Terumo',
        'Medical device brand associated with injection, infusion and cardiovascular products.',
        'active',
        '2026-09-07 21:56:26.238',
        '2026-09-07 21:59:32.486'
    ),
    (
        'cmtrs5u66000pgs4d3664h1id',
        'Fresenius Kabi',
        'Healthcare brand associated with infusion therapy and clinical nutrition.',
        'active',
        '2026-09-07 21:56:26.238',
        '2026-09-07 21:59:32.487'
    ),
    (
        'cmtrs5u67000qgs4dx02ltpud',
        'Fresenius Medical Care',
        'Healthcare brand associated with dialysis equipment and kidney care products.',
        'active',
        '2026-09-07 21:56:26.239',
        '2026-09-07 21:59:32.487'
    ),
    (
        'cmtrs5u67000rgs4dx31nwc7v',
        'Abbott',
        'Healthcare brand associated with diagnostics, medical devices and nutrition products.',
        'active',
        '2026-09-07 21:56:26.240',
        '2026-09-07 21:59:32.488'
    ),
    (
        'cmtrs5u68000sgs4dbhc5mnwh',
        'Roche',
        'Healthcare brand associated with laboratory diagnostics and pharmaceutical products.',
        'active',
        '2026-09-07 21:56:26.240',
        '2026-09-07 21:59:32.489'
    ),
    (
        'cmtrs5u68000tgs4d32mz8dwm',
        'Siemens Healthineers',
        'Medical technology brand associated with imaging and laboratory diagnostics.',
        'active',
        '2026-09-07 21:56:26.241',
        '2026-09-07 21:59:32.490'
    ),
    (
        'cmtrs5u69000ugs4dln9qx20y',
        'GE HealthCare',
        'Medical technology brand associated with imaging, ultrasound and patient monitoring.',
        'active',
        '2026-09-07 21:56:26.242',
        '2026-09-07 21:59:32.491'
    ),
    (
        'cmtrs5u6a000vgs4dmnd6rxgs',
        'Philips',
        'Healthcare technology brand associated with imaging and patient monitoring equipment.',
        'active',
        '2026-09-07 21:56:26.242',
        '2026-09-07 21:59:32.492'
    ),
    (
        'cmtrs5u6b000wgs4ds9jxa7ph',
        'Dräger',
        'Medical technology brand associated with ventilation, anesthesia and patient monitoring.',
        'active',
        '2026-09-07 21:56:26.243',
        '2026-09-07 21:59:32.493'
    ),
    (
        'cmtrs5u6b000xgs4duhfuljpr',
        'Mindray',
        'Medical equipment brand associated with monitoring, ultrasound and laboratory diagnostics.',
        'active',
        '2026-09-07 21:56:26.244',
        '2026-09-07 21:59:32.494'
    ),
    (
        'cmtrs5u6c000ygs4dxwxwx74f',
        'Nihon Kohden',
        'Medical electronics brand associated with patient monitoring and diagnostic equipment.',
        'active',
        '2026-09-07 21:56:26.244',
        '2026-09-07 21:59:32.495'
    ),
    (
        'cmtrs5u6d000zgs4d55dhu0pt',
        'OMRON',
        'Healthcare brand associated with blood pressure monitors and personal health devices.',
        'active',
        '2026-09-07 21:56:26.245',
        '2026-09-07 21:59:32.496'
    ),
    (
        'cmtrs5u6d0010gs4d8xbofjg8',
        'Welch Allyn',
        'Medical equipment brand associated with clinical examination and vital-sign measurement.',
        'active',
        '2026-09-07 21:56:26.246',
        '2026-09-07 21:59:32.497'
    ),
    (
        'cmtrs5u6e0011gs4dbe4pjt22',
        'Stryker',
        'Medical technology brand associated with surgical and orthopedic equipment.',
        'active',
        '2026-09-07 21:56:26.247',
        '2026-09-07 21:59:32.497'
    ),
    (
        'cmtrs5u6f0012gs4ddn3re7b5',
        'Zimmer Biomet',
        'Medical technology brand associated with orthopedic implants and surgical instruments.',
        'active',
        '2026-09-07 21:56:26.247',
        '2026-09-07 21:59:32.498'
    ),
    (
        'cmtrs5u6f0013gs4d18a3y92p',
        'Smith+Nephew',
        'Medical technology brand associated with orthopedics, sports medicine and wound management.',
        'active',
        '2026-09-07 21:56:26.248',
        '2026-09-07 21:59:32.499'
    ),
    (
        'cmtrs5u6g0014gs4dgli4bye0',
        'Mölnlycke',
        'Medical products brand associated with wound care and surgical supplies.',
        'active',
        '2026-09-07 21:56:26.249',
        '2026-09-07 21:59:32.500'
    ),
    (
        'cmtrs5u6h0015gs4d8oa2rxoh',
        'HARTMANN',
        'Healthcare products brand associated with wound care, hygiene and incontinence care.',
        'active',
        '2026-09-07 21:56:26.250',
        '2026-09-07 21:59:32.501'
    ),
    (
        'cmtrs5u6i0016gs4d7nnzfaw2',
        'Coloplast',
        'Medical products brand associated with ostomy, continence and wound care.',
        'active',
        '2026-09-07 21:56:26.250',
        '2026-09-07 21:59:32.502'
    ),
    (
        'cmtrs5u6i0017gs4dh05bo4pq',
        'ConvaTec',
        'Medical products brand associated with wound, ostomy and continence care.',
        'active',
        '2026-09-07 21:56:26.251',
        '2026-09-07 21:59:32.503'
    ),
    (
        'cmtrs5u6j0018gs4dfm7zhoe1',
        'Hollister',
        'Medical products brand associated with ostomy and continence care.',
        'active',
        '2026-09-07 21:56:26.252',
        '2026-09-07 21:59:32.504'
    ),
    (
        'cmtrs5u6k0019gs4d57rztxvd',
        'Teleflex',
        'Medical device brand associated with vascular access and airway management products.',
        'active',
        '2026-09-07 21:56:26.252',
        '2026-09-07 21:59:32.505'
    ),
    (
        'cmtrs5u6l001ags4d96lou4oo',
        'Ambu',
        'Medical device brand associated with resuscitation and single-use endoscopy products.',
        'active',
        '2026-09-07 21:56:26.253',
        '2026-09-07 21:59:32.506'
    ),
    (
        'cmtrs5u6l001bgs4dof64s6u0',
        'Littmann',
        'Stethoscope brand used for clinical auscultation.',
        'active',
        '2026-09-07 21:56:26.254',
        '2026-09-07 21:59:32.506'
    ),
    (
        'cmtrs5u6m001cgs4d7l3vhghw',
        'Ethicon',
        'Surgical products brand associated with sutures and wound-closure devices.',
        'active',
        '2026-09-07 21:56:26.255',
        '2026-09-07 21:59:32.507'
    ),
    (
        'cmtrs5u6n001dgs4df2ujtfgw',
        'Olympus',
        'Medical equipment brand associated with endoscopy and surgical visualization.',
        'active',
        '2026-09-07 21:56:26.255',
        '2026-09-07 21:59:32.508'
    );
/*!40000 ALTER TABLE `inventory_ProductBrand` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `inventory_ProductCategory`
--

DROP TABLE IF EXISTS `inventory_ProductCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `inventory_ProductCategory` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `ProductCategory_name_key` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `inventory_ProductCategory`
--

LOCK TABLES `inventory_ProductCategory` WRITE;
/*!40000 ALTER TABLE `inventory_ProductCategory` DISABLE KEYS */
;
INSERT INTO
    `inventory_ProductCategory`
VALUES (
        'cmtrqqpho0000gserutxjjhpg',
        'Protective Equipment',
        'Personal protective items including gloves, masks, gowns and eye protection.',
        'active',
        '2026-09-07 21:16:40.717',
        '2026-09-07 21:59:32.455'
    ),
    (
        'cmtrqqpi00001gsertl9rn4hf',
        'Wound Care',
        'Dressings, gauze, bandages and supplies for wound care.',
        'active',
        '2026-09-07 21:16:40.728',
        '2026-09-07 21:59:32.457'
    ),
    (
        'cmtrqqpib0002gserh5jf4cpe',
        'Injection and Infusion Supplies',
        'Syringes, needles, IV cannulas, tubing and infusion accessories.',
        'active',
        '2026-09-07 21:16:40.739',
        '2026-09-07 21:59:32.458'
    ),
    (
        'cmtrqqpim0003gsert0g7eove',
        'Diagnostic Equipment',
        'Instruments and devices used for clinical examination and measurement.',
        'active',
        '2026-09-07 21:16:40.750',
        '2026-09-07 21:59:32.460'
    ),
    (
        'cmtrqqpiw0004gsero02jsoso',
        'Patient Care Supplies',
        'Everyday consumables and accessories for bedside patient care.',
        'active',
        '2026-09-07 21:16:40.761',
        '2026-09-07 21:59:32.461'
    ),
    (
        'cmtrs5u5k0000gs4do2i74omv',
        'Surgical Instruments',
        'Reusable and disposable instruments used in surgical procedures.',
        'active',
        '2026-09-07 21:56:26.217',
        '2026-09-07 21:59:32.462'
    ),
    (
        'cmtrs5u5p0001gs4d52dquc6u',
        'Sutures and Wound Closure',
        'Sutures, staples, closure strips and related wound-closure supplies.',
        'active',
        '2026-09-07 21:56:26.221',
        '2026-09-07 21:59:32.463'
    ),
    (
        'cmtrs5u5p0002gs4dertga3me',
        'Respiratory Care',
        'Oxygen delivery, nebulization and respiratory support accessories.',
        'active',
        '2026-09-07 21:56:26.222',
        '2026-09-07 21:59:32.464'
    ),
    (
        'cmtrs5u5q0003gs4dkpqvg448',
        'Anesthesia Supplies',
        'Airway management and breathing-circuit supplies for anesthesia services.',
        'active',
        '2026-09-07 21:56:26.223',
        '2026-09-07 21:59:32.465'
    ),
    (
        'cmtrs5u5r0004gs4d7pddt456',
        'Laboratory Supplies',
        'Laboratory consumables, containers and general testing accessories.',
        'active',
        '2026-09-07 21:56:26.223',
        '2026-09-07 21:59:32.466'
    ),
    (
        'cmtrs5u5s0005gs4d4xpn9ab3',
        'Specimen Collection',
        'Containers, collection tubes and accessories for clinical specimens.',
        'active',
        '2026-09-07 21:56:26.224',
        '2026-09-07 21:59:32.468'
    ),
    (
        'cmtrs5u5s0006gs4dxy8nskpl',
        'Sterilization Supplies',
        'Packaging, indicators and accessories for sterilization workflows.',
        'active',
        '2026-09-07 21:56:26.225',
        '2026-09-07 21:59:32.469'
    ),
    (
        'cmtrs5u5t0007gs4d6q7jlh6i',
        'Disinfection and Hygiene',
        'Cleaning, hand hygiene and surface disinfection supplies.',
        'active',
        '2026-09-07 21:56:26.226',
        '2026-09-07 21:59:32.469'
    ),
    (
        'cmtrs5u5u0008gs4dyhptj9k2',
        'Urology Supplies',
        'Urinary catheters, drainage bags and urological care accessories.',
        'active',
        '2026-09-07 21:56:26.226',
        '2026-09-07 21:59:32.470'
    ),
    (
        'cmtrs5u5v0009gs4dan7mn3g2',
        'Enteral Feeding Supplies',
        'Feeding tubes, administration sets and enteral feeding accessories.',
        'active',
        '2026-09-07 21:56:26.227',
        '2026-09-07 21:59:32.471'
    ),
    (
        'cmtrs5u5v000ags4d69n456w7',
        'Orthopedic Supports',
        'Braces, splints and supports for orthopedic care.',
        'active',
        '2026-09-07 21:56:26.228',
        '2026-09-07 21:59:32.472'
    ),
    (
        'cmtrs5u5w000bgs4dzfipxs7m',
        'Rehabilitation Equipment',
        'Mobility aids and equipment for physical rehabilitation.',
        'active',
        '2026-09-07 21:56:26.228',
        '2026-09-07 21:59:32.473'
    ),
    (
        'cmtrs5u5x000cgs4dgipnj5ar',
        'Hospital Furniture',
        'Beds, examination couches, trolleys and clinical furnishings.',
        'active',
        '2026-09-07 21:56:26.229',
        '2026-09-07 21:59:32.474'
    ),
    (
        'cmtrs5u5x000dgs4dd8iq5fyh',
        'Patient Monitoring',
        'Patient monitors, sensors, electrodes and monitoring accessories.',
        'active',
        '2026-09-07 21:56:26.230',
        '2026-09-07 21:59:32.475'
    ),
    (
        'cmtrs5u5y000egs4dr7jen1yb',
        'Emergency and Resuscitation',
        'Equipment and consumables for emergency response and resuscitation.',
        'active',
        '2026-09-07 21:56:26.230',
        '2026-09-07 21:59:32.476'
    ),
    (
        'cmtrs5u5z000fgs4dcn9b3i1u',
        'Dental Supplies',
        'Instruments, consumables and accessories for dental services.',
        'active',
        '2026-09-07 21:56:26.231',
        '2026-09-07 21:59:32.477'
    ),
    (
        'cmtrs5u5z000ggs4dzmsvh9os',
        'Ophthalmic Supplies',
        'Supplies and accessories for eye examination and ophthalmic care.',
        'active',
        '2026-09-07 21:56:26.232',
        '2026-09-07 21:59:32.478'
    ),
    (
        'cmtrs5u60000hgs4dourdezlt',
        'Maternity and Neonatal Care',
        'Clinical supplies for maternity services and newborn care.',
        'active',
        '2026-09-07 21:56:26.233',
        '2026-09-07 21:59:32.479'
    ),
    (
        'cmtrs5u61000igs4d3wr4tyq8',
        'Medical Waste Disposal',
        'Sharps containers, clinical waste bags and disposal accessories.',
        'active',
        '2026-09-07 21:56:26.233',
        '2026-09-07 21:59:32.480'
    ),
    (
        'cmtrs5u62000jgs4dblm9q3b9',
        'Medical Imaging Accessories',
        'Accessories and consumables for medical imaging departments.',
        'active',
        '2026-09-07 21:56:26.234',
        '2026-09-07 21:59:32.481'
    );
/*!40000 ALTER TABLE `inventory_ProductCategory` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `meetings_Meeting`
--

DROP TABLE IF EXISTS `meetings_Meeting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `meetings_Meeting` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `roomCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `departmentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `creatorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` datetime(3) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `Meeting_roomCode_key` (`roomCode`),
    KEY `Meeting_departmentId_status_idx` (`departmentId`, `status`),
    KEY `Meeting_creatorId_idx` (`creatorId`),
    CONSTRAINT `Meeting_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `access_User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Meeting_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `hr_Department` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `meetings_Meeting`
--

LOCK TABLES `meetings_Meeting` WRITE;
/*!40000 ALTER TABLE `meetings_Meeting` DISABLE KEYS */
;
INSERT INTO
    `meetings_Meeting`
VALUES (
        'cmtewjk390001gs3pmqsoon7i',
        'Room',
        'FD79C006',
        'cmt8rjfvq001ggsuzrupsrxku',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'ended',
        '2026-08-29 21:38:04.534',
        '2026-08-29 21:51:41.971'
    ),
    (
        'cmtewuxn50007gs48srtlrioa',
        'Fin',
        '71633946',
        'cmt8rjfvq001ggsuzrupsrxku',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'ended',
        '2026-08-29 21:46:55.313',
        '2026-08-29 21:51:46.522'
    ),
    (
        'cmtex30uh0001gsn3b6lj1x00',
        'TIT',
        '67044E28',
        'cmt8rjfvq001ggsuzrupsrxku',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'ended',
        '2026-08-29 21:53:12.714',
        '2026-08-29 22:38:40.869'
    ),
    (
        'cmtex4ivw0001gs3tg5mcx9te',
        'Signaling diagnostic',
        'DFC9F150',
        'cmt8rjfvj001fgsuz5r0t0a49',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'ended',
        '2026-08-29 21:54:22.749',
        '2026-08-29 21:54:22.846'
    ),
    (
        'cmtg9zgv30001gs08d7tctozw',
        'XZ',
        '2106C0D4',
        'cmt8rjfvq001ggsuzrupsrxku',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'ended',
        '2026-08-30 20:42:08.031',
        '2026-08-30 22:28:49.542'
    ),
    (
        'cmtit6r47000vgs45k1dt4hkk',
        'Dev',
        'C6ED0441',
        'cmt8rjfvq001ggsuzrupsrxku',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'ended',
        '2026-09-01 15:15:12.968',
        '2026-09-02 12:44:20.252'
    ),
    (
        'cmtordrvs007cgsudmhyhju2h',
        'tyt',
        '9EAD2208',
        'cmt8rjfvj001fgsuz5r0t0a49',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'ended',
        '2026-09-05 19:11:18.377',
        '2026-09-05 20:40:50.832'
    ),
    (
        'cmtt78dov0002gsxdzpxfm4yo',
        'fd',
        '47E5906E',
        'cmt8rjfvj001fgsuz5r0t0a49',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'ended',
        '2026-09-08 21:46:05.264',
        '2026-09-08 21:47:41.918'
    );
/*!40000 ALTER TABLE `meetings_Meeting` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `meetings_MeetingParticipant`
--

DROP TABLE IF EXISTS `meetings_MeetingParticipant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `meetings_MeetingParticipant` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `meetingId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `joinedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `leftAt` datetime(3) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `MeetingParticipant_meetingId_idx` (`meetingId`),
    KEY `MeetingParticipant_userId_idx` (`userId`),
    CONSTRAINT `MeetingParticipant_meetingId_fkey` FOREIGN KEY (`meetingId`) REFERENCES `meetings_Meeting` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `MeetingParticipant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `access_User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `meetings_MeetingParticipant`
--

LOCK TABLES `meetings_MeetingParticipant` WRITE;
/*!40000 ALTER TABLE `meetings_MeetingParticipant` DISABLE KEYS */
;
INSERT INTO
    `meetings_MeetingParticipant`
VALUES (
        'cmtewjk4b0003gs3pt77b0amy',
        'cmtewjk390001gs3pmqsoon7i',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:38:04.572',
        '2026-08-29 21:38:49.493'
    ),
    (
        'cmtewkk2i0005gs3pu2f2lsn6',
        'cmtewjk390001gs3pmqsoon7i',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:38:51.162',
        '2026-08-29 21:38:59.614'
    ),
    (
        'cmtewl1rv0007gs3ptllfqnn8',
        'cmtewjk390001gs3pmqsoon7i',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:39:14.108',
        '2026-08-29 21:40:24.445'
    ),
    (
        'cmtewppu00001gs6ohlhwbwo6',
        'cmtewjk390001gs3pmqsoon7i',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:42:51.913',
        '2026-08-29 21:43:53.929'
    ),
    (
        'cmtewrmky0003gs6obncnrw96',
        'cmtewjk390001gs3pmqsoon7i',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:44:21.010',
        '2026-08-29 21:45:13.969'
    ),
    (
        'cmtewtgv90001gs48ry8yf6e9',
        'cmtewjk390001gs3pmqsoon7i',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:45:46.917',
        '2026-08-29 21:46:07.452'
    ),
    (
        'cmtewu0un0003gs480g4qidcc',
        'cmtewjk390001gs3pmqsoon7i',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:46:12.815',
        '2026-08-29 21:46:16.324'
    ),
    (
        'cmtewurjy0005gs48q7uq7rhm',
        'cmtewjk390001gs3pmqsoon7i',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:46:47.422',
        '2026-08-29 21:46:50.269'
    ),
    (
        'cmtewuxo00009gs4883tpmf3u',
        'cmtewuxn50007gs48srtlrioa',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:46:55.344',
        '2026-08-29 21:47:10.181'
    ),
    (
        'cmtewwapj000bgs48ltx5ibim',
        'cmtewjk390001gs3pmqsoon7i',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:47:58.904',
        '2026-08-29 21:51:41.971'
    ),
    (
        'cmtewxls80001gs46z7anc451',
        'cmtewjk390001gs3pmqsoon7i',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 21:48:59.912',
        '2026-08-29 21:48:59.918'
    ),
    (
        'cmtewy30c0003gs46fxczs0uj',
        'cmtewjk390001gs3pmqsoon7i',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:49:22.236',
        '2026-08-29 21:49:23.416'
    ),
    (
        'cmtex0xrc0001gs75i1e1hsc1',
        'cmtewjk390001gs3pmqsoon7i',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:51:35.401',
        '2026-08-29 21:51:36.417'
    ),
    (
        'cmtex0z9v0003gs75hdluhz25',
        'cmtewjk390001gs3pmqsoon7i',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:51:37.364',
        '2026-08-29 21:51:41.978'
    ),
    (
        'cmtex13no0005gs75jseeg84b',
        'cmtewuxn50007gs48srtlrioa',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:51:43.044',
        '2026-08-29 21:51:46.534'
    ),
    (
        'cmtex30vo0005gsn3542rivsx',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:53:12.756',
        '2026-08-29 22:38:40.869'
    ),
    (
        'cmtex4iyf0003gs3txqaff2el',
        'cmtex4ivw0001gs3tg5mcx9te',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:54:22.839',
        '2026-08-29 21:54:22.855'
    ),
    (
        'cmtex5bxw0001gsi6dhr4pao6',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 21:55:00.405',
        '2026-08-29 21:57:23.159'
    ),
    (
        'cmtex5efz0003gsi6kbxqiqq4',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:55:03.647',
        '2026-08-29 21:57:23.154'
    ),
    (
        'cmtex8ssw0005gsi6ybq06idq',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 21:57:42.225',
        '2026-08-29 21:58:08.283'
    ),
    (
        'cmtex8y7x0007gsi6vbu73dqx',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 21:57:49.245',
        '2026-08-29 21:58:34.235'
    ),
    (
        'cmtexcasr0001gsic7r9db6fu',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:00:25.515',
        '2026-08-29 22:38:40.869'
    ),
    (
        'cmtexceop0003gsicpdp5vf1x',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 22:00:30.553',
        '2026-08-29 22:38:40.869'
    ),
    (
        'cmtexeirh0001gst0iaj2c1bd',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:02:09.149',
        '2026-08-29 22:02:33.539'
    ),
    (
        'cmtexet2d0003gst0vruk66qw',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:02:22.502',
        '2026-08-29 22:02:34.262'
    ),
    (
        'cmtexfp8p0005gst02pqc09hw',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:03:04.201',
        '2026-08-29 22:03:14.890'
    ),
    (
        'cmtexhmhs0001gsu8d9w82rh7',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:04:33.953',
        '2026-08-29 22:04:43.384'
    ),
    (
        'cmtexicwg0003gsu86oep2gx7',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:05:08.177',
        '2026-08-29 22:06:11.606'
    ),
    (
        'cmtexj3cx0005gsu8x32lg0w7',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 22:05:42.466',
        '2026-08-29 22:06:11.418'
    ),
    (
        'cmtexjsed0007gsu8i2dbhtkn',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 22:06:14.917',
        '2026-08-29 22:06:44.462'
    ),
    (
        'cmtexk1yp0009gsu81uoeztak',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:06:27.313',
        '2026-08-29 22:06:44.461'
    ),
    (
        'cmtexkp9o000bgsu8l7glpu30',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 22:06:57.517',
        '2026-08-29 22:08:05.424'
    ),
    (
        'cmtexksdi000dgsu8v8icts0p',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:07:01.542',
        '2026-08-29 22:08:05.338'
    ),
    (
        'cmtexl3zh000fgsu8waqwjqr1',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:07:16.590',
        '2026-08-29 22:07:48.126'
    ),
    (
        'cmtexmtu4000hgsu8e2h5l3ch',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 22:08:36.749',
        '2026-08-29 22:09:07.125'
    ),
    (
        'cmtexmv2w000jgsu85w20gqmx',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:08:38.360',
        '2026-08-29 22:09:07.124'
    ),
    (
        'cmtexn67c000lgsu8ojc6d0kw',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:08:52.776',
        '2026-08-29 22:09:07.124'
    ),
    (
        'cmtexnt39000ngsu8d65okm2u',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:09:22.438',
        '2026-08-29 22:10:21.111'
    ),
    (
        'cmtexpowy000pgsu8djp21u89',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:10:50.339',
        '2026-08-29 22:12:34.304'
    ),
    (
        'cmtexq49z000rgsu8wvw5bdtw',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:11:10.247',
        '2026-08-29 22:11:37.546'
    ),
    (
        'cmtextfff000tgsu878bed62x',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:13:44.667',
        '2026-08-29 22:15:05.024'
    ),
    (
        'cmtexvh4t000vgsu8w8mf621z',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:15:20.189',
        '2026-08-29 22:15:27.837'
    ),
    (
        'cmtexw8jf000xgsu8pw2srp3e',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:15:55.707',
        '2026-08-29 22:16:14.952'
    ),
    (
        'cmtexxwwf000zgsu88o7tcxoe',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:17:13.935',
        '2026-08-29 22:18:25.041'
    ),
    (
        'cmtey57uq0001gsyl97ik4wyc',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:22:54.723',
        '2026-08-29 22:25:19.284'
    ),
    (
        'cmtey5z0i0003gsyl30fqhnrp',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 22:23:29.923',
        '2026-08-29 22:25:19.029'
    ),
    (
        'cmtey8hif0005gsylcuf28gs9',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 22:25:27.208',
        '2026-08-29 22:25:28.376'
    ),
    (
        'cmtey8v7p0007gsylpd3yh89s',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:25:44.965',
        '2026-08-29 22:26:24.913'
    ),
    (
        'cmtey8ynd0009gsylpa5wnssx',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 22:25:49.417',
        '2026-08-29 22:26:24.047'
    ),
    (
        'cmteyajfn000bgsyl0kom4qxo',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 22:27:03.012',
        '2026-08-29 22:27:14.220'
    ),
    (
        'cmteyak47000dgsylgl7psypq',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:27:03.896',
        '2026-08-29 22:27:14.218'
    ),
    (
        'cmteyay7c000fgsylqtn5mhni',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 22:27:22.152',
        '2026-08-29 22:27:38.056'
    ),
    (
        'cmteyc8b6000hgsylr02qjbx0',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 22:28:21.907',
        '2026-08-29 22:28:48.437'
    ),
    (
        'cmteycsz8000jgsylizj3pfts',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:28:48.693',
        '2026-08-29 22:38:40.869'
    ),
    (
        'cmteycvz8000lgsylk5gwj7ix',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 22:28:52.580',
        '2026-08-29 22:29:04.961'
    ),
    (
        'cmteyga8l0001gs1qpkin77v1',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 22:31:31.029',
        '2026-08-29 22:33:04.488'
    ),
    (
        'cmteygs4s0003gs1qgvrgpzw7',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:31:54.221',
        '2026-08-29 22:33:04.488'
    ),
    (
        'cmteyiz1u0005gs1qlabka7xm',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:33:36.498',
        '2026-08-29 22:34:24.267'
    ),
    (
        'cmteykrs50007gs1qfyw9mmuf',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:35:00.389',
        '2026-08-29 22:35:52.922'
    ),
    (
        'cmteyl02w0009gs1q8hawydsn',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 22:35:11.144',
        '2026-08-29 22:35:52.922'
    ),
    (
        'cmteymcyt000bgs1qdm1nmcjz',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:36:14.501',
        '2026-08-29 22:37:24.488'
    ),
    (
        'cmteyncxe000dgs1qnuh6gt5j',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-29 22:37:01.106',
        '2026-08-29 22:38:40.918'
    ),
    (
        'cmteyokbs000fgs1qxh7wfcjt',
        'cmtex30uh0001gsn3b6lj1x00',
        'cmt8rjfvv001hgsuz8s70rz74',
        '2026-08-29 22:37:57.352',
        '2026-08-29 22:38:40.892'
    ),
    (
        'cmtg9zgwe0005gs0866ttqawa',
        'cmtg9zgv30001gs08d7tctozw',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-30 20:42:08.078',
        '2026-08-30 20:44:58.120'
    ),
    (
        'cmtgdsmfj0001gsbpc8oruvor',
        'cmtg9zgv30001gs08d7tctozw',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-30 22:28:47.119',
        '2026-08-30 22:28:49.563'
    ),
    (
        'cmtj0u6bx009zgskwm293cz4v',
        'cmtit6r47000vgs45k1dt4hkk',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-09-01 18:49:23.085',
        '2026-09-01 18:49:58.067'
    ),
    (
        'cmtj2gy6f0069gsvi341gf9ar',
        'cmtit6r47000vgs45k1dt4hkk',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-09-01 19:35:05.224',
        '2026-09-01 19:37:44.933'
    ),
    (
        'cmtk38j7u0002gsmgpdyxeqj0',
        'cmtit6r47000vgs45k1dt4hkk',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-09-02 12:44:18.379',
        '2026-09-02 12:44:20.285'
    ),
    (
        'cmtordrx8007ogsud975ibhwq',
        'cmtordrvs007cgsudmhyhju2h',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-09-05 19:11:18.429',
        '2026-09-05 19:11:31.241'
    ),
    (
        'cmtouktjc0063gsasb61lze1p',
        'cmtordrvs007cgsudmhyhju2h',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-09-05 20:40:45.960',
        '2026-09-05 20:40:47.759'
    ),
    (
        'cmtoukvwd0065gsasuip8ts47',
        'cmtordrvs007cgsudmhyhju2h',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-09-05 20:40:49.021',
        '2026-09-05 20:40:50.867'
    ),
    (
        'cmtt78ds6000egsxd84aotw9n',
        'cmtt78dov0002gsxdzpxfm4yo',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-09-08 21:46:05.383',
        '2026-09-08 21:46:26.716'
    ),
    (
        'cmtt78v1z000ggsxd1mtq6ux8',
        'cmtt78dov0002gsxdzpxfm4yo',
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-09-08 21:46:27.767',
        '2026-09-08 21:47:41.934'
    );
/*!40000 ALTER TABLE `meetings_MeetingParticipant` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `pos_PosSale`
--

DROP TABLE IF EXISTS `pos_PosSale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `pos_PosSale` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `saleNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `warehouseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `customerName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `subtotal` double NOT NULL,
    `discountAmount` double NOT NULL DEFAULT '0',
    `taxAmount` double NOT NULL DEFAULT '0',
    `totalAmount` double NOT NULL,
    `paidAmount` double NOT NULL,
    `changeAmount` double NOT NULL DEFAULT '0',
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'completed',
    `cashierName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `soldAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `PosSale_saleNumber_key` (`saleNumber`),
    KEY `PosSale_soldAt_idx` (`soldAt`),
    KEY `PosSale_status_idx` (`status`),
    KEY `PosSale_warehouseId_fkey` (`warehouseId`),
    CONSTRAINT `PosSale_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `inventory_InventoryWarehouse` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `pos_PosSale`
--

LOCK TABLES `pos_PosSale` WRITE;
/*!40000 ALTER TABLE `pos_PosSale` DISABLE KEYS */
;
INSERT INTO
    `pos_PosSale`
VALUES (
        'cmths29v800c0gssl973bf6os',
        'POS-SEED-001',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'Avin Jalal',
        'card',
        4150,
        0,
        0,
        4150,
        4150,
        0,
        'completed',
        'Seed Cashier',
        NULL,
        '2026-08-02 09:00:00.000',
        '2026-08-31 21:55:58.196',
        '2026-08-31 21:55:58.196'
    ),
    (
        'cmths29vr00cagsslrqc3c6cn',
        'POS-SEED-002',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'Dilshad Rahman',
        'bank_transfer',
        4300,
        0,
        0,
        4300,
        4300,
        0,
        'completed',
        'Seed Cashier',
        NULL,
        '2026-08-03 10:00:00.000',
        '2026-08-31 21:55:58.216',
        '2026-08-31 21:55:58.216'
    ),
    (
        'cmths29wb00ckgssldv7588x3',
        'POS-SEED-003',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'Zana Farhad',
        'cash',
        4450,
        0,
        222.5,
        4672.5,
        4672.5,
        0,
        'completed',
        'Seed Cashier',
        NULL,
        '2026-08-04 11:00:00.000',
        '2026-08-31 21:55:58.236',
        '2026-08-31 21:55:58.236'
    ),
    (
        'cmths29wy00cugsslfci0dzao',
        'POS-SEED-004',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'Hana Ibrahim',
        'card',
        4600,
        0,
        0,
        4600,
        4600,
        0,
        'completed',
        'Seed Cashier',
        NULL,
        '2026-08-05 12:00:00.000',
        '2026-08-31 21:55:58.259',
        '2026-08-31 21:55:58.259'
    ),
    (
        'cmths29xp00d4gssl3u4ngfw4',
        'POS-SEED-005',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'Karwan Ismail',
        'bank_transfer',
        4750,
        0,
        0,
        4750,
        4750,
        0,
        'completed',
        'Seed Cashier',
        NULL,
        '2026-08-06 13:00:00.000',
        '2026-08-31 21:55:58.286',
        '2026-08-31 21:55:58.286'
    ),
    (
        'cmths29y700degssljpsq0ytj',
        'POS-SEED-006',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'Nawroz Kamal',
        'cash',
        4900,
        0,
        245,
        5145,
        5145,
        0,
        'completed',
        'Seed Cashier',
        NULL,
        '2026-08-07 14:00:00.000',
        '2026-08-31 21:55:58.304',
        '2026-08-31 21:55:58.304'
    ),
    (
        'cmths29yr00dogssl1ygo3h0h',
        'POS-SEED-007',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'Zhino Adnan',
        'card',
        5050,
        0,
        0,
        5050,
        5050,
        0,
        'completed',
        'Seed Cashier',
        NULL,
        '2026-08-08 15:00:00.000',
        '2026-08-31 21:55:58.324',
        '2026-08-31 21:55:58.324'
    ),
    (
        'cmths29zc00dygsslh1vscqo4',
        'POS-SEED-008',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'Sirwan Latif',
        'bank_transfer',
        5200,
        0,
        0,
        5200,
        5200,
        0,
        'completed',
        'Seed Cashier',
        NULL,
        '2026-08-09 08:00:00.000',
        '2026-08-31 21:55:58.345',
        '2026-08-31 21:55:58.345'
    ),
    (
        'cmths29zw00e8gssl9b0m6cti',
        'POS-SEED-009',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'Tara Yousif',
        'cash',
        5350,
        0,
        267.5,
        5617.5,
        5617.5,
        0,
        'completed',
        'Seed Cashier',
        NULL,
        '2026-08-10 09:00:00.000',
        '2026-08-31 21:55:58.365',
        '2026-08-31 21:55:58.365'
    ),
    (
        'cmths2a0o00eigsslb0wzd83b',
        'POS-SEED-010',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        'Baran Mohammed',
        'card',
        5500,
        0,
        0,
        5500,
        5500,
        0,
        'completed',
        'Seed Cashier',
        NULL,
        '2026-08-11 10:00:00.000',
        '2026-08-31 21:55:58.393',
        '2026-08-31 21:55:58.393'
    ),
    (
        'cmtitgv8g002cgs45sy1n5x26',
        'POS-1788276184864-685',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        NULL,
        'cash',
        9050,
        0,
        222.5,
        9272.5,
        9272.5,
        0,
        'completed',
        'NHO Super Administrator',
        NULL,
        '2026-09-01 15:23:04.865',
        '2026-09-01 15:23:04.865',
        '2026-09-01 15:23:04.865'
    ),
    (
        'cmtithcv3002lgs45i990muwf',
        'POS-1788276207711-579',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        NULL,
        'cash',
        8600,
        0,
        0,
        8600,
        8600,
        0,
        'completed',
        'NHO Super Administrator',
        NULL,
        '2026-09-01 15:23:27.711',
        '2026-09-01 15:23:27.711',
        '2026-09-01 15:23:27.711'
    ),
    (
        'cmtithq1m002rgs4540mwo3hv',
        'POS-1788276224793-444',
        'cmt8rjgyl00bkgsuz8adfd5pp',
        NULL,
        'cash',
        4600,
        0,
        0,
        4600,
        4600,
        0,
        'completed',
        'NHO Super Administrator',
        NULL,
        '2026-09-01 15:23:44.794',
        '2026-09-01 15:23:44.794',
        '2026-09-01 15:23:44.794'
    );
/*!40000 ALTER TABLE `pos_PosSale` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `pos_PosSaleItem`
--

DROP TABLE IF EXISTS `pos_PosSaleItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `pos_PosSaleItem` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `saleId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `quantity` double NOT NULL,
    `unitPrice` double NOT NULL,
    `taxRate` double NOT NULL DEFAULT '0',
    `lineTotal` double NOT NULL,
    PRIMARY KEY (`id`),
    KEY `PosSaleItem_saleId_idx` (`saleId`),
    KEY `PosSaleItem_productId_idx` (`productId`),
    CONSTRAINT `PosSaleItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `inventory_InventoryProduct` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `PosSaleItem_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `pos_PosSale` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `pos_PosSaleItem`
--

LOCK TABLES `pos_PosSaleItem` WRITE;
/*!40000 ALTER TABLE `pos_PosSaleItem` DISABLE KEYS */
;
INSERT INTO
    `pos_PosSaleItem`
VALUES (
        'cmths29v800c2gsslcvomn0i8',
        'cmths29v800c0gssl973bf6os',
        'cmt8rjh2n00cdgsuz5t8lh4uu',
        1,
        4150,
        0,
        4150
    ),
    (
        'cmths29vr00ccgssldnjnu8sp',
        'cmths29vr00cagsslrqc3c6cn',
        'cmt8rjh3d00cngsuz847jgzrb',
        1,
        4300,
        0,
        4300
    ),
    (
        'cmths29wb00cmgssl2t6awz59',
        'cmths29wb00ckgssldv7588x3',
        'cmt8rjh4400cxgsuzn99cs2o4',
        1,
        4450,
        5,
        4672.5
    ),
    (
        'cmths29wy00cwgsslnk4zp0v5',
        'cmths29wy00cugsslfci0dzao',
        'cmt8rjh4t00d7gsuzxzo0xokr',
        1,
        4600,
        0,
        4600
    ),
    (
        'cmths29xp00d6gssl87gtn11h',
        'cmths29xp00d4gssl3u4ngfw4',
        'cmt8rjh5d00dhgsuzv7dj909p',
        1,
        4750,
        0,
        4750
    ),
    (
        'cmths29y700dggsslpq2oic2v',
        'cmths29y700degssljpsq0ytj',
        'cmt8rjh6900drgsuzpval91o7',
        1,
        4900,
        5,
        5145
    ),
    (
        'cmths29yr00dqgsslwicug55j',
        'cmths29yr00dogssl1ygo3h0h',
        'cmt8rjh6w00e1gsuz4jb8fted',
        1,
        5050,
        0,
        5050
    ),
    (
        'cmths29zc00e0gssl854tv6cu',
        'cmths29zc00dygsslh1vscqo4',
        'cmt8rjh7j00ebgsuzw2snte8z',
        1,
        5200,
        0,
        5200
    ),
    (
        'cmths29zw00eagsslq0234v88',
        'cmths29zw00e8gssl9b0m6cti',
        'cmt8rjh8300elgsuzdxx97st1',
        1,
        5350,
        5,
        5617.5
    ),
    (
        'cmths2a0o00ekgsslmhpvz4ay',
        'cmths2a0o00eigsslb0wzd83b',
        'cmt8rjh8p00evgsuzzmqp0s05',
        1,
        5500,
        0,
        5500
    ),
    (
        'cmtitgv8g002egs456qw228by',
        'cmtitgv8g002cgs45sy1n5x26',
        'cmt8rjh4400cxgsuzn99cs2o4',
        1,
        4450,
        5,
        4672.5
    ),
    (
        'cmtitgv8g002fgs45qpamohnv',
        'cmtitgv8g002cgs45sy1n5x26',
        'cmt8rjh4t00d7gsuzxzo0xokr',
        1,
        4600,
        0,
        4600
    ),
    (
        'cmtithcv3002ngs45pee1nmj3',
        'cmtithcv3002lgs45i990muwf',
        'cmt8rjh3d00cngsuz847jgzrb',
        2,
        4300,
        0,
        8600
    ),
    (
        'cmtithq1m002tgs45xdmr5xbk',
        'cmtithq1m002rgs4540mwo3hv',
        'cmt8rjh4t00d7gsuzxzo0xokr',
        1,
        4600,
        0,
        4600
    );
/*!40000 ALTER TABLE `pos_PosSaleItem` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `system_AuditLog`
--

DROP TABLE IF EXISTS `system_AuditLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `system_AuditLog` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `userName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `method` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `path` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `module` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `statusCode` int NOT NULL,
    `ipAddress` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `userAgent` text COLLATE utf8mb4_unicode_ci,
    `durationMs` int NOT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `details` json DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `AuditLog_createdAt_idx` (`createdAt`),
    KEY `AuditLog_userId_createdAt_idx` (`userId`, `createdAt`),
    KEY `AuditLog_module_createdAt_idx` (`module`, `createdAt`),
    KEY `AuditLog_action_createdAt_idx` (`action`, `createdAt`),
    KEY `AuditLog_statusCode_createdAt_idx` (`statusCode`, `createdAt`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `system_AuditLog`
--

LOCK TABLES `system_AuditLog` WRITE;
/*!40000 ALTER TABLE `system_AuditLog` DISABLE KEYS */
;
INSERT INTO
    `system_AuditLog`
VALUES (
        'cmtj7o1b20002gsk2eshvp223',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/notifications',
        'notifications',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        8,
        '2026-09-01 22:00:33.951',
        NULL
    ),
    (
        'cmtj7p5w10000gso1dglvyzmw',
        NULL,
        NULL,
        'POST',
        '/api/auth/login',
        'auth',
        'create',
        200,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        235,
        '2026-09-01 22:01:26.545',
        NULL
    ),
    (
        'cmtj7p5yi0001gso1jmr48533',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/auth/me',
        'auth',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        8,
        '2026-09-01 22:01:26.635',
        NULL
    ),
    (
        'cmtj7p5yo0002gso1vvutaobv',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/notifications',
        'notifications',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        11,
        '2026-09-01 22:01:26.640',
        NULL
    ),
    (
        'cmtj7p5yw0003gso1xsrtzy5p',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/auth/me',
        'auth',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        11,
        '2026-09-01 22:01:26.648',
        NULL
    ),
    (
        'cmtj7p5yx0004gso1nl99qqz0',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/employees',
        'employees',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        10,
        '2026-09-01 22:01:26.649',
        NULL
    ),
    (
        'cmtj7p5z20005gso11kkc3a3o',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/employees/records/salaries',
        'employees',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-01 22:01:26.654',
        NULL
    ),
    (
        'cmtj7p5z20006gso1ptovyeb0',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/feedback/summary',
        'feedback',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-01 22:01:26.655',
        NULL
    ),
    (
        'cmtj7p5z30007gso1bqa2p304',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/notifications',
        'notifications',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        13,
        '2026-09-01 22:01:26.655',
        NULL
    ),
    (
        'cmtj7p5zf0008gso1fuw9lun4',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/employees',
        'employees',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        11,
        '2026-09-01 22:01:26.668',
        NULL
    ),
    (
        'cmtj7p5zg0009gso1ojuzzo4h',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/employees/records/salaries',
        'employees',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        9,
        '2026-09-01 22:01:26.668',
        NULL
    ),
    (
        'cmtj7p5zg000agso1pyctnyxk',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/feedback/summary',
        'feedback',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        8,
        '2026-09-01 22:01:26.669',
        NULL
    ),
    (
        'cmtj7pt3w000bgso1z9pphj0y',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/notifications',
        'notifications',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        6,
        '2026-09-01 22:01:56.637',
        NULL
    ),
    (
        'cmtj7qg99000cgso1q7cz23b0',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/notifications',
        'notifications',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        7,
        '2026-09-01 22:02:26.637',
        NULL
    ),
    (
        'cmtj7r1hu000dgso1f999yhp9',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/auth/me',
        'auth',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        7,
        '2026-09-01 22:02:54.162',
        NULL
    ),
    (
        'cmtj7r1hw000egso11snj300y',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/tasks',
        'tasks?search=&pageSize=100',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        11,
        '2026-09-01 22:02:54.165',
        NULL
    ),
    (
        'cmtj7r1hx000fgso1e73i7zcp',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/tasks/assignees',
        'tasks',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        10,
        '2026-09-01 22:02:54.165',
        NULL
    ),
    (
        'cmtj7r1i7000ggso16d33ixmc',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/tasks/assignees',
        'tasks',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        7,
        '2026-09-01 22:02:54.175',
        NULL
    ),
    (
        'cmtj7r1ib000hgso1cuvg1urx',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/tasks',
        'tasks?search=&pageSize=100',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        11,
        '2026-09-01 22:02:54.180',
        NULL
    ),
    (
        'cmtj7r3ek000igso1p7v6azxk',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/notifications',
        'notifications',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        7,
        '2026-09-01 22:02:56.636',
        NULL
    ),
    (
        'cmtj7r59e000jgso1exgpppr5',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/auth/me',
        'auth',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        6,
        '2026-09-01 22:02:59.042',
        NULL
    ),
    (
        'cmtj7rqjy000kgso1lz1i2fsl',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/notifications',
        'notifications',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        7,
        '2026-09-01 22:03:26.638',
        NULL
    ),
    (
        'cmtj7sdp9000lgso1pc9hzt4m',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/notifications',
        'notifications',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        7,
        '2026-09-01 22:03:56.638',
        NULL
    ),
    (
        'cmtj7t0ul000mgso1lanr50r7',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/notifications',
        'notifications',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        8,
        '2026-09-01 22:04:26.637',
        NULL
    ),
    (
        'cmtj7tnzw000ngso1myd3232p',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'GET',
        '/api/notifications',
        'notifications',
        'read',
        304,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        6,
        '2026-09-01 22:04:56.637',
        NULL
    ),
    (
        'cmtj7wdsf0000gsg4y99eo1wl',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/tasks/cmths28qe001vgssluzz1bv7m',
        'tasks',
        'update',
        200,
        '::ffff:127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        22,
        '2026-09-01 22:07:03.375',
        NULL
    ),
    (
        'cmtk2p5og0000gs4wgz8sz5il',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        256,
        '2026-09-02 12:29:14.369',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtk385ps0000gsmgy8up7975',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        237,
        '2026-09-02 12:44:00.880',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtk8k2r00000gs8xzdilfe0u',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
        253,
        '2026-09-02 15:13:14.988',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtk8o9t30001gs8xaesx438u',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
        223,
        '2026-09-02 15:16:30.760',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtk8wxco0002gs8x2bk7p5kn',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/crm/leads/seed-crm-lead-010',
        'crm',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36',
        15,
        '2026-09-02 15:23:14.520',
        '{\"status\": \"contacted\", \"recordId\": \"seed-crm-lead-010\"}'
    ),
    (
        'cmtki09z40000gsyjkhkvur1k',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        235,
        '2026-09-02 19:37:47.392',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtki3gn80000gs779fv3tlz3',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/crm/leads/seed-crm-lead-010',
        'crm',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        17,
        '2026-09-02 19:40:16.004',
        '{\"status\": \"new\", \"recordId\": \"seed-crm-lead-010\"}'
    ),
    (
        'cmtki3i6r0001gs77p4g1mjrh',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/crm/leads/seed-crm-lead-010',
        'crm',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        14,
        '2026-09-02 19:40:18.004',
        '{\"recordId\": \"seed-crm-lead-010\"}'
    ),
    (
        'cmtki3jwr0002gs77ogg3aqsl',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/crm/leads/seed-crm-lead-009',
        'crm',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        14,
        '2026-09-02 19:40:20.236',
        '{\"recordId\": \"seed-crm-lead-009\"}'
    ),
    (
        'cmtkiutj20000gs2dcm8vyrfe',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/crm/leads/seed-crm-lead-010',
        'crm',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        16,
        '2026-09-02 20:01:32.414',
        '{\"status\": \"contacted\", \"recordId\": \"seed-crm-lead-010\"}'
    ),
    (
        'cmtkj7mlf0000gsdaz9ubuv68',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/crm/patients/cmths8g21000igstl3gwqvvvz',
        'crm',
        'update',
        500,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        12,
        '2026-09-02 20:11:29.955',
        '{\"email\": \"patient010@example.com\", \"phone\": \"07505000010\", \"gender\": \"female\", \"status\": \"active\", \"address\": \"Sulaymaniyah\", \"heightCm\": 50, \"lastName\": \"Yousif\", \"recordId\": \"cmths8g21000igstl3gwqvvvz\", \"weightKg\": 3, \"allergies\": \"Penicillin\", \"bloodType\": \"A-\", \"firstName\": \"Tara\", \"isMarried\": false, \"hasDiabetes\": false, \"medicalNotes\": \"SEED: Patient medical profile 10\", \"childrenCount\": 0, \"hasHypertension\": false}'
    ),
    (
        'cmtkj7rko0000gsptekgs4041',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/crm/patients/cmths8g21000igstl3gwqvvvz',
        'crm',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        24,
        '2026-09-02 20:11:36.408',
        '{\"email\": \"patient010@example.com\", \"phone\": \"07505000010\", \"gender\": \"female\", \"status\": \"active\", \"address\": \"Sulaymaniyah\", \"heightCm\": 50, \"lastName\": \"Yousif\", \"recordId\": \"cmths8g21000igstl3gwqvvvz\", \"weightKg\": 3, \"allergies\": \"Penicillin\", \"bloodType\": \"A-\", \"firstName\": \"Tara\", \"isMarried\": false, \"hasDiabetes\": false, \"medicalNotes\": \"SEED: Patient medical profile 10\", \"childrenCount\": 0, \"hasHypertension\": false}'
    ),
    (
        'cmtkk3fmj0000gsdqin7ot95c',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/crm/leads/seed-crm-lead-010',
        'crm',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        17,
        '2026-09-02 20:36:13.915',
        '{\"status\": \"contacted\", \"recordId\": \"seed-crm-lead-010\"}'
    ),
    (
        'cmtn6cxe70000gs20r39akg1t',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        256,
        '2026-09-04 16:35:00.751',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtn6d4wc0004gs20xae6qoba',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/meetings',
        'meetings',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        21,
        '2026-09-04 16:35:10.476',
        '{\"title\": \"TIT\", \"departmentId\": \"cmt8rjgo0006sgsuzrnlxtlgb\"}'
    ),
    (
        'cmtn6dvri0007gs20n0gnol1f',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        222,
        '2026-09-04 16:35:45.295',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtn6l4lm0003gsl0a0yw8pb1',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/meetings',
        'meetings',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        18,
        '2026-09-04 16:41:23.339',
        '{\"title\": \"ADS\", \"departmentId\": \"cmt8rjgo0006sgsuzrnlxtlgb\"}'
    ),
    (
        'cmtn6nfhx0008gsl0nm7nw1yk',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/employees/cmths296q004qgsslesug1lk2',
        'employees',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        24,
        '2026-09-04 16:43:10.773',
        '{\"status\": \"active\", \"userId\": null, \"hireDate\": \"2022-05-05T00:00:00.000Z\", \"lastName\": \"Nadir\", \"firstName\": \"Darya\", \"positionId\": \"cmths2964004mgssl9u0agpue\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmths2969004ngsslu4y07x6m\", \"employeeCode\": \"SEED-EMP-004\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtn6nszq0009gsl0y4eq14jn',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp',
        'attendance',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        15,
        '2026-09-04 16:43:28.262',
        '{\"name\": \"Main Attendance\", \"port\": 80, \"recordId\": \"cmt8rqkjx0000gsu4r6quy0fp\", \"username\": \"admin\", \"ipAddress\": \"192.168.1.108\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"workingDaysPerMonth\": 22}'
    ),
    (
        'cmtn6o36l000agsl0lqc2gzu9',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        502,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        11527,
        '2026-09-04 16:43:41.469',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtn6orvi000bgsl0954wrn3n',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        502,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        7240,
        '2026-09-04 16:44:13.470',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtn6p5u9000egsl0d86yhf4t',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/crm/leads/seed-crm-lead-006',
        'crm',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        18,
        '2026-09-04 16:44:31.570',
        '{\"status\": \"new\", \"recordId\": \"seed-crm-lead-006\"}'
    ),
    (
        'cmtn6p75c000hgsl0ky7enzfp',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/crm/leads/seed-crm-lead-006',
        'crm',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        18,
        '2026-09-04 16:44:33.265',
        '{\"status\": \"qualified\", \"recordId\": \"seed-crm-lead-006\"}'
    ),
    (
        'cmtn6zef7000igsl01itcjdwt',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        230,
        '2026-09-04 16:52:29.251',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtn70ulz000jgsl0tkpvl2p8',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        225,
        '2026-09-04 16:53:36.887',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtn84fvl0000gsygrwa7b9y6',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        236,
        '2026-09-04 17:24:24.034',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtn934zm0001gsygpxon1dcg',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        224,
        '2026-09-04 17:51:22.883',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtna1w9t0002gshpn6lg8w3z',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/crm/leads/seed-crm-lead-009',
        'crm',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        19,
        '2026-09-04 18:18:24.546',
        '{\"status\": \"new\", \"recordId\": \"seed-crm-lead-009\"}'
    ),
    (
        'cmtna5kwp0000gsutovjb1ubd',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        231,
        '2026-09-04 18:21:16.442',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtnad1v60000gs55mi39qetw',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        232,
        '2026-09-04 18:27:05.011',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtnde9lh0000gsizkdz1s7h7',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp',
        'attendance',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        14,
        '2026-09-04 19:52:00.533',
        '{\"name\": \"Main Attendance\", \"port\": 80, \"recordId\": \"cmt8rqkjx0000gsu4r6quy0fp\", \"username\": \"admin\", \"ipAddress\": \"192.168.1.96\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"workingDaysPerMonth\": 22}'
    ),
    (
        'cmtndeaz40001gsizq7warb8j',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        162,
        '2026-09-04 19:52:02.321',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtndeq9v003qgsizjosit4ri',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        2853,
        '2026-09-04 19:52:22.148',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtndfwh3004vgsizgjv192a2',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        560,
        '2026-09-04 19:53:16.840',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtnetskg0074gsiz8rnijmdt',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        230,
        '2026-09-04 20:32:04.576',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtnf0nyg00cqgsiz8yvtc27p',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees/positions',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        14,
        '2026-09-04 20:37:25.192',
        '{\"name\": \"Full Stack Developer\", \"status\": \"active\", \"description\": \"IT Supporter and system Manager\"}'
    ),
    (
        'cmtnf10ez00crgsizj3k15upx',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/employees/cmt8rjfwt001mgsuza9e8zkde',
        'employees',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        17,
        '2026-09-04 20:37:41.339',
        '{\"status\": \"active\", \"userId\": null, \"hireDate\": \"2024-02-01T00:00:00.000Z\", \"lastName\": \"Najm\", \"firstName\": \"Qasem\", \"positionId\": \"cmtnf0ny800cpgsizxvpws2pr\", \"checkInTime\": \"17:00\", \"checkOutTime\": \"22:00\", \"departmentId\": \"cmt8rjfvq001ggsuzrupsrxku\", \"employeeCode\": \"EMP-1002\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtomv4qi0000gs1byw0c89ze',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        255,
        '2026-09-05 17:04:50.106',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtomv7tq0001gs1b8mknbzih',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        178,
        '2026-09-05 17:04:54.110',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtomvg410034gs1b30nkvl92',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        1397,
        '2026-09-05 17:05:04.849',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtomxuod004bgs1bu01qf3ql',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees/records/attendance-permissions',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        15,
        '2026-09-05 17:06:57.037',
        '{\"reason\": null, \"status\": \"approved\", \"toDate\": \"2026-09-04T00:00:00.000Z\", \"fromDate\": \"2026-09-04T00:00:00.000Z\", \"recordId\": \"attendance-permissions\", \"employeeId\": \"cmt8rjfwt001mgsuza9e8zkde\", \"permissionType\": \"full_day\", \"permittedMinutes\": null}'
    ),
    (
        'cmton6n210061gs1b2n18xd15',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/users',
        'users',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        237,
        '2026-09-05 17:13:47.066',
        '{\"name\": \"Sonya Nadir\", \"email\": \"Sonya.nadir@nho.com\", \"status\": \"active\", \"roleIds\": [\"cmt8rjfv0001cgsuzhs7cbkmx\"], \"username\": \"sonya.nadir\", \"department\": \"Clinical Laboratory\"}'
    ),
    (
        'cmton7c3f0062gs1bm7vlfdtr',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/users',
        'users',
        'create',
        422,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        6,
        '2026-09-05 17:14:19.515',
        '{\"name\": \"Soma Nadir\", \"email\": \"Soma.nadir@nho.com\", \"status\": \"active\", \"roleIds\": [\"cmt8rjfv0001cgsuzhs7cbkmx\"], \"username\": \"soma,nadir\", \"department\": \"Cardiology\"}'
    ),
    (
        'cmton7frh0064gs1brs1puka9',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/users',
        'users',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        234,
        '2026-09-05 17:14:24.270',
        '{\"name\": \"Soma Nadir\", \"email\": \"Soma.nadir@nho.com\", \"status\": \"active\", \"roleIds\": [\"cmt8rjfv0001cgsuzhs7cbkmx\"], \"username\": \"soma,nadir\", \"department\": \"Cardiology\"}'
    ),
    (
        'cmton8vnt0066gs1bfhzxalig',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/users',
        'users',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        235,
        '2026-09-05 17:15:31.529',
        '{\"name\": \"Lana\", \"email\": \"lana.nho@nho.com\", \"status\": \"active\", \"roleIds\": [\"cmt8rjfv0001cgsuzhs7cbkmx\"], \"username\": \"Lana.nho\", \"department\": \"Dermatology\"}'
    ),
    (
        'cmton9rbf0068gs1bga7u8eow',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/users',
        'users',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        236,
        '2026-09-05 17:16:12.556',
        '{\"name\": \"Bery\", \"email\": \"bary.nho@nho.com\", \"status\": \"active\", \"roleIds\": [\"cmt8rjfv0001cgsuzhs7cbkmx\"], \"username\": \"bary.nho\", \"department\": \"Cardiology\"}'
    ),
    (
        'cmtona9jm0069gs1bqnaruhcn',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/users/cmton8vnj0065gs1b2n9rlxwa',
        'users',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        20,
        '2026-09-05 17:16:36.178',
        '{\"name\": \"Lana Omer\", \"email\": \"lana.omer@nho.com\", \"status\": \"active\", \"roleIds\": [\"cmt8rjfv0001cgsuzhs7cbkmx\"], \"username\": \"Lana.omer\", \"department\": \"Dermatology\"}'
    ),
    (
        'cmtonb1ln006bgs1bwzn25ylm',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/users',
        'users',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        235,
        '2026-09-05 17:17:12.539',
        '{\"name\": \"Ashna Arshad\", \"email\": \"ashna.arshad@nho.com\", \"status\": \"active\", \"roleIds\": [\"cmt8rjfv0001cgsuzhs7cbkmx\"], \"username\": \"ashna.arshad\", \"department\": \"Cardiology\"}'
    ),
    (
        'cmtone42p006cgs1b9vx74pyq',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/healthcare/departments/cmt8rjfvj001fgsuz5r0t0a49',
        'healthcare',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        24,
        '2026-09-05 17:19:35.714',
        '{\"code\": \"CARD\", \"name\": \"Marketing\", \"status\": \"active\", \"recordId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"managerId\": \"cmt8rjfwl001kgsuzbwmza8rr\", \"description\": \"Cardiology and cardiovascular services\"}'
    ),
    (
        'cmtoneedu006dgs1braosj76d',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmt8rjgo0006sgsuzrnlxtlgb',
        'healthcare',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        17,
        '2026-09-05 17:19:49.074',
        '{\"recordId\": \"cmt8rjgo0006sgsuzrnlxtlgb\"}'
    ),
    (
        'cmtonefzt006egs1bxbxuvo0b',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmths29900057gssla6ph0oxg',
        'healthcare',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        16,
        '2026-09-05 17:19:51.161',
        '{\"recordId\": \"cmths29900057gssla6ph0oxg\"}'
    ),
    (
        'cmtonehd4006fgs1bu70hl9yv',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmths291j003tgssl4jgumxks',
        'healthcare',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        15,
        '2026-09-05 17:19:52.936',
        '{\"recordId\": \"cmths291j003tgssl4jgumxks\"}'
    ),
    (
        'cmtonemzs006ggs1bz60klmmk',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmths29380043gsslv3uvp8c3',
        'healthcare',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        15,
        '2026-09-05 17:20:00.232',
        '{\"recordId\": \"cmths29380043gsslv3uvp8c3\"}'
    ),
    (
        'cmtoneq8f006hgs1bdbdkul87',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmths29d70061gsslxa2i33y3',
        'healthcare',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        15,
        '2026-09-05 17:20:04.431',
        '{\"recordId\": \"cmths29d70061gsslxa2i33y3\"}'
    ),
    (
        'cmtones73006igs1bjwf702ru',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmths29aj005hgsslla61dg19',
        'healthcare',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-05 17:20:06.976',
        '{\"recordId\": \"cmths29aj005hgsslla61dg19\"}'
    ),
    (
        'cmtonetfs006jgs1bdw7y5wc9',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmths29bw005rgssl81lwph0i',
        'healthcare',
        'delete',
        409,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        16,
        '2026-09-05 17:20:08.584',
        '{\"recordId\": \"cmths29bw005rgssl81lwph0i\"}'
    ),
    (
        'cmtonev5y006kgs1bgcvum9we',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmths29bw005rgssl81lwph0i',
        'healthcare',
        'delete',
        409,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        12,
        '2026-09-05 17:20:10.822',
        '{\"recordId\": \"cmths29bw005rgssl81lwph0i\"}'
    ),
    (
        'cmtoneycm006lgs1b3wx62x3s',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmths29bw005rgssl81lwph0i',
        'healthcare',
        'delete',
        409,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        13,
        '2026-09-05 17:20:14.951',
        '{\"recordId\": \"cmths29bw005rgssl81lwph0i\"}'
    ),
    (
        'cmtonezlg006mgs1bmtrwap8m',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmths294q004dgsslzvkp4tcg',
        'healthcare',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        11,
        '2026-09-05 17:20:16.565',
        '{\"recordId\": \"cmths294q004dgsslzvkp4tcg\"}'
    ),
    (
        'cmtonf119006ngs1bmwqrjwku',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmths2969004ngsslu4y07x6m',
        'healthcare',
        'delete',
        409,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        12,
        '2026-09-05 17:20:18.430',
        '{\"recordId\": \"cmths2969004ngsslu4y07x6m\"}'
    ),
    (
        'cmtonf3bh006ogs1btcqfkczt',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmths2969004ngsslu4y07x6m',
        'healthcare',
        'delete',
        409,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        12,
        '2026-09-05 17:20:21.390',
        '{\"recordId\": \"cmths2969004ngsslu4y07x6m\"}'
    ),
    (
        'cmtonhrv80000gsc2nzwz34mz',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmths2969004ngsslu4y07x6m',
        'healthcare',
        'delete',
        409,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        8,
        '2026-09-05 17:22:26.517',
        '{\"recordId\": \"cmths2969004ngsslu4y07x6m\"}'
    ),
    (
        'cmtoni1rm0000gswslgiejlit',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmths2969004ngsslu4y07x6m',
        'healthcare',
        'delete',
        409,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        13,
        '2026-09-05 17:22:39.346',
        '{\"recordId\": \"cmths2969004ngsslu4y07x6m\"}'
    ),
    (
        'cmtonkwx00000gs5kk0gxjg69',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmths2969004ngsslu4y07x6m',
        'healthcare',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        13,
        '2026-09-05 17:24:53.028',
        '{\"recordId\": \"cmths2969004ngsslu4y07x6m\"}'
    ),
    (
        'cmtonkyws0001gs5kz9h12htg',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmths29bw005rgssl81lwph0i',
        'healthcare',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-05 17:24:55.613',
        '{\"recordId\": \"cmths29bw005rgssl81lwph0i\"}'
    ),
    (
        'cmtonl1cb0002gs5kw5j9rulo',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/departments/cmths297m004xgsslmhkye1l5',
        'healthcare',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        13,
        '2026-09-05 17:24:58.764',
        '{\"recordId\": \"cmths297m004xgsslmhkye1l5\"}'
    ),
    (
        'cmtonr1us0000gsymj6chh7jr',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        229,
        '2026-09-05 17:29:39.364',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtonrnh80001gsymkt93ra5x',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        128,
        '2026-09-05 17:30:07.388',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtoo9fsx0002gsymwwzpr5ta',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        74,
        '2026-09-05 17:43:57.249',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtoo9pbw0017gsymdnacpj7k',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/attendance/people/cmtndechj000lgsizaywncm88',
        'attendance',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        596,
        '2026-09-05 17:44:09.597',
        '{\"recordId\": \"cmtndechj000lgsizaywncm88\"}'
    ),
    (
        'cmtoo9u3f001qgsymkwnxdmjd',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/attendance/people/cmtndechb000jgsizrf7u3ob5',
        'attendance',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        539,
        '2026-09-05 17:44:15.771',
        '{\"recordId\": \"cmtndechb000jgsizrf7u3ob5\"}'
    ),
    (
        'cmtoob3o10027gsymdgjfhq3i',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees',
        'employees',
        'create',
        422,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        8,
        '2026-09-05 17:45:14.834',
        '{\"status\": \"active\", \"userId\": \"cmtonb1le006ags1bgt7r1h50\", \"hireDate\": \"2026-09-05T00:00:00.000Z\", \"lastName\": \"Arshad\", \"firstName\": \"Ashna\", \"positionId\": \"cmths298v0056gssljhx9jopg\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-2002\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtoobb1z0028gsym9nnpxq20',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees',
        'employees',
        'create',
        422,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        7,
        '2026-09-05 17:45:24.407',
        '{\"status\": \"active\", \"userId\": \"cmtonb1le006ags1bgt7r1h50\", \"hireDate\": \"2026-09-05T00:00:00.000Z\", \"lastName\": \"Arshad\", \"firstName\": \"Ashna\", \"positionId\": \"cmths298v0056gssljhx9jopg\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-20202\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtoobecm0029gsym9res851e',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees',
        'employees',
        'create',
        422,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        6,
        '2026-09-05 17:45:28.678',
        '{\"status\": \"active\", \"userId\": \"cmtonb1le006ags1bgt7r1h50\", \"hireDate\": \"2026-09-05T00:00:00.000Z\", \"lastName\": \"Arshad\", \"firstName\": \"Ashna\", \"positionId\": \"cmths298v0056gssljhx9jopg\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-20202\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtoobej2002agsym7nt3n0yv',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees',
        'employees',
        'create',
        422,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        7,
        '2026-09-05 17:45:28.910',
        '{\"status\": \"active\", \"userId\": \"cmtonb1le006ags1bgt7r1h50\", \"hireDate\": \"2026-09-05T00:00:00.000Z\", \"lastName\": \"Arshad\", \"firstName\": \"Ashna\", \"positionId\": \"cmths298v0056gssljhx9jopg\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-20202\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtoobgxr002bgsym5vcecv9p',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees',
        'employees',
        'create',
        422,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        7,
        '2026-09-05 17:45:32.031',
        '{\"status\": \"active\", \"userId\": \"cmtonb1le006ags1bgt7r1h50\", \"hireDate\": \"2026-09-05\", \"lastName\": \"Arshad\", \"firstName\": \"Ashna\", \"positionId\": \"cmths298v0056gssljhx9jopg\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-20202\", \"isTeamLeader\": null, \"teamLeaderId\": null}'
    ),
    (
        'cmtoobjhh002cgsymgptv4j8y',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees',
        'employees',
        'create',
        422,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        5,
        '2026-09-05 17:45:35.334',
        '{\"status\": \"active\", \"userId\": \"cmtonb1le006ags1bgt7r1h50\", \"hireDate\": \"2026-09-05\", \"lastName\": \"Arshad\", \"firstName\": \"Ashna\", \"positionId\": \"cmt8rjfvc001egsuzgsulvca0\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-20202\", \"isTeamLeader\": null, \"teamLeaderId\": null}'
    ),
    (
        'cmtoodqeg0000gszff17mupjl',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees',
        'employees',
        'create',
        422,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        9,
        '2026-09-05 17:47:17.608',
        '{\"status\": \"active\", \"userId\": \"cmtonb1le006ags1bgt7r1h50\", \"hireDate\": \"2026-09-05\", \"lastName\": \"Arshad\", \"firstName\": \"Ashna\", \"positionId\": \"cmt8rjfvc001egsuzgsulvca0\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-20202\", \"isTeamLeader\": null, \"teamLeaderId\": null}'
    ),
    (
        'cmtoodx450002gszf0jw5ff7c',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        18,
        '2026-09-05 17:47:26.310',
        '{\"status\": \"active\", \"userId\": \"cmtonb1le006ags1bgt7r1h50\", \"hireDate\": \"2026-09-05T00:00:00.000Z\", \"lastName\": \"Arshad\", \"firstName\": \"Ashna\", \"positionId\": \"cmt8rjfvc001egsuzgsulvca0\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-20202\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtooe41b0003gszfp1r4cb2u',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/employees/cmths29cb005ugsslwfprjw4y',
        'employees',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        19,
        '2026-09-05 17:47:35.280',
        '{\"status\": \"active\", \"userId\": null, \"hireDate\": \"2022-09-09T00:00:00.000Z\", \"lastName\": \"Sadiq\", \"firstName\": \"Nahri\", \"positionId\": \"cmths29br005qgsslzqt9xyi6\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": null, \"employeeCode\": \"EMP-008\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtooe7840004gszf7rlrx5uj',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/employees/cmths296q004qgsslesug1lk2',
        'employees',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        17,
        '2026-09-05 17:47:39.413',
        '{\"status\": \"active\", \"userId\": null, \"hireDate\": \"2022-05-05T00:00:00.000Z\", \"lastName\": \"Nadir\", \"firstName\": \"Darya\", \"positionId\": \"cmths2964004mgssl9u0agpue\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": null, \"employeeCode\": \"EMP-004\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtooeewb0005gszf5s4egrcd',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/employees/cmths29cb005ugsslwfprjw4y',
        'employees',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        17,
        '2026-09-05 17:47:49.356',
        '{\"status\": \"active\", \"userId\": null, \"hireDate\": \"2022-09-09T00:00:00.000Z\", \"lastName\": \"Sadiq\", \"firstName\": \"Nahri\", \"positionId\": \"cmths29br005qgsslzqt9xyi6\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-008\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtooej5s0006gszf3046pi9b',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/employees/cmths296q004qgsslesug1lk2',
        'employees',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-05 17:47:54.881',
        '{\"status\": \"active\", \"userId\": null, \"hireDate\": \"2022-05-05T00:00:00.000Z\", \"lastName\": \"Nadir\", \"firstName\": \"Darya\", \"positionId\": \"cmths2964004mgssl9u0agpue\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-004\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtooemub0007gszf2ougf9pn',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/employees/cmtejrmbi0026gsq6kwta0vvc',
        'employees',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        16,
        '2026-09-05 17:47:59.652',
        '{\"status\": \"active\", \"userId\": \"cmtejqldw0025gsq6kslih6ov\", \"hireDate\": \"2026-08-29T00:00:00.000Z\", \"lastName\": \"Azad\", \"firstName\": \"Muhammad\", \"positionId\": \"cmtejioyp001cgsq6y7zlx2n6\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-1003\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtoofiqz0008gszfmmb07611',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees',
        'employees',
        'create',
        422,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        7,
        '2026-09-05 17:48:41.003',
        '{\"status\": null, \"userId\": \"cmton9rb50067gs1bfkp5oh89\", \"hireDate\": \"2026-09-05\", \"lastName\": \"NHO\", \"firstName\": \"Bery\", \"positionId\": \"cmths298v0056gssljhx9jopg\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-009\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtooflbw000agszfmxjo19j4',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        16,
        '2026-09-05 17:48:44.348',
        '{\"status\": \"active\", \"userId\": \"cmton9rb50067gs1bfkp5oh89\", \"hireDate\": \"2026-09-05T00:00:00.000Z\", \"lastName\": \"NHO\", \"firstName\": \"Bery\", \"positionId\": \"cmths298v0056gssljhx9jopg\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-009\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtoogc72000cgszfa7xdr7ec',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        17,
        '2026-09-05 17:49:19.167',
        '{\"status\": \"active\", \"userId\": \"cmton8vnj0065gs1b2n9rlxwa\", \"hireDate\": \"2026-09-05T00:00:00.000Z\", \"lastName\": \"Omer\", \"firstName\": \"Lana\", \"positionId\": \"cmths298v0056gssljhx9jopg\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-0019\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtooh1pj000egszfk4hx9g4s',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        19,
        '2026-09-05 17:49:52.232',
        '{\"status\": \"active\", \"userId\": \"cmton7fr90063gs1bdwokmrc2\", \"hireDate\": \"2026-09-05T00:00:00.000Z\", \"lastName\": \"Nadir\", \"firstName\": \"Soma\", \"positionId\": \"cmths298v0056gssljhx9jopg\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-0010\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtoohljb000ggszfm9pgpj1e',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        18,
        '2026-09-05 17:50:17.927',
        '{\"status\": \"active\", \"userId\": \"cmton6n1p0060gs1bsrbmjaj9\", \"hireDate\": \"2026-09-05T00:00:00.000Z\", \"lastName\": \"Nadir\", \"firstName\": \"Sony\", \"positionId\": \"cmths298v0056gssljhx9jopg\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-011\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtooibeq001dgszff0ae8u7d',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/attendance/people/cmtiu454k004ggs45u0y6ew5i',
        'attendance',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        125,
        '2026-09-05 17:50:51.459',
        '{\"name\": \"Ashna Arshad\", \"cardNo\": null, \"recordId\": \"cmtiu454k004ggs45u0y6ew5i\", \"employeeId\": \"cmtoodx3u0001gszfupsyin5h\"}'
    ),
    (
        'cmtooihz7001ugszfberfnx5y',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/attendance/people/cmtiu5lbn005cgs458jjx3tyy',
        'attendance',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        198,
        '2026-09-05 17:50:59.972',
        '{\"name\": \"Sonya Nadir\", \"cardNo\": null, \"recordId\": \"cmtiu5lbn005cgs458jjx3tyy\", \"employeeId\": \"cmtoohliz000fgszf38tu3wm3\"}'
    ),
    (
        'cmtooiodx002bgszffywcg51y',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/attendance/people/cmtiu8hml007mgs45lcn216us',
        'attendance',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        121,
        '2026-09-05 17:51:08.278',
        '{\"name\": \"lana omer gharib\", \"cardNo\": null, \"recordId\": \"cmtiu8hml007mgs45lcn216us\", \"employeeId\": \"cmtoogc6q000bgszfmrzdipra\"}'
    ),
    (
        'cmtooiu31002sgszf7dx24dsc',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/attendance/people/cmtiu6r54006egs458pmri3fd',
        'attendance',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        384,
        '2026-09-05 17:51:15.662',
        '{\"name\": \"soma nadir saeed\", \"cardNo\": null, \"recordId\": \"cmtiu6r54006egs458pmri3fd\", \"employeeId\": \"cmtooflbl0009gszfetww3j5s\"}'
    ),
    (
        'cmtooj48r0039gszfkcaqtm8u',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/attendance/people/cmtiu6r54006egs458pmri3fd',
        'attendance',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        174,
        '2026-09-05 17:51:28.828',
        '{\"name\": \"soma nadir saeed\", \"cardNo\": null, \"recordId\": \"cmtiu6r54006egs458pmri3fd\", \"employeeId\": \"cmtooh1p7000dgszf2agpvblv\"}'
    ),
    (
        'cmtook4bu004mgszft7tnd9v7',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/attendance/people/cmtiu8hml007mgs45lcn216us',
        'attendance',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        250,
        '2026-09-05 17:52:15.594',
        '{\"name\": \"Lana omer gharib\", \"cardNo\": null, \"recordId\": \"cmtiu8hml007mgs45lcn216us\", \"employeeId\": \"cmtoogc6q000bgszfmrzdipra\"}'
    ),
    (
        'cmtook8jz0053gszf0rjezeun',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/attendance/people/cmtiu6r54006egs458pmri3fd',
        'attendance',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        177,
        '2026-09-05 17:52:21.072',
        '{\"name\": \"Soma nadir saeed\", \"cardNo\": null, \"recordId\": \"cmtiu6r54006egs458pmri3fd\", \"employeeId\": \"cmtooh1p7000dgszf2agpvblv\"}'
    ),
    (
        'cmtopbws20000gsud27tktof6',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        259,
        '2026-09-05 18:13:52.179',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtopupz90001gsudbh58qxyg',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        226,
        '2026-09-05 18:28:29.829',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtoqzqeq0002gsud1mkhyv3i',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        112,
        '2026-09-05 19:00:23.283',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtor940k005fgsud8jsjkkwy',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/employees/cmtoohliz000fgszf38tu3wm3',
        'employees',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        19,
        '2026-09-05 19:07:40.821',
        '{\"status\": \"active\", \"userId\": \"cmton6n1p0060gs1bsrbmjaj9\", \"hireDate\": \"2026-09-05T00:00:00.000Z\", \"lastName\": \"Nadir\", \"firstName\": \"Sonya\", \"positionId\": \"cmths298v0056gssljhx9jopg\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\", \"employeeCode\": \"EMP-011\", \"isTeamLeader\": false, \"teamLeaderId\": null}'
    ),
    (
        'cmtorbqod007agsudvlh59w00',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        812,
        '2026-09-05 19:09:43.502',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtordrw6007mgsuderr6tfh2',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/meetings',
        'meetings',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        21,
        '2026-09-05 19:11:18.390',
        '{\"title\": \"tyt\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\"}'
    ),
    (
        'cmtosarg3009hgsudc7oal7te',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/employees/records/attendance-permissions/cmtomxuo3004ags1bpo24sqrn',
        'employees',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        13,
        '2026-09-05 19:36:57.460',
        '{\"recordId\": \"cmtomxuo3004ags1bpo24sqrn\"}'
    ),
    (
        'cmtosb3u6009kgsud8viblds6',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees/records/attendance-permissions',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        16,
        '2026-09-05 19:37:13.519',
        '{\"reason\": null, \"status\": \"approved\", \"toDate\": \"2026-09-05T00:00:00.000Z\", \"fromDate\": \"2026-09-05T00:00:00.000Z\", \"recordId\": \"attendance-permissions\", \"employeeId\": \"cmt8rjfwt001mgsuza9e8zkde\", \"permissionType\": \"full_day\", \"permittedMinutes\": null}'
    ),
    (
        'cmtosb851009lgsudsrpw00tl',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/employees/records/attendance-permissions/cmtosb3tw009jgsud47l5hrlp',
        'employees',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        15,
        '2026-09-05 19:37:19.094',
        '{\"recordId\": \"cmtosb3tw009jgsud47l5hrlp\"}'
    ),
    (
        'cmtosbd9z009ogsudv18dbudl',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees/records/attendance-permissions',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        16,
        '2026-09-05 19:37:25.752',
        '{\"reason\": null, \"status\": \"approved\", \"toDate\": \"2026-09-05T00:00:00.000Z\", \"fromDate\": \"2026-09-05T00:00:00.000Z\", \"recordId\": \"attendance-permissions\", \"employeeId\": \"cmt8rjfwt001mgsuza9e8zkde\", \"permissionType\": \"full_day\", \"permittedMinutes\": null}'
    ),
    (
        'cmtosd0el009rgsude9od7pk7',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees/records/attendance-permissions',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        15,
        '2026-09-05 19:38:42.382',
        '{\"reason\": null, \"status\": \"approved\", \"toDate\": \"2026-09-04T00:00:00.000Z\", \"fromDate\": \"2026-09-04T00:00:00.000Z\", \"recordId\": \"attendance-permissions\", \"employeeId\": \"cmt8rjfwt001mgsuza9e8zkde\", \"permissionType\": \"hours\", \"permittedMinutes\": 180}'
    ),
    (
        'cmtosd943009sgsudwn81rlhc',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/employees/records/attendance-permissions/cmtosd0ec009qgsudsfg3f2bw',
        'employees',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        12,
        '2026-09-05 19:38:53.667',
        '{\"recordId\": \"cmtosd0ec009qgsudsfg3f2bw\"}'
    ),
    (
        'cmtosgtpe0000gstiixttyagm',
        NULL,
        NULL,
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        401,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        4,
        '2026-09-05 19:41:40.323',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtosgxth0001gstixn8il42b',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        231,
        '2026-09-05 19:41:45.653',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtosil6f001ugstiudwa0xu6',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/crm/referrals/seed-crm-referral-009',
        'crm',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        18,
        '2026-09-05 19:43:02.583',
        '{\"notes\": \"Patient referral 9\", \"status\": \"active\", \"recordId\": \"seed-crm-referral-009\", \"direction\": \"inbound\", \"patientId\": \"cmths8g1c000ggstlh2uibxmi\", \"referredAt\": \"2026-08-18T00:00:00.000Z\", \"referralType\": \"organization\", \"referrerName\": \"Sara Mahmood\", \"referrerPhone\": \"07506000009\", \"referralPersona\": null, \"referrerAddress\": null, \"referrerProfession\": null, \"referringPatientName\": null}'
    ),
    (
        'cmtosuu2i0000gsh9z90prdyl',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/staff/cmths29cs005ygssljeudyajx',
        'healthcare',
        'delete',
        409,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        16,
        '2026-09-05 19:52:33.979',
        '{\"recordId\": \"cmths29cs005ygssljeudyajx\"}'
    ),
    (
        'cmtosvg7q0001gsh9i8alc39h',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/staff/cmths29cs005ygssljeudyajx',
        'healthcare',
        'delete',
        409,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        12,
        '2026-09-05 19:53:02.679',
        '{\"recordId\": \"cmths29cs005ygssljeudyajx\"}'
    ),
    (
        'cmtoswxgr0000gst16wccszy9',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/staff/cmths29cs005ygssljeudyajx',
        'healthcare',
        'delete',
        409,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        15,
        '2026-09-05 19:54:11.691',
        '{\"recordId\": \"cmths29cs005ygssljeudyajx\"}'
    ),
    (
        'cmtoszn1s0000gssd7g68wyiu',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/staff/cmths29cs005ygssljeudyajx',
        'healthcare',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        19,
        '2026-09-05 19:56:18.161',
        '{\"recordId\": \"cmths29cs005ygssljeudyajx\"}'
    ),
    (
        'cmtoszp110001gssdtvl9uphb',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/healthcare/staff/cmt8rjfyh001ygsuz6n02okth',
        'healthcare',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        15,
        '2026-09-05 19:56:20.725',
        '{\"recordId\": \"cmt8rjfyh001ygsuz6n02okth\"}'
    ),
    (
        'cmtots48s0000gs2h1xo3lrod',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PUT',
        '/api/settings/meetings',
        'settings',
        'update',
        400,
        '127.0.0.1',
        'node',
        9,
        '2026-09-05 20:18:26.813',
        '{\"audioQuality\": \"standard\", \"videoQuality\": \"auto\", \"cameraDefault\": false, \"screenQuality\": \"documents\", \"screenSharing\": true, \"maxVideoQuality\": \"1080p\", \"echoCancellation\": true, \"noiseSuppression\": true, \"participantLimit\": 0, \"microphoneDefault\": false}'
    ),
    (
        'cmtots4920001gs2hswv3i9zg',
        'cmt8rjfvv001hgsuz8s70rz74',
        'Nasim Muhammad',
        'PUT',
        '/api/settings/meetings',
        'settings',
        'update',
        403,
        '127.0.0.1',
        'node',
        2,
        '2026-09-05 20:18:26.822',
        '{\"audioQuality\": \"standard\", \"videoQuality\": \"auto\", \"cameraDefault\": false, \"screenQuality\": \"documents\", \"screenSharing\": true, \"maxVideoQuality\": \"1080p\", \"echoCancellation\": true, \"noiseSuppression\": true, \"participantLimit\": 12, \"microphoneDefault\": false}'
    ),
    (
        'cmtoujccd005cgsasojvau1ze',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PUT',
        '/api/settings/organization',
        'settings',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        18,
        '2026-09-05 20:39:37.022',
        '{\"logo\": \"\", \"name\": \"DHF\", \"email\": \"\", \"phone\": \"\", \"address\": \"\", \"branches\": []}'
    ),
    (
        'cmtoujsk6005pgsas28qrvfzv',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PUT',
        '/api/settings/organization',
        'settings',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        15,
        '2026-09-05 20:39:58.038',
        '{\"logo\": \"\", \"name\": \"NHO Health Care\", \"email\": \"\", \"phone\": \"\", \"address\": \"\", \"branches\": []}'
    ),
    (
        'cmtous6gr0000gsaq8251bs1e',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PUT',
        '/api/settings/healthcare',
        'settings',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        17,
        '2026-09-05 20:46:29.308',
        '{\"bookingEnd\": \"17:00\", \"bookingDays\": [0, 1, 2, 3, 4], \"bookingStart\": \"09:00\", \"operatingRooms\": [\"Dental Care\"], \"appointmentMinutes\": 30}'
    ),
    (
        'cmtousea20001gsaqm455s5w0',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PUT',
        '/api/settings/finance',
        'settings',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-05 20:46:39.434',
        '{\"currency\": \"IQD\", \"invoicePrefix\": \"INV\", \"paymentMethods\": [\"cash\", \"card\", \"other\"], \"invoiceNextNumber\": 1}'
    ),
    (
        'cmtouyeh4002agsaq34v3u41n',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PUT',
        '/api/settings/hr',
        'settings',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        17,
        '2026-09-05 20:51:19.625',
        '{\"endTime\": \"17:00\", \"weekends\": [5, 6], \"startTime\": \"09:00\", \"leaveTypes\": [\"Annual leave\", \"Sick leave\", \"Unpaid leave\", \"Moment\"], \"graceMinutes\": 0}'
    ),
    (
        'cmtov1yj4003ngsaqexu2rjf2',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PUT',
        '/api/settings/hr',
        'settings',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-05 20:54:05.585',
        '{\"endTime\": \"17:00\", \"weekends\": [5, 6], \"startTime\": \"09:00\", \"leaveTypes\": [\"Annual leave\", \"Sick leave\", \"Unpaid leave\", \"Moment\"], \"graceMinutes\": 15}'
    ),
    (
        'cmtov2g630000gsz0cza1rdsu',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PUT',
        '/api/settings/hr',
        'settings',
        'update',
        400,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        10,
        '2026-09-05 20:54:28.443',
        '{\"endTime\": \"17:00\", \"weekends\": [5, 6], \"startTime\": \"09:00\", \"leaveTypes\": [\"Annual leave\", \"Sick leave\", \"Unpaid leave\", \"Moment\"], \"graceMinutes\": 15}'
    ),
    (
        'cmtov2pq10001gsz0jpyc5592',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PUT',
        '/api/settings/hr',
        'settings',
        'update',
        400,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        7,
        '2026-09-05 20:54:40.826',
        '{\"endTime\": \"17:00\", \"weekends\": [5, 6], \"startTime\": \"09:00\", \"leaveTypes\": [\"Annual leave\", \"Sick leave\", \"Unpaid leave\", \"Moment\"], \"graceMinutes\": 15}'
    ),
    (
        'cmtov2qqp0002gsz03zwl36su',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PUT',
        '/api/settings/hr',
        'settings',
        'update',
        400,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        7,
        '2026-09-05 20:54:42.146',
        '{\"endTime\": \"17:00\", \"weekends\": [5, 6], \"startTime\": \"09:00\", \"leaveTypes\": [\"Annual leave\", \"Sick leave\", \"Unpaid leave\", \"Moment\"], \"graceMinutes\": 15}'
    ),
    (
        'cmtov2r800003gsz0ig0jv240',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PUT',
        '/api/settings/hr',
        'settings',
        'update',
        400,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        6,
        '2026-09-05 20:54:42.769',
        '{\"endTime\": \"17:00\", \"weekends\": [5, 6], \"startTime\": \"09:00\", \"leaveTypes\": [\"Annual leave\", \"Sick leave\", \"Unpaid leave\", \"Moment\"], \"graceMinutes\": 15}'
    ),
    (
        'cmtov2re90004gsz0x48cyidg',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PUT',
        '/api/settings/hr',
        'settings',
        'update',
        400,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        7,
        '2026-09-05 20:54:42.994',
        '{\"endTime\": \"17:00\", \"weekends\": [5, 6], \"startTime\": \"09:00\", \"leaveTypes\": [\"Annual leave\", \"Sick leave\", \"Unpaid leave\", \"Moment\"], \"graceMinutes\": 15}'
    ),
    (
        'cmtov2rk90005gsz0d302s5me',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PUT',
        '/api/settings/hr',
        'settings',
        'update',
        400,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        6,
        '2026-09-05 20:54:43.209',
        '{\"endTime\": \"17:00\", \"weekends\": [5, 6], \"startTime\": \"09:00\", \"leaveTypes\": [\"Annual leave\", \"Sick leave\", \"Unpaid leave\", \"Moment\"], \"graceMinutes\": 15}'
    ),
    (
        'cmtov3hf30006gsz0g2ptieez',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        229,
        '2026-09-05 20:55:16.720',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtov4n030007gsz0wl08plqt',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PUT',
        '/api/settings/meetings',
        'settings',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        16,
        '2026-09-05 20:56:10.612',
        '{\"audioQuality\": \"high\", \"videoQuality\": \"720p\", \"cameraDefault\": false, \"screenQuality\": \"documents\", \"screenSharing\": true, \"maxVideoQuality\": \"1080p\", \"echoCancellation\": true, \"noiseSuppression\": true, \"participantLimit\": 12, \"microphoneDefault\": false}'
    ),
    (
        'cmtov4xpg0008gsz0kmq1g5g4',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PUT',
        '/api/settings/organization',
        'settings',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        17,
        '2026-09-05 20:56:24.485',
        '{\"logo\": \"\", \"name\": \"NHO Health Care\", \"email\": \"\", \"phone\": \"\", \"address\": \"\", \"branches\": [], \"loadingText\": \"Welcome to NHO\"}'
    ),
    (
        'cmtov5hrg0000gssd7nakyjwl',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        235,
        '2026-09-05 20:56:50.477',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtovbyon004jgssd442t77j3',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees/records/salaries',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        518,
        '2026-09-05 21:01:52.343',
        '{\"payType\": \"monthly\", \"recordId\": \"salaries\", \"baseSalary\": 1000000, \"currencyId\": \"IQD\", \"employeeId\": \"cmtoohliz000fgszf38tu3wm3\", \"effectiveTo\": \"2026-09-30T00:00:00.000Z\", \"effectiveFrom\": \"2026-09-01T00:00:00.000Z\"}'
    ),
    (
        'cmtovek8h004mgssd3uyf463r',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees/records/salaries',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        16,
        '2026-09-05 21:03:53.585',
        '{\"payType\": \"monthly\", \"recordId\": \"salaries\", \"baseSalary\": 350000, \"currencyId\": \"IQD\", \"employeeId\": \"cmtooh1p7000dgszf2agpvblv\", \"effectiveTo\": \"2026-09-30T00:00:00.000Z\", \"effectiveFrom\": \"2026-09-01T00:00:00.000Z\"}'
    ),
    (
        'cmtovf12g004pgssdszu8v47e',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees/records/salaries',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-05 21:04:15.401',
        '{\"payType\": \"monthly\", \"recordId\": \"salaries\", \"baseSalary\": 350000, \"currencyId\": \"IQD\", \"employeeId\": \"cmtoogc6q000bgszfmrzdipra\", \"effectiveTo\": \"2026-09-30T00:00:00.000Z\", \"effectiveFrom\": \"2026-09-01T00:00:00.000Z\"}'
    ),
    (
        'cmtovfg17004sgssdw6z6dwm9',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees/records/salaries',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        17,
        '2026-09-05 21:04:34.796',
        '{\"payType\": \"monthly\", \"recordId\": \"salaries\", \"baseSalary\": 350000, \"currencyId\": \"IQD\", \"employeeId\": \"cmtooflbl0009gszfetww3j5s\", \"effectiveTo\": \"2026-09-30T00:00:00.000Z\", \"effectiveFrom\": \"2026-09-01T00:00:00.000Z\"}'
    ),
    (
        'cmtovgbnv004vgssdd4k7j7r4',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees/records/salaries',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        16,
        '2026-09-05 21:05:15.787',
        '{\"payType\": \"monthly\", \"recordId\": \"salaries\", \"baseSalary\": 350000, \"currencyId\": \"IQD\", \"employeeId\": \"cmtoodx3u0001gszfupsyin5h\", \"effectiveTo\": \"2026-09-30T00:00:00.000Z\", \"effectiveFrom\": \"2026-09-01T00:00:00.000Z\"}'
    ),
    (
        'cmtovh59d004ygssdv584r0mh',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees/records/salaries',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-05 21:05:54.145',
        '{\"payType\": \"monthly\", \"recordId\": \"salaries\", \"baseSalary\": 350000, \"currencyId\": \"IQD\", \"employeeId\": \"cmtejrmbi0026gsq6kwta0vvc\", \"effectiveTo\": \"2026-09-30T00:00:00.000Z\", \"effectiveFrom\": \"2026-09-01T00:00:00.000Z\"}'
    ),
    (
        'cmtovpx810000gs0yvsyt2d94',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/employees/records/salaries/cmt8rjfxv001sgsuz6f97kbn8',
        'employees',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        17,
        '2026-09-05 21:12:43.633',
        '{\"payType\": \"monthly\", \"recordId\": \"cmt8rjfxv001sgsuz6f97kbn8\", \"baseSalary\": 600000, \"currencyId\": \"IQD\", \"employeeId\": \"cmt8rjfwl001kgsuzbwmza8rr\"}'
    ),
    (
        'cmtovq47c0001gs0yc5gnbs6w',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/employees/records/salaries/cmt8rjfy2001ugsuz17gw7os1',
        'employees',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-05 21:12:52.681',
        '{\"payType\": \"monthly\", \"recordId\": \"cmt8rjfy2001ugsuz17gw7os1\", \"baseSalary\": 650000, \"currencyId\": \"IQD\", \"employeeId\": \"cmt8rjfwt001mgsuza9e8zkde\"}'
    ),
    (
        'cmtovqba70002gs0ygqvtrsfk',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/employees/records/salaries/cmths2973004sgsslhyonx5mf',
        'employees',
        'delete',
        409,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-05 21:13:01.855',
        '{\"recordId\": \"cmths2973004sgsslhyonx5mf\"}'
    ),
    (
        'cmtovr5fd0003gs0ybopyt0dt',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/employees/records/salaries/cmths29co005wgssliozwbdny',
        'employees',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-05 21:13:40.921',
        '{\"payType\": \"monthly\", \"recordId\": \"cmths29co005wgssliozwbdny\", \"baseSalary\": 350000, \"currencyId\": \"IQD\", \"employeeId\": \"cmths29cb005ugsslwfprjw4y\"}'
    ),
    (
        'cmtovrbe10004gs0yg1oew7d5',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/employees/records/salaries/cmtovbyag004igssdo3lqy5wp',
        'employees',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        15,
        '2026-09-05 21:13:48.649',
        '{\"recordId\": \"cmtovbyag004igssdo3lqy5wp\"}'
    ),
    (
        'cmtovreks0005gs0yj7b9y8gg',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/employees/records/salaries/cmths2973004sgsslhyonx5mf',
        'employees',
        'delete',
        409,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        12,
        '2026-09-05 21:13:52.781',
        '{\"recordId\": \"cmths2973004sgsslhyonx5mf\"}'
    ),
    (
        'cmtovrh5x0006gs0ym5ejsxc9',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/employees/records/salaries/cmths2973004sgsslhyonx5mf',
        'employees',
        'delete',
        409,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        12,
        '2026-09-05 21:13:56.133',
        '{\"recordId\": \"cmths2973004sgsslhyonx5mf\"}'
    ),
    (
        'cmtovrkce0007gs0yw8cn9bob',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/employees/records/salaries/cmths2973004sgsslhyonx5mf',
        'employees',
        'delete',
        409,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        13,
        '2026-09-05 21:14:00.255',
        '{\"recordId\": \"cmths2973004sgsslhyonx5mf\"}'
    ),
    (
        'cmtovrun40008gs0yanjfo31b',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/employees/records/salaries/cmths2973004sgsslhyonx5mf',
        'employees',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        15,
        '2026-09-05 21:14:13.600',
        '{\"recordId\": \"cmths2973004sgsslhyonx5mf\"}'
    ),
    (
        'cmtpxnlni0000gsvfprg9l49b',
        NULL,
        NULL,
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        401,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        17,
        '2026-09-06 14:54:40.734',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtpxnpnx0001gsvf3gdoo3sb',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        241,
        '2026-09-06 14:54:45.934',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtpy8ik40022gsvfb13x4ghs',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        71,
        '2026-09-06 15:10:56.500',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtpy8msv0045gsvfepztzdy1',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        1762,
        '2026-09-06 15:11:01.999',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtpykmd20010gssf0d090o1f',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        229,
        '2026-09-06 15:20:21.302',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtq0hcff0041gssf9se83a63',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        77,
        '2026-09-06 16:13:47.691',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtq0rulm0052gssfg1trc04c',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        502,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        62,
        '2026-09-06 16:21:57.802',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtq0rwfp0053gssfvu47dadc',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        502,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        41,
        '2026-09-06 16:22:00.181',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtq0s2hw0054gssf2asljp9k',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        502,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        63,
        '2026-09-06 16:22:08.036',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtq0wza60055gssfpkg9sdow',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        502,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        141,
        '2026-09-06 16:25:57.150',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtq12v0a0056gssfvlbnaw67',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        502,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        47,
        '2026-09-06 16:30:31.546',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtq1d9g50057gssf8unk4i2t',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        502,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        53,
        '2026-09-06 16:38:36.822',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtq1vbg70058gssf5kjklwe6',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        59,
        '2026-09-06 16:52:39.224',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtq1zfgi0059gssfolhe19nh',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        52,
        '2026-09-06 16:55:51.042',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtq607u8009agssfv1wobjw9',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp',
        'attendance',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        17,
        '2026-09-06 18:48:26.289',
        '{\"name\": \"Main Attendance\", \"port\": 11000, \"recordId\": \"cmt8rqkjx0000gsu4r6quy0fp\", \"username\": \"admin\", \"ipAddress\": \"212.237.127.65\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"workingDaysPerMonth\": 22}'
    ),
    (
        'cmtq612wy009bgssf6dqarhls',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        504,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        38292,
        '2026-09-06 18:49:06.562',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtq63dhc009cgssfix8fygrm',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        504,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        38290,
        '2026-09-06 18:50:53.569',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtq6jnce009dgssfkkgu9ota',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp',
        'attendance',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        18,
        '2026-09-06 19:03:32.846',
        '{\"name\": \"Main Attendance\", \"port\": 11000, \"recordId\": \"cmt8rqkjx0000gsu4r6quy0fp\", \"username\": \"admin\", \"ipAddress\": \"192.168.1.96\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"workingDaysPerMonth\": 22}'
    ),
    (
        'cmtq6jqbp009egssfbm3nyg66',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        502,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        2483,
        '2026-09-06 19:03:36.709',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtq6jsy2009fgssfq55uuot0',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp',
        'attendance',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        13,
        '2026-09-06 19:03:40.106',
        '{\"name\": \"Main Attendance\", \"port\": 80, \"recordId\": \"cmt8rqkjx0000gsu4r6quy0fp\", \"username\": \"admin\", \"ipAddress\": \"192.168.1.96\", \"checkInTime\": \"09:00\", \"checkOutTime\": \"17:00\", \"workingDaysPerMonth\": 22}'
    ),
    (
        'cmtq6ju8k009ggssfq0zyan5h',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        130,
        '2026-09-06 19:03:41.780',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtq6k9ia00blgssfqy3bfeo4',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        736,
        '2026-09-06 19:04:01.570',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtq6p10c00bmgssffn1j0ugw',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        63,
        '2026-09-06 19:07:43.837',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtq6r97v00cngssffp0u4q9d',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        53,
        '2026-09-06 19:09:27.788',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtq6wt4500eqgssfy596438w',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/crm/leads/seed-crm-lead-005',
        'crm',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        17,
        '2026-09-06 19:13:46.854',
        '{\"status\": \"appointment_requested\", \"recordId\": \"seed-crm-lead-005\"}'
    ),
    (
        'cmtq6wwms00etgssfjwv7qmb8',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/crm/leads/seed-crm-lead-005',
        'crm',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        18,
        '2026-09-06 19:13:51.413',
        '{\"status\": \"contacted\", \"recordId\": \"seed-crm-lead-005\"}'
    ),
    (
        'cmtq6x0cn00exgssfn4byexcn',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/crm/leads/seed-crm-lead-004',
        'crm',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        22,
        '2026-09-06 19:13:56.232',
        '{\"status\": \"converted\", \"recordId\": \"seed-crm-lead-004\"}'
    ),
    (
        'cmtq7gbyl00eygssfct0hw158',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        136,
        '2026-09-06 19:28:57.741',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtribh3n0000gsjvh4c7gvev',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        257,
        '2026-09-07 17:20:53.076',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtribm6f0011gsjvoygmvbs0',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        55,
        '2026-09-07 17:20:59.656',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtrifrci0022gsjvlt7cx4g7',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/attendance/people/cmtpy68tc000jgsvf4msx1zvk/pin',
        'attendance',
        'delete',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        152,
        '2026-09-07 17:24:12.978',
        '{\"recordId\": \"pin\"}'
    ),
    (
        'cmtrifu31002lgsjvmmillwsn',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/attendance/people/cmt8rs0yd0002gsu4jslf34ma/pin',
        'attendance',
        'delete',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        105,
        '2026-09-07 17:24:16.525',
        '{\"recordId\": \"pin\"}'
    ),
    (
        'cmtrifymm0034gsjvnqlqjtio',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/attendance/people/cmt8rs0yd0002gsu4jslf34ma/face',
        'attendance',
        'delete',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        131,
        '2026-09-07 17:24:22.414',
        '{\"recordId\": \"face\"}'
    ),
    (
        'cmtrig2h9003ngsjvevnfiesl',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/people/cmt8rs0yd0002gsu4jslf34ma/pin',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        112,
        '2026-09-07 17:24:27.405',
        '{\"recordId\": \"pin\"}'
    ),
    (
        'cmtrigbqm005agsjvwliy2jya',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        667,
        '2026-09-07 17:24:39.406',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtrigec3005bgsjvc339o6zh',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        440,
        '2026-09-07 17:24:42.771',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtrkdfzw0000gslwh8tjdz5j',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        240,
        '2026-09-07 18:18:24.188',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtrlle4g0000gsddcttvb1zx',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        233,
        '2026-09-07 18:52:34.624',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtrom6vh0000gsk50d5wm1mp',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        235,
        '2026-09-07 20:17:10.734',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtropawe0001gsk5t5de0g9b',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        181,
        '2026-09-07 20:19:35.918',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtrq2c1r0004gsax7px9za7w',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/inventory/transfers',
        'inventory',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        21,
        '2026-09-07 20:57:43.552',
        '{\"items\": [{\"quantity\": 3, \"productId\": \"cmt8rjh2n00cdgsuz5t8lh4uu\", \"fromWarehouseId\": \"cmt8rjgyl00bkgsuz8adfd5pp\"}], \"toWarehouseId\": \"cmt8rjgz300bngsuzr8a8c9co\"}'
    ),
    (
        'cmtrqvbxa0005gsax1ie0vlfv',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        235,
        '2026-09-07 21:20:16.415',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtrqvhnl0028gsaxhi2fcrkr',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        667,
        '2026-09-07 21:20:23.841',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtrr1i2g0029gsax5nnl36z3',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/inventory/products/images',
        'inventory',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        10,
        '2026-09-07 21:25:04.312',
        '{\"recordId\": \"images\"}'
    ),
    (
        'cmtrr52ix002agsax6z3jd4ok',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/tasks/cmths28q7001pgsslmowl3n34',
        'tasks',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        21,
        '2026-09-07 21:27:50.794',
        '{\"status\": \"in_progress\", \"dueDate\": null, \"startDate\": null}'
    ),
    (
        'cmtrr5jbh002bgsaxe6wj7jlu',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/tasks/cmths28qe001vgssluzz1bv7m',
        'tasks',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        19,
        '2026-09-07 21:28:12.558',
        '{}'
    ),
    (
        'cmtrr5kov002cgsax1losogbr',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/tasks/cmths28q7001pgsslmowl3n34',
        'tasks',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        11,
        '2026-09-07 21:28:14.335',
        '{}'
    ),
    (
        'cmtrr5noi002dgsax88tf92u2',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        71,
        '2026-09-07 21:28:18.211',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtrrfw1f005egsaxfcfw7ybj',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        231,
        '2026-09-07 21:36:15.603',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtrrp4g4005fgsaxmx9xu0eq',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/inventory/warehouses/cmt8rjgzi00bqgsuz7a0ub17d',
        'inventory',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-07 21:43:26.404',
        '{\"recordId\": \"cmt8rjgzi00bqgsuz7a0ub17d\"}'
    ),
    (
        'cmtrrp5ys005ggsax3kwps5x8',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/inventory/warehouses/cmt8rjgzw00btgsuzuyzex8ic',
        'inventory',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-07 21:43:28.373',
        '{\"recordId\": \"cmt8rjgzw00btgsuzuyzex8ic\"}'
    ),
    (
        'cmtrrp79v005hgsaxvpj32szz',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/inventory/warehouses/cmt8rjh0c00bwgsuz7rzbrei0',
        'inventory',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        13,
        '2026-09-07 21:43:30.068',
        '{\"recordId\": \"cmt8rjh0c00bwgsuz7rzbrei0\"}'
    ),
    (
        'cmtrrpack005igsaxxnljwd8o',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/inventory/warehouses/cmt8rjh0r00bzgsuza7xx18s3',
        'inventory',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        13,
        '2026-09-07 21:43:34.052',
        '{\"recordId\": \"cmt8rjh0r00bzgsuza7xx18s3\"}'
    ),
    (
        'cmtrrpdi3005jgsaxwundpc9q',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/inventory/warehouses/cmt8rjh1500c2gsuz2qoc87qh',
        'inventory',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-07 21:43:38.140',
        '{\"recordId\": \"cmt8rjh1500c2gsuz2qoc87qh\"}'
    ),
    (
        'cmtrrpeq0005kgsaxtfh3265w',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/inventory/warehouses/cmt8rjh1o00c5gsuzejgtjak1',
        'inventory',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        11,
        '2026-09-07 21:43:39.721',
        '{\"recordId\": \"cmt8rjh1o00c5gsuzejgtjak1\"}'
    ),
    (
        'cmtrrpg4c005lgsaxclvpq586',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/inventory/warehouses/cmt8rjh2300c8gsuz1nk3h9xv',
        'inventory',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        13,
        '2026-09-07 21:43:41.532',
        '{\"recordId\": \"cmt8rjh2300c8gsuz1nk3h9xv\"}'
    ),
    (
        'cmtrrphzn005mgsaxalha9kbm',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/inventory/warehouses/cmt8rjh2i00cbgsuzog2vwtnc',
        'inventory',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-07 21:43:43.956',
        '{\"recordId\": \"cmt8rjh2i00cbgsuzog2vwtnc\"}'
    ),
    (
        'cmtrs6d0m0000gsv553ojf0gc',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/inventory/brands/cmths29q900b0gsslzeu0vs4u',
        'inventory',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        15,
        '2026-09-07 21:56:50.662',
        '{\"recordId\": \"cmths29q900b0gsslzeu0vs4u\"}'
    ),
    (
        'cmtrs6efj0001gsv5l9nl8aiq',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/inventory/brands/cmths29qt00b3gsslm8fy01ul',
        'inventory',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        16,
        '2026-09-07 21:56:52.496',
        '{\"recordId\": \"cmths29qt00b3gsslm8fy01ul\"}'
    ),
    (
        'cmtrs6fxa0002gsv5rmveo3hv',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/inventory/brands/cmths29rt00b9gsslwbsx03ri',
        'inventory',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        15,
        '2026-09-07 21:56:54.431',
        '{\"recordId\": \"cmths29rt00b9gsslwbsx03ri\"}'
    ),
    (
        'cmtrsbx0j0013gsv589bauic8',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/inventory/warehouses/cmt8rjgyl00bkgsuz8adfd5pp',
        'inventory',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        12,
        '2026-09-07 22:01:09.860',
        '{\"code\": \"SEED-WH-001\", \"name\": \"Wherehouse Arzheen\", \"status\": \"active\", \"location\": \"Erbil Brayate\", \"recordId\": \"cmt8rjgyl00bkgsuz8adfd5pp\"}'
    ),
    (
        'cmtrscmtg0014gsv5sysjzp3a',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/inventory/warehouses/cmt8rjgz300bngsuzr8a8c9co',
        'inventory',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        16,
        '2026-09-07 22:01:43.301',
        '{\"code\": \"SEED-WH-002\", \"name\": \"Wherehouse Gullan\", \"status\": \"active\", \"location\": \"Erbil , Raparin\", \"recordId\": \"cmt8rjgz300bngsuzr8a8c9co\"}'
    ),
    (
        'cmtrscrr00015gsv5dycu9e5v',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/inventory/warehouses/cmt8rjgyl00bkgsuz8adfd5pp',
        'inventory',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        16,
        '2026-09-07 22:01:49.693',
        '{\"code\": \"WH-001\", \"name\": \"Wherehouse Arzheen\", \"status\": \"active\", \"location\": \"Erbil Brayate\", \"recordId\": \"cmt8rjgyl00bkgsuz8adfd5pp\"}'
    ),
    (
        'cmtrscvgt0016gsv54gfp6z8n',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/inventory/warehouses/cmt8rjgz300bngsuzr8a8c9co',
        'inventory',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
        16,
        '2026-09-07 22:01:54.510',
        '{\"code\": \"WH-002\", \"name\": \"Wherehouse Gullan\", \"status\": \"active\", \"location\": \"Erbil , Raparin\", \"recordId\": \"cmt8rjgz300bngsuzr8a8c9co\"}'
    ),
    (
        'cmtrsmav50000gs4z4mrpbrbp',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/inventory/products/health_seed_013/expiry-date',
        'inventory',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        20,
        '2026-09-07 22:09:14.370',
        '{\"recordId\": \"expiry-date\", \"expiryDate\": \"2026-09-09\"}'
    ),
    (
        'cmtrsmfjn0001gs4z4vyw60xr',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/inventory/products/health_seed_035/expiry-date',
        'inventory',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        12,
        '2026-09-07 22:09:20.436',
        '{\"recordId\": \"expiry-date\", \"expiryDate\": \"2026-09-08\"}'
    ),
    (
        'cmtrsml5s0002gs4zl35790wt',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/inventory/products/health_seed_041/expiry-date',
        'inventory',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        16,
        '2026-09-07 22:09:27.712',
        '{\"recordId\": \"expiry-date\", \"expiryDate\": \"2026-09-08\"}'
    ),
    (
        'cmtrss8jf0003gs4zpfv8atzd',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/inventory/products/images',
        'inventory',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        12,
        '2026-09-07 22:13:51.292',
        '{\"recordId\": \"images\"}'
    ),
    (
        'cmtrssbph0004gs4z0e7c4qlh',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/inventory/products/images',
        'inventory',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        7,
        '2026-09-07 22:13:55.397',
        '{\"recordId\": \"images\"}'
    ),
    (
        'cmtrsy1i70005gs4zlnuklaa4',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/inventory/products/health_seed_041/expiry-date',
        'inventory',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-07 22:18:22.112',
        '{\"recordId\": \"expiry-date\", \"expiryDate\": \"2026-09-01\"}'
    ),
    (
        'cmtrsy79r0006gs4zaab0swse',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/inventory/products/health_seed_041/expiry-date',
        'inventory',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        16,
        '2026-09-07 22:18:29.584',
        '{\"recordId\": \"expiry-date\", \"expiryDate\": \"2026-09-10\"}'
    ),
    (
        'cmtrsybhl0007gs4zjijmbdr7',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/inventory/products/health_seed_035/expiry-date',
        'inventory',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        16,
        '2026-09-07 22:18:35.050',
        '{\"recordId\": \"expiry-date\", \"expiryDate\": \"2026-09-07\"}'
    ),
    (
        'cmtrsyfau0008gs4zs57qojjl',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/inventory/products/health_seed_035/expiry-date',
        'inventory',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-07 22:18:39.991',
        '{\"recordId\": \"expiry-date\", \"expiryDate\": \"2026-09-08\"}'
    ),
    (
        'cmtrszsqy0000gsy61rv26jn5',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/inventory/products/health_seed_041',
        'inventory',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        19,
        '2026-09-07 22:19:44.074',
        '{\"sku\": \"HEALTH-041\", \"name\": \"Adult Nasal Oxygen Cannula\", \"unit\": \"item\", \"images\": [], \"status\": \"active\", \"barcode\": \"\", \"brandId\": \"\", \"taxRate\": \"0\", \"recordId\": \"health_seed_041\", \"costPrice\": \"0.8\", \"categoryId\": \"cmtrqqpiw0004gsero02jsoso\", \"expiryDate\": \"2026-09-30\", \"discountEnd\": \"\", \"discountType\": null, \"sellingPrice\": \"1\", \"discountStart\": \"\", \"discountValue\": \"0\"}'
    ),
    (
        'cmtru38de0000gs6950y3arzk',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        235,
        '2026-09-07 22:50:23.906',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtru6sq10001gsvtsn3fdvok',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/inventory/department-requests',
        'inventory',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        18,
        '2026-09-07 22:53:10.249',
        '{\"note\": \"\", \"type\": \"equipment\", \"items\": [{\"quantity\": 100, \"productId\": \"health_seed_044\", \"warehouseId\": \"cmt8rjgz300bngsuzr8a8c9co\"}], \"departmentId\": \"cmt8rjfvq001ggsuzrupsrxku\"}'
    ),
    (
        'cmtru7mh60002gsvt4euvi1w7',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/inventory/department-orders/cmtru6spr0000gsvtic5m0gsz',
        'inventory',
        'update',
        409,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        16,
        '2026-09-07 22:53:48.810',
        '{\"price\": null, \"reason\": \"\", \"status\": \"approved\", \"recordId\": \"cmtru6spr0000gsvtic5m0gsz\"}'
    ),
    (
        'cmtrv18nb0023gsvt749j9gbk',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        229,
        '2026-09-07 23:16:50.567',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtrv40nr0024gsvtyaysddh4',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        68,
        '2026-09-07 23:19:00.184',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtrvaeie0025gsvtmfi1u1r7',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        61,
        '2026-09-07 23:23:58.070',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtsqs6q20000gs8qeplhwfx2',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        248,
        '2026-09-08 14:05:35.883',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtsr27mv0001gs8qevl42rb0',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/inventory/department-orders/cmtru6spr0000gsvtic5m0gsz',
        'inventory',
        'update',
        409,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        21,
        '2026-09-08 14:13:23.623',
        '{\"price\": 10, \"reason\": \"\", \"status\": \"approved\", \"recordId\": \"cmtru6spr0000gsvtic5m0gsz\"}'
    ),
    (
        'cmtswzkow0000gsvg9bbip548',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        237,
        '2026-09-08 16:59:18.273',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtsxy7lk0000gspz26cbatjm',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        233,
        '2026-09-08 17:26:14.264',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtsybedf0000gs62dxr259vh',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        233,
        '2026-09-08 17:36:29.571',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtsyfl9m002kgsxr62cx5tqi',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        904,
        '2026-09-08 17:39:45.130',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyllse0016gsg753lrembu',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/employees/records/attendance-permissions',
        'employees',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        17,
        '2026-09-08 17:44:25.742',
        '{\"reason\": \"checkin error device\", \"status\": \"approved\", \"toDate\": \"2026-09-07T00:00:00.000Z\", \"fromDate\": \"2026-09-07T00:00:00.000Z\", \"recordId\": \"attendance-permissions\", \"employeeId\": \"cmt8rjfwl001kgsuzbwmza8rr\", \"permissionType\": \"full_day\", \"permittedMinutes\": null}'
    ),
    (
        'cmtsymivs004lgsg7vpsagj2a',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        694,
        '2026-09-08 17:45:08.632',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsynssg007ygsg7059d5b43',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        511,
        '2026-09-08 17:46:08.128',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyrplc0014gsbt00lnfqal',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        512,
        '2026-09-08 17:49:10.609',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsys61e0015gsbt258lk6m4',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        470,
        '2026-09-08 17:49:31.922',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyso2i0016gsbt1u8pndy2',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        446,
        '2026-09-08 17:49:55.291',
        '{\"to\": \"2026-09-08\", \"from\": \"2026-09-07\", \"recordId\": \"sync\"}'
    ),
    (
        'cmtsyt7h0003fgsbtcm6hmax0',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/events',
        'attendance',
        'delete',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        725,
        '2026-09-08 17:50:20.436',
        '{\"recordId\": \"events\"}'
    ),
    (
        'cmtsytbtp004kgsbtzopsdbm5',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        681,
        '2026-09-08 17:50:26.078',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsytzbn004lgsbt68wrowh1',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        447,
        '2026-09-08 17:50:56.532',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyv0j6004mgsbto9fsxol3',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        484,
        '2026-09-08 17:51:44.754',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyv1hk004ngsbtgqqxrehd',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        483,
        '2026-09-08 17:51:45.992',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyv2np004ogsbtvqlfvvga',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        559,
        '2026-09-08 17:51:47.510',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyv3wk004pgsbtmqk3c6cn',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        519,
        '2026-09-08 17:51:49.124',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyv4yu004qgsbtle21chtt',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        545,
        '2026-09-08 17:51:50.502',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyvjlu004tgsbtp4l65ke1',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        2237,
        '2026-09-08 17:52:09.475',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsywf4f004wgsbt6njkyj6q',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        505,
        '2026-09-08 17:52:50.320',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyx5g0004xgsbtz4f83mmt',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        643,
        '2026-09-08 17:53:24.433',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyxf7t004ygsbtsw758sjs',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        570,
        '2026-09-08 17:53:37.097',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyxgf7004zgsbt8cujhayj',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        524,
        '2026-09-08 17:53:38.659',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyxixj0050gsbtfsa5t2nk',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        481,
        '2026-09-08 17:53:41.911',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyxk4i0051gsbtceqjxotf',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        451,
        '2026-09-08 17:53:43.458',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyxot00052gsbtb5xyszq4',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        525,
        '2026-09-08 17:53:49.524',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyxs0m0053gsbtmd0zerv3',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        735,
        '2026-09-08 17:53:53.686',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyxx0j0056gsbtqsp75quc',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        693,
        '2026-09-08 17:54:00.163',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyydxv0057gsbtdafrbsjq',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        580,
        '2026-09-08 17:54:22.100',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyyf0s0058gsbt2gsvjtm0',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        549,
        '2026-09-08 17:54:23.501',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyz46q005dgsbtpo54qm9l',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        827,
        '2026-09-08 17:54:56.115',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyz4tz005egsbtgsou68py',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        624,
        '2026-09-08 17:54:56.952',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyzfz2005hgsbt0vk1kioz',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        1165,
        '2026-09-08 17:55:11.390',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyzk3u005igsbtoeaftap7',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        474,
        '2026-09-08 17:55:16.747',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyzl86005jgsbtz2ss95hl',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        525,
        '2026-09-08 17:55:18.198',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyzno5005mgsbtivdkgte0',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        604,
        '2026-09-08 17:55:21.365',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyzqgs005ngsbt325ziioq',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        652,
        '2026-09-08 17:55:24.988',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyzsh2005ogsbtq1q6fwqz',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        445,
        '2026-09-08 17:55:27.590',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyztqi005pgsbt9lj09o7s',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        618,
        '2026-09-08 17:55:29.226',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyzuq5005qgsbtwe8i1r03',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        549,
        '2026-09-08 17:55:30.509',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyzvoc005rgsbtd9jpyxqz',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        492,
        '2026-09-08 17:55:31.740',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyzwqh005sgsbt0oqcxg9r',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        512,
        '2026-09-08 17:55:33.113',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsyzy8w005vgsbt7rh4eqbl',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        616,
        '2026-09-08 17:55:35.072',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz06c9005wgsbtsia5876l',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        593,
        '2026-09-08 17:55:45.561',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz09n9005xgsbtavvkisi8',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        613,
        '2026-09-08 17:55:49.845',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz0al7005ygsbtc0nhk9s2',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        459,
        '2026-09-08 17:55:51.067',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz0bms005zgsbtqqin66hf',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        436,
        '2026-09-08 17:55:52.420',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz0hdj0060gsbtltpg7pkf',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        543,
        '2026-09-08 17:55:59.863',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz0ih90061gsbtcd3z9e7k',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        437,
        '2026-09-08 17:56:01.293',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz0lo80064gsbtal976jf9',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        696,
        '2026-09-08 17:56:05.433',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz0o6s0065gsbtyra9opue',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        804,
        '2026-09-08 17:56:08.693',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz0pcb0066gsbt79zf8k6u',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        667,
        '2026-09-08 17:56:10.187',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz0qd00067gsbtg6w12k0f',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        492,
        '2026-09-08 17:56:11.508',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz0v7k0068gsbtocalnfyf',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        632,
        '2026-09-08 17:56:17.793',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz0w8a0069gsbt0q4tg25n',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        489,
        '2026-09-08 17:56:19.115',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz111a006agsbt7aj7epsq',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        469,
        '2026-09-08 17:56:25.343',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz12qb006bgsbtvfndz66p',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        595,
        '2026-09-08 17:56:27.539',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz13py006cgsbt27ubkpns',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        510,
        '2026-09-08 17:56:28.823',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz14ve006dgsbtmslwqy0i',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        601,
        '2026-09-08 17:56:30.315',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz15zp006egsbtizfif8ez',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        524,
        '2026-09-08 17:56:31.766',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz16xi006fgsbt8uttetmy',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        477,
        '2026-09-08 17:56:32.983',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz17xs006ggsbt3buhsxce',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        424,
        '2026-09-08 17:56:34.289',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz18xb006jgsbt5bfs0ls3',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        478,
        '2026-09-08 17:56:35.568',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz2dwv006kgsbtxk0ovymw',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        541,
        '2026-09-08 17:57:28.687',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz2or9006lgsbtespyxxvt',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        1028,
        '2026-09-08 17:57:42.741',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtsz32mn007qgsbt6w3ogdhl',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'DELETE',
        '/api/employees/records/attendance-permissions/cmtsylls40015gsg7v79xye8c',
        'employees',
        'delete',
        204,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        236,
        '2026-09-08 17:58:00.719',
        '{\"recordId\": \"cmtsylls40015gsg7v79xye8c\"}'
    ),
    (
        'cmtt36ib80000gs6zsap5vqab',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        235,
        '2026-09-08 19:52:39.476',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtt4f5e1002fgs6z7uzma15s',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        570,
        '2026-09-08 20:27:22.250',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtt4f9h2002ggs6z4z1pnk9t',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        584,
        '2026-09-08 20:27:27.543',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtt4rnob0002gsci4wmma9cz',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/crm/leads/seed-crm-lead-010',
        'crm',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        20,
        '2026-09-08 20:37:05.820',
        '{\"status\": \"lost\", \"recordId\": \"seed-crm-lead-010\"}'
    ),
    (
        'cmtt4rpx50005gscijm2uuh8n',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/crm/leads/seed-crm-lead-010',
        'crm',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        18,
        '2026-09-08 20:37:08.729',
        '{\"status\": \"new\", \"recordId\": \"seed-crm-lead-010\"}'
    ),
    (
        'cmtt4upb6002egscipqccp8ns',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        169,
        '2026-09-08 20:39:27.907',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtt4vj9z003jgscimy6ozlij',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/events/sync',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        694,
        '2026-09-08 20:40:06.744',
        '{\"recordId\": \"sync\"}'
    ),
    (
        'cmtt5g9u00000gs45epjmdiak',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        237,
        '2026-09-08 20:56:14.281',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtt659yp0000gsdrzgna9pf2',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/employees/positions/cmths297h004wgsslk2gv3slm',
        'employees',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        23,
        '2026-09-08 21:15:40.850',
        '{\"name\": \"General Surgeon\", \"status\": \"active\", \"recordId\": \"cmths297h004wgsslk2gv3slm\", \"description\": \"General Surgeon\"}'
    ),
    (
        'cmtt6a8e80001gsdrk8pbuqmr',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        230,
        '2026-09-08 21:19:32.096',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtt6fh2x0016gsdr1r7gvq8y',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        54,
        '2026-09-08 21:23:36.634',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtt6fii40017gsdr9yaurvew',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        58,
        '2026-09-08 21:23:38.476',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtt6fjba0018gsdrmgp8aath',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        36,
        '2026-09-08 21:23:39.526',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtt6fk4q0019gsdrcdcl93s9',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/attendance/devices/cmt8rqkjx0000gsu4r6quy0fp/test',
        'attendance',
        'create',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        48,
        '2026-09-08 21:23:40.586',
        '{\"recordId\": \"test\"}'
    ),
    (
        'cmtt6pc3u0000gsrqk1vdivch',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        229,
        '2026-09-08 21:31:16.746',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtt6uqh50000gsmvcx93kz1c',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        232,
        '2026-09-08 21:35:28.649',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtt6xzk70003gsmv7xhpmotk',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/crm/prescriptions/patient/cmths8fzr000cgstltkk7pjj9',
        'crm',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        17,
        '2026-09-08 21:38:00.391',
        '{\"items\": [{\"dosage\": \"2\", \"duration\": \"12\", \"medicine\": \"Aneroid Blood Pressure Monitor\", \"quantity\": 1, \"frequency\": \"3\", \"instructions\": \"\"}], \"notes\": \"\", \"recordId\": \"cmths8fzr000cgstltkk7pjj9\", \"requestId\": \"d43249be-7cc1-4a43-9db5-5655fee069d4\"}'
    ),
    (
        'cmtt74nvc0000gsxd7wl6otki',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'PATCH',
        '/api/crm/appointments/surgery%3Aseed-crm-surgery-appointment-007/served',
        'crm',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        14,
        '2026-09-08 21:43:11.833',
        '{\"recordId\": \"served\"}'
    ),
    (
        'cmtt78dp9000cgsxdobjbpbxg',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/meetings',
        'meetings',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        21,
        '2026-09-08 21:46:05.278',
        '{\"title\": \"fd\", \"departmentId\": \"cmt8rjfvj001fgsuz5r0t0a49\"}'
    ),
    (
        'cmtt7b1oe000hgsxdzhrjqyf6',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        247,
        '2026-09-08 21:48:09.662',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtt7cjl4000igsxdi4g7rpet',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'NHO Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        225,
        '2026-09-08 21:49:19.528',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtt7dspd000jgsxd8qa4vyx9',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        225,
        '2026-09-08 21:50:18.002',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtt7hh3r000kgsxdr3cpdfls',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Super Administrator',
        'PUT',
        '/api/settings/organization',
        'settings',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        15,
        '2026-09-08 21:53:09.592',
        '{\"logo\": \"\", \"name\": \"NHO\", \"email\": \"\", \"phone\": \"\", \"address\": \"\", \"branches\": [], \"loadingText\": \"Welcome to NHO\"}'
    ),
    (
        'cmtt84w0u000lgsxd6buaxk6r',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Super Administrator',
        'POST',
        '/api/inventory/products/images',
        'inventory',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        11,
        '2026-09-08 22:11:22.014',
        '{\"recordId\": \"images\"}'
    ),
    (
        'cmtt85kdv000mgsxd1wgui61d',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Super Administrator',
        'POST',
        '/api/inventory/products/images',
        'inventory',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        9,
        '2026-09-08 22:11:53.588',
        '{\"recordId\": \"images\"}'
    ),
    (
        'cmtt86r3e000ngsxdino8i5j9',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Super Administrator',
        'POST',
        '/api/inventory/products/images',
        'inventory',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        8,
        '2026-09-08 22:12:48.938',
        '{\"recordId\": \"images\"}'
    ),
    (
        'cmtt88rfh000ogsxd4i6vfspm',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Super Administrator',
        'POST',
        '/api/inventory/products/images',
        'inventory',
        'create',
        500,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        8,
        '2026-09-08 22:14:22.685',
        '{\"recordId\": \"images\"}'
    ),
    (
        'cmtt88y6q000pgsxdph7rs2gr',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Super Administrator',
        'POST',
        '/api/inventory/products/images',
        'inventory',
        'create',
        500,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        6,
        '2026-09-08 22:14:31.442',
        '{\"recordId\": \"images\"}'
    ),
    (
        'cmtt89pll0000gsycpvlolpw6',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Super Administrator',
        'POST',
        '/api/inventory/products/images',
        'inventory',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        17,
        '2026-09-08 22:15:06.969',
        '{\"recordId\": \"images\"}'
    ),
    (
        'cmtt8ajkc0001gsyckkjfcown',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Super Administrator',
        'POST',
        '/api/inventory/products/images',
        'inventory',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        6,
        '2026-09-08 22:15:45.804',
        '{\"recordId\": \"images\"}'
    ),
    (
        'cmtt8cag80000gshp7tdit6rr',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        237,
        '2026-09-08 22:17:07.304',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtt8e4bg0001gshprd4rgdun',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Super Administrator',
        'POST',
        '/api/inventory/products/images',
        'inventory',
        'create',
        201,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        12,
        '2026-09-08 22:18:32.669',
        '{\"recordId\": \"images\"}'
    ),
    (
        'cmtt8e8u40002gshpi7ii5zpf',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Super Administrator',
        'DELETE',
        '/api/inventory/products/images',
        'inventory',
        'delete',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        7,
        '2026-09-08 22:18:38.524',
        '{\"imageUrl\": \"/public/product-images/67a85bea-302c-4e18-a893-a7cebb1382e0.png\", \"recordId\": \"images\"}'
    ),
    (
        'cmtt9g0i60003gshpv5tfmkyz',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Super Administrator',
        'PATCH',
        '/api/inventory/products/health_seed_013',
        'inventory',
        'update',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        20,
        '2026-09-08 22:48:00.654',
        '{\"sku\": \"HEALTH-013\", \"name\": \"Adhesive Bandages — Assorted\", \"unit\": \"box\", \"images\": [], \"status\": \"active\", \"barcode\": \"\", \"brandId\": \"cmtrs5u67000rgs4dx31nwc7v\", \"taxRate\": \"0\", \"recordId\": \"health_seed_013\", \"costPrice\": \"2\", \"categoryId\": \"cmtrqqpi00001gsertl9rn4hf\", \"expiryDate\": \"2026-09-09\", \"discountEnd\": \"\", \"discountType\": null, \"sellingPrice\": \"2.5\", \"discountStart\": \"\", \"discountValue\": \"0\"}'
    ),
    (
        'cmtt9irfp0000gsdf6hsjjpfz',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        235,
        '2026-09-08 22:50:08.870',
        '{\"loginMethod\": \"pin\"}'
    ),
    (
        'cmtt9p0he0000gszu7e2o1w43',
        'cmt8rjfuk001bgsuzytd7r9gq',
        'Super Administrator',
        'POST',
        '/api/auth/login',
        'auth',
        'login',
        200,
        '127.0.0.1',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) NHOERP/0.0.0 Chrome/138.0.7204.251 Electron/37.10.3 Safari/537.36',
        231,
        '2026-09-08 22:55:00.530',
        '{\"loginMethod\": \"pin\"}'
    );
/*!40000 ALTER TABLE `system_AuditLog` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `system_Notification`
--

DROP TABLE IF EXISTS `system_Notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `system_Notification` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `taskId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `readAt` datetime(3) DEFAULT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `warningId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `meetingId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `crmLeadId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `reminderKey` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `body` text COLLATE utf8mb4_unicode_ci,
    `route` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `system_Notification_reminderKey_key` (`reminderKey`),
    KEY `Notification_userId_readAt_createdAt_idx` (
        `userId`,
        `readAt`,
        `createdAt`
    ),
    KEY `Notification_taskId_idx` (`taskId`),
    KEY `Notification_warningId_idx` (`warningId`),
    KEY `Notification_meetingId_idx` (`meetingId`),
    KEY `Notification_crmLeadId_idx` (`crmLeadId`),
    CONSTRAINT `Notification_crmLeadId_fkey` FOREIGN KEY (`crmLeadId`) REFERENCES `crm_CrmLead` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Notification_meetingId_fkey` FOREIGN KEY (`meetingId`) REFERENCES `meetings_Meeting` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Notification_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `tasks_Task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `access_User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `Notification_warningId_fkey` FOREIGN KEY (`warningId`) REFERENCES `hr_Warning` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `system_Notification`
--

LOCK TABLES `system_Notification` WRITE;
/*!40000 ALTER TABLE `system_Notification` DISABLE KEYS */
;
INSERT INTO
    `system_Notification`
VALUES (
        'cmtacymbt0028gsrf793cyqs8',
        'cmt8rjfuk001bgsuzytd7r9gq',
        NULL,
        'warning',
        '2026-08-26 17:18:59.954',
        '2026-08-26 17:18:50.249',
        'cmtacymbp0027gsrfa6xnfck9',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtacymbt0029gsrf1vgb4gaj',
        'cmt8rjfvv001hgsuz8s70rz74',
        NULL,
        'warning',
        '2026-08-29 21:42:04.111',
        '2026-08-26 17:18:50.249',
        'cmtacymbp0027gsrfa6xnfck9',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtacymbt002agsrflgtqxlck',
        'cmt8rjfw2001igsuzj4qwnrgc',
        NULL,
        'warning',
        NULL,
        '2026-08-26 17:18:50.249',
        'cmtacymbp0027gsrfa6xnfck9',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtex30uk0002gsn3z4nw8rbv',
        'cmt8rjfvv001hgsuz8s70rz74',
        NULL,
        'meeting_created',
        '2026-08-29 21:54:42.806',
        '2026-08-29 21:53:12.716',
        NULL,
        'cmtex30uh0001gsn3b6lj1x00',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtex30uk0003gsn3f35oflx7',
        'cmt8rjfw2001igsuzj4qwnrgc',
        NULL,
        'meeting_created',
        NULL,
        '2026-08-29 21:53:12.716',
        NULL,
        'cmtex30uh0001gsn3b6lj1x00',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtg9zgv50002gs08jks1jra0',
        'cmt8rjfvv001hgsuz8s70rz74',
        NULL,
        'meeting_created',
        NULL,
        '2026-08-30 20:42:08.034',
        NULL,
        'cmtg9zgv30001gs08d7tctozw',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtg9zgv50003gs082u733ic3',
        'cmt8rjfw2001igsuzj4qwnrgc',
        NULL,
        'meeting_created',
        NULL,
        '2026-08-30 20:42:08.034',
        NULL,
        'cmtg9zgv30001gs08d7tctozw',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtit6r4d000wgs45ewhjnr3q',
        'cmt8rjfvv001hgsuz8s70rz74',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-01 15:15:12.973',
        NULL,
        'cmtit6r47000vgs45k1dt4hkk',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtit6r4d000xgs458lb3zp7f',
        'cmt8rjfw2001igsuzj4qwnrgc',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-01 15:15:12.973',
        NULL,
        'cmtit6r47000vgs45k1dt4hkk',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtordrvx007dgsudn82cqmh0',
        'cmt8rjfvv001hgsuz8s70rz74',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-05 19:11:18.382',
        NULL,
        'cmtordrvs007cgsudmhyhju2h',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtordrvx007egsudcid0iyhp',
        'cmt8rjfw2001igsuzj4qwnrgc',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-05 19:11:18.382',
        NULL,
        'cmtordrvs007cgsudmhyhju2h',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtordrvx007fgsudg0899xdx',
        'cmtejqldw0025gsq6kslih6ov',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-05 19:11:18.382',
        NULL,
        'cmtordrvs007cgsudmhyhju2h',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtordrvx007ggsudksqta6z7',
        'cmtity5ly002wgs458ggps2wx',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-05 19:11:18.382',
        NULL,
        'cmtordrvs007cgsudmhyhju2h',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtordrvx007hgsudmq11ee6g',
        'cmton6n1p0060gs1bsrbmjaj9',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-05 19:11:18.382',
        NULL,
        'cmtordrvs007cgsudmhyhju2h',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtordrvx007igsudb025eozd',
        'cmton7fr90063gs1bdwokmrc2',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-05 19:11:18.382',
        NULL,
        'cmtordrvs007cgsudmhyhju2h',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtordrvx007jgsud2po5b44z',
        'cmton8vnj0065gs1b2n9rlxwa',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-05 19:11:18.382',
        NULL,
        'cmtordrvs007cgsudmhyhju2h',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtordrvx007kgsuddao7a1zo',
        'cmton9rb50067gs1bfkp5oh89',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-05 19:11:18.382',
        NULL,
        'cmtordrvs007cgsudmhyhju2h',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtordrvx007lgsud94zfjy4n',
        'cmtonb1le006ags1bgt7r1h50',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-05 19:11:18.382',
        NULL,
        'cmtordrvs007cgsudmhyhju2h',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtotp48h0001gsp71ymijre8',
        'cmtejqldw0025gsq6kslih6ov',
        NULL,
        'meeting_reminder',
        NULL,
        '2026-09-05 20:16:06.833',
        NULL,
        'cmtordrvs007cgsudmhyhju2h',
        NULL,
        'meeting:cmtordrvs007cgsudmhyhju2h:cmtejqldw0025gsq6kslih6ov',
        'tyt',
        'Your department has an active meeting.',
        '/meetings'
    ),
    (
        'cmtotp48p0003gsp7rjwi1kvy',
        'cmton6n1p0060gs1bsrbmjaj9',
        NULL,
        'meeting_reminder',
        NULL,
        '2026-09-05 20:16:06.842',
        NULL,
        'cmtordrvs007cgsudmhyhju2h',
        NULL,
        'meeting:cmtordrvs007cgsudmhyhju2h:cmton6n1p0060gs1bsrbmjaj9',
        'tyt',
        'Your department has an active meeting.',
        '/meetings'
    ),
    (
        'cmtotp48v0005gsp7l753qwko',
        'cmton7fr90063gs1bdwokmrc2',
        NULL,
        'meeting_reminder',
        NULL,
        '2026-09-05 20:16:06.848',
        NULL,
        'cmtordrvs007cgsudmhyhju2h',
        NULL,
        'meeting:cmtordrvs007cgsudmhyhju2h:cmton7fr90063gs1bdwokmrc2',
        'tyt',
        'Your department has an active meeting.',
        '/meetings'
    ),
    (
        'cmtotp4920007gsp7q99ez2a7',
        'cmton8vnj0065gs1b2n9rlxwa',
        NULL,
        'meeting_reminder',
        NULL,
        '2026-09-05 20:16:06.855',
        NULL,
        'cmtordrvs007cgsudmhyhju2h',
        NULL,
        'meeting:cmtordrvs007cgsudmhyhju2h:cmton8vnj0065gs1b2n9rlxwa',
        'tyt',
        'Your department has an active meeting.',
        '/meetings'
    ),
    (
        'cmtotp49a0009gsp7xsf9a09a',
        'cmton9rb50067gs1bfkp5oh89',
        NULL,
        'meeting_reminder',
        NULL,
        '2026-09-05 20:16:06.863',
        NULL,
        'cmtordrvs007cgsudmhyhju2h',
        NULL,
        'meeting:cmtordrvs007cgsudmhyhju2h:cmton9rb50067gs1bfkp5oh89',
        'tyt',
        'Your department has an active meeting.',
        '/meetings'
    ),
    (
        'cmtotp49h000bgsp7o8lkzhdc',
        'cmtonb1le006ags1bgt7r1h50',
        NULL,
        'meeting_reminder',
        NULL,
        '2026-09-05 20:16:06.870',
        NULL,
        'cmtordrvs007cgsudmhyhju2h',
        NULL,
        'meeting:cmtordrvs007cgsudmhyhju2h:cmtonb1le006ags1bgt7r1h50',
        'tyt',
        'Your department has an active meeting.',
        '/meetings'
    ),
    (
        'cmtt78dp10003gsxdg8ek675y',
        'cmt8rjfvv001hgsuz8s70rz74',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-08 21:46:05.269',
        NULL,
        'cmtt78dov0002gsxdzpxfm4yo',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtt78dp10004gsxd76xqpcjc',
        'cmt8rjfw2001igsuzj4qwnrgc',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-08 21:46:05.269',
        NULL,
        'cmtt78dov0002gsxdzpxfm4yo',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtt78dp10005gsxdtnjtamrf',
        'cmtejqldw0025gsq6kslih6ov',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-08 21:46:05.269',
        NULL,
        'cmtt78dov0002gsxdzpxfm4yo',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtt78dp10006gsxd2woh4ksa',
        'cmtity5ly002wgs458ggps2wx',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-08 21:46:05.269',
        NULL,
        'cmtt78dov0002gsxdzpxfm4yo',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtt78dp10007gsxdf5hosm2o',
        'cmton6n1p0060gs1bsrbmjaj9',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-08 21:46:05.269',
        NULL,
        'cmtt78dov0002gsxdzpxfm4yo',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtt78dp10008gsxdngtgi1u2',
        'cmton7fr90063gs1bdwokmrc2',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-08 21:46:05.269',
        NULL,
        'cmtt78dov0002gsxdzpxfm4yo',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtt78dp10009gsxda2f3hn83',
        'cmton8vnj0065gs1b2n9rlxwa',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-08 21:46:05.269',
        NULL,
        'cmtt78dov0002gsxdzpxfm4yo',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtt78dp1000agsxdjclhdtpd',
        'cmton9rb50067gs1bfkp5oh89',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-08 21:46:05.269',
        NULL,
        'cmtt78dov0002gsxdzpxfm4yo',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        'cmtt78dp1000bgsxd3l50d0p9',
        'cmtonb1le006ags1bgt7r1h50',
        NULL,
        'meeting_created',
        NULL,
        '2026-09-08 21:46:05.269',
        NULL,
        'cmtt78dov0002gsxdzpxfm4yo',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    );
/*!40000 ALTER TABLE `system_Notification` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `system_Settings`
--

DROP TABLE IF EXISTS `system_Settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `system_Settings` (
    `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `value` json NOT NULL,
    `updatedAt` datetime(3) NOT NULL,
    PRIMARY KEY (`category`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `system_Settings`
--

LOCK TABLES `system_Settings` WRITE;
/*!40000 ALTER TABLE `system_Settings` DISABLE KEYS */
;
INSERT INTO
    `system_Settings`
VALUES (
        'finance',
        '{\"currency\": \"IQD\", \"invoicePrefix\": \"INV\", \"paymentMethods\": [\"cash\", \"card\", \"other\"], \"invoiceNextNumber\": 1}',
        '2026-09-05 20:46:39.426'
    ),
    (
        'healthcare',
        '{\"bookingEnd\": \"17:00\", \"bookingDays\": [0, 1, 2, 3, 4], \"bookingStart\": \"09:00\", \"operatingRooms\": [\"Dental Care\"], \"appointmentMinutes\": 30}',
        '2026-09-05 20:46:29.298'
    ),
    (
        'hr',
        '{\"endTime\": \"17:00\", \"weekends\": [5, 6], \"startTime\": \"09:00\", \"graceMinutes\": 15}',
        '2026-09-05 23:54:22.052'
    ),
    (
        'meetings',
        '{\"audioQuality\": \"high\", \"videoQuality\": \"720p\", \"cameraDefault\": false, \"screenQuality\": \"documents\", \"screenSharing\": true, \"maxVideoQuality\": \"1080p\", \"echoCancellation\": true, \"noiseSuppression\": true, \"participantLimit\": 12, \"microphoneDefault\": false}',
        '2026-09-05 20:56:10.601'
    ),
    (
        'organization',
        '{\"logo\": \"\", \"name\": \"NHO\", \"email\": \"\", \"phone\": \"\", \"address\": \"\", \"branches\": [], \"loadingText\": \"Welcome to NHO\"}',
        '2026-09-08 21:53:09.583'
    );
/*!40000 ALTER TABLE `system_Settings` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `tasks_Task`
--

DROP TABLE IF EXISTS `tasks_Task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `tasks_Task` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `team` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `priority` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
    `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'todo',
    `startDate` datetime(3) DEFAULT NULL,
    `dueDate` datetime(3) DEFAULT NULL,
    `estimatedMinutes` int DEFAULT NULL,
    `completedAt` datetime(3) DEFAULT NULL,
    `createdById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` datetime(3) NOT NULL,
    `reviewNote` text COLLATE utf8mb4_unicode_ci,
    `reviewedAt` datetime(3) DEFAULT NULL,
    `reviewedById` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `Task_status_idx` (`status`),
    KEY `Task_team_idx` (`team`),
    KEY `Task_dueDate_idx` (`dueDate`),
    KEY `Task_createdById_fkey` (`createdById`),
    KEY `Task_reviewedById_fkey` (`reviewedById`),
    CONSTRAINT `Task_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `access_User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `Task_reviewedById_fkey` FOREIGN KEY (`reviewedById`) REFERENCES `access_User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `tasks_Task`
--

LOCK TABLES `tasks_Task` WRITE;
/*!40000 ALTER TABLE `tasks_Task` DISABLE KEYS */
;
INSERT INTO
    `tasks_Task`
VALUES (
        'cmths28qm0021gsslsi0iahjo',
        'Hospital operations coordination meeting',
        'SEED: Coordinate clinical and finance representatives and publish the agreed operational actions.',
        'other',
        'urgent',
        'todo',
        '2026-08-26 08:00:00.000',
        '2026-08-30 16:00:00.000',
        180,
        NULL,
        'cmt8rjfuk001bgsuzytd7r9gq',
        '2026-08-31 21:55:56.734',
        '2026-08-31 21:55:56.734',
        NULL,
        NULL,
        NULL
    );
/*!40000 ALTER TABLE `tasks_Task` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `tasks_TaskAssignee`
--

DROP TABLE IF EXISTS `tasks_TaskAssignee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `tasks_TaskAssignee` (
    `taskId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `assignedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`taskId`, `employeeId`),
    KEY `TaskAssignee_employeeId_idx` (`employeeId`),
    CONSTRAINT `TaskAssignee_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `hr_Employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `TaskAssignee_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `tasks_Task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `tasks_TaskAssignee`
--

LOCK TABLES `tasks_TaskAssignee` WRITE;
/*!40000 ALTER TABLE `tasks_TaskAssignee` DISABLE KEYS */
;
INSERT INTO
    `tasks_TaskAssignee`
VALUES (
        'cmths28qm0021gsslsi0iahjo',
        'cmt8rjfwl001kgsuzbwmza8rr',
        '2026-08-31 21:55:56.734'
    ),
    (
        'cmths28qm0021gsslsi0iahjo',
        'cmt8rjfwt001mgsuza9e8zkde',
        '2026-08-31 21:55:56.734'
    );
/*!40000 ALTER TABLE `tasks_TaskAssignee` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `tasks_TaskAttachment`
--

DROP TABLE IF EXISTS `tasks_TaskAttachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `tasks_TaskAttachment` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `taskId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `fileName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `fileUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `mimeType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `fileSize` int NOT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    KEY `TaskAttachment_taskId_idx` (`taskId`),
    CONSTRAINT `TaskAttachment_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `tasks_Task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `tasks_TaskAttachment`
--

LOCK TABLES `tasks_TaskAttachment` WRITE;
/*!40000 ALTER TABLE `tasks_TaskAttachment` DISABLE KEYS */
;
/*!40000 ALTER TABLE `tasks_TaskAttachment` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `tasks_TaskComment`
--

DROP TABLE IF EXISTS `tasks_TaskComment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `tasks_TaskComment` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `taskId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `authorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    KEY `TaskComment_taskId_idx` (`taskId`),
    KEY `TaskComment_authorId_fkey` (`authorId`),
    CONSTRAINT `TaskComment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `access_User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `TaskComment_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `tasks_Task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `tasks_TaskComment`
--

LOCK TABLES `tasks_TaskComment` WRITE;
/*!40000 ALTER TABLE `tasks_TaskComment` DISABLE KEYS */
;
/*!40000 ALTER TABLE `tasks_TaskComment` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Table structure for table `tasks_TaskTimeEntry`
--

DROP TABLE IF EXISTS `tasks_TaskTimeEntry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `tasks_TaskTimeEntry` (
    `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `taskId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `recordedById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    `workDate` datetime(3) NOT NULL,
    `minutes` int NOT NULL,
    `note` text COLLATE utf8mb4_unicode_ci,
    `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    KEY `TaskTimeEntry_taskId_idx` (`taskId`),
    KEY `TaskTimeEntry_employeeId_workDate_idx` (`employeeId`, `workDate`),
    KEY `TaskTimeEntry_recordedById_fkey` (`recordedById`),
    CONSTRAINT `TaskTimeEntry_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `hr_Employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `TaskTimeEntry_recordedById_fkey` FOREIGN KEY (`recordedById`) REFERENCES `access_User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `TaskTimeEntry_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `tasks_Task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `tasks_TaskTimeEntry`
--

LOCK TABLES `tasks_TaskTimeEntry` WRITE;
/*!40000 ALTER TABLE `tasks_TaskTimeEntry` DISABLE KEYS */
;
/*!40000 ALTER TABLE `tasks_TaskTimeEntry` ENABLE KEYS */
;
UNLOCK TABLES;

--
-- Dumping events for database 'nho_erp'
--

--
-- Dumping routines for database 'nho_erp'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */
;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */
;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */
;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */
;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */
;

-- Dump completed on 2026-09-09  2:11:28