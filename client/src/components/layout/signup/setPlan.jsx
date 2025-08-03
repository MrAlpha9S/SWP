import React, {useEffect, useRef, useState} from 'react';
import {
    useCurrentStepDashboard,
    useCurrentStepStore,
    useErrorStore,
} from "../../../stores/store.js";
import ErrorText from "../../ui/errorText.jsx";
import {checkboxStyle, quittingMethodOptions, onboardingErrorMsg} from "../../../constants/constants.js";
import {Checkbox, DatePicker, Radio, Select, Tabs} from "antd";
import CustomButton from "../../ui/CustomButton.jsx";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea} from 'recharts';
import {CustomizedAxisTick} from "../../utils/customizedAxisTick.jsx";
import calculatePlan from "../../utils/calculatePlan.js";
import {
    convertDDMMYYYYStrToYYYYMMDDStr,
    convertYYYYMMDDStrToDDMMYYYYStr, getCurrentUTCDateTime
} from "../../utils/dateUtils.js";
import dayjs from 'dayjs'
import {FaArrowRight} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import CustomStageEditor from "../../utils/CustomStageEditor.jsx";
import {usePostUserProfile} from "../../hooks/usePostUSerProfile.js";
import {useAuth0} from "@auth0/auth0-react";
import {useNotificationManager} from "../../hooks/useNotificationManager.jsx";
import {queryClient} from "../../../main.jsx";
import {useSocketStore} from "../../../stores/useSocketStore.js";
import QuickCreate from "./quickCreate.jsx";
import getDatasetFromCustomPlanWithStages from "../../utils/getDatasetFromCustomPlanWithStages.js";
import PlanSummaryReport from "./planSummaryReport.jsx";
import ConvertPlanlogDdmmyy from "../../utils/convertPlanlogDDMMYY.js";

