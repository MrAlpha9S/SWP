const {userProfileExists, postUserProfile, getUserProfile} = require("../services/profileService");
const {getUserFromAuth0} = require("../services/auth0Service");


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

    try {
        if (await userProfileExists(userAuth0Id)) {
            return res.status(200).json({success: false, message: 'User profile already exists'});
        }

        const postResult = await postUserProfile(
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

        return res.status(201).json({success: true, message: 'User profile inserted'});
    } catch (err) {
        console.error('post onboarding error:', err);
        return res.status(500).json({success: false, message: 'Internal server error: ' + err.message});
    }
}

const handleGetProfile = async (req, res) => {
    const { userAuth0Id } = req.body;

    if (!userAuth0Id) return res.status(400).json({success: false, message: 'userAuth0Id required'});

    try {
        const userProfile = await getUserProfile(userAuth0Id);
        if (!userProfile) {
            return res.status(404).json({success: false, message: 'User profile not found'});
        } else {
            return res.status(200).json(userProfile);
        }
    } catch (err) {
        console.error('handleGetProfile error:', err);
        return res.status(500).json({success: false, message: 'Internal server error: ' + err.message});
    }
}


module.exports = {handlePostOnboarding, handleGetProfile};
