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
            totalCommission += subscribedUser.amount
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

const getUserCommissionDataset = async (req, res) => {
    const { userAuth0Id } = req.params;
    const { month, year, commissionRate } = req.query;

    if (!userAuth0Id || !commissionRate) {
        return res.status(400).json({
            success: false,
            message: 'userAuth0Id and commissionRate are required',
            data: null,
        });
    }

    try {
        const subscribedUsers = await getSubscribedUsers(userAuth0Id);

        // Extract unique months and years
        const monthsSet = new Set();
        const yearsSet = new Set();

        subscribedUsers.forEach((user) => {
            const date = new Date(user.created_at);
            monthsSet.add(date.getUTCMonth() + 1); // 1–12
            yearsSet.add(date.getUTCFullYear());
        });

        const arrayOfMonths = Array.from(monthsSet).sort((a, b) => a - b);
        const arrayOfYears = Array.from(yearsSet).sort((a, b) => a - b);

        // Prepare chart data
        const chartMap = new Map();
        const inputMonth = month ? parseInt(month, 10) : null;
        const inputYear = year ? parseInt(year, 10) : null;

        subscribedUsers.forEach((user) => {
            const startedDate = new Date(user.created_at);
            const userMonth = startedDate.getUTCMonth(); // 0–11
            const userYear = startedDate.getUTCFullYear();

            const matchesMonth = inputMonth !== null ? userMonth === inputMonth - 1 : true;
            const matchesYear = inputYear !== null ? userYear === inputYear : true;

            if (matchesMonth && matchesYear) {
                const day = String(startedDate.getUTCDate()).padStart(2, '0');
                const monthStr = String(userMonth + 1).padStart(2, '0');

                const key = inputMonth
                    ? `${day}/${monthStr}` // daily
                    : `${monthStr}/${userYear}`; // monthly

                if (!chartMap.has(key)) {
                    chartMap.set(key, { users: 0, commission: 0 });
                }

                const current = chartMap.get(key);
                chartMap.set(key, {
                    users: current.users + 1,
                    commission: current.commission + parseFloat(user.amount),
                });
            }
        });

        // Fill in 0-value placeholders
        if (inputMonth && inputYear) {
            const daysInMonth = new Date(inputYear, inputMonth, 0).getUTCDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const dayStr = String(d).padStart(2, '0');
                const monthStr = String(inputMonth).padStart(2, '0');
                const key = `${dayStr}/${monthStr}`;
                if (!chartMap.has(key)) {
                    chartMap.set(key, { users: 0, commission: 0 });
                }
            }
        }

        if (!inputMonth && inputYear) {
            for (let m = 1; m <= 12; m++) {
                const monthStr = String(m).padStart(2, '0');
                const key = `${monthStr}/${inputYear}`;
                if (!chartMap.has(key)) {
                    chartMap.set(key, { users: 0, commission: 0 });
                }
            }
        }

        // Convert map to sorted array
        const chartData = Array.from(chartMap.entries())
            .map(([date, values]) => ({
                date,
                users: values.users,
                commission: values.commission,
            }))
            .sort((a, b) => {
                // Supports both dd/mm and mm/yyyy
                const [a1, a2] = a.date.split('/').map(Number);
                const [b1, b2] = b.date.split('/').map(Number);

                if (a.date.length === 5) {
                    // dd/mm
                    return a2 !== b2 ? a2 - b2 : a1 - b1;
                } else {
                    // mm/yyyy
                    return a2 !== b2 ? a2 - b2 : a1 - b1;
                }
            });

        return res.status(200).json({
            success: true,
            message: 'getUserCommissionDataset successful',
            data: {
                chartData,
                arrayOfMonths,
                arrayOfYears,
            },
        });
    } catch (error) {
        console.error('Error in getUserCommissionDataset:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};


module.exports = {getDashboardStats, getUserCommissionDataset}