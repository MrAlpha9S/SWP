const { poolPromise, sql } = require("../configs/sqlConfig");
const { getUserIdFromAuth0Id } = require('./userService')

const getTotalPostCount = async () => {
    try {
        const pool = await poolPromise;

        const postCountResult = await pool
            .request()
            .query(`
                SELECT sc.category_id, 
       sc.category_name, 
       sc.description, 
       sc.img_path, 
       sc.category_tag, 
       COUNT(sp.post_id) AS post_count
FROM social_category sc
         LEFT JOIN social_posts sp ON sc.category_id = sp.category_id AND sp.is_pending = 0
GROUP BY sc.category_id, sc.category_name, sc.description, sc.img_path, sc.category_tag
ORDER BY sc.category_id
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
       sc.category_name, 
       sc.description, 
       sc.img_path, 
       sc.category_tag, 
       COUNT(scmt.comment_id) AS comment_count
FROM social_category sc
         LEFT JOIN social_posts sp ON sc.category_id = sp.category_id AND sp.is_pending = 0
         LEFT JOIN social_comments scmt ON sp.post_id = scmt.post_id
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
                WHERE sc.category_tag = @categoryTag AND sp.is_pending = 0
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

async function getPosts({ categoryTag = null, keyword = null, page = 1, pageSize = 4, fromDate = null, toDate = null, postId = null, auth0_id = null, currentUserId = null }) {
    try {
        const pool = await poolPromise;
        const offset = (page - 1) * pageSize;

        const filters = [];
        const request = pool.request();

        // Handle currentUserId (auth0_id) for isLiked check
        if (currentUserId) {
            const currentUserIdInt = await getUserIdFromAuth0Id(currentUserId);
            request.input('currentUserId', sql.Int, currentUserIdInt);
        } else {
            // If no user context, set to 0 so no posts show as liked
            request.input('currentUserId', sql.Int, 0);
        }

        if (auth0_id) {
            const user_id = await getUserIdFromAuth0Id(auth0_id);
            filters.push(`u.user_id = @user_id`);
            request.input('user_id', sql.Int, user_id);
        }

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
        filters.push(`sp.is_pending = 0`);
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
              u.user_id, u.username, u.role, u.avatar, u.auth0_id,
              sc.category_id,
              COUNT(DISTINCT sl.like_id) AS likes,
              COUNT(DISTINCT scmt.comment_id) AS comments,
              CASE 
                WHEN MAX(CASE WHEN sl.user_id = @currentUserId THEN 1 ELSE 0 END) = 1 
                THEN 1 
                ELSE 0 
              END AS isLiked
            FROM social_posts sp
            JOIN social_category sc ON sc.category_id = sp.category_id
            LEFT JOIN social_likes sl ON sp.post_id = sl.post_id
            LEFT JOIN social_comments scmt ON sp.post_id = scmt.post_id
            JOIN users u ON sp.user_id = u.user_id
            ${whereClause}
            GROUP BY 
              sp.title, sp.content, sp.created_at, sp.is_pinned,
              sc.category_tag, sc.category_name, u.auth0_id,
              u.user_id, u.username, u.role, u.avatar, sp.post_id,
              sc.category_id
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

const getPostComments = async ({ postId, currentUserId = null }) => {
    try {
        const pool = await poolPromise;
        const request = pool.request()
            .input('postId', sql.Int, postId);

        // Handle currentUserId for isLiked check
        if (currentUserId) {
            const currentUserIdInt = await getUserIdFromAuth0Id(currentUserId);
            request.input('currentUserId', sql.Int, currentUserIdInt);
        } else {
            // If no user context, set to 0 so no comments show as liked
            request.input('currentUserId', sql.Int, 0);
        }

        const result = await request.query(`
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
                   u.username, u.avatar, u.auth0_id,
                   u.role,
                   COALESCE(COUNT(sl.like_id), 0) AS like_count,
                   CASE 
                     WHEN MAX(CASE WHEN sl.user_id = @currentUserId THEN 1 ELSE 0 END) = 1 
                     THEN 1 
                     ELSE 0 
                   END AS isLiked
            FROM CommentTree ct
                     LEFT JOIN users u ON ct.user_id = u.user_id
                     LEFT JOIN social_likes sl ON ct.comment_id = sl.comment_id
            GROUP BY ct.comment_id, ct.parent_comment_id, ct.post_id, ct.user_id,
                     ct.content, ct.created_at, ct.depth, u.username, u.avatar,
                     u.role, u.auth0_id
            ORDER BY ct.created_at;
        `);

        return result.recordset || null;
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

const PostSocialPosts = async (category_id, auth0_id, title, content, created_at) => {
    try {
        const pool = await poolPromise;
        const user_id = await getUserIdFromAuth0Id(auth0_id);
        const result = await pool.request()
            .input('postId', sql.Int, category_id)
            .input('user_id', sql.Int, user_id)
            .input('title', title)
            .input('content', content)
            .input('created_at', sql.DateTime, created_at)
            .query(`INSERT INTO [social_posts] ([category_id], [user_id], [title], [content], [created_at])
VALUES (@postId, @user_id, @title, @content, @created_at);
`);
        if (result.rowsAffected[0] === 0) {
            throw new Error('error in insert');
        }
        return true;
    } catch (err) {
        console.error('SQL error at PostSocialPosts', err);
        return false;
    }
}

const updateSocialPosts = async (post_id, category_id, title, content, created_at) => {
    console.log('UpdateSocialPosts backend: ', post_id, category_id, title, content, created_at)
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('post_id', sql.Int, post_id)
            .input('category_id', sql.Int, category_id)
            .input('title', title)
            .input('content', content)
            .input('created_at', sql.DateTime, created_at)
            .query(`UPDATE social_posts 
SET category_id = @category_id, title = @title, content = @content, created_at = @created_at, is_pending = 1
WHERE post_id = @post_id
`);
        if (result.rowsAffected[0] === 0) {
            throw new Error('error in insert');
        }
        return true;
    } catch (err) {
        console.error('SQL error at UpdateSocialPosts', err);
        return false;
    }
}

const DeleteSocialPosts = async (post_id) => {
    console.log('DeleteSocialPosts backend: ', post_id)
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('post_id', sql.Int, post_id)
            .query(`
                DELETE
                FROM social_likes
                WHERE comment_id IN (SELECT comment_id
                                     FROM social_comments
                                     WHERE post_id = @post_id);

                DELETE
                FROM social_likes
                WHERE post_id = @post_id;

                DELETE
                FROM social_reports
                WHERE comment_id IN (SELECT comment_id
                                     FROM social_comments
                                     WHERE post_id = @post_id);

                DELETE
                FROM social_comments
                WHERE post_id = @post_id;

                DELETE
                FROM social_posts
                WHERE post_id = @post_id;
            `);
        return true;
    } catch (err) {
        console.error('SQL error at DeleteSocialPosts', err);
        return false;
    }
}

const PostAddComment = async (parent_comment_id, auth0_id, post_id, content, created_at, is_reported) => {
    try {
        const pool = await poolPromise;
        const user_id = await getUserIdFromAuth0Id(auth0_id);
        const result = await pool.request()
            .input('parent_comment_id', sql.Int, null, parent_comment_id)
            .input('user_id', sql.Int, user_id)
            .input('post_id', sql.Int, post_id)
            .input('content', content)
            .input('created_at', sql.DateTime, created_at)
            .input('is_reported', sql.Int, is_reported)
            .query(`INSERT INTO [social_comments] ([parent_comment_id], [user_id], [post_id], [content], [created_at], [is_reported])
VALUES (@parent_comment_id, @user_id, @post_id, @content, @created_at, @is_reported);
`);
        if (result.rowsAffected[0] === 0) {
            throw new Error('error in insert');
        }
        return true;
    } catch (err) {
        console.error('SQL error at PostSocialPosts', err);
        return false;
    }
}
const getAllSocialPosts = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT * from social_posts`)
        return result.recordset;
    } catch (err) {
        console.error('getAllPosts error', err);
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
const AddLike = async ( auth0_id, post_id = null, comment_id = null, created_at ) => {
    try {
        const pool = await poolPromise;
        const user_id = await getUserIdFromAuth0Id(auth0_id);
        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('post_id', sql.Int, post_id)
            .input('comment_id', sql.Int, comment_id)
            .input('created_at', sql.DateTime, created_at)
            .query(`INSERT INTO [social_likes] ([user_id], [post_id], [comment_id], [created_at]) VALUES
(@user_id, @post_id, @comment_id, @created_at);
`);
        if (result.rowsAffected[0] === 0) {
            throw new Error('error in insert');
        }
        return true;
    } catch (err) {
        console.error('SQL error at PostSocialPosts', err);
        return false;
    }
}

const getPostOwnerInfoByPostId = async (post_id) => {
    if (!post_id) return null;

    const query = `
        SELECT u.auth0_id, u.username, sp.title, sc.category_tag
        FROM users u
        JOIN social_posts sp ON u.user_id = sp.user_id
        JOIN social_category sc ON sp.category_id = sc.category_id
        WHERE sp.post_id = @post_id
    `;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('post_id', sql.Int, post_id)
            .query(query);

        return result.recordset[0];
    } catch (error) {
        console.error('getPostOwnerInfoByPostId', error);
        return null;
    }
};

const getPostOwnerInfoByCommentId = async (comment_id) => {
    if (!comment_id) return null;

    const query = `
        SELECT 
          postOwner.auth0_id AS post_owner_auth0_id,
          postOwner.username AS post_owner_username,
          commenter.auth0_id AS commenter_auth0_id,
          commenter.username AS commenter_username,
          sp.title AS post_title,
          sc.category_tag,
          cmt.content,
          sp.post_id
        FROM social_comments cmt
        JOIN social_posts sp ON cmt.post_id = sp.post_id
        JOIN users postOwner ON sp.user_id = postOwner.user_id
        JOIN users commenter ON cmt.user_id = commenter.user_id
        JOIN social_category sc ON sp.category_id = sc.category_id
        WHERE cmt.comment_id = @comment_id
    `;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('comment_id', sql.Int, comment_id)
            .query(query);

        return result.recordset[0];
    } catch (error) {
        console.error('getPostOwnerInfoByCommentId', error);
        return null;
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

const GetIsPendingPosts = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT sp.post_id, sc.category_name, u.user_id, u.username, sp.title, sp.content, sp.created_at, sp.is_pinned, sp.is_reported, sp.is_pending FROM social_posts sp
Join social_category sc ON sc.category_id = sp.category_id
Join users u ON u.user_id = sp.user_id
WHERE sp.is_pending = 1
`);
        return result;
    } catch (err) {
        console.error('SQL error at GetIsPendingPosts', err);
        return [];
    }
}

const ApprovePost = async (post_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('post_id', sql.Int, post_id)
            .query(`UPDATE social_posts
SET is_pending = 0
WHERE post_id = @post_id
`);
        if (result.rowsAffected[0] === 0) {
            throw new Error('error in ApprovePost');
        }
        return result;
    } catch (err) {
        console.error('SQL error at ApprovePost', err);
        return [];
    }
}

const DeleteComment = async (comment_id) => {
    console.log('DeleteComment:', comment_id)
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('comment_id', sql.Int, comment_id)
            .query(`DELETE FROM social_comments
WHERE parent_comment_id = @comment_id;

DELETE FROM social_likes 
WHERE comment_id = @comment_id;

DELETE FROM social_comments 
WHERE comment_id = @comment_id;

DELETE FROM social_reports
WHERE comment_id = @comment_id;
`);
        if (result.rowsAffected[0] === 0) {
            throw new Error('error in DeleteComment');
        }
        return true;
    } catch (err) {
        console.error('SQL error at DeleteComment', err);
        return false;
    }
}


module.exports = { getPostOwnerInfoByPostId, getPostOwnerInfoByCommentId, DeleteComment, ApprovePost, DeleteSocialPosts, getAllSocialPosts, updateSocialPosts, GetIsPendingPosts, deletePostById, getAllComments, deleteCommentById, getTotalPostCount, getTotalCommentCount, getPostsByCategoryTag, getPosts, getPostComments, PostSocialPosts, PostAddComment, AddLike };