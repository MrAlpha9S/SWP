import React, {useEffect, useState} from 'react';
import Messager from "./messager/messager.jsx";
import {useSelectedUserAuth0IdStore, useUserInfoStore} from "../../../stores/store.js";
import {useQuery} from "@tanstack/react-query";
import {getUserProfile} from "../../utils/profileUtils.js";
import {useAuth0} from "@auth0/auth0-react";
import {queryClient} from "../../../main.jsx";
import ProgressBoard from "../dashboard/progressBoard.jsx";
import {convertYYYYMMDDStrToDDMMYYYYStr} from "../../utils/dateUtils.js";
import NotFoundBanner from "../notFoundBanner.jsx";

const CoachUser = () => {
    const {userInfo} = useUserInfoStore()
    const {user, isAuthenticated, getAccessTokenSilently} = useAuth0();
    const {selectedUserAuth0Id} = useSelectedUserAuth0IdStore()
    const { isPending, data } = useQuery({
        queryKey: ['user-profile-coach'],
        queryFn: async () => {
            if (!isAuthenticated || !user) return null;
            const result = await getUserProfile(user, getAccessTokenSilently, isAuthenticated, selectedUserAuth0Id);
            return result?.data;
        },
        enabled: !!isAuthenticated && !!user,
    });
    const [planLogCloneDDMMYY, setplanLogCloneDDMMYY] = useState([]);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        queryClient.invalidateQueries({queryKey: ['user-profile-coach']});
    }, [selectedUserAuth0Id]);

    useEffect(() => {
        if (!isPending) {
            setUserData(data)
            console.log(data)
            if (data?.userProfile?.planLog) {
                const planLogClone = data.userProfile.planLog.map(entry => ({
                    ...entry,
                    date: convertYYYYMMDDStrToDDMMYYYYStr(entry.date.split('T')[0]),
                }))
                setplanLogCloneDDMMYY(planLogClone)
            }
        }
    }, [data, isPending]);

    return (
        <div className='w-full h-screen flex'>
            <div className='w-[50%] h-screen'>
                <Messager role={userInfo?.role} />
            </div>

            <div className='w-[50%]'>
                <p className='font-bold text-4xl text-center'>Thông tin người dùng</p>
                {isPending && !data ? (
                    <ProgressBoard isPending={true} />
                ) : data?.userProfile ? (
                    <div>

                        <ProgressBoard
                            startDate={data.userProfile.start_date ?? ''}
                            pricePerPack={data.userProfile.price_per_pack ?? 0}
                            cigsPerPack={data.userProfile.cigs_per_pack ?? 0}
                            cigsReduced={data.userProfile.cigs_reduced ?? 0}
                            quittingMethod={data.userProfile.quitting_method ?? ''}
                            planLog={data.userProfile.planLog ?? []}
                            cigsPerDay={data.userProfile.cigs_per_day ?? 0}
                            expectedQuitDate={data.userProfile.expected_quit_date ?? ''}
                            stoppedDate={data.userProfile.stopped_date ?? ''}
                            isPending={false}
                            readinessValue={data.userProfile.readiness_value ?? ''}
                            planLogCloneDDMMYY={planLogCloneDDMMYY ?? []}
                            userInfo={data.userInfo}
                            from='coach-user'
                        />
                    </div>
                ) : (
                    <NotFoundBanner title='Người dùng chưa nhập thông tin' />
                )}
            </div>
        </div>

    );
};

export default CoachUser;