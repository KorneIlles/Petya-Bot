const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(function(err) {
    if (err) return console.error('error: ' + err.message);
    console.log("Connected to the MYSQL database!");
});

module.exports = connection;

// this is a query example

// connection.query('SELECT * FROM table_name', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
// });
//
// connection.end();