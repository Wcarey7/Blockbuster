//Referenced from: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));
PORT = 7791;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


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
        query1 = "SELECT * FROM Customers;";
    }

    // If there is a query string, search
    else
    {
        query1 = `SELECT * FROM Customers WHERE last_name LIKE "${req.query.lname}%"`
    }

    db.pool.query(query1, function(error, rows, fields){

        let customers = rows;

        return res.render('index', {data: customers}); 
    })
});



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



//UPDATE
app.put('/put-customer-ajax', function(req,res,next)
{
    let data = req.body;
    let customerID = parseInt(data.customerId);

    let queryUpdateCustomer = `UPDATE Customers SET first_name = ?, last_name = ?, customer_street = ?, customer_city = ?,
    customer_state = ?, customer_zip = ?, customer_phone_number = ?, customer_active_rentals = ?,
    customer_total_rentals = ? WHERE customer_id = ?`;

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



//DELETE
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

    // If there is no query string, perform SELECT
    if (req.query.filterLocation === undefined)
    {
        query1 = "SELECT * FROM Orders;";
    }
    // If there is a query string, search
    else
    {
        query1 = `SELECT * FROM Orders WHERE location_id LIKE "${req.query.filterLocation}%"`
    }

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
                    return Object.assign(order, {customer_id: customermap[order.customer_id], 
                        location_id: locationmap[order.location_id],
                    });
                });

                return res.render('orders', {
                    data: orders, customers: customers, locations: locations,
                });
            });
        });
    });
});




//ADD
app.post('/add-order-ajax', function(req, res)
{
    let data = req.body;

    // Capture NULL values
    let overDue = parseInt(data.overDue);
    if (isNaN(overDue))
    {
        overDue = 'NULL'
    }
    
    query1 = `INSERT INTO Orders (customer_id, location_id, order_date, return_date, over_due)
    VALUES ('${data.customer}', '${data.location}', '${data.orderDate}', '${data.returnDate}', '${overDue}')`;

    query2 = "SELECT * FROM Orders;";
    
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





//UPDATE
app.put('/put-order-ajax', function(req,res,next)
{
    let data = req.body;
    let orderID = parseInt(data.order);
  
    let queryUpdateOrder = `UPDATE Orders SET customer_id = ?, location_id = ?, order_date = ?, 
    return_date = ?, over_due = ? WHERE order_id = ?`;

    let selectOrder = `SELECT * FROM Orders;`;
  
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



//DELETE
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
app.get('/Ordered_Movies', function(req, res)
{  
    let query1 = "SELECT * FROM Ordered_Movies;";               

    db.pool.query(query1, function(error, rows, fields){    

        res.render('ordered_movies', {data: rows});                  
    })                                                      
});
















/*////////////////////////////////////////////////////////////////////////////////////////
                    MOVIES
*/
app.get('/movies', function(req, res)
{  
    let query1 = "SELECT * FROM Movies;";               

    db.pool.query(query1, function(error, rows, fields){    

        res.render('movies', {data: rows});                  
    })                                                      
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


    // Create the query and run it on the database
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
  
    let title = parseInt(data.movie_title);
    let releaseDate = parseInt(data.release_date);
    let genre = parseInt(data.genre);
  
    let queryUpdateMovie = `UPDATE Movies set movie_title = ?`;
    let selectMovie = `SELECT * FROM Movies WHERE movie_title = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateMovie, [title], function(error, rows, fields){
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
                  db.pool.query(selectMovie, [title], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});



/*
    LISTENER
    Replace # with the number of the server you have placed the files on to run
*/
app.listen(PORT, function(){
    console.log('Express started on flip#.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});
