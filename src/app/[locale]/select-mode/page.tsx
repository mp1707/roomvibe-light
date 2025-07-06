"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAppState } from "@/utils/store";
import { useImageModalStore } from "@/utils/useImageModalStore";
import Image from "next/image";

import { getAnalyzeEndpoint } from "@/utils/apiHelpers";
import AILoadingScreen from "@/components/AILoadingScreen";

// New shared components
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import UnifiedCard from "@/components/UnifiedCard";
import ContentSection from "@/components/ContentSection";
import { buttonVariants, useMotionPreference } from "@/utils/animations";


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
  const t = useTranslations("Components.ErrorModal");
  const commonT = useTranslations("Common");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="error-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
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
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative w-full max-w-[280px] xs:max-w-sm sm:max-w-md mx-auto"
        >
          <div className="bg-white/20 dark:bg-black/20 backdrop-blur-xl rounded-2xl xs:rounded-3xl shadow-2xl overflow-hidden border border-white/30">
            {/* Header */}
            <div className="px-4 xs:px-5 sm:px-6 py-3 xs:py-4 border-b border-white/20">
              <div className="flex items-center space-x-2.5 xs:space-x-3">
                <div className="w-8 h-8 xs:w-10 xs:h-10 bg-error/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 xs:w-5 xs:h-5 text-error"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-label={t("errorIcon")}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3
                  id="error-modal-title"
                  className="text-base xs:text-lg font-semibold text-base-content"
                >
                  {title || t("modalTitle")}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 xs:px-5 sm:px-6 py-4 xs:py-5 sm:py-6">
              <p className="text-sm xs:text-base text-base-content/70 leading-relaxed">
                {message}
              </p>
            </div>

            {/* Footer */}
            <div className="px-4 xs:px-5 sm:px-6 py-3 xs:py-4 bg-white/10 dark:bg-black/10 border-t border-white/20">
              <motion.button
                variants={reducedMotion ? {} : buttonVariants}
                whileHover={reducedMotion ? {} : "hover"}
                whileTap={reducedMotion ? {} : "tap"}
                onClick={onClose}
                className="w-full px-3 xs:px-4 py-2.5 xs:py-3 bg-primary hover:bg-primary-focus text-primary-content font-medium rounded-xl xs:rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-lg text-sm xs:text-base"
                aria-label={t("closeModal")}
              >
                {commonT("back")}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function SelectModePage() {
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
  const t = useTranslations("SelectModePage");

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

  const handleNavigateToStyleChange = useCallback(() => {
    router.push("/change-style");
  }, [router]);

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
        throw new Error(t("errors.noImage"));
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
          throw new Error(t("errors.tooLarge"));
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
            t("errors.noInteriorSpace"),
            t("errors.noSuggestions")
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
      let errorTitle = t("errors.analysisFailed");
      let errorMessage = t("errors.defaultError");

      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          localImageUrl,
          hostedImageUrl,
          timestamp: new Date().toISOString(),
        });

        if (error.message.includes("OpenAI API")) {
          errorTitle = t("errors.aiUnavailable");
          errorMessage = t("errors.aiError");
        } else if (
          error.message.includes("Validierung") ||
          error.message.includes("erwarteten Format")
        ) {
          errorTitle = t("errors.processingError");
          errorMessage = t("errors.processingMessage");
        } else if (error.message.includes(t("errors.noImage"))) {
          errorTitle = t("errors.imageNotFound");
          errorMessage = t("errors.imageNotFoundMessage");
        } else if (
          error.message.includes("string did not match") ||
          error.message.includes("pattern")
        ) {
          errorTitle = t("errors.dataFormatError");
          errorMessage = t("errors.dataFormatMessage");
        } else if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("Network")
        ) {
          errorTitle = t("errors.connectionError");
          errorMessage = t("errors.connectionMessage");
        } else if (
          error.message.includes("invalid JSON response") ||
          error.message.includes("environment variables")
        ) {
          errorTitle = t("errors.configError");
          errorMessage = t("errors.configMessage");
        } else if (
          error.message.includes("zu groß") ||
          error.message.includes("Content Too Large") ||
          error.message.includes("413")
        ) {
          errorTitle = t("errors.imageTooBig");
          errorMessage = t("errors.imageTooBigMessage");
        } else {
          errorMessage = `${error.message} (Fehlercode: ANALYZE_${Date.now()})`;
        }
      }

      showErrorModal(errorTitle, errorMessage);
    }
  }, [localImageUrl, hostedImageUrl, router, showErrorModal, t]);

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
      <PageLayout 
        maxWidth="4xl" 
        spacing="lg" 
        background="gradient"
        animation={true}
      >
        {/* Page Header */}
        {!isAnalyzing && (
          <PageHeader
            title={t("title")}
            subtitle={t("subtitle")}
            showBackButton={true}
            onBack={handleGoBack}
            align="center"
            size="base"
          />
        )}

        {/* Image Section */}
        <ContentSection 
          maxWidth="2xl" 
          spacing="none" 
          animation={true}
        >
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <AILoadingScreen
                progress={analysisProgress}
                steps={[
                  t("loadingSteps.analyzing"),
                  t("loadingSteps.detecting"),
                  t("loadingSteps.identifying"),
                  t("loadingSteps.generating"),
                ]}
                title={t("loadingTitle")}
                subtitle={t("loadingSubtitle")}
                hint={t("loadingHint")}
                mode="analyze"
              />
            ) : (
              <motion.div
                key="image-preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl mx-auto"
              >
                <div className="relative aspect-[4/3] rounded-2xl xs:rounded-3xl overflow-hidden shadow-xl xs:shadow-2xl">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={t("imageUploaded")}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 60vw"
                    />
                  )}

                  {/* Image info overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-3 xs:bottom-4 left-3 xs:left-4 right-3 xs:right-4"
                  >
                    <div className="bg-base-100/90 backdrop-blur-sm rounded-xl xs:rounded-2xl px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 border border-base-100/20">
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1.5 xs:gap-2 sm:gap-4">
                        <div className="flex items-center space-x-2 xs:space-x-3">
                          <div className="w-1.5 xs:w-2 h-1.5 xs:h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs xs:text-sm font-medium text-base-content">
                            {t("imageUploaded")}
                          </span>
                        </div>
                        <div className="text-[10px] xs:text-xs text-base-content/60 font-medium">
                          {t("readyForAnalysis")}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </ContentSection>

        {/* Options Section */}
        {!isAnalyzing && (
          <ContentSection 
            title={t("chooseOption")}
            maxWidth="xl" 
            spacing="base" 
            layout="grid-2" 
            gap="base"
            animation={true}
          >
            {/* Analyze Space Option */}
            <UnifiedCard
              title={t("analyzeSpace")}
              description={t("analyzeSpaceDescription")}
              icon={
                <svg
                  className="w-6 h-6"
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
              }
              onClick={handleStartAnalysis}
              variant="primary"
              size="base"
              layout="horizontal"
              delay={0.1}
            />

            {/* Change Style Option */}
            <UnifiedCard
              title={t("changeStyle")}
              description={t("changeStyleDescription")}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
              }
              onClick={handleNavigateToStyleChange}
              variant="secondary"
              size="base"
              layout="horizontal"
              delay={0.2}
            />
          </ContentSection>
        )}
      </PageLayout>

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
