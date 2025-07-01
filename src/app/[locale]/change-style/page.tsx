"use client";

import { motion } from "framer-motion";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import toast from "react-hot-toast";
import { useCreditsStore } from "@/utils/creditsStore";
import { useConfirmationModalStore } from "@/utils/useConfirmationModalStore";
import { CREDIT_COSTS } from "@/types/credits";
import { useAppState } from "@/utils/store";
import { interiorStyles, getStyleById } from "@/utils/interiorStyles";
import { useImageGeneration } from "./hooks/useImageGeneration";
import StyleCard from "./components/StyleCard";
import ImageDisplaySection from "@/components/shared/ImageDisplaySection";
import ActionBar from "@/components/shared/ActionBar";
import { staggerContainer, staggerItem } from "@/utils/animations";

export default function ChangeStylePage() {
  const t = useTranslations("ChangeStylePage");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const router = useRouter();
  const { openModal: openConfirmationModal } = useConfirmationModalStore();
  const { canApplySuggestion, fetchCredits } = useCreditsStore();
  const { isSubmitting, generationProgress, generateStyleImage } =
    useImageGeneration();

  const {
    localImageUrl,
    hostedImageUrl,
    isGenerating,
    generationError,
    appliedStyles,
    setSelectedStyle: setGlobalSelectedStyle,
    currentGeneratedImage,
    lastAppliedStyleId,
  } = useAppState();

  // Early redirect if no images available
  useEffect(() => {
    if (!localImageUrl && !hostedImageUrl) {
      router.push("/");
    }
  }, [localImageUrl, hostedImageUrl, router]);

  // Fetch credits on component mount
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Determine the image to display
  const imageToDisplay = useMemo(() => {
    // If a style is selected, show its generated image if available.
    if (selectedStyle) {
      return appliedStyles.get(selectedStyle) || null;
    }
    // Otherwise, show the last generated image from the global state.
    return currentGeneratedImage;
  }, [selectedStyle, appliedStyles, currentGeneratedImage]);

  const handleToggleStyle = useCallback(
    (styleId: string) => {
      // Prevent selection changes during generation
      if (isGenerating) return;

      // Only allow one selection at a time
      const newSelection = selectedStyle === styleId ? null : styleId;
      setSelectedStyle(newSelection);
      setGlobalSelectedStyle(newSelection);
    },
    [isGenerating, selectedStyle, setGlobalSelectedStyle]
  );

  const handleCancelSelection = useCallback(() => {
    setSelectedStyle(null);
    setGlobalSelectedStyle(null);
  }, [setGlobalSelectedStyle]);

  const confirmAndApplyStyle = useCallback(async () => {
    if (!selectedStyle || isSubmitting || isGenerating) {
      return;
    }

    try {
      await generateStyleImage(selectedStyle);
      setSelectedStyle(null);
      setGlobalSelectedStyle(null);
    } catch (error) {
      console.error("Failed to apply style:", error);
      toast.error(t("applyError"));
    }
  }, [
    selectedStyle,
    isSubmitting,
    isGenerating,
    generateStyleImage,
    setGlobalSelectedStyle,
    t,
  ]);

  const handleApplyStyle = useCallback(() => {
    if (!selectedStyle || isSubmitting || isGenerating) {
      return;
    }

    const style = getStyleById(selectedStyle);
    if (!style) return;

    // Check if user has enough credits for applying style
    if (!canApplySuggestion()) {
      toast.error(
        t("notEnoughCreditsError", { credits: CREDIT_COSTS.APPLY_SUGGESTION })
      );
      return;
    }

    // Show confirmation modal
    openConfirmationModal({
      title: t("applyStyleTitle"),
      message: t("applyStyleMessage", { title: style.name }),
      confirmText: t("useCredits", { credits: CREDIT_COSTS.APPLY_SUGGESTION }),
      cancelText: t("cancel"),
      onConfirm: confirmAndApplyStyle,
    });
  }, [
    selectedStyle,
    isSubmitting,
    isGenerating,
    canApplySuggestion,
    openConfirmationModal,
    confirmAndApplyStyle,
    t,
  ]);

  // Memoize selected style name to prevent unnecessary computations
  const selectedStyleName = useMemo(() => {
    return getStyleById(selectedStyle || "")?.name;
  }, [selectedStyle]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.1, staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="flex-1 w-full flex flex-col gap-6 sm:gap-8 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-base-content mb-3 md:mb-4">
          {t("title")}
        </h1>
        <p className="text-base sm:text-lg text-base-content/60 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </motion.div>

      {/* Image Section */}
      <motion.div variants={itemVariants}>
        <ImageDisplaySection
          generationProgress={generationProgress}
          mode="styles"
          currentImage={imageToDisplay}
        />
      </motion.div>

      {/* Style Grid */}
      <motion.div variants={itemVariants} className="px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-base-content mb-6">
            {t("selectStyle")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {interiorStyles.map((style, index) => (
              <motion.div
                key={style.id}
                variants={staggerItem}
                className="relative"
              >
                <StyleCard
                  style={style}
                  selected={selectedStyle === style.id}
                  onToggle={handleToggleStyle}
                  isApplied={lastAppliedStyleId === style.id}
                  isGenerating={isGenerating}
                  delay={index * 0.05}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Action Bar */}
      <ActionBar
        selectedItemId={selectedStyle}
        selectedItemTitle={selectedStyleName}
        isSubmitting={isSubmitting}
        isGenerating={isGenerating}
        onCancel={handleCancelSelection}
        onApply={handleApplyStyle}
        mode="styles"
      />

      {/* Error Display */}
      {generationError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 sm:px-6"
        >
          <div className="max-w-2xl mx-auto bg-error/10 border border-error/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-error flex-shrink-0 mt-0.5"
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
              <div>
                <h3 className="font-semibold text-error mb-1">
                  {t("generationError")}
                </h3>
                <p className="text-sm text-error/80">{generationError}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
