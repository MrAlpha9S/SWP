// utils/pushScheduler.js
const cron = require('node-cron');
const { poolPromise } = require('../configs/sqlConfig');
const { sendPushNotification } = require('./sendPushNotification');
const { reasonListOptions } = require('../constants/constants');
const {getQuote} = require("./getQuote");

// Track all scheduled jobs per user
const userCronJobs = new Map();

/**
 * Create cron jobs based on user's push time preference
 */
const scheduleUserPushes = async () => {
    console.log('📌 Inside scheduleUserPushes');
    try {
        const pool = await poolPromise;
        console.log('✅ Got DB connection');

        const result = await pool.request().query(`
      SELECT u.user_id, u.auth0_id, u.time_to_send_push, STRING_AGG(pr.reason_value, ',') AS reasons
      FROM users u
               JOIN user_profiles up ON u.user_id = up.user_id
               JOIN profiles_reasons pr ON up.profile_id = pr.profile_id
      WHERE u.fcm_token IS NOT NULL AND u.time_to_send_push IS NOT NULL
      GROUP BY u.user_id, u.auth0_id, u.time_to_send_push
    `);
        console.log('✅ Fetched users from DB:', result.recordset.length);

        result.recordset.forEach(user => {
            schedulePushForUser(user.auth0_id, user.time_to_send_push, user.reasons);
        });
    } catch (err) {
        console.error('❌ Error in scheduleUserPushes:', err);
    }
};

/**
 * Cancel any existing jobs and re-schedule based on new times
 */
const schedulePushForUser = (userAuth0Id, timeString, reasonsCSV) => {
    // Clear existing jobs
    if (userCronJobs.has(userAuth0Id)) {
        userCronJobs.get(userAuth0Id).forEach(job => job.stop());
        userCronJobs.delete(userAuth0Id);
    }

    const reasonList = reasonsCSV.split(',');
    const matchedReasons = reasonListOptions.filter(r => reasonList.includes(r.value));
    const reasonText = matchedReasons.map(r => `${r.label.toLowerCase()}`).join(', ');

    const times = timeString.split('-');
    const jobs = times.map(time => {
        const [localHour, minute] = time.split(':');
        let hour = parseInt(localHour);

        if (process.env.NODE_ENV === 'production') {
            hour = (hour + 7);
            console.log('hour', hour)
        }

        const cronExp = `${minute} ${hour} * * *`;

        const job = cron.schedule(cronExp, async () => {
            console.log(`Sending push to user ${userAuth0Id} at ${time}`);
            await sendPushNotification(
                userAuth0Id,
                `💪 Tiếp tục kiên trì nhé!`,
                `Lý do bạn đang cố gắng: ${reasonText.length > 0 ? reasonText : 'chưa có'}`
            );
        });

        return job;
    });

    userCronJobs.set(userAuth0Id, jobs);
};

/**
 * Clear all scheduled jobs (optional, for cleanup or reset)
 */
const clearAllScheduledPushes = () => {
    for (const jobs of userCronJobs.values()) {
        jobs.forEach(job => job.stop());
    }
    userCronJobs.clear();
};

module.exports = {
    scheduleUserPushes,
    schedulePushForUser,
    clearAllScheduledPushes
};
