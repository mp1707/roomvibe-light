import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  mockImageAnalysis: boolean;
  mockImageGeneration: boolean;
  mockFileUpload: boolean;
  setMockImageAnalysis: (enabled: boolean) => void;
  setMockImageGeneration: (enabled: boolean) => void;
  setMockFileUpload: (enabled: boolean) => void;
  resetSettings: () => void;
}

const initialState = {
  mockImageAnalysis: false,
  mockImageGeneration: false,
  mockFileUpload: false,
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

      setMockFileUpload: (enabled) => {
        set({ mockFileUpload: enabled });
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
