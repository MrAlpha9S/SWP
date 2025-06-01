import React, {useState, useRef, useEffect} from 'react';
import Hero from "../../components/layout/signup/hero.jsx";
import {Radio, Collapse, Steps, Checkbox} from "antd";
import {FaArrowLeft, FaArrowRight, FaCheck} from "react-icons/fa";
import CustomButton from "../../components/ui/CustomButton.jsx";
import {FaCircleCheck} from "react-icons/fa6";
import Readiness from "../../components/layout/signup/readiness.jsx";
import Reason from "../../components/layout/signup/reason.jsx";
import CigInfo from "../../components/layout/signup/cigInfo.jsx";
import SmokingRoutine from "../../components/layout/signup/smokingRoutine.jsx";
import StartDate from "../../components/layout/signup/startDate.jsx";
import {useErrorStore, usePricePerPackStore, useQuitReadinessStore, useReasonStore} from "../../stores/store.js";

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

const goalTipsCollapseItems = [
    {
        key: '1',
        label: 'Mẹo để đặt mục tiêu',
        children: <div className="text-left w-full h-full bg-white px-4 text-sm md:text-base">
            <p><strong>Mục tiêu tiết kiệm</strong></p>
            <p>Hãy đặt mục tiêu cụ thể, chẳng hạn như: "Tôi sẽ dùng số tiền tiết kiệm được từ việc không hút thuốc để
                mua một chiếc điện thoại mới", thay vì những điều chung chung như "Tôi sẽ tiết kiệm một ít tiền". Sử
                dụng các công cụ tính toán để theo dõi tiến trình của bạn.</p>

            <p><strong>Mục tiêu về sức khỏe</strong></p>
            <p>Hãy đặt mục tiêu rõ ràng, ví dụ: "Tôi sẽ đi bộ 20 phút, 3 lần mỗi tuần trong vòng một tháng", thay vì
                những câu mơ hồ như "Tôi sẽ trở nên khỏe mạnh". Đảm bảo rằng mục tiêu của bạn là khả thi.</p>

            <p><strong>Mục tiêu ngắn hạn</strong></p>
            <p>Tăng sự tự tin trong giai đoạn đầu cai thuốc bằng cách đặt ra các mục tiêu ngắn hạn. Ví dụ, tiết kiệm 2.5
                triệu đồng cho một buổi tối đi chơi, hoặc đi bộ vào giờ nghỉ trưa 10 phút, hai lần mỗi tuần.</p>

            <p>Nếu bạn là thành viên đã đăng ký của iCanQuit, bạn có thể thêm nhiều mục tiêu hơn hoặc điều chỉnh các mục
                tiêu hiện tại trong bảng điều khiển Kế hoạch Cai thuốc của mình.</p>

        </div>
    }
]

const stepsItems = [
    {
        title: 'Bắt đầu',
    },
    {
        title: 'Động lực',
    },
    {
        title: 'Thông tin thuốc',
    },
    {
        title: 'Thói quen',
    },
    {
        title: 'Ngày bắt đầu',
    },
    {
        title: 'Mục tiêu',
    },
    {
        title: 'Tổng kết',
        icon: <FaCircleCheck className="size-8"/>
    },
]

