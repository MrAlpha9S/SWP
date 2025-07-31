import {notification} from 'antd';
import React, {createContext, useContext, useMemo} from 'react';
import {BsFillPeopleFill, BsFillReplyFill} from "react-icons/bs";
import {BiConversation} from "react-icons/bi";
import {CiEdit} from "react-icons/ci";
import {FaCheck, FaCross, FaMedal, FaRegLightbulb} from "react-icons/fa";
import {AlarmCheckIcon, HeartIcon} from "lucide-react";
import {ImCancelCircle} from "react-icons/im";

const NotificationContext = createContext();

export const NotificationProvider = ({children}) => {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (type, payload, onClick) => {
        switch (type) {
            case 'coach_selected':
                api.info({
                    key: 'coach_selection',
                    message: `Người dùng ${payload.username} vừa chọn bạn`,
                    description: <div>
                        {`Bạn nhận được ${payload.commission.toLocaleString()} VNĐ`}
                        <p>Nhấn vào thông báo này để đi đến trang người dùng</p>
                        <p className='text-gray-400 text-xs'>{`${new Date(payload.timestamp).getUTCHours()}:${new Date(payload.timestamp).getUTCMinutes()}`}</p>
                    </div>,
                    placement: 'topRight',
                    icon: <BsFillPeopleFill className="size-5"/>,
                    onClick: onClick
                });
                break;
            case 'new_message':
                api.open({
                    key: `message_${payload.conversation_id}_${payload.created_at}`,
                    message: `${payload.senderName}`,
                    description: <div>
                        {payload.content}
                        <p className='text-gray-400 text-xs'>{`${new Date(payload.created_at).getUTCHours()}:${new Date(payload.created_at).getUTCMinutes()}`}</p>
                    </div>,
                    placement: 'topRight',
                    icon: <BiConversation className="size-5"/>,
                    onClick: onClick
                });
                break;
            case 'success':
                api.open({
                    key: `success_message`,
                    message: payload?.message,
                    description: <div>
                        {payload?.content}
                        {payload?.timestamp ?
                            <p className='text-gray-400 text-xs'>{`${new Date(payload.timestamp).getUTCHours()}:${new Date(payload.timestamp).getUTCMinutes()}`}</p> : ''}
                    </div>,
                    placement: 'topRight',
                    icon: <FaCheck className="size-5"/>
                });
                break;
            case 'failed':
                api.open({
                    key: `failed_message`,
                    message: payload?.message,
                    description: <div>
                        {payload?.content}
                        {payload?.timestamp ?
                            <p className='text-gray-400 text-xs'>{`${new Date(payload.timestamp).getUTCHours()}:${new Date(payload.timestamp).getUTCMinutes()}`}</p> : ''}
                    </div>,
                    placement: 'topRight',
                    icon: <ImCancelCircle className="size-5"/>
                });
                break;
            case 'plan-edit-by-coach':
                api.open({
                    key: `plan-edit-by-coach`,
                    message: `Kế hoạch sửa bởi ${payload.updaterUsername}`,
                    description: <div>
                        Kế hoạch của bạn vừa được chỉnh sửa bởi Huấn luyện
                        viên <strong>{payload.updaterUsername}</strong>
                        <p className='text-gray-400 text-xs'>{payload.timestamp}</p>
                    </div>,
                    placement: 'topRight',
                    icon: <CiEdit className="size-5"/>,
                    onClick: onClick
                });
                break;
            case 'plan-edit-by-user':
                api.open({
                    key: `plan-edit-by-user`,
                    message: `Kế hoạch sửa bởi ${payload.updaterUsername}`,
                    description: <div>
                        Người dùng {payload.updaterUsername} vừa chỉnh sửa kế hoạch của họ
                        <p className='text-gray-400 text-xs'>{payload.timestamp}</p>
                    </div>,
                    placement: 'topRight',
                    icon: <CiEdit className="size-5"/>,
                    onClick: onClick
                });
                break;
            case 'new-coach-review':
                api.open({
                    key: `new-coach-review-${payload.userAuth0Id}`,
                    message: `Bạn vừa có review mới từ ${payload.username}`,
                    description: <div>
                        <p>Nội dung: {payload.content}</p>
                        <p>Số sao: {payload.stars}</p>
                        <p className='text-gray-400 text-xs'>{`${new Date(payload.timestamp).getUTCHours()}:${new Date(payload.timestamp).getUTCMinutes()}`}</p>
                    </div>,
                    placement: 'topRight',
                    icon: <CiEdit className="size-5"/>,
                    onClick: onClick
                });
                break;
            case 'new-achievement':
                api.open({
                    key: `new-achievement`,
                    message: `Bạn vừa đạt thành tựu mới`,
                    description: <div>
                        <p><strong>{payload.achievement_name}:</strong> {payload.criteria}</p>
                        <p className='text-gray-400 text-xs'>{`${new Date(payload.timestamp).getUTCHours()}:${new Date(payload.timestamp).getUTCMinutes()}`}</p>
                    </div>,
                    placement: 'topRight',
                    icon: <FaMedal className="size-5"/>,
                    onClick: onClick
                });
                break;
            case 'motivation':
                api.open({
                    key: `motivation`,
                    message: payload.title,
                    description: <div>
                        {payload.body}
                    </div>,
                    placement: 'topRight',
                    icon: <FaRegLightbulb className="size-5"/>,
                });
                break;
            case 'like':
                api.open({
                    key: `like-${payload.like_owner}`,
                    message: payload.post_title ?
                        <div>Người dùng <strong>{payload.like_owner}</strong> vừa thích bài viết của bạn.</div> :
                        <div>Người dùng <strong>{payload.like_owner}</strong> vừa thích bình luận của bạn.</div>,
                    description: <div>
                        {payload.post_title ? `Bài viết: ${payload.post_title}` : `Bình luận: ${payload.comment_content}`}
                    </div>,
                    placement: 'topRight',
                    icon: <HeartIcon className="size-5"/>,
                    onClick: onClick
                });
                break;
            case 'reply':
                api.open({
                    key: `reply-${payload.commenter_auth0_id}`,
                    message: <div>Người dùng <strong>{payload.commenter_username}</strong> vừa bình luận bài
                        viết <strong>{payload.post_title}</strong> của bạn.</div>,
                    description: <div>
                        Bình luận: {payload.content}
                    </div>,
                    placement: 'topRight',
                    icon: <BsFillReplyFill className="size-5"/>,
                    onClick: onClick
                });
                break;
            case 'notice':
                api.open({
                    key: `notice-${payload.message}`,
                    message: payload.message,
                    description: payload.content,
                    placement: 'topRight',
                    icon: <AlarmCheckIcon className="size-5"/>,
                    onClick: onClick
                });
                break;
            default:
                api.warning({
                    message: 'Thông báo',
                    description: 'Không xác định loại thông báo.',
                });
        }
    };

    const value = useMemo(() => ({openNotification}), []);

    return (
        <NotificationContext.Provider value={value}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationManager = () => useContext(NotificationContext);
