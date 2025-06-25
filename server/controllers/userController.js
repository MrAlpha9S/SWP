const { getAllUsers, updateUserService} = require('../services/userService');

const {userExists, createUser, getUserCreationDateFromAuth0Id, getUser} = require('../services/userService');
const  {updateUserAuth0} = require("../services/auth0Service");
const {getUserByAuth0Id, updateUserByAuth0Id} = require('../services/userService');
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
    const isEmpty = (v) => v === undefined || v === null || v === "";

    if (!userAuth0Id) {
        return res.status(400).json({success: false, message: 'userAuth0Id missing'});
    }
    if (
        isEmpty(username) &&
        isEmpty(email) &&
        isEmpty(avatar) &&
        isEmpty(password)
    ) {
        return res.status(400).json({success: false, message: 'credentials to update missing'});
    } else {
        try {
            const updateResult = await updateUserService(userAuth0Id, username, email, avatar);
            const isSocial = updateResult.is_social;
            if (isSocial != null) {
                const auth0UserUpdateResult = await updateUserAuth0(userAuth0Id, username, email, avatar, password, isSocial);
                if (auth0UserUpdateResult || isSocial) {
                    // Nếu là social, chỉ cần database thành công là đủ
                    return res.status(200).json({
                        success: true,
                        message: isSocial
                            ? 'Đã cập nhật database (tài khoản social không thể cập nhật lên Auth0)'
                            : 'User updated successfully'
                    });
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
        if (!userAuth0Id) return res.status(400).json({ success: false, message: "Missing userAuth0Id" });

        const user = await getUserByAuth0Id(userAuth0Id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        return res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateUserInfo = async (req, res) => {
    try {
        const { userAuth0Id, username, email, avatar } = req.body;
        if (!userAuth0Id) return res.status(400).json({ success: false, message: "Missing userAuth0Id" });

        const updated = await updateUserByAuth0Id(userAuth0Id, { username, email, avatar });
        return res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getAllUsersController, handlePostSignup, updateUserController, getUserCreationDate, getUserInfo, updateUserInfo };
