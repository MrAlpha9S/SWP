export async function getAchievements(user, getAccessTokenSilently, isAuthenticated) {

    if (!isAuthenticated || !user) return;
    const token = await getAccessTokenSilently();

    const res = await fetch('http://localhost:3000/achievements/', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    return await res.json();
}

export async function getAchievementProgress(user, getAccessTokenSilently, isAuthenticated) {

    if (!isAuthenticated || !user) return;
    const token = await getAccessTokenSilently();

    const res = await fetch('http://localhost:3000/achievements/progress/' + user.sub, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    return await res.json();
}

export async function getAchieved(user, getAccessTokenSilently, isAuthenticated) {

    if (!isAuthenticated || !user) return;
    const token = await getAccessTokenSilently();

    const res = await fetch('http://localhost:3000/achievements/achieved/' + user.sub, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    return await res.json();
}