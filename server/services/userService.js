const {poolPromise, sql} = require("../configs/sqlConfig");
const {convertUTCStringToLocalDate, getCurrentUTCDateTime} = require("../utils/dateUtils");

const allMember = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT *
                FROM users u
                WHERE u.role = 'Member'
                  AND u.user_id NOT IN (SELECT DISTINCT user_id
                                        FROM user_conversation)
            `);
        return result.recordset;
    } catch (error) {
        console.error('error in allMember', error);
        return [];
    }
};

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
            .query('SELECT u.user_id, u.auth0_id, u.avatar, u.username, u.email, u.role, u.created_at, u.updated_at, s.sub_id, u.isBanned, u.is_social, u.time_to_send_push, u.fcm_token, s.sub_name, s.duration, s.price FROM users u, subscriptions s WHERE u.user_id=@user_id AND u.sub_id = s.sub_id');
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
        return result.rowsAffected[0] > 0;
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
    console.log('getCoachDetailsById: ', coachId, userId)
    try {
        if (coachId && coachId.length > 5) {
            coachId = await getUserIdFromAuth0Id(coachId);
        }
        if (userId && userId.length > 5) {
            userId = await getUserIdFromAuth0Id(userId);
        }
        console.log('coachId', coachId);
        console.log('userId', userId);
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
                       u.auth0_id,
                       u.avatar,
                       u.username,
                       u.email,
                       u.role,
                       ci.years_of_exp,
                       ci.bio,
                       ci.detailed_bio,
                       ci.motto,
                       ci.commission_rate,
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
            .query(`INSERT INTO coach_user (coach_id, user_id, started_date)
                    VALUES (@coach_id, @user_id, @started_date)`)
        const price = await pool.request()
            .input('userId', userId)
            .query(`SELECT price
                    FROM users u,
                         subscriptions s
                    WHERE u.sub_id = s.sub_id
                      AND u.user_id = @userId`);

        return price.recordset[0].price;
    } catch (error) {
        console.error('error in assignUserToCoachService', error);
        return false;
    }
}

const getUserNotes = async (userAuth0Id) => {
    const userId = await getUserIdFromAuth0Id(userAuth0Id);
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', userId)
            .query(`
                SELECT n.note_id,
                       n.content,
                       n.created_at,
                       n.updated_at,
                       subject.username AS subject_username,
                       creator.username AS created_by_username,
                       updater.username AS updated_by_username
                FROM user_notes n
                         JOIN users subject ON n.user_id = subject.user_id
                         JOIN users creator ON n.created_by = creator.user_id
                         LEFT JOIN users updater ON n.updated_by = updater.user_id
                WHERE n.user_id = @userId
                ORDER BY n.created_at DESC
            `);
        return result.recordset;
    } catch (error) {
        console.error('error in getUserNotes', error);
        return [];
    }
};

const noteUpdateService = async (noteId, editorAuth0Id, content) => {
    const editorUserId = await getUserIdFromAuth0Id(editorAuth0Id);

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('editorUserId', editorUserId)
            .input('content', content)
            .input('updatedAt', getCurrentUTCDateTime().toISOString())
            .input('note_id', noteId)
            .query(`UPDATE user_notes
                    SET content    = @content,
                        updated_at = @updatedAt,
                        updated_by = @editorUserId
                    WHERE note_id = @note_id`)
        return result.rowsAffected > 0
    } catch (error) {
        console.error('error in noteUpdateService', error);
        return []
    }
}

const noteCreateService = async (noteOfAuth0Id, creatorAuth0Id, content) => {
    const noteOfUserId = await getUserIdFromAuth0Id(noteOfAuth0Id);
    const creatorUserId = await getUserIdFromAuth0Id(creatorAuth0Id);
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('noteOfUserId', noteOfUserId)
            .input('creatorUserId', creatorUserId)
            .input('createdAt', getCurrentUTCDateTime().toISOString())
            .input('updatedAt', getCurrentUTCDateTime().toISOString())
            .input('content', content)
            .query('INSERT INTO user_notes (content, user_id, created_by, created_at, updated_by, updated_at) VALUES (@content, @noteOfUserId, @creatorUserId, @createdAt, @creatorUserId, @updatedAt)')
        return result.rowsAffected > 0
    } catch (error) {
        console.error('error in noteCreateService', error);
        return false
    }
}

const noteDeleteService = async (noteId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('noteId', noteId)
            .query('DELETE FROM user_notes WHERE note_id = @noteId');

        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Error in noteDeleteService', error);
        return false;
    }
};

const getAllReviews = async (userAuth0Id, coachAuth0Id) => {
    const userId = await getUserIdFromAuth0Id(userAuth0Id);
    const coachId = await getUserIdFromAuth0Id(coachAuth0Id);

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', userId)
            .input('coachId', coachId)
            .query(`
                SELECT r.review_id,
                       r.review_content,
                       r.stars,
                       r.created_date,
                       reviewer.username AS reviewer_username,
                       coach.username    AS coach_username
                FROM coach_reviews r
                         JOIN users reviewer ON r.user_id = reviewer.user_id
                         JOIN users coach ON r.coach_id = coach.user_id
                WHERE r.user_id = @userId
                  AND r.coach_id = @coachId
                ORDER BY r.created_date DESC
            `);

        return result.recordset;
    } catch (error) {
        console.error('error in getAllReviews', error);
        return [];
    }
};

const createReviewService = async (userAuth0Id, coachAuth0Id, stars, reviewContent) => {
    const userId = await getUserIdFromAuth0Id(userAuth0Id);
    const coachId = await getUserIdFromAuth0Id(coachAuth0Id);

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', userId)
            .input('coachId', coachId)
            .input('stars', stars)
            .input('reviewContent', reviewContent)
            .input('createdDate', getCurrentUTCDateTime().toISOString())
            .input('updatedDate', getCurrentUTCDateTime().toISOString())
            .query(`
                INSERT INTO coach_reviews (review_content, stars, user_id, coach_id, created_date, updated_date)
                VALUES (@reviewContent, @stars, @userId, @coachId, @createdDate, @updatedDate)
            `);

        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('error in createReviewService', error);
        return false;
    }
};

const updateReviewService = async (reviewId, reviewContent, stars) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('reviewId', reviewId)
            .input('reviewContent', reviewContent)
            .input('stars', stars)
            .input('updatedDate', getCurrentUTCDateTime().toISOString())
            .query(`
                UPDATE coach_reviews
                SET review_content = @reviewContent,
                    stars          = @stars,
                    updated_date   = @updatedDate
                WHERE review_id = @reviewId
            `);

        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('error in updateReviewService', error);
        return false;
    }
};

const deleteReviewService = async (reviewId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('reviewId', reviewId)
            .query(`
                DELETE
                FROM coach_reviews
                WHERE review_id = @reviewId
            `);

        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('error in deleteReviewService', error);
        return false;
    }
};

const updateUserFCMToken = async (userAuth0Id, token, force = false) => {
    const userId = await getUserIdFromAuth0Id(userAuth0Id);

    try {
        const pool = await poolPromise;

        // Step 1: Check if token is already used
        const existingTokenUser = await pool.request()
            .input('token', token)
            .query('SELECT user_id FROM users WHERE fcm_token = @token');

        if (existingTokenUser.recordset.length > 0) {
            const existingUserId = existingTokenUser.recordset[0].user_id;

            if (existingUserId === userId) {
                // Token already belongs to this user — nothing to do
                return true;
            }

            if (!force) {
                // Token belongs to another user and we're not forcing
                return false;
            }
        }

        // Step 2: Update token for this user
        const update = await pool.request()
            .input('token', token)
            .input('userId', userId)
            .query('UPDATE users SET fcm_token = @token WHERE user_id = @userId');

        return update.rowsAffected[0] > 0;

    } catch (error) {
        console.error('error in updateUserFCMToken', error);
        return false;
    }
};

const getUserFcmTokenFromAuth0Id = async (userAuth0Id) => {
    const userId = await getUserIdFromAuth0Id(userAuth0Id);

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', userId)
            .query('SELECT token FROM users WHERE user_id = @userId');
        return result.recordset[0].fcm_token;
    } catch (error) {
        console.error('error in updateUserFCMToken', error);
        return null;
    }
}

const updateUserTimesForPush = async (userAuth0Id, times) => {
    const userId = await getUserIdFromAuth0Id(userAuth0Id);
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', userId)
            .input('times', times)
            .query('UPDATE users SET time_to_send_push = @times WHERE user_id = @userId');
        return result.rowsAffected > 0;
    } catch (error) {
        console.error('error in updateUserTimesForPush', error);
        return false;
    }
}

const getUserReasonsCSVByAuth0Id = async (auth0Id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('auth0Id', auth0Id)
        .query(`
            SELECT STRING_AGG(pr.reason_value, ',') AS reasons
            FROM users u
            JOIN user_profiles up ON u.user_id = up.user_id
            JOIN profiles_reasons pr ON up.profile_id = pr.profile_id
            WHERE u.auth0_id = @auth0Id
            GROUP BY u.user_id
        `);
    return result.recordset[0]?.reasons || '';
};


// Lấy user theo user_id
const getUserById = async (user_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query('SELECT * FROM users WHERE user_id = @user_id');
        return result.recordset[0];
    } catch (error) {
        console.error('error in getUserById', error);
        return null;
    }
};

// Cập nhật user theo user_id
const updateUserById = async (user_id, data) => {
    try {
        const pool = await poolPromise;
        const fields = [];
        if (data.username !== undefined) fields.push('username = @username');
        if (data.email !== undefined) fields.push('email = @email');
        if (data.avatar !== undefined) fields.push('avatar = @avatar');
        if (data.role !== undefined) fields.push('role = @role');
        if (data.isBanned !== undefined) fields.push('isBanned = @isBanned');
        if (fields.length === 0) return false;
        const query = `UPDATE users SET ${fields.join(', ')} WHERE user_id = @user_id`;
        const request = pool.request().input('user_id', sql.Int, user_id);
        if (data.username !== undefined) request.input('username', sql.NVarChar, data.username);
        if (data.email !== undefined) request.input('email', sql.NVarChar, data.email);
        if (data.avatar !== undefined) request.input('avatar', sql.NVarChar(sql.MAX), data.avatar);
        if (data.role !== undefined) request.input('role', sql.NVarChar, data.role);
        if (data.isBanned !== undefined) request.input('isBanned', sql.Bit, data.isBanned);
        const result = await request.query(query);
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('error in updateUserById', error);
        return false;
    }
};

// Xóa user theo user_id
const deleteUserById = async (user_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query('DELETE FROM users WHERE user_id = @user_id');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('error in deleteUserById', error);
        return false;
    }
};

// Khóa/mở khóa user theo user_id
const toggleBanUserById = async (user_id, isBanned) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('isBanned', sql.Bit, isBanned)
            .query('UPDATE users SET isBanned = @isBanned WHERE user_id = @user_id');
        return result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('error in toggleBanUserById', error);
        return false;
    }
};

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
    assignUserToCoachService,
    allMember,
    getUserNotes,
    noteUpdateService,
    noteCreateService,
    noteDeleteService,
    createReviewService,
    updateReviewService,
    deleteReviewService,
    getAllReviews,
    updateUserFCMToken,
    getUserFcmTokenFromAuth0Id,
    updateUserTimesForPush,
    getUserReasonsCSVByAuth0Id,
    getUserById,
    updateUserById,
    deleteUserById,
    toggleBanUserById
};
