import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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

import {Select, Skeleton} from "antd";
import {PiPiggyBankLight} from "react-icons/pi";
import {IoLogoNoSmoking} from "react-icons/io";
import {FaRegCalendarCheck, FaTrophy} from "react-icons/fa";
import {BsGraphDown} from "react-icons/bs";
import {getCheckInDataSet, mergeByDateForPlanLog, mergeByDateForCustomStages} from "../../utils/checkInUtils.js";
import {useCheckInDataStore, useStepCheckInStore} from "../../../stores/checkInStore.js";
import {
    clonePlanLogToDDMMYYYY,
    convertYYYYMMDDStrToDDMMYYYYStr, formatDate, getCurrentUTCDateTime,
} from "../../utils/dateUtils.js";
import {useQuery} from "@tanstack/react-query";
import {useAuth0} from "@auth0/auth0-react";
import {getUserCreationDate} from "../../utils/userUtils.js";
import {addFinancialAchievement, getAchieved} from "../../utils/achievementsUtils.js";
import QuoteCarousel from "../../ui/quotesCarousel.jsx";
import html2canvas from "html2canvas";
import {useEditorContentStore} from "../../../stores/store.js";
import {getBackendUrl} from "../../utils/getBackendURL.js";
import HealthStatistics from "./health-statistics.jsx";
import getDatasetFromCustomPlanWithStages from "../../utils/getDatasetFromCustomPlanWithStages.js";
import ConvertPlanlogDdmmyy from "../../utils/convertPlanlogDDMMYY.js";

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
                           from = null,
                           achievementProgress = null,
                           useCustomPlan,
                           customPlanWithStages
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
    const progressBoardRef = useRef(null);
    const {setTitle, setContent} = useEditorContentStore()
    const [selectedFilter, setSelectedFilter] = useState('overview')

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
        //staleTime: 5 * 60 * 1000, // 5 minutes
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
        //staleTime: 5 * 60 * 1000, // 5 minutes
    })

    useEffect(() => {
        if (!isAchievedPending && achieved && achieved.success) {
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
        if (localCheckInDataSet && localCheckInDataSet.length > 0) {
            if (!useCustomPlan && planLog && planLog.length > 0) {
                const lastCheckInEntry = localCheckInDataSet[localCheckInDataSet.length - 1];
                const lastPlanEntry = planLog[planLog.length - 1];
                const lastDateInPlan = new Date(lastPlanEntry.date);

                if (lastCheckInEntry.cigs > 0 && lastDateInPlan < getCurrentUTCDateTime()) {
                    setShowWarning(true);
                }
            }
        }
    }, [localCheckInDataSet, planLog]);

    useEffect(() => {
        if (localCheckInDataSet && localCheckInDataSet.length > 0) {
            if (useCustomPlan && customPlanWithStages.length > 0) {
                const lastCheckInEntry = localCheckInDataSet[localCheckInDataSet.length - 1];
                const lastLogsOfStage = customPlanWithStages[customPlanWithStages.length - 1].logs
                const lastLogEntry = lastLogsOfStage[lastLogsOfStage.length - 1];
                const lastDateInPlan = new Date(lastLogEntry.date);
                if (lastCheckInEntry.cigs > 0 && lastDateInPlan < getCurrentUTCDateTime()) {
                    setShowWarning(true);
                }
            }
        }
    }, [localCheckInDataSet, customPlanWithStages, useCustomPlan]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(getCurrentUTCDateTime());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const formatDateDifference = useCallback((ms) => {
        return formatDate(ms)
    }, []);

    const timeDifference = useMemo(() => {
        let differenceInMs;

        if (readinessValue === 'ready') {
            console.log('diff cur', currentDate.toISOString());
            console.log('diff sta', startDate);

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
        console.log('start', localStartDate.toISOString());
        console.log('current', currentDate.toISOString());
        const localStartISO = localStartDate.toISOString().slice(0, 10);
        const currentISO = currentDate.toISOString().slice(0, 10);
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
            } else if (localStartISO > currentISO) {
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
            return null;
        }

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
        return result;
    }, [isDataReady, localUserCreationDate, currentDate, localCheckInDataSet, cigsPerDay, readinessValue, stoppedDate]);

    const moneySaved = useMemo(() => {
        // Return null instead of 0 when cigsQuit isn't calculated yet
        if (cigsQuit === null || !pricePerCig) {
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

                const response = await fetch(`${getBackendUrl()}/achievements/update-money-saved`, {
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
        if ((!planLog && !customPlanWithStages) || !localCheckInDataSet) return [];
        if (planLog.length > 0 && !useCustomPlan) return clonePlanLogToDDMMYYYY(mergeByDateForPlanLog(planLog, localCheckInDataSet, cigsPerDay, userInfo?.created_at, range));
        if (customPlanWithStages && customPlanWithStages.length > 0 && useCustomPlan) {
            return clonePlanLogToDDMMYYYY(mergeByDateForCustomStages(getDatasetFromCustomPlanWithStages(customPlanWithStages), localCheckInDataSet, cigsPerDay, userInfo?.created_at, selectedFilter))
        }
    }, [isDatasetPending, planLog, customPlanWithStages, localCheckInDataSet, userInfo?.created_at, cigsPerDay, range, selectedFilter, useCustomPlan]);

    // const getReferenceArea = useCallback(() => {
    //     if (!mergedDataSet || mergedDataSet.length === 0) return null;
    //
    //     const arrayOfArrays = [];
    //     const size = 7;
    //
    //     for (let i = 0; i < mergedDataSet.length - (size - 1); i += 6) {
    //         arrayOfArrays.push(mergedDataSet.slice(i, i + size));
    //     }
    //
    //     for (let i = 0; i < arrayOfArrays.length; i++) {
    //         const found = arrayOfArrays[i].some(
    //             data => data.date === convertYYYYMMDDStrToDDMMYYYYStr(currentDate.toISOString().split('T')[0])
    //         );
    //
    //         if (found) {
    //             const targetArray = arrayOfArrays[i];
    //             const x1 = targetArray[0].date;
    //             const x2 = targetArray[targetArray.length - 1].date;
    //             const y1 = 0;
    //
    //             return (
    //                 <ReferenceArea
    //                     x1={x1}
    //                     x2={x2}
    //                     y1={y1}
    //                     y2={cigsPerDay + 1}
    //                     stroke="green"
    //                     strokeOpacity={0.3}
    //                 />
    //             );
    //         }
    //     }
    //     return null;
    // }, [cigsPerDay, currentDate, mergedDataSet]);

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

    const CustomTooltip = ({active, payload, label}) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            return (
                <div className="bg-white border rounded shadow p-2 text-sm">
                    <div className="font-semibold">{label}</div>
                    <div>
                        {data.stage !== null && <div><strong>Giai đoạn: {data.stage + 1}</strong></div>}
                        <div
                            className={`${data.checkinMissed === 'missed' ? 'text-red-500' : data.checkinMissed === 'checked' ? 'text-green-600' : ''}`}>
                            {data.checkinMissed === 'missed' ? 'Chưa check-in' : data.checkinMissed === 'checked' ? 'Đã check-in' : ''}</div>
                        {data.checkinMissed !== 'future' &&
                            <div>Đã hút: {data.actual} {data.checkinMissed === 'missed' && '(ước lượng)'}</div>}
                        {data.plan != null && <>
                            <div>Số điếu theo kế hoạch: {data.plan}</div>
                        </>}
                    </div>

                </div>
            );
        }
        return null;
    };

    const exportAsBase64 = async () => {
        if (!progressBoardRef.current) {
            console.warn('Progress board ref is not available');
            return null;
        }

        try {
            const canvas = await html2canvas(progressBoardRef.current, {
                scale: 1,
                useCORS: true,
                backgroundColor: '#ffffff', // Add background color if needed
            });

            const base64 = canvas.toDataURL('image/png');

            setTitle('Chia sẻ tiến trình cai thuốc')
            setContent(`<p>Tôi đã bắt đầu một hành trình không khói thuốc, bạn có muốn cùng tôi không?</p><img src="${base64}">`)
            navigate('/forum/editor')

            return base64;
        } catch (error) {
            console.error('Error exporting as base64:', error);
            // You might want to show a user-friendly error message here
            return null;
        }
    };

    let selectOptions = [
        {
            value: 'overview', label: 'Tổng quan'
        }
    ]

    if (customPlanWithStages?.length > 0) {
        let index = 0
        for (const stage of customPlanWithStages) {
            selectOptions.push({
                value: `${index}`, label: `Giai đoạn ${index + 1}`
            })
            index++
        }
    }

    return (
        <div
            className='bg-white p-2 sm:p-4 md:p-6 rounded-xl shadow-xl w-full max-w-4xl mx-auto space-y-3 sm:space-y-4'>

            {!from &&
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    {isPending ? (
                        <Skeleton.Button active/>
                    ) : (
                        <CustomButton onClick={handleCheckIn}>Check-in hàng ngày →</CustomButton>
                    )}
                    {isPending ? (
                        <Skeleton.Input style={{width: 180}} active size="small"/>
                    ) : (
                        !localCheckInDataSet?.some((checkin) => checkin.date.split('T')[0] === getCurrentUTCDateTime().toISOString().split('T')[0]) ?
                            <strong>Hôm nay bạn chưa check-in.</strong> : <strong>Hôm nay bạn đã check-in.</strong>
                    )}
                </div>}

            {!from && (isPending ? (<Skeleton active paragraph={{rows: 2}}/>) : <div><QuoteCarousel/></div>)}

            <div ref={progressBoardRef} className='space-y-3 sm:space-y-4'>
                <div className="bg-primary-100 rounded-lg p-4 sm:p-6 text-center">
                    <h2 className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">
                        {totalDaysPhrase}
                    </h2>
                    <div className="flex justify-center items-baseline space-x-1 sm:space-x-2 mt-2 flex-wrap">
                        {isPending ? (
                            <Skeleton.Input style={{width: 250}} active/>
                        ) : (
                            <>
                                <span
                                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-800">{timeDifference.days}</span>
                                <span className="text-xs sm:text-sm text-gray-500">ngày</span>
                                <span
                                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-800">{timeDifference.hours}</span>
                                <span className="text-xs sm:text-sm text-gray-500">giờ</span>
                                <span
                                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-800">{timeDifference.minutes}</span>
                                <span className="text-xs sm:text-sm text-gray-500">phút</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    {[0, 1, 2].map((i) => (
                        <div key={i}
                             className="bg-primary-100 p-3 sm:p-4 rounded-lg flex flex-col items-center space-y-2">
                            {isCalculating ? (
                                <Skeleton active paragraph={{rows: 2}}/>
                            ) : (
                                <>
                                    <div className="text-2xl">
                                        {
                                            [
                                                <PiPiggyBankLight className="size-8 sm:size-10 text-primary-800"/>,
                                                <IoLogoNoSmoking className="size-8 sm:size-10 text-primary-800"/>,
                                                <FaTrophy className="size-7 sm:size-9 text-primary-800"/>
                                            ][i]
                                        }
                                    </div>
                                    <div className="text-lg sm:text-xl font-semibold text-primary-800 text-center">
                                        {i === 0
                                            ? moneySaved !== null ? `${moneySaved} VNĐ` : 'Đang tính...'
                                            : i === 1
                                                ? cigsQuit !== null ? cigsQuit : 'Đang tính...'
                                                : localAchieved?.length ?? 'Đang tính...'}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                                        {from === 'coach-user'
                                            ? ['Số tiền người dùng tiết kiệm', 'Số điếu đã bỏ', 'Huy hiệu đạt được'][i]
                                            : ['Số tiền đã tiết kiệm', 'Số điếu đã bỏ', 'Huy hiệu đạt được'][i]}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-primary-100 p-3 sm:p-4 rounded-lg flex flex-col text-center relative">
                    {!from && <div className="absolute right-2 sm:right-3 top-2 sm:top-3">
                        {!isPending && (
                            <a onClick={() => navigate('/onboarding/progress-board-startdate')}
                               className="text-xs sm:text-sm text-primary-700 hover:underline">
                                Chỉnh sửa?
                            </a>
                        )}
                    </div>}
                    <div className="text-2xl flex justify-center mb-2">
                        <FaRegCalendarCheck className='size-7 sm:size-9 text-primary-800'/>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-primary-800 mb-2 leading-relaxed">
                        {from === 'coach-user'
                            ? (readinessValue === 'ready' ? 'Ngày bắt đầu bỏ thuốc' : 'Ngày người dùng đã bỏ thuốc')
                            : (readinessValue === 'ready' ? 'Ngày bắt đầu bỏ thuốc' : 'Ngày tôi đã bỏ thuốc')}
                    </h3>

                    <div className="text-xs sm:text-sm text-gray-600">
                        {isPending ?
                            <Skeleton.Input style={{width: 160}} active/> :
                            readinessValue === 'ready' ?
                                `${new Date(startDate).toLocaleDateString('vi-VN')} ${(userInfo?.sub_id === 1 && from !== 'coach-user') || (!expectedQuitDate && expectedQuitDate.length === 0) ? '' : `- ${new Date(expectedQuitDate).toLocaleDateString('vi-VN')}`}` :
                                new Date(stoppedDate).toLocaleDateString('vi-VN')
                        }
                    </div>
                </div>
            </div>

            {readinessValue === 'ready' && (userInfo?.sub_id !== 1 || (userInfo?.sub_id === 1 && from === 'coach-user')) && (
                <div className="bg-primary-100 p-3 sm:p-4 rounded-lg flex flex-col items-center text-center relative">
                    {!from && <div className="absolute right-2 sm:right-3 top-2 sm:top-3">
                        {!isPending && (
                            <a onClick={() => navigate('/onboarding/progress-board-plan')}
                               className="text-xs sm:text-sm text-primary-700 hover:underline">
                                Chỉnh sửa?
                            </a>
                        )}
                    </div>}
                    <div className="text-2xl flex justify-center mb-2">
                        <BsGraphDown className='size-6 sm:size-7 text-primary-800'/>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-primary-800 mb-3 leading-relaxed">
                        {from === 'coach-user'
                            ? 'Số điếu thuốc theo kế hoạch và thực tế của người dùng'
                            : 'Số điếu thuốc theo kế hoạch và thực tế'}
                    </h3>


                    {readinessValue === 'ready' && userInfo?.sub_id !== 1 && ((!useCustomPlan && (!planLog || planLog.length === 0)) || (useCustomPlan && (!customPlanWithStages || customPlanWithStages.length === 0))) &&
                        <div className='flex flex-col items-center justify-center space-y-3'>
                            <p className="text-sm text-center">
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
                        <div className="mb-4">
                            <p className="text-sm text-center leading-relaxed text-amber-700">
                                {from === 'coach-user'
                                    ? 'Người dùng dường như vẫn hút thuốc sau khi kết thúc kế hoạch. Bạn có thể đề xuất họ bắt đầu lại.'
                                    : 'Có vẻ bạn vẫn đang hút thuốc sau khi kết thúc kế hoạch. Đừng lo — bạn luôn có thể bắt đầu lại!'}
                            </p>
                        </div>
                    }

                    {isPending ? (
                        <Skeleton.Input style={{width: '100%', height: 300}} active/>
                    ) : mergedDataSet?.length === 0 ? (
                        <div className="text-center text-gray-500 text-sm">Không có dữ liệu để hiển thị.</div>
                    ) : !useCustomPlan ? (
                        <div className="w-full overflow-x-auto">
                            <div className="mb-4">
                                <Select
                                    defaultValue="overview"
                                    variant="borderless"
                                    style={{width: 120}}
                                    onChange={handleSelectChange}
                                    size="small"
                                    options={[
                                        {value: 'plan', label: 'Kế hoạch'},
                                        {value: 'overview', label: 'Tổng quan'},
                                    ]}
                                />
                            </div>
                            <ResponsiveContainer width="100%" height={300} minWidth={300}>
                                <LineChart
                                    data={mergedDataSet}
                                    margin={{top: 20, right: 10, left: 10, bottom: 25}}
                                >
                                    <Line
                                        type="monotone"
                                        dataKey="actual"
                                        stroke="#ef4444"
                                        dot={{r: 2}}
                                        strokeWidth={2}
                                        name="Đã hút"
                                        connectNulls={true}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="plan"
                                        stroke="#14b8a6"
                                        strokeDasharray="5 5"
                                        strokeWidth={2}
                                        dot={false}
                                        name="Kế hoạch"
                                        connectNulls={true}
                                    />
                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                                    {/*{quittingMethod === 'gradual-weekly' && getReferenceArea()}*/}
                                    <ReferenceLine
                                        x={
                                            currentDate < new Date(expectedQuitDate)
                                                ? convertYYYYMMDDStrToDDMMYYYYStr(currentDate.toISOString().split('T')[0])
                                                : ''
                                        }
                                        stroke="#115e59"
                                        label="Hôm nay"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tick={<CustomizedAxisTick/>}
                                        interval={1}
                                        fontSize={12}
                                    />
                                    <YAxis fontSize={12}/>
                                    <Tooltip content={<CustomTooltip/>}/>
                                    <Legend
                                        verticalAlign="top"
                                        wrapperStyle={{fontSize: '12px'}}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            {selectOptions.length > 1 && <div className="mb-4 flex justify-center">
                                <Select
                                    defaultValue="overview"
                                    variant="borderless"
                                    style={{width: 120}}
                                    onChange={(e) => {
                                        setSelectedFilter(e)
                                    }}
                                    size="small"
                                    options={selectOptions}
                                />
                            </div>}
                            <ResponsiveContainer width="100%" height={300} minWidth={300}>
                                <LineChart
                                    data={mergedDataSet}
                                    margin={{top: 20, right: 10, left: 10, bottom: 25}}
                                >
                                    <Line
                                        type="monotone"
                                        dataKey="actual"
                                        stroke="#ef4444"
                                        dot={{r: 2}}
                                        strokeWidth={2}
                                        name="Đã hút"
                                        connectNulls={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="plan"
                                        stroke="#14b8a6"
                                        strokeDasharray="5 5"
                                        strokeWidth={2}
                                        dot={false}
                                        name="Kế hoạch"
                                        connectNulls={false}
                                    />
                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                                    {/*{quittingMethod === 'gradual-weekly' && getReferenceArea()}*/}
                                    <ReferenceLine
                                        x={convertYYYYMMDDStrToDDMMYYYYStr(currentDate.toISOString().split('T')[0])}
                                        stroke="#115e59"
                                        label="Hôm nay"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tick={<CustomizedAxisTick/>}
                                        interval={1}
                                        fontSize={12}
                                    />
                                    <YAxis fontSize={12}/>
                                    <Tooltip content={<CustomTooltip/>}/>
                                    <Legend
                                        verticalAlign="top"
                                        wrapperStyle={{fontSize: '12px'}}
                                    />
                                    {selectedFilter === 'overview' && customPlanWithStages.length > 0 && customPlanWithStages.map((stage, idx) => {
                                        //if (!stage.logs[0]) return null
                                        const startDate = convertYYYYMMDDStrToDDMMYYYYStr(stage.start_date.split('T')[0])
                                        const endDate = convertYYYYMMDDStrToDDMMYYYYStr(stage.end_date.split('T')[0])
                                        return <ReferenceArea
                                            key={stage.id}
                                            x1={startDate}
                                            x2={endDate}
                                            y1={0}
                                            y2={cigsPerDay}
                                            label={`Giai đoạn ${idx + 1}`}
                                        />
                                    })}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}

            {!from && <HealthStatistics achievementProgress={achievementProgress?.data}
                                        checkInDataset={checkInDataset?.data}/>}

            {!from && <div className="text-center">
                {isPending ? (
                    <Skeleton.Input style={{width: 160}} active/>
                ) : (
                    <CustomButton type='secondary' onClick={() => exportAsBase64()} className="w-full sm:w-auto">
                        🔗 Chia sẻ tiến trình
                    </CustomButton>
                )}
            </div>}
        </div>
    );
};

export default ProgressBoard;