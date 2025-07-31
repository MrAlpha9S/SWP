import React from 'react';
import {
    FileTextOutlined,
    WechatOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import {GrOverview} from "react-icons/gr";
import {RiUserCommunityLine} from "react-icons/ri";
import NotificationIcon from "../../ui/notificationIcon.jsx";

const items = [
    {
        key: 'overview',
        label: 'Tổng quan',
        icon: <GrOverview className="mr-4"/>
    },
    {
        key: 'notifications',
        label: 'Thông báo',
        icon: <NotificationIcon iconSize={'size-8'} isFor='sidebar'/>,
    },
    {
        key: 'coach-user',
        label: 'Người dùng',
        icon: <WechatOutlined className="mr-4"/>,
    },
    {
        key: 'post-blog',
        label: 'Quản lý Blog',
        icon: <FileTextOutlined className="mr-4"/>,
    },
    {
        key: 'forum-manage',
        label: 'Quản lý cộng đồng',
        icon: <RiUserCommunityLine className="mr-4"/>,
    },
    {
        key:'user-review',
        label: 'Review từ người dùng',
        icon: <RiUserCommunityLine className="mr-4"/>,
    }
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