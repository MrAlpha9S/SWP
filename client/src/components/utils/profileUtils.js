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
    useGoalsStore,
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

    useProfileExists.getState().setIsProfileExist(true);
    useQuitReadinessStore.getState().setReadinessValue(profile.readiness_value);

    usePlanStore.getState().setStartDate(profile.start_date?.split('T')[0] ?? '');
    usePlanStore.getState().setStoppedDate(profile.quit_date?.split('T')[0] ?? '');
    usePlanStore.getState().setExpectedQuitDate(profile.expected_quit_date?.split('T')[0] ?? '');
    usePlanStore.getState().setCigsPerDay(profile.cigs_per_day);
    useCigsPerPackStore.getState().setCigsPerPack(profile.cigs_per_pack);
    usePricePerPackStore.getState().setPricePerPack(profile.price_per_pack);
    useTimeAfterWakingStore.getState().setTimeAfterWaking(profile.time_after_waking);
    usePlanStore.getState().setQuittingMethod(profile.quitting_method ?? '');
    usePlanStore.getState().setCigsReduced(profile.cigs_reduced ?? 0);

    usePlanStore.getState().setPlanLog(
        (profile.planLog ?? []).map(entry => ({
            date: entry.date.split('T')[0],
            cigs: entry.cigs,
        }))
    );

    usePlanStore.getState().setPlanLogCloneDDMMYY(
        (profile.planLog ?? [])
    );

    if (profile.goalList) {
        useGoalsStore.getState().setCreateGoalChecked(true);
        useGoalsStore.getState().setGoalList(profile.goalList);
    }

    const reasonStore = useReasonStore.getState();
    reasonStore.resetReasons();
    profile.reasonList?.forEach(reason => reasonStore.addReason(reason));

    const triggerStore = useTriggersStore.getState();
    triggerStore.resetTriggers();
    profile.triggers?.forEach(trigger => triggerStore.addTrigger(trigger));
    if (profile.custom_trigger) {
        triggerStore.setCustomTriggerChecked(true);
        triggerStore.setCustomTrigger(profile.custom_trigger);
    }

    const timeOfDayStore = useTimeOfDayStore.getState();
    timeOfDayStore.resetTimeOfDay();
    profile.timeOfDayList?.forEach(time => timeOfDayStore.addTimeOfDay(time));
    if (profile.custom_time_of_day) {
        timeOfDayStore.setCustomTimeOfDayChecked(true);
        timeOfDayStore.setCustomTimeOfDay(profile.custom_time_of_day);
    }
}