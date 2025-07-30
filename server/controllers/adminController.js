// USER CONTROLLER
const adminService = require('../services/adminService');
const {poolPromise, sql} = require('../configs/sqlConfig');
const {getSubscribedUsers} = require("../services/coachService");
const {getRevenue} = require("../services/adminService");
const socket = require("../utils/socket");
const {getCurrentUTCDateTime} = require("../utils/dateUtils");
const {createNotificationService} = require("../services/notificationService");
const {createUserAuth0Service} = require("../services/auth0Service");

// --- USER ---
const handleGetAllUsers = async (req, res) => {
    // Lấy auth0_id từ access token đã decode
    const auth0Id = req.auth?.payload?.sub;
    console.log('auth0 id', auth0Id);
    try {
        const users = await adminService.getAllUsers();
        return res.status(200).json({success: true, data: users});
    } catch (error) {
        console.error('Error in handleGetAllUsers:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch users'});
    }
};
const handleCreateUser = async (req, res) => {
    const {username, email, role, avatar, isBanned, password} = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({success: false, message: 'Username, email and password are required'});
    }
    try {
        const auth0Created = await createUserAuth0Service(username, email, avatar, password);
        if (auth0Created) {
            const created = await adminService.createUser({username, email, role, avatar, isBanned});
            if (!created) return res.status(400).json({success: false, message: 'Failed to create user'});
            return res.status(201).json({success: true, message: 'User created successfully'});
        }
    } catch (error) {
        console.error('Error in handleCreateUser:', error);
        return res.status(500).json({success: false, message: 'Failed to create user'});
    }
};
const handleGetUserById = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await adminService.getUserById(Number(id));
        if (!user) return res.status(404).json({success: false, message: 'User not found'});
        return res.status(200).json({success: true, data: user});
    } catch (error) {
        console.error('Error in handleGetUserById:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch user'});
    }
};
const handleUpdateUser = async (req, res) => {
    const {id} = req.params;
    try {
        const updated = await adminService.updateUserById(Number(id), req.body);
        if (!updated) return res.status(404).json({success: false, message: 'User not found or nothing to update'});
        return res.status(200).json({success: true, message: 'User updated successfully'});
    } catch (error) {
        console.error('Error in handleUpdateUser:', error);
        return res.status(500).json({success: false, message: 'Failed to update user'});
    }
};
const handleDeleteUser = async (req, res) => {
    const {id} = req.params;
    try {
        const deleted = await adminService.deleteUserById(Number(id));
        if (!deleted) return res.status(404).json({success: false, message: 'User not found'});
        return res.status(200).json({success: true, message: 'User deleted successfully'});
    } catch (error) {
        console.error('Error in handleDeleteUser:', error);
        return res.status(500).json({success: false, message: 'Failed to delete user'});
    }
};
const handleToggleBanUser = async (req, res) => {
    const {id} = req.params;
    // Đảm bảo isBanned luôn là boolean
    const isBanned = typeof req.body.isBanned === 'boolean' ? req.body.isBanned : !!req.body.isBanned;
    try {
        const updated = await adminService.toggleBanUserById(Number(id), isBanned);
        if (!updated) return res.status(404).json({success: false, message: 'User not found'});
        return res.status(200).json({success: true, message: `User has been ${isBanned ? 'banned' : 'unbanned'}`});
    } catch (error) {
        console.error('Error in handleToggleBanUser:', error);
        return res.status(500).json({success: false, message: 'Failed to update user ban status'});
    }
};

