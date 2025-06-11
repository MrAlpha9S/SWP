const {poolPromise, sql} = require("../configs/sqlConfig");
const {getUserIdFromAuth0Id} = require("./userService")
const {getCurrentUTCDateTime} = require("../utils/dateUtils");


const postCheckIn = async (userAuth0Id,
                                  feel,
                                  checkedQuitItems,
                                  cigsSmoked,
                                  freeText,
                                  qna) => {
    try {
        const pool = await poolPromise;
        const userId = await getUserIdFromAuth0Id(userAuth0Id);

        //Insert checkin_log
        const result = await pool.request()
            .input('user_id', sql.Int, userId)
            .input('feeling', sql.VarChar(10), feel)
            .input('logged_at', sql.DateTime, getCurrentUTCDateTime().toISOString())
            .input('cigs_smoked', sql.Int, typeof cigsSmoked === 'number' ? cigsSmoked : null)
            .query(`INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked)
                        OUTPUT INSERTED.log_id
                    VALUES (@user_id, @feeling, @logged_at, @cigs_smoked)`);

        const log_id = result.recordset[0].log_id;

        //Insert qna

        if (qna) {
            for (const [key, value] of Object.entries(qna)) {
                await pool.request()
                    .input('log_id', sql.Int, log_id)
                    .input('qna_question', sql.VarChar(30), key)
                    .input('qna_answer', sql.NVarChar(sql.MAX), value ?? null)
                    .query(`
        INSERT INTO qna (log_id, qna_question, qna_answer)
        VALUES (@log_id, @qna_question, @qna_answer)
      `);
            }
        }

        //Insert quit items
        for (const quitItem of checkedQuitItems ?? []) {
            await pool.request()
                .input('item_value', sql.VarChar(30), quitItem)
                .input('log_id', sql.Int, log_id)
                .query('INSERT INTO quitting_items (item_value, log_id) VALUES (@item_value, @log_id)');
        }

        //Insert freetext
        await pool.request()
            .input('log_id', sql.Int, log_id)
            .input('free_text_content', sql.NVarChar(sql.MAX), freeText ?? null)
            .query('INSERT INTO free_text (log_id, free_text_content) VALUES (@log_id, @free_text_content)');

        return true;
    } catch (error) {
        console.error('error in userProfileExists', error);
        return false;
    }
}

const getCheckInLogDataset = async (userAuth0Id) => {
    try {
        const pool = await poolPromise;
        const userId = await getUserIdFromAuth0Id(userAuth0Id);

        const checkin_logs = await pool.request()
            .input('user_id', sql.Int, userId)
            .query('SELECT logged_at as date, cigs_smoked as cigs FROM checkin_log WHERE user_id = @user_id');
        return checkin_logs.recordset;

    } catch (error) {
        console.error('error in getCheckInLogDataset', error);
        return false;
    }
}

module.exports = {postCheckIn, getCheckInLogDataset};