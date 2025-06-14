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
        bodyPayLoad.cigsSmoked = cigsSmoked
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

export function mergeByDate(planLog = [], checkinLog = [], quittingMethod, cigsPerDay) {
    const map = new Map();

    if (checkinLog.length === 0) {
        return planLog;
    }

    for (let i = 0; i < checkinLog.length; i++) {
        const { date, cigs } = checkinLog[i];

        const currentUTCDate = getCurrentUTCDateTime().toISOString().split('T')[0];
        const checkinDay = new Date(date).toISOString().split('T')[0];

        if (checkinDay <= currentUTCDate) {
            const isMissingCheckin = cigs === null || cigs === undefined;

            let fallback = cigsPerDay;
            for (let j = i - 1; j >= 0; j--) {
                const prev = checkinLog[j]?.cigs;
                if (prev !== null && prev !== undefined) {
                    fallback = prev;
                    break;
                }
            }

            map.set(checkinDay, {
                date: checkinDay,
                actual: isMissingCheckin ? fallback : cigs,
                plan: null,
                isMissingCheckin
            });
        } else {
            map.set(checkinDay, {
                date: checkinDay,
                actual: null,
                plan: null,
                isMissingCheckin: true
            });
        }
    }

    for (let i = 0; i < planLog.length; i++) {
        const { date, cigs } = planLog[i];
        const start = new Date(date);
        const end = planLog[i + 1] ? new Date(planLog[i + 1].date) : new Date(start);

        if (!planLog[i + 1]) {
            end.setDate(
                quittingMethod === 'gradual-weekly'
                    ? start.getDate() + 6
                    : start.getDate() + 1
            );
        }

        const firstDayStr = start.toISOString().split('T')[0];
        const existing = map.get(firstDayStr) || { date: firstDayStr, actual: null, isMissingCheckin: true };
        map.set(firstDayStr, { ...existing, plan: cigs });

        start.setDate(start.getDate() + 1);
        while (start < end) {
            const dayStr = start.toISOString().split('T')[0];
            const existing = map.get(dayStr) || { date: dayStr, actual: null, isMissingCheckin: true };
            map.set(dayStr, { ...existing, plan: null });
            start.setDate(start.getDate() + 1);
        }
    }

    return Array.from(map.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
}

export async function getCheckInData(user, getAccessTokenSilently, isAuthenticated, today) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const fetchURL = today ? `http://localhost:3000/check-in/get-check-in-data?userAuth0Id=${user.sub}&date=${today}` : `http://localhost:3000/check-in/get-check-in-data?userAuth0Id=${user.sub}`

    const res = await fetch(fetchURL, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return await res.json();
}

