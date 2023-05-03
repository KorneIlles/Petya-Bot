const database = require('../database/database-connection.js');

function addUserToDatabase(id, name) {
    const sql = `INSERT INTO user(id, username)
                 VALUES ('${id}', '${name}')`;
    database.query(sql, function (err, result) {
        if (err) throw err;
        console.log(`${name} added to the database`);
    });
}

function checkIfIdExists(id) {
    return new Promise((resolve, reject) => {
        const query = `SELECT EXISTS(SELECT 1 FROM user WHERE id = ${id}) AS idExists`;

        database.query(query, (error, results, fields) => {
            if (error) reject(error);
            const idExists = results[0].idExists === 1;
            resolve(idExists);
        });
    });
}

function addTechToUserTechStack(userId, tech) {
    const sql = `INSERT INTO tech_stack(user_id, technology)
                 VALUES ('${userId}', '${tech}')`;
    database.query(sql, function (err, result) {
        if (err) throw err;
    });
}

function checkIfTechnologyInTheDatabase(userId, tech) {
    return new Promise((resolve, reject) => {
        const query = `SELECT EXISTS(SELECT 1
                                     FROM tech_stack
                                     WHERE user_id = ${userId} AND technology = '${tech}') AS techExists`;

        database.query(query, (error, results, fields) => {
            if (error) reject(error);
            const idExists = results[0].techExists === 1;
            resolve(idExists);
        });
    });
}

function getTechnologies(userId) {
    return new Promise((resolve, reject) => {
        const query = `SELECT technology
                       FROM tech_stack
                       WHERE user_id = ${userId}`;
        database.query(query, function (err, results) {
            if (err) reject(err);
            resolve(results)
        });
    });
}

function getAllUserId() {
    return new Promise((resolve, reject) => {
        const query = `SELECT id FROM user`;
        database.query(query, function (err, results) {
            if (err) reject(err);
            resolve(results)
        });
    });
}

function deleteTechnology(userId, techName, callback) {

    database.query('DELETE FROM tech_stack WHERE user_id = ? AND technology = ?', [userId, techName], (error) => {
        callback(error);
    });
}

function resetTechStack(userId,callback){
    database.query('DELETE FROM tech_stack WHERE user_id = ?',[userId], (error) =>{
        callback(error);
    });
}

module.exports = {
    addUserToDatabase,
    checkIfIdExists,
    addTechToUserTechStack,
    checkIfTechnologyInTheDatabase,
    getTechnologies,
    deleteTechnology,
    resetTechStack,
    getAllUserId
}