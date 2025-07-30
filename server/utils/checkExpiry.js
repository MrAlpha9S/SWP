const { getAllUsers } = require("../services/userService");
const { getCurrentUTCDateTime } = require("./dateUtils");
const { updateUserSub } = require("../services/userService");
const cron = require('node-cron');

const checkExpiry = async () => {
    const users = await getAllUsers();

    for (const user of users) {
        if (user.vip_end_date !== null) {
            const today = getCurrentUTCDateTime();
            const vipEndDate = new Date(user.vip_end_date);

            if (today - vipEndDate > 0) {
                console.log(`VIP expired for ${user.auth0_id}, updating...`);
                await updateUserSub(user.auth0_id);
            }
        }
    }
};

cron.schedule(`27 ${process.env.NODE_ENV === 'production' ? '17' : '20'} * * *`, async () => {

    console.log('Running VIP expiry check...');
    try {
        await checkExpiry();
        console.log('VIP expiry check completed.');
    } catch (err) {
        console.error('Error during VIP expiry check:', err);
    }
});

module.exports = { checkExpiry };
