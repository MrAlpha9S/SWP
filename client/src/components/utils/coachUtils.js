export async function getStats(user, getAccessTokenSilently, isAuthenticated) {

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`http://localhost:3000/coaches/stats/${user.sub}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    return await res.json();
}

export async function getUserCommissionDataset(user, getAccessTokenSilently, isAuthenticated, month = '', year = '', commissionRate) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const url = `http://localhost:3000/coaches/user-commission-dataset/${user.sub}?month=${month}&year=${year}&commissionRate=${commissionRate}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    return await res.json();
}
