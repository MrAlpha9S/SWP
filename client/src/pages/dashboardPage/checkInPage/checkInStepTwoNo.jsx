import React, {useEffect, useState} from 'react';
import { useStepCheckInStore, useCheckInDataStore } from '../../../stores/checkInStore';
import CustomButton from "../../../components/ui/CustomButton.jsx";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import ErrorText from "../../../components/ui/errorText.jsx";


const CheckInStep2No = () => {
    const { handleBackToStepOne, handleStepTwo } = useStepCheckInStore();
    const { cigsSmoked, setCigsSmoked } = useCheckInDataStore();

    const [showError, setShowError] = useState(false);

    const handleNext = () => {
        if (cigsSmoked <= 0) {
            setShowError(true);
            return
        }
        handleStepTwo();
    };

    useEffect(() => {
        if (cigsSmoked > 0) {
            setShowError(false);
        }
    }, [cigsSmoked]);


    return (
        <div className="max-w-xl mx-auto rounded-lg p-8 shadow-sm bg-white">

            <p className="text-gray-700 text-base mb-4">
                Hãy nhập số điếu thuốc bạn đã hút kể từ lần check-in trước. Việc ghi lại sẽ giúp bạn theo dõi tiến trình của mình một cách chính xác và hiệu quả hơn.
            </p>

            <h3 className="text-sm md:text-base font-bold mb-4">Bạn đã hút bao nhiêu điếu?</h3>

            {showError && <ErrorText>Hãy chọn số điếu hợp lệ</ErrorText>}

            <input
                onChange={(e) => setCigsSmoked(Number(e.target.value))}
                id="cigsSmoked"
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={cigsSmoked}
            />

            <div className="flex justify-between items-center mt-10">
                <CustomButton type='secondary' onClick={handleBackToStepOne}><FaArrowLeft/> Trở lại </CustomButton>
                <CustomButton type='primary' onClick={handleNext}>Tiếp theo <FaArrowRight/></CustomButton>
            </div>
        </div>
    );
};

export default CheckInStep2No;
