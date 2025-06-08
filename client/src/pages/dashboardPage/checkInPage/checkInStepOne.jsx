import React from 'react';
import { Radio } from 'antd';
import { useCheckInDataStore, useStepCheckInStore } from '../../../stores/checkInStore';
import CustomButton from "../../../components/ui/CustomButton.jsx";
import { FEELINGS } from "../../../constants/constants.js";

const CheckInStepOne = () => {
    const { handleStepOneNo, handleStepOneYes } = useStepCheckInStore();

    const { checkInDate, setCheckInDate, feel, setFeel, setIsStepOneOnYes } = useCheckInDataStore();

    const handleDateChange = (event) => {
        const selectedDate = new Date(event.target.value);
        const today = new Date()
        if (selectedDate >= today) {
            setCheckInDate(today.toISOString().split('T')[0]);
        } else {
            setCheckInDate(event.target.value);
        }
    };

    const handleFeelChange = e => {
        setFeel(e.target.value);
    };
    const toStepTwo = (type) => {
        if (type === 'yes') {
            setIsStepOneOnYes(true);
            handleStepOneYes()
        } else {
            setIsStepOneOnYes(false);
            handleStepOneNo();
        }
    }
    return (
        <div class="bg-white max-w-xl mx-auto p-6 rounded-xl shadow-sm text-center">

            <p class="text-sm md:text-base mb-6">Check-in hàng ngày để theo dõi tiến trình của bạn và duy trì động lực trên hành trình cai thuốc lá.</p>

            <div class="mb-6 text-left">
                <label class="block text-sm mb-1 font-bold">Ngày Check-in</label>
                <input
                    type="date"
                    value={checkInDate}
                    disabled
                    onChange={handleDateChange}
                    class="w-full border border-primary-500 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div class="mb-6 pb-10">
                <p class="text-sm md:text-base font-bold mb-4">Hôm nay bạn cảm thấy thế nào?</p>
                <Radio.Group
                    className="flex justify-between items-center gap-3 max-w-md mx-auto"
                    value={feel}
                    onChange={handleFeelChange}
                >
                    {FEELINGS.map(({ value, emoji, label }) => (

                        <Radio.Button
                            key={value}
                            value={value}
                            style={{}}
                            className={`flex flex-col h-[70px] min-w-[60px] items-center justify-between ${feel === value
                                ? 'text-primary-300 border-primary-300'
                                : 'text-gray-500 hover:border-primary-600'
                                }`}
                        >
                            <p className="text-3xl">{emoji}</p>
                            <p className="text-sm mt-1">{label}</p>
                        </Radio.Button>
                    ))}
                </Radio.Group>
            </div>
            <div>
                <p class="font-semibold text-gray-800 mb-3">Hôm nay bạn có cai thuốc lá không?</p>
                <div class="flex justify-center gap-6">
                    <CustomButton type='primary' onClick={() => toStepTwo('yes')}>Có</CustomButton>
                    <CustomButton type='secondary' onClick={() => toStepTwo('no')}>Không</CustomButton>
                </div>
            </div>
        </div>
    );
}

export default CheckInStepOne;