export async function postCheckIn(user, getAccessTokenSilently, isAuthenticated, checkInDate, feel, checkedQuitItems, freeText, qna, isFreeText, cigsSmoked, isStepOneOnYes, isJournalSelected) {

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const bodyPayLoad = {
        userAuth0Id: user.sub,
        feel: feel,
    }

    if (isStepOneOnYes) {
        bodyPayLoad.checkedQuitItems = checkedQuitItems;
    } else {
        bodyPayLoad.cigsSmoked = cigsSmoked
    }
    if (isJournalSelected) {
        if (isFreeText) {
            bodyPayLoad.freeText = freeText;
        } else {
            bodyPayLoad.qna = qna
        }
    }

    const res = await fetch('http://localhost:3000/check-in/post-check-in', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayLoad)
    });

    return await res.json();
}

export async function getCheckInDataSet(user, getAccessTokenSilently, isAuthenticated) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`http://localhost:3000/check-in/get-data-set?userAuth0Id=${user.sub}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return await res.json();
}

export function mergeByDate(planLog = [], checkinLog = []) {
    const map = new Map();

    // Step 1: Insert check-in data
    for (const { date, cigs } of checkinLog) {
        const day = new Date(date).toISOString().split('T')[0];
        map.set(day, { date: day, actual: cigs, plan: null });
    }

    // Step 2: Expand planLog to fill 7-day periods
    for (let i = 0; i < planLog.length; i++) {
        const { date, cigs } = planLog[i];
        const start = new Date(date);
        const end = planLog[i + 1] ? new Date(planLog[i + 1].date) : new Date(start);
        if (!planLog[i + 1]) end.setDate(start.getDate() + 6); // final range

        while (start < end) {
            const dayStr = start.toISOString().split('T')[0];
            const existing = map.get(dayStr) || { date: dayStr, actual: null };
            map.set(dayStr, { ...existing, plan: cigs });
            start.setDate(start.getDate() + 1);
        }
    }

    // Step 3: Return sorted array
    return Array.from(map.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
}
