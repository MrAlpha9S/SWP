import React from 'react';
import {Tabs} from "antd";
import CheckIn from "../../../pages/dashboardPage/checkInPage/checkIn.jsx";
import Journal from "./journal.jsx";
import AboutCheckin from "./aboutCheckin.jsx";


const CheckinBoard = () => {

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
        <div>
            <Tabs defaultActiveKey="2" items={items}/>
        </div>
    );
};

export default CheckinBoard;