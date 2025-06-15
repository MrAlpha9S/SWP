const {userProfileExists, postUserProfile, getUserProfile, updateUserProfile, postGoal} = require("../services/profileService");


const handlePostOnboarding = async (req, res) => {
    const {
        userAuth0Id,
        readiness,
        reasonList,
        pricePerPack,
        cigsPerPack,
        timeAfterWaking,
        timeOfDayList,
        customTimeOfDay,
        triggers,
        customTrigger,
        startDate,
        quittingMethod,
        cigsReduced,
        expectedQuitDate,
        stoppedDate,
        cigsPerDay,
        planLog,
        goalList
    } = req.body;

    if (!userAuth0Id) return res.status(400).json({success: false, message: 'userId required'});
    let result = false

    try {
        if (await userProfileExists(userAuth0Id)) {

            result = updateUserProfile(userAuth0Id,
                readiness,
                reasonList,
                pricePerPack,
                cigsPerPack,
                timeAfterWaking,
                timeOfDayList,
                customTimeOfDay,
                triggers,
                customTrigger,
                startDate,
                quittingMethod,
                cigsReduced,
                expectedQuitDate,
                stoppedDate,
                cigsPerDay,
                planLog,
                goalList)
        } else {
            result = await postUserProfile(
                userAuth0Id,
                readiness,
                reasonList,
                pricePerPack,
                cigsPerPack,
                timeAfterWaking,
                timeOfDayList,
                customTimeOfDay,
                triggers,
                customTrigger,
                startDate,
                quittingMethod,
                cigsReduced,
                expectedQuitDate,
                stoppedDate,
                cigsPerDay,
                planLog,
                goalList)
        }
        if (result)
        return res.status(201).json({success: true, message: 'User profile inserted'});
    } catch (err) {
        console.error('post onboarding error:', err);
        return res.status(500).json({success: false, message: 'Internal server error: ' + err.message});
    }
}

const handleGetProfile = async (req, res) => {
    const {userAuth0Id} = req.body;

    if (!userAuth0Id) return res.status(400).json({success: false, message: 'userAuth0Id required', data: null});

    try {
        const userProfile = await getUserProfile(userAuth0Id);
        if (userProfile === null) {
            return res.status(404).json({success: false, message: 'User profile not found', data: null});
        } else {
            return res.status(200).json({success: true, message: 'User profile fetched', data: userProfile});
        }
    } catch (err) {
        console.error('handleGetProfile error:', err);
        return res.status(500).json({success: false, message: 'Internal server error: ' + err.message, data: null});
    }
}

const handleGoalPost = async (req, res) => {
    const {userAuth0Id, goalName, goalAmount, goalId, isCompleted, completedDate} = req.body;

    console.log(goalId);

    if (!userAuth0Id) return res.status(400).json({success: false, message: 'userAuth0Id required', data: false});

    try {
        const postResult = await postGoal(userAuth0Id, goalName, goalAmount, goalId, isCompleted, completedDate);
        if (postResult === false) {
            return res.status(404).json({success: false, message: 'Post goal failed', data: false});
        } else {
            return res.status(200).json({success: true, message: 'Goal posted', data: postResult});
        }
    } catch (err) {
        console.error('handleGoalPost error:', err);
        console.log("✅ Sent 500 response");
        return res.status(500).json({success: false, message: 'Internal server error: ' + err.message, data: false});
    }
}


module.exports = {handlePostOnboarding, handleGetProfile, handleGoalPost};
