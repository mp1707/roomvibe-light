// app/components/ImageModal.tsx

"use client";

import { useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useImageModalStore } from "@/utils/useImageModalStore";
import { useTranslations } from "next-intl";

const CloseIcon = memo(() => {
  const t = useTranslations("Components.ImageModal");
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className="size-8 text-base-content"
    >
      <title>{t("closeModal")}</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
});

CloseIcon.displayName = "CloseIcon";

export const ImageModal = memo(() => {
  const { imageUrl, closeModal } = useImageModalStore();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const t = useTranslations("Components.ImageModal");

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog) {
      if (imageUrl) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  }, [imageUrl]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    if (imageUrl) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [closeModal, imageUrl]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) closeModal();
  };

  if (!imageUrl) return null;

  return (
    <AnimatePresence>
      <motion.dialog
        ref={dialogRef}
        className="p-0 m-0 bg-transparent max-w-none backdrop:bg-black/70 backdrop-saturate-150 backdrop-blur-sm"
        onClick={handleBackdropClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-base-content/20 hover:bg-base-content/40 transition-colors"
          aria-label={t("closeImageView")}
        >
          <CloseIcon />
        </button>
        <motion.div
          className="relative w-screen h-screen flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        >
          <Image
            src={imageUrl}
            width={3000}
            height={2000}
            className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            alt={t("enlargedImageAlt")}
            priority
          />
        </motion.div>
      </motion.dialog>
    </AnimatePresence>
  );
});

ImageModal.displayName = "ImageModal";
