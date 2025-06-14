import React, { useEffect, useState } from 'react';
import { Timeline } from "antd";
import TimelineEntry from "../../ui/timeLineEntry.jsx" // 👈 import this

const TimeLineEachMonth = ({ day, month, year, allCheckInData }) => {
    const [timeLineItem, setTimeLineItem] = useState([]);

    useEffect(() => {
        const checkinData = allCheckInData.filter((data) => {
            const fetchedDate = new Date(data.logged_at);
            const fetchedDay = fetchedDate.getUTCDate();
            const fetchedMonth = fetchedDate.getUTCMonth();
            const fetchedYear = fetchedDate.getUTCFullYear();

            return (
                fetchedMonth === month &&
                fetchedYear === year &&
                (day === 0 || fetchedDay === day)
            );
        });

        const timelineItems = checkinData.map((entry) => ({
            color: entry.isMissed !== null && entry.isMissed !== true ? 'green' : 'red',
            children: <TimelineEntry entry={entry} />
        }));

        setTimeLineItem(timelineItems);
    }, [allCheckInData, day, month, year]);

    return <Timeline items={timeLineItem} />;
};

export default TimeLineEachMonth;
