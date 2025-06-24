import { motion, AnimatePresence } from "framer-motion";
import { useMotionPreference } from "@/utils/animations";
import { useAppState } from "@/utils/store";
import { useEffect } from "react";
import Image from "next/image";

interface AILoadingScreenProps {
  progress: number;
  steps: string[];
  title: string;
  subtitle: string;
  hint?: string;
}

const ScanningEffect = ({ progress }: { progress: number }) => {
  const reducedMotion = useMotionPreference();

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-pulse" />
    );
  }

  return (
    <>
      {/* Main scanning laser */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: [0.22, 1, 0.36, 1], // Apple easing from design system
          repeatType: "loop",
          repeatDelay: 2,
        }}
      >
        <div className="relative w-full h-full">
          {/* Scanning line - more subtle */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/80 shadow-[0_0_12px_theme(colors.primary/0.4)] dark:shadow-[0_0_16px_theme(colors.primary/0.5)] transform -translate-x-1/2" />

          {/* Scanning gradient - softer */}
          <div className="absolute left-1/2 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-primary/15 dark:via-primary/20 to-transparent transform -translate-x-1/2" />

          {/* Leading glow - more subtle */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/30 dark:bg-primary/40 blur-sm transform -translate-x-1/2" />
        </div>
      </motion.div>

      {/* Grid overlay for futuristic feel - more subtle */}
      <div
        className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,122,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,122,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Scanning overlay effect - gentle trailing glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/4 dark:via-primary/6 to-transparent pointer-events-none"
        initial={{ x: "-80%" }}
        animate={{ x: "180%" }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1], // Apple ease-in-out from design system
          repeatType: "loop",
          repeatDelay: 2.5,
        }}
        style={{ width: "80%" }}
      />

      {/* Very subtle breathing effect on the whole overlay */}
      <motion.div
        className="absolute inset-0 bg-primary/2 dark:bg-primary/3 pointer-events-none"
        animate={{
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse",
        }}
      />
    </>
  );
};

const ImageAnalysisDisplay = ({ progress }: { progress: number }) => {
  const { localImageUrl, hostedImageUrl } = useAppState();
  const imageUrl = localImageUrl || hostedImageUrl;
  const reducedMotion = useMotionPreference();

  if (!imageUrl) {
    return (
      <div className="w-full aspect-[4/3] rounded-3xl bg-base-200 flex items-center justify-center">
        <div className="text-base-content/40">Kein Bild verfügbar</div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
      {/* Original image */}
      <Image
        src={imageUrl}
        alt="Bild wird analysiert"
        fill
        className="object-cover"
        priority
      />

      {/* Dark overlay for better contrast - adjusted for light/dark mode */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />

      {/* Scanning effect */}
      <ScanningEffect progress={progress} />

      {/* Analysis status indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-4 right-4"
      >
        <div className="bg-base-100/90 dark:bg-base-100/95 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-2 h-2 bg-primary rounded-full"
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
                KI-Analyse läuft
              </span>
            </div>
            <div className="text-xs text-base-content/60 tabular-nums">
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      </motion.div>

      {/* Corner indicators for a tech feel - improved for dark mode */}
      <div className="absolute top-4 left-4">
        <div className="w-6 h-6 border-l-2 border-t-2 border-primary/60 dark:border-primary/70 rounded-tl-lg" />
      </div>
      <div className="absolute top-4 right-4">
        <div className="w-6 h-6 border-r-2 border-t-2 border-primary/60 dark:border-primary/70 rounded-tr-lg" />
      </div>
      <div className="absolute bottom-16 left-4">
        <div className="w-6 h-6 border-l-2 border-b-2 border-primary/60 dark:border-primary/70 rounded-bl-lg" />
      </div>
      <div className="absolute bottom-16 right-4">
        <div className="w-6 h-6 border-r-2 border-b-2 border-primary/60 dark:border-primary/70 rounded-br-lg" />
      </div>
    </div>
  );
};

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

      {/* Image with scanning effect */}
      <div className="mb-8">
        <ImageAnalysisDisplay progress={progress} />
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
        Fortschritt: {Math.round(progress)}%. {steps[currentStep]}
      </div>
    </motion.div>
  );
}
