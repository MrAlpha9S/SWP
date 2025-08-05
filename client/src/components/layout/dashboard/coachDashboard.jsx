import React, {useEffect, useState} from 'react';
import {usePlanStore, useUserInfoStore} from "../../../stores/store.js";
import CustomButton from "../../ui/CustomButton.jsx";
import {useNavigate} from "react-router-dom";
import {Card} from "antd";
import {useQuery} from "@tanstack/react-query";
import {alreadyHaveSubCheck, getCoachByIdOrAuth0Id} from "../../utils/userUtils.js";
import {convertYYYYMMDDStrToDDMMYYYYStr} from "../../utils/dateUtils.js";
import {CheckCircle, Star, Users} from "lucide-react";
import NotFoundBanner from "../notFoundBanner.jsx";
import Messager from '../coachboard/messager/messager.jsx'
import NotesManager from "../coachboard/notesManager.jsx";
import CoachUser from "../coachboard/coachUser.jsx";
import {useAuth0} from "@auth0/auth0-react";

const CoachDashboard = () => {
    const {userInfo} = useUserInfoStore()
    const navigate = useNavigate();
    const [coachInfo, setCoachInfo] = useState();
    const [alreadyHaveSub, setAlreadyHaveSub] = useState(false);
    const {Meta} = Card
    const {getAccessTokenSilently, isAuthenticated} = useAuth0()

    const {isPending : isCoachInfoPending, data: coachInfoFetched} = useQuery({
        queryFn: async () => {
            return await getCoachByIdOrAuth0Id(userInfo?.user_id)
        },
        queryKey: ['coach-info-dashboard'],
        enabled: userInfo !== null,
    })

    const {isPending : isSubCheckPending, data : alreadyHaveSubFromAPI} = useQuery({
        queryFn: async () => {
            const token = await getAccessTokenSilently()
            return await alreadyHaveSubCheck(userInfo?.auth0_id, token)
        },
        queryKey: ['subscription-check'],
        enabled: userInfo !== null && isAuthenticated,
    })

    useEffect(() => {
        if (!isSubCheckPending && alreadyHaveSubFromAPI) {
            setAlreadyHaveSub(alreadyHaveSubFromAPI.message)
        }
    }, [isSubCheckPending])

    useEffect(() => {
        if (!isCoachInfoPending && coachInfoFetched?.data) {
            setCoachInfo(coachInfoFetched?.data)
        }
    }, [isCoachInfoPending])

    if (userInfo && userInfo.sub_id === 1 && !alreadyHaveSub) {
        return (
            <div className='space-y-4'>
                <p>Chức năng này dành riêng cho người dùng <strong>Premium</strong>. Nâng cấp ngay để truy cập những
                    chức năng sau:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Tự lên kế hoạch bỏ thuốc với lộ trình rõ ràng và dễ dàng theo dõi</li>
                    <li><strong>Hoặc</strong>, nếu cần, <strong>làm việc trực tiếp với Huấn luyện viên</strong> của
                        chúng tôi để lên một kế hoạch phù hợp cho bạn.
                    </li>
                    <li>Chat 1-1 với Huấn luyện viên 24/24, nhận sự giúp đỡ bất cứ lúc nào.</li>
                </ul>
                <CustomButton onClick={() => navigate('/subscription/coach-dashboard')}>Tìm hiểu ngay</CustomButton>
                <div className='flex gap-5'>
                    <Card
                        hoverable
                        style={{width: 340}}
                        cover={<img alt="example" src="/plan-graph.png"/>}
                    >
                        <Meta title="Lộ trình rõ ràng"/>
                    </Card>
                    <Card
                        hoverable
                        style={{width: 340}}
                        cover={<img alt="example" src="/create-plan.png"/>}
                    >
                        <Meta title="Lên kế hoạch bỏ thuốc"/>
                    </Card>
                </div>
            </div>
        )
    } else if (userInfo && coachInfo?.coach) {
        return (
            <div className='relative w-full h-full min-h-0'>
                {/* Overlay if subscription expired */}
                {userInfo.sub_id === 1 && alreadyHaveSub && (
                    <div className='absolute inset-0 z-[49] flex items-center justify-center bg-black/30 backdrop-blur-sm'>
                        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md flex flex-col items-center">
                            <h2 className="text-2xl font-bold mb-4 text-red-600">Gói của bạn đã hết hạn</h2>
                            <p className="mb-6">
                                Bạn cần gia hạn để tiếp tục sử dụng các chức năng Premium.
                            </p>
                            <CustomButton onClick={() => navigate('/subscription/coach-dashboard')}>
                                Gia hạn ngay
                            </CustomButton>
                        </div>
                    </div>
                )}

                {/* Main dashboard content */}
                <div className='rounded-xl bg-white w-full h-full p-5 flex flex-col gap-5'>
                    <p className='text-2xl font-bold'>Huấn luyện viên của bạn</p>
                    <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative">
                                <img
                                    src={coachInfo?.coach.avatar}
                                    alt={coachInfo?.coach.username}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-success-500 rounded-full p-2">
                                    <CheckCircle className="w-6 h-6 text-white"/>
                                </div>
                            </div>
                            <div className="text-center md:text-left text-white">
                                <h1 className="text-3xl font-bold mb-2">{coachInfo?.coach.username}</h1>
                                <p className="text-xl text-primary-100 mb-4">Huấn luyện viên cai thuốc</p>
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <div>
                                        Ngày bắt đầu kết nối:{' '}
                                        {coachInfo?.coach.started_date
                                            ? convertYYYYMMDDStrToDDMMYYYYStr(coachInfo.coach.started_date.split('T')[0])
                                            : 'Chưa có thông tin'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex-1 w-full flex min-h-0'>
                        <div>
                            <CoachUser userAuth0Id={userInfo?.auth0_id} from='user' coach={coachInfo?.coach}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else if (userInfo && userInfo.sub_id !== 1 && !coachInfo?.coach) {
        return (
            <div className='w-full h-full'>
                <NotFoundBanner title="Bạn chưa chọn huấn luyện viên" type='userWithoutCoach'/>
            </div>
        )
    }
};

export default CoachDashboard;