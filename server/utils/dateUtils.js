export const dateStringToUTCDateObj = (date) => {
    return new Date(date + 'T00:00:00Z')
}

export const convertDDMMYYYYStrToYYYYMMDDStr = (DDMMYYYYString) => {
    const [day, month, year] = DDMMYYYYString.split('-');
    return `${year}-${month}-${day}`;
}

export const convertYYYYMMDDStrToDDMMYYYYStr = (YYYYMMDDString) => {
    const [year, month, day] = YYYYMMDDString.split('-');
    return `${day}-${month}-${year}`;
};

export function getCurrentUTCMidnightDate() {
    const now = new Date();
    return new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
    ));
}

export function getCurrentUTCDateTime() {
    const now = new Date();
    return new Date(new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours() + 7,
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds()
    )));
}

export const clonePlanLogToDDMMYYYY = (planLog) => {
    return planLog.map(entry => ({
        ...entry,
        date: convertYYYYMMDDStrToDDMMYYYYStr(entry.date.split('T')[0]),
    }));
}

export function convertUTCStringToLocalDate(dateStringFromDB) {
    const utcDate = new Date(dateStringFromDB);

    const adjustedTime = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

    return new Date(new Date(adjustedTime).toISOString());
}

