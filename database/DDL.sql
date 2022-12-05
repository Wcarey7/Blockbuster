-- phpMyAdmin SQL Dump
-- version 5.2.0-1.el7.remi
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 02, 2022 at 04:55 AM
-- Server version: 10.6.10-MariaDB-log
-- PHP Version: 7.4.33

-- Group 77
-- Wade Carey
-- Andrew Sabin

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_careyw`
--


DROP TABLE IF EXISTS `Available_Rentals`;
DROP TABLE IF EXISTS `Ordered_Movies`;
DROP TABLE IF EXISTS `Orders`;
DROP TABLE IF EXISTS `Customers`;
DROP TABLE IF EXISTS `Locations`;
DROP TABLE IF EXISTS `Movies`;


-- --------------------------------------------------------

--
-- Table structure for table `Available_Rentals`
--

CREATE TABLE `Available_Rentals` (
  `avail_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `avail_copies` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Available_Rentals`
--

INSERT INTO `Available_Rentals` (`avail_id`, `movie_id`, `location_id`, `avail_copies`) VALUES
(1, 5, 2, 2),
(2, 1, 1, 2),
(3, 1, 2, 3),
(4, 2, 3, 1),
(5, 6, 1, 1),
(6, 4, 4, 3),
(7, 8, 4, 3),
(8, 7, 3, 1),
(9, 3, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Customers`
--

