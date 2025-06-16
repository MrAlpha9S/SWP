
const {getTotalPostCount, getTotalCommentCount} = require("../services/socialPostService");

const getPostAndCommentCount = async (req, res) => {

    try {
        const resultPostCount = await getTotalPostCount();
        const resultCommentCount = await getTotalCommentCount();

        if (!resultPostCount) {
            return res.status(404).json({success: false, message: 'Failed to fetch posts count data', data: null});
        } else if (!resultCommentCount) {
            return res.status(404).json({success: false, message: 'Failed to fetch comments count data', data: null});
        } else if (!resultCommentCount && !resultPostCount) {
            return res.status(404).json({success: false, message: 'Failed to fetch posts and comments count data', data: null});
        } else {
            const merged = resultPostCount.map(post => {
                const matchingComment = resultCommentCount.find(c => c.category_id === post.category_id);

                return {
                    category_id: post.category_id,
                    category_name: post.category_name,
                    description: post.description,
                    img_path: post.img_path,
                    post_count: post.post_count,
                    comment_count: matchingComment ? matchingComment.comment_count : 0
                };
            });
            return res.status(200).json({success: true, message: 'Success to fetch posts and comments count data', data: merged});
        }
    } catch (err) {
        console.error('getPostAndCommmentCount error:', err);
        return res.status(500).json({success: false, message: 'Internal server error: ' + err.message, data: null});
    }
}

module.exports = { getPostAndCommentCount };