// --- COACH ---
const handleGetAllCoaches = async (req, res) => {
    try {
        const coaches = await adminService.getCoaches();
        return res.status(200).json({success: true, data: coaches});
    } catch (error) {
        console.error('Error in handleGetAllCoaches:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch coaches'});
    }
};
const handleGetCoachById = async (req, res) => {
    const {id} = req.params;
    try {
        const coach = await adminService.getCoachDetailsById(Number(id));
        if (!coach) return res.status(404).json({success: false, message: 'Coach not found'});
        return res.status(200).json({success: true, data: coach});
    } catch (error) {
        console.error('Error in handleGetCoachById:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch coach'});
    }
};
const handleUpdateCoach = async (req, res) => {
    const {id} = req.params;
    try {
        const updated = await adminService.updateUserById(Number(id), req.body);
        if (!updated) return res.status(404).json({success: false, message: 'Coach not found or nothing to update'});
        return res.status(200).json({success: true, message: 'Coach updated successfully'});
    } catch (error) {
        console.error('Error in handleUpdateCoach:', error);
        return res.status(500).json({success: false, message: 'Failed to update coach'});
    }
};
const handleDeleteCoach = async (req, res) => {
    const {id} = req.params;
    try {
        const deleted = await adminService.deleteUserById(Number(id));
        if (!deleted) return res.status(404).json({success: false, message: 'Coach not found'});
        return res.status(200).json({success: true, message: 'Coach deleted successfully'});
    } catch (error) {
        console.error('Error in handleDeleteCoach:', error);
        return res.status(500).json({success: false, message: 'Failed to delete coach'});
    }
};
const handleGetCoachUser = async (req, res) => {
    const {coach_id} = req.params;
    try {
        const users = await adminService.getCoachUserByCoachId(Number(coach_id));
        return res.status(200).json({success: true, data: users});
    } catch (error) {
        return res.status(500).json({success: false, message: 'Failed to fetch user'});
    }
};

// --- SOCIAL POST & COMMENT ---
const handleGetAllPosts = async (req, res) => {
    try {
        const posts = await adminService.getAllPosts();
        return res.status(200).json({success: true, data: posts});
    } catch (error) {
        console.error('Error in handleGetAllPosts:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch posts'});
    }
};
const handleCreatePost = async (req, res) => {
    try {
        const created = await adminService.createPost(req.body);
        if (!created) return res.status(400).json({success: false, message: 'Failed to create post'});
        return res.status(201).json({success: true, message: 'Post created successfully'});
    } catch (error) {
        console.error('Error in handleCreatePost:', error);
        return res.status(500).json({success: false, message: 'Failed to create post'});
    }
};
const handleGetPostById = async (req, res) => {
    const {id} = req.params;
    try {
        const post = await adminService.getPostById(Number(id));
        if (!post) return res.status(404).json({success: false, message: 'Post not found'});
        return res.status(200).json({success: true, data: post});
    } catch (error) {
        console.error('Error in handleGetPostById:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch post'});
    }
};
const handleUpdatePost = async (req, res) => {
    const {id} = req.params;
    try {
        const updated = await adminService.updatePost(Number(id), req.body);
        if (!updated) return res.status(404).json({success: false, message: 'Post not found or nothing to update'});
        return res.status(200).json({success: true, message: 'Post updated successfully'});
    } catch (error) {
        console.error('Error in handleUpdatePost:', error);
        return res.status(500).json({success: false, message: 'Failed to update post'});
    }
};
const handleDeletePost = async (req, res) => {
    const {id} = req.params;
    try {
        const deleted = await adminService.deletePostById(Number(id));
        if (!deleted) return res.status(404).json({success: false, message: 'Post not found'});
        return res.status(200).json({success: true, message: 'Post deleted successfully'});
    } catch (error) {
        console.error('Error in handleDeletePost:', error);
        return res.status(500).json({success: false, message: 'Failed to delete post'});
    }
};
const handleGetAllComments = async (req, res) => {
    try {
        const comments = await adminService.getAllComments();
        return res.status(200).json({success: true, data: comments});
    } catch (error) {
        console.error('Error in handleGetAllComments:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch comments'});
    }
};
const handleDeleteComment = async (req, res) => {
    const {id} = req.params;
    try {
        const deleted = await adminService.deleteCommentById(Number(id));
        if (!deleted) return res.status(404).json({success: false, message: 'Comment not found'});
        return res.status(200).json({success: true, message: 'Comment deleted successfully'});
    } catch (error) {
        console.error('Error in handleDeleteComment:', error);
        return res.status(500).json({success: false, message: 'Failed to delete comment'});
    }
};
const handleGetPostLikes = async (req, res) => {
    const {id} = req.params;
    try {
        const likes = await adminService.getPostLikes(Number(id));
        return res.status(200).json({success: true, data: likes});
    } catch (error) {
        console.error('Error in handleGetPostLikes:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch post likes'});
    }
};

