import React, {useState, useRef, useEffect} from 'react';
import Hero from "../../components/layout/signup/hero.jsx";
import {Radio, Collapse, Steps, Checkbox} from "antd";
import {FaArrowLeft, FaArrowRight, FaCheck} from "react-icons/fa";
import CustomButton from "../../components/ui/CustomButton.jsx";
import {FaCircleCheck} from "react-icons/fa6";

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

const checkboxStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
};

const Onboarding = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [savingGoalChecked, setSavingGoalChecked] = useState(false);
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
                    onChange={onChangeSteps}
                    labelPlacement="vertical"
                    items={stepsItems}
                />

                <div className='flex flex-col gap-14 bg-white'>
                    {currentStep === 0 && (
                        <>
                            <h2 className='text-left md:text-4xl lg:text-5xl font-bold'>1. Bạn đã sẵn sàng bỏ thuốc
                                chưa?</h2>
                            <Radio.Group
                                onChange={onChangeCheckbox}
                                value={value}
                                options={[
                                    {value: 1, label: 'Tôi đã sẵn sàng'},
                                    {value: 2, label: 'Tôi đã cai thuốc nhưng vẫn cần hỗ trợ để duy trì'},
                                    {
                                        value: 3,
                                        label: 'Tôi đang nghĩ đến chuyện cai thuốc nhưng chưa sẵn sàng ngay bây giờ'
                                    },
                                ]}
                                size={"large"}
                                style={checkboxStyle}
                            />
                        </>
                    )}
                    {currentStep === 1 && (
                        <>
                            <h2 className='text-left md:text-4xl lg:text-5xl font-bold'>2. Động lực bỏ thuốc của
                                bạn</h2>
                            <div className='text-left text-sm md:text-base'>
                                <p>Có rất nhiều lý do tốt để bỏ thuốc lá, nhưng những lý do quan trọng nhất đối với bạn
                                    sẽ giúp bạn duy trì động lực. Việc chọn ra 3 lý do hàng đầu sẽ giúp bạn dễ dàng tập
                                    trung và nhắc nhở bạn tại sao bạn lại quyết định thay đổi này. Hãy chọn những lý do
                                    mà bạn thấy phù hợp – bạn có thể quay lại và cập nhật chúng bất cứ lúc nào.</p>
                            </div>
                            <div className='text-left font-bold text-base md:text-lg'>
                                <h3>Hãy chọn 3 lý do quan trọng nhất để bỏ thuốc</h3>
                            </div>
                            <div className='flex flex-col gap-3'>
                                <Checkbox>Lý do sức khỏe</Checkbox>
                                <Checkbox>Lý do thể chất</Checkbox>
                                <Checkbox>Chi phí mua thuốc lá</Checkbox>
                                <Checkbox>Lý do mang thai</Checkbox>
                                <Checkbox>Muốn được nhìn thấy con cái khôn lớn</Checkbox>
                                <Checkbox>Không muốn việc hút thuốc của mình ảnh hưởng đến con</Checkbox>
                                <Checkbox>Ảnh hưởng của việc hút thuốc đến sức khỏe gia đình</Checkbox>
                                <Checkbox>Được người thân, bạn bè hoặc bạn đời khuyên nhủ/giục giã</Checkbox>
                                <Checkbox>Được bác sĩ hoặc chuyên gia y tế tư vấn</Checkbox>
                                <Checkbox>Quảng cáo chống hút thuốc</Checkbox>
                                <Checkbox>Tôi không còn thấy việc hút thuốc thú vị nữa</Checkbox>
                                <Checkbox>Các quy định cấm hút thuốc ở nơi công cộng</Checkbox>
                                <Checkbox>Cảnh báo sức khỏe trên bao thuốc</Checkbox>
                                <Checkbox>Lý do khác</Checkbox>
                            </div>
                        </>
                    )}
                    {currentStep === 2 && (
                        <>
                            <h2 className='text-left md:text-4xl lg:text-5xl font-bold'>3. Thông tin về thuốc lá bạn sử
                                dụng</h2>
                            <form className="w-[60%] flex flex-col gap-3">
                                <div>
                                    <label htmlFor="pricePerPack" className="block text-sm md:text-base mb-1">
                                        Một gói thuốc bạn thường hút có giá bao nhiêu?
                                    </label>
                                    <input
                                        id="pricePerPack"
                                        type="number"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="cigsPerPack"
                                           className="block text-sm md:text-base text-gray-700 mb-1">
                                        Có bao nhiêu điếu trong một gói thuốc bạn thường hút?
                                    </label>
                                    <input
                                        id="cigsPerPack"
                                        type="number"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="interval" className="block text-sm md:text-base text-gray-700 mb-1">
                                        Bạn thường hút bao nhiêu điếu?
                                    </label>
                                    <div className='flex gap-1'>
                                        <select

                                            id="interval"
                                            name="interval"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="day">Ngày</option>
                                            <option value="month">Tháng</option>
                                            <option value="year">Năm</option>
                                        </select>
                                        <input
                                            id="cigsPerInterval"
                                            type="number"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                            </form>
                        </>
                    )}
                    {currentStep === 3 && (
                        <>
                            <h2 className="text-left md:text-4xl lg:text-5xl font-bold">
                                4. Những yếu tố kích thích bạn hút thuốc
                            </h2>

                            <div className="text-left text-sm md:text-base">
                                <p>
                                    Việc hiểu rõ khi nào và tại sao bạn hút thuốc sẽ giúp bạn tìm ra cách tốt
                                    nhất để cai. Bằng cách xác định các yếu tố kích thích, bạn có thể lên kế hoạch
                                    trước,
                                    thay đổi thói quen và tăng cơ hội thành công.
                                </p>
                            </div>

                            <div className="mt-8 text-left font-bold text-base md:text-lg">
                                <h3>Bạn thường hút thuốc bao lâu sau khi thức dậy?</h3>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Radio.Group style={checkboxStyle}>
                                    <Radio value="within_5">Trong vòng 5 phút</Radio>
                                    <Radio value="6_30">Từ 6 đến 30 phút</Radio>
                                    <Radio value="31_60">Từ 31 đến 60 phút</Radio>
                                    <Radio value="after_60">Sau 60 phút</Radio>
                                    <Radio value="midday">Giữa trưa</Radio>
                                </Radio.Group>
                            </div>

                            <div className="mt-8 text-left font-bold text-base md:text-lg">
                                <h3>Bạn thường hút thuốc vào thời điểm nào trong ngày?
                                    <span className="font-normal block text-sm">(Chọn tất cả những gì phù hợp)</span>
                                </h3>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Checkbox>Ngay sau khi thức dậy</Checkbox>
                                <Checkbox>Bữa ăn sáng</Checkbox>
                                <Checkbox>Sau bữa trưa</Checkbox>
                                <Checkbox>Bữa ăn chiều</Checkbox>
                                <Checkbox>Giờ giải lao tại nơi làm việc</Checkbox>
                                <Checkbox>Ngay sau giờ làm</Checkbox>
                                <Checkbox>Trước bữa tối</Checkbox>
                                <Checkbox>Sau bữa tối</Checkbox>
                                <Checkbox>Buổi tối</Checkbox>
                                <Checkbox>Trước khi đi ngủ</Checkbox>
                                <Checkbox>Khác</Checkbox>
                            </div>

                            <div className="mt-8 text-left font-bold text-base md:text-lg">
                                <h3>Những điều nào dưới đây khiến bạn muốn hút thuốc?
                                    <span className="font-normal block text-sm">(Chọn tất cả những gì phù hợp)</span>
                                </h3>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Checkbox>Uống rượu</Checkbox>
                                <Checkbox>Uống cà phê hoặc trà</Checkbox>
                                <Checkbox>Lái xe</Checkbox>
                                <Checkbox>Cảm thấy căng thẳng</Checkbox>
                                <Checkbox>Cảm thấy buồn chán</Checkbox>
                                <Checkbox>Khi ăn hoặc sau khi ăn</Checkbox>
                                <Checkbox>Sau khi quan hệ tình dục</Checkbox>
                                <Checkbox>Khi lập kế hoạch làm việc tiếp theo</Checkbox>
                                <Checkbox>Để tự thưởng cho bản thân</Checkbox>
                                <Checkbox>Khi ở cùng người hút thuốc hoặc vape</Checkbox>
                                <Checkbox>Khi sử dụng điện thoại hoặc máy tính</Checkbox>
                                <Checkbox>Tiệc tùng</Checkbox>
                                <Checkbox>Tôi hút bất cứ khi nào có cơ hội</Checkbox>
                                <Checkbox>Khác</Checkbox>
                            </div>
                        </>
                    )}
                    {currentStep === 4 && (
                        <>
                            <h2 className="text-left md:text-4xl lg:text-5xl font-bold">
                                5. Chọn ngày bắt đầu
                            </h2>

                            <div className="text-left text-sm md:text-base">
                                <p>
                                    Ngày bắt đầu của bạn là ngày bạn sẽ cai thuốc, và việc đặt ra một ngày cụ thể sẽ
                                    giúp bạn đi đúng hướng.
                                    Chúng tôi khuyên bạn nên chọn một ngày trong vòng 2 tuần tới.
                                    Hãy chọn một ngày mà:
                                    <br/>
                                    - Bạn sẽ ít căng thẳng hoặc áp lực hơn. <br/>
                                    - Bạn ít có khả năng tiếp xúc với người khác đang hút thuốc. <br/>
                                    - Kế hoạch của bạn sẽ bao gồm nhiều mẹo giúp bạn chuẩn bị cho một khởi đầu vững chắc
                                    hơn.
                                </p>
                            </div>

                            <div className='text-left font-bold text-base md:text-lg'>
                                <h3>Hãy chọn ngày mà bạn quyết định ngừng hút</h3>
                            </div>

                            <form className="w-[60%] flex flex-col gap-3">
                                <div>
                                    <input
                                        id="stopDate"
                                        type="date"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </form>

                        </>
                    )}
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
                                            <p className="block text-xs md:text-sm">Nhập vào số tiền (VND) mà bạn cần tiết kiệm</p>
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
                        <CustomButton type="secondary" onClick={() => onChangeSteps(currentStep - 1)}>
                            Trở lại <FaArrowLeft/>
                        </CustomButton>
                    )}
                    <CustomButton type="primary" onClick={() => onChangeSteps(currentStep + 1)}>
                        Tiếp tục <FaArrowRight/>
                    </CustomButton>
                </div>
            </div>
        </>
    )
};

export default Onboarding;