// Main Routes

// Code Citations
// Date: 11/15/2022
// Routes Referenced from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));
PORT = 7792;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs"}));
app.set('view engine', '.hbs');


/*
    ROUTES
*/

/*////////////////////////////////////////////////////////////////////////////////////////
                INDEX
                CUSTOMERS
*/
app.get('/', function(req, res)
{
    let query1;

    // If there is no query string, perform SELECT
    if (req.query.lname === undefined)
    {
        query1 = `SELECT customer_id AS ID, first_name AS "First Name", last_name AS "Last Name", 
        customer_street AS Street, customer_city AS City, customer_state AS State, customer_zip AS Zip, 
        customer_phone_number AS "Phone Number", customer_active_rentals AS "Active Rentals", 
        customer_total_rentals AS "Total Rentals" 
        FROM Customers;`
    }

    // If there is a query string, search
    else
    {
        query1 = `SELECT customer_id AS ID, first_name AS "First Name", last_name AS "Last Name", 
        customer_street AS Street, customer_city AS City, customer_state AS State, 
        customer_zip AS Zip, customer_phone_number AS "Phone Number", 
        customer_active_rentals AS "Active Rentals", customer_total_rentals AS "Total Rentals" 
        FROM Customers WHERE last_name LIKE "${req.query.lname}%"`
    }

    db.pool.query(query1, function(error, rows, fields){

        let customers = rows;

        return res.render('index', {data: customers}); 
    })
});



// ADD
app.post('/add-customer-ajax', function(req, res)
{
    let data = req.body;

    // Capture NULL values
    let zip = parseInt(data.zip);
    if (isNaN(zip))
    {
        zip = 'NULL'
    }

    let phone = parseInt(data.phone);
    if (isNaN(phone))
    {
        phone = 'NULL'
    }

    let activeRentals = parseInt(data.activeRentals);
    if (isNaN(activeRentals))
    {
        activeRentals = 'NULL'
    }
    
    let totalRentals = parseInt(data.totalRentals);
    if (isNaN(totalRentals))
    {
        totalRentals = 'NULL'
    }   

    query1 = `INSERT INTO Customers (first_name, last_name, customer_street, customer_city, customer_state, customer_zip, customer_phone_number, 
    customer_active_rentals, customer_total_rentals) 
    VALUES ('${data.fname}', '${data.lname}', '${data.street}', '${data.city}', '${data.state}', 
    ${zip}, ${phone}, ${activeRentals}, ${totalRentals})`;
    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }

       else
        {
            query2 = "SELECT * FROM Customers;";
            db.pool.query(query2, function(error, rows, fields){

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});



// UPDATE
app.put('/put-customer-ajax', function(req,res,next)
{
    let data = req.body;
    let customerID = parseInt(data.customerId);

    let queryUpdateCustomer = `UPDATE Customers SET first_name = ?, last_name = ?, customer_street = ?, 
    customer_city = ?, customer_state = ?, customer_zip = ?, customer_phone_number = ?, 
    customer_active_rentals = ?, customer_total_rentals = ? 
    WHERE customer_id = ?`;

    selectCustomer =  `SELECT * FROM Customers;`;

    db.pool.query(queryUpdateCustomer, 
    [
        data['fname'], data['lname'], data['street'], data['city'], data['state'],
        data['zip'], data['phone'], data['activeRentals'],  data['totalRentals'], customerID,
    ],
    function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        // Update the front-end
        else
        {
        db.pool.query(selectCustomer, function(error, rows, fields) {

            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.send(rows);
            }
        });
        }
  })
});


// DELETE
app.delete('/delete-customer-ajax/', function(req,res,next)
{
    let data = req.body;
    let customerID = parseInt(data.id);
    let deleteCustomers = `DELETE FROM Customers WHERE customer_id = ?`;

        db.pool.query(deleteCustomers, [customerID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.sendStatus(204);
            }
        });
});



