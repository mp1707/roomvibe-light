"use client";

import { useAppState } from "@/utils/store";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  useState,
  useCallback,
  useRef,
  type ChangeEvent,
  type DragEvent,
} from "react";
import InspirationGallery from "./InspirationGallery";
import {
  staggerContainer,
  staggerItem,
  dragVariants,
  buttonVariants,
  useMotionPreference,
} from "@/utils/animations";

const UploadIcon = ({ isDragging }: { isDragging: boolean }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-16 md:size-20 text-base-content/40"
    animate={isDragging ? "dragging" : "initial"}
    variants={{
      initial: { scale: 1, y: 0 },
      dragging: {
        scale: 1.1,
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      },
    }}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
    />
  </motion.svg>
);

const ProgressIndicator = ({ progress }: { progress: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="absolute inset-0 flex flex-col items-center justify-center bg-base-100/95 backdrop-blur-sm rounded-2xl"
  >
    <motion.div
      className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-4 text-sm font-medium text-base-content/70"
    >
      {progress < 100
        ? `Wird hochgeladen... ${progress}%`
        : "Upload abgeschlossen!"}
    </motion.p>
  </motion.div>
);

const UploadForm = () => {
  const { setLocalImageUrl } = useAppState();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showInspiration, setShowInspiration] = useState(false);
  const reducedMotion = useMotionPreference();

  const handleFileSelect = useCallback(
    async (file: File | null) => {
      if (!file) return;

      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        alert("Bitte wählen Sie eine Bilddatei aus.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert("Die Datei ist zu groß. Bitte wählen Sie ein Bild unter 10MB.");
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 100);

      try {
        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 800));

        setUploadProgress(100);
        setLocalImageUrl(file);

        // Small delay to show completion
        setTimeout(() => {
          router.push("/suggestions");
        }, 500);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload fehlgeschlagen. Bitte versuchen Sie es erneut.");
        setIsUploading(false);
        setUploadProgress(0);
        clearInterval(progressInterval);
      }
    },
    [setLocalImageUrl, router]
  );

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer?.files || []);
      const imageFile = files.find((file) => file.type.startsWith("image/"));

      if (imageFile) {
        handleFileSelect(imageFile);
      } else if (files.length > 0) {
        alert("Bitte ziehen Sie eine Bilddatei hierher.");
      }
    },
    [handleFileSelect]
  );

  const handleDragEvents = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      // Check if we're actually leaving the drop zone
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;

      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        setIsDragging(false);
      }
    }
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const toggleInspiration = useCallback(() => {
    setShowInspiration((prev) => !prev);
  }, []);

  if (showInspiration) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <InspirationGallery onClose={toggleInspiration} />
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center">
      <motion.div
        variants={reducedMotion ? {} : staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl flex flex-col items-center text-center px-6 py-12 md:py-20"
      >
        {/* Hero Section */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-base-content mb-6 leading-tight">
            Verwandeln Sie Ihren Raum.
          </h1>
          <p className="text-xl md:text-2xl text-base-content/60 max-w-2xl mx-auto leading-relaxed">
            Laden Sie ein Foto hoch und lassen Sie sich von KI-gestützten
            Designvorschlägen inspirieren.
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="w-full max-w-2xl mb-12"
        >
          <motion.div
            variants={dragVariants}
            animate={isDragging ? "dragging" : "idle"}
            onDrop={handleDrop}
            onDragEnter={handleDragEvents}
            onDragOver={handleDragEvents}
            onDragLeave={handleDragEvents}
            className="relative min-h-[380px] md:min-h-[420px] flex flex-col items-center justify-center border-2 border-dashed rounded-3xl cursor-pointer select-none group transition-all duration-300 hover:shadow-lg"
            onClick={handleClick}
            role="button"
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
                <motion.div
                  key="upload-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center space-y-8"
                >
                  <UploadIcon isDragging={isDragging} />

                  <div className="space-y-4">
                    <p className="font-semibold text-2xl text-base-content">
                      <span className="text-primary">Foto auswählen</span> oder
                      hierher ziehen
                    </p>
                    <p
                      id="file-upload-description"
                      className="text-sm text-base-content/40"
                    >
                      PNG, JPG, WEBP bis 10MB
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Inspiration CTA */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="flex flex-col items-center space-y-6"
        >
          <div className="flex items-center space-x-4 text-base-content/40">
            <div className="h-px bg-base-300 w-16"></div>
            <span className="text-sm font-medium">oder</span>
            <div className="h-px bg-base-300 w-16"></div>
          </div>

          <motion.button
            variants={reducedMotion ? {} : buttonVariants}
            whileHover={reducedMotion ? {} : "hover"}
            whileTap={reducedMotion ? {} : "tap"}
            onClick={toggleInspiration}
            className="group flex items-center space-x-3 px-8 py-4 bg-base-100/60 hover:bg-base-100/80 backdrop-blur-sm rounded-2xl border border-base-300/50 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <svg
              className="w-5 h-5 text-base-content/60 group-hover:text-primary transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-semibold text-base-content/70 group-hover:text-primary transition-colors">
              Inspiration-Galerie durchsuchen
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UploadForm;
