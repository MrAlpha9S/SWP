const express = require('express');
const socialPostRouter = express.Router();

const checkJwt = require('../middlewares/jwtChecker');
const {getPostAndCommentCount} = require("../controllers/socialPostController");

socialPostRouter.get('/get-post-comment-count', getPostAndCommentCount)


module.exports = socialPostRouter;