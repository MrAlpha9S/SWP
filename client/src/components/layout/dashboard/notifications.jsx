import React, {useState} from 'react';
import {Tabs, List, Badge, Avatar, Typography, Button, Tag, Pagination} from 'antd';
import {
    BellOutlined,
    CalendarOutlined,
    MessageOutlined,
    UserOutlined,
    CheckOutlined
} from '@ant-design/icons';
import {RiUserCommunityFill} from 'react-icons/ri';
import {useQuery, useMutation, useQueries} from '@tanstack/react-query';
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadCount
} from '../../utils/notificationUtils.js';
import {queryClient} from "../../../main.jsx";
import {useAuth0} from "@auth0/auth0-react";
import {formatUtcToLocalString} from "../../utils/dateUtils.js";
import {useCurrentStepDashboard, useSelectedUserAuth0IdStore, useUserInfoStore} from "../../../stores/store.js";

const {Title, Text} = Typography;

const iconMap = {
    plan: <CalendarOutlined style={{color: '#14b8a6'}}/>,
    message: <MessageOutlined style={{color: '#0d9488'}}/>,
    coach: <UserOutlined style={{color: '#0f766e'}}/>,
    community: <RiUserCommunityFill style={{color: '#8b5cf6'}}/>,
    system: <BellOutlined style={{color: '#f59e0b'}}/>
};

const typeLabelMap = {
    plan: 'Kế hoạch',
    message: 'Tin nhắn',
    coach: 'Huấn luyện viên',
    community: 'Cộng đồng',
    system: 'Hệ thống'
};

const tagColorMap = {
    plan: '#14b8a6',
    message: '#0d9488',
    coach: '#0f766e',
    community: '#8b5cf6',
    system: '#f59e0b'
};

const tabTypes = ['all', 'plan', 'message', 'coach', 'community', 'system'];

function Notifications() {
    const {user, getAccessTokenSilently, isAuthenticated} = useAuth0();
    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const {setCurrentStepDashboard} = useCurrentStepDashboard();
    const {setSelectedUserAuth0Id} = useSelectedUserAuth0IdStore();
    const {userInfo} = useUserInfoStore();

    const {data: notificationsData} = useQuery({
        queryKey: ['notifications', user?.sub, activeTab, page],
        queryFn: () => getNotifications(user, getAccessTokenSilently, isAuthenticated, page, pageSize, activeTab),
        enabled: !!user?.sub && !!activeTab
    });

    const notifications = notificationsData?.data || [];
    const total = notificationsData?.pagination?.total || 0;

    const unreadResults = useQueries({
        queries: tabTypes.map(type => ({
            queryKey: ['unread-count', user?.sub, type],
            queryFn: () => getUnreadCount(user, getAccessTokenSilently, isAuthenticated, type === 'all' ? null : type),
            enabled: !!user?.sub
        }))
    });

    const unreadCounts = tabTypes.reduce((acc, type, index) => {
        acc[type] = unreadResults[index]?.data?.data || 0;
        return acc;
    }, {});

    const markOneMutation = useMutation({
        mutationFn: (id) => markNotificationAsRead(user, getAccessTokenSilently, isAuthenticated, id),
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications', user?.sub, activeTab, page]);
            tabTypes.forEach(type => queryClient.invalidateQueries(['unread-count', user?.sub, type]));
        }
    });

    const markAllMutation = useMutation({
        mutationFn: () => markAllNotificationsAsRead(user, getAccessTokenSilently, isAuthenticated, activeTab === 'all' ? null : activeTab),
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications', user?.sub, activeTab, page]);
            tabTypes.forEach(type => queryClient.invalidateQueries(['unread-count', user?.sub, type]));
        }
    });

    const tabItems = tabTypes.map(type => ({
        key: type,
        label: (
            <span>
                {type === 'all' ? 'Tất cả' : typeLabelMap[type]}
                {unreadCounts[type] > 0 && (
                    <Badge count={unreadCounts[type]} size="small" style={{backgroundColor: '#14b8a6', marginLeft: 8}}/>
                )}
            </span>
        )
    }));

    const filteredNotifications = activeTab === 'all'
        ? notifications
        : notifications.filter(n => n.type === activeTab);

    const handleOnClickNoti = (noti) => {
        const type = noti.type;
        const currentUserRole = userInfo?.role;
        switch (type) {
            case 'message':
                if (currentUserRole === 'Coach') {
                    setSelectedUserAuth0Id(noti.from);
                    setCurrentStepDashboard('coach-user');
                } else {
                    setCurrentStepDashboard('coach');
                }
                break;
            case 'system':
                setCurrentStepDashboard('badges');
                break;
            case 'coach':
                if (noti.noti_title.includes('vừa tạo đánh giá')) {
                    setCurrentStepDashboard('user-review')
                } else {
                    console.log(noti.from)
                    setSelectedUserAuth0Id(noti.from);
                    setCurrentStepDashboard('coach-user');
                }
                break;
            case 'plan':
                if (currentUserRole === 'Coach') {
                    setSelectedUserAuth0Id(noti.from);
                    setCurrentStepDashboard('coach-user');
                } else {
                    setCurrentStepDashboard('coach');
                }
                break;
            default:
                break;
        }
    };

    return (
        <div className="notification-container w-full">
            <div className="notification-header">
                <div className="header-content">
                    <div className="header-left">
                        <BellOutlined className="header-icon"/>
                        <Title level={2} className="header-title">Thông báo</Title>
                    </div>
                    <Button
                        type="primary"
                        icon={<CheckOutlined/>}
                        onClick={() => markAllMutation.mutate()}
                        className="mark-all-button"
                    >
                        Đánh dấu tất cả đã đọc
                    </Button>
                </div>
            </div>

            <div className="notification-content">
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => {
                        setActiveTab(key);
                        setPage(1);
                    }}
                    items={tabItems}
                    className="notification-tabs"
                />

                <List
                    className="notification-list"
                    dataSource={filteredNotifications}
                    renderItem={(item) => (
                        <List.Item
                            className={`notification-item ${!item.is_read ? 'unread' : 'read'}`}
                            onClick={() => {
                                if (!item.is_read) markOneMutation.mutate(item.noti_id);
                                handleOnClickNoti(item);
                            }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <div className="notification-avatar">
                                        <Avatar size={48} icon={iconMap[item.type]}/>
                                        {!item.is_read && <div className="unread-indicator"/>}
                                    </div>
                                }
                                title={
                                    <div className="notification-title">
                                        <Text strong={!item.is_read} className="title-text">
                                            {item.noti_title}
                                        </Text>
                                        <Tag color={tagColorMap[item.type] || '#0d9488'}>
                                            {typeLabelMap[item.type] || item.type}
                                        </Tag>
                                    </div>
                                }
                                description={
                                    <div className="notification-description">
                                        <Text className={!item.is_read ? 'unread-message' : 'read-message'}>
                                            {item.content}
                                        </Text>
                                        <Text type="secondary" className="notification-time">
                                            {formatUtcToLocalString(item.created_at)}
                                        </Text>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />

                <div className="pagination-wrapper" style={{textAlign: 'center', marginTop: 24}}>
                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={total}
                        onChange={(p) => setPage(p)}
                        showSizeChanger={false}
                    />
                </div>

                {filteredNotifications.length === 0 && (
                    <div className="empty-state">
                        <BellOutlined className="empty-icon"/>
                        <Text type="secondary" className="empty-text">
                            Không có thông báo nào trong mục này
                        </Text>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Notifications;
