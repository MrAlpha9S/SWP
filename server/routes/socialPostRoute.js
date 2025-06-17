const express = require('express');
const socialPostRouter = express.Router();

const {getPostAndCommentCount, handleGetPostByCategory, handleGetPosts} = require("../controllers/socialPostController");

socialPostRouter.get('/get-post-comment-count', getPostAndCommentCount)
socialPostRouter.get('/:category_tag', handleGetPostByCategory)
socialPostRouter.get('/', handleGetPosts)


module.exports = socialPostRouter;