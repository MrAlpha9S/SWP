const express = require('express');
const router = express.Router();
const checkJwt = require('../middlewares/jwtChecker');
const adminChecker = require('../middlewares/adminChecker');
const adminController = require('../controllers/adminController');

// router.use(checkJwt);
// router.use(adminChecker);

// Route quản lý user
router.post('/users', adminController.handleCreateUser);
router.get('/users', adminController.handleGetAllUsers);
router.get('/users/:id', adminController.handleGetUserById);
router.put('/users/:id', adminController.handleUpdateUser);
router.delete('/users/:id', adminController.handleDeleteUser);
router.patch('/users/:id/ban', adminController.handleToggleBanUser);

// Route quản lý coach
router.get('/coaches', adminController.handleGetAllCoaches);
router.get('/coaches/pending', adminController.handleGetPendingCoaches);
router.get('/coaches/:id', adminController.handleGetCoachById);
router.put('/coaches/:id', adminController.handleUpdateCoach);
router.delete('/coaches/:id', adminController.handleDeleteCoach);
router.patch('/coaches/:id/approve', adminController.handleApproveCoach);
router.patch('/coaches/:id/reject', adminController.handleRejectCoach);
// Route quản lý social post
router.get('/posts', adminController.handleGetAllPosts);
router.post('/posts', adminController.handleCreatePost);
router.get('/posts/:id', adminController.handleGetPostById);
router.put('/posts/:id', adminController.handleUpdatePost);
router.delete('/posts/:id', adminController.handleDeletePost);
router.get('/posts/:id/likes', adminController.handleGetPostLikes);
// Route quản lý comment
router.get('/comments', adminController.handleGetAllComments);
router.delete('/comments/:id', adminController.handleDeleteComment);
router.get('/comments/post/:postId', adminController.handleGetCommentsByPostId);


// Route quản lý blog
router.get('/blogs/pending', adminController.handleGetIsPendingBlogs);
router.get('/blogs', adminController.handleGetAllBlogs);
router.get('/blogs/:id', adminController.handleGetBlogById);
router.delete('/blogs/:id', adminController.handleDeleteBlog);
router.patch('/blogs/:id/approve', adminController.handleApproveBlog);
// Route quản lý topic
router.get('/topics', adminController.handleGetAllTopics);
router.post('/topics', adminController.handleCreateTopic);
router.put('/topics/:id', adminController.handleUpdateTopic);
router.delete('/topics/:id', adminController.handleDeleteTopic);

// Route quản lý subscription
router.get('/subscriptions', adminController.handleGetAllSubscriptions);
router.post('/subscriptions', adminController.handleCreateSubscription);
router.put('/subscriptions/:id', adminController.handleUpdateSubscription);
router.delete('/subscriptions/:id', adminController.handleDeleteSubscription);

// Route quản lý user subscriptions
router.get('/user-subscriptions', adminController.handleGetAllUserSubscriptions);
router.post('/user-subscriptions', adminController.handleCreateUserSubscription);
router.put('/user-subscriptions/:user_id/:sub_id', adminController.handleUpdateUserSubscription);
router.delete('/user-subscriptions/:user_id/:sub_id', adminController.handleDeleteUserSubscription);

// Route quản lý check-in
router.get('/checkins', adminController.handleGetAllCheckIns);
router.get('/checkins/:id', adminController.handleGetCheckInById);
router.delete('/checkins/:id', adminController.handleDeleteCheckIn);

// Route thống kê tổng quan

router.get('/statistics', adminController.handleGetStatistics);
router.get('/statistics/revenue', adminController.handleGetRevenueDataset);


// Route mẫu kiểm tra quyền admin
router.get('/test', (req, res) => {
  res.json({ message: 'Admin access granted!' });
});

// Route quản lý thành tựu của user
router.get('/user-achievements', adminController.handleGetAllUserAchievements);
router.post('/user-achievements', adminController.handleCreateUserAchievement);
router.delete('/user-achievements/:user_id/:achievement_id', adminController.handleDeleteUserAchievement);

module.exports = router;
