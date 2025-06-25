import { create } from "zustand";

interface ImageModalState {
  imageUrl: string | null;
  openModal: (url: string) => void;
  closeModal: () => void;
  reset: () => void;
}

export const useImageModalStore = create<ImageModalState>((set) => ({
  imageUrl: null,
  openModal: (url) => {
    set({ imageUrl: url });
  },
  closeModal: () => {
    set({ imageUrl: null });
  },
  reset: () => {
    set({ imageUrl: null });
  },
}));
