const {userExists, createUser, postUserProfile, userProfileExists} = require('../services/userService');
const {getUserFromAuth0} = require("../services/auth0Service");

const handlePostSignup = async (req, res) => {
    const {userAuth0Id} = req.body;
    if (!userAuth0Id) return res.status(400).json({success: false, message: 'userAuth0Id required'});

    try {
        if (await userExists(userAuth0Id)) {
            return res.status(200).json({success: false, message: 'User info already exist'});
        }

        const userData = await getUserFromAuth0(userAuth0Id);
        await createUser(userAuth0Id, userData.name || '', userData.email || '');

        return res.status(201).json({success: true, message: 'User info inserted'});
    } catch (err) {
        console.error('post signup error:', err);
        return res.status(500).json({success: false, message: 'Internal server error: ' + err.message});
    }
};

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


module.exports = {handlePostSignup, handlePostOnboarding};
