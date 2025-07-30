const express = require('express');
const coachRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');
const {getDashboardStats, getUserCommissionDataset} = require("../controllers/coachController");
const { handleCoachRegistration, handleGetCoachRegistrationInfo } = require('../controllers/adminController');

coachRouter.get('/stats/:userAuth0Id', checkJwt, getDashboardStats)
coachRouter.get('/user-commission-dataset/:userAuth0Id', checkJwt, getUserCommissionDataset)
coachRouter.post('/register', checkJwt, handleCoachRegistration);
coachRouter.get('/registration-info', checkJwt, handleGetCoachRegistrationInfo);


module.exports = coachRouter;