const express = require('express');
const userRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');
const {getAllUsersController, handlePostSignup, getUserCreationDate, updateUserSubscription,
    getCoachesController, getCoachByIdController, assignUserToCoachController
} = require("../controllers/userController");
const { getUserInfo, updateUserInfo, updateUserController} = require("../controllers/userController");

userRouter.get('/getAllUsers', checkJwt, getAllUsersController);
userRouter.post('/postSignup', checkJwt, handlePostSignup);
userRouter.get('/get-user-creation-date', checkJwt, getUserCreationDate)
userRouter.patch('/update-user', checkJwt, updateUserController)
userRouter.get('/info', checkJwt, getUserInfo);
userRouter.put('/info', checkJwt, updateUserInfo);
userRouter.post('/update-subscription', checkJwt, updateUserSubscription)
userRouter.get('/get-coaches', getCoachesController)
userRouter.get('/coaches/:coachId', getCoachByIdController)
userRouter.post('/assign-coach', checkJwt, assignUserToCoachController)

module.exports = userRouter;