import React from 'react';
import { FileTextOutlined, NotificationOutlined, WechatOutlined, DashboardOutlined, EditOutlined, UnorderedListOutlined, DollarOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import {IoExtensionPuzzleOutline, IoMedalOutline} from "react-icons/io5";
import {BsFillPeopleFill} from "react-icons/bs";
import {useUserInfoStore} from "../../../stores/store.js";
import {Crown} from "lucide-react";
import PremiumBadge from "../../ui/premiumBadge.jsx";

const Sidebar = ({currentStepDashboard, setCurrentStepDashboard, collapse = false, mode}) => {

    const { userInfo } = useUserInfoStore()

    const items = [
        {
            key: 'dashboard',
            label: 'Bảng điều khiển',
            icon: <DashboardOutlined className="mr-4"/>,
        },
        {
            key: 'coach',
            label: 'Huấn luyện viên',
            icon: <div className='relative mr-4 '>{userInfo.sub_id === 1 ? <><BsFillPeopleFill className="size-5"/><PremiumBadge className='absolute top-[-15px] left-[140px]'/></> : <BsFillPeopleFill className="mr-4 size-5"/>}</div>,
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
        // {
        //     key: 'messager',
        //     label: 'Trò Chuyện',
        //     icon: <WechatOutlined className="mr-4"/>,
        // },
        // {
        //     key: 'post-blog',
        //     label: 'Đăng Bài Blog',
        //     icon: <FileTextOutlined className="mr-4"/>,
        // },
    ];
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