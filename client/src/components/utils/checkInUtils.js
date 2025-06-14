import {getCurrentUTCDateTime} from "./dateUtils.js";

export async function postCheckIn(user, getAccessTokenSilently, isAuthenticated, checkInDate, feel, checkedQuitItems, freeText, qna, isFreeText, cigsSmoked, isStepOneOnYes, isJournalSelected) {

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const bodyPayLoad = {
        userAuth0Id: user.sub,
        feel: feel,
        checkInDate: checkInDate,
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

export function mergeByDate(planLog = [], checkinLog = [], quittingMethod) {
    const map = new Map();

    const checkinMap = new Map();
    for (let i = 0; i < checkinLog.length; i++) {
        const dateStr = new Date(checkinLog[i].date).toISOString().split('T')[0];
        checkinMap.set(dateStr, checkinLog[i].cigs);
    }

    // Define plan ranges
    const planRanges = [];
    for (let i = 0; i < planLog.length; i++) {
        const start = new Date(planLog[i].date);
        const end = planLog[i + 1]
            ? new Date(planLog[i + 1].date)
            : new Date(start);

        if (!planLog[i + 1]) {
            end.setUTCDate(
                quittingMethod === 'gradual-weekly'
                    ? start.getUTCDate() + 6
                    : start.getUTCDate() + 1
            );
        }

        planRanges.push({
            start,
            end,
            cigs: planLog[i].cigs
        });
    }

    const firstDate = new Date(Math.min(
        ...checkinLog.map(e => new Date(e.date)),
        ...planLog.map(e => new Date(e.date))
    ));

    const lastDate = new Date(Math.max(
        ...checkinLog.map(e => new Date(e.date)),
        ...planLog.map(e => new Date(e.date)),
        new Date()
    ));

    const current = new Date(firstDate);
    while (current <= lastDate) {
        const dayStr = current.toISOString().split('T')[0];
        const actual = checkinMap.get(dayStr) ?? null;

        // Default plan is null unless it's the first day of a plan range
        let plan = null;
        for (const range of planRanges) {
            if (dayStr === range.start.toISOString().split('T')[0]) {
                plan = range.cigs;
                break;
            }
        }

        map.set(dayStr, {
            date: dayStr,
            actual,
            plan
        });

        current.setUTCDate(current.getUTCDate() + 1);
    }

    return Array.from(map.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
}



export async function getCheckInData(user, getAccessTokenSilently, isAuthenticated, searchDate = null, action = null) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    let fetchURL = searchDate ? `http://localhost:3000/check-in/get-check-in-data?userAuth0Id=${user.sub}&date=${searchDate}` : `http://localhost:3000/check-in/get-check-in-data?userAuth0Id=${user.sub}`

    if (action !== null) {
        fetchURL += `&action=${action}`;
    }

    const res = await fetch(fetchURL, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return await res.json();
}

