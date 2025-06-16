import React from 'react';
import ModalFooter from "./modalFooter.jsx";
import {Modal} from "antd";

const GoalPostModal = ({title, content, isModalOpen, handleCancel, handleOk, setIsModalOpen}) => {
    return (
        <Modal
            title={title}
            closable={{'aria-label': 'Custom Close Button'}}
            open={isModalOpen}
            onCancel={handleCancel}
            centered
            footer={<ModalFooter cancelText='Trở lại' okText='Xóa' okButtonType='danger' onOk={handleOk} onCancel={() => {
                setIsModalOpen(false)
            }}/>}
        >
            {content}
        </Modal>
    );
};

export default GoalPostModal;