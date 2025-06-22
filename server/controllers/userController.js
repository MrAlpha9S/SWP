const { getAllUsers } = require('../services/userService');

const {userExists, createUser, getUserCreationDateFromAuth0Id, getUserByAuth0Id, updateUserByAuth0Id} = require('../services/userService');
const {getUserFromAuth0} = require("../services/auth0Service");

const handlePostSignup = async (req, res) => {
    const {userAuth0Id} = req.body;
    if (!userAuth0Id) return res.status(400).json({success: false, message: 'userAuth0Id required'});

    try {
        if (await userExists(userAuth0Id)) {
            const userData = await getUserFromAuth0(userAuth0Id);
            console.log(userData);
            return res.status(200).json({success: true, message: 'User info already exist'});
        }

        const userData = await getUserFromAuth0(userAuth0Id);
        console.log(userData);
        await createUser(userAuth0Id, userData.name || '', userData.email || '', userData.created_at, userData.picture);

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

const getUserInfo = async (req, res) => {
    try {
        // Lấy userAuth0Id từ query hoặc từ token (tùy bạn)
        const userAuth0Id = req.query.userAuth0Id || req.body.userAuth0Id;
        if (!userAuth0Id) return res.status(400).json({ success: false, message: "Missing userAuth0Id" });

        const user = await getUserByAuth0Id(userAuth0Id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateUserInfo = async (req, res) => {
    try {
        const { userAuth0Id, username, email, avatar } = req.body;
        if (!userAuth0Id) return res.status(400).json({ success: false, message: "Missing userAuth0Id" });

        const updated = await updateUserByAuth0Id(userAuth0Id, { username, email, avatar });
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getAllUsersController, handlePostSignup, getUserCreationDate, getUserInfo, updateUserInfo };
