import React, {useRef, useEffect, useState} from 'react';
import Hero from "../../components/layout/signup/hero.jsx";
import {Collapse, Steps, Modal} from "antd";
import {FaArrowLeft, FaArrowRight, FaCrown} from "react-icons/fa";
import CustomButton from "../../components/ui/CustomButton.jsx";
import {FaCircleCheck} from "react-icons/fa6";
import Readiness from "../../components/layout/signup/readiness.jsx";
import Reason from "../../components/layout/signup/reason.jsx";
import CigInfo from "../../components/layout/signup/cigInfo.jsx";
import SmokingRoutine from "../../components/layout/signup/smokingRoutine.jsx";
import SetPlan from "../../components/layout/signup/setPlan.jsx";
import {
    useCigsPerPackStore, useCurrentStepStore,
    useErrorStore, useGoalsStore, usePlanStore,
    usePricePerPackStore,
    useQuitReadinessStore,
    useReasonStore, useTimeAfterWakingStore, useTimeOfDayStore, useTriggersStore, useProfileExists, useUserInfoStore
} from "../../stores/store.js";
import {onboardingErrorMsg} from "../../constants/constants.js";
import SetGoals from "../../components/layout/signup/setGoals.jsx";
import Summary from "../../components/layout/signup/summary.jsx";
import {useNavigate, useParams} from "react-router-dom";
import ModalFooter from "../../components/ui/modalFooter.jsx";
import {useAuth0} from "@auth0/auth0-react";
import PremiumBadge from "../../components/ui/premiumBadge.jsx";

const planTipsCollapseItems = [
    {
        key: '1',
        label: 'Một số gợi ý',
        children: <div className="text-left w-full h-full bg-white px-4 text-sm md:text-base">

            <p>Trước tiên, hãy trả lời một vài câu hỏi về lịch sử hút thuốc của bạn và lý do bạn muốn cai thuốc.</p>
            <p>Tiếp theo, hãy chọn những gì phù hợp với bạn:</p>
            <p>- Cách bạn muốn cai thuốc</p>
            <p>- Mục tiêu của bạn</p>
            <p>- Ngày bắt đầu của bạn</p>
            <p>Chúng tôi sẽ sử dụng câu trả lời của bạn để xây dựng một kế hoạch cai thuốc cá nhân hóa.</p>
            <p>Muốn lưu kế hoạch trực tuyến? Hãy thêm nó vào tài khoản của bạn – hoặc nếu bạn chưa có, chúng
                tôi sẽ giúp bạn tạo một tài khoản mới.</p>

        </div>,
    }
];


