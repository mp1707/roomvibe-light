"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import {
  staggerContainer,
  staggerItem,
  useMotionPreference,
} from "@/utils/animations";
import { useFileUpload } from "./hooks/useFileUpload";
import { HeroSection } from "./components/HeroSection";
import { UploadZone } from "./components/UploadZone";
import { InspirationCTA } from "./components/InspirationCTA";

const UploadForm = () => {
  const reducedMotion = useMotionPreference();
  const [isDragging, setIsDragging] = useState(false);
  const { isUploading, uploadProgress, handleFileUpload } = useFileUpload();
  const router = useRouter();

  const handleExploreInspiration = () => {
    router.push("/inspiration");
  };

  return (
    <div className="w-full flex items-center justify-center">
      <motion.div
        variants={reducedMotion ? {} : staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl flex flex-col items-center text-center px-4 sm:px-6 py-8 sm:py-12 md:py-20"
      >
        {/* Hero Section */}
        <motion.div variants={reducedMotion ? {} : staggerItem}>
          <HeroSection />
        </motion.div>

        {/* Upload Section */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="w-full max-w-2xl mb-8 md:mb-12"
        >
          <UploadZone
            onFileSelect={handleFileUpload}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            isDragging={isDragging}
            onDragStateChange={setIsDragging}
          />
        </motion.div>

        {/* Inspiration CTA */}
        <motion.div variants={reducedMotion ? {} : staggerItem}>
          <InspirationCTA onExploreInspiration={handleExploreInspiration} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UploadForm;
