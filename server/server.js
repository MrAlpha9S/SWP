const express = require('express');
const app = express();
const port = 3000;
const {auth} = require('express-oauth2-jwt-bearer');
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config({path: `.env`});
const {ManagementClient} = require('auth0');
const {getManagementToken} = require("./utils");

const management = new ManagementClient({
    client_id: process.env.AUTH0_M2M_CLIENT_ID,
    client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
    domain: process.env.AUTH0_DOMAIN,
});


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

const jwtCheck = auth({
    audience: 'https://smokerecession.com',
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

app.use(cors());
app.use(express.json());

app.get('/getUsers', jwtCheck, async (req, res) => {

    try {
        await sql.connect(sqlConfig)
        const result = await sql.query`select * from users`
        return res.status(200).send(result.recordsets[0]);
    } catch (err) {
        console.log("error in getUsers route: " + err);
        return res.status(500).send({error: 'internal server error'});
    }

});

app.get('/getUserInfo', async (req, res) => {
    try {
        const token = await getManagementToken();

        const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/google-oauth2|105815855269571869013`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).send({error: errorText});
        }

        const data = await response.json();
        return res.status(200).send(data);
    } catch (err) {
        console.error('Error fetching user info:', err);
        return res.status(500).send({error: 'Internal server error'});
    }
});

app.post('/onboarding', jwtCheck, async (req, res) => {
    const {user_id} = req.body;
    if (!user_id) return res.status(400).json({success: false, message: 'user_id required'});

    try {
        await sql.connect(sqlConfig)
        const existingUser = await sql.query`SELECT * FROM users WHERE auth0_id = ${user_id}`;

        if (existingUser.recordsets.length == 0) {
            return res.status(200).json({success: false, message: 'User already onboarded'});
        }

        const token = await getManagementToken();
        const userDataResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!userDataResponse.ok) {
            const error = await userDataResponse.text();
            return res.status(userDataResponse.status).json({success: false, message: error});
        }

        const userData = await userDataResponse.json();

        await sql.query`
        INSERT INTO users (auth0_id, username, email)
        VALUES (${user_id}, ${userData.name || ''}, ${userData.email || ''})`;

        return res.status(201).json({success: true, message: 'User onboarded'});

    } catch (err) {
        console.error('Onboarding error:', err);
        return res.status(500).json({success: false, message: 'Internal server error: ' + err});
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});