import React, {useEffect, useState} from 'react';
import {Modal, Steps} from 'antd';
import CheckInStepOne from './checkInStepOne';
import CheckInStepTwoOnYes from './checkInStepTwoYes';
import CheckInStepTwoOnNo from './checkInStepTwoNo';
import CheckInStepThree from './checkInStepThree';
import CheckInJournal from './checkInJournal';
import CheckInStepFour from './checkInStepFour';
import {useCheckInDataStore, useStepCheckInStore} from '../../../stores/checkInStore';
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {useNavigate, useParams} from "react-router-dom";
import ModalFooter from "../../../components/ui/modalFooter.jsx";
import {useAuth0} from "@auth0/auth0-react";
import {useQuery} from "@tanstack/react-query";

import {getCheckInData} from "../../../components/utils/checkInUtils.js";

import {getCurrentUTCDateTime} from "../../../components/utils/dateUtils.js";
import {useCurrentStepDashboard} from "../../../stores/store.js";

function SmokeFreeCheckin() {
    const {date} = useParams()

    const {step, current, handleStepThree, handleStepOne} = useStepCheckInStore();
    const [animateRef] = useAutoAnimate();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {setCurrentStepDashboard} = useCurrentStepDashboard();
    const {
        setCheckInDate,
        setFeel,
        setCheckedQuitItems,
        setFreeText,
        setQna,
        setIsStepOneOnYes,
        setIsFreeText,
        setCigsSmoked,
    } = useCheckInDataStore();

    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();

    const {
        data: CheckInData,
        isSuccess: CheckInDataSuccess,
    } = useQuery({
        queryKey: ['checkin-status'],
        queryFn: async () => {
            if (!isAuthenticated || !user) return;
            const today = getCurrentUTCDateTime().toISOString()
            return await getCheckInData(user, getAccessTokenSilently, isAuthenticated, today);
        },
        enabled: isAuthenticated && !!user,
    })

    useEffect(() => {
        if (date) {
            handleStepOne();
        } else if (CheckInDataSuccess) {
            if (CheckInData && CheckInData.data) {
                setCheckInDate(CheckInData.data.logged_at);
                setFeel(CheckInData.data.feeling);
                setQna(CheckInData.data.qna);
                if (CheckInData.data.quitting_items.length > 0) {
                    setIsStepOneOnYes(true)
                    setCheckedQuitItems(CheckInData.data.quitting_items);
                } else {
                    setIsStepOneOnYes(false)
                    setCigsSmoked(CheckInData.data.cigs_smoked)
                }
                if (CheckInData.data.qna.length > 0) {
                    setIsFreeText(false)
                    setQna(CheckInData.data.qna);
                } else if (CheckInData.data.free_text && CheckInData.data.free_text[0].free_text_content) {
                    setIsFreeText(true)
                    setFreeText(CheckInData.data.free_text[0].free_text_content)
                }
                setIsModalOpen(true);
                handleStepThree()
            } else {
                handleStepOne()
            }
        }
    }, [CheckInData, CheckInDataSuccess])


    const steps = [
        {
            title: '',
            content: 'First-content',
        },
        {
            title: '',
            content: 'Second-content',
        },
        {
            title: '',
            content: 'Third-content',
        },
        {
            title: '',
            content: 'Fourth-content',
        },
    ];

    const items = steps.map(item => ({key: item.title, title: item.title}));

    return (
        <div className="w-full flex justify-center p-4">
            <div className="w-full bg-white mx-auto p-6 border rounded-xl shadow-sm border-primary-500 text-center">
                <Steps className='pb-5' current={current} items={items}/>
                <h1 className="text-2xl font-bold text-primary-800 mb-2">Check-in</h1>
                <div ref={animateRef}>
                    {step === 'StepOne' && <CheckInStepOne date={date}/>}
                    {step === 'StepTwoOnYes' && <CheckInStepTwoOnYes/>}
                    {step === 'StepTwoOnNo' && <CheckInStepTwoOnNo/>}
                    {step === 'StepThree' && <CheckInStepThree/>}
                    {step === 'StepJournal' && <CheckInJournal/>}
                    {step === 'StepFour' && <CheckInStepFour/>}
                </div>
            </div>
            <Modal
                title="Bạn đã check-in ngày hôm nay"
                closable={{'aria-label': 'Custom Close Button'}}
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => navigate('/dashboard')}
                centered
                maskClosable
                closeIcon={null}
                footer={<ModalFooter cancelText='Trở lại' okText='Tôi đã hiểu' onOk={() => setIsModalOpen(false)}
                                     onCancel={() => {
                                         setIsModalOpen(false)
                                         setCurrentStepDashboard('dashboard')
                                     }}/>}
            >
                <p>
                    Bạn đã thực hiện check in cho ngày hôm nay. Nếu bạn <strong>thực hiện thay đổi</strong> và
                    nhấn <strong>'Lưu'</strong>, thông tin check-in mới <strong>sẽ thay thế</strong> thông tin cũ.
                </p>
                <p>
                    Nếu bạn muốn giữ lại thông tin check-in cũ, hãy nhấn <strong>'Trở lại'</strong> để quay về trang
                    điều khiển.
                </p>
            </Modal>
        </div>
    );
}

export default SmokeFreeCheckin;
