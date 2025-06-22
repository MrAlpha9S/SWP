const {poolPromise, sql} = require("../configs/sqlConfig");
const {convertUTCStringToLocalDate} = require("../utils/dateUtils");

const userExists = async (auth0_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('auth0_id', auth0_id)
            .query('SELECT * FROM users WHERE auth0_id = @auth0_id');
        return result.recordset.length > 0;
    } catch (error) {
        console.error('error in userExists', error);
        return false;
    }
};

const createUser = async (auth0_id, username, email, created_at, picture) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('auth0_id', sql.NVarChar, auth0_id)
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('created_at', sql.DateTime, convertUTCStringToLocalDate(created_at).toISOString())
            .input('avatar', sql.NVarChar(sql.MAX), picture)
            .query('INSERT INTO users (auth0_id, username, email, created_at, avatar) VALUES (@auth0_id, @username, @email, @created_at, @avatar)');
        return true;
    } catch (error) {
        console.error('error in createUser', error);
        return false;
    }
};

const getAllUsers = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM users');
        return result.recordset;
    } catch (error) {
        console.error('error in getAllUsers', error);
        return [];
    }
}

const getUserIdFromAuth0Id = async (auth0_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('auth0_id', auth0_id)
            .query('SELECT user_id from users WHERE auth0_id = @auth0_id');
        return result.recordset[0].user_id;
    } catch (error) {
        console.error('error in getUserIdFromAuth0Id', error);
        return null;
    }
}

const getUserCreationDateFromAuth0Id = async (auth0_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('auth0_id', auth0_id)
            .query('SELECT created_at from users WHERE auth0_id = @auth0_id');
        return result.recordset[0].created_at;
    } catch (error) {
        console.error('error in getUserIdFromAuth0Id', error);
        return null;
    }
}

async function getUserByAuth0Id(auth0Id) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('auth0_id', auth0Id)
            .query('SELECT * FROM users WHERE auth0_id = @auth0_id');

        return result.recordset[0];
    } catch (err) {
        console.error('getUserByAuth0Id error:', err);
        return null;
    }
}

async function updateUserByAuth0Id(auth0Id, { username, email, avatar }) {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('auth0_id', auth0Id)
            .input('username', username)
            .input('email', email)
            .input('avatar', avatar)
            .query(`
                UPDATE users
                SET username = @username, email = @email, avatar = @avatar
                WHERE auth0_id = @auth0_id
            `);

        return getUserByAuth0Id(auth0Id);
    } catch (err) {
        console.error('updateUserByAuth0Id error:', err);
        return null;
    }
}

module.exports = {userExists, createUser, getAllUsers, getUserIdFromAuth0Id, getUserCreationDateFromAuth0Id, getUserByAuth0Id, updateUserByAuth0Id};
