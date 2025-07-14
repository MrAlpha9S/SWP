import React from 'react';
import {convertYYYYMMDDStrToDDMMYYYYStr} from "./dateUtils.js";

function ConvertPlanlogDdmmyy(planLog) {
    return planLog.map(entry => ({
        ...entry,
        date: convertYYYYMMDDStrToDDMMYYYYStr(entry.date.split('T')[0]),
    }))
}

export default ConvertPlanlogDdmmyy;