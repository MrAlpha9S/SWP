const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config({ path: `.env` });

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: 'localhost',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        trustServerCertificate: true
    }
}

app.use(cors());

app.get('/getUsers', async (req, res) => {
    try {
        await sql.connect(sqlConfig)
        const result = await sql.query`select * from users`
        return res.status(200).send(result.recordsets[0]);
    } catch (err) {
        console.log("error in getUsers route: " + err);
        return res.status(500).send({ error: 'internal server error' });
    }

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});