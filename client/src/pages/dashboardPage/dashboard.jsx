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

function Dashboard() {

    const {readinessValue} = useQuitReadinessStore();
    const {addError, removeError} = useErrorStore();
    const {reasonList} = useReasonStore();
    const {pricePerPack} = usePricePerPackStore();
    const {cigsPerPack} = useCigsPerPackStore();
    const {timeAfterWaking} = useTimeAfterWakingStore();
    const {timeOfDayList, customTimeOfDay, customTimeOfDayChecked} = useTimeOfDayStore();
    const {triggers, customTrigger, customTriggerChecked} = useTriggersStore();
    const {startDate, cigsPerDay, quittingMethod, cigsReduced, expectedQuitDate, stoppedDate} = usePlanStore();
    const {createGoalChecked, goalAmount, goalList} = useGoalsStore()
    const navigate = useNavigate();
    const {isProfileExist} = useProfileExists();

    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();

    useEffect(() => {
        const syncOnLoad = async () => {
            if (!isAuthenticated || !user) return;
            const result = await getUserProfile(user, getAccessTokenSilently, isAuthenticated);
            if (result?.data) {
                await syncProfileToStores(result.data);
            }
        };
        syncOnLoad();
    }, [isAuthenticated, user, getAccessTokenSilently]);


    return (
        <div className="bg-primary-50 min-h-screen flex flex-col p-4">
            <Hero/>
            {readinessValue === 'ready' ?
                <ProgressBoard startDate={startDate} pricePerPack={pricePerPack} cigsPerPack={cigsPerPack}
                               cigsReduced={cigsReduced} quittingMethod={quittingMethod}/>
                : <div className="flex items-center justify-between">Relapse support</div>}
        </div>
    )
        ;
}

export default withAuthenticationRequired(Dashboard)