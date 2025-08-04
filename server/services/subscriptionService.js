const {poolPromise, sql} = require("../configs/sqlConfig");
const {checkSubscriptionExist} = require("./adminService");


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
            .query('SELECT * FROM subscriptions WHERE sub_id = @subscription_id');

        return subsInfo.recordset[0];
    } catch (error) {
        console.error('error in getSubscriptionService', error);
        return false;
    }
}

const addSubscriptionPurchaseLog = async (user_id, subscription_id, today) => {
    try {
        const pool = await poolPromise;

        const alreadyHasSubscription = await checkSubscriptionExist(user_id)

        if (alreadyHasSubscription) {
            const req = await pool.request()
            req.input('user_id', sql.Int, user_id);

            const deleteResult = await req.query(
                'DELETE FROM users_subscriptions WHERE user_id = @user_id'
            );
        }

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

// Thêm subscription
const createSubscription = async (sub_name, price) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('sub_name', sql.NVarChar, sub_name)
            .input('price', sql.Decimal(10,2), price)
            .query('INSERT INTO subscriptions (sub_name, price) VALUES (@sub_name, @price)');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('error in createSubscription', error);
        return false;
    }
};

// Sửa subscription
const updateSubscription = async (sub_id, sub_name, price) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('sub_id', sql.Int, sub_id)
            .input('sub_name', sql.NVarChar, sub_name)
            .input('price', sql.Decimal(10,2), price)
            .query('UPDATE subscriptions SET sub_name = @sub_name, price = @price WHERE sub_id = @sub_id');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('error in updateSubscription', error);
        return false;
    }
};

// Xóa subscription
const deleteSubscription = async (sub_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('sub_id', sql.Int, sub_id)
            .query('DELETE FROM subscriptions WHERE sub_id = @sub_id');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('error in deleteSubscription', error);
        return false;
    }
};

module.exports = {getSubscriptions, getSubscriptionService, addSubscriptionPurchaseLog, createSubscription, updateSubscription, deleteSubscription}