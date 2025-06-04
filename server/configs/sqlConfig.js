// config/db.js
require('dotenv').config();
const sql = require('mssql');


const poolPromise = new sql.ConnectionPool({
    user: String(process.env.DB_USER),
    password: String(process.env.DB_PWD),
    server: String(process.env.DB_SERVER),
    database: String(process.env.DB_NAME),
    options: { encrypt: true, trustServerCertificate: true }
})
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => {
        console.log(process.env.DB_USER)
        console.log(process.env.DB_PWD)
        console.log(process.env.DB_SERVER)
        console.log(process.env.DB_NAME)
        console.error('Database connection failed', err);
    });

module.exports = { sql, poolPromise };
