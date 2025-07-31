const {poolPromise, sql} = require("../configs/sqlConfig");
const {getUserIdFromAuth0Id, getUserCreationDateFromAuth0Id} = require("./userService")
const {getCurrentUTCDateTime} = require("../utils/dateUtils");

const alreadyCheckedIn = async (userAuth0Id, checkInDate) => {
    try {
        const pool = await poolPromise;
        const userId = await getUserIdFromAuth0Id(userAuth0Id);

        console.log(checkInDate)

        const isAlreadyCheckedIn = await pool.request()
            .input('logged_at', sql.DateTime, new Date(checkInDate))
            .input('user_id', sql.Int, userId)
            .query(`
                SELECT *
                FROM checkin_log cl
                         JOIN users u ON cl.user_id = u.user_id
                WHERE CAST(logged_at AS DATE) = CAST(@logged_at AS DATE)
                  AND cl.user_id = @user_id
            `);

        return isAlreadyCheckedIn.recordset.length > 0;

    } catch (error) {
        console.log('error in alreadyCheckedIn', error)
        false
    }
}

const postCheckIn = async (userAuth0Id, feel, checkedQuitItems, cigsSmoked, freeText, qna, checkInDate) => {
    try {
        const pool = await poolPromise;
        const userId = await getUserIdFromAuth0Id(userAuth0Id);

        //Insert checkin_log
        const result = await pool.request()
            .input('user_id', sql.Int, userId)
            .input('feeling', sql.VarChar(10), feel)
            .input('logged_at', sql.DateTime, checkInDate)
            .input('cigs_smoked', sql.Int, typeof cigsSmoked === 'number' ? cigsSmoked : null)
            .query(`
                INSERT INTO checkin_log (user_id, feeling, logged_at, cigs_smoked)
                VALUES (@user_id, @feeling, @logged_at, @cigs_smoked);

                SELECT SCOPE_IDENTITY() as log_id;
            `);

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
        console.error('error in postCheckIn', error);
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

        return checkin_logs.recordset.sort((a, b) => new Date(a.date) - new Date(b.date));

    } catch (error) {
        console.error('error in getCheckInLogDataset', error);
        return false;
    }
}

const getCheckInDataService = async (userAuth0Id, date = null, action = null) => {
    try {
        const pool = await poolPromise;
        const userId = await getUserIdFromAuth0Id(userAuth0Id);

        let query = `
            SELECT cl.log_id,
                   cl.user_id,
                   cl.feeling,
                   cl.logged_at,
                   cl.cigs_smoked,
                   u.username,
                   u.email,
                   u.role,
                   CAST((SELECT qna_question, qna_answer FROM qna q WHERE q.log_id = cl.log_id FOR JSON
                        PATH) AS NVARCHAR(MAX)) AS qna,
                   ft.free_text_content,
                   CAST((SELECT item_value FROM quitting_items qi WHERE qi.log_id = cl.log_id FOR JSON
                        PATH) AS NVARCHAR(MAX)) AS quitting_items
            FROM checkin_log cl
                     LEFT JOIN users u ON cl.user_id = u.user_id
                     LEFT JOIN free_text ft ON cl.log_id = ft.log_id
            WHERE cl.user_id = @userId
        `;

        const request = pool.request().input('userId', sql.Int, userId);

        if (date) {
            const onDate = date.split('T')[0]; // Ensure YYYY-MM-DD format
            query += ` AND CAST(cl.logged_at AS DATE) = @onDate `;
            request.input('onDate', sql.Date, onDate);
        }

        query += `ORDER BY cl.logged_at DESC`;

        const result = await request.query(query);

        const mapped = result.recordset.map(row => ({
            log_id: row.log_id,
            user_id: row.user_id,
            feeling: row.feeling,
            logged_at: new Date(row.logged_at), // force date
            cigs_smoked: row.cigs_smoked,
            username: row.username,
            email: row.email,
            role: row.role,
            qna: row.qna ? JSON.parse(row.qna) : [],
            free_text_content: row.free_text_content || null,
            quitting_items: row.quitting_items ? JSON.parse(row.quitting_items).map(item => item.item_value) : []
        }));

        return !action || action !== 'journal' ? (date ? (mapped[0] ?? false) : mapped) : (date ? ((await fillMissingCheckInData(userAuth0Id, mapped))[0] ?? false) : await fillMissingCheckInData(userAuth0Id, mapped));


    } catch (err) {
        console.error('Error in getCheckInData:', err);
        return false;
    }
};