CREATE TABLE `Customers` (
  `customer_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `customer_street` varchar(255) DEFAULT NULL,
  `customer_city` varchar(45) DEFAULT NULL,
  `customer_state` char(2) DEFAULT NULL,
  `customer_zip` int(5) DEFAULT NULL,
  `customer_phone_number` varchar(12) DEFAULT NULL,
  `customer_active_rentals` int(2) DEFAULT 0,
  `customer_total_rentals` int(2) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Customers`
--

INSERT INTO `Customers` (`customer_id`, `first_name`, `last_name`, `customer_street`, `customer_city`, `customer_state`, `customer_zip`, `customer_phone_number`, `customer_active_rentals`, `customer_total_rentals`) VALUES
(1, 'Wade', 'Carey', '1447 4th St', 'Santa Monica', 'CA', 90401, '310-260-1423', 2, 3),
(2, 'Andrew', 'Sabin', '4489 5th St', 'Albany', 'OR', 90402, '928-134-4736', 4, 6),
(3, 'John', 'Smith', '1806 Couch St', 'Portland', 'OR', 97209, '503-719-6456', 3, 5),
(4, 'Jane', 'Doe', '1126 Queens Hwy', 'Long Beach', 'CA', 90802, '877-342-0738', 2, 4),
(5, 'Ash', 'Williams', '635 NE Water Ave', 'Albany', 'OR', 97321, '541-928-7699', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `Locations`
--

CREATE TABLE `Locations` (
  `location_id` int(11) NOT NULL,
  `location_street` varchar(255) DEFAULT NULL,
  `location_city` varchar(255) DEFAULT NULL,
  `location_state` char(2) DEFAULT NULL,
  `location_zip` int(5) DEFAULT NULL,
  `location_phone_number` varchar(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Locations`
--

INSERT INTO `Locations` (`location_id`, `location_street`, `location_city`, `location_state`, `location_zip`, `location_phone_number`) VALUES
(1, '123 Fake St', 'Lancaster', 'CA', 93536, '661-943-3967'),
(2, '1308 Brand Blvd', 'Glendale', 'CA', 91204, '818-396-3900'),
(3, '1933 W Burnside St', 'Portland', 'OR', 97209, '503-265-8512'),
(4, '3130 Killdeer Ave', 'Albany', 'OR', 97322, '541-918-7043');

-- --------------------------------------------------------

--
-- Table structure for table `Movies`
--

CREATE TABLE `Movies` (
  `movie_id` int(11) NOT NULL,
  `movie_title` varchar(255) NOT NULL,
  `release_date` year(4) DEFAULT NULL,
  `genre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Movies`
--

INSERT INTO `Movies` (`movie_id`, `movie_title`, `release_date`, `genre`) VALUES
(1, 'The Thing', 1982, 'Horror'),
(2, 'Speed', 1994, 'Action'),
(3, 'Fight Club', 1999, 'Drama'),
(4, 'Knives Out', 2019, 'Thriller'),
(5, 'Joker', 2019, 'Drama'),
(6, 'Prey', 2022, 'Action'),
(7, 'Tropic Thunder', 2008, 'Comedy'),
(8, 'Get Out', 2017, 'Horror');

-- --------------------------------------------------------

--
-- Table structure for table `Ordered_Movies`
--

CREATE TABLE `Ordered_Movies` (
  `ordered_movies_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Ordered_Movies`
--

INSERT INTO `Ordered_Movies` (`ordered_movies_id`, `order_id`, `movie_id`, `quantity`) VALUES
(1, 1, 5, 1),
(2, 2, 1, 1),
(3, 3, 6, 1),
(4, 4, 4, 1),
(5, 4, 8, 2),
(6, 5, 7, 1),
(7, 6, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Orders`
--

CREATE TABLE `Orders` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `order_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  `over_due` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `Orders`
--

INSERT INTO `Orders` (`order_id`, `customer_id`, `location_id`, `order_date`, `return_date`, `over_due`) VALUES
(1, 4, 2, '2022-10-10', '2022-10-17', 1),
(2, 1, 2, '2022-10-11', '2022-10-18', 0),
(3, 1, 1, '2022-10-13', '2022-10-20', 0),
(4, 2, 4, '2022-10-18', '2022-10-25', 0),
(5, 3, 3, '2022-10-19', '2022-10-26', 0),
(6, 4, 2, '2022-10-20', '2022-10-27', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Available_Rentals`
--
ALTER TABLE `Available_Rentals`
  ADD PRIMARY KEY (`avail_id`),
  ADD UNIQUE KEY `avail_id_UNIQUE` (`avail_id`),
  ADD KEY `fk_Available_Rentals_Movies1_idx` (`movie_id`),
  ADD KEY `fk_Available_Rentals_Locations1_idx` (`location_id`);

--
-- Indexes for table `Customers`
--
ALTER TABLE `Customers`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `Locations`
--
ALTER TABLE `Locations`
  ADD PRIMARY KEY (`location_id`),
  ADD UNIQUE KEY `location_id_UNIQUE` (`location_id`);

--
-- Indexes for table `Movies`
--
ALTER TABLE `Movies`
  ADD PRIMARY KEY (`movie_id`),
  ADD UNIQUE KEY `movie_id_UNIQUE` (`movie_id`);

--
-- Indexes for table `Ordered_Movies`
--
ALTER TABLE `Ordered_Movies`
  ADD PRIMARY KEY (`ordered_movies_id`,`movie_id`,`order_id`),
  ADD UNIQUE KEY `Ordered_Movies_id_UNIQUE` (`ordered_movies_id`),
  ADD KEY `fk_Orders_has_Available_Rentals_Orders1_idx` (`order_id`),
  ADD KEY `fk_Ordered_Movies_Has_Movies_idx` (`movie_id`);

--
-- Indexes for table `Orders`
--
ALTER TABLE `Orders`
  ADD PRIMARY KEY (`order_id`,`customer_id`,`location_id`),
  ADD UNIQUE KEY `order_id_UNIQUE` (`order_id`),
  ADD KEY `fk_Orders_Customers_idx` (`customer_id`),
  ADD KEY `fk_Orders_Locations1_idx` (`location_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Available_Rentals`
--
ALTER TABLE `Available_Rentals`
  MODIFY `avail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Customers`
--
ALTER TABLE `Customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Locations`
--
ALTER TABLE `Locations`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Movies`
--
ALTER TABLE `Movies`
  MODIFY `movie_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Ordered_Movies`
--
ALTER TABLE `Ordered_Movies`
  MODIFY `ordered_movies_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Orders`
--
ALTER TABLE `Orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Available_Rentals`
--
ALTER TABLE `Available_Rentals`
  ADD CONSTRAINT `fk_Available_Rentals_Locations1` FOREIGN KEY (`location_id`) REFERENCES `Locations` (`location_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Available_Rentals_Movies1` FOREIGN KEY (`movie_id`) REFERENCES `Movies` (`movie_id`) ON DELETE CASCADE;

--
-- Constraints for table `Ordered_Movies`
--
ALTER TABLE `Ordered_Movies`
  ADD CONSTRAINT `fk_Ordered_Movies_Has_Movies` FOREIGN KEY (`movie_id`) REFERENCES `Movies` (`movie_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Orders_has_Available_Rentals_Orders1` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`) ON DELETE CASCADE;

--
-- Constraints for table `Orders`
--
ALTER TABLE `Orders`
  ADD CONSTRAINT `fk_Orders_Customers` FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`customer_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Orders_Locations1` FOREIGN KEY (`location_id`) REFERENCES `Locations` (`location_id`) ON DELETE CASCADE;
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
