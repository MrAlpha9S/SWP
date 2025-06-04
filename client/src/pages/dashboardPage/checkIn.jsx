import React, { useState } from 'react';
import { Button, message, Steps, theme, Radio } from 'antd';

export default function SmokeFreeCheckin() {
    const [step, setStep] = useState('StepOne');
    //antd steps
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
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
    const contentStyle = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
    };
    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };
    const items = steps.map(item => ({ key: item.title, title: item.title }));
    //Step 1
    // State to manage the check-in date, defaulting to today
    const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
    const handleDateChange = (event) => {
        const selectedDate = new Date(event.target.value);
        const today = new Date()
        if (selectedDate >= today) {
            setCheckInDate(today.toISOString().split('T')[0]);
        } else {
            setCheckInDate(event.target.value);
        }

    };

    const FEELINGS = [
        { value: 'terrible', emoji: '😞', label: 'Terrible' },
        { value: 'bad', emoji: '☹️', label: 'Bad' },
        { value: 'okay', emoji: '😐', label: 'Okay' },
        { value: 'good', emoji: '😊', label: 'Good' },
        { value: 'great', emoji: '😃', label: 'Great' },
    ];

    //

    const handleStepOneYes = () => setStep('a');
    const handleStepOneNo = () => setStep('');
    const handleBack = () => setStep('');

    const [size, setSize] = useState('middle');
    const handleSizeChange = e => {
        setSize(e.target.value);
    };
    return (
        <div className="bg-primary-50 min-h-screen flex items-center justify-center p-4">
            {step === 'StepOne' && (
                <div class="bg-white max-w-xl mx-auto p-6 border rounded-xl shadow-sm border-primary-200 text-center">
                    <Steps className='pb-5' current={current} items={items} />
                    <h1 class="text-2xl font-bold text-primary-800 mb-2">Check-in</h1>
                    <p class="text-gray-600 mb-6">Check-in daily to track your progress and stay motivated on your smoke-free journey.</p>

                    <div class="mb-6 text-left">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Check-in date</label>
                        <p class="text-xs text-gray-500 mb-1">You can select a previous date.</p>
                        <input
                            type="date"
                            value={checkInDate}
                            onChange={handleDateChange}
                            class="w-full border border-primary-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div class="mb-6 pb-10">
                        <p class="font-semibold text-gray-800 mb-3">How did you feel today?</p>
                        <Radio.Group
                            className="flex justify-between items-center gap-3 max-w-md mx-auto"
                            value={size}
                            onChange={handleSizeChange}
                        >
                            {FEELINGS.map(({ value, emoji, label }) => (
                                <Radio.Button
                                    className="flex flex-col items-center text-gray-500 hover:border-primary-600 rounded-lg cursor-pointer"
                                    key={value}
                                    value={value}
                                >
                                    <span className="text-2xl">{emoji}</span>
                                    <span className="text-sm mt-1">{label}</span>
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </div>


                    <div>
                        <p class="font-semibold text-gray-800 mb-3">Did you stay smoke-free today?</p>
                        <div class="flex justify-center gap-6">
                            <button class="px-6 py-2 border border-primary-400 text-primary-600 rounded-md hover:bg-primary-50 font-medium">No</button>
                            <button class="px-6 py-2 border border-primary-400 text-primary-600 rounded-md hover:bg-primary-50 font-medium">Yes</button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