async function handleGetCommentsByPostId(postId) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('postId', sql.Int, postId)
            .query('SELECT * FROM social_comments WHERE post_id = @postId');
        return result.recordset;
    } catch (err) {
        console.error('Error in getCommentsByPostId:', err);
        throw err;
    }
}


// --- BLOG & TOPIC ---
const handleGetAllBlogs = async (req, res) => {
    try {
        const blogs = await adminService.getAllBlogs();
        return res.status(200).json({success: true, data: blogs});
    } catch (error) {
        console.error('Error in handleGetAllBlogs:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch blogs'});
    }
};
const handleApproveBlog = async (req, res) => {
    const {id} = req.params;
    const {auth0_id, title, topic_id} = req.body;
    console.log('info', auth0_id, title, topic_id);
    try {
        const approved = await adminService.approveBlog(id);
        if (!approved) return res.status(404).json({success: false, message: 'Blog not found'});
        const io = socket.getIo()
        io.to(`${auth0_id}`).emit('blog-approved', {
            title: title,
            author: auth0_id,
            topic: topic_id,
            blog_id: id,
            timestamp: getCurrentUTCDateTime().toISOString()
        });
        await createNotificationService(auth0_id, `Bài blog ${title} của bạn đã được duyệt.`, ` `, 'system', {
            userAuth0Id: auth0_id,
            inner_type: 'blog-approved',
            topic_id: topic_id,
            blog_id: id
        })
        return res.status(200).json({success: true, message: 'Blog approved successfully'});
    } catch (error) {
        console.error('Error in handleApproveBlog:', error);
        return res.status(500).json({success: false, message: 'Failed to approve blog'});
    }
};
const handleGetIsPendingBlogs = async (req, res) => {
    try {
        const blogs = await adminService.getIsPendingBlogs();
        return res.status(200).json({success: true, data: blogs});
    } catch (error) {
        console.error('Error in handleGetIsPendingBlogs:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch blogs'});
    }
};
const handleGetBlogById = async (req, res) => {
    const {id} = req.params;
    try {
        const blog = await adminService.getBlogById(Number(id));
        if (!blog) return res.status(404).json({success: false, message: 'Blog not found'});
        return res.status(200).json({success: true, data: blog});
    } catch (error) {
        console.error('Error in handleGetBlogById:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch blog'});
    }
};
const handleDeleteBlog = async (req, res) => {
    const {id} = req.params;
    const {auth0_id, title} = req.body;
    try {
        const deleted = await adminService.deleteBlogById(Number(id));
        if (!deleted) return res.status(404).json({success: false, message: 'Blog not found'});
        const io = socket.getIo()
        io.to(`${auth0_id}`).emit('blog-rejected', {
            title: title,
            author: auth0_id,
            timestamp: getCurrentUTCDateTime().toISOString()
        });
        await createNotificationService(auth0_id, `Bài blog ${title} của bạn bị từ chối.`, ` `, 'system', {
            userAuth0Id: auth0_id,
            inner_type: 'blog-rejected'
        })
        return res.status(200).json({success: true, message: 'Blog deleted successfully'});
    } catch (error) {
        console.error('Error in handleDeleteBlog:', error);
        return res.status(500).json({success: false, message: 'Failed to delete blog'});
    }
};
const handleGetAllTopics = async (req, res) => {
    try {
        const topics = await adminService.getAllTopics();
        return res.status(200).json({success: true, data: topics});
    } catch (error) {
        console.error('Error in handleGetAllTopics:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch topics'});
    }
};
const handleCreateTopic = async (req, res) => {
    const {topic_id, topic_name, topic_content} = req.body;
    try {
        const created = await adminService.createTopic(topic_id, topic_name, topic_content);
        if (!created) return res.status(400).json({success: false, message: 'Failed to create topic'});
        return res.status(201).json({success: true, message: 'Topic created successfully'});
    } catch (error) {
        console.error('Error in handleCreateTopic:', error);
        return res.status(500).json({success: false, message: 'Failed to create topic'});
    }
};
const handleUpdateTopic = async (req, res) => {
    const {id} = req.params;
    const {topic_name, topic_content} = req.body;
    try {
        const updated = await adminService.updateTopic(Number(id), topic_name, topic_content);
        if (!updated) return res.status(404).json({success: false, message: 'Topic not found'});
        return res.status(200).json({success: true, message: 'Topic updated successfully'});
    } catch (error) {
        console.error('Error in handleUpdateTopic:', error);
        return res.status(500).json({success: false, message: 'Failed to update topic'});
    }
};
const handleDeleteTopic = async (req, res) => {
    const {id} = req.params;
    try {
        const deleted = await adminService.deleteTopic(Number(id));
        if (!deleted) return res.status(404).json({success: false, message: 'Topic not found'});
        return res.status(200).json({success: true, message: 'Topic deleted successfully'});
    } catch (error) {
        console.error('Error in handleDeleteTopic:', error);
        return res.status(500).json({success: false, message: 'Failed to delete topic'});
    }
};

