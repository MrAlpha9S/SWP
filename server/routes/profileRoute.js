const express = require('express');
const profileRouter = express.Router();
const { handleGetProfile, handlePostOnboarding, handleGoalPost} = require('../controllers/profileController');
const checkJwt = require('../middlewares/jwtChecker');

//profileRouter.get('/getProfile', jwtCheck, handleGetProfile);
profileRouter.post('/postOnboarding', checkJwt, handlePostOnboarding);
profileRouter.post('/getProfile', checkJwt, handleGetProfile)
profileRouter.post('/postGoal', checkJwt, handleGoalPost)

module.exports = profileRouter;