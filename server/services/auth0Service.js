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

    if (!isSocial) {
        if (password)
            bodyPayload.password = password;
        if (email)
            bodyPayload.email = email;
        if (username)
            bodyPayload.name = username;
    }

    const rawRes = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${auth0_id}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(bodyPayload),
    });

    const resData = await rawRes.json();
    if (!rawRes.ok) {
        console.error('Auth0 error:', resData);
        return false;
    }
    return true;

}

module.exports = {getUserFromAuth0, updateUserAuth0};
