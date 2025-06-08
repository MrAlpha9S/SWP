const express = require('express');
const checkInRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');
const {handlePostCheckIn, handleGetDataSet} = require("../controllers/checkInController");


checkInRouter.post('/post-check-in', checkJwt, handlePostCheckIn);
checkInRouter.get('/get-data-set', checkJwt, handleGetDataSet)

module.exports = checkInRouter;