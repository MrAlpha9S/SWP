const express = require('express');
const coachRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');
const {getDashboardStats} = require("../controllers/coachController");

coachRouter.get('/stats/:userAuth0Id', checkJwt, getDashboardStats)


module.exports = coachRouter;