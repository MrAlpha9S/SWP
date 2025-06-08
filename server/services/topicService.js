const {poolPromise} = require("../configs/sqlConfig");

const Topic = async (topic_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('topic_id', topic_id)
            .query('SELECT * FROM Topics WHERE topic_id = @topic_id');
        return result.recordset[0];
    } catch (error) {
        console.error('error in topic', error);
        return false;
    }
};

module.exports = {Topic};