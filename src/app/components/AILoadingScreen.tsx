import { motion, AnimatePresence } from "framer-motion";
import { useMotionPreference } from "@/utils/animations";

interface AILoadingScreenProps {
  progress: number;
  steps: string[];
  title: string;
  subtitle: string;
  hint?: string;
}

const SkeletonLoader = () => {
  const reducedMotion = useMotionPreference();

  return (
    <div className="w-full aspect-[4/3] rounded-2xl sm:rounded-3xl bg-base-200 overflow-hidden relative">
      {/* Skeleton base */}
      <div className="absolute inset-0 bg-gradient-to-r from-base-200 via-base-100 to-base-200" />

      {/* Shimmer effect */}
      {!reducedMotion && (
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
      )}

      {/* Room outline sketch */}
      <div className="absolute inset-4 sm:inset-6 border-2 border-dashed border-base-300 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-base-300 rounded-lg"
            animate={reducedMotion ? {} : { scale: [1, 1.05, 1] }}
            transition={
              reducedMotion
                ? {}
                : { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }
          />
          <motion.div
            className="w-20 h-2.5 sm:w-24 sm:h-3 bg-base-300 rounded mx-auto"
            animate={reducedMotion ? {} : { opacity: [0.5, 1, 0.5] }}
            transition={
              reducedMotion
                ? {}
                : { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </div>
      </div>
    </div>
  );
};

const GenerativeAnimation = () => {
  const reducedMotion = useMotionPreference();

  if (reducedMotion) {
    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
        <div className="w-full h-full border-3 sm:border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 border-3 sm:border-4 border-primary/30 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner ring */}
      <motion.div
        className="absolute inset-1.5 sm:inset-2 border-2 sm:border-3 border-primary/60 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {/* Center dot */}
      <motion.div
        className="absolute inset-5 sm:inset-6 bg-primary rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-6 px-4">
    <div className="w-full bg-base-200/60 rounded-full h-2.5 sm:h-3 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-primary-focus"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
    <div className="flex justify-between text-xs sm:text-sm text-base-content/50 mt-2">
      <span>0%</span>
      <motion.span
        key={Math.round(progress)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="font-medium tabular-nums"
      >
        {Math.round(progress)}%
      </motion.span>
      <span>100%</span>
    </div>
  </div>
);

export default function AILoadingScreen({
  progress,
  steps,
  title,
  subtitle,
  hint,
}: AILoadingScreenProps) {
  const currentStep = Math.min(
    Math.floor((progress / 100) * steps.length),
    steps.length - 1
  );

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

      {/* Skeleton Screen */}
      <div className="mb-6 sm:mb-8">
        <SkeletonLoader />
      </div>

      {/* Generative Animation */}
      <GenerativeAnimation />

      {/* Progress Bar */}
      <ProgressBar progress={progress} />

      {/* Progress Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="mb-6 sm:mb-8"
        >
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-base-content mb-2 px-4">
            {steps[currentStep]}
          </h3>
        </motion.div>
      </AnimatePresence>

      {/* Processing Steps Indicator */}
      <div className="flex justify-center space-x-2 mb-6 sm:mb-8">
        {steps.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index <= currentStep ? "bg-primary" : "bg-base-300"
            }`}
            animate={{
              scale: index === currentStep ? [1, 1.3, 1] : 1,
            }}
            transition={{
              duration: 0.6,
              repeat: index === currentStep ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Processing hint */}
      {hint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-xs sm:text-sm text-base-content/40">{hint}</p>
        </motion.div>
      )}

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Fortschritt: {Math.round(progress)}%. {steps[currentStep]}
      </div>
    </motion.div>
  );
}
