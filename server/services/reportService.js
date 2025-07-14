const { poolPromise, sql } = require("../configs/sqlConfig");
const { getUserIdFromAuth0Id } = require('./userService')

const AddReport = async (auth0_id, post_id = null, comment_id = null, reason, description, created_at) => {
    try {
        const pool = await poolPromise;
        const user_id = await getUserIdFromAuth0Id(auth0_id);
        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('post_id', sql.Int, post_id)
            .input('comment_id', sql.Int, comment_id)
            .input('reason', reason)
            .input('description', description)
            .input('created_at', sql.DateTime, created_at)
            .query(`INSERT INTO [social_reports] ([user_id], [post_id], [comment_id], [reason], [description], [created_at])
VALUES (@user_id, @post_id, @comment_id, @reason, @description, @created_at);
`);
        if (result.rowsAffected[0] === 0) {
            throw new Error('error in insert');
        }
        return true;
    } catch (err) {
        console.error('SQL error at AddReport', err);
        return false;
    }
}


module.exports = {AddReport}