// --- SUBSCRIPTION ---
const handleGetAllSubscriptions = async (req, res) => {
    try {
        const subs = await adminService.getAllSubscriptions();
        return res.status(200).json({success: true, data: subs});
    } catch (error) {
        console.error('Error in handleGetAllSubscriptions:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch subscriptions'});
    }
};
const handleCreateSubscription = async (req, res) => {
    const {sub_name, price} = req.body;
    try {
        const created = await adminService.createSubscription(sub_name, price);
        if (!created) return res.status(400).json({success: false, message: 'Failed to create subscription'});
        return res.status(201).json({success: true, message: 'Subscription created successfully'});
    } catch (error) {
        console.error('Error in handleCreateSubscription:', error);
        return res.status(500).json({success: false, message: 'Failed to create subscription'});
    }
};
const handleUpdateSubscription = async (req, res) => {
    const {id} = req.params;
    const {sub_name, price} = req.body;
    try {
        const updated = await adminService.updateSubscription(Number(id), sub_name, price);
        if (!updated) return res.status(404).json({success: false, message: 'Subscription not found'});
        return res.status(200).json({success: true, message: 'Subscription updated successfully'});
    } catch (error) {
        console.error('Error in handleUpdateSubscription:', error);
        return res.status(500).json({success: false, message: 'Failed to update subscription'});
    }
};
const handleDeleteSubscription = async (req, res) => {
    const {id} = req.params;
    try {
        const deleted = await adminService.deleteSubscription(Number(id));
        if (!deleted) return res.status(404).json({success: false, message: 'Subscription not found'});
        return res.status(200).json({success: true, message: 'Subscription deleted successfully'});
    } catch (error) {
        console.error('Error in handleDeleteSubscription:', error);
        return res.status(500).json({success: false, message: 'Failed to delete subscription'});
    }
};

// --- CHECK-IN ---
const handleGetAllCheckIns = async (req, res) => {
    try {
        const checkins = await adminService.getAllCheckIns();
        return res.status(200).json({success: true, data: checkins});
    } catch (error) {
        console.error('Error in handleGetAllCheckIns:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch check-ins'});
    }
};
const handleGetCheckInById = async (req, res) => {
    const {id} = req.params;
    try {
        const checkin = await adminService.getCheckInById(Number(id));
        if (!checkin) return res.status(404).json({success: false, message: 'Check-in not found'});
        return res.status(200).json({success: true, data: checkin});
    } catch (error) {
        console.error('Error in handleGetCheckInById:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch check-in'});
    }
};
const handleDeleteCheckIn = async (req, res) => {
    const {id} = req.params;
    try {
        const deleted = await adminService.deleteCheckInById(Number(id));
        if (!deleted) return res.status(404).json({success: false, message: 'Check-in not found'});
        return res.status(200).json({success: true, message: 'Check-in deleted successfully'});
    } catch (error) {
        console.error('Error in handleDeleteCheckIn:', error);
        return res.status(500).json({success: false, message: 'Failed to delete check-in'});
    }
};

// --- STATISTICS ---
const handleGetStatistics = async (req, res) => {
    try {
        const stats = await adminService.getStatistics();
        return res.status(200).json({success: true, stats});
    } catch (error) {
        console.error('Error in handleGetStatistics:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch statistics'});
    }
};

