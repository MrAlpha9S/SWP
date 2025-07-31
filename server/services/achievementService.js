const {poolPromise, sql} = require("../configs/sqlConfig");
const {getUserIdFromAuth0Id, getUserByAuth0Id} = require("./userService");
const {getCurrentUTCDateTime} = require("../utils/dateUtils");
const socket = require('../utils/socket');
const NodeCache = require("node-cache");
const {createNotificationService} = require("./notificationService");

const getAllAchievementsService = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('select * from achievements');
        return result.recordset;
    } catch (error) {
        console.error('error in getAllAchievementsService', error);
        return [];
    }
};

const getAchievementProgressService = async (userAuth0Id) => {
    const userId = await getUserIdFromAuth0Id(userAuth0Id);

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM user_achievement_progress WHERE user_id = @userId')
        return result.recordset[0]
    } catch (error) {
        console.error('error in getAchievementProgressService', error);
        return null;
    }
}

const getAchievedService = async (userAuth0Id) => {
    const userId = await getUserIdFromAuth0Id(userAuth0Id);

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('select ua.user_id, ua.achievement_id, ua.achieved_at, a.achievement_name, a.criteria, a.icon_url from user_achievements ua, achievements a where ua.achievement_id = a.achievement_id and user_id = @userId')
        return result.recordset
    } catch (error) {
        console.error('error in getAchievementProgressService', error);
        return null;
    }
}

const addAchievementService = async (userAuth0Id, achievementId) => {

}

const achievementCache = new NodeCache({stdTTL: 60});

const processAchievements = async (userAuth0Id) => {
    try {
        // Check cache to avoid processing same user too frequently
        const cacheKey = `user_achievements_${userAuth0Id}`;
        // if (achievementCache.has(cacheKey)) {
        //     return []; // Return empty array if recently processed
        // }

        const userId = await getUserIdFromAuth0Id(userAuth0Id);

        // Call the SQL procedure
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserId', sql.Int, userId)
            .execute('UpdateUserAchievementProgress');

        // Cache this user for 1 minute
        const newAchievements = await getRecentAchievements(userAuth0Id, 15);
        achievementCache.set(cacheKey, true);

        return newAchievements;

    } catch (error) {
        console.error('Error processing achievements:', error);
        return [];
    }
};

// Send achievement notifications using your existing socket.io setup
const sendAchievementNotifications = async (userAuth0Id, achievements) => {
    try {
        const user = await getUserByAuth0Id(userAuth0Id);
        if (user.role === 'Coach') return
        const io = socket.getIo();

        // Send notification for each new achievement
        for (const achievement of achievements) {
            console.log(`🎉 Achievement unlocked for user ${user.user_id}: ${achievement.achievement_name}`);
            await createNotificationService(userAuth0Id, `Bạn vừa đạt thành tựu ${achievement.achievement_name}`, achievement.criteria, 'system', {inner_type : 'achievements'})

            io.to(userAuth0Id).emit('new-achievement', {
                achievement_name: achievement.achievement_name,
                criteria: achievement.criteria,
                timestamp: getCurrentUTCDateTime().toISOString()
            });
        }
    } catch (error) {
        console.error('Error sending achievement notifications:', error);
    }
};

// Process achievements and send notifications
const processAchievementsWithNotifications = async (userAuth0Id) => {
    const newAchievements = await processAchievements(userAuth0Id);
    console.log('new', newAchievements);
    if (newAchievements.length > 0) {
        // Send notifications (implement based on your notification system)
        await sendAchievementNotifications(userAuth0Id, newAchievements);
    }

    return newAchievements;
};

const getRecentAchievements = async (userAuth0Id, secondsBack = 15) => {
    try {
        const userId = await getUserIdFromAuth0Id(userAuth0Id);
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('secondsBack', sql.Int, secondsBack)
            .input('current_date', sql.DateTime, getCurrentUTCDateTime().toISOString())
            .query(`
                SELECT a.achievement_id, a.achievement_name, a.criteria
                FROM user_achievements ua
                JOIN achievements a ON a.achievement_id = ua.achievement_id
                WHERE ua.user_id = @userId
                AND ua.achieved_at >= DATEADD(SECOND, -@secondsBack, @current_date)
                ORDER BY ua.achieved_at DESC
            `);

        return result.recordset;
    } catch (error) {
        console.error('Error getting recent achievements:', error);
        return [];
    }
};

module.exports = {
    getAllAchievementsService, getAchievementProgressService, getAchievedService, processAchievements,
    processAchievementsWithNotifications,
    sendAchievementNotifications, getRecentAchievements
}