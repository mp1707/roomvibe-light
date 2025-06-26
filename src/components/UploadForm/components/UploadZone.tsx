import { useRef, useCallback, type ChangeEvent, type DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/utils/settingsStore";
import { dragVariants } from "@/utils/animations";
import toast from "react-hot-toast";
import { ProgressIndicator } from "./ProgressIndicator";
import { UploadContent } from "./UploadContent";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  uploadProgress: number;
  isDragging: boolean;
  onDragStateChange: (isDragging: boolean) => void;
}

export const UploadZone = ({
  onFileSelect,
  isUploading,
  uploadProgress,
  isDragging,
  onDragStateChange,
}: UploadZoneProps) => {
  const { mockFileUpload } = useSettingsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onDragStateChange(false);

      const files = Array.from(e.dataTransfer?.files || []);
      const imageFile = files.find((file) => file.type.startsWith("image/"));

      if (imageFile) {
        onFileSelect(imageFile);
      } else if (files.length > 0) {
        toast.error("Bitte ziehen Sie eine Bilddatei hierher.");
      }
    },
    [onFileSelect, onDragStateChange]
  );

  const handleDragEvents = useCallback(
    (e: DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.type === "dragenter" || e.type === "dragover") {
        onDragStateChange(true);
      } else if (e.type === "dragleave") {
        const rect = e.currentTarget.getBoundingClientRect();
        const { clientX: x, clientY: y } = e;

        if (
          x < rect.left ||
          x > rect.right ||
          y < rect.top ||
          y > rect.bottom
        ) {
          onDragStateChange(false);
        }
      }
    },
    [onDragStateChange]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <motion.button
      variants={dragVariants}
      animate={isDragging ? "dragging" : "idle"}
      onDrop={handleDrop}
      onDragEnter={handleDragEvents}
      onDragOver={handleDragEvents}
      onDragLeave={handleDragEvents}
      className={`relative w-full min-h-[280px] sm:min-h-[320px] md:min-h-[420px] flex flex-col items-center justify-center border-2 border-dashed rounded-3xl cursor-pointer select-none group transition-all duration-300 hover:shadow-lg ${
        isDragging
          ? "border-primary bg-primary/5 shadow-lg"
          : "border-base-content/20 hover:border-base-content/30 hover:bg-base-200/50"
      }`}
      onClick={handleClick}
      tabIndex={0}
      aria-label="Klicken Sie hier oder ziehen Sie ein Bild hierher zum Hochladen"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="sr-only"
        onChange={handleFileChange}
        accept="image/*"
        aria-describedby="file-upload-description"
      />

      <AnimatePresence mode="wait">
        {isUploading ? (
          <ProgressIndicator progress={uploadProgress} />
        ) : (
          <UploadContent
            isDragging={isDragging}
            mockFileUpload={mockFileUpload}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};
