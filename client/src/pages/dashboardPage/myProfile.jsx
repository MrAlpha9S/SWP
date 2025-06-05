import React, {useEffect, useState} from 'react';
import CustomButton from "../../components/ui/CustomButton.jsx";
import {
    quittingMethodOptions,
    reasonListOptions,
    smokingTriggerOptions,
    timeAfterWakingRadioOptions,
    timeOfDayOptions
} from "../../constants/constants.js";
import {Divider} from "antd";
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {CustomizedAxisTick} from "../../components/utils/customizedAxisTick.jsx";
import {useAuth0, withAuthenticationRequired} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";

const MyProfile = () => {

    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [onboardingStatus, setOnboardingStatus] = useState(null);
    const navigate = useNavigate();
    const [msg, setMsg] = useState('');
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const getUserProfile = async () => {
            if (!isAuthenticated || !user) return;

            const token = await getAccessTokenSilently();

            const res = await fetch('http://localhost:3000/profiles/getProfile', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userAuth0Id: user.sub })
            });

            const data = await res.json();
            setUserProfile(data);
            console.log('data', data)
            setOnboardingStatus(data.success);
            setMsg(data.message)
        };

        getUserProfile();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    useEffect(() => {
        console.log('user profile', userProfile);
        console.log('msg', msg);
    }, [msg, userProfile]);

    return (<></>
        // <>
        //     <h2 className='text-left md:text-4xl lg:text-5xl font-bold'>
        //         Tổng kết thông tin của bạn
        //     </h2>
        //
        //     <div className='w-full lg:w-[80%] flex flex-col gap-5'>
        //         <div
        //             className="w-full p-5 flex flex-col gap-5 max-h-[500px] border border-primary-600 rounded-[8px]">
        //             <p className='text-left md:text-3xl lg:text-4xl font-bold'>
        //                 1. Mức độ sẵn sàng cai thuốc của bạn
        //             </p>
        //
        //             <p className='text-sm md:text-base'>
        //                 {readiness.label}
        //             </p>
        //             <CustomButton type='primary' onClick={() => setCurrentStep(0)}>Thay đổi</CustomButton>
        //         </div>
        //         <div
        //             className="w-full p-5 flex flex-col gap-5 max-h-[500px] border border-primary-600 rounded-[8px]">
        //             <p className='text-left md:text-3xl lg:text-4xl font-bold'>
        //                 2. Động lực của bạn
        //             </p>
        //
        //             <p className='md:text-lg lg:text-xl font-bold'>
        //                 Những động lực lớn nhất của bạn
        //             </p>
        //
        //             <ul>
        //                 {reasonList.map((item, index) => {
        //                     const reason = (reasonListOptions.find(option => option.value === item));
        //                     return <li key={index} className='text-sm md:text-base'>
        //                         {reason.label}
        //                     </li>
        //                 })}
        //             </ul>
        //             <CustomButton type='primary' onClick={() => setCurrentStep(1)}>Thay đổi</CustomButton>
        //         </div>
        //         <div
        //             className="w-full p-5 flex flex-col gap-5 max-h-[500px] border border-primary-600 rounded-[8px]">
        //             <p className='text-left md:text-3xl lg:text-4xl font-bold'>
        //                 3. Thói quen hút thuốc của bạn
        //             </p>
        //
        //             <p className='md:text-lg lg:text-xl font-bold'>
        //                 Bạn thường hút thuốc bao lâu sau khi thức dậy?
        //             </p>
        //             <p className='text-sm md:text-base'>
        //                 {timeAfterWakingRadioOptions.find((option) => option.value === timeAfterWaking).label}
        //             </p>
        //             <p className='md:text-lg lg:text-xl font-bold'>
        //                 Bạn thường hút thuốc vào thời điểm nào trong ngày?
        //             </p>
        //             <ul>
        //                 {timeOfDayList.map((item, index) => {
        //                     const time = (timeOfDayOptions.find(option => option.value === item));
        //                     return <li key={index} className='text-sm md:text-base'>
        //                         {item !== 'other' ? `${time.label}` : `${customTimeOfDay}`}
        //                     </li>
        //                 })}
        //             </ul>
        //             <p className='md:text-lg lg:text-xl font-bold'>
        //                 Điều gì khiến bạn muốn hút thuốc?
        //             </p>
        //             <ul>
        //                 {triggers.map((item, index) => {
        //                     const trigger = (smokingTriggerOptions.find(option => option.value === item));
        //                     return <li key={index} className='text-sm md:text-base'>
        //                         {item !== 'other' ? `${trigger.label}` : `${customTrigger}`}
        //                     </li>
        //                 })}
        //             </ul>
        //             <CustomButton type='primary' onClick={() => setCurrentStep(3)}>Thay đổi</CustomButton>
        //         </div>
        //         <div
        //             className="w-full p-5 flex flex-col gap-5 max-h-[2000px] border border-primary-600 rounded-[8px]">
        //             <p className='text-left md:text-3xl lg:text-4xl font-bold'>
        //                 4.{readinessValue === 'ready' ? ' Thông tin kế hoạch' : ' Tình hình hiện tại'}
        //             </p>
        //             <p className='md:text-lg lg:text-xl font-bold'>
        //                 Thông tin thuốc
        //             </p>
        //
        //             <p className='text-sm md:text-base'>
        //                 Số điếu trong một gói: {cigsPerPack} <br/>
        //                 Giá tiền của một gói: {pricePerPack.toLocaleString('vi-VN')} VNĐ <br/>
        //                 Số điếu bạn đã từng hút trong một ngày: {cigsPerDay}
        //             </p>
        //             <CustomButton type='primary' onClick={() => setCurrentStep(2)}>Thay đổi</CustomButton>
        //
        //
        //
        //             {readinessValue === 'relapse-support' && (
        //                 <>
        //                     <Divider/>
        //                     <p className='md:text-lg lg:text-xl font-bold'>
        //                         Thống kê kết quả
        //                     </p>
        //                     <p className='text-sm md:text-base'>
        //                         Kể từ khi bạn bỏ thuốc từ ngày <strong>{stoppedDate}</strong>, bạn đã: <br/>
        //                         Bỏ thuốc được <strong>{Math.floor((new Date() - new Date(stoppedDate)) / (1000 * 60 * 60 * 24))}</strong> ngày <br/>
        //                         Bỏ được <strong>
        //                         {Math.floor((new Date() - new Date(stoppedDate)) / (1000 * 60 * 60 * 24)) * cigsPerDay}
        //                     </strong> điếu thuốc <br/>
        //                         Tiết kiệm được <strong>{(Math.floor((new Date() - new Date(stoppedDate)) / (1000 * 60 * 60 * 24)) * cigsPerDay * (pricePerPack / cigsPerPack)).toLocaleString("vi-VN")} VNĐ</strong> <br/>
        //                         <em>Hãy giữ vững tinh thần nhé!</em>
        //
        //                     </p>
        //                 </>
        //             )}
        //
        //             {readinessValue === 'ready' &&
        //                 <>
        //                     <Divider/>
        //                     <p className='md:text-lg lg:text-xl font-bold'>
        //                         Kế hoạch
        //                     </p>
        //
        //                     <p className='text-sm md:text-base'>
        //                         Ngày bắt đầu: {startDate} <br/>
        //                         Số điếu hút mỗi ngày: {cigsPerDay} <br/>
        //                         Phương
        //                         pháp: {quittingMethodOptions.find(option => option.value === quittingMethod).label}
        //                         <br/>
        //                         {quittingMethod === 'gradual-daily' && 'Số điếu giảm mỗi ngày: ' + cigsReduced}
        //                         {quittingMethod === 'gradual-weekly' && 'Số điếu giảm mỗi tuần: ' + cigsReduced} <br/>
        //                         Ngày dự kiến bỏ thuốc: {expectedQuitDate}
        //                         <br/>
        //                         Biểu đồ theo dõi
        //                         <LineChart width={700} height={300} data={planLog} margin={{
        //                             top: 20,
        //                             right: 30,
        //                             left: 20,
        //                             bottom: 25,
        //                         }}>
        //                             <Line type="monotone" dataKey="cigs" stroke="#14b8a6"/>
        //                             <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
        //                             <XAxis dataKey="date" tick={<CustomizedAxisTick/>} interval={0}/>
        //                             <YAxis/>
        //                             <Tooltip/>
        //                         </LineChart>
        //                         <CustomButton type='primary' onClick={() => setCurrentStep(4)}>Thay đổi</CustomButton>
        //                     </p>
        //
        //                     <Divider/>
        //
        //                     <p className='md:text-lg lg:text-xl font-bold'>
        //                         Số tiền bạn sẽ tiết kiệm được
        //                     </p>
        //
        //                     <div className='grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 items-center'>
        //                         <p className='text-2xl font-bold'>{calculatePrice('week')} VNĐ</p>
        //                         <span>một tuần</span>
        //
        //                         <p className='text-2xl font-bold'>{calculatePrice('month')} VNĐ</p>
        //                         <span>một tháng</span>
        //
        //                         <p className='text-2xl font-bold'>{calculatePrice('year')} VNĐ</p>
        //                         <span>một năm</span>
        //
        //                         <p className='text-2xl font-bold'>{calculatePrice('year', 5)} VNĐ</p>
        //                         <span>năm năm</span>
        //
        //                         <p className='text-2xl font-bold'>{calculatePrice('year', 10)} VNĐ</p>
        //                         <span>mười năm</span>
        //                     </div>
        //                 </>
        //             }
        //
        //         </div>
        //
        //         {(createGoalChecked && goalList) &&
        //             <>
        //                 <div
        //                     className="w-full p-5 flex flex-col gap-5 max-h-[500px] border border-primary-600 rounded-[8px]">
        //                     <p className='text-left md:text-3xl lg:text-4xl font-bold'>
        //                         5. Những mục tiêu ngắn hạn
        //                     </p>
        //                     <div className="flex flex-wrap gap-2">
        //                         {goalList?.map((item, index) => (
        //                             <div key={index}>
        //                                 <strong>{index + 1}.</strong> <br/>
        //                                 <p className='text-sm md:text-base'>Tên mục tiêu: {item.goalName}</p>
        //                                 <p className='text-sm md:text-base'>Số tiền cần tiết
        //                                     kiệm: {item.goalAmount.toLocaleString('vi-VN')}</p>
        //                                 <p className='text-sm md:text-base font-bold'>Nếu cứ duy trì kế hoạch, bạn sẽ
        //                                     đạt được mục tiêu sau: {calculateDateGoal(item.goalAmount)} ngày</p>
        //                             </div>
        //                         ))}
        //                     </div>
        //                     <CustomButton type='primary' onClick={() => setCurrentStep(5)}>Thay đổi</CustomButton>
        //                 </div>
        //             </>}
        //     </div>
        // </>
    );
};

export default withAuthenticationRequired(MyProfile);