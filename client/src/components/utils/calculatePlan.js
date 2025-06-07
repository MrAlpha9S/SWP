function calculatePlan(startDate, cigsPerDay, quittingMethod, cigsReduced, expectedQuitDate = null) {
    const planLog = [];
    let date = new Date(startDate);
    let currentCigs = cigsPerDay;

    if (quittingMethod === 'gradual-daily') {
        while (currentCigs > 0) {
            planLog.push({
                date: date.toISOString().split('T')[0],
                cigs: currentCigs,
            });
            currentCigs = Math.max(currentCigs - cigsReduced, 0);
            date.setDate(date.getDate() + 1);
        }
        if (planLog[planLog.length -1] !== 0 ) {
            planLog.push({
                date: date.toISOString().split('T')[0],
                cigs: 0
            })
        }
    }

    else if (quittingMethod === 'gradual-weekly') {
        while (currentCigs > 0) {
            planLog.push({
                date: date.toISOString().split('T')[0],
                cigs: currentCigs,
            });
            currentCigs = Math.max(currentCigs - cigsReduced, 0);
            date.setDate(date.getDate() + 7);
        }
        if (planLog[planLog.length -1] !== 0 ) {
            planLog.push({
                date: date.toISOString().split('T')[0],
                cigs: 0
            })
        }
    }

    else if (quittingMethod === 'target-date' && expectedQuitDate) {
        const end = new Date(expectedQuitDate);
        const days = Math.ceil((end - date) / (1000 * 60 * 60 * 24));
        const dailyReduction = cigsPerDay / days;

        for (let i = 0; i <= days; i++) {
            date.setDate(date.getDate() + 1);
            const remaining = Math.round(Math.max(cigsPerDay - dailyReduction * i, 0));
            planLog.push({
                date: date.toISOString().split('T')[0],
                cigs: remaining,
            });
        }
        let lastDate = new Date(planLog[planLog.length - 1].date);
        const expectedQuitDateObj = new Date(expectedQuitDate);
        while (expectedQuitDateObj < lastDate) {
            planLog.pop()
            lastDate = new Date(planLog[planLog.length - 1].date)
        }
    }
    return planLog;
}

export default calculatePlan;