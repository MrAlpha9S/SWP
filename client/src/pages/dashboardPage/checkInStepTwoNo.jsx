import React, { useState } from 'react';
import { Checkbox, Button } from 'antd';
import { useStepCheckInStore } from '../../stores/checkInStore';

const smokeOptions = [
    'Thuốc lá',
    'Thuốc lá điện tử',
    'Thuốc lá tự cuốn',
    'Tẩu',
    'Xì gà/Xì gà nhỏ',
    'Thuốc lá nhai',
    'Shisha (Hookah)',
    'Túi đựng nicotine',
];

const CheckInStep2No = () => {
    const { handleBackToStepOne, handleStepTwo } = useStepCheckInStore();
    const [selectedItems, setSelectedItems] = useState([]);

    const handleChange = (checkedValues) => {
        setSelectedItems(checkedValues);
    };

    return (
        <div className="max-w-xl mx-auto rounded-lg p-8 shadow-sm bg-white">

            <p className="text-gray-700 text-base mb-4">
                Chúng tôi sẽ giúp bạn quay lại đúng hướng bằng thông tin hỗ trợ và các chiến lược hiệu quả nhất cho bạn.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mb-2">Bạn đã hút gì?</h3>
            <p className="text-sm text-gray-500 mb-4">(Chọn tất cả những gì áp dụng)</p>

            <Checkbox.Group
                className="flex flex-col gap-4"
                options={smokeOptions}
                value={selectedItems}
                onChange={handleChange}
            />

            <div className="flex justify-between items-center mt-10">
                <Button onClick={handleBackToStepOne} className="bg-white border-primary-500 text-primary-700 hover:bg-primary-50" size="large">
                    &lt; Trở lại
                </Button>
                <Button
                    size="large"
                    className="bg-primary-500 text-white hover:bg-primary-600"
                    onClick={handleStepTwo}
                >
                    Tiếp theo  &gt;
                </Button>
            </div>
        </div>
    );
};

export default CheckInStep2No;
