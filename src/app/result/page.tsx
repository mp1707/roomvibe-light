"use client";

import { useAppState } from "@/utils/store";
import { useImageModalStore } from "@/utils/useImageModalStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./components/Loader";
import ResultDisplay from "./components/ResultDisplay";
import ActionButtons from "./components/ActionButtons";
import {
  staggerContainer,
  staggerItem,
  loadingVariants,
  useMotionPreference,
} from "@/utils/animations";

// Granular progress messages for better UX
const progressSteps = [
  "Analysiere Raumlayout und Proportionen...",
  "Bewerte Beleuchtung und Schattenwurf...",
  "Wähle komplementäre Möbel aus...",
  "Generiere Farbpalette und Materialien...",
  "Rendere das finale Bild...",
  "Finalisiere die Verbesserungen...",
];

const ResultPage = () => {
  const { localImageUrl } = useAppState();
  const { openModal } = useImageModalStore();
  const [loading, setLoading] = useState(true);
  const [progressStep, setProgressStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const reducedMotion = useMotionPreference();

  useEffect(() => {
    if (!localImageUrl) return;

    setLoading(true);
    setProgressStep(0);
    setProgress(0);

    // Simulate granular progress updates
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        return Math.min(newProgress, 95);
      });
    }, 200);

    // Update progress steps
    const stepInterval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < progressSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    // Complete the process
    const timeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        clearInterval(progressInterval);
        clearInterval(stepInterval);
      }, 500);
    }, 6000);

    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [localImageUrl]);

  // Mock generated image variations for better UX
  const generatedImageVariations = [
    "https://img.daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a-blur.webp",
    "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp",
    "https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp",
  ];

  const [selectedVariation, setSelectedVariation] = useState(0);

  if (!localImageUrl) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full text-center"
      >
        <h2 className="text-2xl font-semibold text-base-content/60 mb-4">
          Kein Bild gefunden
        </h2>
        <p className="text-base-content/50 mb-6">
          Bitte laden Sie zunächst ein Bild hoch.
        </p>
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-focus transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Zurück zum Upload
        </motion.a>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={reducedMotion ? {} : staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8 items-center justify-center w-full"
    >
      {/* Header */}
      <motion.div
        variants={reducedMotion ? {} : staggerItem}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-base-content mb-4">
          Ihr Raum, neu erfunden.
        </h1>
        <p className="text-xl text-base-content/60 max-w-2xl mx-auto">
          {loading
            ? "Unsere KI arbeitet an Ihren personalisierten Designvorschlägen..."
            : "Bewegen Sie den Regler, um die Transformation zu sehen!"}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            variants={reducedMotion ? {} : loadingVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-4xl"
          >
            <Loader
              progressStep={progressStep}
              progressSteps={progressSteps}
              progress={progress}
            />
          </motion.div>
        ) : (
          <motion.div
            key="result"
            variants={reducedMotion ? {} : staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full space-y-8"
          >
            {/* Main Result Display */}
            <motion.div variants={reducedMotion ? {} : staggerItem}>
              <ResultDisplay
                localImageUrl={localImageUrl}
                generatedImageUrl={generatedImageVariations[selectedVariation]}
                openModal={openModal}
                itemVariants={staggerItem}
              />
            </motion.div>

            {/* Variation Selector */}
            {generatedImageVariations.length > 1 && (
              <motion.div
                variants={reducedMotion ? {} : staggerItem}
                className="flex flex-col items-center space-y-4"
              >
                <h3 className="text-lg font-semibold text-base-content/70">
                  Weitere Variationen
                </h3>
                <div className="flex space-x-4 overflow-visible pb-2 px-2">
                  {generatedImageVariations.map((variation, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedVariation(index)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        selectedVariation === index
                          ? "border-primary shadow-lg shadow-primary/25"
                          : "border-base-300 hover:border-primary/30 hover:shadow-md"
                      }`}
                    >
                      <img
                        src={variation}
                        alt={`Designvariation ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedVariation === index && (
                        <motion.div
                          layoutId="selection-indicator"
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div variants={reducedMotion ? {} : staggerItem}>
              <ActionButtons itemVariants={staggerItem} />
            </motion.div>

            {/* Tips */}
            <motion.div
              variants={reducedMotion ? {} : staggerItem}
              className="text-center space-y-2"
            >
              <p className="text-sm text-base-content/50">
                💡 Tipp: Klicken Sie auf das Bild für eine Vollansicht
              </p>
              <p className="text-xs text-base-content/40">
                Nicht zufrieden? Gehen Sie zurück und wählen Sie andere
                Vorschläge aus.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResultPage;
