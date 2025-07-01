const {poolPromise, sql} = require("../configs/sqlConfig");
const {convertUTCStringToLocalDate, getCurrentUTCDateTime} = require("../utils/dateUtils");

const userExists = async (auth0_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('auth0_id', auth0_id)
            .query('SELECT * FROM users WHERE auth0_id = @auth0_id');
        return result.recordset.length > 0;
    } catch (error) {
        console.error('error in userExists', error);
        return false;
    }
};

const createUser = async (auth0_id, username, email, created_at, picture, isSocial) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('auth0_id', sql.NVarChar, auth0_id)
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('created_at', sql.DateTime, convertUTCStringToLocalDate(created_at).toISOString())
            .input('avatar', sql.NVarChar(sql.MAX), picture)
            .input('is_social', sql.Bit, isSocial)
            .query('INSERT INTO users (auth0_id, username, email, created_at, avatar, is_social) VALUES (@auth0_id, @username, @email, @created_at, @avatar, @is_social)');
        return true;
    } catch (error) {
        console.error('error in createUser', error);
        return false;
    }
};

const getAllUsers = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM users');
        return result.recordset;
    } catch (error) {
        console.error('error in getAllUsers', error);
        return [];
    }
}

const getUser = async (auth0_id) => {
    try {
        const user_id = await getUserIdFromAuth0Id(auth0_id)
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_id', user_id)
            .query('SELECT * FROM users WHERE user_id=@user_id');
        return result.recordset;
    } catch (error) {
        console.error('error in getUser', error);
        return [];
    }
}

const getUserWithSubscription = async (auth0_id) => {
    try {
        const user_id = await getUserIdFromAuth0Id(auth0_id)
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_id', user_id)
            .query('SELECT u.user_id, u.auth0_id, u.avatar, u.username, u.email, u.role, u.created_at, u.updated_at, s.sub_id, u.isBanned, u.is_social, s.sub_name, s.duration, s.price FROM users u, subscriptions s WHERE u.user_id=@user_id AND u.sub_id = s.sub_id');
        return result.recordset[0];
    } catch (error) {
        console.error('error in getUser', error);
        return null;
    }
}

const getUserIdFromAuth0Id = async (auth0_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('auth0_id', auth0_id)
            .query('SELECT user_id from users WHERE auth0_id = @auth0_id');
        return result.recordset[0].user_id;
    } catch (error) {
        console.error('error in getUserIdFromAuth0Id', error);
        return null;
    }
}

const getUserCreationDateFromAuth0Id = async (auth0_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('auth0_id', auth0_id)
            .query('SELECT created_at from users WHERE auth0_id = @auth0_id');
        return result.recordset[0].created_at;
    } catch (error) {
        console.error('error in getUserIdFromAuth0Id', error);
        return null;
    }
}

const updateUserSubscriptionService = async (user_id, subscription_id, vip_end_date) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('sub_id', sql.Int, subscription_id)
            .input('user_id', sql.Int, user_id)
            .input('vip_end_date', sql.DateTime, vip_end_date)
            .query('UPDATE users SET sub_id = @sub_id, vip_end_date = @vip_end_date WHERE user_id = @user_id');
        return result.rowsAffected > 0
    } catch (error) {
        console.error('error in updateSubscriptionService', error);
        return false;
    }
}

