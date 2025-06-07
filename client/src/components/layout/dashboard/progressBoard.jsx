import React, { useEffect, useState } from 'react';
import CustomButton from "../../ui/CustomButton.jsx";
import { useNavigate } from "react-router-dom";
import { differenceInMilliseconds } from "date-fns";
import {
    ResponsiveContainer,
    CartesianGrid,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
    ReferenceLine
} from "recharts";
import { CustomizedAxisTick } from "../../utils/customizedAxisTick.jsx";

import {
    usePlanStore,
    usePricePerPackStore,
    useCigsPerPackStore
} from "../../../stores/store.js";

const ProgressBoard = (props) => {
    const navigate = useNavigate();

    // Zustand fallback logic
    const storePlan = usePlanStore();

    const storePricePerPack = usePricePerPackStore(state => state.pricePerPack);
    const pricePerPack = props.pricePerPack ?? storePricePerPack;

    const storeCigsPerPack = useCigsPerPackStore(state => state.cigsPerPack);
    const cigsPerPack = props.cigsPerPack ?? storeCigsPerPack;

    const fallback = (key) => props[key] ?? storePlan[key];

    // Fallback to props or Zustand
    const planLog = fallback('planLog');
    const startDate = fallback('startDate');
    const expectedQuitDate = fallback('expectedQuitDate');
    const stoppedDate = fallback('stoppedDate');
    const cigsReduced = fallback('cigsReduced');
    const cigsPerDay = fallback('cigsPerDay');
    const quittingMethod = fallback('quittingMethod');

    const [currentDate, setCurrentDate] = useState(new Date());


    useEffect(() => {
        const timeout = setTimeout(() => {
            setCurrentDate(new Date());
        }, 60000);
        return () => clearTimeout(timeout);
    }, [currentDate]);

    const formatDateDifference = (ms) => {
        const seconds = Math.abs(Math.floor(ms / 1000));
        const minutes = Math.abs(Math.floor(seconds / 60));
        const hours = Math.abs(Math.floor(minutes / 60));
        const days = Math.abs(Math.floor(hours / 24));

        return {
            days: days,
            hours: hours % 24,
            minutes: minutes % 60,
            seconds: seconds % 60
        };
    };

    const localStartDate = new Date(startDate);
    const differenceInMs = differenceInMilliseconds(currentDate, localStartDate);
    const difference = formatDateDifference(differenceInMs);
    const pricePerCig = Math.round(pricePerPack / cigsPerPack);
    const dayDifference = difference.days;

    let cigsQuitted = 0;
    if (differenceInMs > 0) {
        if (quittingMethod === 'gradual-daily') {
            cigsQuitted = cigsReduced * dayDifference;
        } else if (quittingMethod === 'gradual-weekly') {
            cigsQuitted = (cigsReduced * dayDifference) / 7;
        } else if (quittingMethod === 'target-date') {
            const todayStr = currentDate.toISOString().split('T')[0];
            const todayEntry = planLog.find((log) => log.date === todayStr);
            if (todayEntry) {
                cigsQuitted = cigsPerDay - todayEntry.cigs;
            }
        }
    }

    const moneySaved = cigsQuitted * pricePerCig;

    if (!planLog || planLog.length === 0) {
        return <div>Loading progress...</div>; // or return null
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-4/5 space-y-4">
            <div className="flex items-center justify-between">
                <CustomButton onClick={() => navigate('/dashboard/check-in')}>Check-in hàng ngày →</CustomButton>
                <a href="#" className="text-sm text-primary-700 hover:underline">
                    What's a check-in and why are they important?
                </a>
            </div>

            <div className="bg-primary-100 rounded-lg p-6 text-center">
                <h2 className="text-gray-600 text-sm font-medium">
                    {differenceInMs > 0 ? 'Tổng thời gian kể từ khi bạn bắt đầu hành trình cai thuốc' : 'Thời gian cho đến khi bắt đầu bỏ thuốc'}
                </h2>
                <div className="flex justify-center items-baseline space-x-2 mt-2">
                    <span className="text-4xl font-bold text-primary-800">{difference.days}</span>
                    <span className="text-sm text-gray-500">ngày</span>
                    <span className="text-4xl font-bold text-primary-800">{difference.hours}</span>
                    <span className="text-sm text-gray-500">giờ</span>
                    <span className="text-4xl font-bold text-primary-800">{difference.minutes}</span>
                    <span className="text-sm text-gray-500">phút</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-primary-100 p-4 rounded-lg">
                    <div className="text-2xl">💰</div>
                    <div className="text-xl font-semibold text-primary-800">{moneySaved} VNĐ</div>
                    <div className="text-sm text-gray-600">Số tiền đã tiết kiệm</div>
                </div>
                <div className="bg-primary-100 p-4 rounded-lg">
                    <div className="text-2xl">🚭</div>
                    <div className="text-xl font-semibold text-primary-800">{cigsQuitted}</div>
                    <div className="text-sm text-gray-600">Số điếu đã bỏ</div>
                </div>
                <div className="bg-primary-100 p-4 rounded-lg">
                    <div className="text-2xl">🏆</div>
                    <div className="text-xl font-semibold text-primary-800">1</div>
                    <div className="text-sm text-gray-600">Huy hiệu đạt được</div>
                </div>
            </div>

            <div className="bg-primary-100 p-4 rounded-lg flex flex-col text-center relative">
                <div className="absolute right-3 top-3">
                    <a onClick={() => navigate('/onboarding')} className="text-sm text-primary-700 hover:underline">Chỉnh sửa?</a>
                </div>
                <div className="text-2xl">📅</div>
                <h3 className="text-lg font-semibold text-primary-800">Ngày tôi bắt đầu bỏ thuốc</h3>
                <p className="text-sm text-gray-600">
                    {localStartDate.toLocaleDateString('vi-VN')}
                </p>
            </div>

            <div className="bg-primary-100 p-4 rounded-lg flex flex-col items-center text-center relative">
                <div className="absolute right-3 top-3">
                    <a onClick={() => navigate('/onboarding')} className="text-sm text-primary-700 hover:underline">Chỉnh sửa?</a>
                </div>
                <div className="text-2xl">📉</div>
                <h3 className="text-lg font-semibold text-primary-800">Biểu đồ kế hoạch số điếu mỗi ngày</h3>
                {planLog.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={planLog}
                            margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                        >
                            <Line type="monotone" dataKey="cigs" stroke="#14b8a6" />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <ReferenceLine
                                x={currentDate < new Date(expectedQuitDate) ? currentDate.toISOString().split('T')[0] : ''}
                                stroke="#115e59"
                                label="Hôm nay"
                            />
                            <XAxis dataKey="date" tick={<CustomizedAxisTick />} interval={0} />
                            <YAxis />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="text-center">
                <a href="#" className="text-sm text-primary-700 hover:underline">🔗 Chia sẻ tiến trình</a>
            </div>
        </div>
    );
};

export default ProgressBoard;
