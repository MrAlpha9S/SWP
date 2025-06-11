import React, {useEffect, useState} from 'react';
import {Tabs, Input} from 'antd';
import {useStepCheckInStore, useCheckInDataStore} from '../../../stores/checkInStore';
import CustomButton from "../../../components/ui/CustomButton.jsx";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import {qnaOptions} from "../../../constants/constants.js";


const {TabPane} = Tabs;
const {TextArea} = Input;

const CheckInJournal = () => {
    const {handleStepThree, handleStepTwo} = useStepCheckInStore();
    const {freeText, setFreeText, qna, setQna, isFreeText, setIsFreeText} = useCheckInDataStore();
    const [showErrorFreeText, setShowErrorFreeText] = useState(false);
    const [showErrorQnA, setShowErrorQnA] = useState(false);


    const handleQnAChange = (field) => (e) => {
        setQna({[field]: e.target.value});
    };

    const handleTabChange = (e) => {
        if (e === "1") {
            setIsFreeText(true)
        } else {
            setIsFreeText(false)
        }
    }

    const handleNext = () => {
        if (isFreeText) {
            if (freeText.trim().length === 0) {
                setShowErrorFreeText(true);
                return
            }
            handleStepThree();
        } else {
            if (Object.values(qna).some((answer) => !answer || answer.trim() === '')) {
                setShowErrorQnA(true);
                return
            }
            handleStepThree();
        }
    };

    useEffect(() => {
        if (isFreeText) {
            if (freeText.trim().length > 0) {
                setShowErrorFreeText(false);
            }
        } else {
            if (Object.values(qna).every((answer) => answer && answer.trim() !== '')) {
                setShowErrorQnA(false);
            }
        }
    }, [isFreeText, qna, freeText]);

    return (
        <div className=" mx-auto p-6 rounded-lg shadow bg-white">

            <div className='text-base md:text-xl font-bold mb-6'>Bạn cảm thấy thế nào khi bỏ thuốc?</div>
            <div className='text-sm md:text-base mb-6'>Viết và suy ngẫm thường xuyên về những trải nghiệm của bạn là một cách tuyệt vời để xác định các mô hình
                và tác nhân gây nghiện.
                Nó giúp bạn theo dõi thành công, duy trì động lực và điều chỉnh các chiến lược để vượt qua những thách
                thức trên hành trình cai thuốc của bạn.</div>

            <Tabs defaultActiveKey={isFreeText ? "1" : "2"} className="mt-4" onChange={(e) => handleTabChange(e)}>
                {/* Free-text journal */}
                <TabPane tab={<span>Nhật ký văn bản tự do</span>} key="1">
                    <label className="font-medium block mb-2 mt-4">
                        Gần đây bạn cảm thấy thế nào? Điều gì đã xảy ra trong hành trình cai thuốc của bạn?
                    </label>
                    <TextArea
                        rows={6}
                        maxLength={2000}
                        showCount
                        value={freeText}
                        onChange={(e) => setFreeText(e.target.value)} z
                        placeholder="Bắt đầu viết ở đây..."
                    />
                    {showErrorFreeText && (
                        <p className="text-sm text-red-500 mt-4">Bạn chưa hoàn thành nhật ký</p>
                    )}
                </TabPane>

                {/* Q&A journal */}
                <TabPane tab="Q&A journal" key="2">
                    <div className="space-y-6 mt-4">
                        {qnaOptions.map(({ value, label }) => (
                            <div key={value}>
                                <label className="text-left font-medium block mb-2">{label}</label>
                                <TextArea
                                    rows={4}
                                    maxLength={500}
                                    showCount
                                    value={qna[value] || ''}
                                    onChange={handleQnAChange(value)}
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
                <CustomButton type='secondary' onClick={handleStepTwo}><FaArrowLeft/> Trở lại </CustomButton>
                <CustomButton type='primary' onClick={handleNext}>Hoàn thành<FaArrowRight/></CustomButton>
            </div>
        </div>
    );
};

export default CheckInJournal;
