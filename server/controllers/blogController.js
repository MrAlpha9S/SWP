const { Blog, PostBlog } = require('../services/blogService');


const handleGetBlog = async (req, res) => {
    const topic_id  = req.params.topic_id;
    const blog_id = req.params.blog_id;
    if (!topic_id || !blog_id) {
        return res.status(400).json({ success: false, message: 'topic_id, blog_id is required', data: null });
    }

    try {
        const blog = await Blog(topic_id, blog_id);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found', data: null });
        }
        return res.status(200).json({ success: true, message: 'Blog fetched successfully', data: blog });
    } catch (error) {
        console.error('Error in handleGetBlog:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }

}

const handlePostBlog = async (req, res) => {
    const auth0_id  = req.body.auth0_id;
    const topic = req.body.topic;
    const title = req.body.title;
    const description = req.body.description;
    const content = req.body.content;
    const created_at = req.body.created_at;

    console.log(req.body)

    if (!auth0_id || !topic || !title || !description || !content || !created_at) {
        return res.status(400).json({ success: false, message: 'error in handlePostBlog: params is required', data: null });
    }

    try {
        const blog = await PostBlog(auth0_id, topic, title, description, content, created_at);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Cant Post Blog', data: null });
        }
        return res.status(200).json({ success: true, message: 'Blog posted successfully', data: blog });
    } catch (error) {
        console.error('Error in handleGetBlog:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }

}

module.exports = {
    handleGetBlog,
    handlePostBlog
};