const fillMissingCheckInData = async (userAuth0Id, checkInResult) => {
    const userCreationDate = await getUserCreationDateFromAuth0Id(userAuth0Id);
    const today = getCurrentUTCDateTime();

    const result = [...checkInResult]; // clone

    const loggedDates = new Set(result.map(r => new Date(r.logged_at).toISOString().split('T')[0]));

    let current = new Date(userCreationDate);
    const end = new Date(today);
    let count = 0;

    while (current <= end && count < 366) {
        const dateISO = current.toISOString().split('T')[0];
        if (!loggedDates.has(dateISO)) {
            result.push({
                logged_at: new Date(current), isMissed: true
            });
        }
        current.setUTCDate(current.getUTCDate() + 1);
        count++;
    }

    return result.sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));
}

// Lấy tất cả check-in
const getAllCheckIns = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM checkin_log');
        return result.recordset;
    } catch (error) {
        console.error('error in getAllCheckIns', error);
        return [];
    }
};

// Lấy chi tiết check-in theo log_id
const getCheckInById = async (log_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().input('log_id', sql.Int, log_id).query('SELECT * FROM checkin_log WHERE log_id = @log_id');
        return result.recordset[0];
    } catch (error) {
        console.error('error in getCheckInById', error);
        return null;
    }
};

// Xóa check-in theo log_id
const deleteCheckInById = async (log_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().input('log_id', sql.Int, log_id).query('DELETE FROM checkin_log WHERE log_id = @log_id');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('error in deleteCheckInById', error);
        return false;
    }
};

const updateCheckIn = async (userAuth0Id, feel, checkedQuitItems, cigsSmoked, freeText, qna, checkInDate) => {
    try {
        console.log('checkin date up ', checkInDate)
        const pool = await poolPromise;
        const userId = await getUserIdFromAuth0Id(userAuth0Id);

        const result = await pool.request()
            .input('user_id', sql.Int, userId)
            .input('feeling', sql.VarChar(10), feel)
            .input('logged_at', sql.DateTime, new Date(checkInDate))
            .input('cigs_smoked', sql.Int, typeof cigsSmoked === 'number' ? cigsSmoked : null)
            .query(`
                UPDATE checkin_log
                SET feeling     = @feeling,
                    logged_at   = @logged_at,
                    cigs_smoked = @cigs_smoked OUTPUT INSERTED.log_id
                WHERE user_id = @user_id
                  AND CAST (logged_at AS DATE) = CAST (@logged_at AS DATE)
            `);

        const log_id = result.recordset[0]?.log_id;

        if (qna && qna.length > 0) {
            for (const [key, value] of Object.entries(qna)) {
                await pool.request()
                    .input('log_id', sql.Int, log_id)
                    .input('qna_question', sql.VarChar(30), key)
                    .input('qna_answer', sql.NVarChar(sql.MAX), value ?? null)
                    .query(`
        IF EXISTS (
          SELECT 1 FROM qna WHERE log_id = @log_id AND qna_question = @qna_question
        )
        UPDATE qna
        SET qna_answer = @qna_answer
        WHERE log_id = @log_id AND qna_question = @qna_question
        ELSE
        INSERT INTO qna (log_id, qna_question, qna_answer)
        VALUES (@log_id, @qna_question, @qna_answer)
      `);
            }
        } else {
            await pool.request()
                .input('log_id', sql.Int, log_id)
                .query(`DELETE
                        FROM qna
                        WHERE log_id = @log_id`);
        }

        if (checkedQuitItems && checkedQuitItems.length > 0) {
            for (const quitItem of checkedQuitItems ?? []) {
                await pool.request()
                    .input('item_value', sql.VarChar(30), quitItem)
                    .input('log_id', sql.Int, log_id)
                    .query('UPDATE quitting_items SET item_value = @item_value WHERE log_id = @log_id');
            }
        } else {
            await pool.request()
                .input('log_id', sql.Int, log_id)
                .query('DELETE FROM quitting_items WHERE log_id = @log_id');
        }

        if (freeText && freeText !== '') {
            await pool.request()
                .input('log_id', sql.Int, log_id)
                .input('free_text_content', sql.NVarChar(sql.MAX), freeText ?? null)
                .query('UPDATE free_text SET free_text_content = @free_text_content WHERE log_id = @log_id');
        } else {
            await pool.request()
                .input('log_id', sql.Int, log_id)
                .query('DELETE FROM free_text WHERE log_id = @log_id');
        }

        return true;
    } catch (error) {
        console.error('error in updateCheckin', error);
        return false;
    }
}


module.exports = {
    postCheckIn,
    getCheckInLogDataset,
    getCheckInDataService,
    fillMissingCheckInData,
    getAllCheckIns,
    getCheckInById,
    deleteCheckInById,
    alreadyCheckedIn,
    updateCheckIn
};