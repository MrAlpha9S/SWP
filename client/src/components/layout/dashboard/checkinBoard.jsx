import React from 'react';
import {Tabs} from "antd";
import CheckIn from "../../../pages/dashboardPage/checkInPage/checkIn.jsx";


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
            children: 'Nhật ký',
        },
        {
            key: '3',
            label: 'Tab 3',
            children: 'Về check-in',
        },
    ];

    const onChange = key => {
        console.log(key);
    };
    return (
        <div>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange}/>
        </div>
    );
};

export default CheckinBoard;