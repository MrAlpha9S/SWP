import React, { useState } from 'react';
import { Checkbox, Button } from 'antd';
import { useStepCheckInStore, useCheckInDataStore } from '../../../stores/checkInStore';

const strategies = [
  'Tư duy tích cực và tự thúc đẩy bản thân',
  'Hỗ trợ từ bạn bè, gia đình hoặc nhóm hỗ trợ',
  'Bỏ thuốc hoặc NRT (kẹo cao su, miếng dán, bình xịt, v.v.)',
  'Liệu pháp hành vi hoặc tư vấn',
  'Xác định và tránh các tác nhân gây nghiện hoặc tình huống rủi ro cao',
  'Phát triển cơ chế đối phó với cơn thèm và quản lý căng thẳng',
  'Kế hoạch bỏ thuốc của tôi với các cột mốc và phần thưởng',
  'Chánh niệm',
  'Khác',
];

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

      <p className="text-gray-700 text-base mb-4">
        <strong>Xin chúc mừng vì bạn đã không hút thuốc!</strong> Ghi chú những chiến lược nào đang hiệu quả sẽ giúp bạn đi đúng hướng.
      </p>

      <h3 className="text-lg font-medium text-gray-800 mb-2">Những cách nào đã giúp bạn cai thuốc lá?</h3>
      <p className="text-sm text-gray-500 mb-4">(Chọn tất cả những gì áp dụng)</p>

      <Checkbox.Group
        className="flex flex-col gap-3"
        options={strategies}
        value={checkedQuitItems}
        onChange={setCheckedQuitItems}
      />
      {showError && (
        <p className="text-sm text-red-500 mt-4">Hãy chọn ít nhất một lựa chọn</p>
      )}
      <div className="flex justify-between items-center mt-8">
        <Button onClick={handleBackToStepOne} className="bg-white border-primary-500 text-primary-700 hover:bg-primary-50" size="large">
          &lt; Trở lại
        </Button>
        <Button onClick={handleNext} size="large" className="bg-primary-500 text-white hover:bg-primary-600">
          Tiếp Theo  &gt;
        </Button>
      </div>
    </div>
  );
};

export default CheckInStep2Yes;
