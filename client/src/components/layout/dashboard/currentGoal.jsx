import React, {useEffect, useState} from 'react';
import {useCigsPerPackStore, useGoalsStore, usePlanStore, usePricePerPackStore} from "../../../stores/store.js";
import GoalCard from "../../ui/goalCard.jsx";
import {useCheckInDataStore} from "../../../stores/checkInStore.js";

const CurrentGoal = ({ type = "onGoing" }) => {
    const {moneySaved, goalList} = useGoalsStore();
    const {checkInDataSet} = useCheckInDataStore();
    const {pricePerPack} = usePricePerPackStore();
    const {cigsPerPack} = useCigsPerPackStore();
    const {cigsPerDay} = usePlanStore();

    const [render, setRender] = useState(false);

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

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Mục tiêu {type === 'onGoing' ? 'hiện tại' : 'đã hoàn thành'}
            </h2>
            <div className="flex flex-col gap-5">
                {render && filteredGoals.length > 0 && filteredGoals.map((goal, index) => (
                    <GoalCard
                        key={index}
                        moneySaved={moneySaved}
                        goalName={goal.goalName}
                        goalAmount={goal.goalAmount}
                        avgCigs={averageCigs}
                        goalStartDate={goal.createdAt}
                        pricePerPack={pricePerPack}
                        cigsPerPack={cigsPerPack}
                        cigsPerDay={cigsPerDay}
                        goalId={goal.goalId}
                        isCompleted={goal.isCompleted}
                        completedDate={goal.completedDate}
                    />
                ))}
            </div>
        </div>
    );
};

export default CurrentGoal;
