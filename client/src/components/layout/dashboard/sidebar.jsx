import React from 'react';
import { NotificationOutlined, DashboardOutlined, EditOutlined, UnorderedListOutlined, DollarOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import {IoExtensionPuzzleOutline, IoMedalOutline} from "react-icons/io5";

const items = [
    {
        key: 'dashboard',
        label: 'Bảng điều khiển',
        icon: <DashboardOutlined className="mr-4"/>,
    },
    {
        key: 'notifications',
        label: 'Thông báo',
        icon: <NotificationOutlined className="mr-4"/>,
    },
    {
        key: 'check-in',
        label: 'Check-in hàng ngày',
        icon: <EditOutlined className="mr-4"/>,
    },
    {
        key: 'goalsNSavings',
        label: 'Mục tiêu và Tiết kiệm',
        icon: <UnorderedListOutlined className="mr-4"/>,
    },
    {
        key: 'distraction-tools',
        label: 'Quản lý cơn thèm',
        icon: <IoExtensionPuzzleOutline className="mr-4"/>,
    },
    {
        key: 'badges',
        label: 'Huy hiệu',
        icon: <IoMedalOutline className="mr-4"/>,
    },
];
const Sidebar = ({currentStepDashboard, setCurrentStepDashboard, collapse = false, mode}) => {
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
export default Sidebar;