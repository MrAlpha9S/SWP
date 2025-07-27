const {poolPromise, sql} = require("../configs/sqlConfig");
const {getUserIdFromAuth0Id} = require("./userService");

const getSubscribedUsers = async (userAuth0Id) => {
    const userId = await getUserIdFromAuth0Id(userAuth0Id);

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_id', sql.Int, userId)
            .query(`   SELECT *
                       FROM coach_user cu
                                LEFT JOIN users u ON cu.user_id = u.user_id
                                LEFT JOIN users_subscriptions us ON u.user_id = us.user_id
                                LEFT JOIN subscriptions s ON u.sub_id = s.sub_id
                       WHERE cu.coach_id = @user_id;`)
        return result.recordset;
    }catch (error) {
        console.error('error in getSubscribedUsers', error);
        return [];
    }
}

const getCoachCommissionRate = async (userId) => {
    let userIdForFetch = userId
    if (userId.length > 5) {
        userIdForFetch = await getUserIdFromAuth0Id(userId);
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', userIdForFetch)
            .query('SELECT commission_rate from coach_info')
        return result.recordset[0];
    }catch (error) {
        console.error('error in getCoachCommissionRate', error);
        return [];
    }
}

module.exports = {getSubscribedUsers, getCoachCommissionRate}
