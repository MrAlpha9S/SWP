import { create } from 'zustand';

export const useQuitReadinessStore = create((set) => ({
    readinessValue: '',
    setReadinessValue: (value) => set({ readinessValue: value }),
}));

export const useReasonStore = create((set) => ({
    reasonList: [],
    addReason: (reason) =>
        set((state) =>
            state.reasonList.includes(reason)
                ? state
                : { reasonList: [...state.reasonList, reason] }
        ),
    removeReason: (reason) =>
        set((state) => ({
            reasonList: state.reasonList.filter((r) => r !== reason),
        })),
    toggleReason: (reason) =>
        set((state) =>
            state.reasonList.includes(reason)
                ? { reasonList: state.reasonList.filter((r) => r !== reason) }
                : { reasonList: [...state.reasonList, reason] }
        ),
    resetReasons: () => set({ reasonList: [] }),
}));

export const usePricePerPackStore = create((set) => ({
    pricePerPack: 0,
    setPricePerPack: (value) => set({ pricePerPack: value }),
}))

export const useCigsPerPackStore  = create((set) => ({
    cigsPerPack: 0,
    setCigsPerPack: (value) => set({ cigsPerPack: value})
}))

export const useCigsPerDayStore  = create((set) => ({
    cigsPerDay: 0,
    setCigsPerDay: (value) => set({ cigsPerDay: value }),
}))

export const useTimeAfterWakingStore  = create((set) => ({
    timeAfterWaking: '',
    setTimeAfterWaking: (value) => set({ timeAfterWaking: value }),
}))

export const useTimeOfDayStore  = create((set) => ({
    timeOfDayList: [],
    customTimeOfDay: '',
    setCustomTimeOfDay: (value) => set({ customTimeOfDay: value }),
    addTimeOfDay: (timeOfDay) =>
        set((state) =>
            state.timeOfDayList.includes(timeOfDay)
                ? state
                : { timeOfDayList: [...state.timeOfDayList, timeOfDay] }
        ),
    removeTimeOfDay: (timeOfDay) =>
        set((state) => ({
            timeOfDayList: state.timeOfDayList.filter((r) => r !== timeOfDay),
        })),
    toggleTimeOfDay: (timeOfDay) =>
        set((state) =>
            state.timeOfDayList.includes(timeOfDay)
                ? { timeOfDayList: state.timeOfDayList.filter((r) => r !== timeOfDay) }
                : { timeOfDayList: [...state.timeOfDayList, timeOfDay] }
        ),
    resetTimeOfDay: () => set({ timeOfDayList: [] }),
}))

export const useTriggersStore = create((set) => ({
    triggers: [],
    customTrigger: '',
    setCustomTrigger: (trigger) => set({ customTrigger: trigger }),
    addTrigger: (trigger) =>
        set((state) =>
            state.triggers.includes(trigger)
                ? state
                : { triggers: [...state.triggers, trigger] }
        ),
    removeTrigger: (trigger) =>
        set((state) => ({
            triggers: state.triggers.filter((t) => t !== trigger),
        })),
    toggleTrigger: (trigger) =>
        set((state) =>
            state.triggers.includes(trigger)
                ? { triggers: state.triggers.filter((t) => t !== trigger) }
                : { triggers: [...state.triggers, trigger] }
        ),
    resetTriggers: () => set({ triggers: [] }),
}));

export const useCustomTimeOfDayCheckedStore = create((set) => ({
    customTimeOfDayChecked: false,
    setCustomTimeOfDayChecked: (value) => set({ customTimeOfDayChecked: value }),
}))

export const useCustomTriggerCheckedStore = create((set) => ({
    customTriggerChecked: false,
    setCustomTriggerChecked: (value) => set({ customTriggerChecked: value }),
}))

export const useStartDateStore = create((set) => ({
    startDate: '',
    setStartDate: (value) => set({ startDate: value }),
}))

export const useErrorStore = create((set) => ({
    errors: [],
    addError: (error) =>
        set((state) => {
            const exists = state.errors.some(
                (err) => err.location === error.location && err.atPage === error.atPage
            );
            return exists ? state : { errors: [...state.errors, error] };
        }),

    removeError: (error) =>
        set((state) => ({
            errors: state.errors.filter(
                (err) => !(err.location === error.location && err.atPage === error.atPage)
            ),
        })),
}));




