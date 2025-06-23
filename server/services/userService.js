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

const createUser = async (auth0_id, username, email, created_at, picture, isSocial) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('auth0_id', sql.NVarChar, auth0_id)
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('created_at', sql.DateTime, convertUTCStringToLocalDate(created_at).toISOString())
            .input('avatar', sql.NVarChar(sql.MAX), picture)
            .input('is_social', sql.Bit, isSocial)
            .query('INSERT INTO users (auth0_id, username, email, created_at, avatar, is_social) VALUES (@auth0_id, @username, @email, @created_at, @avatar, @is_social)');
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

const getUser = async (auth0_id) => {
    try {
        const user_id = await getUserIdFromAuth0Id(auth0_id)
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_id', user_id)
            .query('SELECT * FROM users WHERE user_id=@user_id');
        return result.recordset;
    } catch (error) {
        console.error('error in getUser', error);
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

async function updateUserByAuth0Id(auth0Id, {username, email, avatar}) {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('auth0_id', auth0Id)
            .input('username', username)
            .input('email', email)
            .input('avatar', avatar)
            .query(`
                UPDATE users
                SET username = @username,
                    email    = @email,
                    avatar   = @avatar
                WHERE auth0_id = @auth0_id
            `);

        return getUserByAuth0Id(auth0Id);
    } catch (err) {
        console.error('updateUserByAuth0Id error:', err);
        return null;
    }
}

const updateUserService = async (auth0_id, username = null, email = null, avatar = null) => {
    if (!username && !email && !avatar) {
        return false;
    }
    try {
        const updates = [];
        const inputs = {};

        if (username) {
            updates.push('username = @username');
            inputs.username = username;
        }
        if (email) {
            updates.push('email = @email');
            inputs.email = email;
        }
        if (avatar) {
            updates.push('avatar = @avatar');
            inputs.avatar = avatar;
        }

        const userId = await getUserIdFromAuth0Id(auth0_id);
        if (!userId) return false;

        const queryStr = `UPDATE users
                          SET ${updates.join(', ')}
                              OUTPUT INSERTED.is_social
                          WHERE user_id = @user_id`;

        const pool = await poolPromise;
        const request = pool.request().input('user_id', userId);

        for (const [key, value] of Object.entries(inputs)) {
            request.input(key, value);
        }

        const result = await request.query(queryStr);
        return result.recordset[0];
    } catch (error) {
        console.error('error in updateUserService', error);
        return null;
    }
}

module.exports = {
    userExists,
    createUser,
    getAllUsers,
    getUserIdFromAuth0Id,
    getUserCreationDateFromAuth0Id,
    getUser,
    updateUserService,
    getUserByAuth0Id,
    updateUserByAuth0Id
};