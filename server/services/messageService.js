const {poolPromise} = require("../configs/sqlConfig");
const {getUserIdFromAuth0Id} = require('./userService');
const mssql = require('mssql')

const SendMessage = async (auth0_id, conversationId, content, created_at) => {
    try {
        const pool = await poolPromise;
        console.log('dateee', created_at)
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

module.exports = {SendMessage};