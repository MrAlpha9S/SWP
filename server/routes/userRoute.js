const express = require('express');
const userRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');
const {getAllUsersController, handlePostSignup, getUserCreationDate, getUserController, updateUserSubscription} = require("../controllers/userController");

userRouter.get('/getUser/:auth0_id', checkJwt, getUserController);
userRouter.get('/getAllUsers', checkJwt, getAllUsersController);
userRouter.post('/postSignup', checkJwt, handlePostSignup);
userRouter.get('/get-user-creation-date', checkJwt, getUserCreationDate)
userRouter.post('/update-subscription', checkJwt, updateUserSubscription)

module.exports = userRouter;