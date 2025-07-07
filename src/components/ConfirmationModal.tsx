"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConfirmationModalStore } from "@/utils/useConfirmationModalStore";
import { Button } from "@/components/ui";

const WarningIcon = () => (
  <svg
    className="w-6 h-6 text-warning"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5-.866 3.35 0 4.85C3.8 22.52 5.253 24 7.5 24h9c2.247 0 3.7-1.48 4.803-3.024.866-1.5.866-3.35 0-4.85C20.2 14.48 18.747 13 16.5 13h-9c-2.247 0-3.7 1.48-4.803 3.024zM15 13a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export const ConfirmationModal = () => {
  const {
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    closeModal,
  } = useConfirmationModalStore();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog) {
      if (isOpen) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCancel();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onCancel]);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    closeModal();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    closeModal();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleCancel();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.dialog
          ref={dialogRef}
          className="p-0 m-0 bg-transparent max-w-none w-full h-full backdrop:bg-black/70 backdrop-saturate-150 backdrop-blur-sm flex items-center justify-center"
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div
            className="bg-base-100 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-base-300"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Header with icon */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                <WarningIcon />
              </div>
              <h3 className="text-lg font-semibold text-base-content">
                {title}
              </h3>
            </div>

            {/* Message */}
            <p className="text-base-content/80 mb-6 leading-relaxed">
              {message}
            </p>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                onClick={handleCancel}
                variant="secondary"
                size="sm"
              >
                {cancelText}
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                variant="primary"
                size="sm"
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.dialog>
      )}
    </AnimatePresence>
  );
};
