import React from 'react';
import {Tabs} from "antd";
import CurrentGoal from "./currentGoal.jsx";

const GoalsMenu = () => {

    const items = [
        {
            key: '1',
            label: 'Mục tiêu hiện tại',
            children: <CurrentGoal type='onGoing'/>,
        },
        {
            key: '2',
            label: 'Đã hoàn thành',
            children: <CurrentGoal type='completed'/>,
        },
    ];

    return (
        <div className="w-full flex flex-col gap-4 px-1 pb-4 md:px-4">
            <Tabs defaultActiveKey="1" items={items}/>
        </div>
    );
};

export default GoalsMenu;