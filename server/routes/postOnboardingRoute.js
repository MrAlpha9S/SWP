const express = require('express');
const postOnboardingRouter = express.Router();
const { handlePostOnboarding } = require('../controllers/onboardingController');
const jwtCheck = require('../middlewares/jwtChecker');

postOnboardingRouter.post('/', jwtCheck, handlePostOnboarding);

module.exports = postOnboardingRouter;