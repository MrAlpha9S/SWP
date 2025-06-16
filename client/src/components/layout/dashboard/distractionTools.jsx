import React from 'react';
import {Tabs} from "antd";
import CheckIn from "../../../pages/dashboardPage/checkInPage/checkIn.jsx";
import Journal from "./journal.jsx";
import AboutCheckin from "./aboutCheckin.jsx";
import GameTab from "./gameTab.jsx";
import AboutDistractionTools from "./aboutDistractionTools.jsx";

const DistractionTools = () => {
    const items = [
        {
            key: '1',
            label: 'Thư giãn & Giải trí',
            children: <GameTab/>,
        },
        {
            key: '2',
            label: 'Về Quản lý cơn thèm',
            children: <AboutDistractionTools/>,
        },
    ];

    return (
        <div className='w-full flex flex-col gap-4 px-1 pb-4 md:px-4'>
            <Tabs defaultActiveKey="1" items={items}/>
        </div>
    );
};

export default DistractionTools;
