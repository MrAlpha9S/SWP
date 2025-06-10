import {getCurrentUTCDateTime} from "./dateUtils.js";

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

export function mergeByDate(planLog = [], checkinLog = [], quittingMethod) {
    const map = new Map();
    if (checkinLog.length === 0) {
        return planLog;
    }

    // Add actuals (check-ins)
    for (const {date, cigs} of checkinLog) {
        const day = new Date(date).toISOString().split('T')[0];
        if (new Date(date) <= getCurrentUTCDateTime())
            map.set(day, {date: day, actual: cigs ?? 0, plan: null});
        else
            map.set(day, {date: day, actual: null, plan: null});
    }
    // Populate the first day of each plan block with the value
    // Remaining days in the interval will have plan: null
    for (let i = 0; i < planLog.length; i++) {
        const {date, cigs} = planLog[i];
        const start = new Date(date);
        const end = planLog[i + 1] ? new Date(planLog[i + 1].date) : new Date(start);
        if (!planLog[i + 1]) {
            if (quittingMethod === 'gradual-weekly') {
                end.setDate(start.getDate() + 6);
            } else {
                end.setDate(start.getDate() + 1);
            }
        }

        const firstDayStr = start.toISOString().split('T')[0];
        const existing = map.get(firstDayStr) || {date: firstDayStr, actual: null};
        map.set(firstDayStr, {...existing, plan: cigs});

        // Fill the rest of the interval with plan: null
        start.setDate(start.getDate() + 1);
        while (start < end) {
            const dayStr = start.toISOString().split('T')[0];
            const existing = map.get(dayStr) || {date: dayStr, actual: null};
            map.set(dayStr, {...existing, plan: null});
            start.setDate(start.getDate() + 1);
        }
    }

    return Array.from(map.values()).sort((a, b) => new Date(a.date) - new Date(b.date))
}
