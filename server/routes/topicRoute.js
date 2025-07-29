const express = require('express');
const topicRouter = express.Router();
const { handleGetTopic } = require('../controllers/topicController');
const{ handleGetBlogById } = require('../controllers/adminController');
const { handleGetBlog, handlePostBlog, handleGetPostsOfUser, handleGetPostedBlog} = require('../controllers/blogController');
const checkJwt = require('../middlewares/jwtChecker');

//profileRouter.get('/getProfile', jwtCheck, handleGetProfile);
topicRouter.get('/get-blogs/:userAuth0Id', checkJwt, handleGetPostsOfUser)
topicRouter.post('/getblog', checkJwt, handleGetPostedBlog);
topicRouter.get('/getblogbyid/:id', checkJwt, handleGetBlogById);
topicRouter.post('/post_blog', checkJwt, handlePostBlog);
topicRouter.get('/:topic_id', handleGetTopic);
topicRouter.get('/:topic_id/:blog_id', handleGetBlog);


module.exports = topicRouter;