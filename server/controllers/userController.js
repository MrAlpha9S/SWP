const {
    getAllUsers,
    updateUserSubscriptionService,
    getUserIdFromAuth0Id,
    getCoaches,
    getCoachDetailsById, assignUserToCoachService
} = require('../services/userService');
const {updateUserService} = require('../services/userService');

const {updateUserAuth0} = require("../services/auth0Service");
const {getUserByAuth0Id, updateUserByAuth0Id} = require('../services/userService');
const {userExists, createUser, getUserCreationDateFromAuth0Id, allMember} = require('../services/userService');
const {getUserFromAuth0} = require("../services/auth0Service");
const {getCurrentUTCDateTime} = require("../utils/dateUtils");
const {getSubscriptionService, addSubscriptionPurchaseLog} = require("../services/subscriptionService");
const socket = require('../utils/socket');

const handleAllMember = async (req, res) => {
    try {

        const members = await allMember();
        return res.status(200).json({ data: members });
    } catch (error) {
        console.error('Error in handleAllMember:', error);
        return res.status(500).json({ error: 'Failed to handleAllMember' });
    }
};

const handlePostSignup = async (req, res) => {
    const {userAuth0Id} = req.body;
    if (!userAuth0Id) return res.status(400).json({success: false, message: 'userAuth0Id required'});

    try {
        if (await userExists(userAuth0Id)) {
            return res.status(200).json({success: true, message: 'User info already exist'});
        }

        const userData = await getUserFromAuth0(userAuth0Id);

        await createUser(userAuth0Id, userData.name || '', userData.email || '', userData.created_at, userData.picture, userData.identities[0].isSocial);

        return res.status(201).json({success: true, message: 'User info inserted'});
    } catch (err) {
        console.error('post signup error:', err);
        return res.status(500).json({success: false, message: 'Internal server error: ' + err.message});
    }
};

const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error in getAllUsersController:', error);
        res.status(500).json({error: 'Failed to fetch users'});
    }
};

const getUserCreationDate = async (req, res) => {
    const {userAuth0Id} = req.query;
    if (!userAuth0Id) return res.status(400).json({success: false, message: 'userAuth0Id required', data: null});

    try {

        const creationDate = await getUserCreationDateFromAuth0Id(userAuth0Id);


        return res.status(201).json({success: true, message: 'User creation date fetched', data: creationDate});
    } catch (err) {
        console.error('post signup error:', err);
        return res.status(500).json({success: false, message: 'Internal server error: ' + err.message, data: null});
    }
}

const updateUserSubscription = async (req, res) => {
    const {userAuth0Id, subscriptionId} = req.body;

    if (!userAuth0Id) return res.status(400).json({success: false, message: 'userAuth0Id required', data: null});
    try {
        const user_id = await getUserIdFromAuth0Id(userAuth0Id);
        const today = getCurrentUTCDateTime().toISOString();
        const vip_end_date = new Date(today);
        const subsInfo = await getSubscriptionService(subscriptionId);
        const duration = subsInfo.duration
        vip_end_date.setMonth(vip_end_date.getUTCMonth() + duration);
        const updateResult = await updateUserSubscriptionService(user_id, subscriptionId, vip_end_date.toISOString());
        const addSubsLogResult = await addSubscriptionPurchaseLog(user_id, subscriptionId, today);
        if (updateResult && addSubsLogResult) {
            const data = {...subsInfo, vip_end_date};
            res.status(200).json({success: true, message: 'Update subscription successfully', data: data});
        } else res.status(500).json({success: false, message: 'Update subscription failed'});
    } catch (err) {
        console.error('Error in updateUserSubscription:', err);
        res.status(500).json({success: false, message: 'Internal server error: ' + err.message, data: null});
    }
}

const getCoachesController = async (req, res) => {
    try {
        const result = await getCoaches();
        if (result.length > 0) return res.status(200).json({
            success: true,
            message: 'Fetch coaches successfully',
            data: result
        });
    } catch (err) {
        console.error('Error in getCoachesController:', err);
        res.status(500).json({success: false, message: 'Internal server error: ' + err.message, data: null});
    }
}

const getCoachByIdController = async (req, res) => {
    const { coachId } = req.params;
    const id = parseInt(coachId);

    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    try {
        let coachDetails = await getCoachDetailsById(id, null);

        if (!coachDetails) {
            coachDetails = await getCoachDetailsById(null, id);
        }

        if (!coachDetails) {
            return res.status(404).json({success: true, message: 'Coach not found or student is not assigned a coach.', data: null});
        }

        return res.status(200).json({success: true, message: 'Coach found.', data: coachDetails});
    } catch (error) {
        console.error('Error in getCoachByIdController:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const updateUserController = async (req, res) => {
    const {userAuth0Id, username, email, avatar, password} = req.body;
    if (!username && !email && !avatar && !password) {
        return res.status(400).json({success: false, message: 'credentials to update missing'});
    } else {
        try {
            const updateResult = await updateUserService(userAuth0Id, username, email, avatar);
            const isSocial = updateResult.is_social;
            if (isSocial != null) {
                const auth0UserUpdateResult = await updateUserAuth0(userAuth0Id, username, email, avatar, password, isSocial);
                if (auth0UserUpdateResult) {
                    return res.status(200).json({success: true, message: 'User updated successfully'});
                } else {
                    return res.status(400).json({success: false, message: 'Update user auth0 failed'});
                }
            } else {
                return res.status(400).json({success: false, message: 'Update user in database failed'});
            }
        } catch (err) {
            console.error('error in updateUserController:', err);
            return res.status(500).json({success: false, message: 'Internal server error: ' + err.message});
        }
    }
}

const getUserInfo = async (req, res) => {
    try {
        // Lấy userAuth0Id từ query hoặc từ token (tùy bạn)
        const userAuth0Id = req.query.userAuth0Id || req.body.userAuth0Id;
        if (!userAuth0Id) return res.status(400).json({success: false, message: "Missing userAuth0Id"});

        const user = await getUserByAuth0Id(userAuth0Id);
        if (!user) return res.status(404).json({success: false, message: "User not found"});

        return res.json({success: true, data: user});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

const updateUserInfo = async (req, res) => {
    try {
        const {userAuth0Id, username, email, avatar} = req.body;
        if (!userAuth0Id) return res.status(400).json({success: false, message: "Missing userAuth0Id"});

        const updated = await updateUserByAuth0Id(userAuth0Id, {username, email, avatar});
        return res.json({success: true, data: updated});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

const assignUserToCoachController = async (req, res) => {
    const { coachId, userId, username, coachAuth0Id } = req.body;

    try {
        if (!coachId || !userId) {
            return res.status(400).json({success: false, message: "Missing ids"});
        }
        const assignResult = await assignUserToCoachService(coachId, userId);
        if (assignResult) {
            const io = socket.getIo()
            io.to(coachAuth0Id).emit('coach_selected', {
                userId,
                username,
                assignResult,
                timestamp: getCurrentUTCDateTime().toISOString()
            });
            return res.status(200).json({success: true, message: "Assign successful"});
        } else {
            return res.status(500).json({success: false, message: "Assign failed"});
        }
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
}

module.exports = {
    getAllUsersController,
    handlePostSignup,
    getUserCreationDate,
    updateUserSubscription,
    getCoachesController,
    getCoachByIdController,
    updateUserController,
    getUserInfo,
    updateUserInfo,
    assignUserToCoachController,
    handleAllMember
};
