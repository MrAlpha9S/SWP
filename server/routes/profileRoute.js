const express = require('express');
const profileRouter = express.Router();
const { handleGetProfile, handlePostOnboarding, handleGoalPost, handleGoalDelete} = require('../controllers/profileController');
const checkJwt = require('../middlewares/jwtChecker');

//profileRouter.get('/getProfile', jwtCheck, handleGetProfile);
profileRouter.post('/postOnboarding', checkJwt, handlePostOnboarding);
profileRouter.post('/getProfile', checkJwt, handleGetProfile)
profileRouter.post('/postGoal', checkJwt, handleGoalPost)
profileRouter.post('/delete-goal', checkJwt, handleGoalDelete)

module.exports = profileRouter;