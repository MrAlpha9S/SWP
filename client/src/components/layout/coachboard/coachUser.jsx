import React, {useMemo} from 'react';
import Messager from "./messager/messager.jsx";
import {useSelectedUserAuth0IdStore, useUserInfoStore} from "../../../stores/store.js";
import {useQuery} from "@tanstack/react-query";
import {getUserProfile} from "../../utils/profileUtils.js";
import {useAuth0} from "@auth0/auth0-react";
import ProgressBoard from "../dashboard/progressBoard.jsx";
import {convertYYYYMMDDStrToDDMMYYYYStr} from "../../utils/dateUtils.js";
import NotFoundBanner from "../notFoundBanner.jsx";
import PostBlog from "./postblog.jsx";
import {Tabs} from "antd";
import UserProfileInMessage from "./userProfileInMessage.jsx";
import {getCheckInDataSet} from "../../utils/checkInUtils.js";

const CoachUser = () => {
    const {userInfo} = useUserInfoStore()
    const {user, isAuthenticated, getAccessTokenSilently} = useAuth0();
    const {selectedUserAuth0Id} = useSelectedUserAuth0IdStore()

    // User profile query
    const { isPending: isProfilePending, data: profileData } = useQuery({
        queryKey: ['user-profile-coach', selectedUserAuth0Id],
        queryFn: async () => {
            if (!isAuthenticated || !user || !selectedUserAuth0Id) return null;
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
            if (!selectedUserAuth0Id) return null;
            console.log('Fetching dataset for user:', selectedUserAuth0Id);
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
    const hasCompleteData = hasProfileData && !isDatasetPending;
    console.log('isloading', isLoading)
    console.log('hasProfileData', hasProfileData);

    const items = [
        {
            key: '1',
            label: 'Tổng quan',
            children: (
                <div className="w-full flex justify-center">
                    {isLoading ? (
                        <ProgressBoard isPending={true} />
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
                        <NotFoundBanner title="Người dùng chưa nhập thông tin" />
                    )}
                </div>
            )
        },
        {
            key: '2',
            label: 'Thông tin chi tiết',
            children: (
                <div className="w-full flex ">
                    {isLoading ? (
                        <UserProfileInMessage isPending={true} />
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
                            userInfo={profileData.userInfo}
                            timeAfterWaking={profileData.userProfile.time_after_waking ?? ''}
                            timeOfDayList={profileData.userProfile.timeOfDayList ?? []}
                            triggers={profileData.userProfile.triggers ?? []}
                            customTimeOfDay={profileData.userProfile.custom_time_of_day ?? ''}
                            customTrigger={profileData.userProfile.custom_trigger ?? ''}
                            checkInDataSet={localCheckinDataset}
                        />
                    ) : (
                        <NotFoundBanner title="Người dùng chưa nhập thông tin" />
                    )}
                </div>
            )
        },
        {
            key: '3',
            label: 'Bài viết chờ duyệt',
            children: (
                <div className="w-full flex justify-center">
                    <p>Bài viết chờ duyệt</p>
                </div>
            )
        }
    ];

    return (
        <div className='w-full h-screen flex'>
            <div className='w-[50%] h-screen'>
                <Messager role={userInfo?.role} />
            </div>

            <div className='w-[50%] flex flex-col items-center'>
                <p className='font-bold text-4xl text-center'>Thông tin người dùng</p>
                <div className="w-full flex justify-center">
                    <Tabs centered defaultActiveKey="1" items={items} />
                </div>
            </div>
        </div>
    );
};

export default CoachUser;