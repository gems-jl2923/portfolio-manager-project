const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'n3u3da!',
    database: 'portfolio',
});

module.exports = pool;
