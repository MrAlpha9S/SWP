const {poolPromise} = require("../configs/sqlConfig");
const {getUserIdFromAuth0Id} = require('./userService');
const mssql = require('mssql')

const CreateConversation = async (auth0_id, conversation_name, created_at, user_id) => {
    try {
        const pool = await poolPromise;
        
        // Insert conversation and get the ID
        const result = await pool.request()
            .input('conversation_name', conversation_name)
            .input('created_at', mssql.DateTime, created_at)
            .query(`
                INSERT INTO [conversations] ([conversation_name], [created_at]) 
                OUTPUT INSERTED.conversation_id
                VALUES (@conversation_name, @created_at);
            `);
        const conversationId = result.recordset[0].conversation_id;
        
        // Insert user-conversation relationships
        const result1 = await pool.request()
            .input('conversation_id', conversationId)
            .input('user_id1', await getUserIdFromAuth0Id(auth0_id))
            .input('user_id2', await getUserIdFromAuth0Id(user_id))
            .query(`
                INSERT INTO [user_conversation] ([conversation_id], [user_id]) 
                VALUES (@conversation_id, @user_id1), (@conversation_id, @user_id2);
            `);

        if(result.rowsAffected[0] === 0 || result1.rowsAffected[0] === 0) {
            throw new Error('Error in insert CreateConversation');
        }
        
        return conversationId; // Return the ID instead of just true
    } catch (error) {
        console.error('Error in CreateConversation:', error);
        return false;
    }
};

const GetMessageConversation = async (auth0_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_id', await getUserIdFromAuth0Id(auth0_id))
            .query(`SELECT 
    m.message_id,
    m.conversation_id,
    m.user_id,
    u.username,
    u.auth0_id,
    m.content,
    m.created_at
FROM messages m
JOIN users u ON m.user_id = u.user_id
WHERE m.conversation_id IN (
    SELECT conversation_id
    FROM user_conversation
    WHERE user_id = @user_id
)
ORDER BY m.conversation_id, m.created_at;`);
        // if(result.rowsAffected[0] === 0) {
        //     throw new Error('error in insert GetMessageConversation');
        // }
        return result.recordset;
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
            .query(`SELECT 
  uc2.conversation_id,
  c.created_at,
  uc2.user_id,
  u.username AS conversation_name,
  u.avatar,
  u.auth0_id AS other_participant_id
FROM user_conversation uc
JOIN user_conversation uc2 
  ON uc.conversation_id = uc2.conversation_id
JOIN conversations c 
  ON c.conversation_id = uc2.conversation_id
JOIN users u 
  ON uc2.user_id = u.user_id
WHERE uc.user_id = @user_id
  AND uc2.user_id != @user_id;`);
        // if(result.rowsAffected[0] === 0) {
        //     throw new Error('error in insert GetUserConversations');
        // }
        return result.recordset;
    } catch (error) {
        console.error('error in GetUserConversations', error);
        return false;
    }
};

const SendMessage = async (auth0_id, conversationId, content, created_at) => {
    try {
        console.log('SendMessage called with:', {
            auth0_id,
            conversationId,
            content,
            created_at
        });
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