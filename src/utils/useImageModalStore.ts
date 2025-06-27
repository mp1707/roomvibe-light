import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface ImageModalState {
  imageUrl: string | null;
  openModal: (url: string) => void;
  closeModal: () => void;
  reset: () => void;
}

export const useImageModalStore = create<ImageModalState>()(
  subscribeWithSelector((set, get) => ({
    imageUrl: null,

    openModal: (url) => {
      // Only update if URL is different to prevent unnecessary re-renders
      if (get().imageUrl !== url) {
        set({ imageUrl: url });
      }
    },

    closeModal: () => {
      // Only update if there's actually an image to close
      if (get().imageUrl !== null) {
        set({ imageUrl: null });
      }
    },

    reset: () => {
      set({ imageUrl: null });
    },
  }))
);
