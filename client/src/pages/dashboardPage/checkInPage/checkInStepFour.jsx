import React from 'react';
import { Progress, Typography, Divider } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, FrownFilled, FrownOutlined, MehOutlined, SmileOutlined, SmileFilled } from '@ant-design/icons';
import { useCheckInDataStore } from '../../../stores/checkInStore';

const { Title, Text, Paragraph } = Typography;

const CheckInStepFour = () => {
  const { checkInDate, feel, checkedQuitItems, checkedSmokeItems, freeText, qna} = useCheckInDataStore();
  console.log('Check-in Data:', {
    checkInDate,
    feel,
    checkedQuitItems,
    checkedSmokeItems,
    freeText,
    qna
  });
  return (
    <div className="max-w-xl mx-auto rounded-md p-6 shadow-md bg-white">

      {/* Congratulatory Message */}
      <Title level={4} className="text-center text-primary-700">
        Bạn đã Check-in thành công! Hãy quay lại vào ngày mai nhé.
      </Title>

      {/* Check-in Summary */}
      <div className="mt-6">
        <Title level={5}>Tóm tắt Check-in</Title>
        <Divider className="my-2" />
        <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
          <Text>{checkInDate}</Text>
          <a href="#" className="text-primary-700 font-medium">Sửa</a>
        </div>

        <div className="flex items-start gap-2 mb-2">
          <CheckCircleOutlined className="text-blue-500 mt-1" />
          <Text>I stayed smoke free using: {checkedQuitItems.join(', ')}</Text>
        </div>

        <div className="flex items-start gap-2 mb-2">
          <CloseCircleOutlined className="text-red-500 mt-1" />
          <Text>I Smoke: {checkedSmokeItems.join(', ')}</Text>
        </div>

        <div className="flex items-start gap-2">
          {feel === 'great' ? (
            <SmileFilled className="text-green-500 mt-1" />
          ) : feel === 'good' ? (
            <SmileOutlined className="text-yellow-500 mt-1" />
          ) : feel === 'okay' ? (
            <MehOutlined className="text-yellow-500 mt-1" />
          ) : feel === 'sad' ? (
            <FrownOutlined className="text-yellow-500 mt-1" />
          ) : (
            <FrownFilled className="text-red-500 mt-1" />
          )}
          <Text>
            I have a {feel} day!
          </Text>
        </div>
      </div>
    </div>
  );
};

export default CheckInStepFour;
