import React, {useEffect, useState} from 'react';
import CustomButton from "../../ui/CustomButton.jsx";
import {useNavigate} from "react-router-dom";
import {differenceInMilliseconds} from "date-fns";

const ProgressBoard = ({startDate, pricePerPack, cigsPerPack, cigsReduced, quittingMethod}) => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCurrentDate(new Date());
        }, 60000)
        return () => {
            clearTimeout(timeout);
        }
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
            seconds: seconds % 60,
            isNegative: false,
        };
    };

    const localStartDate = new Date('2025-06-01');
    const localStartYear = localStartDate.getFullYear();
    const localStartMonth = localStartDate.toLocaleString('default', { month: '2-digit' });
    const localStartDay= String(localStartDate.getDate()).padStart(2, '0');

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.toLocaleString('default', { month: '2-digit' });
    const currentDay = String(currentDate.getDate()).padStart(2, '0');

    const differenceInMs = differenceInMilliseconds(currentDate, localStartDate);
    const difference = formatDateDifference(differenceInMs);

    const pricePerCig = Math.round(pricePerPack / cigsPerPack)
    const dayDifference = formatDateDifference(differenceInMs).days
    let cigsQuitted = 0
    let moneySaved = 0
    if (differenceInMs > 0) {
        if (quittingMethod === 'gradual-daily') {
            cigsQuitted = (cigsReduced * dayDifference);
        } else if (quittingMethod === 'gradual-weekly') {
            cigsQuitted = (cigsReduced * dayDifference /7);
        }
        moneySaved = (cigsQuitted * pricePerCig);
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
                <h2 className="text-gray-600 text-sm font-medium">{differenceInMs > 0 ? 'Tổng thời gian không khói thuốc' : 'Thời gian cho đến khi bắt đầu bỏ thuốc'}</h2>
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
                    {differenceInMs > 0 ? `${localStartDay}-${localStartMonth}-${localStartYear} đến ${currentDay}-${currentMonth}-${currentYear}` :
                        startDate}
                </p>
            </div>

            <div className="text-center">
                <a href="#" className="text-sm text-primary-700 hover:underline">🔗 Chia sẻ tiến trình</a>
            </div>

        </div>
    );
};

export default ProgressBoard;