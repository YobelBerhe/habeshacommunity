import { create } from 'zustand';

interface OnboardingState {
  step: number;
  interests: string[];
  relationshipStatus: string;
  faithBackground: string;
  setStep: (step: number) => void;
  setInterests: (interests: string[]) => void;
  setRelationshipStatus: (status: string) => void;
  setFaithBackground: (faith: string) => void;
  reset: () => void;
}

export const useOnboarding = create<OnboardingState>((set) => ({
  step: 0,
  interests: [],
  relationshipStatus: '',
  faithBackground: '',
  setStep: (step) => set({ step }),
  setInterests: (interests) => set({ interests }),
  setRelationshipStatus: (status) => set({ relationshipStatus: status }),
  setFaithBackground: (faith) => set({ faithBackground: faith }),
  reset: () => set({ 
    step: 0, 
    interests: [], 
    relationshipStatus: '', 
    faithBackground: '' 
  }),
}));
