export const dateStringToUTCDateObj = (date) => {
    return new Date(date + 'T00:00:00.000Z')
}

export const convertMMDDYYYYStrToYYYYMMDDObjISO = (dateString) => {
    const dateArray = dateString.split('-');
    const UTCDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}T00:00:00Z`;
    return new Date(UTCDate);
}

export const convertStrYYYYMMDDtoDDMMYYYYStr = (YYYYMMDDString) => {
    const dateArray = YYYYMMDDString.split('-');
    return `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
}

export function getCurrentUTCMidnightDate() {
    const now = new Date();
    return new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
    ));
}

