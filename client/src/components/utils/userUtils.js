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

export async function getUserCreationDate(user, getAccessTokenSilently, isAuthenticated, userAuth0Id = null) {
    if (!isAuthenticated || !user) return;

    let userId
    if (userAuth0Id) {
        userId = userAuth0Id;
    } else if (!userAuth0Id) {
        userId = user.sub
    }

    const token = await getAccessTokenSilently();

    const res = await fetch('http://localhost:3000/users/get-user-creation-date?userAuth0Id=' + userId, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    return res.json();
}

export async function getUserInfo(user, getAccessTokenSilently, isAuthenticated) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`http://localhost:3000/users/info?userAuth0Id=${user.sub}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return await res.json();
}

export async function updateUserInfo(user, getAccessTokenSilently, { username, email, avatar }) {
    const token = await getAccessTokenSilently();

    const res = await fetch("http://localhost:3000/users/info", {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userAuth0Id: user.sub,
            username,
            email,
            avatar
        })
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return await res.json();
}

export async function updateUserSubscription(user, getAccessTokenSilently, isAuthenticated, subscriptionId) {
    if (!isAuthenticated || !user) return;
    const token = await getAccessTokenSilently();
    const res = await fetch('http://localhost:3000/users/update-subscription', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userAuth0Id: user.sub, subscriptionId: subscriptionId})
    })

    if (!res.ok) throw new Error('Subscription update failed');

    return await res.json();
}

export async function getCoaches() {
    const res = await fetch('http://localhost:3000/users/get-coaches', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    if (!res.ok) throw new Error('Fetching coaches failed');

    return await res.json();
}

export async function getCoachByIdOrAuth0Id(coachId) {
    const res = await fetch('http://localhost:3000/users/coaches/' + coachId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    if (!res.ok) throw new Error('Fetching coaches failed');

    return await res.json();
}

// ...existing code...

export async function updateUserController(user, getAccessTokenSilently, { username, email, avatar }) {
    const token = await getAccessTokenSilently();

    const res = await fetch("http://localhost:3000/users/update-user", {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userAuth0Id: user.sub,
            username,
            email,
            avatar
        })
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return await res.json();
}

export async function GetAllMembers(user, getAccessTokenSilently, isAuthenticated) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`http://localhost:3000/users/getAllMembers`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },

    });

    return await res.json();
}


export async function assignCoachToUser (user, coachId, userId, username, coachAuth0Id, getAccessTokenSilently, isAuthenticated) {
    if (!isAuthenticated) return
    const token = await getAccessTokenSilently();

    const res = await fetch("http://localhost:3000/users/assign-coach", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: userId,
            coachId: coachId,
            username: username,
            coachAuth0Id: coachAuth0Id,
            userAuth0Id: user.sub
        })
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return await res.json();
}

export async function getUserNotes(user, getAccessTokenSilently, isAuthenticated, userAuth0Id) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch('http://localhost:3000/users/notes/' + userAuth0Id, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    return res.json();
}

export async function createUserNote(user, getAccessTokenSilently, isAuthenticated, noteOfAuth0Id, creatorAuth0Id, content) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch('http://localhost:3000/users/notes', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            noteOfAuth0Id,
            creatorAuth0Id,
            content
        })
    });

    return res.json();
}

export async function updateUserNote(user, getAccessTokenSilently, isAuthenticated, noteId, noteOfAuth0Id, editorAuth0Id, content) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch('http://localhost:3000/users/notes', {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            noteId,
            noteOfAuth0Id,
            editorAuth0Id,
            content
        })
    });

    return res.json();
}

export async function deleteUserNote(user, getAccessTokenSilently, isAuthenticated, noteId) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`http://localhost:3000/users/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return res.json();
}

export async function updateUserToken(user, getAccessTokenSilently, isAuthenticated, fcmToken) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`http://localhost:3000/users/token/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userAuth0Id: user.sub, token : fcmToken, force: import.meta.env.DEV})
    });

    return res.json();
}

