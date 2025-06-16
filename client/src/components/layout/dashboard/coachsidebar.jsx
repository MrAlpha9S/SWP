import React from 'react';
import { FileTextOutlined, DashboardOutlined, EditOutlined, UnorderedListOutlined, DollarOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import {IoExtensionPuzzleOutline, IoMedalOutline} from "react-icons/io5";

const items = [
    {
        key: 'dashboard',
        label: 'Bảng điều khiển',
        icon: <DashboardOutlined className="mr-4"/>,
    },
    {
        key: 'post-blog',
        label: 'Đăng Bài Blog',
        icon: <FileTextOutlined className="mr-4"/>,
    },
    {
        key: 'post-thread',
        label: 'Đăng Bài Cộng Đồng',
        icon: <FileTextOutlined className="mr-4"/>,
    },
];
const Coachsidebar = ({currentStepDashboard, setCurrentStepDashboard, collapse = false, mode}) => {
    return (
        <Menu
            onClick={(e) => {
                setCurrentStepDashboard(e.key)
            }}
            defaultSelectedKeys={['dashboard']}
            mode= {mode}
            items={items}
            inlineCollapsed={collapse}
            selectedKeys={currentStepDashboard}
        />
    );
};
export default Coachsidebar;