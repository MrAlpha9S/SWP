import React from 'react';
import {Result, Typography} from "antd";
import CustomButton from "../ui/CustomButton.jsx";
import {useNavigate} from "react-router-dom";
import {useCurrentStepDashboard} from "../../stores/store.js";

const NotFoundBanner = ({title, content, type = null}) => {
    const {Title, Paragraph} = Typography
    const navigate = useNavigate();
    const {setCurrentStepDashboard} = useCurrentStepDashboard()
    return (
        <div className='flex flex-col md:flex-row items-center justify-center gap-5 w-full p-14'>
            <div className='w-[60%] flex flex-col items-center md:items-start gap-10'>
                <h2 className='md:text-4xl lg:text-5xl font-bold'>
                    {title}
                </h2>
                {content}
                {
                    type === 'progressNCoach' && <div className='flex justify-center gap-10'>
                        <CustomButton onClick={() => navigate('/onboarding')}>Tạo ngay</CustomButton>
                        <CustomButton onClick={() => setCurrentStepDashboard('coach')}>Chat với huấn luyện viên</CustomButton>
                    </div>
                }
                {
                    type === 'userWithoutCoach' && <div className='flex justify-center gap-10'>
                        <CustomButton onClick={() => navigate('/coach-selection')}>Chọn huấn luyện viên</CustomButton>
                    </div>
                }
            </div>
            <Result
                status={404}
                title={
                    <Title
                        level={1}
                        className="!text-gray-800 !mb-4 text-2xl md:text-3xl lg:text-4xl font-bold"
                    />
                }
                subTitle={
                    <Paragraph className="!text-gray-600 !text-lg md:!text-xl !mb-8 leading-relaxed"/>
                }
                className="!p-0"
            />
        </div>
    );
};

export default NotFoundBanner;