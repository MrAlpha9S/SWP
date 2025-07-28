const {poolPromise} = require("../configs/sqlConfig");

const Topic = async (topic_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('topic_id', topic_id)
            .query(`select tp.topic_id, tp.topic_name, tp.topic_content, bp.blog_id, bp.title, bp.description, bp.isPendingForApprovement from blog_posts bp
JOIN Topics tp on tp.topic_id = bp.topic_id
where tp.topic_id = @topic_id AND bp.isPendingForApprovement = 0`);
        return result.recordset;
    } catch (error) {
        console.error('error in topic', error);
        return false;
    }
};

module.exports = {Topic};