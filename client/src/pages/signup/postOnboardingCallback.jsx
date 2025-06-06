import React, {useEffect, useState} from 'react';
import {useAuth0} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";
import {
    useCigsPerPackStore,
    useGoalsStore, usePlanStore,
    usePricePerPackStore,
    useQuitReadinessStore,
    useReasonStore, useTimeAfterWakingStore, useTimeOfDayStore, useTriggersStore, useProfileExists
} from "../../stores/store.js";

const PostOnboardingCallback = () => {

    const {user, getAccessTokenSilently, isAuthenticated} = useAuth0();
    const [onboardingStatus, setOnboardingStatus] = useState(null);
    const navigate = useNavigate();
    const [msg, setMsg] = useState('');
    const {readinessValue} = useQuitReadinessStore();
    const {reasonList} = useReasonStore();
    const {pricePerPack} = usePricePerPackStore();
    const {cigsPerPack} = useCigsPerPackStore();
    const {timeAfterWaking} = useTimeAfterWakingStore();
    const {timeOfDayList, customTimeOfDay, customTimeOfDayChecked} = useTimeOfDayStore();
    const {triggers, customTrigger, customTriggerChecked} = useTriggersStore();
    const {startDate, cigsPerDay, quittingMethod, cigsReduced, expectedQuitDate, stoppedDate, planLog} = usePlanStore();
    const {goalList, createGoalChecked} = useGoalsStore()
    const {setIsProfileExist} = useProfileExists()

    useEffect(() => {
        const postUserProfile = async () => {
            if (!isAuthenticated || !user) return;

            const token = await getAccessTokenSilently();

            const bodyPayLoad = {
                userAuth0Id: user.sub,
                readiness: readinessValue,
                reasonList: reasonList,
                pricePerPack: pricePerPack,
                cigsPerPack: cigsPerPack,
                timeAfterWaking: timeAfterWaking,
                timeOfDayList: timeOfDayList,
                //customTimeOfDay: customTimeOfDay,
                triggers: triggers,
                //customTrigger: customTrigger,
                //startDate: startDate,
                cigsPerDay: cigsPerDay,
                //quittingMethod: quittingMethod,
                //cigsReduced: cigsReduced,
                //expectedQuitDate: expectedQuitDate,
                //stoppedDate: stoppedDate,
            }

            console.log(bodyPayLoad);

            if (customTimeOfDayChecked) {
                bodyPayLoad.customTimeOfDay = customTimeOfDay;
            }
            if (customTriggerChecked) {
                bodyPayLoad.customTrigger = customTrigger;
            }
            if (readinessValue === 'ready') {
                bodyPayLoad.startDate = startDate;
                bodyPayLoad.quittingMethod = quittingMethod;
                if (quittingMethod !== 'target-date') {
                    bodyPayLoad.cigsReduced = cigsReduced
                }
                bodyPayLoad.expectedQuitDate = expectedQuitDate
                bodyPayLoad.planLog = planLog
            } else {
                bodyPayLoad.stoppedDate = stoppedDate;
            }
            if (createGoalChecked && goalList.length > 0) {
                bodyPayLoad.goalList = goalList;
            }


            const res = await fetch('http://localhost:3000/profiles/postOnboarding', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyPayLoad),
            });

            const data = await res.json();
            setOnboardingStatus(data.success);
            setMsg(data.message)
            setIsProfileExist(true)
        };

        postUserProfile();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    useEffect(() => {
        if (onboardingStatus) {
            navigate('/dashboard');
        }
    })

    useEffect(() => {
        console.log(msg)
    }, [msg])

    return <div className='h-screen w-screen'>{onboardingStatus}</div>;
};

export default PostOnboardingCallback;