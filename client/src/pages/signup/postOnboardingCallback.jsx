import React, {useEffect, useState} from 'react';
import {useAuth0} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";
import {
    useCigsPerPackStore,
    useGoalsStore, usePlanStore,
    usePricePerPackStore,
    useQuitReadinessStore,
    useReasonStore, useTimeAfterWakingStore, useTimeOfDayStore, useTriggersStore, useProfileExists, useUserInfoStore
} from "../../stores/store.js";
import {usePostUserProfile} from "../../components/hooks/usePostUSerProfile.js";

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
    const {userInfo} = useUserInfoStore()

    const mutation = usePostUserProfile(getAccessTokenSilently, user);

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const payload = {
            userAuth0Id: user.sub,
            readiness: readinessValue,
            reasonList,
            pricePerPack,
            cigsPerPack,
            timeAfterWaking,
            timeOfDayList,
            triggers,
            cigsPerDay,
            updaterUserAuth0Id: user.sub,
        };

        if (customTimeOfDayChecked) payload.customTimeOfDay = customTimeOfDay;
        if (customTriggerChecked) payload.customTrigger = customTrigger;
        if (readinessValue === 'ready') {
            payload.startDate = startDate;
            payload.quittingMethod = quittingMethod;
            if (quittingMethod !== 'target-date') {
                payload.cigsReduced = cigsReduced;
            }
            payload.expectedQuitDate = expectedQuitDate;
            payload.planLog = planLog;
        } else {
            payload.stoppedDate = stoppedDate;
        }

        if (createGoalChecked && goalList.length > 0) {
            payload.goalList = goalList;
        }

        mutation.mutate(payload, {
            onSuccess: (data) => {
                setOnboardingStatus(data.success);
                setMsg(data.message);
                setIsProfileExist(true);
            },
            onError: (error) => {
                console.error('Submission error:', error);
            }
        });
    }, [isAuthenticated, user, getAccessTokenSilently]);

    useEffect(() => {
        if (onboardingStatus) {
            navigate('/dashboard');
        }
    })

    return <div className='h-screen w-screen'>{onboardingStatus}</div>;
};

export default PostOnboardingCallback;