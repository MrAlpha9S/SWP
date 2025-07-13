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

async function getPosts({ categoryTag = null, keyword = null, page = 1, pageSize = 4, fromDate = null, toDate = null, postId = null }) {
    try {
        const pool = await poolPromise;
        const offset = (page - 1) * pageSize;

        const filters = [];
        const request = pool.request();

        if (categoryTag) {
            filters.push(`sc.category_tag = @categoryTag`);
            request.input('categoryTag', sql.VarChar(50), categoryTag);
        }

        if (keyword) {
            filters.push(`(sp.title LIKE @keyword OR sp.content LIKE @keyword OR u.username LIKE @keyword)`);
            request.input('keyword', sql.NVarChar, `%${keyword}%`);
        }

        if (fromDate) {
            filters.push(`sp.created_at >= @fromDate`);
            request.input('fromDate', sql.DateTime, new Date(fromDate));
        }

        if (toDate) {
            filters.push(`sp.created_at <= @toDate`);
            request.input('toDate', sql.DateTime, new Date(toDate));
        }

        if (postId) {
            filters.push(`sp.post_id = @postId`);
            request.input('postId', sql.Int, postId);
        }

        const whereClause = filters.length ? 'WHERE ' + filters.join(' AND ') : '';

        const countResult = await request.query(`
            SELECT COUNT(DISTINCT sp.post_id) AS total
            FROM social_posts sp
            JOIN social_category sc ON sc.category_id = sp.category_id
            JOIN users u ON sp.user_id = u.user_id
            ${whereClause}
        `);

        const total = countResult.recordset[0].total;

        request.input('offset', sql.Int, offset);
        request.input('pageSize', sql.Int, pageSize);

        const dataResult = await request.query(`
            SELECT 
              sp.post_id, sp.title, sp.content, sp.created_at, sp.is_pinned,
              sc.category_tag, sc.category_name,
              u.user_id, u.username, u.role, u.avatar,
              COUNT(DISTINCT sl.like_id) AS likes,
              COUNT(DISTINCT scmt.comment_id) AS comments
            FROM social_posts sp
            JOIN social_category sc ON sc.category_id = sp.category_id
            LEFT JOIN social_likes sl ON sp.post_id = sl.post_id
            LEFT JOIN social_comments scmt ON sp.post_id = scmt.post_id
            JOIN users u ON sp.user_id = u.user_id
            ${whereClause}
            GROUP BY 
              sp.title, sp.content, sp.created_at, sp.is_pinned,
              sc.category_tag, sc.category_name,
              u.user_id, u.username, u.role, u.avatar, sp.post_id
            ORDER BY sp.created_at DESC
            OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
        `);

        return {
            records: dataResult.recordset,
            total,
            page,
            pageSize
        };

    } catch (err) {
        console.error('Error fetching posts:', err);
        throw err;
    }
}

const getPostComments = async (postId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('postId', sql.Int, postId)
            .query(`
                WITH CommentTree AS (SELECT scmt.comment_id,
                                            scmt.parent_comment_id,
                                            scmt.post_id,
                                            scmt.user_id,
                                            scmt.content,
                                            scmt.created_at,
                                            CAST(0 AS INT) AS depth
                                     FROM social_comments scmt
                                     WHERE scmt.post_id = @postId
                                       AND scmt.parent_comment_id IS NULL

                                     UNION ALL

                                     SELECT scmt.comment_id,
                                            scmt.parent_comment_id,
                                            scmt.post_id,
                                            scmt.user_id,
                                            scmt.content,
                                            scmt.created_at,
                                            ct.depth + 1
                                     FROM social_comments scmt
                                              INNER JOIN CommentTree ct ON scmt.parent_comment_id = ct.comment_id)
                SELECT ct.*,
                       u.username, u.avatar,
                       u.role,
                       COALESCE(COUNT(sl.like_id), 0) AS like_count
                FROM CommentTree ct
                         LEFT JOIN users u ON ct.user_id = u.user_id
                         LEFT JOIN social_likes sl ON ct.comment_id = sl.comment_id
                GROUP BY ct.comment_id, ct.parent_comment_id, ct.post_id, ct.user_id,
                         ct.content, ct.created_at, ct.depth, u.username, u.avatar,
                         u.role
                ORDER BY ct.created_at;
            `);

        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

// Xóa bài viết theo post_id
const deletePostById = async (post_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('post_id', sql.Int, post_id)
            .query('DELETE FROM social_posts WHERE post_id = @post_id');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('error in deletePostById', error);
        return false;
    }
};

// Lấy tất cả bình luận
const getAllComments = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM social_comments');
        return result.recordset;
    } catch (error) {
        console.error('error in getAllComments', error);
        return [];
    }
};

// Xóa bình luận theo comment_id
const deleteCommentById = async (comment_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('comment_id', sql.Int, comment_id)
            .query('DELETE FROM social_comments WHERE comment_id = @comment_id');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('error in deleteCommentById', error);
        return false;
    }
};


module.exports = { getTotalPostCount, getTotalCommentCount, getPostsByCategoryTag, getPosts, getPostComments, deletePostById, getAllComments, deleteCommentById };