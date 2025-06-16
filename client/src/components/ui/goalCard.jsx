import React, {useMemo, useState} from 'react';
import {Popover, Progress, notification} from "antd";
import {convertYYYYMMDDStrToDDMMYYYYStr, getCurrentUTCDateTime} from "../utils/dateUtils.js";
import ErrorText from "./errorText.jsx";
import {useGoalsStore} from "../../stores/store.js";
import {useAuth0} from "@auth0/auth0-react";
import GoalPostModal from "./GoalPostModal.jsx";
import {usePostGoalMutation} from "../hooks/usePostGoalMutation.jsx";
import ConfirmationModal from "./confirmationModal.jsx";
import UseAntdNotification from "../hooks/useAntdNotification.jsx";

const content = (
    <p>Ngày dự tính hoàn thành được tính dựa trên <br/> số điếu trung bình mỗi ngày bạn hút <br/> dựa trên dữ liệu
        check-in của bạn.</p>
);

const Context = React.createContext({name: 'Default'});

const GoalCard = (props) => {

    const {goal, cigsPerDay, avgCigs, cigsPerPack, moneySaved, pricePerPack} = props;
    const {goalId, goalName, goalAmount, completedDate, isCompleted, createdAt} = goal;
    const {updateGoal, removeGoal} = useGoalsStore()
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
    const [isDelModalOpen, setIsDelModalOpen] = useState(false);
    const showModal = () => {
        setEditableGoalName(goalName);
        setEditableGoalAmount(goalAmount);
        setIsModalOpen(true);
    };

    const showDeleteModal = () => {
        setIsDelModalOpen(true);
    };


    const [api, contextHolder] = notification.useNotification();
    const openNotification = UseAntdNotification(api)

    const contextValue = useMemo(() => ({name: 'Ant Design'}), []);


    const {mutate: postGoalMutation} = usePostGoalMutation(openNotification, setIsModalOpen)
    const {mutate: deleteGoalMutation} = usePostGoalMutation(openNotification, setIsModalOpen, 'delete')


    const handleOk = async () => {
        try {
            const newGoalAmount = editableGoalAmount;
            const percent = Math.min(100, Math.round((moneySaved / newGoalAmount) * 100));

            const shouldComplete = percent === 100 && !isCompleted && !completedDate;

            const completedStatus = shouldComplete ? true : isCompleted;
            const completionDate = shouldComplete ? getCurrentUTCDateTime().toISOString() : completedDate;

            updateGoal(goalId, editableGoalName, newGoalAmount, completedStatus, completionDate);


            postGoalMutation({
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

    const handleDelOk = async () => {
        try {
            removeGoal(goalId);

            deleteGoalMutation({goalId, user, getAccessTokenSilently, isAuthenticated})
        } catch (err) {
            console.error("Error deleting goal:", err);
        }
    }


    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='w-full min-h-[250px] border border-primary-600 rounded-md p-5 flex gap-5 items-center'>
            <img src='/goal.png' alt='' className='w-[25%] h-auto'/>
            <div className='w-full h-full flex flex-col justify-center'>
                <div className='flex justify-between'>
                    <p className='text-1xl md:text-2xl font-bold text-gray-900 my-3'>{goalName} {realityPercentage === 100 &&
                        <span className='text-green-600'>(đã hoàn thành)</span>}</p>
                    {realityPercentage !== 100 && (
                        <div className='flex gap-5'>
                            <button className='underline' onClick={() => showModal()}>Chỉnh sửa</button>
                            <button className='underline text-red-500' onClick={() => showDeleteModal()}>Xóa</button>
                        </div>)}
                </div>
                <div>
                    <p className='mb-1'>Bắt
                        đầu: {createdAt && typeof createdAt === 'string' ? convertYYYYMMDDStrToDDMMYYYYStr(createdAt.split('T')[0]) : getCurrentUTCDateTime().toISOString().split('T')[0]}
                    </p>
                    {isCompleted && completedDate && (
                        <p className='text-green-700'>
                            Ngày hoàn thành: {convertYYYYMMDDStrToDDMMYYYYStr(completedDate.split('T')[0])}
                        </p>
                    )}

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
            <GoalPostModal title='Chỉnh sửa mục tiêu' isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
                           editableGoalAmount={editableGoalAmount} editableGoalName={editableGoalName}
                           setEditableGoalAmount={setEditableGoalAmount} setEditableGoalName={setEditableGoalName}
                           handleCancel={handleCancel} handleOk={handleOk}/>
            <ConfirmationModal title='Xác nhận xóa' content='Bạn có chắc chắn muốn xóa mục tiêu này?' isModalOpen={isDelModalOpen} setIsModalOpen={setIsDelModalOpen}
                               handleCancel={() => setIsDelModalOpen(false)} handleOk={handleDelOk}/>
            <Context.Provider value={contextValue}>
                {contextHolder}
            </Context.Provider>
        </div>
    )
        ;
};

export default GoalCard;
