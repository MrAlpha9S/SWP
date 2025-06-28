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

export async function getUserProfile(user, getAccessTokenSilently, isAuthenticated) {

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch('http://localhost:3000/profiles/getProfile', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userAuth0Id: user.sub})
    });

    return await res.json();
}

export async function postGoal(goalId = null, goalName, goalAmount, user, getAccessTokenSilently, isAuthenticated, completedDate = null, isCompleted = false) {

    if (!isAuthenticated || !user) return;

    try {
        const token = await getAccessTokenSilently();

        const res = await fetch('http://localhost:3000/profiles/postGoal', {
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

        const res = await fetch('http://localhost:3000/profiles/delete-goal', {
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

    useProfileExists.getState().setIsProfileExist(true);
    useQuitReadinessStore.getState().setReadinessValue(userProfile.readiness_value);

    usePlanStore.getState().setStartDate(userProfile.start_date?.split('T')[0] ?? '');
    usePlanStore.getState().setStoppedDate(userProfile.quit_date?.split('T')[0] ?? '');
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

    const userInfoStore = useUserInfoStore.getState();
    userInfoStore.setUserInfo(userInfo);
}
