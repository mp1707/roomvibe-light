import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  mockImageAnalysis: boolean;
  mockImageGeneration: boolean;
  setMockImageAnalysis: (enabled: boolean) => void;
  setMockImageGeneration: (enabled: boolean) => void;
  resetSettings: () => void;
}

const initialState = {
  mockImageAnalysis: false,
  mockImageGeneration: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,

      setMockImageAnalysis: (enabled) => {
        set({ mockImageAnalysis: enabled });
      },

      setMockImageGeneration: (enabled) => {
        set({ mockImageGeneration: enabled });
      },

      resetSettings: () => {
        set(initialState);
      },
    }),
    {
      name: "roomvibe-settings",
    }
  )
);
