const express = require('express');
const checkInRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');
const {handlePostCheckIn, handleGetDataSet, getCheckInData} = require("../controllers/checkInController");


checkInRouter.post('/post-check-in', checkJwt, handlePostCheckIn);
checkInRouter.get('/get-data-set', checkJwt, handleGetDataSet)
checkInRouter.get('/get-check-in-data', checkJwt, getCheckInData)

module.exports = checkInRouter;