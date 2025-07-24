const {DeleteComment, DeleteSocialPosts, ApprovePost, updateSocialPosts, GetIsPendingPosts, getTotalPostCount, getTotalCommentCount, getPostsByCategoryTag, getPosts, getPostComments, PostSocialPosts, PostAddComment, AddLike,
    getOwnerAuth0IdFromPostId,
    getPostOwnerInfoByPostId,
    getPostOwnerInfoByCommentId
} = require("../services/socialPostService");
const { processAchievementsWithNotifications } = require("../services/achievementService");
const {createNotificationService} = require("../services/notificationService");
const socket = require("../utils/socket");
const {getCurrentUTCDateTime} = require("../utils/dateUtils");

const handleDeleteComment = async (req, res) => {
    const {comment_id}  = req.body;
    console.log('handleDeleteComment:', comment_id)

    if (!comment_id) {
        return res.status(400).json({ success: false, message: 'error in handleDeleteComment: params is required', data: null });
    }

    try {
        const deleteSP = await DeleteComment(comment_id);
        if (!deleteSP) {
            return res.status(200).json({ success: true, message: 'Cant handleDeleteComment', data: null });
        }
        return res.status(200).json({ success: true, message: 'handleDeleteComment successfully', data: deleteSP });
    } catch (error) {
        console.error('Error in handleDeleteComment:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }
}

const handleApprovePost = async (req, res) => {
    const {post_id}  = req.body;

    if (!post_id) {
        return res.status(400).json({ success: false, message: 'error in handleApprovePost: params is required', data: null });
    }

    try {
        const update = await ApprovePost(post_id);
        if (!update) {
            return res.status(404).json({ success: false, message: 'Cant handleApprovePost', data: null });
        }
        return res.status(200).json({ success: true, message: 'handleApprovePost successfully', data: update });
    } catch (error) {
        console.error('Error in handleApprovePost:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }
}

const handleGetIsPendingPosts = async (req, res) => {
    try {
        const result = await GetIsPendingPosts();

        if (!result || result.length === 0) {
            return res.status(200).json({
                success: success,
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
}

const getPostAndCommentCount = async (req, res) => {

    try {
        const resultPostCount = await getTotalPostCount();
        const resultCommentCount = await getTotalCommentCount();

        if (!resultPostCount) {
            return res.status(404).json({ success: false, message: 'Failed to fetch posts count data', data: null });
        } else if (!resultCommentCount) {
            return res.status(404).json({ success: false, message: 'Failed to fetch comments count data', data: null });
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
        return res.status(500).json({ success: false, message: 'Internal server error: ' + err.message, data: null });
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
    const { categoryTag, keyword, page, fromDate, toDate, postId, auth0_id, currentUserId } = req.query;

    try {
        const result = await getPosts({ categoryTag, keyword, page, fromDate, toDate, postId, auth0_id, currentUserId });

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
        const result = await getPostComments({ postId, currentUserId });

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
    const { category_id, auth0_id, title, content, created_at } = req.body;

    if (!category_id || !auth0_id || !title || !content || !created_at) {
        return res.status(400).json({ success: false, message: 'error in handlePostSocialPosts: params is required', data: null });
    }

    try {
        const socialPosts = await PostSocialPosts(category_id, auth0_id, title, content, created_at);
        if (!socialPosts) {
            return res.status(404).json({ success: false, message: 'Cant handlePostSocialPosts', data: null });
        }
        await processAchievementsWithNotifications(auth0_id);
        return res.status(200).json({ success: true, message: 'handlePostSocialPosts successfully', data: socialPosts });
    } catch (error) {
        console.error('Error in handlePostSocialPosts:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }

}

const handleUpdateSocialPosts = async (req, res) => {
    const {post_id, category_id, title, content, created_at}  = req.body;

    if (!category_id || !post_id || !title || !content || !created_at) {
        return res.status(400).json({ success: false, message: 'error in handleUpdateSocialPosts: params is required', data: null });
    }

    try {
        const update = await updateSocialPosts(post_id, category_id, title, content, created_at);
        if (!update) {
            return res.status(404).json({ success: false, message: 'Cant handleUpdateSocialPosts', data: null });
        }
        return res.status(200).json({ success: true, message: 'handleUpdateSocialPosts successfully', data: update });
    } catch (error) {
        console.error('Error in handleUpdateSocialPosts:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }
}

const handleDeleteSocialPosts = async (req, res) => {
    const {post_id}  = req.body;

    if (!post_id) {
        return res.status(400).json({ success: false, message: 'error in handleDeleteSocialPosts: params is required', data: null });
    }

    try {
        const deleteSP = await DeleteSocialPosts(post_id);
        if (!deleteSP) {
            return res.status(404).json({ success: false, message: 'Cant handleDeleteSocialPosts', data: null });
        }
        return res.status(200).json({ success: true, message: 'handleDeleteSocialPosts successfully', data: deleteSP });
    } catch (error) {
        console.error('Error in handleDeleteSocialPosts:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }
}

const handleAddComment = async (req, res) => {
    const { parent_comment_id, auth0_id, post_id, content, created_at, is_reported } = req.body;

    if (!auth0_id || !post_id || !content || !created_at || is_reported === undefined) {
        return res.status(400).json({ success: false, message: 'error in handleAddComment: params is required', data: null });
    }

    try {
        const add = await PostAddComment(parent_comment_id, auth0_id, post_id, content, created_at, is_reported);
        if (!add) {
            return res.status(404).json({ success: false, message: 'Cant handleAddComment', data: null });
        }
        await processAchievementsWithNotifications(auth0_id);
        return res.status(200).json({ success: true, message: 'handleAddComment successfully', data: add });
    } catch (error) {
        console.error('Error in handleAddComment:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }

}

const handleAddLike = async (req, res) => {
    const { auth0_id, post_id, comment_id, created_at, username } = req.body;
    console.log('handleAddLike: ', auth0_id, post_id, comment_id, created_at)

    if (!auth0_id || !created_at === undefined) {
        return res.status(400).json({ success: false, message: 'error in handleAddLike: params is required', data: null });
    }

    try {
        const add = await AddLike(auth0_id, post_id, comment_id, created_at);
        if (!add) {
            return res.status(404).json({ success: false, message: 'Cant handleAddLike', data: null });
        }
        await processAchievementsWithNotifications(auth0_id);
        let ownerInfo = null
        if (post_id) {
            ownerInfo = await getPostOwnerInfoByPostId(post_id);
            await createNotificationService(ownerInfo.auth0_id, `Người dùng ${username} vừa thích bài viết của bạn.`, `Bài viết: ${ownerInfo.title}`, 'community', `/forum/${ownerInfo.category_tag}/${post_id}`)
            const io = socket.getIo()
            io.to(`${ownerInfo.auth0_id}`).emit('like', {
                likeOwner: username,
                postTitle: ownerInfo.title,
                from: `/forum/${ownerInfo.category_tag}/${post_id}`,
                timestamp: getCurrentUTCDateTime().toISOString()
            });
        } else if (comment_id) {
            ownerInfo = await getPostOwnerInfoByCommentId(comment_id);
            await createNotificationService(ownerInfo.commenter_auth0_id, `Người dùng ${username} vừa thích bình luận của bạn.`, `Bình luận: ${ownerInfo.content}`, 'community', `/forum/${ownerInfo.category_tag}/${ownerInfo.post_id}`)
            const io = socket.getIo()
            io.to(`${ownerInfo.commenter_auth0_id}`).emit('like', {
                likeOwner: username,
                commentContent: ownerInfo.content,
                from: `/forum/${ownerInfo.category_tag}/${ownerInfo.post_id}`,
                timestamp: getCurrentUTCDateTime().toISOString(),
                commentId: comment_id,
            });
        }


        return res.status(200).json({ success: true, message: 'handleAddLike successfully', data: add });
    } catch (error) {
        console.error('Error in handleAddLike:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }
}



module.exports = {handleDeleteComment, handleApprovePost, handleGetIsPendingPosts, handleDeleteSocialPosts, handleUpdateSocialPosts, getPostAndCommentCount, handleGetPostByCategory, handleGetPosts, handleGetPostComments, handlePostSocialPosts, handleAddComment, handleAddLike};
