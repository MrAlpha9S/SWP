const express = require('express');
const app = express();
const port = 3000;
const mssql = require('mssql');

const connection = mssql.createConnection()

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});