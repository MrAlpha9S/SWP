const {poolPromise, sql} = require("../configs/sqlConfig");


const getSubscriptions = async () => {
    try {
        const pool = await poolPromise;

        const getSubsResult = await pool
            .request()
            .query(`
                SELECT * FROM subscriptions
            `);

        const getFeaturesResult = await pool
            .request()
            .query('SELECT * FROM subs_features');

        return getSubsResult?.recordset.map((sub) => {
            const features = getFeaturesResult?.recordset
                .filter((feature) => sub.sub_id === feature.sub_id)
                .map((f) => f.feature);



            return {
                name: sub.sub_name,
                price: sub.price,
                features: features,
            };
        });

    } catch (error) {
        console.error('error in userProfileExists', error);
        throw error;
    }
}

module.exports = {getSubscriptions}