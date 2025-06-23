"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/utils/store";
import Image from "next/image";
import {
  staggerContainer,
  staggerItem,
  buttonVariants,
  useMotionPreference,
} from "@/utils/animations";

const ErrorModal = ({
  isOpen,
  onClose,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}) => {
  const reducedMotion = useMotionPreference();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={
            reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }
          }
          animate={
            reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }
          }
          exit={
            reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }
          }
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-md mx-auto"
        >
          <div className="bg-base-100 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-error/10 to-warning/10 px-6 py-4 border-b border-base-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-error/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-error"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-base-content">
                  {title}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <p className="text-base-content/70 leading-relaxed">{message}</p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-base-50 border-t border-base-200">
              <motion.button
                variants={reducedMotion ? {} : buttonVariants}
                whileHover={reducedMotion ? {} : "hover"}
                whileTap={reducedMotion ? {} : "tap"}
                onClick={onClose}
                className="w-full px-4 py-3 bg-primary hover:bg-primary-focus text-primary-content font-medium rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Zurück
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

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

const AnalyzeLoader = ({ progress }: { progress: number }) => {
  const progressSteps = [
    "Bild wird analysiert...",
    "Räume werden erkannt...",
    "Stil wird identifiziert...",
    "Vorschläge werden generiert...",
  ];

  const currentStep = Math.min(
    Math.floor((progress / 100) * progressSteps.length),
    progressSteps.length - 1
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto text-center"
    >
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
            {progressSteps[currentStep]}
          </h3>
          <p className="text-base-content/70 text-sm sm:text-base px-4 leading-relaxed">
            Unsere KI erkennt Räume, Möbel und Stil für perfekte Vorschläge
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Processing Steps Indicator */}
      <div className="flex justify-center space-x-2 mb-6 sm:mb-8">
        {progressSteps.map((_, index) => (
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="text-xs sm:text-sm text-base-content/40">
          Die Analyse dauert in der Regel 30-60 Sekunden
        </p>
      </motion.div>

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Fortschritt: {Math.round(progress)}%. {progressSteps[currentStep]}
      </div>
    </motion.div>
  );
};

export default function AnalyzePage() {
  const { localImageUrl, hostedImageUrl } = useAppState();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });
  const router = useRouter();
  const reducedMotion = useMotionPreference();

  // Helper function to show error modal
  const showErrorModal = useCallback((title: string, message: string) => {
    setErrorModal({
      isOpen: true,
      title,
      message,
    });
  }, []);

  // Helper function to close error modal and navigate back
  const closeErrorModal = useCallback(() => {
    setErrorModal({
      isOpen: false,
      title: "",
      message: "",
    });
    router.push("/");
  }, [router]);

  // Redirect if no image
  useEffect(() => {
    if (!localImageUrl && !hostedImageUrl) {
      router.push("/");
    }
  }, [localImageUrl, hostedImageUrl, router]);

  const handleStartAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Start progress simulation
      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90; // Leave room for completion
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      // Get the image file for API call
      let imageFile: File | null = null;

      if (localImageUrl) {
        // Convert blob URL back to File if needed
        const response = await fetch(localImageUrl);
        const blob = await response.blob();
        imageFile = new File([blob], "room-image.jpg", { type: "image/jpeg" });
      } else if (hostedImageUrl) {
        // For hosted images, we need to fetch and convert to File
        const response = await fetch(hostedImageUrl);
        const blob = await response.blob();
        imageFile = new File([blob], "room-image.jpg", { type: blob.type });
      }

      if (!imageFile) {
        throw new Error("Kein Bild zum Analysieren gefunden");
      }

      // Prepare form data for API call
      const formData = new FormData();
      formData.append("file", imageFile);

      // Call our analysis API
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analyse fehlgeschlagen");
      }

      const analysisResult = await response.json();

      // Clear progress interval and complete
      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Check if the image is an interior space
      if (
        !analysisResult.isInteriorSpace ||
        analysisResult.suggestions.length === 0
      ) {
        // Show error message for non-interior images
        setTimeout(() => {
          setIsAnalyzing(false);
          setAnalysisProgress(0);
          showErrorModal(
            "Kein Innenraum erkannt",
            "Es konnten keine Vorschläge generiert werden. Bitte laden Sie ein Bild eines Innenraums hoch (Wohnzimmer, Schlafzimmer, Küche, etc.)."
          );
        }, 500);
        return;
      }

      // Store suggestions in global state
      const { setSuggestions } = useAppState.getState();
      setSuggestions(analysisResult.suggestions);

      // Small delay to show completion
      setTimeout(() => {
        router.push("/suggestions");
      }, 500);
    } catch (error) {
      console.error("Analysis error:", error);
      setIsAnalyzing(false);
      setAnalysisProgress(0);

      // Show user-friendly error message
      let errorTitle = "Analyse fehlgeschlagen";
      let errorMessage =
        "Es ist ein Fehler bei der Analyse aufgetreten. Versuchen Sie es mit einem anderen Bild erneut.";

      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          localImageUrl,
          hostedImageUrl,
          timestamp: new Date().toISOString(),
        });

        if (error.message.includes("OpenAI API")) {
          errorTitle = "KI-Service nicht verfügbar";
          errorMessage =
            "Die KI-Analyse ist momentan nicht verfügbar. Bitte versuchen Sie es in einem Moment erneut.";
        } else if (
          error.message.includes("Validierung") ||
          error.message.includes("erwarteten Format")
        ) {
          errorTitle = "Verarbeitungsfehler";
          errorMessage =
            "Die KI-Antwort konnte nicht verarbeitet werden. Bitte versuchen Sie es mit einem anderen Bild erneut.";
        } else if (error.message.includes("Kein Bild")) {
          errorTitle = "Bild nicht gefunden";
          errorMessage =
            "Das Bild konnte nicht gefunden werden. Bitte laden Sie ein neues Bild hoch.";
        } else if (
          error.message.includes("string did not match") ||
          error.message.includes("pattern")
        ) {
          errorTitle = "Datenformat-Fehler";
          errorMessage =
            "Es gab ein Problem mit dem Datenformat. Bitte versuchen Sie es erneut oder laden Sie ein anderes Bild hoch.";
        } else if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("Network")
        ) {
          errorTitle = "Verbindungsfehler";
          errorMessage =
            "Die Verbindung zum Server ist fehlgeschlagen. Überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.";
        } else {
          errorMessage = `${error.message} (Fehlercode: ANALYZE_${Date.now()})`;
        }
      }

      showErrorModal(errorTitle, errorMessage);
    }
  }, [localImageUrl, hostedImageUrl, router, showErrorModal]);

  const handleGoBack = useCallback(() => {
    router.push("/");
  }, [router]);

  if (!localImageUrl && !hostedImageUrl) {
    return null;
  }

  const imageUrl = localImageUrl || hostedImageUrl;

  return (
    <>
      <div className="w-full flex items-center justify-center min-h-screen py-8">
        <motion.div
          variants={reducedMotion ? {} : staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-4xl flex flex-col items-center text-center px-4 sm:px-6"
        >
          {/* Header */}
          <motion.div
            variants={reducedMotion ? {} : staggerItem}
            className="mb-8 md:mb-12"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-base-content mb-3 md:mb-4">
              {isAnalyzing ? "KI-Analyse läuft" : "Bereit für die Analyse?"}
            </h1>
            <p className="text-base sm:text-lg text-base-content/60 max-w-2xl mx-auto">
              {isAnalyzing
                ? "Ihre Raumgestaltungsvorschläge werden gerade erstellt. Bitte haben Sie einen Moment Geduld."
                : "Ihr Bild ist hochgeladen. Starten Sie jetzt die KI-Analyse für personalisierte Raumgestaltungsvorschläge."}
            </p>
          </motion.div>

          {/* Image Preview or Loading Animation */}
          <motion.div
            variants={reducedMotion ? {} : staggerItem}
            className="relative w-full max-w-2xl mb-8 md:mb-12"
          >
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <AnalyzeLoader progress={analysisProgress} />
              ) : (
                <motion.div
                  key="image-preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt="Hochgeladenes Bild"
                        fill
                        className="object-cover"
                        priority
                      />
                    )}

                    {/* Image info overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute bottom-4 left-4 right-4"
                    >
                      <div className="bg-base-100/90 backdrop-blur-sm rounded-2xl px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-base-content">
                              Bild erfolgreich hochgeladen
                            </span>
                          </div>
                          <div className="text-xs text-base-content/50">
                            Bereit für Analyse
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Action Buttons */}
          {!isAnalyzing && (
            <motion.div
              variants={reducedMotion ? {} : staggerItem}
              className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
            >
              {/* Back Button */}
              <motion.button
                variants={reducedMotion ? {} : buttonVariants}
                whileHover={reducedMotion ? {} : "hover"}
                whileTap={reducedMotion ? {} : "tap"}
                onClick={handleGoBack}
                className="flex-1 px-6 py-3 sm:py-4 bg-base-200 hover:bg-base-300 text-base-content font-medium rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Anderes Bild wählen
              </motion.button>

              {/* Start Analysis Button */}
              <motion.button
                variants={reducedMotion ? {} : buttonVariants}
                whileHover={reducedMotion ? {} : "hover"}
                whileTap={reducedMotion ? {} : "tap"}
                onClick={handleStartAnalysis}
                className="flex-1 px-6 py-3 sm:py-4 bg-primary hover:bg-primary-focus text-primary-content font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transform hover:scale-105 active:scale-95"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Analyse starten</span>
                </span>
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        title={errorModal.title}
        message={errorModal.message}
      />
    </>
  );
}
