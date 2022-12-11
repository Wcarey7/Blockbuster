// ./database/db-connector.js


// Requires
var mysql = require('mysql')
require('dotenv').config();


// Store database credentials in a .env file in root of project
var credentials = {
    host:  process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
}

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : credentials.host,
    user            : credentials.user,
    password        : credentials.password,
    database        : credentials.database
})

// Export it for use in applicaiton
module.exports.pool = pool;
module.exports.credentials = credentials;