const Onboarding = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [savingGoalChecked, setSavingGoalChecked] = useState(false);
    const {readinessValue} = useQuitReadinessStore();
    const {addError, removeError} = useErrorStore();
    const {reasonList} = useReasonStore();
    const {pricePerPack} = usePricePerPackStore();


    const toPreviousPage = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    }

    const toNextPage = () => {
        if (currentStep <= 8) {
            switch(currentStep) {
                case 0: {
                    const errorMsg = {atPage: "readiness", location: "readinessRadio", message: "Vui lòng chọn 1"}
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
                    const errorMsg = {atPage: "reason", location: "reasonCheckbox", message: "Vui lòng chọn ít nhất 3 lý do"}
                    if (reasonList.length < 3) {
                        addError(errorMsg)
                    } else {
                        removeError(errorMsg)
                        setCurrentStep(currentStep + 1)
                    }
                    break;
                }
                case 2: {
                    const errorMsgPricePerPack = {atPage: "cigInfo", location: "pricePerPack", message: "Giá tiền không hợp lệ"}
                    const errorMsgCigsPerPack = {atPage: "cigInfo", location: "cigsPerPack", message: "Số điếu không hợp lệ"}
                    const errorMsgCigsPerDay = {atPage: "cigInfo", location: "cigsPerDay", message: "Số điếu không hợp lệ"}

                }
            }
        }
    }

    useEffect(() => {
        if (readinessValue.length > 0) {
            removeError({
                atPage: "readiness",
                location: "readinessRadio",
                message: "Vui lòng chọn 1"
            });
        }
        if (reasonList.length >= 3) {
            removeError({
                atPage: "reason",
                location: "reasonCheckbox",
                message: "Vui lòng chọn ít nhất 3 lý do"
            })
        }
    }, [readinessValue, reasonList, removeError]);

    // const onChangeSteps = value => {
    //     if (value === 8)
    //         setCurrentStep(value - 1);
    //     else
    //         setCurrentStep(value);
    // };

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

    const [value, setValue] = useState(1);
    const onChangeCheckbox = event => {
        setValue(event.target.value);
    }
    const savingGoalOnChange = e => {
        setSavingGoalChecked(!savingGoalChecked);
    };
    const scrollRef = useRef(null);
    return (
        <>
            <Hero/>
            <div className='flex flex-col h-full bg-white gap-14 p-14'>

                <div className="flex flex-col w-full bg-white">
                    <Collapse
                        className='w-[70%]' items={planTipsCollapseItems} defaultActiveKey={['1']}
                    />
                </div>


                <Steps
                    ref={scrollRef}
                    className='bg-white'
                    current={currentStep}
                    // onChange={onChangeSteps}
                    labelPlacement="vertical"
                    items={stepsItems}
                />

                <div className='flex flex-col gap-14 bg-white'>
                    {currentStep === 0 && <Readiness/>}
                    {currentStep === 1 && <Reason/>}
                    {currentStep === 2 && <CigInfo/>}
                    {currentStep === 3 && <SmokingRoutine/>}
                    {currentStep === 4 && <StartDate/>}
                    {currentStep === 5 && (
                        <>
                            <h2 className="text-left md:text-4xl lg:text-5xl font-bold">
                                6. Đề ra mục tiêu
                            </h2>

                            <div className="text-left text-sm md:text-base">
                                <p>
                                    Đặt mục tiêu có thể giúp bạn duy trì động lực và khiến việc cai thuốc trở nên khả
                                    thi hơn.
                                    Mục tiêu cũng giúp bạn có điều gì đó để mong chờ trong hành trình sống không thuốc
                                    lá.
                                    Hãy bắt đầu bằng cách đặt mục tiêu cho việc tiết kiệm.
                                </p>
                            </div>

                            <div className="flex flex-col w-full bg-white">
                                <Collapse
                                    className='w-[70%]' items={goalTipsCollapseItems} defaultActiveKey={['1']}
                                />
                            </div>

                            <div className="flex flex-col gap-3 w-[70%] bg-[rgb(19,78,74)] p-8 rounded-lg text-white">
                                <h3 className='font-bold text-left text-base md:text-lg flex flex-col gap-3'>Thêm mục
                                    tiêu tiết kiệm</h3>
                                <p className="text-left text-sm md:text-base">
                                    Bạn có thể bắt đầu với một mục tiêu tiết kiệm ngắn hạn, ví dụ như tiết kiệm 3
                                    triệu cho chuyến đi Đà Lạt
                                </p>
                                <Checkbox onChange={() => savingGoalOnChange()}><span
                                    className='text-white text-sm md:text-base'>Thêm mục tiêu tiết kiệm</span>
                                </Checkbox>
                                {savingGoalChecked && (
                                    <form className="w-[60%] flex flex-col gap-3">
                                        <div className="flex flex-col gap-3">
                                            <label htmlFor="goal" className="font-bold text-sm md:text-base">
                                                Mục tiêu tiết kiệm của bạn?
                                            </label>
                                            <p className="text-xs md:text-sm">Ví dụ: tour vòng quanh Châu Âu</p>
                                            <input
                                                id="goal"
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <label htmlFor="moneyGoal" className="font-bold text-sm md:text-base">
                                                Tổng số tiền bạn cần tiết kiệm?
                                            </label>
                                            <p className="block text-xs md:text-sm">Nhập vào số tiền (VND) mà bạn cần
                                                tiết kiệm</p>
                                            <input
                                                id="moneyGoal"
                                                type="number"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </form>
                                )}
                            </div>

                        </>
                    )}
                </div>
                <div className='flex justify-between gap-5 w-full'>
                    {currentStep !== 0 && (
                        <CustomButton type="secondary" onClick={() => toPreviousPage()}>
                            Trở lại <FaArrowLeft/>
                        </CustomButton>
                    )}
                    <CustomButton type="primary" onClick={() => toNextPage()}>
                        Tiếp tục <FaArrowRight/>
                    </CustomButton>
                </div>
            </div>
        </>
    )
};

export default Onboarding;