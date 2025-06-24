"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMotionPreference } from "@/utils/animations";
import { useAppState } from "@/utils/store";
import { useEffect } from "react";
import Image from "next/image";

interface AIGenerationLoadingScreenProps {
  progress: number;
  steps: string[];
  title: string;
  subtitle: string;
  hint?: string;
  currentGeneratedImage?: string | null;
}

const GenerationEffect = ({ progress }: { progress: number }) => {
  const reducedMotion = useMotionPreference();

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-success/10 to-transparent animate-pulse" />
    );
  }

  return (
    <>
      {/* AI Generation Wave - flowing from bottom to top */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ y: "100%" }}
        animate={{ y: "-100%" }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: [0.22, 1, 0.36, 1], // Apple easing from design system
          repeatType: "loop",
          repeatDelay: 3,
        }}
      >
        <div className="relative w-full h-full">
          {/* Main generation wave */}
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-success shadow-[0_0_15px_theme(colors.success/0.6)] dark:shadow-[0_0_20px_theme(colors.success/0.7)] transform -translate-y-1/2" />

          {/* Wave gradient */}
          <div className="absolute left-0 right-0 top-1/2 h-20 bg-gradient-to-t from-transparent via-success/20 dark:via-success/25 to-transparent transform -translate-y-1/2" />

          {/* Trailing glow */}
          <div className="absolute left-0 right-0 top-1/2 h-2 bg-success/40 dark:bg-success/50 blur-sm transform -translate-y-1/2" />
        </div>
      </motion.div>

      {/* Pixel generation effect - small squares appearing */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(34,197,94,0.1) 2px, transparent 2px),
            radial-gradient(circle at 80% 70%, rgba(34,197,94,0.08) 1px, transparent 1px),
            radial-gradient(circle at 40% 80%, rgba(34,197,94,0.12) 1.5px, transparent 1.5px),
            radial-gradient(circle at 70% 20%, rgba(34,197,94,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px, 40px 40px, 80px 80px, 50px 50px",
        }}
        animate={{
          backgroundPosition: [
            "0% 0%, 0% 0%, 0% 0%, 0% 0%",
            "100% 100%, -100% -100%, 100% -100%, -100% 100%",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Digital mesh overlay */}
      <div
        className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,197,94,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "25px 25px",
        }}
      />

      {/* Flowing data streams - diagonal lines */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-success/6 dark:via-success/8 to-transparent pointer-events-none"
        initial={{ x: "-100%", y: "-100%" }}
        animate={{ x: "100%", y: "100%" }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1], // Apple ease-in-out from design system
          repeatType: "loop",
          repeatDelay: 4,
        }}
        style={{ width: "200%", height: "200%" }}
      />

      {/* Subtle breathing effect */}
      <motion.div
        className="absolute inset-0 bg-success/3 dark:bg-success/4 pointer-events-none"
        animate={{
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse",
        }}
      />
    </>
  );
};

const ImageGenerationDisplay = ({
  progress,
  currentGeneratedImage,
}: {
  progress: number;
  currentGeneratedImage?: string | null;
}) => {
  const { localImageUrl, hostedImageUrl } = useAppState();
  // Use current generated image if available, otherwise fall back to original
  const displayImageUrl =
    currentGeneratedImage || localImageUrl || hostedImageUrl;
  const reducedMotion = useMotionPreference();

  if (!displayImageUrl) {
    return (
      <div className="w-full aspect-[4/3] rounded-3xl bg-base-200 flex items-center justify-center">
        <div className="text-base-content/40">Kein Bild verfügbar</div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
      {/* Base image */}
      <Image
        src={displayImageUrl}
        alt="Bild wird generiert"
        fill
        className="object-cover"
        priority
      />

      {/* Subtle overlay for better contrast */}
      <div className="absolute inset-0 bg-black/15 dark:bg-black/25" />

      {/* AI Generation effects */}
      <GenerationEffect progress={progress} />

      {/* Generation status indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-4 right-4"
      >
        <div className="bg-base-100/90 dark:bg-base-100/95 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-2 h-2 bg-success rounded-full"
                animate={reducedMotion ? {} : { scale: [1, 1.5, 1] }}
                transition={
                  reducedMotion
                    ? {}
                    : {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
              />
              <span className="text-sm font-medium text-base-content">
                KI-Generierung läuft
              </span>
            </div>
            <div className="text-xs text-base-content/60 tabular-nums">
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      </motion.div>

      {/* Corner indicators with success color theme */}
      <div className="absolute top-4 left-4">
        <div className="w-6 h-6 border-l-2 border-t-2 border-success/60 dark:border-success/70 rounded-tl-lg" />
      </div>
      <div className="absolute top-4 right-4">
        <div className="w-6 h-6 border-r-2 border-t-2 border-success/60 dark:border-success/70 rounded-tr-lg" />
      </div>
      <div className="absolute bottom-16 left-4">
        <div className="w-6 h-6 border-l-2 border-b-2 border-success/60 dark:border-success/70 rounded-bl-lg" />
      </div>
      <div className="absolute bottom-16 right-4">
        <div className="w-6 h-6 border-r-2 border-b-2 border-success/60 dark:border-success/70 rounded-br-lg" />
      </div>

      {/* Generation particles floating upward */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-success/40 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              bottom: "10%",
            }}
            animate={{
              y: [0, -300],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default function AIGenerationLoadingScreen({
  progress,
  steps,
  title,
  subtitle,
  hint,
  currentGeneratedImage,
}: AIGenerationLoadingScreenProps) {
  const currentStep = Math.min(
    Math.floor((progress / 100) * steps.length),
    steps.length - 1
  );
  const reducedMotion = useMotionPreference();

  // Scroll to top when component mounts (animation starts)
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    };

    // Small delay to ensure the component is rendered
    const timeoutId = setTimeout(scrollToTop, 100);

    return () => clearTimeout(timeoutId);
  }, [reducedMotion]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto text-center"
    >
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-base-content mb-3 md:mb-4">
          {title}
        </h1>
        <p className="text-base sm:text-lg text-base-content/60 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Image with generation effects */}
      <div className="mb-8">
        <ImageGenerationDisplay
          progress={progress}
          currentGeneratedImage={currentGeneratedImage}
        />
      </div>

      {/* Current step text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-base-content px-4">
            {steps[currentStep]}
          </h3>
        </motion.div>
      </AnimatePresence>

      {/* Processing hint */}
      {hint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-xs sm:text-sm text-base-content/40">{hint}</p>
        </motion.div>
      )}

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Generierung: {Math.round(progress)}%. {steps[currentStep]}
      </div>
    </motion.div>
  );
}
