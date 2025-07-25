const mssql = require('mssql');
const { poolPromise } = require('../configs/sqlConfig');
const {getUserIdFromAuth0Id} = require("./userService");
const {getCurrentUTCDateTime} = require("../utils/dateUtils");

const getAllNotificationsService = async (userAuth0Id, page, limit, type) => {
    try {
        const pool = await poolPromise;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const user_id = await getUserIdFromAuth0Id(userAuth0Id);

        const baseQuery = `
            SELECT * FROM [notifications]
            WHERE user_id = @user_id
            ${type && type !== 'all' ? 'AND type = @type' : ''}
            ORDER BY created_at DESC
            OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;
        `;

        const totalCountQuery = `
            SELECT COUNT(*) as total FROM [notifications]
            WHERE user_id = @user_id
            ${type && type !== 'all' ? 'AND type = @type' : ''};
        `;

        const request = pool.request().input('user_id', mssql.Int, user_id);
        if (type && type !== 'all') {
            request.input('type', mssql.NVarChar(50), type);
        }

        const result = await request.query(baseQuery);
        const totalResult = await request.query(totalCountQuery);

        return {
            data: result.recordset,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalResult.recordset[0].total
            }
        };
    } catch (error) {
        console.error('Error in getAllNotificationsService:', error);
        return null;
    }
};


const createNotificationService = async (userAuth0Id, noti_title, content, type, metadata = {}) => {
    try {
        const pool = await poolPromise;
        const user_id = await getUserIdFromAuth0Id(userAuth0Id);

        const result = await pool.request()
            .input('user_id', mssql.Int, user_id)
            .input('noti_title', mssql.NVarChar(100), noti_title)
            .input('content', mssql.NVarChar(200), content)
            .input('created_at', mssql.DateTime, getCurrentUTCDateTime())
            .input('type', mssql.NVarChar(50), type)
            .input('metadata', mssql.NVarChar(mssql.MAX), JSON.stringify(metadata))
            .query(`
                INSERT INTO [notifications] (user_id, noti_title, content, created_at, is_read, type, metadata)
                    OUTPUT INSERTED.*
                VALUES (@user_id, @noti_title, @content, @created_at, 0, @type, @metadata)
            `);

        return result.recordset[0];
    } catch (error) {
        console.error('Error in createNotificationService:', error);
        return false;
    }
};



const deleteAllNotificationsService = async (userAuth0Id) => {
    try {
        const pool = await poolPromise;
        const user_id = await getUserIdFromAuth0Id(userAuth0Id);

        const result = await pool.request()
            .input('user_id', mssql.Int, user_id)
            .query(`DELETE FROM [notifications] WHERE user_id = @user_id`);

        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in deleteAllNotificationsService:', error);
        return false;
    }
};

const markAsReadByIdService = async (noti_id) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('noti_id', mssql.Int, noti_id)
            .query(`
        UPDATE [notifications]
        SET is_read = 1
        WHERE noti_id = @noti_id AND is_read = 0
      `);

        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in markAsReadByIdService:', error);
        return false;
    }
};

const markAllAsReadService = async (userAuth0Id, type = null) => {
    try {
        const pool = await poolPromise;
        const user_id = await getUserIdFromAuth0Id(userAuth0Id);

        let query = `
      UPDATE [notifications]
      SET is_read = 1
      WHERE user_id = @user_id AND is_read = 0
    `;

        if (type) {
            query += ` AND [type] = @type`;
        }

        const request = pool.request()
            .input('user_id', mssql.Int, user_id);

        if (type) request.input('type', mssql.VarChar(50), type);

        const result = await request.query(query);

        return { updated: result.rowsAffected[0] };
    } catch (error) {
        console.error('Error in markAllAsReadService:', error);
        return false;
    }
};

const getUnreadCountService = async (userAuth0Id, type = null) => {
    try {
        const pool = await poolPromise;
        const user_id = await getUserIdFromAuth0Id(userAuth0Id);

        let query = `
      SELECT COUNT(*) as count
      FROM [notifications]
      WHERE user_id = @user_id AND is_read = 0
    `;

        if (type) {
            query += ` AND [type] = @type`;
        }

        const request = pool.request()
            .input('user_id', mssql.Int, user_id);

        if (type) request.input('type', mssql.VarChar(50), type);

        const result = await request.query(query);
        return result.recordset[0].count;
    } catch (error) {
        console.error('Error in getUnreadCountService:', error);
        return 0;
    }
};

module.exports = {
    getAllNotificationsService,
    createNotificationService,
    deleteAllNotificationsService,
    markAsReadByIdService,
    markAllAsReadService,
    getUnreadCountService
};
