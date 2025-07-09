import React from 'react';
import { FileTextOutlined, DashboardOutlined, WechatOutlined, UnorderedListOutlined, DollarOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import {IoExtensionPuzzleOutline, IoMedalOutline} from "react-icons/io5";
import {GrOverview} from "react-icons/gr";
import {RiUserCommunityLine} from "react-icons/ri";

const items = [
    {
        key: 'overview',
        label: 'Tổng quan',
        icon: <GrOverview className="mr-4"/>
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