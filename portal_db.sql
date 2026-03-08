-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 07, 2026 at 05:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `portal_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `classCode` varchar(255) NOT NULL,
  `studentId` varchar(255) NOT NULL,
  `status` enum('present','absent') NOT NULL DEFAULT 'present',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `date`, `classCode`, `studentId`, `status`, `createdAt`, `updatedAt`) VALUES
(1, '2026-01-21', '10A', '824722', 'present', '2026-01-21 15:56:27', '2026-01-21 15:56:27'),
(2, '2026-01-21', '10A', '274869', 'present', '2026-01-21 15:56:27', '2026-01-21 15:56:27'),
(3, '2026-01-21', '10A', '220416', 'present', '2026-01-21 15:56:27', '2026-01-21 15:56:27'),
(4, '2026-01-27', '10A', '824722', 'absent', '2026-01-27 05:04:31', '2026-01-27 05:04:31'),
(5, '2026-01-27', '10A', '274869', 'present', '2026-01-27 05:04:31', '2026-01-27 05:04:31'),
(6, '2026-01-27', '10A', '220416', 'present', '2026-01-27 05:04:31', '2026-01-27 05:04:31');

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `year` varchar(255) NOT NULL DEFAULT '2024-25',
  `students` int(11) DEFAULT 0,
  `faculty` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `name`, `code`, `year`, `students`, `faculty`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, '10th Grade A', '10A', '2024-25', 0, 'Mr. Smith', 1, '2026-01-18 14:03:58', '2026-01-18 14:03:58'),
(2, '10th Grade B', '10B', '2024-25', 0, 'Ms. Johnson', 1, '2026-01-18 14:03:58', '2026-01-18 14:03:58'),
(3, '11th Grade A', '11A', '2024-25', 0, 'Mr. Davis', 1, '2026-01-18 14:03:58', '2026-01-18 14:03:58'),
(4, '12th Grade A', '12A', '2024-25', 0, 'Ms. Wilson', 1, '2026-01-18 14:03:58', '2026-01-18 14:03:58');

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `class` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` varchar(255) NOT NULL,
  `status` enum('upcoming','completed','cancelled') DEFAULT 'upcoming',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`id`, `name`, `class`, `subject`, `date`, `time`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Mid-Term Exam', '10th Grade A', 'Mathematics', '2025-01-15', '10:00 AM', 'upcoming', '2026-01-28 16:09:12', '2026-01-28 16:09:12'),