/*////////////////////////////////////////////////////////////////////////////////////////
                    ORDERS
*/
app.get('/orders', function(req, res)
{
    let query1;
    let customers = "SELECT * FROM Customers;";
    let locations = "SELECT * FROM Locations;";

    query1 = `SELECT order_id AS ID, customer_id AS Customer_Name, location_id AS Location_Address, 
    DATE_FORMAT(order_date, "%m-%d-%Y") AS Order_Date, DATE_FORMAT(return_date, "%m-%d-%Y") AS Return_Date, 
    IF(over_due=0, "No", "Yes") AS Is_Overdue 
    FROM Orders;`
        
    db.pool.query(query1, function(error, rows, fields){
        let orders = rows;
        
        // Run the second query
        db.pool.query(customers, (error, rows, fields) => {
            let customers = rows;
            //Map to replace customer_id with customer name
            let customermap = {}
            customers.map(customer => {
                let id = parseInt(customer.customer_id, 10);
                customermap[id] = customer["first_name"] + ' ' + customer["last_name"];
            });

            // Run the third query
            db.pool.query(locations, (error, rows, fields) => {
                let locations = rows;
                //Map to replace location_id with location address
                let locationmap = {}
                locations.map(location => {
                    let id = parseInt(location.location_id, 10);
                    locationmap[id] = location["location_street"] + ', ' + location["location_city"]
                    + ', ' + location["location_state"] + ' ' + location["location_zip"];
                });

                orders = orders.map(order => {
                    return Object.assign(order, {Customer_Name: customermap[order.Customer_Name], 
                        Location_Address: locationmap[order.Location_Address],
                    });
                });

                return res.render('orders', {
                    data: orders, customers: customers, locations: locations,
                });
            });
        });
    });
});


// SEARCH / FILTER
app.get('/orders/:filter', function(req, res)
{
    let query1;
    let customers = "SELECT * FROM Customers;";
    let locations = "SELECT * FROM Locations;";
    let {filter} = req.params;   

    query1 = `SELECT order_id AS ID, customer_id AS Customer_Name, location_id AS Location_Address, 
    DATE_FORMAT(order_date, "%m-%d-%Y") AS Order_Date, DATE_FORMAT(return_date, "%m-%d-%Y") AS Return_Date, 
    IF(over_due=0, "No", "Yes") AS Is_Overdue 
    FROM Orders WHERE ?? LIKE "${req.query.filter}%"`

    db.pool.query(query1, [filter], function(error, rows, fields){
        let orders = rows;
        
        // Run the second query
        db.pool.query(customers, (error, rows, fields) => {
            let customers = rows;
            //Map to replace customer_id with customer name
            let customermap = {}
            customers.map(customer => {
                let id = parseInt(customer.customer_id, 10);
                customermap[id] = customer["first_name"] + ' ' + customer["last_name"];
            });

            // Run the third query
            db.pool.query(locations, (error, rows, fields) => {
                let locations = rows;
                //Map to replace location_id with location address
                let locationmap = {}
                locations.map(location => {
                    let id = parseInt(location.location_id, 10);
                    locationmap[id] = location["location_street"] + ', ' + location["location_city"]
                    + ', ' + location["location_state"] + ' ' + location["location_zip"];
                });

                orders = orders.map(order => {
                    return Object.assign(order, {Customer_Name: customermap[order.Customer_Name], 
                        Location_Address: locationmap[order.Location_Address],
                    });
                });

                return res.render('orders', {
                    data: orders, customers: customers, locations: locations,
                });
            });
        });
    });
});



// ADD
app.post('/add-order-ajax', function(req, res)
{
    let data = req.body;

    // Capture NULL values
    let overDue = parseInt(data.overDue);
    if (isNaN(overDue))
    {
        overDue = 'NULL'
    }
    
    let query1 = `INSERT INTO Orders (customer_id, location_id, order_date, return_date, over_due)
    VALUES ('${data.customer}', '${data.location}', '${data.orderDate}', '${data.returnDate}', '${overDue}')`;

    let query2 = `SELECT order_id, CONCAT(Customers.first_name, " ", Customers.last_name) AS Customer_Name,  
    CONCAT(Locations.location_street, ", ", Locations.location_city, ", ", Locations.location_state," ", Locations.location_zip) AS Location_Address, 
    DATE_FORMAT(order_date, "%m-%d-%Y") AS Order_Date, DATE_FORMAT(return_date, "%m-%d-%Y") AS Return_Date, 
    IF(over_due=0, "No", "Yes") AS Is_Overdue 
    FROM Orders
    LEFT JOIN Customers ON Orders.customer_id = Customers.customer_id 
    LEFT JOIN Locations ON Orders.location_id = Locations.location_id;`

    
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            //Update the front-end
            db.pool.query(query2, function(error, rows, fields){

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            });
        }
    })
});