const handleGetRevenueDataset = async (req, res) => {
    const {month, year} = req.query;
    try {
        const revenueList = await getRevenue();

        // Extract unique months and years
        const monthsSet = new Set();
        const yearsSet = new Set();

        revenueList.forEach((rev) => {
            const date = new Date(rev.created_at);
            monthsSet.add(date.getUTCMonth() + 1); // 1–12
            yearsSet.add(date.getUTCFullYear());
        });

        const arrayOfMonths = Array.from(monthsSet).sort((a, b) => a - b);
        const arrayOfYears = Array.from(yearsSet).sort((a, b) => a - b);

        // Prepare chart data
        const chartMap = new Map();
        const inputMonth = month ? parseInt(month, 10) : null;
        const inputYear = year ? parseInt(year, 10) : null;

        revenueList.forEach((rev) => {
            const startedDate = new Date(rev.created_at);
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
                    chartMap.set(key, {users: 0, commission: 0});
                }

                const current = chartMap.get(key);
                chartMap.set(key, {
                    users: current.users + 1,
                    commission: current.commission + parseFloat(rev.amount),
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
                    chartMap.set(key, {users: 0, commission: 0});
                }
            }
        }

        if (!inputMonth && inputYear) {
            for (let m = 1; m <= 12; m++) {
                const monthStr = String(m).padStart(2, '0');
                const key = `${monthStr}/${inputYear}`;
                if (!chartMap.has(key)) {
                    chartMap.set(key, {users: 0, commission: 0});
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
            message: 'handleGetRevenueDataset successful',
            data: {
                chartData,
                arrayOfMonths,
                arrayOfYears,
            },
        });
    } catch (error) {
        console.error('Error in handleGetRevenueDataset:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};

const handleGetAllUserSubscriptions = async (req, res) => {
    try {
        const subs = await adminService.getAllUserSubscriptions();
        return res.status(200).json({success: true, data: subs});
    } catch (error) {
        console.error('Error in handleGetAllUserSubscriptions:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch user subscriptions'});
    }
};
const handleCreateUserSubscription = async (req, res) => {
    try {
        const created = await adminService.createUserSubscription(req.body);
        if (!created) return res.status(400).json({success: false, message: 'Failed to create user subscription'});
        return res.status(201).json({success: true, message: 'User subscription created successfully'});
    } catch (error) {
        console.error('Error in handleCreateUserSubscription:', error);
        return res.status(500).json({success: false, message: 'Failed to create user subscription'});
    }
};
const handleUpdateUserSubscription = async (req, res) => {
    const {user_id, sub_id} = req.params;
    try {
        const updated = await adminService.updateUserSubscription(Number(user_id), Number(sub_id), req.body);
        if (!updated) return res.status(404).json({
            success: false,
            message: 'User subscription not found or nothing to update'
        });
        return res.status(200).json({success: true, message: 'User subscription updated successfully'});
    } catch (error) {
        console.error('Error in handleUpdateUserSubscription:', error);
        return res.status(500).json({success: false, message: 'Failed to update user subscription'});
    }
};
const handleDeleteUserSubscription = async (req, res) => {
    const {user_id, sub_id} = req.params;
    try {
        const deleted = await adminService.deleteUserSubscription(Number(user_id), Number(sub_id));
        if (!deleted) return res.status(404).json({success: false, message: 'User subscription not found'});
        return res.status(200).json({success: true, message: 'User subscription deleted successfully'});
    } catch (error) {
        console.error('Error in handleDeleteUserSubscription:', error);
        return res.status(500).json({success: false, message: 'Failed to delete user subscription'});
    }
};

// --- USER ACHIEVEMENTS ---
const handleGetAllUserAchievements = async (req, res) => {
    try {
        const achievements = await adminService.getAllUserAchievements();
        return res.status(200).json({success: true, data: achievements});
    } catch (error) {
        console.error('Error in handleGetAllUserAchievements:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch user achievements'});
    }
};
const handleCreateUserAchievement = async (req, res) => {
    const {user_id, achievement_id} = req.body;
    if (!user_id || !achievement_id) {
        return res.status(400).json({success: false, message: 'user_id and achievement_id are required'});
    }
    try {
        const created = await adminService.createUserAchievement(user_id, achievement_id);
        if (!created) return res.status(400).json({success: false, message: 'Failed to add achievement'});
        return res.status(201).json({success: true, message: 'Achievement added successfully'});
    } catch (error) {
        console.error('Error in handleCreateUserAchievement:', error);
        return res.status(500).json({success: false, message: 'Failed to add achievement'});
    }
};
const handleDeleteUserAchievement = async (req, res) => {
    const {user_id, achievement_id} = req.params;
    try {
        const deleted = await adminService.deleteUserAchievement(user_id, achievement_id);
        if (!deleted) return res.status(404).json({success: false, message: 'Achievement not found'});
        return res.status(200).json({success: true, message: 'Achievement deleted successfully'});
    } catch (error) {
        console.error('Error in handleDeleteUserAchievement:', error);
        return res.status(500).json({success: false, message: 'Failed to delete achievement'});
    }
};

// LẤY DANH SÁCH COACH CHỜ DUYỆT
const handleGetPendingCoaches = async (req, res) => {
    try {
        const coaches = await adminService.getPendingCoaches();
        return res.status(200).json({success: true, data: coaches});
    } catch (error) {
        console.error('Error in handleGetPendingCoaches:', error);
        return res.status(500).json({success: false, message: 'Failed to fetch pending coaches'});
    }
};

// DUYỆT COACH
const handleApproveCoach = async (req, res) => {
    const {id} = req.params;
    try {
        const approved = await adminService.approveCoach(id);
        if (!approved) return res.status(404).json({success: false, message: 'Coach not found'});
        return res.status(200).json({success: true, message: 'Coach approved successfully'});
    } catch (error) {
        console.error('Error in handleApproveCoach:', error);
        return res.status(500).json({success: false, message: 'Failed to approve coach'});
    }
};

const handleRejectCoach = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const success = await adminService.rejectCoach(userId);
        if (!success) {
            return res.status(404).json({success: false, message: 'Không tìm thấy coach hoặc đã từ chối rồi'});
        }
        return res.status(200).json({success: true, message: 'Từ chối coach thành công'});
    } catch (error) {
        console.error('Lỗi rejectCoach:', error);
        return res.status(500).json({success: false, message: 'Lỗi server khi từ chối coach'});
    }
};

