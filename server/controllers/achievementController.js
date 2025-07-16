const {getAllAchievementsService, getAchievementProgressService, getAchievedService,
    processAchievementsWithNotifications
} = require("../services/achievementService");
const {getUserIdFromAuth0Id} = require("../services/userService");
const {poolPromise, sql} = require("../configs/sqlConfig");
const {getCurrentUTCDateTime} = require("../utils/dateUtils");

const handleGetAllAchievements = async (req, res) => {
    try {
        const result = await getAllAchievementsService();
        if (!result || result.length === 0) {
            return res.status(404).json({success: false, message: 'Achievements not found', data: []});
        }
        return res.status(200).json({success: true, message: 'Achievements fetched successfully', data: result});
    } catch (error) {
        console.error('Error in handleGetAllAchievements:', error);
        return res.status(500).json({success: false, message: 'Internal server error', data: null});
    }

}

const handleGetAchievementProgress = async (req, res) => {
    const {userAuth0Id} = req.params;
    try {
        const result = await getAchievementProgressService(userAuth0Id);
        if (!result) {
            return res.status(404).json({success: false, message: 'Achievement prgoress not found', data: null});
        }
        return res.status(200).json({
            success: true,
            message: 'Achievement prgoress fetched successfully',
            data: result
        });
    } catch (error) {
        console.error('Error in handleGetAchievementProgress:', error);
        return res.status(500).json({success: false, message: 'Internal server error', data: null});
    }

}

const handleGetAchieved = async (req, res) => {
    const {userAuth0Id} = req.params;
    try {
        const result = await getAchievedService(userAuth0Id);
        if (!result || result.length === 0) {
            return res.status(404).json({success: false, message: 'Achievements not found', data: []});
        }
        return res.status(200).json({success: true, message: 'Achievements fetched successfully', data: result});
    } catch (error) {
        console.error('Error in handleGetAchieved:', error);
        return res.status(500).json({success: false, message: 'Internal server error', data: null});
    }

}

// Simplified backend endpoint
const updateMoneySaved = async (req, res) => {
    try {
        const { userAuth0Id, moneySaved } = req.body;
        const userId = await getUserIdFromAuth0Id(userAuth0Id);

        const pool = await poolPromise;

        // Update money_saved
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('moneySaved', sql.Decimal(12,2), moneySaved)
            .query(`
                UPDATE user_achievement_progress
                SET money_saved = @moneySaved
                WHERE user_id = @userId
            `);

        // Process all achievements (including financial ones)
        const newAchievements = await processAchievementsWithNotifications(userAuth0Id);

        res.json({
            success: true,
            newAchievements: newAchievements,
            moneySaved: moneySaved
        });

    } catch (error) {
        console.error('Error updating money saved:', error);
        res.status(500).json({ error: 'Failed to update money saved' });
    }
};
module.exports = {handleGetAllAchievements, handleGetAchievementProgress, handleGetAchieved, updateMoneySaved};