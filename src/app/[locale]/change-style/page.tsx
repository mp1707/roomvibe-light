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
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { staggerItem } from "@/utils/animations";

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
    appliedStyles,
    setSelectedStyle: setGlobalSelectedStyle,
    currentGeneratedImage,
    lastAppliedStyleId,
    generationError,
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
    if (selectedStyle) {
      return appliedStyles.get(selectedStyle) || null;
    }
    return currentGeneratedImage;
  }, [selectedStyle, appliedStyles, currentGeneratedImage]);

  const handleToggleStyle = useCallback(
    (styleId: string) => {
      if (isGenerating) return;
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
    if (!canApplySuggestion()) {
      toast.error(
        t("notEnoughCreditsError", { credits: CREDIT_COSTS.APPLY_SUGGESTION })
      );
      return;
    }
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

  const selectedStyleName = useMemo(() => {
    return getStyleById(selectedStyle || "")?.name;
  }, [selectedStyle]);

  // Animation variants for page transition
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.1, staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      className="flex-1 w-full flex flex-col gap-6 sm:gap-8 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="text-center px-4 sm:px-6 pt-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-base-content mb-4 md:mb-6 antialiased">
          {t("title")}
        </h1>
        <p className="text-lg sm:text-xl text-base-content/70 max-w-3xl mx-auto antialiased">
          {t("subtitle")}
        </p>
      </div>

      {/* Image Section */}
      <ImageDisplaySection
        generationProgress={generationProgress}
        mode="styles"
        currentImage={imageToDisplay}
      />

      {/* Style Grid */}
      <div className="px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-base-content mb-6 antialiased">
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
      </div>

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
      <ErrorDisplay generationError={generationError} />
    </motion.div>
  );
}