// UPDATE
app.put('/put-order-ajax', function(req,res,next)
{
    let data = req.body;
    let orderID = parseInt(data.order);
  
    let queryUpdateOrder = `UPDATE Orders SET customer_id = ?, location_id = ?, order_date = ?, 
    return_date = ?, over_due = ? WHERE order_id = ?`;

    let selectOrder = `SELECT order_id AS ID, CONCAT(Customers.first_name, " ", Customers.last_name) AS Customer_Name,  
    CONCAT(Locations.location_street, ", ", Locations.location_city, ", ", Locations.location_state," ", Locations.location_zip) AS Location_Address, 
    DATE_FORMAT(order_date, "%m-%d-%Y") AS Order_Date, DATE_FORMAT(return_date, "%m-%d-%Y") AS Return_Date, 
    IF(over_due=0, "No", "Yes") AS Is_Overdue 
    FROM Orders
    LEFT JOIN Customers ON Orders.customer_id = Customers.customer_id 
    LEFT JOIN Locations ON Orders.location_id = Locations.location_id;`  
    
    db.pool.query(queryUpdateOrder,
    [
        data['customer'], data['location'], data['orderDate'], data['returnDate'], data['overDue'], orderID,
    ],
    function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        // Update the front-end
        else
        {
        db.pool.query(selectOrder, function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.send(rows);
            }
        })
        }
  });
});


// DELETE
app.delete('/delete-order-ajax/', function(req,res,next)
{
    let data = req.body;
    let orderID = parseInt(data.id);
    let deleteOrders = `DELETE FROM Orders WHERE order_id = ?`;

        db.pool.query(deleteOrders, [orderID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.sendStatus(204);
            }
        })
});



/*////////////////////////////////////////////////////////////////////////////////////////
                    ORDERED_MOVIES
*/
app.get('/ordered_movies', function(req, res)
{  
    let query1;
    let orders = "SELECT * FROM Orders;";
    let movies = "SELECT * FROM Movies;";

    // If there is no query string, perform SELECT
    if (req.query.filter === undefined || req.query.filter === "")
    {
        query1 = `SELECT ordered_movies_id AS ID, order_id AS Order_ID, movie_id AS Movie_Title, quantity AS Quantity 
        FROM Ordered_Movies;`;
    }
    // If there is a query string, search
    else
    {
        query1 = `SELECT ordered_movies_id AS ID, order_id AS Order_ID, movie_id AS Movie_Title, quantity AS Quantity 
        FROM Ordered_Movies 
        WHERE order_id = "${req.query.filter}%"`
    }

    db.pool.query(query1, function(error, rows, fields){
        let orderedMovies = rows;
        
        // Run the second query
        db.pool.query(orders, (error, rows, fields) => {
            let orders = rows;

            // Run the third query
            db.pool.query(movies, (error, rows, fields) => {
                let movies = rows;
                //Map to replace movie_id with movie title
                let moviemap = {}
                movies.map(movie => {
                    let id = parseInt(movie.movie_id, 10);
                    moviemap[id] = movie["movie_title"];
                });

                orderedMovies = orderedMovies.map(orderedMovie => {
                    return Object.assign(orderedMovie, {Movie_Title: moviemap[orderedMovie.Movie_Title], 
                    });
                });

                return res.render('ordered_movies', {
                    data: orderedMovies, orders: orders, movies: movies,
                });
            });
        });
    });
});



// ADD
app.post('/add-ordered-movie-ajax', function(req, res)
{
    let data = req.body;
    
    query1 = `INSERT INTO Ordered_Movies (order_id, movie_id, quantity)
    VALUES ('${data.orderId}', '${data.movieId}', '${data.quantity}')`;

    query2 = `SELECT ordered_movies_id, order_id, movie_title, quantity 
    FROM Ordered_Movies LEFT JOIN Movies ON Ordered_Movies.movie_id = Movies.movie_id;`
    
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            //Update the front-end
            db.pool.query(query2, function(error, rows, fields){

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            });
        }
    })
});


// DELETE
app.delete('/delete-ordered-movies-ajax/', function(req,res,next)
{
    let data = req.body;
    let orderedMovieID = parseInt(data.id);
    let deleteOrderedMovie = `DELETE FROM Ordered_Movies WHERE ordered_movies_id = ?`;

        db.pool.query(deleteOrderedMovie, [orderedMovieID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.sendStatus(204);
            }
        })
});



