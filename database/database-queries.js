const database = require('../database/database-connection.js');

function addUserToDatabase(id,name) {
    const sql = `INSERT INTO user(id, username) VALUES ('${id}', '${name}')`;
    database.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
}

module.exports = {
    addUserToDatabase
}