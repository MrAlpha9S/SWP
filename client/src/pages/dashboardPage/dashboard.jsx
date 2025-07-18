import React, {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {getUserProfile, syncProfileToStores} from "../../components/utils/profileUtils.js";
import {
    useCigsPerPackStore, useCoachInfoStore, useCoachStatsStore, useCurrentStepDashboard,
    useErrorStore, useGoalsStore, usePlanStore,
    usePricePerPackStore, useProfileExists,
    useQuitReadinessStore,
    useReasonStore, useTimeAfterWakingStore, useTimeOfDayStore, useTriggersStore, useUserInfoStore
} from "../../stores/store.js";
import {useNavigate} from "react-router-dom";
import Hero from "../../components/layout/dashboard/hero.jsx"
import ProgressBoard from "../../components/layout/dashboard/progressBoard.jsx";
import {useQuery} from '@tanstack/react-query'
import {useCheckInDataStore} from "../../stores/checkInStore.js";
import NotFoundBanner from "../../components/layout/notFoundBanner.jsx";
import Sidebar from "../../components/layout/dashboard/sidebar.jsx";
import CoachSideBar from "../../components/layout/dashboard/coachsidebar.jsx"
import CheckinMenu from "../../components/layout/dashboard/checkinMenu.jsx";
import {queryClient} from "../../main.jsx";
import GoalsMenu from "../../components/layout/dashboard/goalsMenu.jsx";
import SavingsMenu from "../../components/layout/dashboard/savingsMenu.jsx";
import DistractionTools from "../../components/layout/dashboard/distractionTools.jsx";
import BadgesMenu from "../../components/layout/dashboard/badgesMenu.jsx";

import PostBlog from '../../components/layout/coachboard/postblog.jsx'
import MessageBox from "../../components/layout/coachboard/messager/messager.jsx";
import PageFadeWrapper from "../../components/utils/PageFadeWrapper.jsx";
import CoachDashboard from "../../components/layout/dashboard/coachDashboard.jsx";
import Messager from "../../components/layout/coachboard/messager/messager.jsx";
import CoachOverview from "../../components/layout/coachboard/coachOverview.jsx";
import {getStats} from "../../components/utils/coachUtils.js";
import ManageBlog from "../../components/layout/coachboard/manageBlog.jsx";
import CoachUser from "../../components/layout/coachboard/coachUser.jsx";
import {getCoachByIdOrAuth0Id} from "../../components/utils/userUtils.js";
import UserReviews from "../../components/layout/coachboard/UserReviews.jsx";

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
    const {userInfo} = useUserInfoStore()
    const {coachStats, setCoachStats} = useCoachStatsStore()
    const {coachInfo, setCoachInfo} = useCoachInfoStore()

    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();

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

    const {
        isPending: isCoachStatsPending,
        data: coachStatsFetched,
    } = useQuery({
        queryKey: ['coachStats'],
        queryFn: async () => {
            return await getStats(user, getAccessTokenSilently, isAuthenticated);
        },
        enabled: isAuthenticated && !!user && userInfo?.role === 'Coach',
    })

    const {
        isPending: isCoachInfoPending,
        data: coachInfoFetched,
    } = useQuery({
        queryKey: ['coach-info'],
        queryFn: async () => {
            return await getCoachByIdOrAuth0Id(userInfo?.user_id);
        },
        enabled: isAuthenticated && !!user && userInfo?.role === 'Coach',
    })

    useEffect(() => {
        if (!isCoachStatsPending && userInfo?.role === 'Coach') {
            setCoachStats(coachStatsFetched?.data);
        }
    }, [coachStatsFetched, isCoachStatsPending, setCoachStats, setCurrentStepDashboard, userInfo]);

    useEffect(() => {
        if (!isCoachInfoPending && userInfo?.role === 'Coach') {
            setCoachInfo(coachInfoFetched?.data)
        }
    }, [coachInfoFetched, isCoachInfoPending, setCoachInfo, userInfo]);

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
            case 'coach':
                setHeroTitle('Huấn luyện viên');
                break;
            default:
                setHeroTitle('');
                break;
        }
    }, [currentStepDashboard]);

    const renderBoard = () => {
        if ((!isAuthenticated || isUserProfilePending) && userInfo?.role === 'Member') {
            return <ProgressBoard isPending={true}/>;
        }

        if ((!isAuthenticated || isCoachInfoPending || isCoachStatsPending) && userInfo?.role === 'Coach') {
            return <CoachOverview isDataPending={true}/>;
        }

        if (currentStepDashboard?.length > 0) {
            switch (currentStepDashboard) {
                case 'dashboard':
                    return userProfile?.data?.userProfile ? (
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
                            userInfo={userInfo}
                            isAuthenticated={isAuthenticated}
                            getAccessTokenSilently={getAccessTokenSilently}
                            setMoneySaved={setMoneySaved}
                        />
                    ) : (
                        currentStepDashboard === 'dashboard' && <NotFoundBanner title="Không tìm thấy kế hoạch của bạn" type="progressNCoach" />
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
                    return <div className='w-full h-screen'><Messager role={userInfo?.role}/></div>
                case 'post-blog':
                    return <ManageBlog/>

                case 'overview':
                    return <CoachOverview stats={coachStats}/>

                case 'coach-user':
                    return <CoachUser/>

                case 'coach':
                    return <CoachDashboard/>;

                case 'user-review':
                    return <UserReviews/>

                default:
                    return <NotFoundBanner title="Không tìm thấy mục tương ứng"/>;
            }
        }
    };

    const renderSidebar = (SidebarComponent, currentStepDashboard, setCurrentStepDashboard) => {
        const commonProps = {
            currentStepDashboard,
            setCurrentStepDashboard
        };

        return (
            <>
                {/* Desktop Sidebar - Only shows on large screens (1024px+) */}
                <div className='sticky top-[155px] self-start h-fit hidden lg:block min-w-[280px] w-[280px]'>
                    <SidebarComponent
                        {...commonProps}
                        mode="inline"
                    />
                </div>

                {/* Mobile/Tablet Sidebar - Horizontal at top for screens below 1024px */}
                <div className='w-full sticky top-[0px] z-10 lg:hidden mb-4 bg-white shadow-sm rounded-lg p-3'>
                    <SidebarComponent
                        {...commonProps}
                        mode="horizontal"
                        collapse={true}
                    />
                </div>
            </>
        );
    };

    const userRole = userInfo?.role;

    const dashboardHandle = (role) => {
        if (role === 'Member') {
            return renderSidebar(Sidebar, currentStepDashboard, setCurrentStepDashboard);
        } else if (role === 'Coach') {
            return renderSidebar(CoachSideBar, currentStepDashboard, setCurrentStepDashboard);
        }
        return null;
    }

    return (
        <PageFadeWrapper>
            <div className="w-full min-h-screen bg-primary-50 flex flex-col items-center">
                <Hero title={heroTitle} heroHeight={heroHeight} role={userRole} username={userInfo?.username}/>

                {/* Responsive Container */}
                <div className="w-full max-w-[1680px] flex flex-col lg:flex-row gap-2 sm:gap-4 px-2 py-2 sm:px-4 sm:py-4 overflow-hidden">
                    {dashboardHandle(userRole)}

                    {/* Main Content Area */}
                    <div className="flex-1 min-h-full flex flex-col items-center gap-2 sm:gap-4 px-1 pb-4 sm:px-4 pt-2 lg:pt-0 overflow-y-auto min-w-0">
                        {renderBoard()}
                    </div>
                </div>
            </div>
        </PageFadeWrapper>
    )
}

export default (Dashboard);