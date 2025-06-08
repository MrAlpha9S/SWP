const express = require('express');
const topicRouter = express.Router();
const { handleGetTopic } = require('../controllers/topicController');
const checkJwt = require('../middlewares/jwtChecker');

//profileRouter.get('/getProfile', jwtCheck, handleGetProfile);
topicRouter.get('/:topic_id', checkJwt, handleGetTopic);

module.exports = topicRouter;