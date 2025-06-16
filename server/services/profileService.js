const {poolPromise, sql} = require("../configs/sqlConfig");
const {getUserIdFromAuth0Id} = require("./userService")
const {getCurrentUTCDateTime} = require("../utils/dateUtils");

const userProfileExists = async (auth0_id) => {
    try {
        const pool = await poolPromise;
        const userId = await getUserIdFromAuth0Id(auth0_id);

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM user_profiles WHERE user_id = @userId');
        return result.recordset.length > 0;
    } catch (error) {
        console.error('error in userProfileExists', error);
        return false;
    }
}

const postUserProfile = async (userAuth0Id,
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

        if (actionType !== 'update') {

            const result = await pool.request()
                .input('userId', sql.Int, userId)
                .input('readiness', sql.VarChar(20), readiness)
                .input('startDate', sql.DateTime, startDate ?? null)
                .input('quitDate', sql.DateTime, stoppedDate ?? null)
                .input('expectedQuitDate', sql.DateTime, expectedQuitDate)
                .input('cigsPerDay', sql.Int, cigsPerDay)
                .input('cigsPerPack', sql.Int, cigsPerPack)
                .input('pricePerPack', sql.Decimal(10, 2), pricePerPack)
                .input('timeAfterWaking', sql.VarChar(30), timeAfterWaking)
                .input('quittingMethod', sql.VarChar(20), quittingMethod ?? null)
                .input('cigsReduced', sql.Int, cigsReduced ?? null)
                .input('customTimeOfDay', sql.NVarChar(100), customTimeOfDay ?? null)
                .input('customTrigger', sql.NVarChar(100), customTrigger ?? null)
                .input('created_at', sql.DateTime, getCurrentUTCDateTime().toISOString())
                .query(`
                INSERT INTO user_profiles (user_id, readiness_value, start_date, quit_date, expected_quit_date,
                                           cigs_per_day, cigs_per_pack, price_per_pack, time_after_waking,
                                           quitting_method, cigs_reduced, custom_time_of_day, custom_trigger, created_at)
                    OUTPUT INSERTED.profile_id
                VALUES (
                    @userId, @readiness, @startDate, @quitDate, @expectedQuitDate, @cigsPerDay, @cigsPerPack, @pricePerPack, @timeAfterWaking, @quittingMethod, @cigsReduced, @customTimeOfDay, @customTrigger, @created_at
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
                .query('INSERT INTO goals (goal_name, goal_amount, profile_id) VALUES (@goal_name, @goal_amount, @profile_id)');
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
        SELECT * FROM user_profiles up
JOIN users u ON u.user_id = up.user_id
WHERE up.user_id = @userId
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
        SELECT goal_name AS goalName, goal_amount AS goalAmount
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
        const pool = await poolPromise;
        const userId = await getUserIdFromAuth0Id(userAuth0Id);
        const updatedAt = new Date();

        await pool.request()
            .input('userId', sql.Int, userId)
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
        SET readiness_value = @readiness,
            start_date = @startDate,
            quit_date = @quitDate,
            expected_quit_date = @expectedQuitDate,
            cigs_per_day = @cigsPerDay,
            cigs_per_pack = @cigsPerPack,
            price_per_pack = @pricePerPack,
            time_after_waking = @timeAfterWaking,
            quitting_method = @quittingMethod,
            cigs_reduced = @cigsReduced,
            custom_time_of_day = @customTimeOfDay,
            custom_trigger = @customTrigger,
            updated_at = @updatedAt
        WHERE user_id = @userId
      `);

        // Get profile_id
        const result = await pool.request()
            .input('userId', userId)
            .query('SELECT profile_id FROM user_profiles WHERE user_id = @userId');
        const profile_id = result.recordset[0].profile_id;

        // Clear related tables
        const tablesToClear = ['profiles_reasons', 'triggers_profiles', 'time_profile', 'plan_log', 'goals' ];
        for (const table of tablesToClear) {
            await pool.request()
                .input('profile_id', profile_id)
                .query(`DELETE FROM ${table} WHERE profile_id = @profile_id`);
        }

        //re-insert new data
        return await postUserProfile(userAuth0Id,
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


module.exports = {userProfileExists, postUserProfile, getUserProfile, updateUserProfile}