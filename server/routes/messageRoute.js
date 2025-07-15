const express = require('express');
const messageRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');

const {HandleSendMessage, HandleUserConversations, HandleMessageConversations, HandleCreateConversation} = require('../controllers/messageController')

messageRouter.post('/sendmessage', checkJwt, HandleSendMessage);
messageRouter.post('/userconversations', checkJwt, HandleUserConversations);
messageRouter.post('/messageconversations', checkJwt, HandleMessageConversations);
messageRouter.post('/createconversation', checkJwt, HandleCreateConversation);

module.exports = messageRouter;