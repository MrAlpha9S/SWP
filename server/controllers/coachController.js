const {getSubscribedUsers} = require("../services/coachService");
const {getAllBlogPostsOfUser} = require("../services/blogService");
const {getAllSocialPosts} = require("../services/socialPostService");

const getDashboardStats = async (req, res) => {
    const { userAuth0Id } = req.params;
    if (!userAuth0Id) {
        return res.status(400).json({ success: false, message: 'error in getDashboardStats: userAuth0Id is required', data: null });
    }
    try {
        const subscribedUsers = await getSubscribedUsers(userAuth0Id);
        const blogPosts = await getAllBlogPostsOfUser(userAuth0Id);
        const socialPosts = await getAllSocialPosts()
        const subscribedUserCount = subscribedUsers.length
        let totalCommission = 0
        for (const subscribedUser of subscribedUsers) {
            totalCommission += subscribedUser.price
        }
        let approvedBlogPostCount = 0
        let pendingBlogPostCount = 0
        for (const blogPost of blogPosts) {
            if (blogPost.isPendingForApprovement) pendingBlogPostCount += 1
            else approvedBlogPostCount += 1
        }
        let pendingSocialPostCount = 0
        let reportCount = 0
        for (const socialPost of socialPosts) {
            if (socialPost.is_pending) pendingSocialPostCount += 1
            if (!socialPost.is_pending && socialPost.is_reported) reportCount += 1
        }
        const data = {
            subscribedUsers : subscribedUsers,
            blogPosts : blogPosts,
            subscribedUserCount : subscribedUserCount,
            totalCommission : totalCommission,
            approvedBlogPostCount : approvedBlogPostCount,
            pendingBlogPostCount : pendingBlogPostCount,
            reportCount : reportCount,
            pendingSocialPostCount : pendingSocialPostCount,
        }
        return res.status(200).json({ success: true, message: 'getDashboardStats successful', data: data });
    } catch (error) {
        console.error('Error in HandleCreateConversation:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }
}

module.exports = {getDashboardStats}