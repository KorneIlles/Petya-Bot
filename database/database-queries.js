

const database = require('../database/database-connection.js');

function addUserToDatabase(id,name) {
    database.connect();
    const sql = `INSERT INTO user(id, username)
                 VALUES ('${id}', '${name}')`;
    database.query(sql, function (err, result) {
        if (err) throw err;
        console.log(`${name} added to the database`);
    });
    database.end()
}

function checkIfIdExists(id) {
    database.connect()
    return new Promise((resolve, reject) => {
        const query = `SELECT EXISTS (SELECT 1 FROM user WHERE id = ${id}) AS idExists`;

        database.query(query, (error, results, fields) => {
            if (error) reject(error);

            const idExists = results[0].idExists === 1;
            resolve(idExists);
        });
    });
}

module.exports = {
    addUserToDatabase,
    checkIfIdExists
}