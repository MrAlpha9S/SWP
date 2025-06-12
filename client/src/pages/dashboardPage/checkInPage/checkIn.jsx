import React, {useEffect, useState} from 'react';
import {Modal, Steps} from 'antd';
import CheckInStepOne from './checkInStepOne';
import CheckInStepTwoOnYes from './checkInStepTwoYes';
import CheckInStepTwoOnNo from './checkInStepTwoNo';
import CheckInStepThree from './checkInStepThree';
import CheckInJournal from './checkInJournal';
import CheckInStepFour from './checkInStepFour';
import { useStepCheckInStore} from '../../../stores/checkInStore';
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {useNavigate} from "react-router-dom";
import ModalFooter from "../../../components/ui/modalFooter.jsx";
import {useAuth0} from "@auth0/auth0-react";
import {useQuery} from "@tanstack/react-query";

import {getCheckInData} from "../../../components/utils/checkInUtils.js";

import {getCurrentUTCDateTime} from "../../../components/utils/dateUtils.js";
import {useCurrentStepDashboard} from "../../../stores/store.js";

function SmokeFreeCheckin() {
    const {step, current, handleStepThree, handleStepOne} = useStepCheckInStore();
    const [animateRef] = useAutoAnimate();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {setCurrentStepDashboard} = useCurrentStepDashboard();

    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();

    const {
        isPending: isCheckInDataPending,
        error: CheckInDataError,
        data: CheckInData,
        isFetching: isFetchingCheckInData,
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
        if (!isCheckInDataPending) {
            console.log('checkin', CheckInData)
            if (CheckInData.data) {
                setIsModalOpen(true);
                handleStepThree()
            } else {
                handleStepOne()
            }
        }
    }, [isCheckInDataPending]);

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
                    {step === 'StepOne' && <CheckInStepOne/>}
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
                footer={<ModalFooter setIsModalOpen={setIsModalOpen} onCancel={() => {
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
