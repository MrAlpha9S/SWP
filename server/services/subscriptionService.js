const {poolPromise, sql} = require("../configs/sqlConfig");
const {getCurrentUTCDateTime} = require("../utils/dateUtils");


const getSubscriptions = async () => {
    try {
        const pool = await poolPromise;

        const getSubsResult = await pool
            .request()
            .query(`
                SELECT * FROM subscriptions
            `);

        const getFeaturesResult = await pool
            .request()
            .query('SELECT * FROM subs_features');

        return getSubsResult?.recordset.map((sub) => {
            const features = getFeaturesResult?.recordset
                .filter((feature) => sub.sub_id === feature.sub_id)
                .map((f) => f.feature);



            return {
                name: sub.sub_name,
                price: sub.price,
                features: features,
            };
        });

    } catch (error) {
        console.error('error in userProfileExists', error);
        throw error;
    }
}

const getSubscriptionService = async (subscription_id) => {
    try {
        const pool = await poolPromise;
        const subsInfo = await pool.request()
            .input('subscription_id', subscription_id)
            .query('SELECT duration, price FROM subscriptions WHERE sub_id = @subscription_id');

        return subsInfo.recordset[0];
    } catch (error) {
        console.error('error in getSubscriptionService', error);
        return false;
    }
}

const addSubscriptionPurchaseLog = async (user_id, subscription_id, today) => {
    try {
        const pool = await poolPromise;
        const subsInfo = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('sub_id', sql.Int, subscription_id)
            .input('purchased_date', sql.DATETIME, today)
            .query('INSERT INTO users_subscriptions (user_id, sub_id, purchased_date) VALUES (@user_id, @sub_id, @purchased_date)');

        return subsInfo.rowsAffected > 0;
    } catch (error) {
        console.error('error in addSubscriptionPurchaseLog', error);
        return false;
    }
}

module.exports = {getSubscriptions, getSubscriptionService, addSubscriptionPurchaseLog}