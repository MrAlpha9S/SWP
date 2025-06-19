const {poolPromise} = require("../configs/sqlConfig");
const {getUserIdFromAuth0Id} = require('./userService');
const mssql = require('mssql')

const CreateConversation = async (auth0_id, conversation_name, created_at, user_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('conversation_name', conversation_name)
            .input('created_at', mssql.DateTime, created_at)
            .query(`INSERT INTO [conversations] ([conversation_name], [created_at]) VALUES
(@conversation_name, @created_at); 
                    INSERT INTO [user_conversation] ([conversation_id], [user_id]) VALUES
(1, 1), (1, 2);`);
        const conversationId = result.recordset[0].conversation_id;

        const pool1 = await poolPromise;
        const result1 = await pool1.request()
            .input('conversation_id', conversationId)
            .input('user_id1', await getUserIdFromAuth0Id(auth0_id))
            .input('user_id2', user_id)
            .query(`INSERT INTO [user_conversation] ([conversation_id], [user_id]) VALUES
(@conversation_id, @user_id1), (@conversation_id, @user_id2);`);

        if(result.rowsAffected[0] === 0 || result1.rowsAffected[0] === 0) {
            throw new Error('error in insert CreateConversation');
        }
        return true;
    } catch (error) {
        console.error('error in CreateConversation', error);
        return false;
    }
};

const GetMessageConversation = async (conversation_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('conversation_id', conversation_id)
            .query(`SELECT * FROM [messages] WHERE conversation_id = @conversation_id;`);
        if(result.rowsAffected[0] === 0) {
            throw new Error('error in insert GetMessageConversation');
        }
        return true;
    } catch (error) {
        console.error('error in GetMessageConversation', error);
        return false;
    }
};

const GetUserConversations = async (auth0_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_id', await getUserIdFromAuth0Id(auth0_id))
            .query(`Select * from user_conversation uc
Join conversations c ON c.conversation_id = uc.conversation_id
Where uc.user_id = @user_id`);
        if(result.rowsAffected[0] === 0) {
            throw new Error('error in insert GetUserConversations');
        }
        return true;
    } catch (error) {
        console.error('error in GetUserConversations', error);
        return false;
    }
};

const SendMessage = async (auth0_id, conversationId, content, created_at) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_id', await getUserIdFromAuth0Id(auth0_id))
            .input('conversationId', conversationId)
            .input('content', content)
            .input('created_at', mssql.DateTime, created_at)
            .query(`INSERT INTO [messages] ([conversation_id], [user_id], [content], [created_at]) VALUES
(@conversationId, @user_id, @content, @created_at);`);
        if(result.rowsAffected[0] === 0) {
            throw new Error('error in insert send message');
        }
        return true;
    } catch (error) {
        console.error('error in SendMessage', error);
        return false;
    }
};

module.exports = {
    SendMessage,
    CreateConversation,
    GetMessageConversation,
    GetUserConversations
};