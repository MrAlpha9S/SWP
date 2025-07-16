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

import { Select, Skeleton} from "antd";
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
import {getUserCreationDate} from "../../utils/userUtils.js";
import {addFinancialAchievement, getAchieved} from "../../utils/achievementsUtils.js";

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
                           setCurrentStepDashboard = null,
                           setMoneySaved = null,
                           userInfo,
                           from = null
                       }) => {
    const navigate = useNavigate();
    const {handleStepThree} = useStepCheckInStore();
    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();
    const [currentDate, setCurrentDate] = useState(getCurrentUTCDateTime());
    const [localCheckInDataSet, setLocalCheckInDataSet] = useState([]);
    const [localUserCreationDate, setLocalUserCreationDate] = useState(null);
    const [localAchieved, setLocalAchieved] = useState([])
    const [showWarning, setShowWarning] = useState(false);
    const [range, setRange] = useState('overview');

    // Use different query keys based on context (coach vs user)
    const datasetQueryKey = from === 'coach-user'
        ? ['dataset-coach', userInfo?.auth0_id]
        : ['dataset', userInfo?.auth0_id];

    const {
        isPending: isDatasetPending,
        error: datasetError,
        data: checkInDataset,
        isFetching: isDatasetFetching,
    } = useQuery({
        queryKey: datasetQueryKey,
        queryFn: async () => {
            return await getCheckInDataSet(user, getAccessTokenSilently, isAuthenticated, userInfo?.auth0_id);
        },
        enabled: isAuthenticated && !!user && !!userInfo?.auth0_id,
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    const {isPending: isAchievedPending, data: achieved} = useQuery({
        queryKey: ['achieved'],
        queryFn: async () => {
            return await getAchieved(user, getAccessTokenSilently, isAuthenticated)
        },
        enabled: !!isAuthenticated && !!user,
    })

    // Use different query keys based on context (coach vs user)
    const userCreationDateQueryKey = from === 'coach-user'
        ? ['user-creation-date-coach', userInfo?.auth0_id]
        : ['user-creation-date', userInfo?.auth0_id];

    const {
        isPending: isUserCreationDatePending,
        data: userCreationDate,
    } = useQuery({
        queryKey: userCreationDateQueryKey,
        queryFn: async () => {
            if (!isAuthenticated || !user) return null;
            return await getUserCreationDate(user, getAccessTokenSilently, isAuthenticated, userInfo?.auth0_id);
        },
        enabled: isAuthenticated && !!user && !!userInfo?.auth0_id,
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    useEffect(() => {
        if (!isAchievedPending && achieved && achieved.success) {
            console.log(achieved.data)
            setLocalAchieved(achieved?.data)
        }
    }, [isAchievedPending])

    useEffect(() => {
        if (userCreationDate?.data) {
            setLocalUserCreationDate(userCreationDate.data);
        }
    }, [userCreationDate?.data]);

    useEffect(() => {
        if (checkInDataset?.data) {
            setLocalCheckInDataSet(checkInDataset.data);
            useCheckInDataStore.getState().setCheckInDataSet(checkInDataset.data);
        }
    }, [checkInDataset?.data]);

    useEffect(() => {
        if (localCheckInDataSet && localCheckInDataSet.length > 0 && planLog && planLog.length > 0) {
            const lastCheckInEntry = localCheckInDataSet[localCheckInDataSet.length - 1];
            const lastPlanEntry = planLog[planLog.length - 1];
            const lastDateInPlan = new Date(lastPlanEntry.date);

            if (lastCheckInEntry.cigs > 0 && lastDateInPlan < getCurrentUTCDateTime()) {
                setShowWarning(true);
            }
        }
    }, [localCheckInDataSet, planLog]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(getCurrentUTCDateTime());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const formatDateDifference = useCallback((ms) => {
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
    }, []);

    const timeDifference = useMemo(() => {
        let differenceInMs;

        if (readinessValue === 'ready') {
            differenceInMs = differenceInMilliseconds(currentDate, new Date(startDate));
        } else {
            differenceInMs = differenceInMilliseconds(currentDate, new Date(stoppedDate));
        }

        return formatDateDifference(differenceInMs);
    }, [currentDate, startDate, stoppedDate, readinessValue, formatDateDifference]);

    const pricePerCig = useMemo(() => {
        return Math.round(pricePerPack / cigsPerPack);
    }, [pricePerPack, cigsPerPack]);

    const totalDaysPhrase = useMemo(() => {
        const localStartDate = new Date(startDate);

        if (from === 'coach-user') {
            if (readinessValue === 'relapse-support') {
                return (
                    <>
                        Người dùng đã cai thuốc thành công <br/>
                        Tổng thời gian kể từ khi họ cai thuốc
                    </>
                );
            } else if (currentDate > new Date(expectedQuitDate)) {
                return (
                    <>
                        Người dùng đã hoàn thành kế hoạch cai thuốc <br/>
                        Tổng thời gian kể từ khi bắt đầu hành trình
                    </>
                );
            } else if (localStartDate > currentDate) {
                return 'Thời gian còn lại đến khi bắt đầu hành trình cai thuốc';
            } else if (currentDate < new Date(expectedQuitDate)) {
                return 'Tổng thời gian kể từ khi người dùng bắt đầu hành trình cai thuốc';
            }
            return 'Tổng thời gian kể từ khi người dùng bắt đầu hành trình cai thuốc';
        }

        // Default (user perspective)
        if (readinessValue === 'relapse-support') {
            return (
                <>
                    Chúc mừng bạn đã cai thuốc <br/>
                    Tổng thời gian kể từ khi bạn cai thuốc
                </>
            );
        } else if (currentDate > new Date(expectedQuitDate)) {
            return (
                <>
                    Chúc mừng bạn đã hoàn thành kế hoạch cai thuốc <br/>
                    Tổng thời gian kể từ khi bạn bắt đầu hành trình cai thuốc
                </>
            );
        } else if (localStartDate > currentDate) {
            return 'Thời gian cho đến khi bắt đầu hành trình cai thuốc';
        } else if (currentDate < new Date(expectedQuitDate)) {
            return 'Tổng thời gian kể từ khi bạn bắt đầu hành trình cai thuốc';
        }
        return 'Tổng thời gian kể từ khi bạn bắt đầu hành trình cai thuốc';
    }, [readinessValue, currentDate, expectedQuitDate, startDate, from]);


    // Check if all required data is available for calculation
    const isDataReady = useMemo(() => {
        // console.log('Data ready check:', {
        //     localUserCreationDate,
        //     currentDate: !!currentDate,
        //     localCheckInDataSet: Array.isArray(localCheckInDataSet),
        //     cigsPerDay,
        //     readinessValue,
        //     stoppedDate,
        //     isUserCreationDatePending,
        //     isDatasetPending,
        //     isAuthenticated,
        //     userInfo: !!userInfo?.auth0_id
        // });

        return !!(
            localUserCreationDate &&
            currentDate &&
            Array.isArray(localCheckInDataSet) &&
            cigsPerDay &&
            (readinessValue !== 'relapse-support' || stoppedDate) &&
            !isUserCreationDatePending &&
            !isDatasetPending &&
            isAuthenticated &&
            userInfo?.auth0_id
        );
    }, [
        localUserCreationDate,
        currentDate,
        localCheckInDataSet,
        cigsPerDay,
        readinessValue,
        stoppedDate,
        isUserCreationDatePending,
        isDatasetPending,
        isAuthenticated,
        userInfo?.auth0_id
    ]);

    const cigsQuit = useMemo(() => {
        // Return null instead of 0 when data isn't ready
        if (!isDataReady) {
            //console.log('cigsQuit: Data not ready, returning null');
            return null;
        }

        //console.log('cigsQuit: Calculating with data ready');
        const startDay = new Date(readinessValue === 'relapse-support' ? stoppedDate : localUserCreationDate);
        const endDate = new Date(currentDate);
        let total = 0;

        const iterationDate = new Date(startDay);

        while (iterationDate <= endDate) {
            const dateStr = iterationDate.toISOString().split('T')[0];

            const checkin = localCheckInDataSet.find(entry =>
                new Date(entry.date).toISOString().split('T')[0] === dateStr
            );

            if (checkin) {
                total += cigsPerDay - (checkin?.cigs || 0);
            }
            if (readinessValue === 'relapse-support') {
                total += cigsPerDay;
            }

            iterationDate.setUTCDate(iterationDate.getUTCDate() + 1);
        }

        const result = Math.max(0, total);
        //console.log('cigsQuit calculated:', result);
        return result;
    }, [isDataReady, localUserCreationDate, currentDate, localCheckInDataSet, cigsPerDay, readinessValue, stoppedDate]);

    const moneySaved = useMemo(() => {
        // Return null instead of 0 when cigsQuit isn't calculated yet
        if (cigsQuit === null || !pricePerCig) {
            //console.log('moneySaved: Not ready, returning null');
            return null;
        }
        const result = Math.round(cigsQuit * pricePerCig);
        return result;
    }, [cigsQuit, pricePerCig]);

    useEffect(() => {
        if (moneySaved === null || moneySaved === undefined) return;

        const timeoutId = setTimeout(async () => {
            try {
                const token = await getAccessTokenSilently();

                const response = await fetch('http://localhost:3000/achievements/update-money-saved', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        userAuth0Id: user.sub,
                        moneySaved: moneySaved
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.newAchievements && result.newAchievements.length > 0) {
                        console.log(`🎉 New achievements unlocked:`, result.newAchievements);
                    }
                }
            } catch (error) {
                console.error('Error updating money saved:', error);
            }
        }, 2000); // Increased debounce time

        return () => clearTimeout(timeoutId);
    }, [moneySaved, user, getAccessTokenSilently, isAuthenticated]);

    useEffect(() => {
        if (typeof setMoneySaved === 'function' && typeof moneySaved === 'number') {
            setMoneySaved(moneySaved);
        }
    }, [moneySaved, setMoneySaved]);

    const mergedDataSet = useMemo(() => {
        if (isDatasetPending) return [];
        if (!planLog || !localCheckInDataSet || userInfo?.sub_id === 1) return [];
        return clonePlanLogToDDMMYYYY(mergeByDate(planLog, localCheckInDataSet, quittingMethod, cigsPerDay, userInfo?.created_at, range));
    }, [planLog, localCheckInDataSet, quittingMethod, isDatasetPending, range]);

    const getReferenceArea = useCallback(() => {
        if (!mergedDataSet || mergedDataSet.length === 0) return null;

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
        return null;
    }, [cigsPerDay, currentDate, mergedDataSet]);

    const handleCheckIn = useCallback(() => {
        if (setCurrentStepDashboard) {
            setCurrentStepDashboard('check-in');
            handleStepThree();
        }
    }, [setCurrentStepDashboard, handleStepThree]);

    // Show loading state for calculations
    const isCalculating = isPending || isDatasetPending || isUserCreationDatePending || !isDataReady || cigsQuit === null || moneySaved === null;

    const handleSelectChange = (e) => {
        setRange(e);
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            return (
                <div className="bg-white border rounded shadow p-2 text-sm">
                    <div className="font-semibold">{label}</div>
                    <div>
                        <div className={`${data.checkinMissed ? 'text-red-500' : 'text-green-600'}`}>{data.checkinMissed ? 'Chưa check-in (ước lượng)' : 'Đã check-in'}</div>
                        <div>Đã hút: {data.actual}</div>
                        {data.plan != null && <div>Kế hoạch: {data.plan}</div>}
                    </div>

                </div>
            );
        }
        return null;
    };

    return (
        <div className='bg-white p-1 md:p-6 rounded-xl shadow-xl w-full max-w-4/5 space-y-4'>
            {!from && <div className="flex items-center justify-between">
                {isPending ? (
                    <Skeleton.Button active/>
                ) : (
                    <CustomButton onClick={handleCheckIn}>Check-in hàng ngày →</CustomButton>
                )}
                {isPending ? (
                    <Skeleton.Input style={{width: 180}} active size="small"/>
                ) : (
                    <a href="#" className="text-sm text-primary-700 hover:underline">
                        What's a check-in and why are they important?
                    </a>
                )}
            </div>}

            <div className="bg-primary-100 rounded-lg p-6 text-center">
                <h2 className="text-gray-600 text-sm font-medium">
                    {totalDaysPhrase}
                </h2>
                <div className="flex justify-center items-baseline space-x-2 mt-2">
                    {isPending ? (
                        <Skeleton.Input style={{width: 250}} active/>
                    ) : (
                        <>
                            <span className="text-4xl font-bold text-primary-800">{timeDifference.days}</span>
                            <span className="text-sm text-gray-500">ngày</span>
                            <span className="text-4xl font-bold text-primary-800">{timeDifference.hours}</span>
                            <span className="text-sm text-gray-500">giờ</span>
                            <span className="text-4xl font-bold text-primary-800">{timeDifference.minutes}</span>
                            <span className="text-sm text-gray-500">phút</span>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="bg-primary-100 p-4 rounded-lg flex flex-col items-center">
                        {isCalculating ? (
                            <Skeleton active paragraph={{ rows: 2 }} />
                        ) : (
                            <>
                                <div className="text-2xl">
                                    {
                                        [
                                            <PiPiggyBankLight className="size-10 text-primary-800" />,
                                            <IoLogoNoSmoking className="size-10 text-primary-800" />,
                                            <FaTrophy className="size-9 text-primary-800" />
                                        ][i]
                                    }
                                </div>
                                <div className="text-xl font-semibold text-primary-800">
                                    {i === 0
                                        ? moneySaved !== null ? `${moneySaved} VNĐ` : 'Đang tính...'
                                        : i === 1
                                            ? cigsQuit !== null ? cigsQuit : 'Đang tính...'
                                            : localAchieved?.length ?? 'Đang tính...'}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {from === 'coach-user'
                                        ? ['Số tiền người dùng tiết kiệm', 'Số điếu đã bỏ', 'Huy hiệu đạt được'][i]
                                        : ['Số tiền đã tiết kiệm', 'Số điếu đã bỏ', 'Huy hiệu đạt được'][i]}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-primary-100 p-4 rounded-lg flex flex-col text-center relative">
                {!from && <div className="absolute right-3 top-3">
                    {!isPending && (
                        <a onClick={() => navigate('/onboarding/progress-board-startdate')}
                           className="text-sm text-primary-700 hover:underline">
                            Chỉnh sửa?
                        </a>
                    )}
                </div>}
                <div className="text-2xl flex justify-center"><FaRegCalendarCheck
                    className='size-9 text-primary-800 mb-1'/></div>
                <h3 className="text-lg font-semibold text-primary-800">
                    {from === 'coach-user'
                        ? (readinessValue === 'ready' ? 'Ngày người dùng bắt đầu cai thuốc' : 'Ngày người dùng đã bỏ thuốc')
                        : (readinessValue === 'ready' ? 'Ngày tôi bắt đầu bỏ thuốc' : 'Ngày tôi đã bỏ thuốc')}
                </h3>

                <div className="text-sm text-gray-600">
                    {isPending ?
                        <Skeleton.Input style={{width: 160}} active/> :
                        readinessValue === 'ready' ?
                            `${new Date(startDate).toLocaleDateString('vi-VN')} ${userInfo?.sub_id === 1 || (!expectedQuitDate && expectedQuitDate.length === 0) ? '' : `- ${new Date(expectedQuitDate).toLocaleDateString('vi-VN')}`}` :
                            new Date(stoppedDate).toLocaleDateString('vi-VN')
                    }
                </div>
            </div>

            {readinessValue === 'ready' && userInfo?.sub_id !== 1 && (
                <div className="bg-primary-100 p-4 rounded-lg flex flex-col items-center text-center relative">
                    {!from && <div className="absolute right-3 top-3">
                        {!isPending && (
                            <a onClick={() => navigate('/onboarding/progress-board-plan')}
                               className="text-sm text-primary-700 hover:underline">
                                Chỉnh sửa?
                            </a>
                        )}
                    </div>}
                    <div className="text-2xl flex justify-center"><BsGraphDown
                        className='size-7 text-primary-800 mb-1'/></div>
                    <h3 className="text-lg font-semibold text-primary-800">
                        {from === 'coach-user'
                            ? 'Số điếu thuốc theo kế hoạch và thực tế của người dùng'
                            : 'Số điếu thuốc theo kế hoạch và thực tế'}
                    </h3>
                    <Select
                        defaultValue="overview"
                        variant="borderless"
                        style={{ width: 120 }}
                        onChange={handleSelectChange}
                        options={[
                            { value: 'plan', label: 'Kế hoạch' },
                            { value: 'overview', label: 'Tổng quan' },
                        ]}
                    />

                    {readinessValue === 'ready' && userInfo?.sub_id !== 1 && (!planLog || planLog.length === 0) &&
                        <div className='flex flex-col items-center justify-center'>
                            <p>
                                {from === 'coach-user'
                                    ? 'Người dùng chưa tạo kế hoạch cai thuốc.'
                                    : 'Bạn chưa tạo kế hoạch'}
                            </p>
                            {from !== 'coach-user' && (
                                <CustomButton onClick={() => navigate('/onboarding/progress-board-plan')}>
                                    Tạo ngay
                                </CustomButton>
                            )}
                        </div>

                    }
                    {showWarning &&
                        <p><p>
                            {from === 'coach-user'
                                ? 'Người dùng dường như vẫn hút thuốc sau khi kết thúc kế hoạch. Bạn có thể đề xuất họ bắt đầu lại.'
                                : 'Có vẻ bạn vẫn đang hút thuốc sau khi kết thúc kế hoạch. Đừng lo — bạn luôn có thể bắt đầu lại!'}
                        </p>
                        </p>}
                    {isPending ? (
                        <Skeleton.Input style={{ width: '100%', height: 300 }} active />
                    ) : mergedDataSet?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart
                                data={mergedDataSet}
                                margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                            >
                                <Line
                                    type="monotone"
                                    dataKey="actual"
                                    stroke="#ef4444"
                                    dot={{ r: 3 }}
                                    name="Đã hút"
                                    connectNulls={true}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="plan"
                                    stroke="#14b8a6"
                                    strokeDasharray="5 5"
                                    dot={false}
                                    name="Kế hoạch"
                                    connectNulls={true}
                                />
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                {quittingMethod === 'gradual-weekly' && getReferenceArea()}
                                <ReferenceLine
                                    x={
                                        currentDate < new Date(expectedQuitDate)
                                            ? convertYYYYMMDDStrToDDMMYYYYStr(currentDate.toISOString().split('T')[0])
                                            : ''
                                    }
                                    stroke="#115e59"
                                    label="Hôm nay"
                                />
                                <XAxis dataKey="date" tick={<CustomizedAxisTick />} interval={1} />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="top" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center text-gray-500">Không có dữ liệu để hiển thị.</div>
                    )}

                </div>
            )}

            {!from && <div className="text-center">
                {isPending ? (
                    <Skeleton.Input style={{width: 160}} active/>
                ) : (
                    <a href="#" className="text-sm text-primary-700 hover:underline">
                        🔗 Chia sẻ tiến trình
                    </a>
                )}
            </div>}
        </div>
    );
};

export default ProgressBoard;