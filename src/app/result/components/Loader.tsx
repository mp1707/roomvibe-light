"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMotionPreference } from "@/utils/animations";

interface LoaderProps {
  status: string;
  logs?: string | null;
}

const SkeletonLoader = () => (
  <div className="w-full aspect-[4/3] rounded-2xl bg-base-200 overflow-hidden relative">
    {/* Skeleton base */}
    <div className="absolute inset-0 bg-gradient-to-r from-base-200 via-base-100 to-base-200 animate-pulse" />

    {/* Shimmer effect */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-base-100/40 to-transparent transform -skew-x-12"
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
    <div className="absolute inset-4 border-2 border-dashed border-base-300 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-base-300 rounded-lg animate-pulse" />
        <div className="w-24 h-3 bg-base-300 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full max-w-md mx-auto mb-6">
    <div className="w-full bg-base-200 rounded-full h-2 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-primary-focus"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
    <div className="flex justify-between text-xs text-base-content/50 mt-2">
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

const Loader: React.FC<LoaderProps> = ({ status, logs }) => {
  const lastLogLine = logs?.split("\n").filter(Boolean).pop() ?? "";

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

      {/* Indeterminate Progress Bar */}
      <div className="w-full max-w-md mx-auto mb-6">
        <div className="w-full bg-base-200 rounded-full h-2 overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-focus"
            style={{ width: "40%" }}
            initial={{ x: "-100%" }}
            animate={{ x: "250%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "loop",
            }}
          />
        </div>
      </div>

      {/* Progress Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-base-content mb-2 px-4 capitalize">
            {status.replace(/_/g, " ")}
          </h3>
          <p className="text-base-content/60 text-sm px-4 h-5">
            {lastLogLine ||
              "Einen Moment Geduld, Ihre perfekte Raumgestaltung wird erstellt."}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Status: {status}. {lastLogLine}
      </div>
    </motion.div>
  );
};

export default Loader;