/*////////////////////////////////////////////////////////////////////////////////////////
                    MOVIES
*/
app.get('/movies', function(req, res)
{  
    let query1; 
    let query2= "SELECT * FROM Movies;";
    
        // If there is no query string, we just perform a basic SELECT
        if (req.query.movie_title === undefined)
        {
            query1 = "SELECT * FROM Movies;";
        }
    
        // If there is a query string, we assume this is a search, and return desired results
        else
        {
            query1 = `SELECT * FROM Movies WHERE movie_title LIKE "${req.query.movie_title}%"`
        }

        // db.pool.query(query1, function(error, rows, fields){
        
        //     // Save the people
        
        //     return res.render('index', {data: movies});
        // })

    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        let movies = rows;

        res.render('movies', {data: movies});                  // Render the movies.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' 
});



//ADD
app.post('/add-movie-ajax', function(req, res) 
{
    let data = req.body;

    // Capture NULL values
    let release_date = parseInt(data.release_date);
    if (isNaN(release_date))
    {
        release_date = 'NULL'
    }

    query1 = `INSERT INTO Movies (movie_title, release_date, genre) VALUES ('${data.title}', '${data.release_date}', '${data.genre}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Movies
            query2 = `SELECT * FROM Movies;`;
            db.pool.query(query2, function(error, rows, fields){

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


app.delete('/delete-movie-ajax/', function(req,res,next){
    let data = req.body;
    let movieID = parseInt(data.id);
    let deleteMovies = `DELETE FROM Movies WHERE movie_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteMovies, [movieID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
  })});




  app.put('/put-movie-ajax', function(req,res,next){
    let data = req.body;

    let movieID = parseInt(data.movieId);

    let title = parseInt(data.movie_title);
    let releaseDate = parseInt(data.release_date);
    let genre = parseInt(data.genre);
  
    let queryUpdateMovie = `UPDATE Movies SET movie_title = ?, release_date = ?, genre= ? WHERE movie_id = ?`;
    let selectMovie = `SELECT * FROM Movies `;
  
          // Run the 1st query
          db.pool.query(queryUpdateMovie, [data['movie_title'], data['release_date'],data['genre'], movieID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectMovie, function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});



/*////////////////////////////////////////////////////////////////////////////////////////
                    AVAILABLE_RENTALS
*/
app.get('/available_rentals', function(req, res)
{  
    let query1 = `SELECT avail_id AS ID, movie_id AS MovieTitle, location_id AS Location, 
    avail_copies AS 'Available Copies' FROM Available_Rentals;`;

    let movies = "SELECT * FROM Movies;";
    let locations = "SELECT * FROM Locations;";               

    db.pool.query(query1, function(error, rows, fields){
        let availRentals = rows;
        
        // Run the second query
        db.pool.query(movies, (error, rows, fields) => {
            let movies = rows;
            //Map to replace movie_id with movie title
            let moviemap = {}
            movies.map(movie => {
                let id = parseInt(movie.movie_id, 10);
                moviemap[id] = movie["movie_title"];
            });

            // Run the third query
            db.pool.query(locations, (error, rows, fields) => {
                let locations = rows;
                //Map to replace location_id with location address
                let locationmap = {}
                locations.map(location => {
                    let id = parseInt(location.location_id, 10);
                    locationmap[id] = location["location_street"] + ', ' + location["location_city"]
                    + ', ' + location["location_state"] + ' ' + location["location_zip"];
                });

                availRentals = availRentals.map(availRental => {
                    return Object.assign(availRental, {MovieTitle: moviemap[availRental.MovieTitle], 
                        Location: locationmap[availRental.Location],
                    });
                });

                return res.render('available_rentals', {
                    data: availRentals, movies: movies, locations: locations,
                });
            });
        });
    });                                                 
});


// ADD
app.post('/add-available-rentals-ajax', function(req, res)
{
    let data = req.body;

    let locationId = parseInt(data.locationId);
    if (isNaN(locationId))
    {
        locationId = null
    }
    
    let query1 = `INSERT INTO Available_Rentals (movie_id, location_id, avail_copies)
    VALUES ('${data.movieId}', ${locationId}, '${data.availCopies}')`;

    let query2 = `SELECT avail_id, movie_title, 
    CONCAT(Locations.location_street, ", ", Locations.location_city, ", ", Locations.location_state," ", Locations.location_zip) AS Location, avail_copies
    FROM Available_Rentals 
    LEFT JOIN Movies ON Available_Rentals.movie_id = Movies.movie_id 
    LEFT JOIN Locations ON Available_Rentals.location_id = Locations.location_id;`

    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            //Update the front-end
            db.pool.query(query2, function(error, rows, fields){

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            });
        }
    })
});



