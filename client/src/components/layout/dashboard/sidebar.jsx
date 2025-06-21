import React from 'react';
import { FileTextOutlined, NotificationOutlined, WechatOutlined, DashboardOutlined, EditOutlined, UnorderedListOutlined, DollarOutlined } from '@ant-design/icons';
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
        key: 'goals',
        label: 'Mục tiêu',
        icon: <UnorderedListOutlined className="mr-4"/>,
    },
    {
        key: 'savings',
        label: 'Tiết kiệm',
        icon: <DollarOutlined className="mr-4"/>,
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
    {
        key: 'messager',
        label: 'Trò Chuyện',
        icon: <WechatOutlined className="mr-4"/>,
    },
    {
        key: 'post-blog',
        label: 'Đăng Bài Blog',
        icon: <FileTextOutlined className="mr-4"/>,
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