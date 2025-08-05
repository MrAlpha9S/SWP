import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    readinessRadioOptions,
    reasonListOptions,
    timeAfterWakingRadioOptions,
    timeOfDayOptions,
    smokingTriggerOptions,
    quittingMethodOptions
} from "../../../constants/constants.js";
import {
    clonePlanLogToDDMMYYYY,
    convertDDMMYYYYStrToYYYYMMDDStr,
    convertYYYYMMDDStrToDDMMYYYYStr,
    getCurrentUTCDateTime
} from "../../utils/dateUtils.js";
import {mergeByDateForPlanLog} from "../../utils/checkInUtils.js";
import CustomButton from "../../ui/CustomButton.jsx";
import SetPlan from "../signup/setPlan.jsx";
import ConvertPlanlogDdmmyy from "../../utils/convertPlanlogDDMMYY.js";
import {CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import getDatasetFromCustomPlanWithStages from "../../utils/getDatasetFromCustomPlanWithStages.js";
import {CustomizedAxisTick} from "../../utils/customizedAxisTick.jsx";
import {Select} from "antd";
import PlanSummaryReport from "../signup/planSummaryReport.jsx";
import {useIsUserExpiredStore} from "../../../stores/store.js";

const UserProfileInMessage = ({
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
                                  coachInfo,
                                  userInfo,
                                  reasonList,
                                  timeAfterWaking,
                                  triggers,
                                  timeOfDayList,
                                  customTimeOfDay,
                                  customTrigger,
                                  cigsReduced,
                                  checkInDataSet,
                                  goalList,
                                  updatedAt,
                                  createdAt, updatedBy, coach, useCustomPlan, customPlanWithStages
                              }) => {
    const [localReadinessValue, setLocalReadinessValue] = useState(readinessValue ?? '');
    const [localUserInfo, setLocalUserInfo] = useState(userInfo ?? null);
    const [localStartDate, setLocalStartDate] = useState(startDate ?? null);
    const [localCigsPerDay, setLocalCigsPerDay] = useState(cigsPerDay ?? 0);
    const [localQuittingMethod, setLocalQuittingMethod] = useState(quittingMethod ?? null);
    const [localCigsReduced, setLocalCigsReduced] = useState(cigsReduced ?? null);
    const [localExpectedQuitDate, setLocalExpectedQuitDate] = useState(expectedQuitDate ?? null);
    const [localPlanLog, setLocalPlanLog] = useState(planLog ?? []);
    const [localPlanLogCloneDDMMYY, _setLocalPlanLogCloneDDMMYY] = useState(
        () => ConvertPlanlogDdmmyy(planLog) ?? []
    );
    const [selectedFilter, setSelectedFilter] = useState('overview')
    const [planCreation, setPlanCreation] = useState(false)
    const [localUseCustomPlan, setLocalUseCustomPlan] = useState(useCustomPlan ?? false)
    const [localCustomPlanWithStages, setLocalCustomPlanWithStages] = useState(customPlanWithStages ?? [])
    const {isUserExpired, setIsUserExpired} = useIsUserExpiredStore()

    const setLocalPlanLogCloneDDMMYY = useCallback((valueOrUpdater) => {
        if (typeof valueOrUpdater === 'function') {
            _setLocalPlanLogCloneDDMMYY(prev => {
                const next = valueOrUpdater(prev);
                return ConvertPlanlogDdmmyy(next);
            });
        } else {
            _setLocalPlanLogCloneDDMMYY(ConvertPlanlogDdmmyy(valueOrUpdater));
        }
    }, []);
    const [planEditClicked, setPlanEditClicked] = useState(false);
    const [totalCigsAfterPlan, setTotalCigsAfterPlan] = useState(0)
    // Fix: Add null checks and default values
    const readinessLabel = readinessValue
        ? readinessRadioOptions.find((option) => option.value === readinessValue)?.label || 'Chưa xác định'
        : 'Chưa xác định';

    const localReasonList = reasonList?.map((reason) => {
        return reasonListOptions.find((opt) => opt.value === reason);
    }).filter(Boolean) || []; // Filter out undefined values

    const timeAfterWakingLabel = timeAfterWaking
        ? timeAfterWakingRadioOptions.find((option) => option.value === timeAfterWaking)?.label || 'Chưa xác định'
        : 'Chưa xác định';

    const localTimeOfDayList = timeOfDayList?.map((time) => {
        if (time === 'other') return {value: 'other', label: customTimeOfDay || 'Khác'};
        return timeOfDayOptions.find((opt) => opt.value === time);
    }).filter(Boolean) || []; // Filter out undefined values

    const localTriggers = triggers?.map((trigger) => {
        if (trigger === 'other') return {value: 'other', label: customTrigger || 'Khác'};
        return smokingTriggerOptions.find((opt) => opt.value === trigger);
    }).filter(Boolean) || []; // Filter out undefined values

    let quittingMethodLabel = 'Chưa xác định';
    if (quittingMethod?.length > 0) {
        const foundMethod = quittingMethodOptions.find((option) => option.value === quittingMethod);
        quittingMethodLabel = foundMethod?.label || 'Chưa xác định';
    }

    const today = getCurrentUTCDateTime();

    let displayPlanComplete = false;
    if (expectedQuitDate) {
        const expectedQuitDateObj = new Date(expectedQuitDate);
        if (today > expectedQuitDateObj) displayPlanComplete = true;
    }

    const [displayWarning, setDisplayWarning] = useState(false);
    const mergedDataSet = useMemo(() => {
        if (!planLog || !checkInDataSet || userInfo?.sub_id === 1 || checkInDataSet.length === 0) return [];
        return clonePlanLogToDDMMYYYY(mergeByDateForPlanLog(planLog, checkInDataSet, quittingMethod, cigsPerDay, userInfo?.created_at));
    }, [planLog, checkInDataSet, userInfo?.sub_id, quittingMethod, cigsPerDay, userInfo?.created_at]);

    useEffect(() => {
        if (mergedDataSet?.length > 0) {
            const expectedQuitDateObj = new Date(expectedQuitDate);
            if (today > expectedQuitDateObj) {
                let totalCigsAfterPlan = 0
                mergedDataSet.forEach((data) => {
                    const dateInDataObj = new Date(convertDDMMYYYYStrToYYYYMMDDStr(data.date) + 'T00:00:00Z')
                    if (dateInDataObj <= today && dateInDataObj >= expectedQuitDateObj) {
                        totalCigsAfterPlan += data.actual
                    }
                })
                if (totalCigsAfterPlan > 0) {
                    setDisplayWarning(true);
                    setTotalCigsAfterPlan(totalCigsAfterPlan)
                }
            }
        }
    }, [expectedQuitDate, mergedDataSet, today]);

    useEffect(() => {
        console.log('edit', planEditClicked)
        console.log('create', planCreation)
    }, [planCreation, planEditClicked]);


    // Show loading state if data is still being fetched
    if (isPending) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Đang tải thông tin...</div>
            </div>
        );
    }

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
        <div className='h-full w-full flex flex-col overflow-y-auto px-5'>
            <p className='text-gray-400'>Tạo bởi: {userInfo?.username} {coach ? '(bạn)' : '(người dùng)'}</p>
            <p className='text-gray-400'>Tạo vào ngày: {convertYYYYMMDDStrToDDMMYYYYStr(createdAt.split('T')[0])}</p>
            {!coach && userInfo && <p className='text-gray-400'>Chỉnh sửa lần cuối bởi: {userInfo?.user_id === updatedBy ? `${userInfo?.username} (người dùng)` : `${coachInfo?.username} (bạn)`}</p> }
            {coach && <p className='text-gray-400'>Chỉnh sửa lần cuối bởi: {updatedBy === coach?.user_id ? `${coach?.username} (huấn luyện viên)` : userInfo?.username}</p>}
            {updatedAt && <p className='text-gray-400'>Chỉnh sửa lần cuối vào
                lúc: {convertYYYYMMDDStrToDDMMYYYYStr(updatedAt.split('T')[0])}</p>}
            <div>
                <p className='font-bold text-2xl'>Mức độ sẵn sàng</p>
                <p>{readinessLabel}</p>

                {startDate?.length > 0 && (
                    <>
                        <p className='font-bold text-2xl'>Ngày quyết định bỏ thuốc</p>
                        <p>{convertYYYYMMDDStrToDDMMYYYYStr(startDate.split('T')[0])}</p>
                    </>
                )}

                {stoppedDate?.length > 0 && (
                    <>
                        <p className='font-bold text-2xl'>Ngày đã bỏ thuốc</p>
                        <p>{convertYYYYMMDDStrToDDMMYYYYStr(stoppedDate.split('T')[0])}</p>
                    </>
                )}

                <p className='font-bold text-2xl'>Lý do cai thuốc</p>
                {localReasonList.length > 0 ? (
                    localReasonList.map((reason) => (
                        <p key={reason.value}>{reason.label}</p>
                    ))
                ) : (
                    <p>Chưa có thông tin</p>
                )}

                <p className='font-bold text-2xl'>Thông tin thuốc</p>
                <p><strong>Giá tiền mỗi gói:</strong> {pricePerPack?.toLocaleString('vi-VN') || 0} VNĐ</p>
                <p><strong>Số điếu trong mỗi gói:</strong> {cigsPerPack || 0}</p>
                <p><strong>Số điếu hút mỗi ngày:</strong> {cigsPerDay || 0}</p>

                <p className='font-bold text-2xl'>Hút thuốc bao lâu sau khi thức dậy</p>
                <p>{timeAfterWakingLabel}</p>

                <p className='font-bold text-2xl'>Người dùng hút thuốc vào lúc</p>
                {localTimeOfDayList.length > 0 ? (
                    localTimeOfDayList.map((time) => (
                        <p key={time.value}>{time.label}</p>
                    ))
                ) : (
                    <p>Chưa có thông tin</p>
                )}

                <p className='font-bold text-2xl'>Tác nhân kích thích người dùng hút thuốc</p>
                {localTriggers.length > 0 ? (
                    localTriggers.map((trigger) => (
                        <p key={trigger.value}>{trigger.label}</p>
                    ))
                ) : (
                    <p>Chưa có thông tin</p>
                )}

                <p className='font-bold text-2xl'>Kế hoạch</p>

                {(planEditClicked || planCreation) ? (
                    <SetPlan
                        readinessValue={localReadinessValue}
                        userInfo={localUserInfo}
                        startDate={localStartDate}
                        cigsPerDay={localCigsPerDay}
                        quittingMethod={localQuittingMethod}
                        setQuittingMethod={setLocalQuittingMethod}
                        cigsReduced={localCigsReduced}
                        setCigsReduced={setLocalCigsReduced}
                        expectedQuitDate={localExpectedQuitDate}
                        setExpectedQuitDate={setLocalExpectedQuitDate}
                        planLog={localPlanLog}
                        setPlanLog={setLocalPlanLog}
                        planLogCloneDDMMYY={localPlanLogCloneDDMMYY}
                        setPlanLogCloneDDMMYY={setLocalPlanLogCloneDDMMYY}
                        from="coach-user"
                        reasonList={reasonList}
                        pricePerPack={pricePerPack}
                        cigsPerPack={cigsPerPack}
                        timeAfterWaking={timeAfterWaking}
                        timeOfDayList={timeOfDayList}
                        triggers={triggers}
                        customTimeOfDay={customTimeOfDay}
                        customTrigger={customTrigger}
                        stoppedDate={stoppedDate}
                        goalList={goalList}
                        setPlanEditClicked={setPlanEditClicked}
                        setPlanCreation={setPlanCreation}
                        coachInfo={coachInfo}
                        coach={coach}
                        useCustomPlan={localUseCustomPlan}
                        setUseCustomPlan={setLocalUseCustomPlan}
                        customPlanWithStages={localCustomPlanWithStages}
                        setCustomPlanWithStages={setLocalCustomPlanWithStages}
                    />
                ) : (planLog?.length > 0 && !useCustomPlan) ? (
                    <>
                        <p><strong>Phương pháp:</strong> {quittingMethodLabel}</p>
                        {quittingMethod !== 'target-date' ? (
                            <p><strong>Số điếu giảm mỗi {quittingMethod === 'gradual-daily' ? 'ngày' : 'tuần'}:</strong> {cigsReduced || 0}</p>
                        ) : (
                            <p><strong>Ngày kết thúc:</strong> {convertYYYYMMDDStrToDDMMYYYYStr(expectedQuitDate.split('T')[0]) || 'Chưa xác định'}</p>
                        )}
                        {quittingMethod !== 'target-date' && expectedQuitDate && (
                            <p><strong>Ngày dự kiến số điếu giảm về 0:</strong> {convertYYYYMMDDStrToDDMMYYYYStr(expectedQuitDate.split('T')[0])}</p>
                        )}
                        {displayPlanComplete && <span className='text-green-600'>(kế hoạch đã kết thúc)</span>}
                        {displayWarning && (
                            <p className='text-red-500'>
                                Người dùng vẫn hút <strong>{totalCigsAfterPlan}</strong> điếu thuốc sau ngày kết thúc kế hoạch
                            </p>
                        )}
                        <CustomButton disabled={isUserExpired} onClick={() => setPlanEditClicked(true)}>Chỉnh sửa kế hoạch</CustomButton>
                    </>
                ) : (customPlanWithStages?.length > 0) ? (
                    <>
                        <PlanSummaryReport customPlanWithStages={customPlanWithStages} cigsPerDay={cigsPerDay} />
                        {selectOptions.length > 1 && (
                            <div className="mb-4 flex justify-center">
                                <Select
                                    defaultValue="overview"
                                    variant="borderless"
                                    style={{ width: 120 }}
                                    onChange={(e) => setSelectedFilter(e)}
                                    size="small"
                                    options={selectOptions}
                                />
                            </div>
                        )}
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={ConvertPlanlogDdmmyy(getDatasetFromCustomPlanWithStages(customPlanWithStages, selectedFilter))}
                                margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                            >
                                <Line type="monotone" dataKey="cigs" name="Số điếu" stroke="#14b8a6" />
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                <XAxis dataKey="date" tick={<CustomizedAxisTick />} interval={0} />
                                <YAxis />
                                <Tooltip />
                                {customPlanWithStages?.length > 0 && customPlanWithStages?.map((stage, idx) => {
                                    if (!stage?.logs[0] || selectedFilter !== 'overview') return null;
                                    return (
                                        <ReferenceArea
                                            key={idx}
                                            x1={convertYYYYMMDDStrToDDMMYYYYStr(stage.logs[0].date.split('T')[0])}
                                            x2={convertYYYYMMDDStrToDDMMYYYYStr(stage.logs[stage.logs.length - 1].date.split('T')[0])}
                                            y1={0}
                                            y2={cigsPerDay}
                                            label={`Giai đoạn ${idx + 1}`}
                                        />
                                    );
                                })}
                            </LineChart>
                        </ResponsiveContainer>
                        <CustomButton disabled={isUserExpired} onClick={() => setPlanEditClicked(true)}>Chỉnh sửa kế hoạch</CustomButton>
                    </>
                ) : (
                    <div>
                        <p>Người dùng chưa tạo kế hoạch</p>
                        <CustomButton onClick={() => setPlanCreation(true)}>Tạo kế hoạch</CustomButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfileInMessage;