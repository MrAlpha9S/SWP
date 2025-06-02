import React from 'react';
import {Checkbox, Collapse, Divider} from "antd";
import {useErrorStore, useGoalsStore} from "../../../stores/store.js";
import ErrorText from "../../ui/errorText.jsx";
import CustomButton from "../../ui/CustomButton.jsx";

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

const SetGoals = () => {

    const { createGoalChecked, setCreateGoalChecked, goalAmount, goalName, goalList, setGoalAmount, setGoalName, addGoal, removeGoal } = useGoalsStore();
    const { errors } = useErrorStore();

    return (
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
                <p>Hãy đặt mục tiêu cụ thể, chẳng hạn như: "Tôi sẽ dùng số tiền tiết kiệm được từ việc không hút thuốc để
                    mua một chiếc điện thoại mới", thay vì những điều chung chung như "Tôi sẽ tiết kiệm một ít tiền". Sử
                    dụng các công cụ tính toán để theo dõi tiến trình của bạn.</p>
            </div>

            {/*<div className="flex flex-col w-full bg-white">*/}
            {/*    <Collapse*/}
            {/*        className='w-[70%]' items={goalTipsCollapseItems} defaultActiveKey={['1']}*/}
            {/*    />*/}
            {/*</div>*/}

            <div className="flex flex-col gap-3 w-[70%] bg-[rgb(19,78,74)] p-8 rounded-lg text-white">
                <h3 className='font-bold text-left text-base md:text-lg flex flex-col gap-3'>Thêm mục
                    tiêu tiết kiệm</h3>
                <p className="text-left text-sm md:text-base">
                    Bạn có thể bắt đầu với một mục tiêu tiết kiệm ngắn hạn, ví dụ như tiết kiệm 3
                    triệu cho chuyến đi Đà Lạt
                </p>
                <Checkbox
                    checked={createGoalChecked}
                    onChange={() => setCreateGoalChecked(!createGoalChecked)}><span
                    className='text-white text-sm md:text-base'>Thêm mục tiêu tiết kiệm</span>
                </Checkbox>
                {createGoalChecked && (
                    <div className="w-[60%] flex flex-col gap-3">
                        <div className="flex flex-col gap-3">
                            <label htmlFor="goal" className="font-bold text-sm md:text-base">
                                Mục tiêu tiết kiệm của bạn?
                            </label>
                            <div className=''>
                                {errors.map((error, index) => {
                                    if (error.location === "goalName") {
                                        return (
                                            <ErrorText key={index}>{error.message}</ErrorText>
                                        )
                                    }
                                })}
                            </div>
                            <p className="text-xs md:text-sm">Ví dụ: tour vòng quanh Châu Âu</p>
                            <input
                                id="goal"
                                type="text"
                                onChange={e => setGoalName(e.target.value)}
                                value={goalName}
                                className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label htmlFor="moneyGoal" className="font-bold text-sm md:text-base">
                                Tổng số tiền bạn cần tiết kiệm?
                            </label>
                            <div className=''>
                                {errors.map((error, index) => {
                                    if (error.location === "goalAmount") {
                                        return (
                                            <ErrorText key={index}>{error.message}</ErrorText>
                                        )
                                    }
                                })}
                            </div>
                            <p className="block text-xs md:text-sm">Nhập vào số tiền (VND) mà bạn cần tiết kiệm</p>
                            <input
                                id="moneyGoal"
                                type="number"
                                onChange={e => setGoalAmount(Number(e.target.value))}
                                value={goalAmount}
                                className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <CustomButton type='primary' onClick={() => addGoal({goalName : goalName, goalAmount: goalAmount})}>Thêm</CustomButton>
                        <div className="font-bold text-sm md:text-base">
                            Danh sách mục tiêu đã thêm
                        </div>
                        <div className="flex flex-wrap gap-2">
                        {goalList?.map((item, index) => (
                            <div key={index} className='flex items-center gap-2'>
                            <div key={index} className='w-[200px] p-1 h-[100px] bg-white rounded-[8px]'>
                                <p className='font-bold text-sm md:text-base text-black'>
                                    {item.goalName}
                                </p>
                                <Divider/>
                                <p className='text-xs text-black'>
                                    {item.goalAmount.toLocaleString('vi-VN')}
                                </p>
                            </div>
                                <CustomButton type='primary' onClick={() => removeGoal(item)}>Xóa</CustomButton>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </div>

        </>
    );
};

export default SetGoals;