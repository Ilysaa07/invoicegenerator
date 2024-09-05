-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 05, 2024 at 08:51 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `invoice_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `bankName` varchar(255) DEFAULT NULL,
  `bankAccount` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `clientName` varchar(255) DEFAULT NULL,
  `clientAddress` varchar(255) DEFAULT NULL,
  `invoiceNumber` varchar(255) DEFAULT NULL,
  `invoiceDate` date DEFAULT NULL,
  `dueDate` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `tax` decimal(10,2) DEFAULT NULL,
  `shipping` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `name`, `address`, `email`, `phone`, `bankName`, `bankAccount`, `website`, `clientName`, `clientAddress`, `invoiceNumber`, `invoiceDate`, `dueDate`, `notes`, `discount`, `tax`, `shipping`) VALUES
(16, 'BASO', 'UDEN', 'BASOUDEN@GMAIL.COM', '0888888121', 'BCA', '09838333', 'FB.COM', 'beno', 'CAHYO', '445588', '2024-09-24', '2024-10-09', 'WELL', 10.00, 20.00, 100000.00),
(18, 'BASO', 'IKAN', 'BASOUDEN@GMAIL.COM', '0888888121', 'BCA', '09838333', 'FB.COMMMMMM', 'BASO IKAN', 'CAHYO', '445588', '2024-09-23', '2024-10-08', 'WELL', 10.00, 20.00, 100000.00);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_rows`
--

CREATE TABLE `invoice_rows` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_rows`
--

INSERT INTO `invoice_rows` (`id`, `invoice_id`, `description`, `quantity`, `price`, `amount`) VALUES
(32, 16, 'test', 11, 1210.00, 13310.00),
(34, 18, 'test', 11, 1210.00, 13310.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_rows`
--
ALTER TABLE `invoice_rows`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `invoice_rows`
--
ALTER TABLE `invoice_rows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `invoice_rows`
--
ALTER TABLE `invoice_rows`
  ADD CONSTRAINT `invoice_rows_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
