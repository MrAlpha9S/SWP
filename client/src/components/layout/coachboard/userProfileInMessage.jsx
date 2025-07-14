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
import {mergeByDate} from "../../utils/checkInUtils.js";
import CustomButton from "../../ui/CustomButton.jsx";
import SetPlan from "../signup/setPlan.jsx";
import ConvertPlanlogDdmmyy from "../../utils/convertPlanlogDDMMYY.js";

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
                              }) => {
    const [localReadinessValue, setLocalReadinessValue] = useState(readinessValue ?? '');
    const [localUserInfo, setLocalUserInfo] = useState(userInfo ?? null);
    const [localStartDate, setLocalStartDate] = useState(startDate ?? '');
    const [localCigsPerDay, setLocalCigsPerDay] = useState(cigsPerDay ?? 0);
    const [localQuittingMethod, setLocalQuittingMethod] = useState(quittingMethod ?? '');
    const [localCigsReduced, setLocalCigsReduced] = useState(cigsReduced ?? 0);
    const [localExpectedQuitDate, setLocalExpectedQuitDate] = useState(expectedQuitDate ?? '');
    const [localPlanLog, setLocalPlanLog] = useState(planLog ?? []);
    const [localPlanLogCloneDDMMYY, _setLocalPlanLogCloneDDMMYY] = useState(
        () => ConvertPlanlogDdmmyy(planLog) ?? []
    );

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
        return clonePlanLogToDDMMYYYY(mergeByDate(planLog, checkInDataSet, quittingMethod, cigsPerDay, userInfo?.created_at));
    }, [planLog, checkInDataSet, userInfo?.sub_id, quittingMethod]);

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


    // Show loading state if data is still being fetched
    if (isPending) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Đang tải thông tin...</div>
            </div>
        );
    }

    return (
        <div className='h-full flex flex-col overflow-y-auto px-5'>
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
                {planLog?.length > 0 ? (
                    <>
                        {!planEditClicked ? <><p><strong>Phương pháp: </strong>{quittingMethodLabel}</p>
                                {quittingMethod !== 'target-date' ? (
                                    <p><strong>Số điếu giảm
                                        mỗi {quittingMethod === 'gradual-daily' ? 'ngày' : 'tuần'}: </strong>{cigsReduced || 0}
                                    </p>
                                ) : (
                                    <p><strong>Người dùng chọn ngày kết thúc: </strong>{expectedQuitDate || 'Chưa xác định'}
                                    </p>
                                )}
                                {quittingMethod !== 'target-date' && expectedQuitDate && (
                                    <p><strong>Ngày dự kiến số điếu giảm về
                                        0: </strong>{convertYYYYMMDDStrToDDMMYYYYStr(expectedQuitDate.split('T')[0])}</p>
                                )}
                                {displayPlanComplete && <span className='text-green-600'>(kế hoạch đã kết thúc)</span>}
                                {displayWarning && <p className='text-red-500'>Người dùng vẫn
                                    hút <strong>{totalCigsAfterPlan}</strong> điếu thuốc sau ngày kết thúc kế hoạch</p>}
                                <CustomButton onClick={() => setPlanEditClicked(true)}>Chỉnh sửa kế
                                    hoạch</CustomButton></> :
                            <><SetPlan
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
                                from='coach-user'
                                reasonList={reasonList}
                                pricePerPack={pricePerPack}
                                cigsPerPack={cigsPerPack}
                                timeAfterWaking={timeAfterWaking}
                                timeOfDayList={timeOfDayList}
                                triggers={triggers}
                                customTimeOfDay={customTimeOfDay} customTrigger={customTrigger}
                                stoppedDate={stoppedDate} goalList={goalList}
                                setPlanEditClicked={setPlanEditClicked}
                                coachInfo={coachInfo}
                            />
                            </>}
                    </>
                ) : (
                    <>
                        <p>Người dùng chưa tạo kế hoạch</p>
                        <CustomButton>Tạo kế hoạch</CustomButton>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfileInMessage;