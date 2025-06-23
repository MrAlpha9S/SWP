const express = require('express');
const userRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');
const {getAllUsersController, handlePostSignup, getUserCreationDate, getUserInfo, updateUserInfo, updateUserController} = require("../controllers/userController");

userRouter.get('/getAllUsers', checkJwt, getAllUsersController);
userRouter.post('/postSignup', checkJwt, handlePostSignup);
userRouter.get('/get-user-creation-date', checkJwt, getUserCreationDate)
userRouter.patch('/update-user', checkJwt, updateUserController)
userRouter.get('/info', checkJwt, getUserInfo);
userRouter.put('/info', checkJwt, updateUserInfo);

module.exports = userRouter;