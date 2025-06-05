const express = require('express');
const profileRouter = express.Router();
const { handleGetProfile, handlePostOnboarding} = require('../controllers/profileController');
const checkJwt = require('../middlewares/jwtChecker');

//profileRouter.get('/getProfile', jwtCheck, handleGetProfile);
profileRouter.post('/postOnboarding', checkJwt, handlePostOnboarding);
profileRouter.post('/getProfile', checkJwt, handleGetProfile)

module.exports = profileRouter;