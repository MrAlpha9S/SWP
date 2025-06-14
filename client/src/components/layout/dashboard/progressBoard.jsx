import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
    ReferenceLine, Legend, ReferenceArea
} from "recharts";
import {CustomizedAxisTick} from "../../utils/customizedAxisTick.jsx";

import {Skeleton} from "antd";
import {PiPiggyBankLight} from "react-icons/pi";
import {IoLogoNoSmoking} from "react-icons/io";
import {FaRegCalendarCheck, FaTrophy} from "react-icons/fa";
import {BsGraphDown} from "react-icons/bs";
import {getCheckInDataSet, mergeByDate} from "../../utils/checkInUtils.js";
import {useCheckInDataStore, useStepCheckInStore} from "../../../stores/checkInStore.js";
import {
    clonePlanLogToDDMMYYYY,
    convertYYYYMMDDStrToDDMMYYYYStr, getCurrentUTCDateTime,
} from "../../utils/dateUtils.js";
import {useQuery} from "@tanstack/react-query";
import {useAuth0} from "@auth0/auth0-react";

const ProgressBoard = ({
                           startDate,
                           planLog,
                           expectedQuitDate,
                           stoppedDate,
                           cigsPerDay,
                           quittingMethod,
                           isPending,
                           pricePerPack,
                           cigsPerPack,
                           readinessValue,
                           planLogCloneDDMMYY,
                           setCurrentStepDashboard,
                       }) => {
    const navigate = useNavigate();
    const {handleStepThree} = useStepCheckInStore();
    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();
    const [currentDate, setCurrentDate] = useState(getCurrentUTCDateTime());
    const [localCheckInDataSet, setLocalCheckInDataSet] = useState([]);


    const {
        isPending: isDatasetPending,
        error: datasetError,
        data: checkInDataset,
        isFetching: isDatasetFetching,
    } = useQuery({
        queryKey: ['dataset'],
        queryFn: async () => {
            return await getCheckInDataSet(user, getAccessTokenSilently, isAuthenticated);
        },
        enabled: isAuthenticated && !!user,
    })

    useEffect(() => {
        if (!isDatasetPending && checkInDataset?.data) {
            setLocalCheckInDataSet(checkInDataset.data);
        }
    }, [checkInDataset, isDatasetPending]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCurrentDate(getCurrentUTCDateTime());
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
        differenceInMs = differenceInMilliseconds(currentDate, new Date(startDate));
        difference = formatDateDifference(differenceInMs);
    } else {
        differenceInMs = differenceInMilliseconds(currentDate, new Date(stoppedDate));
        difference = formatDateDifference(differenceInMs);
    }

    const pricePerCig = Math.round(pricePerPack / cigsPerPack);


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

    const cigsQuit = useMemo(() => {
        const currentDay = new Date(localStartDate);
        const endDate = new Date(currentDate);
        let total = 0;

        while (currentDay <= endDate) {
            const dateStr = currentDay.toISOString().split('T')[0];

            // Match check-in by date
            const checkin = localCheckInDataSet.find(entry =>
                new Date(entry.date).toISOString().split('T')[0] === dateStr
            );

            if (checkin) {
                total += cigsPerDay - checkin?.cigs;
            }

            currentDay.setDate(currentDay.getUTCDate() + 1);
        }

        return total;
    }, [localStartDate, currentDate, localCheckInDataSet, cigsPerDay]);


    const moneySaved = Math.round(cigsQuit * pricePerCig);

    const mergedDataSet = useMemo(() => {
        if (isDatasetPending) return
        if (!planLog || !localCheckInDataSet) return [];
        return clonePlanLogToDDMMYYYY(mergeByDate(planLog, localCheckInDataSet, quittingMethod));
    }, [planLog, localCheckInDataSet, quittingMethod]);

    const getReferenceArea = useCallback(() => {
        const arrayOfArrays = [];
        const size = 7;

        for (let i = 0; i < mergedDataSet.length - (size - 1); i += 6) {
            arrayOfArrays.push(mergedDataSet.slice(i, i + size));
        }

        for (let i = 0; i < arrayOfArrays.length; i++) {
            const found = arrayOfArrays[i].some(
                data => data.date === convertYYYYMMDDStrToDDMMYYYYStr(currentDate.toISOString().split('T')[0])
            );

            if (found) {
                const targetArray = arrayOfArrays[i];
                const x1 = targetArray[0].date;
                const x2 = targetArray[targetArray.length - 1].date;
                const y1 = 0;

                return (
                    <ReferenceArea
                        x1={x1}
                        x2={x2}
                        y1={y1}
                        y2={cigsPerDay + 1}
                        stroke="green"
                        strokeOpacity={0.3}
                    />
                );
            }
        }
    }, [cigsPerDay, currentDate, mergedDataSet, localCheckInDataSet]);

    const handleCheckIn = () => {
        setCurrentStepDashboard('check-in');
        handleStepThree()
    }

    return (
        <div className='bg-white p-1 md:p-6 rounded-xl shadow-xl w-full max-w-4/5 space-y-4'>
            <div className="flex items-center justify-between">
                {isPending ? (
                    <Skeleton.Button active/>
                ) : (
                    <CustomButton onClick={() => handleCheckIn()}>Check-in hàng ngày →</CustomButton>
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
                    <div key={i} className="bg-primary-100 p-4 rounded-lg flex flex-col items-center">
                        {isPending ? (
                            <Skeleton active paragraph={{rows: 2}}/>
                        ) : (
                            <>
                                <div className="text-2xl">{[<PiPiggyBankLight className='size-10 text-primary-800'/>,
                                    <IoLogoNoSmoking className='size-10 text-primary-800'/>,
                                    <FaTrophy className='size-9 text-primary-800'/>][i]}</div>
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
                <div className="text-2xl flex justify-center"><FaRegCalendarCheck
                    className='size-9 text-primary-800 mb-1'/></div>
                <h3 className="text-lg font-semibold text-primary-800">{readinessValue === 'ready' ? 'Ngày tôi bắt đầu bỏ thuốc' : 'Ngày tôi đã bỏ thuốc'}</h3>
                <p className="text-sm text-gray-600">
                    {isPending ?
                        <Skeleton.Input style={{width: 160}}
                                        active/> : readinessValue === 'ready' ? `${localStartDate.toLocaleDateString('vi-VN')} - ${new Date(expectedQuitDate).toLocaleDateString('vi-VN')}` : stoppedDate}
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
                    <div className="text-2xl flex justify-center"><BsGraphDown
                        className='size-7 text-primary-800 mb-1'/></div>
                    <h3 className="text-lg font-semibold text-primary-800">Số điếu thuốc theo kế hoạch và thực tế</h3>

                    {isPending ? (
                        <Skeleton.Input style={{width: '100%', height: 300}} active/>
                    ) : mergedDataSet?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            {localCheckInDataSet.length > 0 ?
                                <LineChart
                                    data={mergedDataSet}
                                    margin={{top: 20, right: 30, left: 20, bottom: 25}}
                                >
                                    {/* Smoked line (actual check-ins) */}
                                    <Line
                                        type="monotone"
                                        dataKey="actual"
                                        stroke="#ef4444"
                                        dot={{r: 3}}
                                        name="Đã hút"
                                    />

                                    {/* Planned line (target plan) */}
                                    <Line
                                        type="monotone"
                                        dataKey="plan"
                                        stroke="#14b8a6"
                                        strokeDasharray="5 5"
                                        dot={false}
                                        name="Kế hoạch"
                                        connectNulls={true}
                                    />

                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                                    {quittingMethod === 'gradual-weekly' && getReferenceArea()}
                                    <ReferenceLine
                                        x={
                                            currentDate < new Date(expectedQuitDate)
                                                ? convertYYYYMMDDStrToDDMMYYYYStr(currentDate.toISOString().split('T')[0])
                                                : ''
                                        }
                                        stroke="#115e59"
                                        label={'Hôm nay'}
                                    />

                                    <XAxis dataKey="date" tick={<CustomizedAxisTick/>}
                                           interval={quittingMethod === 'gradual-weekly' ? 5 : 1}/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend verticalAlign="top"/>
                                </LineChart> :
                                <LineChart data={planLogCloneDDMMYY}
                                           margin={{top: 20, right: 30, left: 20, bottom: 25}}>
                                    <Line type="monotone" dataKey="cigs" stroke="#14b8a6"/>
                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                                    <ReferenceLine
                                        x={
                                            currentDate < new Date(expectedQuitDate)
                                                ? convertYYYYMMDDStrToDDMMYYYYStr(currentDate.toISOString().split('T')[0])
                                                : ''
                                        }
                                        stroke="#115e59"
                                        label="Hôm nay"
                                    />
                                    <XAxis dataKey="date" tick={<CustomizedAxisTick/>} interval={0}/>
                                    <YAxis/>
                                    <Tooltip/>
                                </LineChart>}
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
