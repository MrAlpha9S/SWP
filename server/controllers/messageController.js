const { SendMessage } = require('../services/messageService');

const HandleSendMessage = async (req, res) => {
    const auth0_id  = req.body.auth0_id;
    const conversationId = req.body.conversationId;
    const content = req.body.content;
    const created_at = req.body.created_at;

    if (!auth0_id || !conversationId || !content || !created_at) {
        return res.status(400).json({ success: false, message: 'error in HandleSendMessage: params is required', data: null });
    }

    try {
        const blog = await SendMessage(auth0_id, conversationId, content, created_at);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Cant HandleSendMessage', data: null });
        }
        return res.status(200).json({ success: true, message: 'HandleSendMessage successfully', data: blog });
    } catch (error) {
        console.error('Error in handleGetBlog:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', data: null });
    }

}

module.exports = {
    HandleSendMessage,
};