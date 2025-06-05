const express = require('express');
const userRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');
const {getAllUsersController, handlePostSignup} = require("../controllers/userController");

userRouter.get('/getAllUsers', checkJwt, getAllUsersController);
userRouter.post('/postSignup', checkJwt, handlePostSignup);

module.exports = userRouter;