const Onboarding = () => {
    const {currentStep, setCurrentStep} = useCurrentStepStore();

    const errorMap = React.useMemo(() => {
        const map = {};
        onboardingErrorMsg.forEach(err => {
            map[err.location] = err;
        });
        return map;
    }, []);

    const {readinessValue} = useQuitReadinessStore();
    const {addError, removeError} = useErrorStore();
    const {reasonList} = useReasonStore();
    const {pricePerPack} = usePricePerPackStore();
    const {cigsPerPack} = useCigsPerPackStore();
    const {timeAfterWaking} = useTimeAfterWakingStore();
    const {timeOfDayList, customTimeOfDay, customTimeOfDayChecked} = useTimeOfDayStore();
    const {triggers, customTrigger, customTriggerChecked} = useTriggersStore();
    const {startDate, cigsPerDay, quittingMethod, cigsReduced, expectedQuitDate, stoppedDate} = usePlanStore();
    const {createGoalChecked, goalAmount, goalList} = useGoalsStore()
    const navigate = useNavigate();
    const {isProfileExist} = useProfileExists();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {user, isAuthenticated} = useAuth0();
    const {userInfo} = useUserInfoStore();

    const {from} = useParams();

    useEffect(() => {
        if (isProfileExist) {
            if (from) {
                if (from === 'savings') {
                    setCurrentStep(2);
                } else if (from === 'progress-board-startdate' || from === 'progress-board-plan') {
                    setCurrentStep(0);
                } else {
                    setCurrentStep(6)
                }
                setIsModalOpen(true);
            } else {
                setCurrentStep(6)
                setIsModalOpen(true);
            }
        }
        if (from === 'newUser') {
            setCurrentStep(6);
        }
    }, [])

    const stepsItems = React.useMemo(() => [
        {title: 'Bắt đầu'},
        {title: 'Động lực'},
        {title: 'Thông tin thuốc'},
        {
            title: 'Thói quen',
        },
        {
            title: 'Mục tiêu',
        },
        {
            title: readinessValue === 'ready' ? 'Lên kế hoạch' : 'Kết quả & theo dõi',
            icon: (userInfo && userInfo.sub_id === 1 || !userInfo) &&
                <div className='relative h-6 w-20'><FaCrown/> <PremiumBadge className='absolute top-[-10px] right-2'/>
                </div>,
        },
        {
            title: 'Tổng kết',
            icon: <FaCircleCheck className="size-8"/>,
        },
    ], [readinessValue]);

    const toPreviousPage = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };


    const toNextPage = () => {
        if (currentStep <= 8) {
            switch (currentStep) {
                case 0: {
                    const errorMsg = errorMap["readinessRadio"]
                    if (readinessValue.length === 0) {
                        addError(errorMsg)
                        return;
                    } else {
                        removeError(errorMsg)
                        setCurrentStep(currentStep + 1)
                    }
                    break;
                }
                case 1: {
                    const errorMsg = errorMap["reasonCheckbox"]
                    if (reasonList.length < 3) {
                        addError(errorMsg)
                    } else {
                        removeError(errorMsg)
                        setCurrentStep(currentStep + 1)
                    }
                    break;
                }
                case 2: {
                    const errorMsgPricePerPack = errorMap["pricePerPack"]
                    const errorMsgCigsPerPack = errorMap["cigsPerPack"]
                    const errorMsgCigsPerDay = errorMap["cigsPerDay"]
                    if (pricePerPack <= 0) {
                        addError(errorMsgPricePerPack)
                    } else {
                        removeError(errorMsgPricePerPack)
                    }
                    if (cigsPerPack <= 0 || !Number.isInteger(cigsPerPack)) {
                        addError(errorMsgCigsPerPack)
                    } else {
                        removeError(errorMsgCigsPerPack)
                    }
                    //if (readinessValue === 'relapse-support') {
                    if (cigsPerDay <= 0 || !Number.isInteger(cigsPerDay)) {
                        addError(errorMsgCigsPerDay)
                    } else {
                        removeError(errorMsgCigsPerDay)
                    }
                    if (pricePerPack > 0 && cigsPerPack > 0 && Number.isInteger(cigsPerPack) && cigsPerDay > 0 && Number.isInteger(cigsPerDay)) {
                        setCurrentStep(currentStep + 1)
                    }
                    // } else {
                    //     if (pricePerPack > 0 && cigsPerPack > 0 && Number.isInteger(cigsPerPack)) {
                    //         setCurrentStep(currentStep + 1)
                    //     }
                    // }
                    break;
                }
                case 3: {
                    const errorMsgTimeAfterWaking = errorMap["timeAfterWaking"];
                    const errorMsgTimeOfDay = errorMap["timeOfDay"];
                    const errorMsgTriggers = errorMap["triggers"];
                    const errorMsgCustomTimeOfDay = errorMap["customTimeOfDay"];
                    const errorMsgCustomTrigger = errorMap["customTrigger"];

                    if (timeAfterWaking.length === 0) {
                        addError(errorMsgTimeAfterWaking)
                    } else {
                        removeError(errorMsgTimeAfterWaking)
                    }
                    if (timeOfDayList.length === 0) {
                        addError(errorMsgTimeOfDay)
                    } else {
                        removeError(errorMsgTimeOfDay)
                    }
                    if (customTimeOfDayChecked && customTimeOfDay.length === 0) {
                        addError(errorMsgCustomTimeOfDay)
                    } else {
                        removeError(errorMsgCustomTimeOfDay)
                    }
                    if (triggers.length === 0) {
                        addError(errorMsgTriggers)
                    } else {
                        removeError(errorMsgTriggers)
                    }
                    if (customTriggerChecked && customTrigger.length === 0) {
                        addError(errorMsgCustomTrigger)
                    } else {
                        removeError(errorMsgCustomTrigger)
                    }

                    if (
                        timeAfterWaking.length !== 0 &&
                        timeOfDayList.length !== 0 &&
                        triggers.length !== 0 &&
                        (!customTriggerChecked || (customTriggerChecked && customTrigger.length !== 0)) &&
                        (!customTimeOfDayChecked || (customTimeOfDayChecked && customTimeOfDay.length !== 0))
                    ) {
                        setCurrentStep(currentStep + 1);
                    }
                    break;
                }
                case 5: {
                    const errorMsgStartDate = errorMap["startDate"];
                    const errorMsgCigsPerDay = errorMap["cigsPerDay"];
                    const errorMsgQuitMethod = errorMap["quitMethod"];
                    const errorMsgCigsReduced = errorMap["cigsReduced"];
                    const errorMsgExpectedQuitDate = errorMap["expectedQuitDate"];
                    const errorMsgStoppedDate = errorMap["stoppedDate"];
                    const errorMsgCigsReducedLarge = errorMap["cigsReducedLarge"]

                    if (readinessValue === 'ready') {
                        if (startDate.length === 0) {
                            addError(errorMsgStartDate)
                        } else {
                            removeError(errorMsgStartDate)
                        }
                        if (cigsPerDay <= 0 || !Number.isInteger(cigsPerDay)) {
                            addError(errorMsgCigsPerDay)
                        } else {
                            removeError(errorMsgCigsPerDay)
                        }
                        if (quittingMethod.length === 0) {
                            addError(errorMsgQuitMethod)
                        } else {
                            removeError(errorMsgQuitMethod)
                        }
                        if (cigsReduced > cigsPerDay) {
                            addError(errorMsgCigsReducedLarge)
                        } else {
                            removeError(errorMsgCigsReducedLarge)
                        }
                        if (quittingMethod === 'target-date') {
                            if (expectedQuitDate.length === 0) {
                                addError(errorMsgExpectedQuitDate);
                            } else {
                                removeError(errorMsgExpectedQuitDate);
                            }
                            removeError(errorMsgCigsReduced);
                        } else {
                            if (cigsReduced <= 0 || !Number.isInteger(cigsReduced)) {
                                addError(errorMsgCigsReduced);
                            } else {
                                removeError(errorMsgCigsReduced);
                            }
                            removeError(errorMsgExpectedQuitDate);
                        }
                        if (startDate.length > 0 &&
                            cigsPerDay > 0 &&
                            quittingMethod.length > 0 &&
                            ((quittingMethod !== 'target-date' && cigsReduced > 0 && Number.isInteger(cigsReduced)) || (quittingMethod === 'target-date' && expectedQuitDate.length > 0))) {
                            setCurrentStep(currentStep + 1)
                        }
                    } else {
                        if (stoppedDate.length === 0) {
                            addError(errorMsgStoppedDate)
                        } else {
                            removeError(errorMsgStoppedDate)
                        }
                        if (stoppedDate.length > 0) {
                            setCurrentStep(currentStep + 1)
                        }
                    }


                    break;
                }
                case 4: {
                    const errorMsgGoalAmount = errorMap["goalAmount"];
                    const errorMsgGoalList = errorMap["goalList"];
                    if (createGoalChecked) {
                        if (goalList.length === 0) {
                            addError(errorMsgGoalList);
                            if (goalAmount <= 0) {
                                addError(errorMsgGoalAmount);
                            }
                            if (goalList.length > 0 && goalAmount > 0) {
                                setCurrentStep(currentStep + 1)
                            } else {
                                setCurrentStep(currentStep + 1)
                            }
                        } else {
                            setCurrentStep(currentStep + 1)
                        }
                        break;
                    }
                }
            }
        }
    }

    useEffect(() => {
        if (readinessValue.length > 0) {
            removeError(errorMap["readinessRadio"]);
        }
    }, [readinessValue]);

    useEffect(() => {
        if (reasonList.length >= 3) {
            removeError(errorMap["reasonCheckbox"]);
        }
    }, [reasonList]);

    useEffect(() => {
        if (pricePerPack > 0) {
            removeError(errorMap["pricePerPack"]);
        }
    }, [pricePerPack]);

    useEffect(() => {
        if (cigsPerDay > 0 || Number.isInteger(cigsPerDay)) {
            removeError(errorMap["cigsPerDay"]);
        }
    }, [cigsPerDay]);

    useEffect(() => {
        if (timeAfterWaking.length > 0) {
            removeError(errorMap["timeAfterWaking"]);
        }
    }, [timeAfterWaking]);

    useEffect(() => {
        if (timeOfDayList.length > 0) {
            removeError(errorMap["timeOfDay"]);
        }
    }, [timeOfDayList]);

    useEffect(() => {
        if (customTimeOfDayChecked) {
            if (customTimeOfDay.length > 0) {
                removeError(errorMap["customTimeOfDay"]);
            }
        }
    }, [customTimeOfDay])

    useEffect(() => {
        if (customTriggerChecked) {
            if (customTrigger.length > 0) {
                removeError(errorMap["customTrigger"]);
            }
        }
    }, [customTrigger])

    useEffect(() => {
        if (triggers.length > 0) {
            removeError(errorMap["triggers"]);
        }
    }, [triggers]);

    useEffect(() => {
        if (startDate.length > 0) {
            removeError(errorMap["startDate"]);
        }
    }, [startDate]);

    useEffect(() => {
        if (cigsPerPack > 0 && Number.isInteger(cigsPerPack)) {
            removeError(errorMap["cigsPerPack"]);
        }
    }, [cigsPerPack]);

    useEffect(() => {
        if (quittingMethod.length > 0) {
            removeError(errorMap["quitMethod"]);
        }
    }, [quittingMethod]);

    useEffect(() => {
        if (cigsReduced > 0 || cigsReduced < cigsPerDay) {
            removeError(errorMap["cigsReduced"]);
        }
    }, [cigsReduced]);

    useEffect(() => {
        if (cigsReduced < cigsPerDay) {
            removeError(errorMap["cigsReducedLarge"]);
        }
    }, [cigsReduced]);

    useEffect(() => {
        if (expectedQuitDate.length > 0) {
            removeError(errorMap["expectedQuitDate"]);
        }
    }, [expectedQuitDate]);

    useEffect(() => {
        if (createGoalChecked) {
            if (goalList.length > 0) {
                removeError(errorMap["goalList"]);
            }
        }
    }, [goalList]);

    useEffect(() => {
        if (createGoalChecked) {
            if (goalAmount > 0) {
                removeError(errorMap["goalAmount"]);
            }
        }
    }, [goalAmount]);

    const onChangeSteps = value => {
        if (value === 8)
            setCurrentStep(value - 1);
        else
            setCurrentStep(value);
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
    }, [currentStep]);

    const handleSave = () => {
        if (!user || !isAuthenticated) {
            const timeout = setTimeout(() => {
                if (!scrollRef.current) return
                const yOffset = -130;
                const y = scrollRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }, 100)
            return () => {
                clearTimeout(timeout);
            }
        } else {
            navigate('/post-onboarding')
        }
    }

    const scrollRef = useRef(null);
    return (
        <div className='w-full bg-white'>
            <div className='flex flex-col'>
                <Modal
                    title="Kế hoạch đã tồn tại"
                    closable={{'aria-label': 'Custom Close Button'}}
                    open={isModalOpen}
                    onOk={() => setIsModalOpen(false)}
                    onCancel={() => navigate('/')}
                    centered
                    maskClosable
                    closeIcon={null}
                    footer={<ModalFooter cancelText='Trở lại' okText='Tôi đã hiểu'
                                         onOk={() => setIsModalOpen(false)}
                                         onCancel={() => {
                                             setIsModalOpen(false)
                                             navigate('/')
                                         }}/>}
                >
                    <p>
                        Bạn đã có một kế hoạch trước đó. Nếu bạn <strong>thực hiện thay đổi</strong> và
                        nhấn <strong>'Hoàn
                        tất'</strong>, kế hoạch mới <strong>sẽ thay thế</strong> kế hoạch cũ.
                    </p>
                    <p>
                        Nếu bạn muốn giữ lại kế hoạch cũ, hãy nhấn <strong>'Trở lại'</strong> để quay về trang chủ.
                    </p>


                </Modal>
                <Hero/>
                <div className='flex flex-col mx-auto max-w-[1280px] bg-white'>
                    <div className='flex flex-col h-full  gap-14 p-14'>

                        {currentStep !== 6 &&
                            <div className="flex flex-col w-full bg-white">
                                <Collapse
                                    className='w-[70%]' items={planTipsCollapseItems} defaultActiveKey={['1']}
                                />
                            </div>
                        }

                        <Steps
                            ref={scrollRef}
                            className='bg-white'
                            current={currentStep}
                            onChange={onChangeSteps}
                            labelPlacement="vertical"
                            items={stepsItems}
                        />

                        <div className='flex flex-col gap-8 bg-white'>
                            {currentStep === 0 && <Readiness/>}
                            {currentStep === 1 && <Reason/>}
                            {currentStep === 2 && <CigInfo/>}
                            {currentStep === 3 && <SmokingRoutine/>}
                            {currentStep === 4 && <SetGoals/>}
                            {currentStep === 5 && <SetPlan/>}
                            {currentStep === 6 && <Summary/>}
                        </div>
                        <div className='flex justify-between gap-5 w-full'>
                            {currentStep !== 0 && (
                                <CustomButton type="secondary" onClick={() => toPreviousPage()}>
                                    Trở lại <FaArrowLeft/>
                                </CustomButton>
                            )}
                            <CustomButton className='next-btn' type="primary" onClick={() => {
                                currentStep !== 6 ? toNextPage() : handleSave();
                            }}>
                                {currentStep !== 6 ? <>Tiếp tục <FaArrowRight/></> : 'Hoàn tất'}
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
};

export default Onboarding;