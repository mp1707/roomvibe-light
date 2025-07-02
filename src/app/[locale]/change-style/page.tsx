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

// New shared components
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import NavigationBar from "@/components/NavigationBar";
import { getNavigationSteps } from "@/utils/navigation";
import ContentSection from "@/components/ContentSection";

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

  // Get navigation steps for the workflow  
  const navigationSteps = getNavigationSteps("/change-style");

  return (
    <>
      {/* Navigation Bar */}
      <NavigationBar 
        currentStep="/change-style"
        steps={navigationSteps}
        showProgress={true}
      />
      
      <PageLayout 
        maxWidth="6xl" 
        spacing="base" 
        background="gradient"
        animation={true}
      >
        {/* Page Header */}
        <PageHeader
          title={t("title")}
          subtitle={t("subtitle")}
          showBackButton={true}
          backHref="/select-mode"
          align="center"
          size="base"
        />

        {/* Image Section */}
        <ContentSection 
          maxWidth="4xl" 
          spacing="none" 
          animation={true}
        >
          <ImageDisplaySection
            generationProgress={generationProgress}
            mode="styles"
            currentImage={imageToDisplay}
          />
        </ContentSection>

        {/* Style Grid Section */}
        <ContentSection 
          title={t("selectStyle")}
          maxWidth="6xl" 
          spacing="base" 
          layout="grid-4" 
          gap="base"
          animation={true}
        >
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
        </ContentSection>

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
      </PageLayout>
    </>
  );
}
