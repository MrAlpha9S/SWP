function calculatePlan(startDate, cigsPerDay, quittingMethod, cigsReduced = 0, expectedQuitDate = null) {
    const planLog = [];
    let date = new Date(startDate);
    let currentCigs = cigsPerDay;

    if (quittingMethod === 'gradual-daily') {
        while (currentCigs > 0) {
            planLog.push({
                date: new Date(date).toISOString(),
                cigs: currentCigs,
            });
            currentCigs = Math.max(currentCigs - cigsReduced, 0);
            date.setDate(date.getDate() + 1);
        }
        planLog.push({
            date: new Date(date).toISOString(),
            cigs: 0
        });
    }

    else if (quittingMethod === 'gradual-weekly') {
        while (currentCigs > 0) {
            planLog.push({
                date: new Date(date).toISOString(),
                cigs: currentCigs,
            });
            currentCigs = Math.max(currentCigs - cigsReduced, 0);
            date.setDate(date.getDate() + 7);
        }
        planLog.push({
            date: new Date(date).toISOString(),
            cigs: 0
        });
    }

    else if (quittingMethod === 'target-date' && expectedQuitDate) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(expectedQuitDate);

        const totalDays = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24));

        if (totalDays <= 0) {
            planLog.push({
                date: new Date(expectedQuitDate).toISOString(),
                cigs: 0
            });
            return planLog;
        }

        const dailyReduction = cigsPerDay / totalDays;

        for (let i = 0; i < totalDays; i++) {
            const currentDate = new Date(startDateObj);
            currentDate.setDate(startDateObj.getDate() + i);

            const remaining = Math.round(Math.max(cigsPerDay - dailyReduction * i, 0));

            if (remaining > 0) {
                planLog.push({
                    date: currentDate.toISOString(),
                    cigs: remaining,
                });
            }
        }

        planLog.push({
            date: new Date(expectedQuitDate).toISOString(),
            cigs: 0
        });
    }

    return planLog;
}

export default calculatePlan;