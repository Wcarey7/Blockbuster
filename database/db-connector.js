// ./database/db-connector.js

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.DATABASE_HOST,
    user            : process.env.DATABASE_USERNAME,
    password        : process.env.DATABASE_PASSWORD,
    database        : process.env.DATABASE_NAME
})

// Export it for use in our applicaiton
module.exports.pool = pool;