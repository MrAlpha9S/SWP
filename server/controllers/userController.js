const { getAllUsers, updateUserSubscriptionService, getUserIdFromAuth0Id, getCoaches, getCoachDetailsById} = require('../services/userService');

const {userExists, createUser, getUserCreationDateFromAuth0Id, getUser} = require('../services/userService');
const {getUserFromAuth0} = require("../services/auth0Service");
const {getCurrentUTCDateTime} = require("../utils/dateUtils");
const {getSubscriptionService, addSubscriptionPurchaseLog} = require("../services/subscriptionService");

const handlePostSignup = async (req, res) => {
    const {userAuth0Id} = req.body;
    if (!userAuth0Id) return res.status(400).json({success: false, message: 'userAuth0Id required'});

    try {
        if (await userExists(userAuth0Id)) {
            return res.status(200).json({success: true, message: 'User info already exist'});
        }

        const userData = await getUserFromAuth0(userAuth0Id);

        await createUser(userAuth0Id, userData.name || '', userData.email || '', userData.created_at, userData.picture);

        return res.status(201).json({success: true, message: 'User info inserted'});
    } catch (err) {
        console.error('post signup error:', err);
        return res.status(500).json({success: false, message: 'Internal server error: ' + err.message});
    }
};

const getUserController = async (req, res) => {
    try {
        const auth0_id = req.params.auth0_id
        const user = await getUser(auth0_id);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error in getUserController:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in getAllUsersController:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
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
        }
        else res.status(500).json({success: false, message: 'Update subscription failed'});
    } catch (err) {
        console.error('Error in updateUserSubscription:', err);
        res.status(500).json({success: false, message: 'Internal server error: ' + err.message, data: null});
    }
}

const getCoachesController = async (req, res) => {
    try {
        const result = await getCoaches();
        if (result.length > 0) return res.status(200).json({success: true, message: 'Fetch coaches successfully', data: result});
    } catch (err) {
        console.error('Error in getCoachesController:', err);
        res.status(500).json({success: false, message: 'Internal server error: ' + err.message, data: null});
    }
}

const getCoachByIdController = async (req, res) => {
    const coachId = Number(req.params.coachId);

    try {
        const result = await getCoachDetailsById(coachId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Coach not found',
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Fetched coach successfully',
            data: result
        });
    } catch (err) {
        console.error('Error in getCoachByIdController:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error: ' + err.message,
            data: null
        });
    }
};


module.exports = { getAllUsersController, handlePostSignup, getUserCreationDate, getUserController, updateUserSubscription, getCoachesController, getCoachByIdController };
