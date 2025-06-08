const express = require('express');
const checkInRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');
const {handlePostCheckIn} = require("../controllers/checkInController");


checkInRouter.post('/post-check-in', checkJwt, handlePostCheckIn);

module.exports = checkInRouter;