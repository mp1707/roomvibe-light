"use client";

import { useAppState } from "@/utils/store";
import { useImageModalStore } from "@/utils/useImageModalStore";
import { useState, useEffect, useCallback } from "react";
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
import toast from "react-hot-toast";
import { getPredictionEndpoint } from "@/utils/apiHelpers";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const ResultPage = () => {
  const {
    hostedImageUrl,
    prediction,
    setPrediction,
    isGenerating,
    generationError,
    generatedImageUrls,
  } = useAppState();
  const { openModal } = useImageModalStore();
  const [selectedVariation, setSelectedVariation] = useState(0);
  const reducedMotion = useMotionPreference();

  // Safety check: ensure generatedImageUrls is always an array
  const safeGeneratedImageUrls = Array.isArray(generatedImageUrls)
    ? generatedImageUrls
    : [];

  const checkStatus = useCallback(async () => {
    if (!prediction?.id) return;

    try {
      const response = await fetch(getPredictionEndpoint(prediction.id));
      if (!response.ok) {
        throw new Error("Netzwerk-Antwort war nicht in Ordnung.");
      }
      const newPrediction = await response.json();

      setPrediction(newPrediction);

      if (
        newPrediction.status === "failed" ||
        newPrediction.status === "succeeded"
      ) {
        if (newPrediction.status === "failed") {
          toast.error(`Bildgenerierung fehlgeschlagen: ${newPrediction.error}`);
        }
        return; // Stop polling
      }

      // If still running, poll again after a delay
      await sleep(2500);
      checkStatus();
    } catch (error) {
      console.error("Fehler beim Abrufen des Prediction-Status:", error);
      setPrediction({
        ...prediction,
        status: "failed",
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
      toast.error("Ein Fehler ist beim Abrufen des Ergebnisses aufgetreten.");
    }
  }, [prediction, setPrediction]);

  useEffect(() => {
    if (
      prediction?.id &&
      (prediction.status === "starting" || prediction.status === "processing")
    ) {
      checkStatus();
    }
  }, [prediction, checkStatus]);

  if (!hostedImageUrl) {
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
          Bitte laden Sie zunächst ein Bild hoch und wählen Sie Vorschläge aus.
        </p>
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-primary text-primary-content rounded-xl font-semibold hover:bg-primary-focus transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Zurück zum Start
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
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-base-content mb-3 md:mb-4">
          Ihr Raum, neu erfunden.
        </h1>
        <p className="text-lg sm:text-xl text-base-content/60 max-w-2xl mx-auto px-4">
          {isGenerating
            ? "Unsere KI arbeitet an Ihren personalisierten Designvorschlägen..."
            : "Bewegen Sie den Regler, um die Transformation zu sehen!"}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="loading"
            variants={reducedMotion ? {} : loadingVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-4xl"
          >
            <Loader
              status={prediction?.status ?? "starting"}
              logs={prediction?.logs}
            />
          </motion.div>
        ) : generationError ? (
          <div className="text-center text-error">
            <h2 className="text-2xl font-semibold mb-2">
              Ein Fehler ist aufgetreten
            </h2>
            <p>{generationError}</p>
          </div>
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
              {hostedImageUrl && safeGeneratedImageUrls[selectedVariation] ? (
                <ResultDisplay
                  localImageUrl={hostedImageUrl}
                  generatedImageUrl={safeGeneratedImageUrls[selectedVariation]}
                  openModal={openModal}
                  itemVariants={staggerItem}
                />
              ) : (
                <div className="text-center p-8 bg-base-200 rounded-xl">
                  <p className="text-base-content/60">
                    {!hostedImageUrl
                      ? "Original image not available"
                      : "Generated image not available"}
                  </p>
                  <p className="text-sm text-base-content/40 mt-2">
                    Please make sure both images have been loaded properly.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Variation Selector */}
            {safeGeneratedImageUrls.length > 1 && (
              <motion.div
                variants={reducedMotion ? {} : staggerItem}
                className="flex flex-col items-center space-y-4"
              >
                <h3 className="text-lg font-semibold text-base-content/70">
                  Weitere Variationen
                </h3>
                <div className="flex space-x-4 overflow-visible pb-2 px-2">
                  {safeGeneratedImageUrls.map((variation, index) => (
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
                              className="w-4 h-4 text-primary-content"
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
