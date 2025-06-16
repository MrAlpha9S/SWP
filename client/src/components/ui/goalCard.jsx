import React, {useEffect, useMemo, useState} from 'react';
import {Modal, Popover, Progress, notification} from "antd";
import {convertYYYYMMDDStrToDDMMYYYYStr, getCurrentUTCDateTime} from "../utils/dateUtils.js";
import ErrorText from "./errorText.jsx";
import ModalFooter from "./modalFooter.jsx";
import {useGoalsStore} from "../../stores/store.js";
import {postGoal} from "../utils/profileUtils.js";
import {useAuth0} from "@auth0/auth0-react";
import {useMutation} from "@tanstack/react-query";
import {CiCircleCheck} from "react-icons/ci";
import {MdErrorOutline} from "react-icons/md";

const content = (
    <p>Ngày dự tính hoàn thành được tính dựa trên <br/> số điếu trung bình mỗi ngày bạn hút <br/> dựa trên dữ liệu
        check-in của bạn.</p>
);

const Context = React.createContext({name: 'Default'});

const GoalCard = (props) => {

    const {goal, cigsPerDay, avgCigs, cigsPerPack, moneySaved, pricePerPack} = props;
    const {goalId, goalName, goalAmount, completedDate, isCompleted, createdAt} = goal;
    const {updateGoal} = useGoalsStore()
    const [editableGoalName, setEditableGoalName] = useState(goalName);
    const [editableGoalAmount, setEditableGoalAmount] = useState(goalAmount);
    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();
    const realityPercentage = Math.min(100, Math.round((moneySaved / goalAmount) * 100));
    const pricePerCig = Math.round(pricePerPack / cigsPerPack);
    let daysToGoalComplete = 0
    if (avgCigs > 0) {
        daysToGoalComplete = Math.round((goalAmount - moneySaved) / (avgCigs * pricePerCig));
    } else {
        daysToGoalComplete = Math.round((goalAmount - moneySaved) / (cigsPerDay * pricePerCig));
    }
    const parsedStartDate = new Date(createdAt);
    const expectedCompleteDate = new Date(parsedStartDate);
    expectedCompleteDate.setUTCDate(parsedStartDate.getUTCDate() + daysToGoalComplete);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setEditableGoalName(goalName);
        setEditableGoalAmount(goalAmount);
        setIsModalOpen(true);
    };


    const postGoalMutation = useMutation({
        mutationFn: async ({
                               goalId,
                               editableGoalName,
                               editableGoalAmount,
                               user,
                               getAccessTokenSilently,
                               isAuthenticated,
                               completedDate,
                               isCompleted
                           }) => {
            console.log(goalId, editableGoalName, editableGoalAmount, completedDate, isCompleted)
            return await postGoal(goalId, editableGoalName, editableGoalAmount, user, getAccessTokenSilently, isAuthenticated, completedDate, isCompleted);
        },
        onSuccess: () => {
            openNotification('success')
            setIsModalOpen(false);
        },
        onError: () => {
            openNotification('failed')
            setIsModalOpen(false);
        }
    })


    const handleOk = async () => {
        try {
            const newGoalAmount = editableGoalAmount;
            const percent = Math.min(100, Math.round((moneySaved / newGoalAmount) * 100));

            const shouldComplete = percent === 100 && !isCompleted && !completedDate;

            const completedStatus = shouldComplete ? true : isCompleted;
            const completionDate = shouldComplete ? getCurrentUTCDateTime().toISOString() : completedDate;

            console.log("📌 updateGoal args", {
                goalId,
                name: editableGoalName,
                amount: newGoalAmount,
                isCompleted: completedStatus,
                completedDate: completionDate,
            });

            updateGoal(goalId, editableGoalName, newGoalAmount, completedStatus, completionDate);


            postGoalMutation.mutate({
                goalId,
                editableGoalName,
                editableGoalAmount: newGoalAmount,
                user,
                getAccessTokenSilently,
                isAuthenticated,
                completedDate: completionDate,
                isCompleted: completedStatus
            });
        } catch (err) {
            console.error("Error saving goal:", err);
        }
    };


    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type) => {
        type === 'success' ? api.info({
                message: `Lưu thành công`,
                icon: <CiCircleCheck className='text-primary-800'/>
            }) :
            api.info({
                message: `Lưu thất bại. Vui lòng thử lại sau`,
                icon: <MdErrorOutline className='text-red-500'/>
            });
    };
    const contextValue = useMemo(() => ({name: 'Ant Design'}), []);

    return (
        <div className='w-full min-h-[250px] border border-primary-600 rounded-md p-5 flex gap-5 items-center'>
            <img src='/goal.png' alt='' className='w-[25%] h-auto'/>
            <div className='w-full h-full flex flex-col justify-center'>
                <div className='flex justify-between'>
                    <p className='text-1xl md:text-2xl font-bold text-gray-900 my-3'>{goalName} {realityPercentage === 100 &&
                        <span className='text-green-600'>(đã hoàn thành)</span>}</p>
                    {realityPercentage !== 100 && (
                        <button className='underline' onClick={() => showModal()}>Chỉnh sửa</button>)}
                </div>
                <div>
                    <p className='mb-1'>Bắt đầu: {convertYYYYMMDDStrToDDMMYYYYStr(createdAt.split('T')[0])}</p>
                    {isCompleted && completedDate && (
                        <p className='text-green-700'>
                            Ngày hoàn thành: {convertYYYYMMDDStrToDDMMYYYYStr(completedDate.split('T')[0])}
                        </p>
                    )}
                    <p>completedDate raw: {String(completedDate)}</p>

                </div>
                {realityPercentage !== 100 && <div className='flex justify-between'>
                    <p>Tiến trình thực tế: {moneySaved.toLocaleString()} VNĐ</p>
                    {avgCigs > 0 && <Popover content={content}>
                        <p>Dự kiến hoàn
                            thành: {convertYYYYMMDDStrToDDMMYYYYStr(expectedCompleteDate.toISOString().split('T')[0])}</p>
                    </Popover>}
                </div>}
                <Progress percent={realityPercentage} status={realityPercentage !== 100 ? 'active' : ''}
                          strokeColor='#0d9488'/>
                <div className='flex justify-end w-full mt-1'>
                    <p><strong>Mục tiêu: {goalAmount.toLocaleString()} VNĐ</strong></p>
                </div>
            </div>
            <Modal
                title="Chỉnh sửa mục tiêu"
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
            <Context.Provider value={contextValue}>
                {contextHolder}
            </Context.Provider>
        </div>
    );
};

export default GoalCard;
