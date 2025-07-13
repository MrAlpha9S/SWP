import { notification } from 'antd';
import React, { createContext, useContext, useMemo } from 'react';
import {BsFillPeopleFill} from "react-icons/bs";
import {BiConversation} from "react-icons/bi";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (type, payload) => {
        switch (type) {
            case 'coach_selected':
                api.info({
                    key: 'coach_selection',
                    message: `Người dùng ${payload.username} vừa chọn bạn`,
                    description: <div>
                        {`Bạn nhận được ${payload.assignResult.toLocaleString()} VNĐ`}
                        <p>{`${new Date(payload.timestamp).getUTCHours()}:${new Date(payload.timestamp).getUTCMinutes()}`}</p>
                    </div>,
                    placement: 'topRight',
                    icon: <BsFillPeopleFill className="size-5"/>
                });
                break;
            case 'new_message':
                api.open({
                    key: `message_${payload.conversation_id}_${payload.created_at}`,
                    message: `Tin nhắn mới từ ${payload.senderName}`,
                    description: <div>
                        {payload.content}
                        <p>{`${new Date(payload.created_at).getUTCHours()}:${new Date(payload.created_at).getUTCMinutes()}`}</p>
                    </div>,
                    placement: 'topRight',
                    icon: <BiConversation className="size-5"/>
                });
                break;
            default:
                api.warning({
                    message: 'Thông báo',
                    description: 'Không xác định loại thông báo.',
                });
        }
    };

    const value = useMemo(() => ({ openNotification }), []);

    return (
        <NotificationContext.Provider value={value}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationManager = () => useContext(NotificationContext);
