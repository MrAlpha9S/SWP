const {getTotalPostCount, getTotalCommentCount, getPostsByCategoryTag} = require("../services/socialPostService");

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


module.exports = {getPostAndCommentCount, handleGetPostByCategory};