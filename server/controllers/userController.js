const { getAllUsers, updateUserService} = require('../services/userService');

const {userExists, createUser, getUserCreationDateFromAuth0Id, getUser} = require('../services/userService');
const {getUserFromAuth0, updateUserAuth0} = require("../services/auth0Service");

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

const getUserController = async (req, res) => {
    try {
        const auth0_id = req.params.auth0_id
        const user = await getUser(auth0_id);
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error in getUserController:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        return res.status(200).json(users);
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

const updateUserController = async (req, res) => {
    const {userAuth0Id, username, email, avatar, password} = req.body;
    if (!username && !email && !avatar && !password) {
        return res.status(400).json({success: false, message: 'credentials to update missing'});
    } else {
        try {
            const userInAuth0 = await getUserFromAuth0(userAuth0Id)
            const isSocial = userInAuth0.identities.isSocial;
            const updateResult = await updateUserService(userAuth0Id, username, email, avatar);
            if (updateResult) {
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

module.exports = { getAllUsersController, handlePostSignup, getUserCreationDate, getUserController, updateUserController };
