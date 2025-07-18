const express = require('express');
const socialPostRouter = express.Router();

const {handleGetIsPendingPosts, getPostAndCommentCount, handleGetPosts, handleGetPostComments, handlePostSocialPosts, handleAddComment, handleAddLike} = require("../controllers/socialPostController");

socialPostRouter.get('/get-post-comment-count', getPostAndCommentCount)
socialPostRouter.get('/', handleGetPosts)
socialPostRouter.get('/comments/:postId/:currentUserId', handleGetPostComments)
socialPostRouter.post('/post-socialposts', handlePostSocialPosts)
socialPostRouter.post('/addcomment', handleAddComment)
socialPostRouter.post('/like', handleAddLike)
socialPostRouter.get('/getIsPendingPosts', handleGetIsPendingPosts)


module.exports = socialPostRouter;