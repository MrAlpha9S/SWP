const express = require('express');
const checkInRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');
const {handlePostCheckIn, handleGetDataSet, isCheckedIn} = require("../controllers/checkInController");


checkInRouter.post('/post-check-in', checkJwt, handlePostCheckIn);
checkInRouter.get('/get-data-set', checkJwt, handleGetDataSet)
checkInRouter.get('/check-in-status', checkJwt, isCheckedIn)

module.exports = checkInRouter;