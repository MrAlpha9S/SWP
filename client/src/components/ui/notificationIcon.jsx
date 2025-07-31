import React, {useState} from 'react';
import {IoIosNotifications} from "react-icons/io";
import {Popover} from "antd";
import Notifications from "../layout/dashboard/notifications.jsx";
import {useQuery} from "@tanstack/react-query";
import {getNotifications, getUnreadCount} from "../utils/notificationUtils.js";
import {useAuth0} from "@auth0/auth0-react";

const NotificationIcon = ({iconSize, isFor}) => {
    const {user, getAccessTokenSilently, isAuthenticated} = useAuth0();
    const [popoverOpen, setPopoverOpen] = useState(false);

    const {data: notificationsData} = useQuery({
        queryKey: ['notification-counts'],
        queryFn: () => getUnreadCount(user, getAccessTokenSilently, isAuthenticated),
        enabled: !!user?.sub && !!isAuthenticated,
    });

    const unreadCount = notificationsData?.data || 0;
    const hasUnreadNotifications = unreadCount > 0;

    if (isFor === 'sidebar') {
        return (
            <div className={`cursor-pointer ml-[-6px] mr-[20px]`}>
                <div className='relative'>
                    <IoIosNotifications className={iconSize} />
                    {hasUnreadNotifications && (
                        <div className='bg-red-500 text-white rounded-full absolute top-0 right-0 size-5 text-xs flex justify-center items-center'>
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="cursor-pointer">
            <Popover
                trigger="click"
                placement="bottomRight"
                open={popoverOpen}
                onOpenChange={setPopoverOpen}
                content={
                    <div className="w-96 max-w-[90vw] max-h-[80vh] overflow-hidden">
                        <Notifications isFor={isFor} />
                    </div>
                }
                overlayClassName="notification-popover"
                overlayStyle={{
                    maxWidth: '400px',
                    width: '90vw'
                }}
            >
                <div className='relative'>
                    <IoIosNotifications className={iconSize} />
                    {hasUnreadNotifications && (
                        <div className='bg-red-500 text-white rounded-full absolute top-0 right-0 size-5 text-xs flex justify-center items-center'>
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </div>
                    )}
                </div>
            </Popover>
        </div>
    );
};

export default NotificationIcon;