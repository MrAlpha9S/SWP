import React, {useEffect, useState} from "react";
import {useAuth0, withAuthenticationRequired} from "@auth0/auth0-react";
import {differenceInMilliseconds} from 'date-fns';
import {getUserProfile, syncProfileToStores} from "../../components/utils/profileUtils.js";
import {
    useCigsPerPackStore,
    useErrorStore, useGoalsStore, usePlanStore,
    usePricePerPackStore, useProfileExists,
    useQuitReadinessStore,
    useReasonStore, useTimeAfterWakingStore, useTimeOfDayStore, useTriggersStore
} from "../../stores/store.js";
import {useNavigate} from "react-router-dom";
import Hero from "../../components/layout/dashboard/hero.jsx"
import CustomButton from "../../components/ui/CustomButton.jsx";
import ProgressBoard from "../../components/layout/dashboard/progressBoard.jsx";
import {useMutation, useQuery} from '@tanstack/react-query'

function Dashboard() {

    const {readinessValue} = useQuitReadinessStore();
    const {addError, removeError} = useErrorStore();
    const {reasonList} = useReasonStore();
    const {pricePerPack} = usePricePerPackStore();
    const {cigsPerPack} = useCigsPerPackStore();
    const {timeAfterWaking} = useTimeAfterWakingStore();
    const {timeOfDayList, customTimeOfDay, customTimeOfDayChecked} = useTimeOfDayStore();
    const {triggers, customTrigger, customTriggerChecked} = useTriggersStore();
    const {startDate, cigsPerDay, quittingMethod, cigsReduced, expectedQuitDate, stoppedDate, planLog} = usePlanStore();
    const {createGoalChecked, goalAmount, goalList} = useGoalsStore()
    const navigate = useNavigate();
    const {isProfileExist} = useProfileExists();

    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();

    const {isPending, error, data, isFetching} = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            if (!isAuthenticated || !user) return;
            return await getUserProfile(user, getAccessTokenSilently, isAuthenticated);
        },
        enabled: isAuthenticated && !!user,
    })

    useEffect(() => {
        if (isPending || !data) return;
        const syncStores = async () => {
            await syncProfileToStores();
        }
        syncStores();
    }, [data, isPending])

    return (
        <div className="bg-primary-50 min-h-screen flex flex-col p-4">
            <Hero/>
            {isAuthenticated ? (
                    isPending ? (
                            <ProgressBoard isPending={true}/>
                        ) :
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
                        />
                ) : isPending && <ProgressBoard isPending={true}/>}
        </div>
    );


}


export default withAuthenticationRequired(Dashboard);