const express = require('express');
const socialPostRouter = express.Router();

const {getPostAndCommentCount, handleGetPosts, handleGetPostComments} = require("../controllers/socialPostController");

socialPostRouter.get('/get-post-comment-count', getPostAndCommentCount)
socialPostRouter.get('/', handleGetPosts)
socialPostRouter.get('/comments/:postId', handleGetPostComments)


module.exports = socialPostRouter;