(2, 'Unit Test 1', '11th Grade B', 'Physics', '2025-01-16', '11:00 AM', 'upcoming', '2026-01-28 16:09:12', '2026-01-28 16:09:12'),
(3, 'Final Exam', '12th Grade A', 'Chemistry', '2024-12-20', '09:00 AM', 'completed', '2026-01-28 16:09:12', '2026-01-28 16:09:12'),
(4, 'mid2', '10th Grade A', 'english', '2026-01-31', '10:00', 'upcoming', '2026-01-28 16:25:30', '2026-01-28 16:25:30');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `description` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE `faculty` (
  `id` int(11) NOT NULL,
  `facultyId` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `subjects` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`subjects`)),
  `classes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`classes`)),
  `salary` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `joiningDate` date DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`id`, `facultyId`, `name`, `email`, `phone`, `subjects`, `classes`, `salary`, `address`, `joiningDate`, `createdAt`, `updatedAt`) VALUES
(1, 'FAC001', 'Mr. John Smith', 'john.smith@acadexa.com', '+91 98765 11111', '[\"Mathematics\",\"Physics\"]', '[\"10th Grade A\",\"11th Grade A\"]', '₹50,000/month', NULL, NULL, '2026-01-28 16:09:12', '2026-01-28 16:09:12'),
(2, 'FAC002', 'Ms. Sarah Johnson', 'sarah.j@acadexa.com', '+91 98765 22222', '[\"English\",\"Literature\"]', '[\"10th Grade B\",\"12th Grade A\"]', '₹48,000/month', NULL, NULL, '2026-01-28 16:09:12', '2026-01-28 16:09:12'),
(3, 'FAC003', 'Mr. Robert Davis', 'robert.d@acadexa.com', '+91 98765 33333', '[\"Chemistry\",\"Biology\"]', '[\"11th Grade A\",\"12th Grade A\"]', '₹52,000/month', NULL, NULL, '2026-01-28 16:09:12', '2026-01-28 16:09:12');

-- --------------------------------------------------------

--
-- Table structure for table `fee_structures`
--

CREATE TABLE `fee_structures` (
  `id` int(11) NOT NULL,
  `class` varchar(255) NOT NULL,
  `totalFees` decimal(10,2) NOT NULL,
  `academicYear` varchar(255) DEFAULT '2025-2026',
  `installments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`installments`)),
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fee_structures`
--

INSERT INTO `fee_structures` (`id`, `class`, `totalFees`, `academicYear`, `installments`, `notes`, `createdAt`, `updatedAt`) VALUES
(1, '10th Grade A', 50000.00, '2025-2026', '[{\"id\":1,\"amount\":20000,\"dueDate\":\"2025-04-01\"},{\"id\":2,\"amount\":15000,\"dueDate\":\"2025-08-01\"},{\"id\":3,\"amount\":15000,\"dueDate\":\"2025-12-01\"}]', NULL, '2026-01-28 16:09:12', '2026-01-28 16:09:12'),
(2, '10th Grade A', 140000.00, '2025-2026', '[{\"id\":1,\"amount\":\"70000\",\"dueDate\":\"2026-02-16\"}]', '', '2026-02-15 14:49:11', '2026-02-15 14:49:11');

-- --------------------------------------------------------

--
-- Table structure for table `incomes`
--

CREATE TABLE `incomes` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `description` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inquiries`
--

