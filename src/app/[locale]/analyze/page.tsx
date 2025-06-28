"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAppState } from "@/utils/store";
import { useImageModalStore } from "@/utils/useImageModalStore";
import Image from "next/image";
import {
  staggerContainer,
  staggerItem,
  buttonVariants,
  useMotionPreference,
} from "@/utils/animations";

import { getAnalyzeEndpoint } from "@/utils/apiHelpers";
import AILoadingScreen from "@/components/AILoadingScreen";

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

export default function AnalyzePage() {
  const { localImageUrl, hostedImageUrl, resetForNewImage } = useAppState();
  const { reset: resetImageModal } = useImageModalStore();
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

      // Get the image URL for API call
      let imageUrl: string;

      if (hostedImageUrl) {
        // Use the Supabase URL directly (preferred)
        imageUrl = hostedImageUrl;
      } else if (localImageUrl) {
        // Convert blob URL to base64 data URL for local images
        const response = await fetch(localImageUrl);
        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        imageUrl = base64;
      } else {
        throw new Error("Kein Bild zum Analysieren gefunden");
      }

      // Call our analysis API (real or mock based on settings)
      const response = await fetch(getAnalyzeEndpoint(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: imageUrl,
        }),
      });

      // Read response text once and handle both success and error cases
      let responseText: string;
      try {
        responseText = await response.text();
      } catch (readError) {
        console.error("Failed to read response:", readError);
        throw new Error(
          `Network error: Could not read server response (Status: ${response.status})`
        );
      }

      if (!response.ok) {
        console.error("API Error Response:", responseText);

        // Handle specific error codes
        if (response.status === 413) {
          throw new Error(
            "Das Bild ist zu groß. Bitte verwenden Sie ein kleineres Bild (max. 5MB)."
          );
        }

        let errorData;
        try {
          errorData = JSON.parse(responseText);
          throw new Error(
            errorData.error || `Server Error (${response.status})`
          );
        } catch (parseError) {
          // If we can't parse the error response, use the status
          throw new Error(
            `Server Error (${response.status}): ${response.statusText}`
          );
        }
      }

      let analysisResult;
      try {
        console.log("Raw response:", responseText.substring(0, 200) + "...");
        analysisResult = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        console.error("Response status:", response.status);
        console.error(
          "Response headers:",
          Object.fromEntries(response.headers.entries())
        );
        throw new Error(
          "Server returned invalid JSON response. This may be due to missing environment variables or server configuration issues."
        );
      }

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
        } else if (
          error.message.includes("invalid JSON response") ||
          error.message.includes("environment variables")
        ) {
          errorTitle = "Konfigurationsfehler";
          errorMessage =
            "Es gibt ein Problem mit der Server-Konfiguration. Bitte versuchen Sie es in wenigen Minuten erneut oder kontaktieren Sie den Support.";
        } else if (
          error.message.includes("zu groß") ||
          error.message.includes("Content Too Large") ||
          error.message.includes("413")
        ) {
          errorTitle = "Bild zu groß";
          errorMessage =
            "Das ausgewählte Bild ist zu groß für die Verarbeitung. Bitte verwenden Sie ein kleineres Bild (empfohlen: unter 5MB) oder komprimieren Sie das Bild.";
        } else {
          errorMessage = `${error.message} (Fehlercode: ANALYZE_${Date.now()})`;
        }
      }

      showErrorModal(errorTitle, errorMessage);
    }
  }, [localImageUrl, hostedImageUrl, router, showErrorModal]);

  const handleGoBack = useCallback(() => {
    // Reset all state when going back to prevent interference
    resetForNewImage();
    resetImageModal();
    router.push("/");
  }, [router, resetForNewImage, resetImageModal]);

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
          {!isAnalyzing && (
            <motion.div
              variants={reducedMotion ? {} : staggerItem}
              className="mb-8 md:mb-12"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-base-content mb-3 md:mb-4">
                Bereit für die Analyse?
              </h1>
              <p className="text-base sm:text-lg text-base-content/60 max-w-2xl mx-auto">
                Ihr Bild ist hochgeladen. Starten Sie jetzt die KI-Analyse für
                personalisierte Raumgestaltungsvorschläge.
              </p>
            </motion.div>
          )}

          {/* Image Preview or Loading Animation */}
          <motion.div
            variants={reducedMotion ? {} : staggerItem}
            className="relative w-full max-w-2xl mb-8 md:mb-12"
          >
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <AILoadingScreen
                  progress={analysisProgress}
                  steps={[
                    "Bild wird analysiert...",
                    "Räume werden erkannt...",
                    "Stil wird identifiziert...",
                    "Vorschläge werden generiert...",
                  ]}
                  title="KI-Analyse läuft"
                  subtitle="Ihre Raumgestaltungsvorschläge werden gerade erstellt. Bitte haben Sie einen Moment Geduld."
                  hint="Die Analyse dauert in der Regel 30-60 Sekunden"
                  mode="analyze"
                />
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
