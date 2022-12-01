-- Data Manipulation Queries
-- Group 77
-- Wade Carey
-- Andrew Sabin



-- CUSTOMERS -----
----------------------------------------------------------------------------------------------------------
-- Get all Customers for Customers page
SELECT customer_id AS ID, first_name AS "First Name", last_name AS "Last Name", customer_street AS Street, 
customer_city AS City, customer_state AS State, customer_zip AS Zip, customer_phone_number AS "Phone Number", 
customer_active_rentals AS "Active Rentals", customer_total_rentals AS "Total Rentals" 
FROM Customers;


-- Add a new Customer
INSERT INTO Customers (first_name, last_name, customer_street, customer_city, customer_state, customer_zip, customer_phone_number, 
customer_active_rentals, customer_total_rentals)
VALUES (:fnameInput, :lnameInput, :customerStreetInput, :customerCityInput, :CustomerStateInput, :CustomerZipInput, 
:customerPhoneInput, :activeRentals, :totalRentals);


-- Update Customer
UPDATE Customers 
SET first_name = :fnameInput, last_name= :lnameInput, customer_street = :customerStreetInput, customer_city = :customerCityInput, 
customer_state = :CustomerStateInput, customer_zip = :CustomerZipInput, customer_phone_number = :customerPhoneInput, 
customer_active_rentals = :activeRentals, customer_total_rentals = :totalRentals;
WHERE customer_id = :customer_id_editButton;


-- Delete a Customer
DELETE FROM Customers WHERE customer_id = :customer_id_deleteButton;


-- Search Customers by last name
SELECT customer_id AS ID, first_name AS "First Name", last_name AS "Last Name", customer_street AS Street, 
customer_city AS City, customer_state AS State, customer_zip AS Zip, customer_phone_number AS "Phone Number", 
customer_active_rentals AS "Active Rentals", customer_total_rentals AS "Total Rentals" 
FROM Customers 
WHERE last_name LIKE "${req.query.lname}%";



-- LOCATIONS ------
----------------------------------------------------------------------------------------------------------------------------
-- Get all Locations for Locations page
SELECT * FROM Locations; 

-- Add a new Location
INSERT INTO Locations (location_street,	location_city,	location_state,	location_zip,	location_phone_number)
VALUES (:locationStreetInput, :locationCityInput, :locationStateInput, :locationZipInput, :locationPhoneInput);

-- Update Location
UPDATE Locations SET location_street = :locationStreet,	location_city = :locationCity,	location_state = :locationState,
location_zip = :locationZip, location_phone_number = :locationPhone
WHERE location_id = :location_id_editButton;



-- MOVIES ------
------------------------------------------------------------------------------------------------------------------------------
-- Get all Movies for Movies page
SELECT * FROM Movies; 

-- Add a new Movie
INSERT INTO Movies (movie_title, release_date, genre)
VALUES (:movieTitleInput, :releaseDateInput, :genreInput);

-- Update a Movie
UPDATE Movie SET movie_title = :movieTitle, release_date = :releaseDate, genre = :genreInput
WHERE movie_id = :movie_id_editButton;


-- ORDERS ------
-----------------------------------------------------------------------------------------------------------------------------
-- Get all Orders for Orders page
SELECT order_id AS ID, customer_id AS Customer_Name, location_id AS Location_Address, 
    DATE_FORMAT(order_date, "%m-%d-%Y") AS Order_Date, DATE_FORMAT(return_date, "%m-%d-%Y") AS Return_Date, 
    IF(over_due=0, "No", "Yes") AS Is_Overdue 
    FROM Orders;


-- Add a new Order
INSERT INTO Orders (customer_id, location_id, return_date,	over_due, order_date)
VALUES (:customer_id_from_dropDownInput, :location_id_from_dropDownInput, :returnDate, :overDue, :orderDate );


-- SELECT after adding a new Order to update front end
SELECT order_id, CONCAT(Customers.first_name, " ", Customers.last_name) AS Customer_Name,  
CONCAT(Locations.location_street, ", ", Locations.location_city, ", ", Locations.location_state," ", Locations.location_zip) AS Location_Address, 
DATE_FORMAT(order_date, "%m-%d-%Y") AS Order_Date, DATE_FORMAT(return_date, "%m-%d-%Y") AS Return_Date, 
IF(over_due=0, "No", "Yes") AS Is_Overdue 
FROM Orders
LEFT JOIN Customers ON Orders.customer_id = Customers.customer_id 
LEFT JOIN Locations ON Orders.location_id = Locations.location_id;


