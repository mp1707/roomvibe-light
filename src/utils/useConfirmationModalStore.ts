import { create } from "zustand";

interface ConfirmationModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: (() => void) | null;
  onCancel?: (() => void) | null;
  openModal: (config: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }) => void;
  closeModal: () => void;
  reset: () => void;
}

export const useConfirmationModalStore = create<ConfirmationModalState>(
  (set) => ({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Bestätigen",
    cancelText: "Abbrechen",
    onConfirm: null,
    onCancel: null,
    openModal: (config) => {
      set({
        isOpen: true,
        title: config.title,
        message: config.message,
        confirmText: config.confirmText || "Bestätigen",
        cancelText: config.cancelText || "Abbrechen",
        onConfirm: config.onConfirm,
        onCancel: config.onCancel || null,
      });
    },
    closeModal: () => {
      set({
        isOpen: false,
        title: "",
        message: "",
        confirmText: "Bestätigen",
        cancelText: "Abbrechen",
        onConfirm: null,
        onCancel: null,
      });
    },
    reset: () => {
      set({
        isOpen: false,
        title: "",
        message: "",
        confirmText: "Bestätigen",
        cancelText: "Abbrechen",
        onConfirm: null,
        onCancel: null,
      });
    },
  })
);
