const {getAllAchievementsService, getAchievementProgressService, getAchievedService} = require("../services/achievementService");

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

module.exports = {handleGetAllAchievements, handleGetAchievementProgress, handleGetAchieved};