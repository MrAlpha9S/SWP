import {useCallback} from "react";

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

export function formatUtcToLocalString(utcString) {
    const date = new Date(utcString);

    const pad = (n) => n.toString().padStart(2, '0');

    const day = pad(date.getUTCDate());
    const month = pad(date.getUTCMonth() + 1);
    const year = pad(date.getUTCFullYear() % 100);
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());

    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export const formatDate = (ms) => {
    const seconds = Math.abs(Math.floor(ms / 1000));
    const minutes = Math.abs(Math.floor(seconds / 60));
    const hours = Math.abs(Math.floor(minutes / 60));
    const days = Math.abs(Math.floor(hours / 24));

    return {
        days: days,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60
    };
};

