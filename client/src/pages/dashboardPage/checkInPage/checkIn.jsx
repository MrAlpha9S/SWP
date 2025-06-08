import React from 'react';
import {Steps} from 'antd';
import CheckInStepOne from './checkInStepOne';
import CheckInStepTwoOnYes from './checkInStepTwoYes';
import CheckInStepTwoOnNo from './checkInStepTwoNo';
import CheckInStepThree from './checkInStepThree';
import CheckInJournal from './checkInJournal';
import CheckInStepFour from './checkInStepFour';
import {useStepCheckInStore} from '../../../stores/checkInStore';
import { useAutoAnimate } from "@formkit/auto-animate/react";

function SmokeFreeCheckin() {
    const {step, current} = useStepCheckInStore();
    const [animateRef] = useAutoAnimate();

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
        <div className="bg-primary-50 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white max-w-xl mx-auto p-6 border rounded-xl shadow-sm border-primary-500 text-center">
                <Steps className='pb-5' current={current} items={items}/>
                <h1 className="text-2xl font-bold text-primary-800 mb-2">Check-in</h1>
                <div ref={animateRef}>
                    {step === 'StepOne' && <CheckInStepOne />}
                    {step === 'StepTwoOnYes' && <CheckInStepTwoOnYes />}
                    {step === 'StepTwoOnNo' && <CheckInStepTwoOnNo />}
                    {step === 'StepThree' && <CheckInStepThree />}
                    {step === 'StepJournal' && <CheckInJournal />}
                    {step === 'StepFour' && <CheckInStepFour />}
                </div>
            </div>
        </div>
    );
}

export default SmokeFreeCheckin;
