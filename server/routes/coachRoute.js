const express = require('express');
const coachRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');
const {getDashboardStats, getUserCommissionDataset} = require("../controllers/coachController");

coachRouter.get('/stats/:userAuth0Id', checkJwt, getDashboardStats)
coachRouter.get('/user-commission-dataset/:userAuth0Id', checkJwt, getUserCommissionDataset)


module.exports = coachRouter;