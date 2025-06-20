"use client";

import { useAppState } from "@/utils/store";
import { motion, type Variants } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, useCallback, type ChangeEvent, type DragEvent } from "react";

const UploadIcon = ({ isDragging }: { isDragging: boolean }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-16 md:size-20 text-gray-400"
    variants={{
      initial: { scale: 1, y: 0 },
      dragging: { scale: 1.1, y: -5 },
    }}
    animate={isDragging ? "dragging" : "initial"}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <title>Upload Icon</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
    />
  </motion.svg>
);

const UploadForm = () => {
  const { setLocalImageUrl } = useAppState();
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback(
    (file: File | null) => {
      if (file) {
        setLocalImageUrl(file);
        router.push("/suggestions");
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
      const file = e.dataTransfer?.files?.[0] || null;
      handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragEvents = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-base-100">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl flex flex-col items-center text-center px-6 py-12 md:py-20 whitespace-section"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800 mb-2"
        >
          Verwandeln Sie Ihren Raum.
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mt-2 text-lg text-gray-500 mb-10"
        >
          Laden Sie ein Foto hoch und lassen Sie sich von KI-gestützten
          Designvorschlägen inspirieren.
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="w-full flex justify-center"
        >
          <motion.div
            onDrop={handleDrop}
            onDragEnter={handleDragEvents}
            onDragOver={handleDragEvents}
            onDragLeave={handleDragEvents}
            animate={{
              scale: isDragging ? 1.04 : 1,
              borderColor: isDragging ? "#007AFF" : "#E5E7EB",
              backgroundColor: isDragging ? "rgba(0,122,255,0.04)" : "#F5F5F7",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className={`relative w-full max-w-lg min-h-[320px] md:min-h-[380px] flex flex-col items-center justify-center border-2 rounded-2xl cursor-pointer select-none ${
              isDragging ? "border-solid" : "border-dashed"
            }`}
            style={{ boxShadow: "none" }}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
            <motion.label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center space-y-6 cursor-pointer"
              whileTap={{ scale: 0.98 }}
            >
              <UploadIcon isDragging={isDragging} />
              <span className="font-semibold text-xl text-gray-800">
                <span className="text-blue-600">Foto auswählen</span> oder
                hierher ziehen
              </span>
              <span className="text-sm text-gray-400">
                PNG, JPG, WEBP bis 10MB
              </span>
            </motion.label>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UploadForm;
