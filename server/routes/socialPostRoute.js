const express = require('express');
const socialPostRouter = express.Router();

const {getPostAndCommentCount, handleGetPosts, handleGetPostComments, handlePostSocialPosts, handleAddComment} = require("../controllers/socialPostController");

socialPostRouter.get('/get-post-comment-count', getPostAndCommentCount)
socialPostRouter.get('/', handleGetPosts)
socialPostRouter.get('/comments/:postId', handleGetPostComments)
socialPostRouter.post('/post-socialposts', handlePostSocialPosts)
socialPostRouter.post('/addcomment', handleAddComment)


module.exports = socialPostRouter;