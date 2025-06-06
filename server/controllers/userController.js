const { getAllUsers } = require('../services/userService');

const {userExists, createUser} = require('../services/userService');
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

const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in getAllUsersController:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

module.exports = { getAllUsersController, handlePostSignup };