const getCoaches = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT u.user_id,
                       u.auth0_id,
                       u.avatar,
                       u.username,
                       u.email,
                       u.role,
                       u.created_at,
                       u.updated_at,
                       u.sub_id,
                       u.vip_end_date,
                       u.isBanned,
                       u.is_social,
                       ci.coach_id,
                       ci.years_of_exp,
                       ci.bio,
                       COUNT(DISTINCT cu.user_id) AS total_users,
                       AVG(cr.stars * 1.0)        AS avg_star,
                       COUNT(DISTINCT cr.user_id) AS num_reviewers
                FROM users u
                         LEFT JOIN coach_info ci ON u.user_id = ci.coach_id
                         LEFT JOIN coach_user cu ON ci.coach_id = cu.coach_id
                         LEFT JOIN coach_reviews cr ON u.user_id = cr.coach_id
                WHERE u.role = 'Coach'
                GROUP BY u.user_id, u.auth0_id, u.avatar, u.username, u.email, u.role,
                         u.created_at, u.updated_at, u.sub_id, u.vip_end_date, u.isBanned, u.is_social,
                         ci.coach_id, ci.years_of_exp, ci.bio
            `);
        return result.recordset;
    } catch (error) {
        console.error('Error in getCoaches:', error);
        return [];
    }
}

const getCoachDetailsById = async (coachId = null, userId = null) => {
    try {
        const pool = await poolPromise;

        let startedDate = null;

        // Resolve coachId from userId
        if (!coachId && userId !== null) {
            const result = await pool.request()
                .input('user_id', sql.Int, userId)
                .query(`
                    SELECT TOP 1 coach_id, started_date
                    FROM coach_user
                    WHERE user_id = @user_id
                `);

            if (result.recordset.length === 0) {
                return null; // Unassigned student
            }

            coachId = result.recordset[0].coach_id;
            startedDate = result.recordset[0].started_date;
        }

        // Fetch coach's main profile
        const coachResult = await pool.request()
            .input('coach_id', sql.Int, coachId)
            .query(`
        SELECT u.user_id,
               u.avatar,
               u.username,
               u.email,
               u.role,
               ci.years_of_exp,
               ci.bio,
               ci.detailed_bio,
               ci.motto,
               (SELECT COUNT(*)
                FROM coach_user cu2
                WHERE cu2.coach_id = u.user_id) AS total_students,
               (SELECT AVG(CAST(stars AS FLOAT))
                FROM coach_reviews cr
                WHERE cr.coach_id = u.user_id)  AS avg_star,
               (SELECT COUNT(DISTINCT cr.user_id)
                FROM coach_reviews cr
                WHERE cr.coach_id = u.user_id)  AS num_reviews
        FROM users u
        LEFT JOIN coach_info ci ON ci.coach_id = u.user_id
        WHERE u.role = 'Coach'
          AND u.user_id = @coach_id
      `);

        if (coachResult.recordset.length === 0) {
            return null; // Coach not found
        }

        const coach = coachResult.recordset[0];

        // If userId was provided, override started_date manually
        if (startedDate) {
            coach.started_date = startedDate;
        }

        // Fetch specialties
        const specialtiesResult = await pool.request()
            .input('coach_id', coachId)
            .query(`
                SELECT content
                FROM coach_specialties_achievements
                WHERE coach_id = @coach_id
                  AND is_specialties = 1
            `);

        // Fetch achievements
        const achievementsResult = await pool.request()
            .input('coach_id', coachId)
            .query(`
                SELECT content
                FROM coach_specialties_achievements
                WHERE coach_id = @coach_id
                  AND is_specialties = 0
            `);

        // Fetch latest 3 reviews
        const reviewsResult = await pool.request()
            .input('coach_id', coachId)
            .query(`
                SELECT cr.review_content,
                       cr.stars,
                       cr.created_date,
                       u.username AS reviewer_name
                FROM coach_reviews cr
                         JOIN users u ON cr.user_id = u.user_id
                WHERE cr.coach_id = @coach_id
                ORDER BY cr.created_date DESC
                OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY
            `);

        return {
            coach,
            specialties: specialtiesResult.recordset.map(r => r.content),
            achievements: achievementsResult.recordset.map(r => r.content),
            reviews: reviewsResult.recordset
        };

    } catch (error) {
        console.error('Error in getCoachDetailsById:', error);
        return null;
    }
};



async function getUserByAuth0Id(auth0Id) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('auth0_id', auth0Id)
            .query('SELECT * FROM users WHERE auth0_id = @auth0_id');

        return result.recordset[0];
    } catch (err) {
        console.error('getUserByAuth0Id error:', err);
        return null;
    }
}

async function updateUserByAuth0Id(auth0Id, {username, email, avatar}) {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('auth0_id', auth0Id)
            .input('username', username)
            .input('email', email)
            .input('avatar', avatar)
            .query(`
                UPDATE users
                SET username = @username,
                    email    = @email,
                    avatar   = @avatar
                WHERE auth0_id = @auth0_id
            `);

        return getUserByAuth0Id(auth0Id);
    } catch (err) {
        console.error('updateUserByAuth0Id error:', err);
        return null;
    }
}

const updateUserService = async (auth0_id, username = null, email = null, avatar = null) => {
    if (!username && !email && !avatar) {
        return false;
    }
    try {
        const updates = [];
        const inputs = {};

        if (username) {
            updates.push('username = @username');
            inputs.username = username;
        }
        if (email) {
            updates.push('email = @email');
            inputs.email = email;
        }
        if (avatar) {
            updates.push('avatar = @avatar');
            inputs.avatar = avatar;
        }

        const userId = await getUserIdFromAuth0Id(auth0_id);
        if (!userId) return false;

        const queryStr = `UPDATE users
                          SET ${updates.join(', ')}
                              OUTPUT INSERTED.is_social
                          WHERE user_id = @user_id`;

        const pool = await poolPromise;
        const request = pool.request().input('user_id', userId);

        for (const [key, value] of Object.entries(inputs)) {
            request.input(key, value);
        }

        const result = await request.query(queryStr);
        return result.recordset[0];
    } catch (error) {
        console.error('error in updateUserService', error);
        return null;
    }
}

const assignUserToCoachService = async (coachId, userId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('coach_id', coachId)
            .input('user_id', userId)
            .input('started_date', getCurrentUTCDateTime().toISOString())
            .query(`INSERT INTO coach_user (coach_id, user_id, started_date) VALUES (@coach_id, @user_id, @started_date)`)
        console.log(result)
        return result.rowsAffected > 0;
    }catch (error) {
        console.error('error in assignUserToCoachService', error);
        return false;
    }
}

module.exports = {
    userExists,
    createUser,
    getAllUsers,
    getUserIdFromAuth0Id,
    getUserCreationDateFromAuth0Id,
    getUser,
    updateUserService,
    getUserByAuth0Id,
    updateUserByAuth0Id,
    getUserWithSubscription,
    updateUserSubscriptionService,
    getCoaches,
    getCoachDetailsById,
    assignUserToCoachService
};
