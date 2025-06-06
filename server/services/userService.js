const {poolPromise, sql} = require("../configs/sqlConfig");

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

const createUser = async (auth0_id, username, email) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('auth0_id', sql.NVarChar, auth0_id)
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .query('INSERT INTO users (auth0_id, username, email) VALUES (@auth0_id, @username, @email)');
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
        console.log('id from auth0 id', result.recordset[0].user_id);
        return result.recordset[0].user_id;
    } catch (error) {
        console.error('error in getUserIdFromAuth0Id', error);
        return null;
    }
}

module.exports = {userExists, createUser, getAllUsers, getUserIdFromAuth0Id};
