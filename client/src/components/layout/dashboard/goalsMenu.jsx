import React from 'react';
import SetGoals from "../signup/setGoals.jsx";
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
            label: 'Tạo mục tiêu',
            children: <></>,
        },
        {
            key: '3',
            label: 'Đã hoàn thành',
            children: <CurrentGoal type='completed'/>,
        },
    ];

    return (
        <div>
            <Tabs defaultActiveKey="1" items={items}/>
        </div>
    );
};

export default GoalsMenu;