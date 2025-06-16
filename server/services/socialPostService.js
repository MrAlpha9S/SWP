const {poolPromise} = require("../configs/sqlConfig");


const getTotalPostCount = async () => {
    try {
        const pool = await poolPromise;

        const postCountResult = await pool
            .request()
            .query(`
                SELECT sc.category_id, sc.category_name, sc.description, sc.img_path, COUNT(sc.category_id) AS post_count
                FROM social_category sc,
                     social_posts sp
                WHERE sc.category_id = sp.category_id
                GROUP BY sc.category_id, sc.category_name, sc.description, sc.img_path
            `);

        return postCountResult.recordset;

    } catch (error) {
        console.error('error in userProfileExists', error);
        throw error;
    }
}

const getTotalCommentCount = async () => {
    try {
        const pool = await poolPromise;

        const commentCountResult = await pool
            .request()
            .query(`
                SELECT sc.category_id,
                       sc.category_name, sc.description, sc.img_path,
                       COUNT(scmt.comment_id) AS comment_count
                FROM social_category sc
                         JOIN social_posts sp ON sc.category_id = sp.category_id
                         JOIN social_comments scmt ON sp.post_id = scmt.post_id
                GROUP BY sc.category_id, sc.category_name, sc.description, sc.img_path
                ORDER BY sc.category_id
            `);

        return commentCountResult.recordset;

    } catch (error) {
        console.error('error in userProfileExists', error);
        throw error;
    }
}

module.exports = { getTotalPostCount, getTotalCommentCount };