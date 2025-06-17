const {poolPromise} = require("../configs/sqlConfig");
const {getUserIdFromAuth0Id} = require('./userService')

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

const PostBlog = async (auth0_id, topic, title, description, content, created_at) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_id', await getUserIdFromAuth0Id(auth0_id))
            .input('topic_id', topic)
            .input('title', title)
            .input('description', description)
            .input('content', content)
            .input('created_at', created_at)
            .query(`INSERT INTO [blog_posts] ([title], [description], [content], [user_id], [topic_id], [created_at]) 
                VALUES (@title, @description, @content, @user_id, @topic_id, @created_at);`);
        if(result.rowsAffected[0] === 0) {
            throw new Error('error in insert');
        }
        return true;
    } catch (error) {
        console.error('error in PostBlog', error);
        return false;
    }
};

module.exports = {Blog, PostBlog};