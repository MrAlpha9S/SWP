const {poolPromise, sql} = require("../configs/sqlConfig");
const {getUserIdFromAuth0Id} = require("./userService");

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

module.exports = {getAllAchievementsService, getAchievementProgressService, getAchievedService}