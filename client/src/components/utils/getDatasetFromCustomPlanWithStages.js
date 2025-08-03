  const getDatasetFromCustomPlanWithStages = (customPlanWithStages, selectedStage = 'overview') => {

    if (!customPlanWithStages || !Array.isArray(customPlanWithStages) || customPlanWithStages.length === 0) {
        return [];
    }

    const firstStage = customPlanWithStages[0];
    let dataset = [];

    if (customPlanWithStages.length === 1) {
        firstStage.logs.forEach((log, index) => {
            dataset.push({
                date: log.date,
                cigs: log.cigs,
                stage: 0,
                logIndex: index
            });
        });
    } else {
        customPlanWithStages.forEach((stage, stageIndex) => {
            stage.logs.forEach((log, logIndex) => {
                dataset.push({
                    date: log.date,
                    cigs: log.cigs,
                    stage: stageIndex,
                    logIndex: logIndex
                });
            });
        });

        dataset.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (dataset.length > 0) {
            const startDate = new Date(dataset[0].date);
            const endDate = new Date(dataset[dataset.length - 1].date);
            const currentDate = new Date(startDate);

            const filledDataset = [];

            while (currentDate <= endDate) {
                const currentDateStr = currentDate.toISOString();
                const existingEntry = dataset.find(data =>
                    data.date.split('T')[0] === currentDateStr.split('T')[0]
                );

                if (existingEntry) {
                    filledDataset.push(existingEntry);
                } else {
                    filledDataset.push({
                        date: currentDateStr,
                        cigs: null,
                        stage: null,
                        logIndex: null
                    });
                }

                currentDate.setUTCDate(currentDate.getUTCDate() + 1);
            }

            dataset = filledDataset;
        }
    }
     if (selectedStage !== 'overview') {
         const stageNumber = parseInt(selectedStage, 10);
         return dataset.filter((data) => data.stage === stageNumber);
     }

     return dataset;
};

export default getDatasetFromCustomPlanWithStages;