CREATE TABLE `inquiries` (
  `id` int(11) NOT NULL,
  `studentName` varchar(255) NOT NULL,
  `studentMobile` varchar(255) NOT NULL,
  `fatherMobile` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `schoolName` varchar(255) NOT NULL,
  `percentage` varchar(255) DEFAULT NULL,
  `std` varchar(255) NOT NULL,
  `medium` varchar(255) DEFAULT NULL,
  `group` varchar(255) DEFAULT NULL,
  `referenceBy` varchar(255) DEFAULT NULL,
  `interestLevel` enum('High','Medium','Low') DEFAULT 'Medium',
  `status` enum('new','in-progress','converted') DEFAULT 'new',
  `followUpDate` date DEFAULT NULL,
  `followUpTime` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `followUps` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`followUps`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inquiries`
--

INSERT INTO `inquiries` (`id`, `studentName`, `studentMobile`, `fatherMobile`, `email`, `schoolName`, `percentage`, `std`, `medium`, `group`, `referenceBy`, `interestLevel`, `status`, `followUpDate`, `followUpTime`, `notes`, `followUps`, `createdAt`, `updatedAt`) VALUES
(1, 'Test Student', '1234567890', '0987654321', NULL, 'Test School', '85', '10', 'English', 'Science', 'Test', 'High', 'in-progress', '2025-01-01', NULL, 'Test note', '[]', '2026-01-28 14:23:03', '2026-02-03 17:45:15');

-- --------------------------------------------------------

--
-- Table structure for table `marks`
--

CREATE TABLE `marks` (
  `id` int(11) NOT NULL,
  `studentId` varchar(255) NOT NULL,
  `studentName` varchar(255) DEFAULT NULL,
  `class` varchar(255) NOT NULL,
  `examId` int(11) DEFAULT NULL,
  `examName` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `marksObtained` float NOT NULL DEFAULT 0,
  `maxMarks` float NOT NULL DEFAULT 100,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `marks`
--

INSERT INTO `marks` (`id`, `studentId`, `studentName`, `class`, `examId`, `examName`, `subject`, `marksObtained`, `maxMarks`, `createdAt`, `updatedAt`) VALUES
(1, 'STU001', 'John Doe', '10th Grade A', NULL, 'Mid-Term Exam', 'Mathematics', 85, 100, '2026-01-28 16:09:12', '2026-01-28 16:09:12'),
(2, 'STU002', 'Jane Smith', '10th Grade A', NULL, 'Mid-Term Exam', 'Mathematics', 92, 100, '2026-01-28 16:09:12', '2026-01-28 16:09:12'),
(3, 'STU003', 'Mike Johnson', '10th Grade A', NULL, 'Mid-Term Exam', 'Mathematics', 78, 100, '2026-01-28 16:09:12', '2026-01-28 16:09:12'),
(4, 'STU004', 'Sarah Williams', '10th Grade A', NULL, 'Mid-Term Exam', 'Mathematics', 95, 100, '2026-01-28 16:16:55', '2026-01-28 16:16:55');

-- --------------------------------------------------------

--
-- Table structure for table `notices`
--

CREATE TABLE `notices` (
  `id` int(11) NOT NULL,
  `message` text NOT NULL,
  `recipientType` enum('student','faculty','all') NOT NULL,
  `targetClass` varchar(255) DEFAULT NULL,
  `postedBy` varchar(255) DEFAULT 'Admin',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notices`
--

INSERT INTO `notices` (`id`, `message`, `recipientType`, `targetClass`, `postedBy`, `createdAt`, `updatedAt`) VALUES
(1, 'meeting on 5 feb', 'student', '10th Grade A', 'Admin', '2026-02-02 06:49:26', '2026-02-02 06:49:26');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `classCode` varchar(255) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `joiningDate` date NOT NULL,
  `guardianName` varchar(255) NOT NULL,
  `guardianPhone` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive','graduated') DEFAULT 'active',
  `attendance` varchar(255) DEFAULT '0%',
  `marks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`marks`)),
  `fees` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`fees`)),
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `middleName` varchar(255) DEFAULT NULL,
  `uid` varchar(255) DEFAULT NULL,
  `aadharCard` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `firstName`, `lastName`, `email`, `phone`, `classCode`, `dateOfBirth`, `gender`, `joiningDate`, `guardianName`, `guardianPhone`, `address`, `city`, `status`, `attendance`, `marks`, `fees`, `isActive`, `createdAt`, `updatedAt`, `middleName`, `uid`, `aadharCard`) VALUES
('120958', 'marwadi', 'blah blah', 'mu@gmail.com', '7777777777', '10A', '1999-02-16', 'female', '2026-02-15', 'abc', 'xyz', 'hmm', 'rjkt', 'active', '0%', '[]', '{\"total\":10000,\"paid\":2000,\"pending\":8000}', 1, '2026-02-15 10:40:43', '2026-02-15 16:37:03', 'university', '', ''),
('166445', 'marwadi', 'university', 'mu1@gmail.com', '7777777777', '10A', '2026-02-12', 'female', '2026-02-15', 'abc', 'xyz', 'mmm', 'rjkt', 'active', '0%', '[]', '{\"total\":0,\"paid\":0,\"pending\":0}', 1, '2026-02-15 16:44:00', '2026-02-15 16:44:00', '', '', ''),
('220416', 'John', 'Doe', 'john@example.com', '+91 98765 43210', '10A', '2007-05-15', 'male', '2024-04-15', 'Robert Doe', '+91 98765 43200', '123 Main St', 'Mumbai', 'active', '92%', '[{\"subject\":\"Mathematics\",\"marks\":85,\"grade\":\"A\",\"maxMarks\":100},{\"subject\":\"Physics\",\"marks\":78,\"grade\":\"B+\",\"maxMarks\":100},{\"subject\":\"Chemistry\",\"marks\":82,\"grade\":\"A-\",\"maxMarks\":100},{\"subject\":\"English\",\"marks\":90,\"grade\":\"A+\",\"maxMarks\":100},{\"subject\":\"Computer Science\",\"marks\":88,\"grade\":\"A\",\"maxMarks\":100}]', '{\"total\":5000,\"paid\":10000,\"pending\":-5000}', 1, '2026-01-18 14:24:17', '2026-02-15 16:24:26', NULL, NULL, NULL),
('274869', 'Vaibhavi', 'Lashkari', 'vaibhavi@gmail.com', '9999998989', '10A', '2004-04-20', 'female', '2026-01-20', 'XYZ', '8989898989', 'aaa', 'rajkot', 'active', '0%', '[]', '{\"total\":5000,\"paid\":10000,\"pending\":-5000}', 1, '2026-01-20 14:57:55', '2026-02-15 16:24:26', NULL, NULL, NULL),
('533041', 'amazon', 'z', 'amazon@gmail.com', '1111111111', '11A', '2003-01-21', 'male', '2026-01-21', 'XYZ', '8989898989', 'online', 'US', 'active', '0%', '[]', '{\"total\":50000,\"paid\":0,\"pending\":50000}', 1, '2026-01-21 06:33:58', '2026-03-07 15:57:02', 'a', '', ''),
('824722', 'taylor', 'swift', 'ts@gmail.com', '8989898989', '10A', '2000-10-08', 'female', '2026-01-21', 'XYZ', '8989898989', 'america', 'US', 'active', '0%', '[]', '{\"total\":5000,\"paid\":10000,\"pending\":-5000}', 1, '2026-01-21 07:06:05', '2026-02-15 16:24:26', 'a', '', ''),
('916461', 'Jane', 'Smith', 'jane@example.com', '+91 98765 43211', '10B', '2007-06-20', 'female', '2024-04-16', 'Mary Smith', '+91 98765 43201', '456 Oak Ave', 'Mumbai', 'active', '95%', '[{\"subject\":\"Mathematics\",\"marks\":92,\"grade\":\"A+\",\"maxMarks\":100},{\"subject\":\"Physics\",\"marks\":88,\"grade\":\"A\",\"maxMarks\":100},{\"subject\":\"Chemistry\",\"marks\":90,\"grade\":\"A+\",\"maxMarks\":100},{\"subject\":\"English\",\"marks\":95,\"grade\":\"A+\",\"maxMarks\":100},{\"subject\":\"Computer Science\",\"marks\":91,\"grade\":\"A+\",\"maxMarks\":100}]', '{\"total\":50000,\"paid\":25000,\"pending\":25000}', 1, '2026-01-18 14:24:17', '2026-02-15 14:52:46', NULL, NULL, NULL),
('965470', 'vaibhavi', 'Lashkari', 'vaibhavi1@gmail.com', '8160361224', '10A', '2003-04-06', 'female', '2026-02-15', 'abc', '1231231234', 'aaa', 'rjkt', 'active', '0%', '[]', '{\"total\":5000,\"paid\":0,\"pending\":5000}', 1, '2026-02-15 16:29:12', '2026-03-07 16:09:53', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `study_materials`
--

CREATE TABLE `study_materials` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `class` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `fileUrl` varchar(255) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `version` varchar(255) DEFAULT 'v1.0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `study_materials`
--

INSERT INTO `study_materials` (`id`, `title`, `class`, `subject`, `fileName`, `fileUrl`, `size`, `version`, `createdAt`, `updatedAt`) VALUES
(1, 'Mathematics Chapter 1 - Sets', '10th Grade A', 'Mathematics', 'math_chapter1.pdf', NULL, '2.5 MB', 'v1.0', '2026-01-28 16:09:12', '2026-01-28 16:09:12'),
(2, 'Physics - Motion Notes', '11th Grade A', 'Physics', 'physics_motion.pdf', NULL, '3.1 MB', 'v1.0', '2026-01-28 16:09:12', '2026-01-28 16:09:12');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus`
--

CREATE TABLE `syllabus` (
  `id` int(11) NOT NULL,
  `class` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `faculty` varchar(255) DEFAULT NULL,
  `chapters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`chapters`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syllabus`
--

INSERT INTO `syllabus` (`id`, `class`, `subject`, `faculty`, `chapters`, `createdAt`, `updatedAt`) VALUES
(1, '10th Grade A', 'Mathematics', 'Ms. Johnson', '[{\"0\":\"[\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"{\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"\\\"\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"i\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"d\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"\\\"\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\":\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"1\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"7\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"6\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"9\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"6\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"7\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"1\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"7\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"7\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"6\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"2\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"0\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"8\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\",\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"\\\"\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"t\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"i\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"t\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"l\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"e\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"\\\"\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\":\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"\\\"\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"N\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"e\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"w\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\" \",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"C\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"h\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"a\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"p\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"t\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"e\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"r\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"\\\"\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\",\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"\\\"\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"t\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"o\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"p\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"i\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"c\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"s\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"\\\"\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\":\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"[\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"{\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"\\\"\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"i\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"d\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"\\\"\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\":\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"1\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"7\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"6\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"9\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"6\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"7\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"1\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"7\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"7\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"7\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"7\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"5\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"7\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\",\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"\\\"\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"t\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"i\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"t\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"l\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"e\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"\\\"\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\":\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"\\\"\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"i\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"n\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"t\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"r\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"o\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"\\\"\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\",\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"\\\"\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"c\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"o\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"m\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"p\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"l\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"e\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"t\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"e\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"d\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"\\\"\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\":\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"t\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"r\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"u\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"e\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"}\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"]\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"}\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"0\":\"]\",\"topics\":[{\"id\":1769753425935,\"title\":\"intro\",\"completed\":false}]},{\"id\":1769753420094,\"title\":\"New Chapter\",\"topics\":[]}]', '2026-01-29 07:29:49', '2026-01-30 06:10:47'),
(2, '10th Grade A', 'English', 'Dr. Smith', '[{\"id\":1769689980434,\"title\":\"New Chapter\",\"topics\":[{\"id\":1769689982306,\"title\":\"intro\",\"completed\":true},{\"id\":1769690027503,\"title\":\"sums\",\"completed\":true}]}]', '2026-01-29 12:33:12', '2026-01-29 12:33:55');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `dueDate` date NOT NULL,
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `status` enum('pending','completed') DEFAULT 'pending',
  `assignedTo` varchar(255) DEFAULT 'Self',
  `createdBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `description`, `dueDate`, `priority`, `status`, `assignedTo`, `createdBy`, `createdAt`, `updatedAt`) VALUES
(1, 'test', '', '2026-01-31', 'medium', 'pending', 'Self', 'Admin', '2026-01-28 15:56:13', '2026-01-28 15:56:13'),
(2, 'assign', 'eod', '2026-02-05', 'high', 'pending', 'Faculty: Dr. Smith', 'Admin', '2026-02-02 06:48:21', '2026-02-02 06:48:21');

-- --------------------------------------------------------

--
-- Table structure for table `timetables`
--

CREATE TABLE `timetables` (
  `id` int(11) NOT NULL,
  `class` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL,
  `monday` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`monday`)),
  `tuesday` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tuesday`)),
  `wednesday` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`wednesday`)),
  `thursday` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`thursday`)),
  `friday` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`friday`)),
  `saturday` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`saturday`)),
  `sunday` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sunday`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `timetables`
--

INSERT INTO `timetables` (`id`, `class`, `time`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`, `createdAt`, `updatedAt`) VALUES
(1, '10th Grade A', '09:00 AM', '{\"subject\":\"Mathematics\",\"faculty\":\"Mr. John Smith\"}', '{\"subject\":\"Physics\",\"faculty\":\"Mr. John Smith\"}', '{\"subject\":\"Chemistry\",\"faculty\":\"Mr. Robert Davis\"}', '{\"subject\":\"English\",\"faculty\":\"Ms. Sarah Johnson\"}', '{\"subject\":\"Biology\",\"faculty\":\"Mr. Robert Davis\"}', NULL, NULL, '2026-01-28 16:09:12', '2026-01-28 16:09:12'),
(2, '10th Grade A', '10:30 AM', '{\"subject\":\"Physics\",\"faculty\":\"Mr. John Smith\"}', '{\"subject\":\"Mathematics\",\"faculty\":\"Mr. John Smith\"}', '{\"subject\":\"English\",\"faculty\":\"Ms. Sarah Johnson\"}', '{\"subject\":\"Chemistry\",\"faculty\":\"Mr. Robert Davis\"}', '{\"subject\":\"Mathematics\",\"faculty\":\"Mr. John Smith\"}', NULL, NULL, '2026-01-28 16:09:12', '2026-01-28 16:09:12'),
(2147483647, 'Test Class', '09:00 AM', '{\"subject\":\"Math\",\"faculty\":\"Dr. Smith\"}', '{\"subject\":\"Physics\",\"faculty\":\"Ms. Johnson\"}', '{\"subject\":\"Chemistry\",\"faculty\":\"Mr. Williams\"}', '{\"subject\":\"Biology\",\"faculty\":\"Mrs. Brown\"}', '{\"subject\":\"English\",\"faculty\":\"Mr. Jones\"}', '\"\"', '\"\"', '2026-02-15 11:14:25', '2026-02-15 11:14:25');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','faculty','student') NOT NULL DEFAULT 'student',
  `profileId` int(11) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `profileId`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'admin@acadexa.com', '$2a$10$.epx58Y48v1DHOJTPsZltemR/UTKWOeVUKQExSp2Vwk5tOSdG3Nv2', 'admin', NULL, 1, '2026-01-17 15:54:02', '2026-01-17 15:54:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `attendance_date_student_id` (`date`,`studentId`),
  ADD KEY `attendance_class_code_date` (`classCode`,`date`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `code_2` (`code`),
  ADD UNIQUE KEY `code_3` (`code`),
  ADD UNIQUE KEY `code_4` (`code`),
  ADD UNIQUE KEY `code_5` (`code`),
  ADD UNIQUE KEY `code_6` (`code`),
  ADD UNIQUE KEY `code_7` (`code`),
  ADD UNIQUE KEY `code_8` (`code`),
  ADD UNIQUE KEY `code_9` (`code`),
  ADD UNIQUE KEY `code_10` (`code`),
  ADD UNIQUE KEY `code_11` (`code`),
  ADD UNIQUE KEY `code_12` (`code`),
  ADD UNIQUE KEY `code_13` (`code`),
  ADD UNIQUE KEY `code_14` (`code`),
  ADD UNIQUE KEY `code_15` (`code`),
  ADD UNIQUE KEY `code_16` (`code`),
  ADD UNIQUE KEY `code_17` (`code`),
  ADD UNIQUE KEY `code_18` (`code`),
  ADD UNIQUE KEY `code_19` (`code`),
  ADD UNIQUE KEY `code_20` (`code`),
  ADD UNIQUE KEY `code_21` (`code`),
  ADD UNIQUE KEY `code_22` (`code`),
  ADD UNIQUE KEY `code_23` (`code`),
  ADD UNIQUE KEY `code_24` (`code`),
  ADD UNIQUE KEY `code_25` (`code`),
  ADD UNIQUE KEY `code_26` (`code`),
  ADD UNIQUE KEY `code_27` (`code`),
  ADD UNIQUE KEY `code_28` (`code`),
  ADD UNIQUE KEY `code_29` (`code`),
  ADD UNIQUE KEY `code_30` (`code`),
  ADD UNIQUE KEY `code_31` (`code`),
  ADD UNIQUE KEY `code_32` (`code`),
  ADD UNIQUE KEY `code_33` (`code`),
  ADD UNIQUE KEY `code_34` (`code`),
  ADD UNIQUE KEY `code_35` (`code`),
  ADD UNIQUE KEY `code_36` (`code`),
  ADD UNIQUE KEY `code_37` (`code`),
  ADD UNIQUE KEY `code_38` (`code`),
  ADD UNIQUE KEY `code_39` (`code`),
  ADD UNIQUE KEY `code_40` (`code`),
  ADD UNIQUE KEY `code_41` (`code`),
  ADD UNIQUE KEY `code_42` (`code`),
  ADD UNIQUE KEY `code_43` (`code`),
  ADD UNIQUE KEY `code_44` (`code`),
  ADD UNIQUE KEY `code_45` (`code`),
  ADD UNIQUE KEY `code_46` (`code`),
  ADD UNIQUE KEY `code_47` (`code`),
  ADD UNIQUE KEY `code_48` (`code`),
  ADD UNIQUE KEY `code_49` (`code`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faculty`
--
ALTER TABLE `faculty`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`),
  ADD UNIQUE KEY `email_36` (`email`),
  ADD UNIQUE KEY `email_37` (`email`),
  ADD UNIQUE KEY `email_38` (`email`),
  ADD UNIQUE KEY `email_39` (`email`),
  ADD UNIQUE KEY `email_40` (`email`),
  ADD UNIQUE KEY `email_41` (`email`),
  ADD UNIQUE KEY `email_42` (`email`),
  ADD UNIQUE KEY `email_43` (`email`),
  ADD UNIQUE KEY `email_44` (`email`),
  ADD UNIQUE KEY `email_45` (`email`),
  ADD UNIQUE KEY `email_46` (`email`),
  ADD UNIQUE KEY `email_47` (`email`);

--
-- Indexes for table `fee_structures`
--
ALTER TABLE `fee_structures`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `incomes`
--
ALTER TABLE `incomes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `marks`
--
ALTER TABLE `marks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notices`
--
ALTER TABLE `notices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`),
  ADD UNIQUE KEY `email_36` (`email`),
  ADD UNIQUE KEY `email_37` (`email`),
  ADD UNIQUE KEY `email_38` (`email`),
  ADD UNIQUE KEY `email_39` (`email`),
  ADD UNIQUE KEY `email_40` (`email`),
  ADD UNIQUE KEY `email_41` (`email`),
  ADD UNIQUE KEY `email_42` (`email`),
  ADD UNIQUE KEY `email_43` (`email`),
  ADD UNIQUE KEY `email_44` (`email`),
  ADD UNIQUE KEY `email_45` (`email`),
  ADD UNIQUE KEY `email_46` (`email`),
  ADD UNIQUE KEY `email_47` (`email`),
  ADD UNIQUE KEY `email_48` (`email`),
  ADD UNIQUE KEY `email_49` (`email`),
  ADD UNIQUE KEY `email_50` (`email`),
  ADD UNIQUE KEY `email_51` (`email`),
  ADD UNIQUE KEY `email_52` (`email`),
  ADD UNIQUE KEY `email_53` (`email`),
  ADD UNIQUE KEY `email_54` (`email`),
  ADD UNIQUE KEY `email_55` (`email`),
  ADD KEY `students_email` (`email`),
  ADD KEY `students_class` (`classCode`),
  ADD KEY `students_status` (`status`),
  ADD KEY `students_class_code` (`classCode`);

--
-- Indexes for table `study_materials`
--
ALTER TABLE `study_materials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `syllabus`
--
ALTER TABLE `syllabus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `timetables`
--
ALTER TABLE `timetables`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`),
  ADD UNIQUE KEY `email_36` (`email`),
  ADD UNIQUE KEY `email_37` (`email`),
  ADD UNIQUE KEY `email_38` (`email`),
  ADD UNIQUE KEY `email_39` (`email`),
  ADD UNIQUE KEY `email_40` (`email`),
  ADD UNIQUE KEY `email_41` (`email`),
  ADD UNIQUE KEY `email_42` (`email`),
  ADD UNIQUE KEY `email_43` (`email`),
  ADD UNIQUE KEY `email_44` (`email`),
  ADD UNIQUE KEY `email_45` (`email`),
  ADD UNIQUE KEY `email_46` (`email`),
  ADD UNIQUE KEY `email_47` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faculty`
--
ALTER TABLE `faculty`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `fee_structures`
--
ALTER TABLE `fee_structures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `incomes`
--
ALTER TABLE `incomes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inquiries`
--
ALTER TABLE `inquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `marks`
--
ALTER TABLE `marks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `notices`
--
ALTER TABLE `notices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `study_materials`
--
ALTER TABLE `study_materials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `syllabus`
--
ALTER TABLE `syllabus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `timetables`
--
ALTER TABLE `timetables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2147483648;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
