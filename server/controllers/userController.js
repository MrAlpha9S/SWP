const { getAllUsers } = require('../services/userService');

const {userExists, createUser, getUserCreationDateFromAuth0Id, getUser} = require('../services/userService');
const {getUserFromAuth0} = require("../services/auth0Service");

const handlePostSignup = async (req, res) => {
    const {userAuth0Id} = req.body;
    if (!userAuth0Id) return res.status(400).json({success: false, message: 'userAuth0Id required'});

    try {
        if (await userExists(userAuth0Id)) {
            const userData = await getUserFromAuth0(userAuth0Id);

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

module.exports = { getAllUsersController, handlePostSignup, getUserCreationDate, getUserController };
