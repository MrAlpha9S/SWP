const express = require('express');
const userRouter = express.Router();
const jwtCheck = require('../middlewares/jwtChecker');
const {getAllUsersController} = require("../controllers/userController");

userRouter.get('/getAllUsers', jwtCheck, getAllUsersController);

module.exports = userRouter;