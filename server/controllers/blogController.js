const { Blog } = require('../services/blogService');

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

module.exports = {
    handleGetBlog
};