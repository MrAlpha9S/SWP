import {getBackendUrl} from "./getBackendURL.js";


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

    const res = await fetch(`${getBackendUrl()}/check-in/post-check-in`, {
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

    const res = await fetch(`${getBackendUrl()}/check-in/get-data-set?userAuth0Id=${userAuth0Id}`, {
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
    quittingMethod, // unused
    cigsPerDay = null,
    userCreationDate = null,
    range = "overview"
) {
    const map = new Map();

    const checkinMap = new Map();
    for (const entry of checkinLog) {
        const dateStr = new Date(entry.date).toISOString().split("T")[0];
        checkinMap.set(dateStr, entry.cigs);
    }

    // Sort planLog to ensure proper interpolation
    const sortedPlanLog = [...planLog].sort((a, b) => new Date(a.date) - new Date(b.date));

    console.log('sortedPlanLog', sortedPlanLog);

    // Build interpolated plan ranges
    const planRanges = [];
    for (let i = 0; i < sortedPlanLog.length; i++) {
        const startRaw = sortedPlanLog[i].date;
        const endRaw = sortedPlanLog[i + 1]?.date;

        const start = new Date(startRaw.includes("T") ? startRaw : `${startRaw}T00:00:00Z`);
        const end = endRaw
            ? new Date(new Date(endRaw.includes("T") ? endRaw : `${endRaw}T00:00:00Z`).getTime() - 1000)
            : start;

        planRanges.push({
            start,
            end,
            cigs: sortedPlanLog[i].cigs,
            nextCigs: sortedPlanLog[i + 1]?.cigs ?? sortedPlanLog[i].cigs,
        });
    }

    console.log('planRanges', planRanges)

    const getCurrentUTCDate = () => {
        const now = new Date();
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    };

    const currentDate = getCurrentUTCDate();

    // Determine full timeline range
    const allDates = [
        ...checkinLog.map(e => new Date(e.date)),
        ...planLog.map(e => new Date(e.date)),
        ...(userCreationDate ? [new Date(userCreationDate)] : [])
    ];

    if (allDates.length === 0 && userCreationDate) {
        allDates.push(new Date(userCreationDate));
    }

    console.log('allDates', allDates);

    const firstDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const lastDate = new Date(Math.max(...allDates.map(d => d.getTime()), currentDate.getTime()));

    const current = new Date(firstDate);
    console.log('firstDate', firstDate);
    console.log('lastDate', lastDate);
    console.log('current', current);
    let lastKnownActual = null;

    while (current <= lastDate) {
        const dayStr = current.toISOString().split("T")[0];
        const actualFromCheckin = checkinMap.get(dayStr);
        let actual = actualFromCheckin ?? null;
        let checkinMissed = false;

        if (actual == null && lastKnownActual != null && current <= currentDate) {
            actual = lastKnownActual;
            checkinMissed = true;
        } else if (actual != null) {
            lastKnownActual = actual;
        }

        // Fill before plan starts with cigsPerDay
        const ucDate = userCreationDate ? new Date(userCreationDate) : null;
        const firstPlanDate = sortedPlanLog.length > 0 ? new Date(sortedPlanLog[0].date) : null;

        if (
            actual == null &&
            cigsPerDay != null &&
            ucDate &&
            current >= ucDate &&
            (!firstPlanDate || current < firstPlanDate)
        ) {
            actual = cigsPerDay;
            checkinMissed = true;
        }

        let plan = null;
        for (const range of planRanges) {
            const { start, end, cigs, nextCigs } = range;

            if (current >= start && current <= end) {
                const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
                const dayIndex = Math.floor((current - start) / (1000 * 60 * 60 * 24));

                if (totalDays === 1 || cigs === nextCigs) {
                    plan = cigs;
                } else {
                    const delta = (cigs - nextCigs) / (totalDays - 1);
                    plan = parseFloat((cigs - delta * dayIndex).toFixed(2));
                }
                break;
            }
        }

        const inPlanRange =
            sortedPlanLog.length > 0 &&
            current >= new Date(sortedPlanLog[0].date) &&
            current <= new Date(sortedPlanLog[sortedPlanLog.length - 1].date);

        if (range === "plan" && !inPlanRange) {
            current.setUTCDate(current.getUTCDate() + 1);
            continue;
        }

        map.set(dayStr, {
            date: dayStr,
            actual,
            plan,
            checkinMissed
        });

        current.setUTCDate(current.getUTCDate() + 1);
    }

    return Array.from(map.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
}


export async function getCheckInData(user, getAccessTokenSilently, isAuthenticated, searchDate = null, action = null, userAuth0Id = null) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    let fetchURL = searchDate ? `${getBackendUrl()}/check-in/get-check-in-data?userAuth0Id=${userAuth0Id ? userAuth0Id : user.sub}&date=${searchDate}` : `${getBackendUrl()}/check-in/get-check-in-data?userAuth0Id=${userAuth0Id ? userAuth0Id : user.sub}`

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

