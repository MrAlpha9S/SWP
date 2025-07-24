const {
    getAllNotificationsService,
    createNotificationService,
    deleteAllNotificationsService,
    markAsReadByIdService,
    markAllAsReadService,
    getUnreadCountService
} = require('../services/notificationService');

const handleGetAllNotifications = async (req, res) => {
    try {
        const { userAuth0Id, page = 1, limit = 10, type } = req.query;
        console.log(userAuth0Id)
        const result = await getAllNotificationsService(userAuth0Id, page, limit, type);

        if (!result || result.data.length === 0) {
            return res.status(404).json({ success: false, message: 'No notifications found', data: [] });
        }

        return res.status(200).json({ success: true, message: 'Notifications fetched successfully', data: result.data, pagination: result.pagination });
    } catch (error) {
        console.error('Error in handleGetAllNotifications:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }
};

const handleCreateNotification = async (req, res) => {
    try {
        const { userAuth0Id, noti_title, content } = req.body;
        const result = await createNotificationService(userAuth0Id, noti_title, content);

        if (!result) {
            return res.status(400).json({ success: false, message: 'Failed to create notification', data: null });
        }

        return res.status(201).json({ success: true, message: 'Notification created', data: result });
    } catch (error) {
        console.error('Error in handleCreateNotification:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }
};

const handleDeleteAllNotifications = async (req, res) => {
    try {
        const { userAuth0Id } = req.query;
        const result = await deleteAllNotificationsService(userAuth0Id);

        if (!result) {
            return res.status(400).json({ success: false, message: 'Failed to delete notifications', data: null });
        }

        return res.status(200).json({ success: true, message: 'All notifications deleted', data: null });
    } catch (error) {
        console.error('Error in handleDeleteAllNotifications:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }
};

const handleMarkAsReadById = async (req, res) => {
    try {
        const { noti_id } = req.body;
        const result = await markAsReadByIdService(noti_id);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Notification not found or already read', data: null });
        }

        return res.status(200).json({ success: true, message: 'Notification marked as read', data: null });
    } catch (error) {
        console.error('Error in handleMarkAsReadById:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }
};

const handleMarkAllAsRead = async (req, res) => {
    try {
        const { userAuth0Id, type } = req.body;
        const result = await markAllAsReadService(userAuth0Id, type);

        return res.status(200).json({ success: true, message: 'All notifications marked as read', data: result });
    } catch (error) {
        console.error('Error in handleMarkAllAsRead:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }
};

const handleGetUnreadCount = async (req, res) => {
    try {
        const { userAuth0Id, type } = req.query;
        const result = await getUnreadCountService(userAuth0Id, type);

        return res.status(200).json({ success: true, message: 'Unread count fetched', data: result });
    } catch (error) {
        console.error('Error in handleGetUnreadCount:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }
};

module.exports = {
    handleGetAllNotifications,
    handleCreateNotification,
    handleDeleteAllNotifications,
    handleMarkAsReadById,
    handleMarkAllAsRead,
    handleGetUnreadCount
};
