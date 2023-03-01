const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit:0
});

module.exports = connection;
