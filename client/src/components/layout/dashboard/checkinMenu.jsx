import React from 'react';
import {Tabs} from "antd";
import CheckIn from "../../../pages/dashboardPage/checkInPage/checkIn.jsx";
import Journal from "./journal.jsx";
import AboutCheckin from "./aboutCheckin.jsx";
import {getCurrentUTCDateTime} from "../../utils/dateUtils.js";


const CheckinMenu = ({checkInDataset}) => {

    const defaultKey = !checkInDataset?.some((checkin) => checkin.date.split('T')[0] === getCurrentUTCDateTime().toISOString().split('T')[0]) ? '1' : '2'

    const items = [
        {
            key: '1',
            label: 'Check-in',
            children: <CheckIn/>,
        },
        {
            key: '2',
            label: 'Nhật ký',
            children: <Journal/>,
        },
        {
            key: '3',
            label: 'Về check-in',
            children: <AboutCheckin/>,
        },
    ];

    return (
        <div className="w-full flex flex-col gap-4 px-1 pb-4 md:px-4">
            <Tabs defaultActiveKey={defaultKey} items={items}/>
        </div>
    );
};

export default CheckinMenu;