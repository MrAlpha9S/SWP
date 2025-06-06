import React, { useState } from 'react';
import { Button, message, Steps, theme, Radio } from 'antd';
import { useCheckInDataStore, useStepCheckInStore } from '../../../stores/checkInStore';

const CheckInStepOne = () => {
    const { handleStepOneNo, handleStepOneYes } = useStepCheckInStore();

    const { checkInDate, setCheckInDate, feel, setFeel } = useCheckInDataStore();

    const handleDateChange = (event) => {
        const selectedDate = new Date(event.target.value);
        const today = new Date()
        if (selectedDate >= today) {
            setCheckInDate(today.toISOString().split('T')[0]);
        } else {
            setCheckInDate(event.target.value);
        }
    };
    const FEELINGS = [
        { value: 'terrible', emoji: '😞', label: 'Tệ' },
        { value: 'bad', emoji: '☹️', label: 'Buồn' },
        { value: 'okay', emoji: '😐', label: 'Ổn' },
        { value: 'good', emoji: '😊', label: 'Tốt' },
        { value: 'great', emoji: '😃', label: 'Tuyệt' },
    ];
    const handleFeelChange = e => {
        setFeel(e.target.value);
    };
    return (
        <div class="bg-white max-w-xl mx-auto p-6 rounded-xl shadow-sm text-center">

            <p class="text-gray-600 mb-6">Check-in hàng ngày để theo dõi tiến trình của bạn và duy trì động lực trên hành trình cai thuốc lá.</p>

            <div class="mb-6 text-left">
                <label class="block text-sm font-medium text-gray-700 mb-1">Ngày Check-in</label>
                <p class="text-xs text-gray-500 mb-1">Bạn có thể chọn ngày trước đó.</p>
                <input
                    type="date"
                    value={checkInDate}
                    onChange={handleDateChange}
                    class="w-full border border-primary-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div class="mb-6 pb-10">
                <p class="font-semibold text-gray-800 mb-3">Hôm nay bạn cảm thấy thế nào?</p>
                <Radio.Group
                    className="flex justify-between items-center gap-3 max-w-md mx-auto"
                    value={feel}
                    onChange={handleFeelChange}
                >
                    {FEELINGS.map(({ value, emoji, label }) => (

                        <Radio.Button
                            key={value}
                            value={value}
                            className={`flex flex-col items-center rounded-lg ${feel === value
                                ? 'text-primary-300 border-primary-300'
                                : 'text-gray-500 hover:border-primary-600'
                                }`}
                        >
                            <span className="text-2xl">{emoji}</span>
                            <span className="text-sm mt-1">{label}</span>
                        </Radio.Button>
                    ))}
                </Radio.Group>
            </div>


            <div>
                <p class="font-semibold text-gray-800 mb-3">Hôm nay bạn có cai thuốc lá không?</p>
                <div class="flex justify-center gap-6">
                    <button onClick={handleStepOneNo} class="px-6 py-2 border border-primary-400 text-primary-600 rounded-md hover:bg-primary-50 font-medium">Không</button>
                    <button onClick={handleStepOneYes} class="px-6 py-2 border border-primary-400 text-primary-600 rounded-md hover:bg-primary-50 font-medium">Có</button>
                </div>
            </div>
        </div>
    );
}

export default CheckInStepOne;