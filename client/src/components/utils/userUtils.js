export async function postUserInfo(user, getAccessTokenSilently, isAuthenticated) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch('http://localhost:3000/users/postSignup', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userAuth0Id: user.sub})
    });

    return res.json();
}

export async function getUserCreationDate(user, getAccessTokenSilently, isAuthenticated) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch('http://localhost:3000/users/get-user-creation-date?userAuth0Id=' + user.sub, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    return res.json();
}

export async function getUser(user, getAccessTokenSilently, isAuthenticated) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`http://localhost:3000/users/getUser/${user.sub}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        
    });

    return res.json();
}

