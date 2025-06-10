

// const convertDDMMYYYYStrToYYYYMMDDStr = (DDMMYYYYString) => {
//     const [day, month, year] = DDMMYYYYString.split('-');
//     return `${year}-${month}-${day}`;
// }

const convertYYYYMMDDStrToDDMMYYYYStr = (YYYYMMDDString) => {
    const [year, month, day] = YYYYMMDDString.split('-');
    return `${day}-${month}-${year}`;
};

// function getCurrentUTCMidnightDate() {
//     const now = new Date();
//     return new Date(Date.UTC(
//         now.getUTCFullYear(),
//         now.getUTCMonth(),
//         now.getUTCDate()
//     ));
// }

function getCurrentUTCDateTime() {
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

function convertUTCStringToLocalDate(dateStringFromDB) {
    const utcDate = new Date(dateStringFromDB);

    const adjustedTime = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

    return new Date(new Date(adjustedTime).toISOString());
}

module.exports = {convertUTCStringToLocalDate, getCurrentUTCDateTime}

