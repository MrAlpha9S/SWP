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

const GetReports = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT sr.report_id, u_post_author.auth0_id as post_author_auth0_id, u_comment_author.auth0_id as comment_author_auth0_id, sr.reason, sp.post_id, sc.comment_id, u_reporter.username AS reporter, sr.created_at AS report_time, u_post_author.username AS post_author, u_comment_author.username AS comment_author,
sp.title AS post_title, sp.content AS post_content, sp.created_at AS post_created_at,
sc.content AS comment_content, sc.created_at AS comment_created_at
FROM social_reports sr
LEFT JOIN social_posts sp ON sr.post_id = sp.post_id
LEFT JOIN social_comments sc ON sr.comment_id = sc.comment_id
LEFT JOIN users u_reporter ON u_reporter.user_id = sr.user_id
LEFT JOIN users u_post_author ON u_post_author.user_id = sp.user_id
LEFT JOIN users u_comment_author ON u_comment_author.user_id = sc.user_id
`);
        // if (result.rowsAffected[0] === 0) {
        //     throw new Error('error in GetReports');
        // }
        return result.recordsets;
    } catch (err) {
        console.error('SQL error at GetReports', err);
        return [];
    }
}

const DeleteReport = async (report_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('report_id', sql.Int, report_id)
            .query(`DELETE social_reports
WHERE report_id = @report_id
`);
        if (result.rowsAffected[0] === 0) {
            throw new Error('error in GetReports');
        }
        return result.recordsets;
    } catch (err) {
        console.error('SQL error at GetReports', err);
        return [];
    }
}

module.exports = { DeleteReport, GetReports, AddReport }