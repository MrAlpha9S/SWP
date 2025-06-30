const { SendMessage, GetUserConversations, GetMessageConversation, CreateConversation } = require('../services/messageService');

const HandleCreateConversation = async (req, res) => {
    const auth0_id  = req.body.auth0_id;
    const conversation_name = req.body.conversation_name;
    const created_at = req.body.created_at;
    const user_id = req.body.user_id;

    if (!auth0_id || !conversation_name || !created_at || !user_id) {
        return res.status(400).json({ success: false, message: 'error in HandleCreateConversation: params is required', data: null });
    }

    try {
        const data = await CreateConversation(auth0_id, conversation_name, created_at, user_id);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Cant HandleCreateConversation', data: null });
        }
        return res.status(200).json({ success: true, message: 'HandleCreateConversation successfully', data: data });
    } catch (error) {
        console.error('Error in HandleCreateConversation:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }

}

const HandleMessageConversations = async (req, res) => {
    const auth0_id  = req.body.auth0_id;

    if (!auth0_id) {
        return res.status(400).json({ success: false, message: 'error in HandleMessageConversations: params is required', data: null });
    }

    try {
        const data = await GetMessageConversation(auth0_id);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Cant HandleMessageConversations', data: null });
        }
        return res.status(200).json({ success: true, message: 'HandleMessageConversations successfully', data: data });
    } catch (error) {
        console.error('Error in HandleMessageConversations:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }

}

const HandleUserConversations = async (req, res) => {
    const auth0_id  = req.body.auth0_id;

    if (!auth0_id) {
        return res.status(400).json({ success: false, message: 'error in HandleUserConversations: params is required', data: null });
    }

    try {
        const data = await GetUserConversations(auth0_id);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Cant HandleUserConversations', data: null });
        }
        return res.status(200).json({ success: true, message: 'HandleUserConversations successfully', data: data });
    } catch (error) {
        console.error('Error in HandleUserConversations:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }

}

const HandleSendMessage = async (req, res) => {
    const auth0_id  = req.body.auth0_id;
    const conversationId = req.body.conversationId;
    const content = req.body.content;
    const created_at = req.body.created_at;
    console.log('HandleSendMessage called with:', {
        auth0_id,
        conversationId,
        content,
        created_at
    });

    if (!auth0_id || !conversationId || !content || !created_at) {
        return res.status(400).json({ success: false, message: 'error in HandleSendMessage: params is required', data: null });
    }

    try {
        const data = await SendMessage(auth0_id, conversationId, content, created_at);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Cant HandleSendMessage', data: null });
        }
        return res.status(200).json({ success: true, message: 'HandleSendMessage successfully', data: data });
    } catch (error) {
        console.error('Error in HandleSendMessage:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }

}

module.exports = {
    HandleSendMessage,
    HandleUserConversations,
    HandleMessageConversations,
    HandleCreateConversation,
};