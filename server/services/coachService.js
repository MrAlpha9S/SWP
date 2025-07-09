const {poolPromise, sql} = require("../configs/sqlConfig");
const {getUserIdFromAuth0Id} = require("./userService");

const getSubscribedUsers = async (userAuth0Id) => {
    const userId = await getUserIdFromAuth0Id(userAuth0Id);

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_id', sql.Int, userId)
            .query(`select *
                    from users u
                             JOIN users_subscriptions us ON u.user_id = us.user_id
                             JOIN coach_user cu ON u.user_id = cu.user_id
                             JOIN subscriptions s ON u.sub_id = s.sub_id
                    WHERE cu.coach_id = @user_id`)
        return result.recordset;
    }catch (error) {
        console.error('error in getSubscribedUsers', error);
        return [];
    }
}

module.exports = {getSubscribedUsers}
