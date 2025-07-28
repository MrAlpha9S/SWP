const { getBlog, Blog, PostBlog, getAllBlogPostsOfUser} = require('../services/blogService');


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

const handleGetPostedBlog = async (req, res) => {
    const {auth0_id}  = req.body;

    if (!auth0_id) {
        return res.status(400).json({ success: false, message: 'error in handleGetBlog: params is required', data: null });
    }

    try {
        const blog = await getBlog(auth0_id);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Cant get Blog', data: null });
        }
        return res.status(200).json({ success: true, message: 'Blog fetched successfully', data: blog });
    } catch (error) {
        console.error('Error in handleGetBlog:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }

}

const handlePostBlog = async (req, res) => {
    const {auth0_id, topic, title, description, content, created_at}  = req.body;
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

const handleGetPostsOfUser = async (req, res) => {
    const { userAuth0Id } = req.params;

    console.log(userAuth0Id)
    if (!userAuth0Id) {
        return res.status(400).json({ success: false, message: 'userAuth0Id is required', data: [] });
    }

    try {
        const posts = await getAllBlogPostsOfUser(userAuth0Id);
        if (!posts || posts.length === 0) {
            return res.status(404).json({ success: false, message: 'No posts found for this user', data: [] });
        }
        return res.status(200).json({ success: true, data: posts });
    } catch (error) {
        console.error('Error in handleGetPostsFOfUser:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }
}

module.exports = {
    handleGetPostedBlog,
    handleGetBlog,
    handlePostBlog,
    handleGetPostsOfUser
};