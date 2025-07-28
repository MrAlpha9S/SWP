const express = require('express');
const socialPostRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');
const {handleDeleteComment, handleApprovePost, handleDeleteSocialPosts, handleUpdateSocialPosts, handleGetIsPendingPosts, getPostAndCommentCount, handleGetPosts, handleGetPostComments, handlePostSocialPosts, handleAddComment, handleAddLike} = require("../controllers/socialPostController");

socialPostRouter.get('/get-post-comment-count', getPostAndCommentCount)
socialPostRouter.get('/', handleGetPosts)
socialPostRouter.get('/comments/:postId/:currentUserId', handleGetPostComments)
socialPostRouter.post('/post-socialposts', checkJwt, handlePostSocialPosts)
socialPostRouter.post('/addcomment', checkJwt, handleAddComment)
socialPostRouter.post('/like', checkJwt, handleAddLike)
socialPostRouter.post('/update', checkJwt, handleUpdateSocialPosts)
socialPostRouter.post('/delete', checkJwt, handleDeleteSocialPosts)
socialPostRouter.get('/getIsPendingPosts', checkJwt, handleGetIsPendingPosts)
socialPostRouter.post('/approvepost', checkJwt, handleApprovePost)
socialPostRouter.post('/deletecomment', checkJwt, handleDeleteComment)


module.exports = socialPostRouter;