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
    })

}));

export const useCheckInDateStore = create((set) => ({
    checkInDate: new Date().toISOString().split('T')[0],
    setCheckInDate: (value) => set({ checkInDate: value }),
}));

export const useCheckInFeelStore = create((set) => ({
    feel: 'okay',
    setFeel: (value) => set({ feel: value }),
}));
