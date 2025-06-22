"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMotionPreference } from "@/utils/animations";

interface LoaderProps {
  progressStep: number;
  progressSteps: string[];
  progress: number;
}

const SkeletonLoader = () => (
  <div className="w-full aspect-[4/3] rounded-2xl bg-gray-200 overflow-hidden relative">
    {/* Skeleton base */}
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />

    {/* Shimmer effect */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12"
      animate={{
        x: [-200, 800],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    {/* Room outline sketch */}
    <div className="absolute inset-4 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-lg animate-pulse" />
        <div className="w-24 h-3 bg-gray-300 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full max-w-md mx-auto mb-6">
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-primary-focus"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
    <div className="flex justify-between text-xs text-gray-500 mt-2">
      <span>0%</span>
      <span className="font-medium">{Math.round(progress)}%</span>
      <span>100%</span>
    </div>
  </div>
);

const GenerativeAnimation = () => {
  const reducedMotion = useMotionPreference();

  if (reducedMotion) {
    return (
      <div className="w-20 h-20 mx-auto mb-6">
        <div className="w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-20 h-20 mx-auto mb-6">
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 border-4 border-primary/30 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner ring */}
      <motion.div
        className="absolute inset-2 border-3 border-primary/60 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {/* Center dot */}
      <motion.div
        className="absolute inset-6 bg-primary rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

const Loader: React.FC<LoaderProps> = ({
  progressStep,
  progressSteps,
  progress,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto text-center"
    >
      {/* Skeleton Screen */}
      <div className="mb-8">
        <SkeletonLoader />
      </div>

      {/* Generative Animation */}
      <GenerativeAnimation />

      {/* Progress Bar */}
      <ProgressBar progress={progress} />

      {/* Progress Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={progressStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {progressSteps[progressStep]}
          </h3>
          <p className="text-gray-500 text-sm">
            Einen Moment Geduld, während unsere KI Ihre perfekte Raumgestaltung
            erstellt.
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Processing Steps Indicator */}
      <div className="flex justify-center space-x-2 mt-8">
        {progressSteps.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index <= progressStep ? "bg-primary" : "bg-gray-300"
            }`}
            animate={{
              scale: index === progressStep ? [1, 1.3, 1] : 1,
            }}
            transition={{
              duration: 0.6,
              repeat: index === progressStep ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Fortschritt: {Math.round(progress)}%. {progressSteps[progressStep]}
      </div>
    </motion.div>
  );
};

export default Loader;
