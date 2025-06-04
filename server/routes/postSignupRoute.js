const express = require('express');
const postSignupRouter = express.Router();
const { handlePostSignup } = require('../controllers/onboardingController');
const jwtCheck = require('../middlewares/jwtChecker');

postSignupRouter.post('/', jwtCheck, handlePostSignup);

module.exports = postSignupRouter;