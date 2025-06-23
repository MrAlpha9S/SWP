const {getManagementToken} = require('../utils/utils');

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

const updateUserAuth0 = async (auth0_id, username = null, email = null, avatar = null, password = null, isSocial) => {
    const token = await getManagementToken();
    const bodyPayload = {}
    const user_metadata = {}

    if (!isSocial) {
        if (password)
            bodyPayload.password = password;
        if (email)
            bodyPayload.email = email;
    }

    if (username) user_metadata.username = username;
    if (avatar) user_metadata.picture = avatar;

    bodyPayload.user_metadata = user_metadata;

    const res = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${auth0_id}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(bodyPayload),
    })

    return res.json();
}

module.exports = {getUserFromAuth0, updateUserAuth0};
