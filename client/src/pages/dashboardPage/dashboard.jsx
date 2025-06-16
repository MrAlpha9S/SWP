import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getUserProfile, syncProfileToStores } from "../../components/utils/profileUtils.js";
import {
    useCigsPerPackStore, useCurrentStepDashboard,
    useErrorStore, useGoalsStore, usePlanStore,
    usePricePerPackStore, useProfileExists,
    useQuitReadinessStore,
    useReasonStore, useTimeAfterWakingStore, useTimeOfDayStore, useTriggersStore
} from "../../stores/store.js";
import { useNavigate } from "react-router-dom";
import Hero from "../../components/layout/dashboard/hero.jsx"
import ProgressBoard from "../../components/layout/dashboard/progressBoard.jsx";
import { useQuery } from '@tanstack/react-query'
import { useCheckInDataStore } from "../../stores/checkInStore.js";
import { Typography } from "antd";
import NotFoundBanner from "../../components/layout/notFoundBanner.jsx";
import Sidebar from "../../components/layout/dashboard/sidebar.jsx";
import Coachsidebar from "../../components/layout/dashboard/coachsidebar.jsx";
import CheckinBoard from "../../components/layout/dashboard/checkinBoard.jsx";
import { queryClient } from "../../main.jsx";

import PostBlog from '../../components/layout/coachboard/postblog.jsx'

function Dashboard() {
    const { readinessValue } = useQuitReadinessStore();
    const { addError, removeError } = useErrorStore();
    const { reasonList } = useReasonStore();
    const { pricePerPack } = usePricePerPackStore();
    const { cigsPerPack } = useCigsPerPackStore();
    const { timeAfterWaking } = useTimeAfterWakingStore();
    const { timeOfDayList, customTimeOfDay, customTimeOfDayChecked } = useTimeOfDayStore();
    const { triggers, customTrigger, customTriggerChecked } = useTriggersStore();
    const {
        startDate,
        cigsPerDay,
        quittingMethod,
        cigsReduced,
        expectedQuitDate,
        stoppedDate,
        planLog,
        planLogCloneDDMMYY
    } = usePlanStore();
    const { createGoalChecked, goalAmount, goalList } = useGoalsStore()
    const navigate = useNavigate();
    const { isProfileExist } = useProfileExists();
    const { setCheckInDataSet } = useCheckInDataStore()
    const [heroHeight, setHeroHeight] = useState(188);
    const [heroTitle, setHeroTitle] = useState("");
    const { currentStepDashboard, setCurrentStepDashboard } = useCurrentStepDashboard();


    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

    const {
        isPending: isUserProfilePending,
        data: userProfile,
    } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            if (!isAuthenticated || !user) return;
            return await getUserProfile(user, getAccessTokenSilently, isAuthenticated);
        },
        enabled: isAuthenticated && !!user,
    })

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['checkin-status'] });
    }, []);

    useEffect(() => {
        if (isUserProfilePending || !userProfile) return;

        const syncStores = async () => {
            await syncProfileToStores();
        }
        syncStores();
    }, [userProfile, isUserProfilePending])

    // useEffect(() => {
    //     if (!isDatasetPending) {
    //         setCheckInDataSet(checkInDataset?.data)
    //     }
    // }, [checkInDataset, isDatasetPending])

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setHeroHeight(50)
            } else {
                setHeroHeight(188)
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener("scroll", handleScroll);

            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }
    }, []);

    useEffect(() => {
        switch (currentStepDashboard) {
            case 'dashboard':
                setHeroTitle('Bảng điều khiển');
                break;
            case 'notifications':
                setHeroTitle('Thông báo');
                break;
            case 'check-in':
                setHeroTitle('Check-in hàng ngày');
                break;
            case 'goals':
                setHeroTitle('Mục tiêu');
                break;
            case 'savings':
                setHeroTitle('Tiết kiệm');
                break;
            case 'distraction-tools':
                setHeroTitle('Quản lý cơn thèm');
                break;
            case 'badges':
                setHeroTitle('Huy hiệu');
                break;
            default:
                setHeroTitle('');
                break;
        }
    }, [currentStepDashboard]);


    return (
        <div className="bg-primary-50 min-h-screen flex flex-col">
            <Hero title={heroTitle} heroHeight={heroHeight} />
            <div className="flex flex-col md:flex-row gap-4 px-1 py-4 md:px-4">
                <div className='max-w-[30%] sticky top-[155px] self-start h-fit hidden md:block'><Coachsidebar
                    currentStepDashboard={currentStepDashboard} setCurrentStepDashboard={setCurrentStepDashboard}
                    mode="inline" /></div>
                <div className='max-w-[30%] sticky top-[155px] self-start h-fit md:hidden'><Coachsidebar
                    currentStepDashboard={currentStepDashboard} setCurrentStepDashboard={setCurrentStepDashboard}
                    collapse={true} mode="horizontal" /></div>

                <div className="w-full">
                    {!isAuthenticated || isUserProfilePending ? (
                        <ProgressBoard isPending={true} />
                    ) : currentStepDashboard === 'dashboard' ? (
                        userProfile.data ? <ProgressBoard
                            startDate={startDate}
                            pricePerPack={pricePerPack}
                            cigsPerPack={cigsPerPack}
                            cigsReduced={cigsReduced}
                            quittingMethod={quittingMethod}
                            planLog={planLog}
                            cigsPerDay={cigsPerDay}
                            expectedQuitDate={expectedQuitDate}
                            stoppedDate={stoppedDate}
                            isPending={false}
                            readinessValue={readinessValue}
                            planLogCloneDDMMYY={planLogCloneDDMMYY}
                            setCurrentStepDashboard={setCurrentStepDashboard}
                            user={user}
                            isAuthenticated={isAuthenticated}
                            getAccessTokenSilently={getAccessTokenSilently}
                        /> :
                            <NotFoundBanner title='Không tìm thấy kế hoạch của bạn' />
                    ) : currentStepDashboard === 'check-in' ? (
                        <CheckinBoard />
                    ) : currentStepDashboard === 'post-blog' && (
                        <PostBlog user_id={userProfile.data.user_id[0]} />
                    )}
                </div>

            </div>
        </div>
    );

}


export default (Dashboard);