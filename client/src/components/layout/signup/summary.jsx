import React from 'react';
import CustomButton from "../../ui/CustomButton.jsx";
import {useAuth0} from "@auth0/auth0-react";
import {Divider} from "antd";
import {
    useCigsPerPackStore, useCurrentStepStore, useGoalsStore, usePlanStore,
    usePricePerPackStore,
    useQuitReadinessStore,
    useReasonStore, useTimeAfterWakingStore, useTimeOfDayStore, useTriggersStore
} from "../../../stores/store.js";
import {
    quittingMethodOptions,
    readinessRadioOptions,
    reasonListOptions, smokingTriggerOptions,
    timeAfterWakingRadioOptions, timeOfDayOptions
} from "../../../constants/constants.js";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {CustomizedAxisTick} from "../../utils/customizedAxisTick.jsx";
import {convertYYYYMMDDStrToDDMMYYYYStr, getCurrentUTCMidnightDate} from "../../utils/dateUtils.js";


const Summary = () => {

    const {loginWithRedirect, user} = useAuth0();

    const {readinessValue} = useQuitReadinessStore();
    const {reasonList} = useReasonStore();
    const {pricePerPack} = usePricePerPackStore();
    const {cigsPerPack} = useCigsPerPackStore();
    const {timeAfterWaking} = useTimeAfterWakingStore();
    const {timeOfDayList, customTimeOfDay} = useTimeOfDayStore();
    const {triggers, customTrigger} = useTriggersStore();
    const {startDate, cigsPerDay, quittingMethod, cigsReduced, expectedQuitDate, stoppedDate, planLog, planLogCloneDDMMYY} = usePlanStore();
    const {createGoalChecked, goalList} = useGoalsStore()
    const {setCurrentStep} = useCurrentStepStore()

    const calculatePrice = (type, numberOfYears = 1) => {
        const pricePerCigs = pricePerPack / cigsPerPack
        let moneySaved = 0;
        if (type === "week") {
            if (quittingMethod !== "target-date") {
                moneySaved = cigsReduced * pricePerCigs * 7
            } else {
                const startCigs = planLog[0].cigs
                const endCigs = planLog[6].cigs
                const avgCigsQuitPerDay = (startCigs - endCigs) / 7
                moneySaved = Math.round(avgCigsQuitPerDay * pricePerCigs * 7)
            }
        } else if (type === "month") {
            if (quittingMethod !== "target-date") {
                moneySaved = cigsReduced * pricePerCigs * 30
            } else {
                const startCigs = planLog[0].cigs
                const endCigs = planLog[6].cigs
                const avgCigsQuitPerDay = (startCigs - endCigs) / 7
                moneySaved = Math.round(avgCigsQuitPerDay * pricePerCigs * 30)
            }
        } else if (type === "year") {
            if (quittingMethod !== "target-date") {
                moneySaved = cigsReduced * pricePerCigs * 365 * numberOfYears
            } else {
                const startCigs = planLog[0].cigs
                const endCigs = planLog[6].cigs
                const avgCigsQuitPerDay = (startCigs - endCigs) / 7
                moneySaved = Math.round(avgCigsQuitPerDay * pricePerCigs * 365 * numberOfYears)
            }
        }
        return moneySaved.toLocaleString('vi-VN')
    }

    const calculateDateGoal = (amount) => {
        const pricePerCigs = pricePerPack / cigsPerPack;
        let daysUntilGoal = 0;
        if (quittingMethod !== "target-date") {
            daysUntilGoal = Math.round(amount / (cigsReduced * pricePerCigs))
        } else {
            const startCigs = planLog[0].cigs
            const endCigs = planLog[6].cigs
            const avgCigsQuitPerDay = (startCigs - endCigs) / 7
            daysUntilGoal = Math.round(amount / (avgCigsQuitPerDay * pricePerCigs))
        }
        return daysUntilGoal.toLocaleString('vi-VN')
    }

    const readiness = readinessRadioOptions.find(option => option.value === readinessValue);

    return (
        <>
            <h2 className='text-left md:text-4xl lg:text-5xl font-bold'>
                7. Tổng kết thông tin của bạn
            </h2>

            <div className='w-full lg:w-[80%] flex flex-col gap-5'>
                {!user &&
                    <div
                        className="w-full bg-[#fff7e5] p-5 flex flex-col gap-5 max-h-[1500px] border border-primary-600 rounded-[8px]">
                        <p className='text-left md:text-2xl lg:text-3xl font-bold'>
                            Gia nhập QuitEz để lưu thông tin kế hoạch của bạn
                        </p>
                        <p className='text-sm md:text-base'>
                            Đăng ký để lưu kế hoạch của bạn và theo dõi tiến trình cai thuốc. Nếu bạn đã có tài khoản?
                            Hãy đăng nhập.
                        </p>
                        <CustomButton onClick={() => loginWithRedirect()}>Tham gia</CustomButton>
                    </div>
                }
                <div
                    className="w-full p-5 flex flex-col gap-5 max-h-[500px] border border-primary-600 rounded-[8px]">
                    <p className='text-left md:text-3xl lg:text-4xl font-bold'>
                        1. Mức độ sẵn sàng cai thuốc của bạn
                    </p>

                    <p className='text-sm md:text-base'>
                        {readiness.label}
                    </p>
                    <CustomButton type='primary' onClick={() => setCurrentStep(0)}>Thay đổi</CustomButton>
                </div>
                <div
                    className="w-full p-5 flex flex-col gap-5 max-h-[1500px] border border-primary-600 rounded-[8px]">
                    <p className='text-left md:text-3xl lg:text-4xl font-bold'>
                        2. Động lực của bạn
                    </p>

                    <p className='md:text-lg lg:text-xl font-bold'>
                        Những động lực lớn nhất của bạn
                    </p>

                    <ul>
                        {reasonList.map((item, index) => {
                            const reason = (reasonListOptions.find(option => option.value === item));
                            return <li key={index} className='text-sm md:text-base'>
                                {reason.label}
                            </li>
                        })}
                    </ul>
                    <CustomButton type='primary' onClick={() => setCurrentStep(1)}>Thay đổi</CustomButton>
                </div>
                <div
                    className="w-full p-5 flex flex-col gap-5 max-h-[1500px] border border-primary-600 rounded-[8px]">
                    <p className='text-left md:text-3xl lg:text-4xl font-bold'>
                        3. Thói quen hút thuốc của bạn
                    </p>

                    <p className='md:text-lg lg:text-xl font-bold'>
                        Bạn thường hút thuốc bao lâu sau khi thức dậy?
                    </p>
                    <p className='text-sm md:text-base'>
                        {timeAfterWakingRadioOptions.find((option) => option.value === timeAfterWaking).label}
                    </p>
                    <p className='md:text-lg lg:text-xl font-bold'>
                        Bạn thường hút thuốc vào thời điểm nào trong ngày?
                    </p>
                    <ul>
                        {timeOfDayList.map((item, index) => {
                            const time = (timeOfDayOptions.find(option => option.value === item));
                            return <li key={index} className='text-sm md:text-base'>
                                {item !== 'other' ? `${time.label}` : `${customTimeOfDay}`}
                            </li>
                        })}
                    </ul>
                    <p className='md:text-lg lg:text-xl font-bold'>
                        Điều gì khiến bạn muốn hút thuốc?
                    </p>
                    <ul>
                        {triggers.map((item, index) => {
                            const trigger = (smokingTriggerOptions.find(option => option.value === item));
                            return <li key={index} className='text-sm md:text-base'>
                                {item !== 'other' ? `${trigger.label}` : `${customTrigger}`}
                            </li>
                        })}
                    </ul>
                    <CustomButton type='primary' onClick={() => setCurrentStep(3)}>Thay đổi</CustomButton>
                </div>
                <div
                    className="w-full p-5 flex flex-col gap-5 max-h-[1500px] border border-primary-600 rounded-[8px]">
                    <p className='text-left md:text-3xl lg:text-4xl font-bold'>
                        4.{readinessValue === 'ready' ? ' Thông tin kế hoạch' : ' Tình hình hiện tại'}
                    </p>
                    <p className='md:text-lg lg:text-xl font-bold'>
                        Thông tin thuốc
                    </p>

                    <p className='text-sm md:text-base'>
                        Số điếu trong một gói: {cigsPerPack} <br/>
                        Giá tiền của một gói: {pricePerPack.toLocaleString('vi-VN')} VNĐ <br/>
                        {readinessValue === 'ready' ? `Số điếu bạn thường hút trong một ngày: ${cigsPerDay}` : `Số điếu bạn đã từng hút trong một ngày: ${cigsPerDay}`}
                    </p>
                    <CustomButton type='primary' onClick={() => setCurrentStep(2)}>Thay đổi</CustomButton>


                    {readinessValue === 'relapse-support' && (
                        <>
                            <Divider/>
                            <p className='md:text-lg lg:text-xl font-bold'>
                                Thống kê kết quả
                            </p>
                            <p className='text-sm md:text-base'>
                                Kể từ khi bạn bỏ thuốc từ
                                ngày <strong>{convertYYYYMMDDStrToDDMMYYYYStr(stoppedDate.split('T')[0])}</strong>, bạn
                                đã: <br/>
                                Bỏ thuốc
                                được <strong>{Math.floor((getCurrentUTCMidnightDate() - new Date(stoppedDate)) / (1000 * 60 * 60 * 24))}</strong> ngày <br/>
                                Bỏ được <strong>
                                {Math.floor((getCurrentUTCMidnightDate() - new Date(stoppedDate)) / (1000 * 60 * 60 * 24)) * cigsPerDay}
                            </strong> điếu thuốc <br/>
                                Tiết kiệm
                                được <strong>{(Math.floor((getCurrentUTCMidnightDate() - new Date(stoppedDate)) / (1000 * 60 * 60 * 24)) * cigsPerDay * (pricePerPack / cigsPerPack)).toLocaleString("vi-VN")} VNĐ</strong>
                                <br/>
                                <em>Hãy giữ vững tinh thần nhé!</em>

                            </p>
                        </>
                    )}

                    {readinessValue === 'ready' &&
                        <>
                            <Divider/>
                            <p className='md:text-lg lg:text-xl font-bold'>
                                Kế hoạch
                            </p>

                            <p className='text-sm md:text-base'>
                                Ngày bắt đầu: {convertYYYYMMDDStrToDDMMYYYYStr(startDate.split('T')[0])} <br/>
                                Số điếu hút mỗi ngày: {cigsPerDay} <br/>
                                Phương
                                pháp: {quittingMethodOptions.find(option => option.value === quittingMethod).label}
                                <br/>
                                {quittingMethod === 'gradual-daily' && (
                                    <>
                                        Số điếu giảm mỗi ngày: {cigsReduced}
                                        <br/>
                                    </>
                                )}

                                {quittingMethod === 'gradual-weekly' && (
                                    <>
                                        Số điếu giảm mỗi tuần: {cigsReduced}
                                        <br/>
                                    </>
                                )}
                                Ngày dự kiến bỏ thuốc: {convertYYYYMMDDStrToDDMMYYYYStr(expectedQuitDate.split('T')[0])}
                                <br/>
                                Biểu đồ theo dõi
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={planLogCloneDDMMYY} margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 25,
                                    }}>
                                        <Line type="monotone" dataKey="cigs" stroke="#14b8a6"/>
                                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                                        <XAxis dataKey="date" tick={<CustomizedAxisTick/>} interval={0}/>
                                        <YAxis/>
                                        <Tooltip/>
                                    </LineChart>
                                </ResponsiveContainer>
                                <CustomButton type='primary' onClick={() => setCurrentStep(4)}>Thay đổi</CustomButton>
                            </p>

                            <Divider/>

                            <p className='md:text-lg lg:text-xl font-bold'>
                                Số tiền bạn sẽ tiết kiệm được
                            </p>

                            <div className='grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 items-center'>
                                <p className='text-2xl font-bold'>{calculatePrice('week')} VNĐ</p>
                                <span>một tuần</span>

                                <p className='text-2xl font-bold'>{calculatePrice('month')} VNĐ</p>
                                <span>một tháng</span>

                                <p className='text-2xl font-bold'>{calculatePrice('year')} VNĐ</p>
                                <span>một năm</span>

                                <p className='text-2xl font-bold'>{calculatePrice('year', 5)} VNĐ</p>
                                <span>năm năm</span>

                                <p className='text-2xl font-bold'>{calculatePrice('year', 10)} VNĐ</p>
                                <span>mười năm</span>
                            </div>
                        </>
                    }

                </div>

                {(createGoalChecked && goalList) &&
                    <>
                        <div
                            className="w-full p-5 flex flex-col gap-5 max-h-[1500px] border border-primary-600 rounded-[8px]">
                            <p className='text-left md:text-3xl lg:text-4xl font-bold'>
                                5. Những mục tiêu ngắn hạn
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {goalList?.map((item, index) => (
                                    <div key={index}>
                                        <strong>{index + 1}.</strong> <br/>
                                        <p className='text-sm md:text-base'>Tên mục tiêu: {item.goalName}</p>
                                        <p className='text-sm md:text-base'>Số tiền cần tiết
                                            kiệm: {item.goalAmount.toLocaleString('vi-VN')}</p>
                                        <p className='text-sm md:text-base font-bold'>Nếu cứ duy trì kế hoạch, bạn sẽ
                                            đạt được mục tiêu sau: {calculateDateGoal(item.goalAmount)} ngày</p>
                                    </div>
                                ))}
                            </div>
                            <CustomButton type='primary' onClick={() => setCurrentStep(5)}>Thay đổi</CustomButton>
                        </div>
                    </>}
            </div>
        </>
    );
};

export default Summary;