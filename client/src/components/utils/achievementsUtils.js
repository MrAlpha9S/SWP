import {getBackendUrl} from "./getBackendURL.js";

export async function getAchievements(user, getAccessTokenSilently, isAuthenticated) {

    if (!isAuthenticated || !user) return;
    const token = await getAccessTokenSilently();

    const res = await fetch(`${getBackendUrl()}/achievements/`, {
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

    const res = await fetch(`${getBackendUrl()}/achievements/progress/` + user.sub, {
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

    const res = await fetch(`${getBackendUrl()}/achievements/achieved/` + user.sub, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });

    return await res.json();
}

// In your achievement service
export const addFinancialAchievement = async (user, getAccessTokenSilently, isAuthenticated, threshold, moneySaved) => {
    if (!isAuthenticated || !user) return;

    try {
        const token = await getAccessTokenSilently();

        // Check if user already has this achievement
        let achievementId = 0

        switch (threshold) {
            case 100000:
                achievementId = '100k';
                break;
            case 500000:
                achievementId = '500k';
                break;
            case 1000000:
                achievementId = '1m';
                break;
            case 5000000:
                achievementId = '5m';
                break;
            case 10000000:
                achievementId = '10m';
                break;
        }

        const response = await fetch('/api/achievements/financial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userAuth0Id: user.sub,
                threshold: threshold,
                achievementId: achievementId,
                moneySaved: moneySaved
            })
        });

        if (response.ok) {
            const result = await response.json();
            if (result.newAchievement) {
                console.log(`🎉 Financial achievement unlocked: ${achievementId}`);
            }
        }
    } catch (error) {
        console.error('Error adding financial achievement:', error);
    }
};