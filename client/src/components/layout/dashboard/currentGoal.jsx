import React, {useEffect, useMemo, useState} from 'react';
import {useCigsPerPackStore, useGoalsStore, usePlanStore, usePricePerPackStore} from "../../../stores/store.js";
import GoalCard from "../../ui/goalCard.jsx";
import {useCheckInDataStore} from "../../../stores/checkInStore.js";
import NotFoundBanner from "../notFoundBanner.jsx";
import CustomButton from "../../ui/CustomButton.jsx";
import GoalPostModal from "../../ui/GoalPostModal.jsx";
import {useAuth0} from "@auth0/auth0-react";
import {usePostGoalMutation} from "../../hooks/usePostGoalMutation.jsx";
import {notification} from "antd";
import {getCurrentUTCDateTime} from "../../utils/dateUtils.js";
import UseAntdNotification from "../../hooks/useAntdNotification.jsx";

const Context = React.createContext({name: 'Default'});

const CurrentGoal = ({type = "onGoing"}) => {
    const {moneySaved, goalList} = useGoalsStore();
    const {checkInDataSet} = useCheckInDataStore();
    const {pricePerPack} = usePricePerPackStore();
    const {cigsPerPack} = useCigsPerPackStore();
    const {cigsPerDay} = usePlanStore();
    const [render, setRender] = useState(false);
    const {addGoal} = useGoalsStore()
    const [editableGoalName, setEditableGoalName] = useState('');
    const [editableGoalAmount, setEditableGoalAmount] = useState(0);
    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const averageCigs = Array.isArray(checkInDataSet) && checkInDataSet.length > 0
        ? checkInDataSet.reduce((sum, obj) => sum + obj.cigs, 0) / checkInDataSet.length
        : null;

    useEffect(() => {
        if (
            typeof moneySaved === 'number' &&
            Array.isArray(goalList) &&
            Array.isArray(checkInDataSet) &&
            typeof pricePerPack === 'number' &&
            typeof cigsPerPack === 'number' &&
            typeof cigsPerDay === 'number'
        ) {
            setRender(true);
        }
    }, [checkInDataSet, cigsPerDay, cigsPerPack, goalList, moneySaved, pricePerPack]);

    const filteredGoals = goalList.filter(goal => {
        const percent = Math.min(100, Math.round((moneySaved / goal.goalAmount) * 100));
        return type === "onGoing" ? percent < 100 : percent >= 100;
    });

    const [api, contextHolder] = notification.useNotification();
    const openNotification = UseAntdNotification(api)
    const contextValue = useMemo(() => ({name: 'Ant Design'}), []);

    const {mutate: postGoalMutation} = usePostGoalMutation(openNotification, setIsModalOpen)

    const handleOk = async () => {
        try {

            const percent = Math.min(100, Math.round((moneySaved / editableGoalAmount) * 100));

            const shouldComplete = percent === 100

            const completedStatus = shouldComplete;
            const completionDate = shouldComplete ? getCurrentUTCDateTime().toISOString() : null;

            addGoal({
                goalName: editableGoalName,
                goalAmount: editableGoalAmount,
                isCompleted: completedStatus,
                completedDate: completionDate,
                createdAt: getCurrentUTCDateTime().toISOString(),
            });

            postGoalMutation({
                editableGoalName: editableGoalName,
                editableGoalAmount: editableGoalAmount,
                user,
                getAccessTokenSilently,
                isAuthenticated,
            });
        } catch (err) {
            console.error("Error saving goal:", err);
        }
    };


    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Mục tiêu {type === 'onGoing' ? 'hiện tại' : 'đã hoàn thành'}
            </h2>
            <div className="flex flex-col gap-5 items-center">
                {render && filteredGoals.length > 0 && filteredGoals.map((goal) => (
                    <GoalCard
                        key={goal.goalId}
                        moneySaved={moneySaved}
                        avgCigs={averageCigs}
                        pricePerPack={pricePerPack}
                        cigsPerPack={cigsPerPack}
                        cigsPerDay={cigsPerDay}
                        goal={goal}
                    />
                ))}
                {render && filteredGoals.length === 0 &&
                    <div className="flex flex-col gap-5 items-center">
                        <NotFoundBanner title='Bạn đang không có mục tiêu đang diễn ra. Hãy tạo mục tiêu mới.'/>
                    </div>
                }
                <GoalPostModal setIsModalOpen={setIsModalOpen} handleOk={handleOk}
                               handleCancel={() => setIsModalOpen(false)} isModalOpen={isModalOpen}
                               title='Tạo mục tiêu mới' setEditableGoalName={setEditableGoalName}
                               editableGoalName={editableGoalName} setEditableGoalAmount={setEditableGoalAmount}
                               editableGoalAmount={editableGoalAmount}/>
                {type === 'onGoing' && <div className='w-[25%]'><CustomButton onClick={() => showModal()}>Tạo mục tiêu mới</CustomButton></div>}
            </div>
            <Context.Provider value={contextValue}>
                {contextHolder}
            </Context.Provider>
        </div>
    );
};

export default CurrentGoal;
