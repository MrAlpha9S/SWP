import React from 'react';
import { Button } from 'antd';
import { useStepCheckInStore } from '../../../stores/checkInStore';

const CheckInStep3 = () => {
    const { handleJournal, handleStepThree, handleBackToStepOne } = useStepCheckInStore();

    return (
        <div className="max-w-xl mx-auto rounded-lg p-8 shadow-sm bg-white text-center">

            <p className="text-lg font-semibold text-gray-800 mb-8">
                Bạn có muốn viết về cảm xúc của mình ngày hôm nay không?
            </p>

            <div className="flex justify-center gap-4">
                <Button
                    onClick={handleBackToStepOne}
                    className="border border-primary-500 text-primary-700 hover:bg-primary-50"
                    size="large"
                >
                    &lt; Trở lại
                </Button>

                <Button
                    onClick={handleStepThree}
                    className="bg-primary-500 text-white hover:bg-primary-600"
                    size="large"
                >
                    Không - Tôi xong rồi
                </Button>

                <Button
                    onClick={handleJournal}
                    className="bg-primary-500 text-white hover:bg-primary-600"
                    size="large"
                >
                    Có
                </Button>
            </div>
        </div>
    );
};

export default CheckInStep3;
