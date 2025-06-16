import React from 'react';
import { CiCircleCheck } from 'react-icons/ci';
import { MdErrorOutline } from 'react-icons/md';

/**
 * Custom notification hook for Ant Design with icon support
 * @param {Object} api - antd notification API (e.g., notification from `App.useNotification()`)
 */
const useAntdNotification = (api) => {
    const openNotification = (type) => {
        switch (type) {
            case 'post-success':
                api.info({
                    message: 'Lưu thành công',
                    icon: <CiCircleCheck className="text-primary-800" />,
                });
                break;
            case 'post-failed':
                api.info({
                    message: 'Lưu thất bại. Vui lòng thử lại sau',
                    icon: <MdErrorOutline className="text-red-500" />,
                });
                break;
            case 'delete-success':
                api.info({
                    message: 'Xóa thành công',
                    icon: <CiCircleCheck className="text-primary-800" />,
                });
                break;
            case 'delete-failed':
                api.info({
                    message: 'Xóa thất bại. Vui lòng thử lại sau',
                    icon: <MdErrorOutline className="text-red-500" />,
                });
                break;
            default:
                break;
        }
    };

    return openNotification;
};

export default useAntdNotification;
