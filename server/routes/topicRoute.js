const express = require('express');
const topicRouter = express.Router();
const { handleGetTopic } = require('../controllers/topicController');
const { handleGetBlog } = require('../controllers/blogController');
const checkJwt = require('../middlewares/jwtChecker');

//profileRouter.get('/getProfile', jwtCheck, handleGetProfile);
topicRouter.get('/:topic_id', checkJwt, handleGetTopic);
topicRouter.get('/:topic_id/:blog_id', handleGetBlog);

module.exports = topicRouter;