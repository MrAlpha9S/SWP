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
import {getUserInfo} from "../../components/utils/userUtils.js";
import { useNavigate } from "react-router-dom";
import Hero from "../../components/layout/dashboard/hero.jsx"
import ProgressBoard from "../../components/layout/dashboard/progressBoard.jsx";
import { useQuery } from '@tanstack/react-query'
import { useCheckInDataStore } from "../../stores/checkInStore.js";
import NotFoundBanner from "../../components/layout/notFoundBanner.jsx";
import Sidebar from "../../components/layout/dashboard/sidebar.jsx";
import CoachSideBar from "../../components/layout/dashboard/coachsidebar.jsx"
import CheckinMenu from "../../components/layout/dashboard/checkinMenu.jsx";
import { queryClient } from "../../main.jsx";
import GoalsMenu from "../../components/layout/dashboard/goalsMenu.jsx";
import SavingsMenu from "../../components/layout/dashboard/savingsMenu.jsx";
import DistractionTools from "../../components/layout/dashboard/distractionTools.jsx";
import BadgesMenu from "../../components/layout/dashboard/badgesMenu.jsx";

import PostBlog from '../../components/layout/coachboard/postblog.jsx'
import MessageBox from "../../components/layout/coachboard/messager/messager.jsx";

function Dashboard() {
    const {readinessValue} = useQuitReadinessStore();
    const {addError, removeError} = useErrorStore();
    const {reasonList} = useReasonStore();
    const {pricePerPack} = usePricePerPackStore();
    const {cigsPerPack} = useCigsPerPackStore();
    const {timeAfterWaking} = useTimeAfterWakingStore();
    const {timeOfDayList, customTimeOfDay, customTimeOfDayChecked} = useTimeOfDayStore();
    const {triggers, customTrigger, customTriggerChecked} = useTriggersStore();
    const {
        startDate,
        cigsPerDay,
        quittingMethod,
        cigsReduced,
        expectedQuitDate,
        stoppedDate,
        planLog,
        planLogCloneDDMMYY,
    } = usePlanStore();
    const {createGoalChecked, goalAmount, goalList, setMoneySaved} = useGoalsStore()
    const navigate = useNavigate();
    const {isProfileExist} = useProfileExists();
    const {setCheckInDataSet} = useCheckInDataStore()
    const [heroHeight, setHeroHeight] = useState(188);
    const [heroTitle, setHeroTitle] = useState("");
    const {currentStepDashboard, setCurrentStepDashboard} = useCurrentStepDashboard();
    const [userInfo, setUserInfo] = useState();

    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();

    const {
        data: userIn4,
        isPending: isUserIn4Pending,
    } = useQuery({
        queryKey: ['userIn4'],
        queryFn: async () => {
            if (!isAuthenticated || !user) return;
            return await getUserInfo(user, getAccessTokenSilently, isAuthenticated);
        },
        enabled: isAuthenticated && !!user,
    })

    useEffect(() => {
        if (!isUserIn4Pending) {
            setUserInfo(userIn4.data)
        }
    }, [isUserIn4Pending])

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
        queryClient.invalidateQueries({queryKey: ['checkin-status']});
    }, []);

    useEffect(() => {
        if (isUserProfilePending || !userProfile) return;

        const syncStores = async () => {
            await syncProfileToStores();
        }
        syncStores();
    }, [userProfile, isUserProfilePending])

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
            case 'post-blog':
                setHeroTitle('Đăng Bài Blog');
                break;
            case 'messager':
                setHeroTitle('Trò Chuyện');
                break;
            default:
                setHeroTitle('');
                break;
        }
    }, [currentStepDashboard]);

    const renderBoard = () => {
        if (!isAuthenticated || isUserProfilePending || isUserIn4Pending) {
            return <ProgressBoard isPending={true}/>;
        }

        switch (currentStepDashboard) {
            case 'dashboard':
                return userProfile.data ? (
                    <ProgressBoard

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
                        setMoneySaved={setMoneySaved}
                    />
                ) : (
                    <NotFoundBanner title="Không tìm thấy kế hoạch của bạn"/>
                );

            case 'check-in':
                return <CheckinMenu/>;

            case 'goals':
                return <GoalsMenu/>;

            case 'savings':
                return <SavingsMenu/>

            case 'distraction-tools':
                return <DistractionTools/>

            case 'badges':
                return <BadgesMenu/>;
            case 'messager':
                return <MessageBox/>
            case 'post-blog':
                return <PostBlog/>

            default:
                return <NotFoundBanner title="Không tìm thấy mục tương ứng"/>;
        }
    };

    const renderSidebar = (SidebarComponent, currentStepDashboard, setCurrentStepDashboard) => {
        const commonProps = {
            currentStepDashboard,
            setCurrentStepDashboard
        };

        return (
            <>
                {/* Desktop Sidebar */}
                <div className='sticky top-[155px] self-start h-fit hidden md:block'>
                    <SidebarComponent
                        {...commonProps}
                        mode="inline"
                    />
                </div>

                {/* Mobile Sidebar */}
                <div className='max-w-[30%] sticky top-[155px] self-start h-fit md:hidden'>
                    <SidebarComponent
                        {...commonProps}
                        collapse={true}
                        mode="horizontal"
                    />
                </div>
            </>
        );
    };

    const dashboardHandle = (role) => {
        if (role === 'Member') {
            return renderSidebar(Sidebar, currentStepDashboard, setCurrentStepDashboard);
        } else if (role === 'Coach') {
            return renderSidebar(CoachSideBar, currentStepDashboard, setCurrentStepDashboard);
        }
        return null;
    }

    return (
        <div className="bg-primary-50 min-h-screen flex flex-col">
            <Hero title={heroTitle} heroHeight={heroHeight} role={userInfo?.role} username={userInfo?.username}/>
            <div className="flex flex-col md:flex-row gap-4 px-1 py-4 md:px-4">
                {dashboardHandle(userInfo?.role)}

                <div className="w-full flex flex-col items-center gap-4 px-1 pb-4 md:px-4">
                    {renderBoard()}
                </div>
            </div>
        </div>
    )

}


export default (Dashboard);