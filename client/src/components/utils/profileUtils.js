import {
    useProfileExists,
    useQuitReadinessStore,
    useReasonStore,
    usePricePerPackStore,
    useCigsPerPackStore,
    useTimeAfterWakingStore,
    useTimeOfDayStore,
    useTriggersStore,
    usePlanStore,
    useGoalsStore, useUserInfoStore,
} from '../../stores/store.js';
import {getBackendUrl} from "./getBackendURL.js";

export async function getUserProfile(user, getAccessTokenSilently, isAuthenticated, selectedUserAuth0Id = null) {

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();
    const bodyPayload = {}
    if (selectedUserAuth0Id) {
        bodyPayload.userAuth0Id = selectedUserAuth0Id;
    } else {
        bodyPayload.userAuth0Id = user.sub;
    }

    const res = await fetch(`${getBackendUrl()}/profiles/getProfile`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayload)
    });

    return await res.json();
}

export async function postGoal(goalId = null, goalName, goalAmount, user, getAccessTokenSilently, isAuthenticated, completedDate = null, isCompleted = false) {

    if (!isAuthenticated || !user) return;
    console.log('in utils')
    console.log(goalId);
    console.log(goalName);
    console.log(goalName);
    console.log(goalAmount);
    console.log(completedDate)
    console.log(isCompleted);

    try {
        const token = await getAccessTokenSilently();

        const res = await fetch(`${getBackendUrl()}/profiles/postGoal`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userAuth0Id: user.sub,
                goalId: goalId,
                goalName: goalName,
                goalAmount: goalAmount,
                completedDate: completedDate,
                isCompleted: isCompleted
            })
        });

        if (!res.ok) {
            const errorMessage = await res.text();
            throw new Error(errorMessage || `Request failed with status ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('post goal error', error);
        throw error;
    }
}

export const deleteGoal = async (goalId, user, getAccessTokenSilently, isAuthenticated) => {
    if (!isAuthenticated || !user) return;

    try {
        const token = await getAccessTokenSilently();

        const res = await fetch(`${getBackendUrl()}/profiles/delete-goal`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({goalId: goalId})
        });

        if (!res.ok) {
            const errorMessage = await res.text();
            throw new Error(errorMessage || `Request failed with status ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('post goal error', error);
        throw error;
    }
}

export async function syncProfileToStores(profile) {
    if (!profile) return;

    const userProfile = profile.userProfile;
    const userInfo = profile.userInfo;

    if (userProfile) {
        useProfileExists.getState().setIsProfileExist(true);
        useQuitReadinessStore.getState().setReadinessValue(userProfile.readiness_value);

        usePlanStore.getState().setStartDate(userProfile.start_date ?? '');
        usePlanStore.getState().setStoppedDate(userProfile.quit_date ?? '');
        usePlanStore.getState().setExpectedQuitDate(userProfile.expected_quit_date?.split('T')[0] ?? '');
        usePlanStore.getState().setCigsPerDay(userProfile.cigs_per_day);
        useCigsPerPackStore.getState().setCigsPerPack(userProfile.cigs_per_pack);
        usePricePerPackStore.getState().setPricePerPack(userProfile.price_per_pack);
        useTimeAfterWakingStore.getState().setTimeAfterWaking(userProfile.time_after_waking);
        usePlanStore.getState().setQuittingMethod(userProfile.quitting_method ?? '');
        usePlanStore.getState().setCigsReduced(userProfile.cigs_reduced ?? 0);

        usePlanStore.getState().setPlanLog(
            (userProfile.planLog ?? []).map(entry => ({
                date: entry.date.split('T')[0],
                cigs: entry.cigs,
            }))
        );

        usePlanStore.getState().setPlanLogCloneDDMMYY(
            (userProfile.planLog ?? [])
        );

        usePlanStore.getState().setCustomPlanWithStages(
            (userProfile.stages)
        )

        usePlanStore.getState().setUseCustomPlan(userProfile.is_using_custom_stages)

        if (userProfile.goalList) {
            useGoalsStore.getState().setCreateGoalChecked(true);
            useGoalsStore.getState().setGoalList(userProfile.goalList);
        }

        const reasonStore = useReasonStore.getState();
        reasonStore.resetReasons();
        userProfile.reasonList?.forEach(reason => reasonStore.addReason(reason));

        const triggerStore = useTriggersStore.getState();
        triggerStore.resetTriggers();
        userProfile.triggers?.forEach(trigger => triggerStore.addTrigger(trigger));
        if (userProfile.custom_trigger) {
            triggerStore.setCustomTriggerChecked(true);
            triggerStore.setCustomTrigger(userProfile.custom_trigger);
        }

        const timeOfDayStore = useTimeOfDayStore.getState();
        timeOfDayStore.resetTimeOfDay();
        userProfile.timeOfDayList?.forEach(time => timeOfDayStore.addTimeOfDay(time));
        if (userProfile.custom_time_of_day) {
            timeOfDayStore.setCustomTimeOfDayChecked(true);
            timeOfDayStore.setCustomTimeOfDay(userProfile.custom_time_of_day);
        }
    }

    if (userInfo) {
        const userInfoStore = useUserInfoStore.getState();
        userInfoStore.setUserInfo(userInfo);
    }
}

export const saveProfileToLocalStorage = ({currentStep, referrer = '', userInfo}) => {
    const useCustomPlan = usePlanStore.getState().useCustomPlan
    const state = {
        userProfile : {
            readiness_value: useQuitReadinessStore.getState().readinessValue,
            reasonList: useReasonStore.getState().reasonList,
            price_per_pack: usePricePerPackStore.getState().pricePerPack,
            cigs_per_pack: useCigsPerPackStore.getState().cigsPerPack,
            time_after_waking: useTimeAfterWakingStore.getState().timeAfterWaking,
            timeOfDayList: useTimeOfDayStore.getState().timeOfDayList,
            custom_time_of_day: useTimeOfDayStore.getState().customTimeOfDay,
            customTimeOfDayChecked: useTimeOfDayStore.getState().customTimeOfDayChecked,
            triggers: useTriggersStore.getState().triggers,
            custom_trigger: useTriggersStore.getState().customTrigger,
            customTriggerChecked: useTriggersStore.getState().customTriggerChecked,
            quit_date: usePlanStore.getState().stoppedDate,
            planLog: useCustomPlan ? [] : usePlanStore.getState().planLog,
            planLogCloneDDMMYY: usePlanStore.getState().planLogCloneDDMMYY,
            createGoalChecked: useGoalsStore.getState().createGoalChecked,
            goalList: useGoalsStore.getState().goalList,
            currentStep: currentStep,
            useCustomPlan: useCustomPlan,
            customPlanWithStages: useCustomPlan ? usePlanStore.getState().customPlanWithStages : [],
        },
        referrer: referrer
    };

    if (userInfo?.sub_id !== 1) {
        state.userProfile.start_date = usePlanStore.getState().startDate,
            state.userProfile.cigs_per_day = usePlanStore.getState().cigsPerDay,
            state.userProfile.quitting_method = usePlanStore.getState().quittingMethod,
            state.userProfile.cigs_reduced = usePlanStore.getState().cigsReduced,
            state.userProfile.expected_quit_date = usePlanStore.getState().expectedQuitDate
    }

    return state
}
