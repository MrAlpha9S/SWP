const {poolPromise, sql} = require("../configs/sqlConfig");
const {getUserIdFromAuth0Id} = require("./userService")
const {getCurrentUTCDateTime} = require("../utils/dateUtils");

const userProfileExists = async (auth0_id) => {
    try {
        const pool = await poolPromise;
        const userId = await getUserIdFromAuth0Id(auth0_id);

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT profile_id FROM user_profiles WHERE user_id = @userId');
        if (result.recordset.length > 0) {
            return result.recordset[0].profile_id;
        } else {
            return false
        }
    } catch (error) {
        console.error('error in userProfileExists', error);
        return false;
    }
}

const postUserProfile = async (userAuth0Id, updaterUserAuth0Id,
                               readiness,
                               reasonList,
                               pricePerPack,
                               cigsPerPack,
                               timeAfterWaking,
                               timeOfDayList,
                               customTimeOfDay,
                               triggers,
                               customTrigger,
                               startDate,
                               quittingMethod,
                               cigsReduced,
                               expectedQuitDate,
                               stoppedDate,
                               cigsPerDay,
                               planLog,
                               goalList, actionType, profile_id = 0) => {
    try {
        const pool = await poolPromise;
        const userId = await getUserIdFromAuth0Id(userAuth0Id);
        const updaterUserId = await getUserIdFromAuth0Id(updaterUserAuth0Id);

        if (actionType !== 'update') {

            const result = await pool.request()
                .input('userId', sql.Int, userId)
                .input('readiness', sql.VarChar(20), readiness)
                .input('startDate', sql.DateTime, startDate && startDate.length >0 ? startDate : null)
                .input('quitDate', sql.DateTime, stoppedDate && stoppedDate.length > 0 ? stoppedDate : null)
                .input('expectedQuitDate', sql.DateTime, expectedQuitDate && expectedQuitDate.length > 0 ? expectedQuitDate : null)
                .input('cigsPerDay', sql.Int, cigsPerDay)
                .input('cigsPerPack', sql.Int, cigsPerPack)
                .input('pricePerPack', sql.Decimal(10, 2), pricePerPack)
                .input('timeAfterWaking', sql.VarChar(30), timeAfterWaking)
                .input('quittingMethod', sql.VarChar(20), quittingMethod ?? null)
                .input('cigsReduced', sql.Int, cigsReduced ?? null)
                .input('customTimeOfDay', sql.NVarChar(100), customTimeOfDay ?? null)
                .input('customTrigger', sql.NVarChar(100), customTrigger ?? null)
                .input('created_at', sql.DateTime, getCurrentUTCDateTime().toISOString())
                .input('lastUpdatedBy', sql.Int, updaterUserId)
                .query(`
                    INSERT INTO user_profiles (user_id, readiness_value, start_date, quit_date, expected_quit_date,
                                               cigs_per_day, cigs_per_pack, price_per_pack, time_after_waking,
                                               quitting_method, cigs_reduced, custom_time_of_day, custom_trigger,
                                               created_at, last_updated_by)
                        OUTPUT INSERTED.profile_id
                    VALUES (
                        @userId, @readiness, @startDate, @quitDate, @expectedQuitDate, @cigsPerDay, @cigsPerPack, @pricePerPack, @timeAfterWaking, @quittingMethod, @cigsReduced, @customTimeOfDay, @customTrigger, @created_at, @lastUpdatedBy
                        );
                `);

            profile_id = result.recordset[0].profile_id;
        }


        // 2. Insert quit reasons
        for (const reasonText of reasonList ?? []) {
            await pool.request()
                .input('profile_id', sql.Int, profile_id)
                .input('reason_value', sql.VarChar(30), reasonText)
                .query(`INSERT INTO profiles_reasons (profile_id, reason_value)
                        VALUES (@profile_id, @reason_value)`);
        }

        // 3. Insert smoke triggers
        for (const triggerText of triggers ?? []) {
            await pool.request()
                .input('profile_id', sql.Int, profile_id)
                .input('trigger_value', sql.VarChar(30), triggerText)
                .query('INSERT INTO triggers_profiles (profile_id, trigger_value) VALUES (@profile_id, @trigger_value)');
        }

        // 4. Insert time of day
        for (const timeText of timeOfDayList ?? []) {
            await pool.request()
                .input('profile_id', sql.Int, profile_id)
                .input('time_value', sql.VarChar(30), timeText)
                .query('INSERT INTO time_profile (profile_id, time_value) VALUES (@profile_id, @time_value)');
        }

        // 5. Insert plan log
        for (const entry of planLog ?? []) {
            await pool.request()
                .input('profile_id', sql.Int, profile_id)
                .input('date', sql.DateTime, entry.date)
                .input('num_of_cigs', sql.Int, entry.cigs)
                .query('INSERT INTO plan_log (profile_id, date, num_of_cigs) VALUES (@profile_id, @date, @num_of_cigs)');
        }

        // 6. Insert goals
        for (const goal of goalList ?? []) {
            await pool.request()
                .input('profile_id', sql.Int, profile_id)
                .input('goal_name', sql.NVarChar(50), goal.goalName)
                .input('goal_amount', sql.Float, goal.goalAmount)
                .input('created_at', sql.DateTime, getCurrentUTCDateTime().toISOString())
                .query('INSERT INTO goals (goal_name, goal_amount, profile_id, created_at) VALUES (@goal_name, @goal_amount, @profile_id, @created_at)');
        }

        return true;

    } catch (err) {
        console.error('Error inserting onboarding data:', err);
        return false;
    }
};

