const mysql = require('mysql2');

//connect to database
const db = mysql.createConnection({
    host: 'localhost',
    //mysql username
    user: 'root',
    //your mysql password
    password: '',
    database: 'election'
});

//export module
module.exports = db;