const express = require('express');
const notificationRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');

const {
    handleGetAllNotifications,
    handleCreateNotification,
    handleDeleteAllNotifications,
    handleMarkAsReadById,
    handleMarkAllAsRead,
    handleGetUnreadCount
} = require('../controllers/notificationController');

// GET all notifications (with pagination)
notificationRouter.get('/', checkJwt, handleGetAllNotifications);

// POST a new notification
notificationRouter.post('/', checkJwt, handleCreateNotification);

// DELETE all notifications of a user
notificationRouter.delete('/', checkJwt, handleDeleteAllNotifications);

// PATCH mark a notification as read by ID
notificationRouter.patch('/mark-read', checkJwt, handleMarkAsReadById);

// PATCH mark all notifications as read (optionally by type)
notificationRouter.patch('/mark-all-read', checkJwt, handleMarkAllAsRead);

// GET unread count (optionally by type)
notificationRouter.get('/unread-count', checkJwt, handleGetUnreadCount);

module.exports = notificationRouter;
