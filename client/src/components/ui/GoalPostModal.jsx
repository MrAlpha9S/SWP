import React from 'react';
import ModalFooter from "./modalFooter.jsx";
import {Modal} from "antd";

const GoalPostModal = ({title, isModalOpen, handleCancel, handleOk, setIsModalOpen = null, editableGoalName = null, setEditableGoalName = null, editableGoalAmount = null, setEditableGoalAmount = null}) => {

    

    return (
        <Modal
            title={title}
            closable={{'aria-label': 'Custom Close Button'}}
            open={isModalOpen}
            onCancel={handleCancel}
            centered
            footer={<ModalFooter cancelText='Trở lại' okText='Lưu' onOk={handleOk} onCancel={() => {
                setIsModalOpen(false)
            }}/>}
        >
            <div className='flex flex-col gap-3'>
                <div className="flex flex-col gap-3">
                    <label htmlFor="goal" className="font-bold text-sm md:text-base">
                        Mục tiêu tiết kiệm của bạn?
                    </label>
                    <p className="text-xs md:text-sm">Ví dụ: tour vòng quanh Châu Âu</p>
                    <input
                        id="goal"
                        type="text"
                        value={editableGoalName}
                        onChange={(e) => setEditableGoalName(e.target.value)}
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <label htmlFor="moneyGoal" className="font-bold text-sm md:text-base">
                        Tổng số tiền bạn cần tiết kiệm?
                    </label>
                    <p className="block text-xs md:text-sm">Nhập vào số tiền (VND) mà bạn cần tiết kiệm</p>
                    <input
                        id="moneyGoal"
                        type="number"
                        value={editableGoalAmount}
                        onChange={(e) => setEditableGoalAmount(Number(e.target.value))}
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default GoalPostModal;