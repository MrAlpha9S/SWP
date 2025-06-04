const { getManagementToken } = require('../utils/utils');

const getUserFromAuth0 = async (user_id) => {
    const token = await getManagementToken();
    const res = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Auth0 error in getUserFromAuth0: ${text}`);
    }
    return res.json();
};

module.exports = { getUserFromAuth0 };
