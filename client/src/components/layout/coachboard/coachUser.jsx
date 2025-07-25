import React, {useEffect, useMemo, useState} from 'react';
import Messager from "./messager/messager.jsx";
import {useSelectedUserAuth0IdStore, useUserInfoStore} from "../../../stores/store.js";
import {useQuery} from "@tanstack/react-query";
import {getUserProfile} from "../../utils/profileUtils.js";
import {useAuth0} from "@auth0/auth0-react";
import ProgressBoard from "../dashboard/progressBoard.jsx";
import {convertYYYYMMDDStrToDDMMYYYYStr} from "../../utils/dateUtils.js";
import NotFoundBanner from "../notFoundBanner.jsx";

import {Tabs} from "antd";
import UserProfileInMessage from "./userProfileInMessage.jsx";
import {getCheckInDataSet} from "../../utils/checkInUtils.js";
import Journal from "../dashboard/journal.jsx";
import NotesManager from "./notesManager.jsx";
import {IoReload} from "react-icons/io5";
import {queryClient} from "../../../main.jsx";
import {useNotificationManager} from "../../hooks/useNotificationManager.jsx";
import ReviewForm from "../dashboard/reviewForCoach.jsx";


const CoachUser = ({userAuth0Id = null, coach}) => {
    const {userInfo} = useUserInfoStore()
    const {user, isAuthenticated, getAccessTokenSilently} = useAuth0();
    const {selectedUserAuth0Id, setSelectedUserAuth0Id} = useSelectedUserAuth0IdStore()
    const [isCooldown, setIsCooldown] = useState(false);
    const {openNotification} = useNotificationManager()

    const handleReload = () => {
        if (isCooldown) return;

        // Trigger revalidation
        queryClient.invalidateQueries(['user-profile-coach']);
        queryClient.invalidateQueries(['dataset-coach']);

        openNotification('success', {
            message: 'Làm mới thành công'
        })

        // Start 1-minute cooldown
        setIsCooldown(true);
        setTimeout(() => {
            setIsCooldown(false);
        }, 60 * 1000); // 60 seconds
    };

    useEffect(() => {
        if (userAuth0Id) {
            setSelectedUserAuth0Id(userAuth0Id);
        }
    }, [setSelectedUserAuth0Id, userAuth0Id])

    // User profile query
    const {isPending: isProfilePending, data: profileData} = useQuery({
        queryKey: ['user-profile-coach', selectedUserAuth0Id],
        queryFn: async () => {
            const result = await getUserProfile(user, getAccessTokenSilently, isAuthenticated, selectedUserAuth0Id);
            return result?.data;
        },
        enabled: !!isAuthenticated && !!user && !!selectedUserAuth0Id,
    });

    // Check-in dataset query
    const {
        isPending: isDatasetPending,
        error: datasetError,
        data: checkInDataset,
        isFetching: isDatasetFetching,
    } = useQuery({
        queryKey: ['dataset-coach', selectedUserAuth0Id],
        queryFn: async () => {
            return await getCheckInDataSet(user, getAccessTokenSilently, isAuthenticated, selectedUserAuth0Id);
        },
        enabled: isAuthenticated && !!user && !!userInfo?.auth0_id && !!selectedUserAuth0Id,
        retry: 1,
    })

    // Memoized computed values
    const planLogCloneDDMMYY = useMemo(() => {
        if (!profileData?.userProfile?.planLog) return [];
        return profileData.userProfile.planLog.map(entry => ({
            ...entry,
            date: convertYYYYMMDDStrToDDMMYYYYStr(entry.date.split('T')[0]),
        }));
    }, [profileData?.userProfile?.planLog]);

    const localCheckinDataset = useMemo(() => {
        return checkInDataset?.data || [];
    }, [checkInDataset?.data]);

    // Loading state - be more specific about when data is actually ready
    const isLoading = isProfilePending || isDatasetPending;
    const hasProfileData = profileData?.userProfile;

    const userInfoTabs = [
        {
            key: '1',
            label: 'Tổng quan',
            children: (
                <div className="flex-1 h-full w-full max-w-[600px] flex justify-center overflow-y-auto">
                    {isLoading ? (
                        <ProgressBoard isPending={true}/>
                    ) : hasProfileData ? (
                        <ProgressBoard
                            startDate={profileData.userProfile.start_date ?? ''}
                            pricePerPack={profileData.userProfile.price_per_pack ?? 0}
                            cigsPerPack={profileData.userProfile.cigs_per_pack ?? 0}
                            cigsReduced={profileData.userProfile.cigs_reduced ?? 0}
                            quittingMethod={profileData.userProfile.quitting_method ?? ''}
                            planLog={profileData.userProfile.planLog ?? []}
                            cigsPerDay={profileData.userProfile.cigs_per_day ?? 0}
                            expectedQuitDate={profileData.userProfile.expected_quit_date ?? ''}
                            stoppedDate={profileData.userProfile.quit_date ?? ''}
                            isPending={false}
                            readinessValue={profileData.userProfile.readiness_value ?? ''}
                            planLogCloneDDMMYY={planLogCloneDDMMYY}
                            userInfo={profileData.userInfo}
                            from="coach-user"
                        />
                    ) : (
                        !coach && <NotFoundBanner title="Người dùng chưa nhập thông tin"/>
                    )}
                </div>
            )
        },
        {
            key: '2',
            label: 'Thông tin chi tiết',
            children: (
                <div className="flex-1 h-full w-full max-w-[600px] flex overflow-y-auto">
                    {isLoading ? (
                        <UserProfileInMessage isPending={true}/>
                    ) : hasProfileData ? (
                        <UserProfileInMessage
                            startDate={profileData.userProfile.start_date ?? ''}
                            pricePerPack={profileData.userProfile.price_per_pack ?? 0}
                            cigsPerPack={profileData.userProfile.cigs_per_pack ?? 0}
                            cigsReduced={profileData.userProfile.cigs_reduced ?? 0}
                            quittingMethod={profileData.userProfile.quitting_method ?? ''}
                            planLog={profileData.userProfile.planLog ?? []}
                            cigsPerDay={profileData.userProfile.cigs_per_day ?? 0}
                            expectedQuitDate={profileData.userProfile.expected_quit_date ?? ''}
                            stoppedDate={profileData.userProfile.quit_date ?? ''}
                            isPending={false}
                            readinessValue={profileData.userProfile.readiness_value ?? ''}
                            planLogCloneDDMMYY={planLogCloneDDMMYY}
                            reasonList={profileData.userProfile.reasonList ?? []}
                            coachInfo={userInfo}
                            userInfo={profileData.userInfo}
                            timeAfterWaking={profileData.userProfile.time_after_waking ?? ''}
                            timeOfDayList={profileData.userProfile.timeOfDayList ?? []}
                            triggers={profileData.userProfile.triggers ?? []}
                            customTimeOfDay={profileData.userProfile.custom_time_of_day ?? ''}
                            customTrigger={profileData.userProfile.custom_trigger ?? ''}
                            checkInDataSet={localCheckinDataset}
                            goalList={profileData.userProfile.goalList ?? []}
                            updatedAt={profileData.userProfile.updated_at ?? ''}
                            createdAt={profileData.userProfile.created_at ?? ''}
                            updatedBy={profileData.userProfile.last_updated_by ?? ''}
                            coach={coach}
                        />
                    ) : (
                        !coach && <NotFoundBanner title="Người dùng chưa nhập thông tin"/>
                    )}
                </div>
            )
        },
        {
            key: '4',
            label: 'Ghi chú',
            children: (
                <div className="flex-1 h-full flex justify-center overflow-y-auto p-5">
                    <NotesManager userAuth0Id={selectedUserAuth0Id}/>
                </div>
            )
        }
    ];

    if (!userAuth0Id) {
        userInfoTabs.splice(2, 0, {
            key: '3',
            label: 'Dữ liệu Checkin',
            children: (
                <div className="flex-1 h-full flex justify-center overflow-y-auto p-5">
                    <Journal userAuth0Id={selectedUserAuth0Id}/>
                </div>
            )
        });
    }
    if (userAuth0Id) {
        userInfoTabs.push(
            {
                key: '5',
                label: 'Đánh giá huấn luyện viên',
                children: (
                    <div className='px-5'><ReviewForm coachAuth0Id={coach?.auth0_id} username={userInfo?.username}/></div>
                )
            }
        )
    }

    // Responsive tabs that include Messages on smaller screens
    const responsiveTabs = [
        {
            key: 'messages',
            label: 'Tin nhắn',
            children: (
                <div className="h-full">
                    <Messager role={userInfo?.role}/>
                </div>
            )
        },
        ...userInfoTabs
    ];

    const renderUserInfoSection = () => {
        if (!profileData?.userProfile?.readiness_value || profileData?.userProfile?.readiness_value.length === 0) {
            return (
                <>
                    {!coach ? <NotFoundBanner title="Không tìm thấy thông tin của người dùng"/> :
                        <NotFoundBanner title="Không tìm thấy thông tin kế hoạch của bạn" type='progressNCoach'/>}
                </>
            );
        }

        return (
            <div className="w-full flex-1 flex justify-center">
                <Tabs
                    centered
                    destroyOnHidden
                    defaultActiveKey="1"
                    items={userInfoTabs}
                    className="w-full"
                    tabBarStyle={{marginBottom: 16}}
                />
            </div>
        );
    };

    return (
        <div className='w-full h-full flex flex-col overflow-hidden'>
            {/* Desktop Layout - Side by side */}
            <div className='hidden xl:flex w-full h-full overflow-y-auto'>
                <div className='w-[650px] h-full'>
                    <Messager role={userInfo?.role}/>
                </div>

                <div className='w-[650px] h-full flex flex-col items-center min-w-0'>
                    <div className='flex gap-4 items-center py-4'>
                        <p className='font-bold text-4xl text-center'>
                            {coach ? 'Thông tin của bạn' : 'Thông tin người dùng'}
                        </p>
                        <div
                            className={`hover:bg-primary-500 rounded-md cursor-pointer ${isCooldown ? 'opacity-50 pointer-events-none' : ''}`}
                            onClick={handleReload}
                            title={isCooldown ? 'Vui lòng chờ 1 phút trước khi làm mới lại' : 'Làm mới dữ liệu'}
                        >
                            <IoReload className='size-7'/>
                        </div>
                    </div>

                    {renderUserInfoSection()}
                </div>
            </div>

            {/* Mobile/Tablet Layout - Tabbed */}
            <div className='xl:hidden w-full h-full flex flex-col'>
                <div className='flex gap-4 items-center justify-center py-4 px-4'>
                    <p className='font-bold text-2xl sm:text-3xl lg:text-4xl text-center'>
                        {coach ? 'Thông tin của bạn' : 'Thông tin người dùng'}
                    </p>
                    <div
                        className={`hover:bg-primary-500 rounded-md cursor-pointer ${isCooldown ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={handleReload}
                        title={isCooldown ? 'Vui lòng chờ 1 phút trước khi làm mới lại' : 'Làm mới dữ liệu'}
                    >
                        <IoReload className='size-6 sm:size-7'/>
                    </div>
                </div>

                <div className="w-full h-full flex-1 flex justify-center px-2 sm:px-4">
                    <Tabs
                        centered
                        destroyOnHidden
                        defaultActiveKey="messages"
                        items={[
                            {
                                key: 'messages',
                                label: 'Tin nhắn',
                                children: <Messager role={userInfo?.role}/>
                            },
                            ...(profileData?.userProfile?.readiness_value?.length > 0 ? userInfoTabs : [
                                {
                                    key: 'notfound',
                                    label: 'Thông tin',
                                    children: (
                                        !coach
                                            ? <NotFoundBanner title="Không tìm thấy thông tin của người dùng"/>
                                            : <NotFoundBanner title="Không tìm thấy thông tin kế hoạch của bạn" type='progressNCoach'/>
                                    )
                                }
                            ])
                        ]}
                        className="w-full"
                        tabBarStyle={{marginBottom: 16}}
                        size="small"
                    />
                </div>
            </div>

        </div>
    );
};

export default CoachUser;