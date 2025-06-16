const {poolPromise} = require("../configs/sqlConfig");

const Blog = async (topic_id, blog_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('topic_id', topic_id)
            .input('blog_id', blog_id)
            .query('select * from blog_posts where topic_id = @topic_id AND blog_id = @blog_id');
        return result.recordset[0];
    } catch (error) {
        console.error('error in blog', error);
        return false;
    }
};

module.exports = {Blog};