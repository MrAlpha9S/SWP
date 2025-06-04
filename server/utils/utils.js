async function getManagementToken() {
    try {
        const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                "client_id":process.env.AUTH0_M2M_CLIENT_ID,
                "client_secret":process.env.AUTH0_M2M_CLIENT_SECRET,
                "audience":process.env.AUTH0_M2M_AUDIENCE,
                "grant_type":"client_credentials"
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        return data.access_token;
    } catch (error) {
        console.error('Error fetching token:', error);
    }
}

module.exports = {getManagementToken};