module.exports = {
    // User
    handleGetAllUsers,
    handleCreateUser,
    handleGetUserById,
    handleUpdateUser,
    handleDeleteUser,
    handleToggleBanUser,
    // Coach
    handleGetAllCoaches,
    handleGetCoachById,
    handleUpdateCoach,
    handleDeleteCoach,
    handleGetCoachUser,
    handleRejectCoach,
    // Social Post & Comment
    handleGetAllPosts,
    handleCreatePost,
    handleGetPostById,
    handleUpdatePost,
    handleDeletePost,
    handleGetAllComments,
    handleDeleteComment,
    handleGetPostLikes,
    handleGetCommentsByPostId,
    // Blog & Topic
    handleApproveBlog,
    handleGetIsPendingBlogs,
    handleGetAllBlogs,
    handleGetBlogById,
    handleDeleteBlog,
    handleGetAllTopics,
    handleCreateTopic,
    handleUpdateTopic,
    handleDeleteTopic,
    // Subscription
    handleGetAllSubscriptions,
    handleCreateSubscription,
    handleUpdateSubscription,
    handleDeleteSubscription,
    // Check-in
    handleGetAllCheckIns,
    handleGetCheckInById,
    handleDeleteCheckIn,
    // Statistics
    handleGetStatistics,
    handleGetRevenueDataset,
    handleGetAllUserSubscriptions,
    handleCreateUserSubscription,
    handleUpdateUserSubscription,
    handleDeleteUserSubscription,
    // User Achievements
    handleGetAllUserAchievements,
    handleCreateUserAchievement,
    handleDeleteUserAchievement,
    // Coach Pending
    handleGetPendingCoaches,
    handleApproveCoach
};
