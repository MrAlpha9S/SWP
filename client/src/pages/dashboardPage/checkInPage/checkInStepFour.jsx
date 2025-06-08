import React from 'react';
import {Progress, Typography, Divider} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    FrownFilled,
    FrownOutlined,
    MehOutlined,
    SmileOutlined,
    SmileFilled
} from '@ant-design/icons';
import {useCheckInDataStore, useStepCheckInStore} from '../../../stores/checkInStore';

const {Title, Text, Paragraph} = Typography;

const CheckInStepFour = () => {
    const {checkInDate, feel, checkedQuitItems, freeText, qna, cigsSmoked, isStepOneOnYes} = useCheckInDataStore();
    const { handleBackToStepOne } = useStepCheckInStore();

    let feelLabel = ''
    switch(feel) {
        case 'terrible':
            feelLabel = 'tệ';
            break;
        case 'bad':
            feelLabel = 'buồn';
            break;
        case 'okay':
            feelLabel = 'ổn';
            break;
        case 'good':
            feelLabel = 'tốt';
            break;
        case 'great':
            feelLabel = 'tuyệt vời';
            break;
    }

    return (
        <div className="max-w-xl mx-auto rounded-md p-6 shadow-md bg-white">

            {/* Congratulatory Message */}
            <Title level={4} className="text-center text-primary-700">
                {isStepOneOnYes ? 'Chúc mừng bạn đã không hút thuốc! Hãy cố gắng check-in mỗi ngày để giữ vững tiến trình của mình.' : 'Đừng từ bỏ, bạn có thể làm được!'}
            </Title>

            {/* Check-in Summary */}
            <div className="mt-6">
                <Title level={5}>Tóm tắt Check-in</Title>
                <Divider className="my-2"/>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                    <Text>{checkInDate}</Text>
                    <a onClick={handleBackToStepOne} className="text-primary-700 font-medium cursor-pointer">Sửa</a>
                </div>

                <div className="flex items-start gap-2 mb-2">
                    <CheckCircleOutlined className="text-blue-500 mt-1"/>
                    <Text className='text-left'>Tôi đã không hút thuốc vì: {checkedQuitItems.join(', ')}</Text>
                </div>

                {!isStepOneOnYes && (
                    <div className="flex items-start gap-2 mb-2">
                        <CloseCircleOutlined className="text-red-500 mt-1"/>
                        <Text>Tôi đã hút: {cigsSmoked} điếu thuốc</Text>
                    </div>
                )}

                <div className="flex items-start gap-2">
                    {feel === 'great' ? (
                        <SmileFilled className="text-green-500 mt-1"/>
                    ) : feel === 'good' ? (
                        <SmileOutlined className="text-yellow-500 mt-1"/>
                    ) : feel === 'okay' ? (
                        <MehOutlined className="text-yellow-500 mt-1"/>
                    ) : feel === 'sad' ? (
                        <FrownOutlined className="text-yellow-500 mt-1"/>
                    ) : (
                        <FrownFilled className="text-red-500 mt-1"/>
                    )}
                    <Text>
                        Tôi cảm thấy {feelLabel} hôm nay!
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default CheckInStepFour;
