const express = require('express');
const messageRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');

const {HandleSendMessage} = require('../controllers/messageController')

messageRouter.post('/sendmessage', checkJwt, HandleSendMessage);

module.exports = messageRouter;