// UPDATE
app.put('/put-available-rentals-ajax', function(req,res,next)
{
    let data = req.body;
    let availID = parseInt(data.availId);
    let locationId = parseInt(data.locationId);

    if (isNaN(locationId))
    {
        locationId = null
    }

    let queryUpdateAvailRental = `UPDATE Available_Rentals SET movie_id = ?, location_id = ?, avail_copies = ?
    WHERE avail_id = ?`;

    let selectAvailRental = `SELECT avail_id, movie_title, 
    CONCAT(Locations.location_street, ", ", Locations.location_city, ", ", Locations.location_state," ", Locations.location_zip) AS Location, avail_copies
    FROM Available_Rentals 
    LEFT JOIN Movies ON Available_Rentals.movie_id = Movies.movie_id 
    LEFT JOIN Locations ON Available_Rentals.location_id = Locations.location_id;`  
    
    db.pool.query(queryUpdateAvailRental,
    [
        data['movieId'], locationId, data['availCopies'], availID,
    ],
    function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        // Update the front-end
        else
        {
        db.pool.query(selectAvailRental, function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.send(rows);
            }
        })
        }
  });
});



// DELETE
app.delete('/delete-available-rentals-ajax/', function(req,res,next)
{
    let data = req.body;
    let availRentalID = parseInt(data.id);
    let deleteAvailableRental = `DELETE FROM Available_Rentals WHERE avail_id = ?`;

        db.pool.query(deleteAvailableRental, [availRentalID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.sendStatus(204);
            }
        })
});




/*////////////////////////////////////////////////////////////////////////////////////////
                    LOCATIONS
*/
app.get('/locations', function(req, res)
{  
    let query1 = "SELECT * FROM Locations;";
    
        // If there is no query string, we just perform a basic SELECT
        if (req.query.location_state === undefined)
        {
            query1 = "SELECT * FROM Locations;";
        }
    
        // If there is a query string, we assume this is a search, and return desired results
        else
        {
            query1 = `SELECT * FROM Locations WHERE location_state LIKE "${req.query.location_state}%"`
        }
    

    db.pool.query(query1, function(error, rows, fields){    

        res.render('locations', {data: rows});                  
    })                                                      
});

//ADD
app.post('/add-location-ajax', function(req, res)
{
    let data = req.body;

    // Capture NULL values
    let zip = parseInt(data.zip);
    if (isNaN(zip))
    {
        zip = 'NULL'
    }

    let phone = parseInt(data.phone);
    if (isNaN(phone))
    {
        phone = 'NULL'
    }
  

    query1 = `INSERT INTO Locations (location_street, location_city, location_state, location_zip, location_phone_number) 
    VALUES ('${data.street}', '${data.city}', '${data.state}', ${zip}, ${phone})`;
    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }

       else
        {
            query2 = "SELECT * FROM Locations;";
            db.pool.query(query2, function(error, rows, fields){

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

//UPDATE
app.put('/put-location-ajax', function(req,res,next)
{
    let data = req.body;
    let locationID = parseInt(data.locationId);

    let queryUpdateLocation = `UPDATE Locations SET location_street = ?, location_city = ?, location_state = ?, location_zip = ?, location_phone_number = ? WHERE location_id = ?`;

    selectLocation =  `SELECT * FROM Locations;`;

    db.pool.query(queryUpdateLocation, 
    [
        data['street'], data['city'], data['state'],
        data['zip'], data['phone'], locationID,
    ],
    function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        // Update the front-end
        else
        {
        db.pool.query(selectLocation, function(error, rows, fields) {

            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.send(rows);
            }
        });
        }
  })
});

//DELETE
app.delete('/delete-location-ajax/', function(req,res,next)
{
    let data = req.body;
    let locationID = parseInt(data.id);
    let deleteLocations = `DELETE FROM Locations WHERE location_id = ?`;

        db.pool.query(deleteLocations, [locationID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                res.sendStatus(204);
            }
        });
});



/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on flip#.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});
