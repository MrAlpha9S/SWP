import React, {useEffect, useState} from 'react';
import CustomButton from "../../ui/CustomButton.jsx";
import {useNavigate} from "react-router-dom";
import {differenceInMilliseconds} from "date-fns";
import {
    ResponsiveContainer,
    CartesianGrid,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
    ReferenceLine
} from "recharts";
import {CustomizedAxisTick} from "../../utils/customizedAxisTick.jsx";

import {Skeleton} from "antd";

const ProgressBoard = ({
                           startDate,
                           planLog,
                           expectedQuitDate,
                           stoppedDate,
                           cigsReduced,
                           cigsPerDay,
                           quittingMethod,
                           isPending,
                           pricePerPack,
                           cigsPerPack,
                           readinessValue
                       }) => {
    const navigate = useNavigate();

    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCurrentDate(new Date());
        }, 60000);
        return () => clearTimeout(timeout);
    }, [currentDate]);

    const formatDateDifference = (ms) => {
        const seconds = Math.abs(Math.floor(ms / 1000));
        const minutes = Math.abs(Math.floor(seconds / 60));
        const hours = Math.abs(Math.floor(minutes / 60));
        const days = Math.abs(Math.floor(hours / 24));

        return {
            days: days,
            hours: hours % 24,
            minutes: minutes % 60,
            seconds: seconds % 60
        };
    };

    const localStartDate = new Date(startDate);
    let differenceInMs
    let difference
    if (readinessValue === 'ready') {
        differenceInMs = differenceInMilliseconds(currentDate, localStartDate);
        difference = formatDateDifference(differenceInMs);
    } else {
        differenceInMs = differenceInMilliseconds(currentDate, new Date(stoppedDate));
        console.log(differenceInMs);
        difference = formatDateDifference(differenceInMs);
    }

    const pricePerCig = Math.round(pricePerPack / cigsPerPack);
    const dayDifference = difference.days;


    let totalDaysPhrase = ''

    if (readinessValue === 'relapse-support') {
        totalDaysPhrase = (
            <>
                Chúc mừng bạn đã cai thuốc <br/>
                Tổng thời gian kể từ khi bạn cai thuốc
            </>
        )
    } else if (currentDate > new Date(expectedQuitDate)) {
        totalDaysPhrase = (
            <>
                Chúc mừng bạn đã hoàn thành kế hoạch cai thuốc <br/>
                Tổng thời gian kể từ khi bạn bắt đầu hành trình cai thuốc
            </>
        )
    } else if (localStartDate > currentDate) {
        totalDaysPhrase = 'Thời gian cho đến khi bắt đầu hành trình cai thuốc';
    } else if (currentDate < new Date(expectedQuitDate)) {
        totalDaysPhrase = 'Tổng thời gian kể từ khi bạn bắt đầu hành trình cai thuốc';
    }

    let cigsQuit = 0;
    if (differenceInMs > 0) {
        if (quittingMethod === 'gradual-daily') {
            cigsQuit = cigsReduced * dayDifference;
        } else if (quittingMethod === 'gradual-weekly') {
            cigsQuit = (cigsReduced * dayDifference) / 7;
        } else if (quittingMethod === 'target-date') {
            const todayStr = currentDate.toISOString().split('T')[0];
            const todayEntry = planLog.find((log) => log.date === todayStr);
            if (todayEntry) {
                cigsQuit = cigsPerDay - todayEntry.cigs;
            }
        } else if (readinessValue === 'relapse-support') {
            cigsQuit = cigsPerDay * dayDifference;
        }
    }

    const moneySaved = cigsQuit * pricePerCig;

    return (
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-4/5 space-y-4">
            <div className="flex items-center justify-between">
                {isPending ? (
                    <Skeleton.Button active/>
                ) : (
                    <CustomButton onClick={() => navigate('/dashboard/check-in')}>Check-in hàng ngày →</CustomButton>
                )}
                {isPending ? (
                    <Skeleton.Input style={{width: 180}} active size="small"/>
                ) : (
                    <a href="#" className="text-sm text-primary-700 hover:underline">
                        What's a check-in and why are they important?
                    </a>
                )}
            </div>

            <div className="bg-primary-100 rounded-lg p-6 text-center">
                <h2 className="text-gray-600 text-sm font-medium">
                    {totalDaysPhrase}
                </h2>
                <div className="flex justify-center items-baseline space-x-2 mt-2">
                    {isPending ? (
                        <Skeleton.Input style={{width: 250}} active/>
                    ) : (
                        <>
                            <span className="text-4xl font-bold text-primary-800">{difference.days}</span>
                            <span className="text-sm text-gray-500">ngày</span>
                            <span className="text-4xl font-bold text-primary-800">{difference.hours}</span>
                            <span className="text-sm text-gray-500">giờ</span>
                            <span className="text-4xl font-bold text-primary-800">{difference.minutes}</span>
                            <span className="text-sm text-gray-500">phút</span>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="bg-primary-100 p-4 rounded-lg">
                        {isPending ? (
                            <Skeleton active paragraph={{rows: 2}}/>
                        ) : (
                            <>
                                <div className="text-2xl">{['💰', '🚭', '🏆'][i]}</div>
                                <div className="text-xl font-semibold text-primary-800">
                                    {i === 0 ? moneySaved + ' VNĐ' : i === 1 ? cigsQuit : 1}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {['Số tiền đã tiết kiệm', 'Số điếu đã bỏ', 'Huy hiệu đạt được'][i]}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-primary-100 p-4 rounded-lg flex flex-col text-center relative">
                <div className="absolute right-3 top-3">
                    {!isPending && (
                        <a onClick={() => navigate('/onboarding')} className="text-sm text-primary-700 hover:underline">
                            Chỉnh sửa?
                        </a>
                    )}
                </div>
                <div className="text-2xl">📅</div>
                <h3 className="text-lg font-semibold text-primary-800">{readinessValue === 'ready' ? 'Ngày tôi bắt đầu bỏ thuốc' : 'Ngày tôi đã bỏ thuốc'}</h3>
                <p className="text-sm text-gray-600">
                    {isPending ?
                        <Skeleton.Input style={{width: 160}}
                                        active/> : readinessValue === 'ready' ? localStartDate.toLocaleDateString('vi-VN') : stoppedDate}
                </p>
            </div>
            {readinessValue === 'ready' &&
                <div className="bg-primary-100 p-4 rounded-lg flex flex-col items-center text-center relative">
                    <div className="absolute right-3 top-3">
                        {!isPending && (
                            <a onClick={() => navigate('/onboarding')}
                               className="text-sm text-primary-700 hover:underline">
                                Chỉnh sửa?
                            </a>
                        )}
                    </div>
                    <div className="text-2xl">📉</div>
                    <h3 className="text-lg font-semibold text-primary-800">Biểu đồ kế hoạch số điếu mỗi ngày</h3>

                    {isPending ? (
                        <Skeleton.Input style={{width: '100%', height: 300}} active/>
                    ) : planLog?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={planLog} margin={{top: 20, right: 30, left: 20, bottom: 25}}>
                                <Line type="monotone" dataKey="cigs" stroke="#14b8a6"/>
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                                <ReferenceLine
                                    x={
                                        currentDate < new Date(expectedQuitDate)
                                            ? currentDate.toISOString().split('T')[0]
                                            : ''
                                    }
                                    stroke="#115e59"
                                    label="Hôm nay"
                                />
                                <XAxis dataKey="date" tick={<CustomizedAxisTick/>} interval={0}/>
                                <YAxis/>
                                <Tooltip/>
                            </LineChart>
                        </ResponsiveContainer>
                    ) : null}
                </div>
            }

            <div className="text-center">
                {isPending ? (
                    <Skeleton.Input style={{width: 160}} active/>
                ) : (
                    <a href="#" className="text-sm text-primary-700 hover:underline">
                        🔗 Chia sẻ tiến trình
                    </a>
                )}
            </div>
        </div>

    );
};

export default ProgressBoard;