const getUserProfile = async (userAuth0Id) => {
    try {
        const pool = await poolPromise;
        const userId = await getUserIdFromAuth0Id(userAuth0Id);

        // 1. Get user profile
        const profileResult = await pool.request()
            .input("userId", userId)
            .query(`
                SELECT *
                FROM user_profiles
                WHERE user_id = @userId
            `);

        if (profileResult.rowsAffected[0] !== 1) return null;
        const profile = profileResult.recordset[0];
        const profileId = profile.profile_id;

        // 2. Get quit reasons
        const reasonsResult = await pool.request()
            .input("profileId", profileId)
            .query(`
                SELECT pr.reason_value
                FROM profiles_reasons pr
                WHERE pr.profile_id = @profileId
            `);
        const reasonList = reasonsResult.recordset.map(row => row.reason_value);

        // 3. Get smoke triggers
        const triggersResult = await pool.request()
            .input("profileId", profileId)
            .query(`
                SELECT tp.trigger_value
                FROM triggers_profiles tp
                WHERE tp.profile_id = @profileId
            `);
        const triggers = triggersResult.recordset.map(row => row.trigger_value);

        // 4. Get time of day
        const timeResult = await pool.request()
            .input("profileId", profileId)
            .query(`
                SELECT tp.time_value
                FROM time_profile tp
                WHERE tp.profile_id = @profileId
            `);
        const timeOfDayList = timeResult.recordset.map(row => row.time_value);

        // 5. Get plan log
        const planLogResult = await pool.request()
            .input("profileId", profileId)
            .query(`
                SELECT date, num_of_cigs AS cigs
                FROM plan_log
                WHERE profile_id = @profileId
                ORDER BY date ASC
            `);
        const planLog = planLogResult.recordset;

        // 6. Get goals
        const goalsResult = await pool.request()
            .input("profileId", profileId)
            .query(`
                SELECT goal_id        as goalId,
                       goal_name      AS goalName,
                       goal_amount    as goalAmount,
                       created_at     AS createdAt,
                       is_completed   AS isCompleted,
                       completed_date AS completedDate
                FROM goals
                WHERE profile_id = @profileId
            `);
        const goalList = goalsResult.recordset;

        return {
            ...profile,
            reasonList,
            triggers,
            timeOfDayList,
            planLog,
            goalList
        };
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
};

const updateUserProfile = async (
    userAuth0Id,
    updaterUserAuth0Id,
    readiness,
    reasonList,
    pricePerPack,
    cigsPerPack,
    timeAfterWaking,
    timeOfDayList,
    customTimeOfDay,
    triggers,
    customTrigger,
    startDate,
    quittingMethod,
    cigsReduced,
    expectedQuitDate,
    stoppedDate,
    cigsPerDay,
    planLog,
    goalList
) => {
    try {
        console.log('update service')
        console.log("▶ updaterUserAuth0Id:", updaterUserAuth0Id);
        console.log("▶ userAuth0Id:", userAuth0Id);


        const pool = await poolPromise;
        const userId = await getUserIdFromAuth0Id(userAuth0Id);
        const updaterUserId = await getUserIdFromAuth0Id(updaterUserAuth0Id);
        const updatedAt = getCurrentUTCDateTime().toISOString();

        await pool.request()
            .input('userId', sql.Int, userId)
            .input('lastUpdatedBy', sql.Int, updaterUserId)
            .input('readiness', sql.VarChar(20), readiness)
            .input('startDate', sql.DateTime, startDate ?? null)
            .input('quitDate', sql.DateTime, stoppedDate ?? null)
            .input('expectedQuitDate', sql.DateTime, expectedQuitDate ?? null)
            .input('cigsPerDay', sql.Int, cigsPerDay)
            .input('cigsPerPack', sql.Int, cigsPerPack)
            .input('pricePerPack', sql.Decimal(10, 2), pricePerPack)
            .input('timeAfterWaking', sql.VarChar(30), timeAfterWaking)
            .input('quittingMethod', sql.VarChar(20), quittingMethod ?? null)
            .input('cigsReduced', sql.Int, cigsReduced ?? null)
            .input('customTimeOfDay', sql.NVarChar(100), customTimeOfDay ?? null)
            .input('customTrigger', sql.NVarChar(100), customTrigger ?? null)
            .input('updatedAt', sql.DateTime, updatedAt)
            .query(`
                UPDATE user_profiles
                SET readiness_value    = @readiness,
                    start_date         = @startDate,
                    quit_date          = @quitDate,
                    expected_quit_date = @expectedQuitDate,
                    cigs_per_day       = @cigsPerDay,
                    cigs_per_pack      = @cigsPerPack,
                    price_per_pack     = @pricePerPack,
                    time_after_waking  = @timeAfterWaking,
                    quitting_method    = @quittingMethod,
                    cigs_reduced       = @cigsReduced,
                    custom_time_of_day = @customTimeOfDay,
                    custom_trigger     = @customTrigger,
                    updated_at         = @updatedAt,
                    last_updated_by    = @lastUpdatedBy
                WHERE user_id = @userId
            `);

        // Get profile_id
        const result = await pool.request()
            .input('userId', userId)
            .query('SELECT profile_id FROM user_profiles WHERE user_id = @userId');
        const profile_id = result.recordset[0].profile_id;

        // Clear related tables
        const tablesToClear = ['profiles_reasons', 'triggers_profiles', 'time_profile', 'plan_log', 'goals'];
        for (const table of tablesToClear) {
            await pool.request()
                .input('profile_id', profile_id)
                .query(`DELETE
                        FROM ${table}
                        WHERE profile_id = @profile_id`);
        }

        //re-insert new data
        return await postUserProfile(userAuth0Id, updaterUserAuth0Id,
            readiness,
            reasonList,
            pricePerPack,
            cigsPerPack,
            timeAfterWaking,
            timeOfDayList,
            customTimeOfDay,
            triggers,
            customTrigger,
            startDate,
            quittingMethod,
            cigsReduced,
            expectedQuitDate,
            stoppedDate,
            cigsPerDay,
            planLog,
            goalList, 'update', profile_id)

    } catch (error) {
        console.error('Error in updateUserProfile:', error);
        return false;
    }
};

const postGoal = async (userAuth0Id, goalName, goalAmount, goalId = null, isCompleted = false, completedDate = null) => {
    try {
        const pool = await poolPromise;
        const userProfileId = await userProfileExists(userAuth0Id);

        if (!userProfileId) {
            throw new Error("User profile not found");
        }

        let result;

        if (goalId) {
            result = await pool.request()
                .input('goal_id', sql.Int, goalId)
                .input('goal_name', sql.NVarChar(50), goalName)
                .input('goal_amount', sql.Float, goalAmount)
                .input('is_completed', sql.Bit, isCompleted)
                .input('completed_date', sql.DateTime, completedDate)
                .query('UPDATE goals SET goal_name = @goal_name, goal_amount = @goal_amount, is_completed = @is_completed, completed_date = @completed_date WHERE goal_id = @goal_id');
        } else {
            result = await pool.request()
                .input('goal_name', sql.NVarChar(50), goalName)
                .input('goal_amount', sql.Float, goalAmount)
                .input('profile_id', sql.Int, userProfileId)
                .input('created_at', sql.DateTime, getCurrentUTCDateTime().toISOString())
                .query('INSERT INTO goals (goal_name, goal_amount, profile_id, created_at) VALUES (@goal_name, @goal_amount, @profile_id, @created_at)');
        }

        // Throw if the insert/update did not affect any rows
        if (result.rowsAffected[0] === 0) {
            throw new Error("Database write failed");
        }

        return true;
    } catch (error) {
        console.error("postGoal error:", error);
        throw error;
    }
};

const deleteGoal = async (goalId) => {
    try {
        const pool = await poolPromise;

        let result;

        result = await pool.request()
            .input('goal_id', sql.Int, goalId)
            .query('DELETE FROM goals WHERE goal_id = @goal_id');

        if (result.rowsAffected[0] === 0) {
            throw new Error("Database delete failed");
        }

        return true;
    } catch
        (error) {
        console.error("postGoal error:", error);
        throw error;
    }
}

const getLeaderboard = async () => {
    try {
        const pool = await poolPromise;

        const totalCigs = await pool.request()
            .query('SELECT u.user_id, u.username, COALESCE(SUM(cl.cigs_smoked), 0) AS totalCigs FROM users u LEFT JOIN user_profiles p ON u.user_id = p.user_id LEFT JOIN checkin_log cl ON u.user_id = cl.user_id GROUP BY u.user_id, u.username')

        const userCreationDateList = await pool.request()
            .query('SELECT user_id, username, created_at FROM users')

        const daysWithoutSmokeList = await pool.request()
            .query('SELECT u.user_id, u.username, COUNT(cl.log_id) AS days_without_smoke FROM users u LEFT JOIN checkin_log cl ON u.user_id = cl.user_id AND cl.cigs_smoked = 0 GROUP BY u.user_id, u.username')


    } catch (error) {
        console.error("postGoal error:", error);
    }
}



module.exports = {userProfileExists, postUserProfile, getUserProfile, updateUserProfile, postGoal, deleteGoal}