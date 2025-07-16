const express = require('express');
const checkJwt = require('../middlewares/jwtChecker');
const {handleGetAllAchievements, handleGetAchievementProgress, handleGetAchieved} = require("../controllers/achievementController");
const achievementRouter = express.Router();

achievementRouter.get('/', checkJwt, handleGetAllAchievements)
achievementRouter.get('/progress/:userAuth0Id', checkJwt, handleGetAchievementProgress)
achievementRouter.get('/achieved/:userAuth0Id', checkJwt, handleGetAchieved)

module.exports = achievementRouter;