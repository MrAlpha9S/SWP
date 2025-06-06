import React, { useState } from 'react';
import { Steps, Tabs, Input, Button, Typography } from 'antd';
import { useStepCheckInStore, useCheckInDataStore } from '../../../stores/checkInStore';

const { Step } = Steps;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const CheckInJournal = () => {
  const { handleBackToStepOne, handleStepThree } = useStepCheckInStore();
  const { freeText, setFreeText, qna, setQna } = useCheckInDataStore();
  const [showErrorFreeText, setShowErrorFreeText] = useState(false);
  const [showErrorQnA, setShowErrorQnA] = useState(false);

  const qnaQuestions = [
    'Bạn có cảm thấy muốn hút thuốc không? Bạn đã làm gì để vượt qua cảm giác đó?',
    'Bạn có nhận thấy bất kỳ thay đổi nào về sức khỏe, tâm trạng hoặc năng lượng của mình không?',
    'Hôm nay bạn có tập thể dục hay vận động gì không? Bạn cảm thấy thế nào?',
    'Bạn có thèm ăn không? Điều gì giúp bạn đối phó với chúng?',
    'Có ai ủng hộ hoặc động viên bạn không? Điều đó khiến bạn cảm thấy thế nào?',
  ];

  const qnaFields = [
    'smokeCraving',
    'healthChanges',
    'exercise',
    'cravings',
    'encourage',
  ];

  const handleQnAChange = (field) => (e) => {
    setQna({ [field]: e.target.value });
  };

  const handleNext = () => {
    if (!showErrorFreeText || showErrorFreeText.length === 0) {
      setShowErrorFreeText(true);
    } else {
      setShowErrorFreeText(false);
      handleStepThree();
    }
    if (Object.values(qna).some((answer) => !answer || answer.trim() === '')) {
      setShowErrorQnA(true);
    } else {
      setShowErrorQnA(false);
      handleStepThree();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg shadow bg-white">

      <Title level={4}>Bạn cảm thấy thế nào khi bỏ thuốc</Title>
      <Paragraph>
        Viết và suy ngẫm thường xuyên về những trải nghiệm của bạn là một cách tuyệt vời để xác định các mô hình và tác nhân gây nghiện.
        Nó giúp bạn theo dõi thành công, duy trì động lực và điều chỉnh các chiến lược để vượt qua những thách thức trên hành trình cai thuốc của bạn.
      </Paragraph>

      <Tabs defaultActiveKey="1" className="mt-4">
        {/* Free-text journal */}
        <TabPane tab={<span className="text-primary-600 font-semibold">Nhật ký văn bản tự do</span>} key="1">
          <label className="font-medium block mb-2 mt-4">
            Gần đây bạn cảm thấy thế nào? Điều gì đã xảy ra trong hành trình cai thuốc của bạn?
          </label>
          <TextArea
            rows={6}
            maxLength={2000}
            showCount
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Bắt đầu viết ở đây..."
          />
          {showErrorFreeText && (
            <p className="text-sm text-red-500 mt-4">Bạn chưa hoàn thành nhật ký</p>
          )}
        </TabPane>

        {/* Q&A journal */}
        <TabPane tab="Q&A journal" key="2">
          <div className="space-y-6 mt-4">
            {qnaQuestions.map((question, idx) => (
              <div key={qnaFields[idx]}>
                <label className="font-medium block mb-2">{question}</label>
                <TextArea
                  rows={4}
                  maxLength={500}
                  showCount
                  value={qna[qnaFields[idx]]}
                  onChange={handleQnAChange(qnaFields[idx])}
                  placeholder="Nhập câu trả lời của bạn..."
                />
              </div>
            ))}
            {showErrorQnA && (
              <p className="text-sm text-red-500 mt-4">Bạn chưa hoàn thành nhật ký</p>
            )}
          </div>
        </TabPane>
      </Tabs>

      <div className="flex justify-between mt-6">
        <Button onClick={handleBackToStepOne} type="default" className="text-primary-600 border-primary-600 hover:bg-primary-50">
          &lt; Back
        </Button>
        <Button onClick={handleNext} className="bg-primary-500 text-white hover:bg-primary-600">
          Finish check-in &gt;
        </Button>
      </div>
    </div>
  );
};

export default CheckInJournal;