-- Update an Order
UPDATE Orders SET customer_id = :customer_id_dropDownMenu, location_id = :location_id_from_dropDownInput, 
return_date = :returnDate, over_due = :overDue, order_date = :orderDate
WHERE order_id = :order_id_editButton;


-- SELECT after updating an Order to update front end
SELECT order_id AS ID, CONCAT(Customers.first_name, " ", Customers.last_name) AS Customer_Name,  
CONCAT(Locations.location_street, ", ", Locations.location_city, ", ", Locations.location_state," ", Locations.location_zip) AS Location_Address, 
DATE_FORMAT(order_date, "%m-%d-%Y") AS Order_Date, DATE_FORMAT(return_date, "%m-%d-%Y") AS Return_Date, 
IF(over_due=0, "No", "Yes") AS Is_Overdue 
FROM Orders
LEFT JOIN Customers ON Orders.customer_id = Customers.customer_id 
LEFT JOIN Locations ON Orders.location_id = Locations.location_id;


-- Delete an Order
DELETE FROM Orders WHERE order_id = :order_id_deleteButton;


-- Search an Order by order_id
SELECT order_id AS ID, customer_id AS Customer_Name, location_id AS Location_Address, 
DATE_FORMAT(order_date, "%m-%d-%Y") AS Order_Date, DATE_FORMAT(return_date, "%m-%d-%Y") AS Return_Date, 
IF(over_due=0, "No", "Yes") AS Is_Overdue 
FROM Orders WHERE ?? LIKE "${req.query.filter}%"



-- AVAILABLE_RENTALS ------
-----------------------------------------------------------------------------------------------------------------------------
-- Get all Available_Rentals
SELECT avail_id AS ID, movie_id AS MovieTitle, location_id AS Location, avail_copies AS 'Available Copies' 
FROM Available_Rentals;


-- Add a new Available_Rentals
INSERT INTO Available_Rentals (movie_id, location_id, avail_copies)
VALUES (:movie_id_from_dropDownInput, :location_id_from_dropDownInput, :availCopies);

-- SELECT after adding a new Available_Rentals to update front end
SELECT avail_id, movie_title, 
CONCAT(Locations.location_street, ", ", Locations.location_city, ", ", Locations.location_state," ", Locations.location_zip) AS Location, avail_copies
FROM Available_Rentals 
LEFT JOIN Movies ON Available_Rentals.movie_id = Movies.movie_id 
LEFT JOIN Locations ON Available_Rentals.location_id = Locations.location_id;


-- Update Available_Rentals
UPDATE Available_Rentals
SET movie_id = :movie_id_from_dropDownInput, location_id = :location_id_from_dropDownInput, avail_copies = :availCopies
WHERE avail_id = :avail_id_editButton;


-- Delete an Available_Rental
DELETE FROM Available_Rentals WHERE avail_id = :avail_id_deleteButton;



-- ORDERED_MOVIES ------
------------------------------------------------------------------------------------------------------------------------------
-- Get all Ordered_Movies for Ordered_Movies page
SELECT ordered_movies_id AS ID, order_id AS Order_ID, movie_id AS Movie_Title, quantity AS Quantity FROM Ordered_Movies;;


-- Add a new Ordered_Movies
INSERT INTO Ordered_Movies (order_id, movie_id, quantity)
VALUES (:order_id_from_dropDownInput, :movie_id_from_dropDownInput, :orderedMovieQuantity);


-- SELECT after adding a new Ordered_Movies to update front end
SELECT ordered_movies_id, order_id, movie_title, quantity 
FROM Ordered_Movies 
LEFT JOIN Movies ON Ordered_Movies.movie_id = Movies.movie_id;


-- Search ordered_movies by order_id
SELECT ordered_movies_id AS ID, order_id AS Order_ID, movie_id AS Movie_Title, quantity AS Quantity 
FROM Ordered_Movies 
WHERE order_id = "${req.query.filter}%"
