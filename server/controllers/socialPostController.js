const {getTotalPostCount, getTotalCommentCount, getPostsByCategoryTag, getPosts, getPostComments, PostSocialPosts, PostAddComment, AddLike} = require("../services/socialPostService");

const getPostAndCommentCount = async (req, res) => {

    try {
        const resultPostCount = await getTotalPostCount();
        const resultCommentCount = await getTotalCommentCount();

        if (!resultPostCount) {
            return res.status(404).json({success: false, message: 'Failed to fetch posts count data', data: null});
        } else if (!resultCommentCount) {
            return res.status(404).json({success: false, message: 'Failed to fetch comments count data', data: null});
        } else if (!resultCommentCount && !resultPostCount) {
            return res.status(404).json({
                success: false,
                message: 'Failed to fetch posts and comments count data',
                data: null
            });
        } else {
            const merged = resultPostCount.map(post => {
                const matchingComment = resultCommentCount.find(c => c.category_id === post.category_id);

                return {
                    category_id: post.category_id,
                    category_name: post.category_name,
                    category_tag: post.category_tag,
                    description: post.description,
                    img_path: post.img_path,
                    post_count: post.post_count,
                    comment_count: matchingComment ? matchingComment.comment_count : 0
                };
            });
            return res.status(200).json({
                success: true,
                message: 'Success to fetch posts and comments count data',
                data: merged
            });
        }
    } catch (err) {
        console.error('getPostAndCommmentCount error:', err);
        return res.status(500).json({success: false, message: 'Internal server error: ' + err.message, data: null});
    }
}

const handleGetPostByCategory = async (req, res) => {
    const { category_tag } = req.params;

    if (!category_tag) {
        return res.status(400).json({
            success: false,
            message: 'Missing category tag in request',
            data: null
        });
    }

    try {
        const result = await getPostsByCategoryTag(category_tag);

        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No posts found for this category',
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully fetched posts by category',
            data: result
        });

    } catch (err) {
        console.error('handleGetPostByCategory error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error: ' + err.message,
            data: null
        });
    }
};

const handleGetPosts = async (req, res) => {
    const { categoryTag, keyword, page, fromDate, toDate, postId, auth0_id, currentUserId} = req.query;

    try {
        const result = await getPosts({categoryTag, keyword, page, fromDate, toDate, postId, auth0_id, currentUserId});

        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No posts found',
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully fetched posts',
            data: result
        });

    } catch (err) {
        console.error('handleGetPosts error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error: ' + err.message,
            data: null
        });
    }
};

const handleGetPostComments = async (req, res) => {
    const { postId, currentUserId } = req.params;

    try {
        const result = await getPostComments({postId, currentUserId});

        if (!result || result.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No comments found',
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully fetched comments',
            data: result
        });

    } catch (err) {
        console.error('handleGetPostComments error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error: ' + err.message,
            data: null
        });
    }
};

const handlePostSocialPosts = async (req, res) => {
    const {category_id, auth0_id, title, content, created_at}  = req.body;

    if (!category_id || !auth0_id || !title || !content || !created_at) {
        return res.status(400).json({ success: false, message: 'error in handlePostSocialPosts: params is required', data: null });
    }

    try {
        const socialPosts = await PostSocialPosts(category_id, auth0_id, title, content, created_at);
        if (!socialPosts) {
            return res.status(404).json({ success: false, message: 'Cant handlePostSocialPosts', data: null });
        }
        return res.status(200).json({ success: true, message: 'handlePostSocialPosts successfully', data: socialPosts });
    } catch (error) {
        console.error('Error in handleGetBlog:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }

}

const handleAddComment = async (req, res) => {
    const {parent_comment_id, auth0_id, post_id, content, created_at, is_reported}  = req.body;

    if (!auth0_id || !post_id || !content || !created_at || is_reported === undefined) {
        return res.status(400).json({ success: false, message: 'error in handleAddComment: params is required', data: null });
    }

    try {
        const add = await PostAddComment(parent_comment_id, auth0_id, post_id, content, created_at, is_reported);
        if (!add) {
            return res.status(404).json({ success: false, message: 'Cant handleAddComment', data: null });
        }
        return res.status(200).json({ success: true, message: 'handleAddComment successfully', data: add });
    } catch (error) {
        console.error('Error in handleAddComment:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }

}

const handleAddLike = async (req, res) => {
    const {auth0_id, post_id, comment_id, created_at}  = req.body;
    console.log('handleAddLike: ', auth0_id, post_id, comment_id, created_at)

    if (!auth0_id || !created_at === undefined) {
        return res.status(400).json({ success: false, message: 'error in handleAddLike: params is required', data: null });
    }

    try {
        const add = await AddLike(auth0_id, post_id, comment_id, created_at);
        if (!add) {
            return res.status(404).json({ success: false, message: 'Cant handleAddLike', data: null });
        }
        return res.status(200).json({ success: true, message: 'handleAddLike successfully', data: add });
    } catch (error) {
        console.error('Error in handleAddLike:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }

}



module.exports = {getPostAndCommentCount, handleGetPostByCategory, handleGetPosts, handleGetPostComments, handlePostSocialPosts, handleAddComment, handleAddLike};