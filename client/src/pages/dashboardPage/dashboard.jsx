import React, {useEffect} from "react";
import {useAuth0, withAuthenticationRequired} from "@auth0/auth0-react";
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
import ProgressBoard from "../../components/layout/dashboard/progressBoard.jsx";
import {useQuery} from '@tanstack/react-query'
import {useCheckInDataStore} from "../../stores/checkInStore.js";
import {getCheckInDataSet} from "../../components/utils/checkInUtils.js";

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
    const {setCheckInDataSet} = useCheckInDataStore()

    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();

    const {
        isPending: isUserProfilePending,
        error: userProfileError,
        data: userProfile,
        isFetching: isUserProfileFetching,
    } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            if (!isAuthenticated || !user) return;
            return await getUserProfile(user, getAccessTokenSilently, isAuthenticated);
        },
        enabled: isAuthenticated && !!user,
    })

    const {
        isPending: isDatasetPending,
        error: datasetError,
        data: checkInDataset,
        isFetching: isDatasetFetching,
    } = useQuery({
        queryKey: ['dataset'],
        queryFn: async () => {
            if (!isAuthenticated || !user) return;
            return await getCheckInDataSet(user, getAccessTokenSilently, isAuthenticated);
        },
        enabled: isAuthenticated && !!user,
    })

    useEffect(() => {
        if (isUserProfilePending || !userProfile) return;
        const syncStores = async () => {
            await syncProfileToStores();
        }
        syncStores();
    }, [userProfile, isUserProfilePending])

    useEffect(() => {
        if (!isDatasetPending) {
            setCheckInDataSet(checkInDataset.data)
        }
    }, [checkInDataset, isDatasetPending])

    useEffect(() => {
        if (isUserProfilePending && isDatasetPending) return
    })

    return (
        <div className="bg-primary-50 min-h-screen flex flex-col p-4">
            <Hero/>
            {isAuthenticated ? (
                isUserProfilePending ? (
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
                        checkInDataSet={checkInDataset.data}
                    />
            ) : isUserProfilePending && <ProgressBoard isPending={true}/>}
        </div>
    );


}


export default withAuthenticationRequired(Dashboard);