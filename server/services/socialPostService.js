const {poolPromise, sql} = require("../configs/sqlConfig");


const getTotalPostCount = async () => {
    try {
        const pool = await poolPromise;

        const postCountResult = await pool
            .request()
            .query(`
                SELECT sc.category_id, sc.category_name, sc.description, sc.img_path, sc.category_tag, COUNT(sc.category_id) AS post_count
                FROM social_category sc,
                     social_posts sp
                WHERE sc.category_id = sp.category_id
                GROUP BY sc.category_id, sc.category_name, sc.description, sc.img_path, sc.category_tag
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
                       sc.category_name, sc.description, sc.img_path, sc.category_tag, COUNT(scmt.comment_id) AS comment_count
                FROM social_category sc
                         JOIN social_posts sp ON sc.category_id = sp.category_id
                         JOIN social_comments scmt ON sp.post_id = scmt.post_id
                GROUP BY sc.category_id, sc.category_name, sc.description, sc.img_path, sc.category_tag
                ORDER BY sc.category_id
            `);

        return commentCountResult.recordset;

    } catch (error) {
        console.error('error in userProfileExists', error);
        throw error;
    }
}

async function getPostsByCategoryTag(categoryTag) {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('categoryTag', sql.VarChar(50), categoryTag)
            .query(`
                SELECT 
                  sp.title,
                  sp.content,
                  sp.created_at,
                  sp.is_pinned,
                  sc.category_tag,
                  sc.category_name,
                  u.user_id,
                  u.username,
                  u.role,
                  u.avatar,
                  COUNT(DISTINCT sl.like_id) AS likes,
                  COUNT(DISTINCT scmt.comment_id) AS comments
                FROM social_posts sp
                JOIN social_category sc ON sc.category_id = sp.category_id
                LEFT JOIN social_likes sl ON sp.post_id = sl.post_id
                LEFT JOIN social_comments scmt ON sp.post_id = scmt.post_id
                JOIN users u ON sp.user_id = u.user_id
                WHERE sc.category_tag = @categoryTag
                GROUP BY 
                  sp.title, sp.content, sp.created_at, 
                  sc.category_tag, sc.category_name, 
                  u.user_id, u.username, u.role, sp.is_pinned, u.avatar
                ORDER BY sp.created_at DESC;
            `);

        return result.recordset;
    } catch (err) {
        console.error('Error fetching posts:', err);
        throw err;
    }
}


module.exports = { getTotalPostCount, getTotalCommentCount, getPostsByCategoryTag };