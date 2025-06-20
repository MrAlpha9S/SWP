const express = require('express');
const messageRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');

const {HandleSendMessage, HandleUserConversations, HandleMessageConversations} = require('../controllers/messageController')

messageRouter.post('/sendmessage', checkJwt, HandleSendMessage);
messageRouter.post('/userconversations', checkJwt, HandleUserConversations);
messageRouter.post('/messageconversations', checkJwt, HandleMessageConversations);

module.exports = messageRouter;