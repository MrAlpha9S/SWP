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

export async function getCheckInDataSet(user, getAccessTokenSilently, isAuthenticated, userAuth0Id) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`http://localhost:3000/check-in/get-data-set?userAuth0Id=${userAuth0Id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return await res.json();
}

// export function mergeByDate(planLog = [], checkinLog = [], quittingMethod) {
//     const map = new Map();
//
//     const checkinMap = new Map();
//     for (let i = 0; i < checkinLog.length; i++) {
//         const dateStr = new Date(checkinLog[i].date).toISOString().split('T')[0];
//         checkinMap.set(dateStr, checkinLog[i].cigs);
//     }
//
//     // Define plan ranges
//     const planRanges = [];
//     for (let i = 0; i < planLog.length; i++) {
//         const start = new Date(planLog[i].date);
//         const end = planLog[i + 1]
//             ? new Date(planLog[i + 1].date)
//             : new Date(start);
//
//         if (!planLog[i + 1]) {
//             end.setUTCDate(
//                 quittingMethod === 'gradual-weekly'
//                     ? start.getUTCDate() + 6
//                     : start.getUTCDate() + 1
//             );
//         }
//
//         planRanges.push({
//             start,
//             end,
//             cigs: planLog[i].cigs
//         });
//     }
//
//     const getCurrentUTCDateTime = () => {
//         const now = new Date();
//         return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
//     };
//
//     const currentDate = getCurrentUTCDateTime();
//
//     // Determine first and last date for loop
//     const firstDate = new Date(Math.min(
//         ...checkinLog.map(e => new Date(e.date)),
//         ...planLog.map(e => new Date(e.date))
//     ));
//
//     const lastDate = new Date(Math.max(
//         ...checkinLog.map(e => new Date(e.date)),
//         ...planLog.map(e => new Date(e.date))
//     ));
//
//     const current = new Date(firstDate);
//     let lastKnownActual = null;
//
//     while (current <= lastDate) {
//         const dayStr = current.toISOString().split('T')[0];
//         let actual = checkinMap.get(dayStr);
//
//         // Only fill forward if the current day is <= today
//         if (actual == null && lastKnownActual != null && current <= currentDate) {
//             actual = lastKnownActual;
//         } else if (actual != null) {
//             lastKnownActual = actual;
//         }
//
//         let plan = null;
//         for (const range of planRanges) {
//             if (dayStr === range.start.toISOString().split('T')[0]) {
//                 plan = range.cigs;
//                 break;
//             }
//         }
//
//         map.set(dayStr, {
//             date: dayStr,
//             actual,
//             plan
//         });
//
//         current.setUTCDate(current.getUTCDate() + 1);
//     }
//
//     return Array.from(map.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
// }

export function mergeByDate(
    planLog = [],
    checkinLog = [],
    quittingMethod,
    cigsPerDay = null,
    userCreationDate = null,
    range = 'overview' // new param
) {
    const map = new Map();

    const checkinMap = new Map();
    for (let i = 0; i < checkinLog.length; i++) {
        const dateStr = new Date(checkinLog[i].date).toISOString().split('T')[0];
        checkinMap.set(dateStr, checkinLog[i].cigs);
    }

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
            cigs: planLog[i].cigs,
            nextCigs: planLog[i + 1]?.cigs ?? 0
        });
    }

    const getCurrentUTCDateTime = () => {
        const now = new Date();
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    };

    const currentDate = getCurrentUTCDateTime();

    // Determine full range vs plan-only range
    let firstDate, lastDate;

    if (range === 'plan' && planLog.length > 0) {
        firstDate = new Date(planLog[0].date);
        lastDate = getCurrentUTCDateTime();
    } else {
        const allDates = [
            ...checkinLog.map(e => new Date(e.date)),
            ...planLog.map(e => new Date(e.date))
        ];
        if (userCreationDate) {
            allDates.push(new Date(userCreationDate));
        }

        firstDate = new Date(Math.min(...allDates));
        lastDate = new Date(Math.max(
            ...checkinLog.map(e => new Date(e.date)),
            ...planLog.map(e => new Date(e.date)),
            getCurrentUTCDateTime()
        ));
    }

    const current = new Date(firstDate);
    let lastKnownActual = null;

    while (current <= lastDate) {
        const dayStr = current.toISOString().split('T')[0];
        let actual = checkinMap.get(dayStr);

        if (actual == null && lastKnownActual != null && current <= currentDate) {
            actual = lastKnownActual;
        } else if (actual != null) {
            lastKnownActual = actual;
        }

        let plan = null;

        for (const range of planRanges) {
            const startDate = new Date(range.start);
            const endDate = new Date(range.end);

            if (current >= startDate && current <= endDate) {
                const totalDays = Math.max(1, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)));
                const dayIndex = Math.round((current - startDate) / (1000 * 60 * 60 * 24));

                if (quittingMethod === 'gradual-weekly') {
                    const delta = (range.cigs - range.nextCigs) / totalDays;
                    const interpolated = range.cigs - delta * dayIndex;
                    plan = parseFloat(interpolated.toFixed(2));
                } else {
                    plan = range.cigs;
                }
                break;
            }
        }

        if (actual == null && cigsPerDay != null && userCreationDate) {
            const ucDate = new Date(userCreationDate);
            const firstPlanDate = planLog.length > 0 ? new Date(planLog[0].date) : null;

            if (current >= ucDate && (!firstPlanDate || current < firstPlanDate)) {
                actual = cigsPerDay;
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

