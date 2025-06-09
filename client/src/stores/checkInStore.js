import { create } from 'zustand';

export const useStepCheckInStore = create((set) => ({
    step: 'StepOne',
    current: 0,
    setStep: (value) => set({ step: value }),
    setCurrent: (value) => set({ currentCheckIn: value }),
    handleStepTwo: () => set({
        step: 'StepThree',
        current: 2
    }),
    handleStepOneYes: () => set({
        step: 'StepTwoOnYes',
        current: 1
    }),
    handleStepOneNo: () => set({
        step: 'StepTwoOnNo',
        current: 1
    }),
    handleBackToStepOne: () => set({
        step: 'StepOne',
        current: 0
    }),
    handleJournal: () => set({
        step: 'StepJournal',
        current: 2
    }),
    handleStepThree: () => set({
        step: 'StepFour',
        current: 3
    })
}));

export const useCheckInDataStore = create((set) => ({
    checkInDate: new Date().toISOString().split('T')[0],
    setCheckInDate: (value) => set({ checkInDate: value }),
    feel: 'okay',
    setFeel: (value) => set({ feel: value }),
    checkedQuitItems: [],
    setCheckedQuitItems: (items) => set({ checkedQuitItems: items}),
    cigsSmoked: 0,
    setCigsSmoked: (value) => set({ cigsSmoked: value }),
    freeText: '',
    setFreeText: (value) => set({ freeText: value }),
    qna: {
        smokeCraving: '',
        healthChanges: '',
        exercise: '',
        cravings: '',
        encourage: '',
    },
    setQna: (newQna) => set((state) => ({ qna: { ...state.qna, ...newQna } })),
    isStepOneOnYes: false,
    setIsStepOneOnYes: (value) => set({ isStepOneOnYes: value }),
    isFreeText: true,
    setIsFreeText: (value) => set({ isFreeText: value }),
    isJournalSelected: false,
    setIsJournalSelected: (value) => set({isJournalSelected : value}),
    checkInDataSet: [],
    setCheckInDataSet: (value) => set({ checkInDataSet: value }),
    alreadyCheckedIn: false,
    setAlreadyCheckedIn: (value) => set({ alreadyCheckedIn: value }),
}));


