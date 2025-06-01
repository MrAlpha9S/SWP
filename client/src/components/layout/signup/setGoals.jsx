import React from 'react';
import {Checkbox, Collapse} from "antd";

const SetGoals = () => {
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
    );
};

export default SetGoals;