const SetPlan = ({
                     readinessValue,
                     userInfo,
                     coachInfo,
                     startDate,
                     cigsPerDay,
                     quittingMethod,
                     setQuittingMethod,
                     cigsReduced,
                     setCigsReduced,
                     expectedQuitDate,
                     setExpectedQuitDate,
                     planLog,
                     setPlanLog,
                     planLogCloneDDMMYY,
                     setPlanLogCloneDDMMYY,
                     from,
                     reasonList,
                     pricePerPack,
                     cigsPerPack,
                     timeAfterWaking,
                     timeOfDayList,
                     triggers,
                     customTimeOfDay,
                     customTrigger,
                     stoppedDate,
                     goalList,
                     setPlanEditClicked,
                     useCustomPlan,
                     setUseCustomPlan,
                     customPlanWithStages, setCustomPlanWithStages
                 }) => {

    const {errors} = useErrorStore();
    const scrollRef = useRef(null);
    const frequencyLabel = quittingMethod === "gradual-weekly" ? "tuần" : "ngày";
    const navigate = useNavigate();
    const {user, getAccessTokenSilently, isAuthenticated} = useAuth0();
    const {addError, removeError} = useErrorStore()
    const mutation = usePostUserProfile(getAccessTokenSilently, user);
    const {currentStep, setCurrentStep} = useCurrentStepStore();
    const {setCurrentStepDashboard} = useCurrentStepDashboard()
    const [selectedFilter, setSelectedFilter] = useState('overview')

    const errorMap = Object.fromEntries(
        onboardingErrorMsg
            .filter(msg => msg.atPage === "createPlan")
            .map(msg => [msg.location, msg])
    );
    const {openNotification} = useNotificationManager();
    const {socket} = useSocketStore()

    const validateCoachPlan = () => {
        if (from !== 'coach-user') return true;

        const {
            startDate: errStartDate,
            cigsPerDay: errCigsPerDay,
            quitMethod: errQuitMethod,
            cigsReduced: errCigsReduced,
            cigsReducedLarge: errCigsReducedLarge,
            expectedQuitDate: errExpectedQuitDate
        } = errorMap;

        let isValid = true;

        if (!startDate || startDate.length === 0) {
            addError(errStartDate);
            isValid = false;
        } else {
            removeError(errStartDate);
        }

        if (cigsPerDay <= 0 || !Number.isInteger(cigsPerDay)) {
            addError(errCigsPerDay);
            isValid = false;
        } else {
            removeError(errCigsPerDay);
        }

        if (!quittingMethod || quittingMethod.length === 0) {
            addError(errQuitMethod);
            isValid = false;
        } else {
            removeError(errQuitMethod);
        }

        if (quittingMethod === 'target-date') {
            if (!expectedQuitDate || expectedQuitDate.length === 0) {
                addError(errExpectedQuitDate);
                isValid = false;
            } else {
                removeError(errExpectedQuitDate);
            }
            removeError(errCigsReduced);
            removeError(errCigsReducedLarge);
        } else {
            if (cigsReduced <= 0 || !Number.isInteger(cigsReduced)) {
                addError(errCigsReduced);
                isValid = false;
            } else {
                removeError(errCigsReduced);
            }

            if (cigsReduced > cigsPerDay) {
                addError(errCigsReducedLarge);
                isValid = false;
            } else {
                removeError(errCigsReducedLarge);
            }

            removeError(errExpectedQuitDate);
        }

        return isValid;
    };


    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!scrollRef.current) return
            const yOffset = -130;
            const y = scrollRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'smooth'});
        }, 100)
        return () => {
            clearTimeout(timeout);
        }
    }, [planLog]);

    useEffect(() => {
        if (!useCustomPlan) {
            if (quittingMethod === 'target-date' && expectedQuitDate.length > 0 && startDate.length > 0 && cigsPerDay > 0
                && quittingMethod.length > 0) {
                setPlanLog(calculatePlan(startDate, cigsPerDay, quittingMethod, 0, expectedQuitDate));
            } else if (quittingMethod !== 'target-date' && startDate.length > 0 && cigsPerDay > 0
                && quittingMethod.length > 0 && cigsReduced > 0) {
                setPlanLog(calculatePlan(startDate, cigsPerDay, quittingMethod, cigsReduced));
            }
        }
    }, [cigsPerDay, cigsReduced, expectedQuitDate, quittingMethod, setPlanLog, startDate, useCustomPlan]);


    useEffect(() => {
        if (planLog.length > 0 && !useCustomPlan) {
            setPlanLogCloneDDMMYY(planLog)
            if (readinessValue === 'ready' && quittingMethod !== 'target-date') {
                setExpectedQuitDate(planLog[planLog.length - 1].date)
            }
        }
    }, [planLog])

    useEffect(() => {
        if (customPlanWithStages.length > 0 && useCustomPlan) {
            const lastStage = customPlanWithStages[customPlanWithStages.length - 1];
            const lastStageLogs = lastStage.logs
            if (lastStageLogs.length === 0) return
            const lastDateInLogs = lastStageLogs[lastStageLogs.length - 1].date
            setExpectedQuitDate(lastDateInLogs)
        }
    }, [customPlanWithStages])

    const handleSavePlan = () => {
        if (!isAuthenticated || !user) return;

        const payload = {
            userAuth0Id: userInfo?.auth0_id,
            readiness: readinessValue,
            reasonList,
            pricePerPack,
            cigsPerPack,
            timeAfterWaking,
            timeOfDayList,
            triggers,
            cigsPerDay,
            updaterUserAuth0Id: coachInfo?.auth0_id,

        };

        payload.customTimeOfDay = customTimeOfDay;
        payload.customTrigger = customTrigger;
        if (readinessValue === 'ready') {
            payload.startDate = startDate;
            payload.quittingMethod = quittingMethod;
            if (quittingMethod !== 'target-date') {
                payload.cigsReduced = cigsReduced;
            }
            payload.expectedQuitDate = expectedQuitDate;
            payload.planLog = planLog;
        } else {
            payload.stoppedDate = stoppedDate;
        }
        payload.goalList = goalList;


        mutation.mutate(payload, {
            onSuccess: (data) => {
                setPlanEditClicked(false)
                openNotification('success', {
                    message: 'Thành công',
                    content: 'Lưu kế hoạch thành công'
                })
                // // Invalidate coach-specific queries
                // queryClient.invalidateQueries(['user-profile-coach'])
                // queryClient.invalidateQueries(['dataset-coach'])
                // queryClient.invalidateQueries(['user-creation-date-coach'])
                //
                // // Invalidate regular user queries (for when coach updates their own plan)
                // queryClient.invalidateQueries(['dataset'])
                // queryClient.invalidateQueries(['user-creation-date'])
                setTimeout(() => {
                    queryClient.invalidateQueries(['user-profile-coach']);
                    queryClient.invalidateQueries(['dataset-coach']);
                }, 300); // 300ms is usually enough

            },
            onError: (error) => {
                console.error('Submission error:', error);
            }
        });
    }

    const tabsItems = [
        {
            label: `Tạo nhanh`,
            key: 'quick-create',
            children: <QuickCreate from={from} cigsReduced={cigsReduced} setQuittingMethod={setQuittingMethod}
                                   quittingMethod={quittingMethod} setCigsReduced={setCigsReduced} errors={errors}
                                   expectedQuitDate={expectedQuitDate} setExpectedQuitDate={setExpectedQuitDate}/>,
        },
        {
            label: `Tạo chuyên sâu`,
            key: 'custom-stages',
            children: <CustomStageEditor cigsPerDay={cigsPerDay} customPlanWithStages={customPlanWithStages}
                                         setCustomPlanWithStages={setCustomPlanWithStages}/>,
        }
    ]

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
        <div className={`${from === 'coach-user' && 'bg-primary-100 p-5 rounded-2xl'} space-y-4`}>
            {/* Header for paid users and coach users */}
            {(userInfo?.sub_id === 2 || from === 'coach-user') && from !== 'coach-user' && (
                <h2 className="text-left md:text-4xl lg:text-5xl font-bold">
                    6. {readinessValue === 'ready' ? ' Lên kế hoạch' : ' Kết quả & theo dõi'}
                </h2>
            )}

            {/* Handle relapse-support case for both free and paid users */}
            {readinessValue === 'relapse-support' && (
                <p>Bạn đã bỏ thuốc, bạn có thể bỏ qua bước này</p>
            )}

            {/* Handle ready case */}
            {readinessValue === 'ready' && (
                <>
                    {/* Free user - show promotional content */}
                    {(userInfo?.sub_id === 1 || !isAuthenticated) && (
                        <>
                            <h2 className="text-left md:text-4xl lg:text-5xl font-bold">
                                6. Lên kế hoạch
                            </h2>
                            <div className="text-left text-sm md:text-base">
                                <p>
                                    Việc lên kế hoạch cụ thể là một bước quan trọng giúp bạn tiến gần hơn đến mục tiêu
                                    bỏ thuốc.
                                    Một kế hoạch rõ ràng sẽ giúp bạn biết mình đang ở đâu trong hành trình thay đổi và
                                    từng bước
                                    tiến bộ ra sao.
                                </p>
                                <p className="mt-2">
                                    Chức năng này dành riêng cho người dùng <strong>Premium</strong>. Bạn sẽ có thể:
                                </p>
                                <ul className="list-disc list-inside space-y-1 mt-2">
                                    <li>Tự lên kế hoạch bỏ thuốc với lộ trình rõ ràng và dễ dàng theo dõi</li>
                                    <li><strong>Hoặc</strong>, nếu cần, <strong>làm việc trực tiếp với Huấn luyện
                                        viên</strong> của chúng tôi để lên một kế hoạch phù hợp cho bạn.
                                    </li>
                                    <li>Chat 1-1 với Huấn luyện viên 24/24, nhận sự giúp đỡ bất cứ lúc nào.</li>
                                </ul>
                                <CustomButton onClick={() => navigate('/subscription/onboarding-step-5')}
                                              className="mt-5 inline-flex items-center gap-2">
                                    Tìm hiểu thêm <FaArrowRight/>
                                </CustomButton>
                            </div>
                        </>
                    )}

                    {/* Paid user or coach user - show plan creation functionality */}
                    {(userInfo?.sub_id === 2 || from === 'coach-user') && (
                        <>
                            {from !== 'coach-user' && (
                                <div className="text-left text-sm md:text-base space-y-4 my-4">
                                    <p>
                                        Việc lên kế hoạch cụ thể là một bước quan trọng giúp bạn tiến gần hơn đến mục
                                        tiêu bỏ
                                        thuốc.
                                        Một kế hoạch rõ ràng sẽ giúp bạn biết mình đang ở đâu trong hành trình thay đổi
                                        và từng
                                        bước
                                        tiến bộ ra sao.
                                        Bạn hãy chọn ngày bắt đầu, số lượng thuốc bạn hút mỗi ngày và tốc độ bạn muốn
                                        giảm dần.
                                        Tùy vào thói quen và khả năng của mình, bạn có thể chọn giảm mỗi ngày, mỗi tuần
                                        hoặc đặt
                                        ra
                                        ngày muốn bỏ hoàn toàn.
                                        Hãy chọn phương pháp phù hợp với bạn nhất – đây sẽ là nền tảng để bạn theo dõi,
                                        duy trì
                                        và
                                        đạt được mục tiêu bỏ thuốc.
                                    </p>
                                    <div><strong>Lưu ý:</strong> Bạn có thể tự tạo kế hoạch hoặc nhờ Huấn luyện viên hỗ
                                        trợ.
                                        Nếu muốn tự tạo, hãy điền thông tin phía dưới.
                                        Nếu muốn Huấn luyện viên hỗ trợ, nhấn nút <strong>"Nhờ Huấn luyện
                                            viên"</strong> bên dưới – thông tin hiện tại <strong>sẽ được lưu</strong> và
                                        bạn sẽ được đưa đến khung trò chuyện.
                                    </div>
                                    <CustomButton onClick={() => {
                                        setCurrentStepDashboard('coach')
                                        navigate('/post-onboarding')
                                    }}>Nhờ huấn luyện viên</CustomButton>
                                </div>
                            )}

                            <div className="min-w-[60%] max-w-[75%] flex flex-col gap-3">
                                <Tabs
                                    onChange={(e) => {
                                        if (e === 'custom-stages') setUseCustomPlan(true)
                                        else setUseCustomPlan(false)
                                    }}
                                    type="card"
                                    items={tabsItems}
                                    defaultActiveKey={useCustomPlan ? 'custom-stages' : 'quick-create'}
                                />
                            </div>

                            {(planLog.length > 0 && !useCustomPlan) && (
                                <>
                                    <div className="mt-8 text-left font-bold text-base md:text-lg" ref={scrollRef}>
                                        <h3>Tổng quan kế hoạch</h3>
                                    </div>

                                    <div className="text-sm md:text-base">
                                        {from === 'coach-user' ? (
                                            <div>
                                                <p><strong>Phương pháp:</strong> {quittingMethod === 'target-date'
                                                    ? 'Giảm dần đến ngày mục tiêu'
                                                    : `Giảm dần ${cigsReduced} điếu mỗi ${frequencyLabel}`}</p>
                                                <p><strong>Ngày bắt
                                                    đầu:</strong> {convertYYYYMMDDStrToDDMMYYYYStr(startDate.split('T')[0])}
                                                </p>
                                                <p><strong>Mức ban đầu:</strong> {cigsPerDay} điếu/ngày</p>
                                                <p><strong>Ngày dự kiến kết
                                                    thúc:</strong> {convertYYYYMMDDStrToDDMMYYYYStr(planLog[planLog.length - 1].date.split('T')[0])}
                                                </p>
                                            </div>
                                        ) : (
                                            <p>
                                                Dựa trên thông tin bạn đã nhập, biểu đồ cho thấy kế hoạch{" "}
                                                {
                                                    quittingMethod === "target-date"
                                                        ? "giảm dần số lượng thuốc lá bạn hút mỗi ngày cho đến ngày bạn chọn"
                                                        : `giảm dần số lượng thuốc lá bạn hút mỗi ${frequencyLabel}`
                                                }, bắt đầu từ{" "}
                                                <strong>{convertYYYYMMDDStrToDDMMYYYYStr(startDate.split('T')[0])}</strong> với
                                                mức ban đầu là{" "}
                                                <strong>{cigsPerDay}</strong>,{" "}
                                                {
                                                    quittingMethod === "target-date"
                                                        ? "và sẽ giảm dần cho đến khi số điếu về 0"
                                                        : <>mỗi {frequencyLabel} giảm <strong>{cigsReduced}</strong> điếu</>
                                                }. Nếu bạn giữ đúng kế hoạch này, bạn sẽ hoàn toàn ngừng hút thuốc
                                                vào{" "}
                                                <strong>{convertYYYYMMDDStrToDDMMYYYYStr(planLog[planLog.length - 1].date.split('T')[0])}</strong>.
                                            </p>
                                        )}

                                        <ul>
                                            <li><strong>Trục ngang (ngày):</strong> hiển thị các ngày trong kế hoạch từ
                                                lúc
                                                bắt đầu đến ngày kết thúc.
                                            </li>
                                            <li><strong>Trục dọc (số điếu thuốc):</strong> cho thấy số lượng nên hút mỗi
                                                ngày tương ứng.
                                            </li>
                                            <li><strong>Đường kẻ giảm dần:</strong> thể hiện lộ trình cai thuốc đều đặn
                                                và
                                                rõ ràng.
                                            </li>
                                        </ul>

                                        {from === 'coach-user' ? (
                                            <p>
                                                👉 <em>Sử dụng biểu đồ để theo dõi tiến độ và hỗ trợ người dùng trong
                                                hành
                                                trình cai thuốc.</em>
                                            </p>
                                        ) : (
                                            <p>
                                                👉 <em>Hãy dùng biểu đồ này để theo dõi sự tiến bộ của bạn mỗi ngày. Bạn
                                                đang
                                                từng bước tiến gần hơn đến mục tiêu bỏ thuốc hoàn toàn!</em>
                                            </p>
                                        )}
                                    </div>

                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={planLogCloneDDMMYY}
                                                   margin={{top: 20, right: 30, left: 20, bottom: 25}}>
                                            <Line type="monotone" dataKey="cigs" stroke="#14b8a6"/>
                                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                                            <XAxis dataKey="date" tick={<CustomizedAxisTick/>} interval={0}/>
                                            <YAxis/>
                                            <Tooltip/>
                                        </LineChart>
                                    </ResponsiveContainer>
                                </>
                            )}

                            {useCustomPlan && customPlanWithStages.length > 0 && (
                                <>
                                    <div className="mt-8 text-left font-bold text-base md:text-lg" ref={scrollRef}>
                                        <h3>Tổng quan kế hoạch</h3>
                                    </div>
                                    <PlanSummaryReport customPlanWithStages={customPlanWithStages} cigsPerDay={cigsPerDay}/>

                                    {selectOptions.length > 1 && <div className="mb-4 flex justify-center">
                                        <Select
                                            defaultValue="overview"
                                            variant="borderless"
                                            style={{width: 120}}
                                            onChange={(e) => {
                                                console.log(e)
                                                setSelectedFilter(e)
                                            }}
                                            size="small"
                                            options={selectOptions}
                                        />
                                    </div>}
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart
                                            data={ConvertPlanlogDdmmyy(getDatasetFromCustomPlanWithStages(customPlanWithStages, selectedFilter))}
                                            margin={{top: 20, right: 30, left: 20, bottom: 25}}>
                                            <Line type="monotone" dataKey="cigs" name="Số điếu" stroke="#14b8a6"/>
                                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                                            <XAxis dataKey="date" tick={<CustomizedAxisTick/>} interval={0}/>
                                            <YAxis/>
                                            <Tooltip/>
                                            {customPlanWithStages.length > 0 && customPlanWithStages.map((stage) => {
                                                if (!stage.logs[0]) return null
                                                return <ReferenceArea
                                                    x1={convertYYYYMMDDStrToDDMMYYYYStr(stage.logs[0].date.split('T')[0])}
                                                    x2={convertYYYYMMDDStrToDDMMYYYYStr(stage.logs[stage.logs.length - 1].date.split('T')[0])}
                                                    y1={0} y2={cigsPerDay}
                                                    label={`Giai đoạn ${stage.id + 1}`}
                                                />
                                            })}
                                        </LineChart>
                                    </ResponsiveContainer>
                                </>
                            )}

                            {from === 'coach-user' && (
                                <CustomButton type="primary" onClick={() => {
                                    if (validateCoachPlan()) handleSavePlan()
                                }}>Lưu</CustomButton>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default SetPlan;