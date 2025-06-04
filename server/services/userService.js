const {poolPromise, sql} = require("../configs/sqlConfig");

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

const createUser = async (auth0_id, username, email) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('auth0_id', sql.NVarChar, auth0_id)
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .query('INSERT INTO users (auth0_id, username, email) VALUES (@auth0_id, @username, @email)');
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

const getUserIdFromAuth0Id = async (auth0_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('auth0_id', auth0_id)
            .query('SELECT user_id from users WHERE auth0_id = @auth0_id');
        console.log('id from auth0 id', result.recordset[0].user_id);
        return result.recordset[0].user_id;
    } catch (error) {
        console.error('error in getUserIdFromAuth0Id', error);
        return null;
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
                               goalList) => {
    try {
        const pool = await poolPromise;
        const userId = await getUserIdFromAuth0Id(userAuth0Id);

        // 1. Insert into user_profiles
        const result = await pool.request()
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
            .query(`
                INSERT INTO user_profiles (
                    user_id, readiness, start_date, quit_date, expected_quit_date,
                    cigs_per_day, cigs_per_pack, price_per_pack, time_after_waking,
                    quit_method, cigs_reduced, custom_time_of_day, custom_trigger
                )
                    OUTPUT INSERTED.profile_id
                VALUES (
                    @userId, @readiness, @startDate, @quitDate, @expectedQuitDate,
                    @cigsPerDay, @cigsPerPack, @pricePerPack, @timeAfterWaking,
                    @quittingMethod, @cigsReduced, @customTimeOfDay, @customTrigger
                    );
            `);
        console.log('hey')

        const profile_id = result.recordset[0].profile_id;

        console.log(profile_id);

        // 2. Insert quit reasons
        for (const reasonText of reasonList ?? []) {
            const reasonResult = await pool.request()
                .input('reason', sql.NVarChar(250), reasonText)
                .query(`
          INSERT INTO quit_reasons (reason)
          OUTPUT INSERTED.reason_id
          VALUES (@reason)
        `);
            const reason_id = reasonResult.recordset[0].reason_id;

            await pool.request()
                .input('profile_id', sql.Int, profile_id)
                .input('reason_id', sql.Int, reason_id)
                .query(`INSERT INTO profiles_reasons (profile_id, reason_id) VALUES (@profile_id, @reason_id)`);
        }

        // 3. Insert smoke triggers
        for (const triggerText of triggers ?? []) {
            const triggerResult = await pool.request()
                .input('trig_content', sql.VarChar(50), triggerText)
                .query(`
          INSERT INTO smoke_triggers (trig_content)
          OUTPUT INSERTED.trigger_id
          VALUES (@trig_content)
        `);
            const trigger_id = triggerResult.recordset[0].trigger_id;

            await pool.request()
                .input('profile_id', sql.Int, profile_id)
                .input('trigger_id', sql.Int, trigger_id)
                .query('INSERT INTO triggers_profiles (trigger_id, profile_id) VALUES (@trigger_id, @profile_id)');
        }

        // 4. Insert time of day
        for (const timeText of timeOfDayList ?? []) {
            const timeResult = await pool.request()
                .input('content', sql.VarChar(30), timeText)
                .query(`
          INSERT INTO time_of_day (content)
          OUTPUT INSERTED.time_id
          VALUES (@content)
        `);
            const time_id = timeResult.recordset[0].time_id;

            await pool.request()
                .input('profile_id', sql.Int, profile_id)
                .input('time_id', sql.Int, time_id)
                .query('INSERT INTO time_profile (profile_id, time_id) VALUES (@profile_id, @time_id)');
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

module.exports = {userExists, createUser, getAllUsers, postUserProfile, userProfileExists};
