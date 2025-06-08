import React, { useState } from 'react';
import { Checkbox, Button } from 'antd';
import { useStepCheckInStore, useCheckInDataStore } from '../../../stores/checkInStore';
import CustomButton from "../../../components/ui/CustomButton.jsx";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import {quitStrategies} from "../../../constants/constants.js";


const CheckInStep2Yes = () => {
  const { handleBackToStepOne, handleStepTwo } = useStepCheckInStore();
  const { checkedQuitItems, setCheckedQuitItems } = useCheckInDataStore();
  const [showError, setShowError] = useState(false);

  const handleNext = () => {
    if (!checkedQuitItems || checkedQuitItems.length === 0) {
      setShowError(true);
      return;
    }
    setShowError(false);
    handleStepTwo();
  };

  return (
    <div className="max-w-xl mx-auto rounded-lg p-8 shadow-sm bg-white">

      <p className="text-sm md:text-base mb-6">
        <strong>Xin chúc mừng vì bạn đã không hút thuốc!</strong> Ghi chú những chiến lược nào đang hiệu quả sẽ giúp bạn đi đúng hướng.
      </p>

      <h3 className="text-sm md:text-base mb-4 font-bold">Những cách nào đã giúp bạn cai thuốc lá?</h3>
      <p className="text-sm text-gray-500 mb-4">(Chọn tất cả những gì áp dụng)</p>

      <Checkbox.Group
        className="flex flex-col gap-3"
        options={quitStrategies}
        value={checkedQuitItems}
        onChange={setCheckedQuitItems}
      />
      {showError && (
        <p className="text-sm text-red-500 mt-4">Hãy chọn ít nhất một lựa chọn</p>
      )}
      <div className="flex justify-between items-center mt-8">
          <CustomButton type='secondary' onClick={handleBackToStepOne}><FaArrowLeft/> Trở lại </CustomButton>
          <CustomButton type='primary' onClick={handleNext}>Tiếp theo <FaArrowRight/></CustomButton>
      </div>
    </div>
  );
};

export default CheckInStep2Yes;
