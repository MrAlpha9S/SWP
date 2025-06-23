import React from 'react';
import { FileTextOutlined, DashboardOutlined, WechatOutlined, UnorderedListOutlined, DollarOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import {IoExtensionPuzzleOutline, IoMedalOutline} from "react-icons/io5";

const items = [
    {
        key: 'post-blog',
        label: 'Đăng Bài Blog',
        icon: <FileTextOutlined className="mr-4"/>,
    },
    {
        key: 'messager',
        label: 'Trò Chuyện',
        icon: <WechatOutlined className="mr-4"/>,
    },
];
const CoachSideBar = ({currentStepDashboard, setCurrentStepDashboard, collapse = false, mode}) => {
    return (
        <Menu
            onClick={(e) => {
                setCurrentStepDashboard(e.key)
            }}
            defaultSelectedKeys={['post-blog']}
            mode= {mode}
            items={items}
            inlineCollapsed={collapse}
            selectedKeys={currentStepDashboard}
        />
    );
};
export default CoachSideBar;