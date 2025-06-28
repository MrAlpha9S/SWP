import {create} from 'zustand';
import {convertYYYYMMDDStrToDDMMYYYYStr} from "../components/utils/dateUtils.js";

export const useUserCreationDate = create((set) => ({
    userCreationDate: '',
    setUserCreationDate: (value) => set({userCreationDate: value}),
}));

export const useQuitReadinessStore = create((set) => ({
    readinessValue: '',
    setReadinessValue: (value) => set({readinessValue: value}),
}));

export const useReasonStore = create((set) => ({
    reasonList: [],
    addReason: (reason) =>
        set((state) =>
            state.reasonList.includes(reason)
                ? state
                : {reasonList: [...state.reasonList, reason]}
        ),
    removeReason: (reason) =>
        set((state) => ({
            reasonList: state.reasonList.filter((r) => r !== reason),
        })),
    toggleReason: (reason) =>
        set((state) =>
            state.reasonList.includes(reason)
                ? {reasonList: state.reasonList.filter((r) => r !== reason)}
                : {reasonList: [...state.reasonList, reason]}
        ),
    resetReasons: () => set({reasonList: []}),
}));

export const usePricePerPackStore = create((set) => ({
    pricePerPack: 0,
    setPricePerPack: (value) => set({pricePerPack: value}),
}))

export const useCigsPerPackStore = create((set) => ({
    cigsPerPack: 0,
    setCigsPerPack: (value) => set({cigsPerPack: value})
}))

export const useTimeAfterWakingStore = create((set) => ({
    timeAfterWaking: '',
    setTimeAfterWaking: (value) => set({timeAfterWaking: value}),
}))

export const useTimeOfDayStore = create((set) => ({
    timeOfDayList: [],
    customTimeOfDay: '',
    customTimeOfDayChecked: false,
    setCustomTimeOfDayChecked: (value) => set({customTimeOfDayChecked: value}),
    setCustomTimeOfDay: (value) => set({customTimeOfDay: value}),
    addTimeOfDay: (timeOfDay) =>
        set((state) =>
            state.timeOfDayList.includes(timeOfDay)
                ? state
                : {timeOfDayList: [...state.timeOfDayList, timeOfDay]}
        ),
    removeTimeOfDay: (timeOfDay) =>
        set((state) => ({
            timeOfDayList: state.timeOfDayList.filter((r) => r !== timeOfDay),
        })),
    toggleTimeOfDay: (timeOfDay) =>
        set((state) =>
            state.timeOfDayList.includes(timeOfDay)
                ? {timeOfDayList: state.timeOfDayList.filter((r) => r !== timeOfDay)}
                : {timeOfDayList: [...state.timeOfDayList, timeOfDay]}
        ),
    resetTimeOfDay: () => set({timeOfDayList: []}),
}))

export const useTriggersStore = create((set) => ({
    triggers: [],
    customTrigger: '',
    customTriggerChecked: false,
    setCustomTriggerChecked: (value) => set({customTriggerChecked: value}),
    setCustomTrigger: (trigger) => set({customTrigger: trigger}),
    addTrigger: (trigger) =>
        set((state) =>
            state.triggers.includes(trigger)
                ? state
                : {triggers: [...state.triggers, trigger]}
        ),
    removeTrigger: (trigger) =>
        set((state) => ({
            triggers: state.triggers.filter((t) => t !== trigger),
        })),
    toggleTrigger: (trigger) =>
        set((state) =>
            state.triggers.includes(trigger)
                ? {triggers: state.triggers.filter((t) => t !== trigger)}
                : {triggers: [...state.triggers, trigger]}
        ),
    resetTriggers: () => set({triggers: []}),
}));

export const usePlanStore = create((set) => ({
    startDate: '',
    setStartDate: (value) => set({startDate: value}),
    cigsPerDay: 0,
    setCigsPerDay: (value) => set({cigsPerDay: value}),
    quittingMethod: '',
    setQuittingMethod: (value) => set({quittingMethod: value}),
    cigsReduced: 0,
    setCigsReduced: (value) => set({cigsReduced: value}),
    expectedQuitDate: '',
    setExpectedQuitDate: (value) => set({expectedQuitDate: value}),
    stoppedDate: '',
    setStoppedDate: (value) => set({stoppedDate: value}),
    planLog: [],
    setPlanLog: (value) => set({planLog: value}),
    planLogCloneDDMMYY: [],
    setPlanLogCloneDDMMYY: (planLog) => set({
        planLogCloneDDMMYY: planLog.map(entry => ({
            ...entry,
            date: convertYYYYMMDDStrToDDMMYYYYStr(entry.date.split('T')[0]),
        }))
    }),
}))

export const useQuittingMethodStore = create((set) => ({
    quittingMethod: '',
    setQuittingMethod: (value) => set({quittingMethod: value}),
}))

export const useErrorStore = create((set) => ({
    errors: [],
    addError: (error) =>
        set((state) => {
            const exists = state.errors.some(
                (err) => err.location === error.location && err.atPage === error.atPage
            );
            return exists ? state : {errors: [...state.errors, error]};
        }),

    removeError: (error) =>
        set((state) => ({
            errors: state.errors.filter(
                (err) => !(err.location === error.location && err.atPage === error.atPage)
            ),
        })),
}));

export const useGoalsStore = create((set) => ({
    createGoalChecked: false,
    setCreateGoalChecked: (value) => set({createGoalChecked: value}),
    goalList: [],
    setGoalList: (value) => set({goalList: value}),
    removeGoal: (goalId) =>
        set((state) => ({
            goalList: state.goalList.filter((g) => g.goalId !== goalId)
        })),
    addGoal: (goal) =>
        set((state) =>
            state.goalList.includes(goal)
                ? state
                : {goalList: [...state.goalList, goal]}
        ),
    goalName: '',
    setGoalName: (name) => set({goalName: name}),
    goalAmount: 0,
    setGoalAmount: (amount) => set({goalAmount: amount}),
    moneySaved: 0,
    setMoneySaved: (saved) => set({moneySaved: saved}),
    updateGoal: (goalId, newName, newAmount, isCompleted, completedDate) =>
        set((state) => ({
            goalList: state.goalList.map((g) =>
                g.goalId === goalId ? { ...g, goalName: newName, goalAmount: newAmount, isCompleted: isCompleted, completedDate: completedDate } : g
            )
        })),

}))

export const useCurrentStepStore = create((set) => ({
    currentStep: 0,
    setCurrentStep: (value) => set({currentStep: value}),
}))

export const useProfileExists = create((set) => ({
    isProfileExist: false,
    setIsProfileExist: (value) => set({isProfileExist: value}),
}))

export const useCurrentStepDashboard = create((set) => ({
    currentStepDashboard: 'dashboard',
    setCurrentStepDashboard: (value) => set({currentStepDashboard: value}),
}))

export const useUserInfoStore = create((set) => ({
    userInfo: null,
    setUserInfo: (value) => set({userInfo: value}),
}))






