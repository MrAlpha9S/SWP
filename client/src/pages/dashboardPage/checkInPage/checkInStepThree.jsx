import React from 'react';
import {useCheckInDataStore, useStepCheckInStore} from '../../../stores/checkInStore';
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import CustomButton from "../../../components/ui/CustomButton.jsx";

const CheckInStep3 = () => {
    const { handleJournal, handleStepThree, handleStepOneYes, handleStepOneNo } = useStepCheckInStore();
    const {isStepOneOnYes} = useCheckInDataStore();

    const handleBackToStepTwo = () => {
        if (isStepOneOnYes) {
            handleStepOneYes()
        } else {
            handleStepOneNo();
        }
    }

    return (
        <div className="max-w-xl mx-auto rounded-lg p-8 shadow-sm bg-white text-center">

            <p className="text-lg font-semibold text-gray-800 mb-8">
                Bạn có muốn viết về cảm xúc của mình ngày hôm nay không?
            </p>

            <div className="flex justify-center gap-4">
                <CustomButton type='secondary' onClick={handleBackToStepTwo}><FaArrowLeft/> Trở lại </CustomButton>
                <CustomButton type='primary' onClick={handleStepThree}>Không - Tôi xong rồi </CustomButton>
                <CustomButton type='primary' onClick={handleJournal}>Tiếp tục <FaArrowRight/></CustomButton>
            </div>
        </div>
    );
};

export default CheckInStep3;
