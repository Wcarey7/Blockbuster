-- Data Manipulation Queries
-- Group 77
-- Wade Carey
-- Andrew Sabin



-- CUSTOMERS -----
-------------------------------------------------------
-- Get all Customers for Customers page
SELECT * FROM Customers;

-- Add a new Customer
INSERT INTO Customers (first_name, last_name, customer_street, customer_city, customer_state, customer_zip, customer_phone_number, 
customer_active_rentals, customer_total_rentals)
VALUES (:fnameInput, :lnameInput, :customerStreetInput, :customerCityInput, :CustomerStateInput, :CustomerZipInput, 
:customerPhoneInput, :activeRentals, :totalRentals);

-- Update Customer
UPDATE Customers SET first_name = :fnameInput, last_name= :lnameInput, customer_street = :customerStreetInput, customer_city = :customerCityInput, 
customer_state = :CustomerStateInput, customer_zip = :CustomerZipInput, customer_phone_number = :customerPhoneInput, 
customer_active_rentals = :activeRentals, customer_total_rentals = :totalRentals;
WHERE customer_id = :customer_id_editButton;

-- Delete a Customer
DELETE FROM Customers WHERE customer_id = :customer_id_deleteButton;

-- Search Customers by last name
SELECT * FROM Customers WHERE last_name LIKE :lnameInput;



-- LOCATIONS ------
-------------------------------------------------------
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
--------------------------------------------------------
-- Get all Movies for Movies page
SELECT * FROM Movies; 

-- Add a new Movie
INSERT INTO Movies (movie_title, release_date, genre)
VALUES (:movieTitleInput, :releaseDateInput, :genreInput);

-- Update a Movie
UPDATE Movie SET movie_title = :movieTitle, release_date = :releaseDate, genre = :genreInput
WHERE movie_id = :movie_id_editButton;


-- ORDERS ------
--------------------------------------------------------
-- Get all Orders for Orders page
SELECT * FROM Orders; 

-- Add a new Order
INSERT INTO Orders (customer_id, location_id, return_date,	over_due, order_date)
VALUES (:customer_id_from_dropDownInput, :location_id_from_dropDownInput, :returnDate, :overDue, :orderDate );

-- Update an Order
UPDATE Orders SET customer_id = :customer_id_dropDownMenu, location_id = :location_id_from_dropDownInput, 
return_date = :returnDate, over_due = :overDue, order_date = :orderDate
WHERE order_id = :order_id_editButton;

-- Delete an Order
DELETE FROM Orders WHERE order_id = :order_id_deleteButton;



-- AVAILABLE_RENTALS ------
--------------------------------------------------------
-- Get all Available_Rentals for Available_Rentals page
SELECT * FROM Available_Rentals; 

-- Add a new Available_Rentals
INSERT INTO Available_Rentals (movie_id, location_id, avail_copies)
VALUES (:movie_id_from_dropDownInput, :location_id_from_dropDownInput, :availCopies);

-- Update Available_Rentals
UPDATE Available_Rentals SET movie_id = :movie_id_from_dropDownInput, location_id = :location_id_from_dropDownInput, 
avail_copies = :availCopies
WHERE avail_id = :avail_id_editButton;

-- Delete an Available_Rental
DELETE FROM Available_Rentals WHERE avail_id = :avail_id_deleteButton;


-- ORDERED_MOVIES ------
--------------------------------------------------------
-- Get all Ordered_Movies for Ordered_Movies page
SELECT * FROM Ordered_Movies;

-- Add a new Ordered_Movies
INSERT INTO Ordered_Movies (order_id, movie_id, quantity)
VALUES (:order_id_from_dropDownInput, :movie_id_from_dropDownInput, :orderedMovieQuantity);

-- Update an Ordered_Movie
UPDATE Ordered_Movies SET order_id = :order_id_from_dropDownInput, movied_id = :movie_id_from_dropDownInput, 
quantity = :orderedMovieQuantity;
WHERE order_id = :orderedMovie_editButton;




