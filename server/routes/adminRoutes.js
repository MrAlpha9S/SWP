const express = require('express');
const router = express.Router();
const checkJwt = require('../middlewares/jwtChecker');
const adminChecker = require('../middlewares/adminChecker');
const adminController = require('../controllers/adminController');

// Áp dụng middleware cho toàn bộ route admin
router.use(checkJwt);
router.use(adminChecker);

// Route quản lý user
router.post('/users', adminController.handleCreateUser);
router.get('/users', adminController.handleGetAllUsers);
router.get('/users/:id', adminController.handleGetUserById);
router.put('/users/:id', adminController.handleUpdateUser);
router.delete('/users/:id', adminController.handleDeleteUser);
router.patch('/users/:id/ban', adminController.handleToggleBanUser);

// Route quản lý coach
router.get('/coaches', adminController.handleGetAllCoaches);
router.get('/coaches/:id', adminController.handleGetCoachById);
router.put('/coaches/:id', adminController.handleUpdateCoach);
router.delete('/coaches/:id', adminController.handleDeleteCoach);

// Route quản lý social post
router.get('/posts', adminController.handleGetAllPosts);
router.get('/posts/:id', adminController.handleGetPostById);
router.delete('/posts/:id', adminController.handleDeletePost);
// Route quản lý comment
router.get('/comments', adminController.handleGetAllComments);
router.delete('/comments/:id', adminController.handleDeleteComment);

// Route quản lý blog
router.get('/blogs', adminController.handleGetAllBlogs);
router.get('/blogs/:id', adminController.handleGetBlogById);
router.delete('/blogs/:id', adminController.handleDeleteBlog);
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

// Route quản lý check-in
router.get('/checkins', adminController.handleGetAllCheckIns);
router.get('/checkins/:id', adminController.handleGetCheckInById);
router.delete('/checkins/:id', adminController.handleDeleteCheckIn);

// Route thống kê tổng quan
router.get('/statistics', adminController.handleGetStatistics);

// Route mẫu kiểm tra quyền admin
router.get('/test', (req, res) => {
  res.json({ message: 'Admin access granted!' });
});

module.exports = router;
