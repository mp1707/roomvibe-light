"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import toast from "react-hot-toast";
import { useCreditsStore } from "@/utils/creditsStore";
import { useConfirmationModalStore } from "@/utils/useConfirmationModalStore";
import { CREDIT_COSTS } from "@/types/credits";
import { useAppState } from "@/utils/store";
import { useImageGeneration } from "./hooks/useImageGeneration";
import ImageDisplaySection from "@/components/ImageDisplaySection";
import SuggestionsListSection from "./components/SuggestionsListSection";
import ActionBar from "@/components/ActionBar";
import ErrorDisplay from "@/components/ErrorDisplay";

// New shared components
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import ContentSection from "@/components/ContentSection";

export default function SuggestionsPage() {
  const t = useTranslations("SuggestionsPage");
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );
  const router = useRouter();
  const { openModal: openConfirmationModal } = useConfirmationModalStore();
  const { canApplySuggestion, fetchCredits } = useCreditsStore();
  const { isSubmitting, generationProgress, generateImage } =
    useImageGeneration();

  const {
    localImageUrl,
    hostedImageUrl,
    isGenerating,
    generationError,
    suggestions,
    customSuggestions,
    currentGeneratedImage,
    addCustomSuggestion,
    editCustomSuggestion,
    removeCustomSuggestion,
  } = useAppState();

  // Memoize all suggestions to prevent unnecessary re-computations
  const allSuggestions = useMemo(
    () => [...suggestions, ...customSuggestions],
    [suggestions, customSuggestions]
  );

  // Dynamic subtitle based on current state
  const pageSubtitle = useMemo(() => {
    if (isGenerating) {
      return t("generatingSubtitle") || "Ihr Raum wird gerade verwandelt...";
    }
    if (currentGeneratedImage) {
      return (
        t("resultSubtitle") ||
        "Bewegen Sie den Regler, um die Veränderungen zu sehen"
      );
    }
    return (
      t("subtitle") ||
      "Wählen Sie einen Vorschlag aus, um Ihr Zimmer zu verwandeln"
    );
  }, [isGenerating, currentGeneratedImage, t]);

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

  const handleToggleSuggestion = useCallback(
    (suggestionId: string) => {
      // Prevent selection changes during generation
      if (isGenerating) return;

      // Only allow one selection at a time
      setSelectedSuggestion((prev) =>
        prev === suggestionId ? null : suggestionId
      );
    },
    [isGenerating]
  );

  const handleCancelSelection = useCallback(() => {
    setSelectedSuggestion(null);
  }, []);

  const confirmAndApplySuggestion = useCallback(async () => {
    if (!selectedSuggestion || isSubmitting || isGenerating) {
      return;
    }

    try {
      await generateImage(selectedSuggestion);
      setSelectedSuggestion(null);
    } catch (error) {
      console.error("Failed to apply suggestion:", error);
      toast.error(t("applyError"));
    }
  }, [selectedSuggestion, isSubmitting, isGenerating, generateImage, t]);

  const handleApplySuggestion = useCallback(() => {
    if (!selectedSuggestion || isSubmitting || isGenerating) {
      return;
    }

    const suggestionToApply = allSuggestions.find(
      (s) => s.id === selectedSuggestion
    );

    if (!suggestionToApply) return;

    // Check if user has enough credits for applying suggestion
    if (!canApplySuggestion()) {
      toast.error(
        t("notEnoughCreditsError", { credits: CREDIT_COSTS.APPLY_SUGGESTION })
      );
      return;
    }

    // Show confirmation modal
    openConfirmationModal({
      title: t("applySuggestionTitle"),
      message: t("applySuggestionMessage", { title: suggestionToApply.title }),
      confirmText: t("useCredits", { credits: CREDIT_COSTS.APPLY_SUGGESTION }),
      cancelText: t("cancel"),
      onConfirm: confirmAndApplySuggestion,
    });
  }, [
    selectedSuggestion,
    isSubmitting,
    isGenerating,
    allSuggestions,
    canApplySuggestion,
    openConfirmationModal,
    confirmAndApplySuggestion,
    t,
  ]);

  const handleAddCustomSuggestion = useCallback(
    (data: { title: string; suggestion: string; category: string }) => {
      addCustomSuggestion(data);
    },
    [addCustomSuggestion]
  );

  const handleEditCustomSuggestion = useCallback(
    (id: string, data: { title: string; suggestion: string }) => {
      editCustomSuggestion(id, { ...data, category: "custom" });
    },
    [editCustomSuggestion]
  );

  const handleDeleteCustomSuggestion = useCallback(
    (id: string) => {
      removeCustomSuggestion(id);
    },
    [removeCustomSuggestion]
  );

  // Memoize selected suggestion title to prevent unnecessary computations
  const selectedSuggestionTitle = useMemo(() => {
    return allSuggestions.find((s) => s.id === selectedSuggestion)?.title;
  }, [allSuggestions, selectedSuggestion]);

  return (
    <>
      <PageLayout
        maxWidth="6xl"
        spacing="base"
        background="gradient"
        animation={true}
      >
        {/* Page Header */}
        <PageHeader
          title={t("title") || "Design-Vorschläge"}
          subtitle={pageSubtitle}
          showBackButton={true}
          backHref="/select-mode"
          align="center"
          size="base"
        />

        {/* Image Section */}
        <ContentSection maxWidth="4xl" spacing="none" animation={true}>
          <ImageDisplaySection generationProgress={generationProgress} />
        </ContentSection>

        {/* Suggestions Section */}
        <ContentSection maxWidth="4xl" spacing="base" animation={true}>
          <SuggestionsListSection
            selectedSuggestion={selectedSuggestion}
            isGenerating={isGenerating}
            onToggleSuggestion={handleToggleSuggestion}
            onAddCustomSuggestion={handleAddCustomSuggestion}
            onEditCustomSuggestion={handleEditCustomSuggestion}
            onDeleteCustomSuggestion={handleDeleteCustomSuggestion}
          />
        </ContentSection>

        {/* Action Bar */}
        <ActionBar
          selectedItemId={selectedSuggestion}
          selectedItemTitle={selectedSuggestionTitle}
          isSubmitting={isSubmitting}
          isGenerating={isGenerating}
          onCancel={handleCancelSelection}
          onApply={handleApplySuggestion}
          mode="suggestions"
        />

        {/* Error Display */}
        <ErrorDisplay generationError={generationError} />
      </PageLayout>
    </>
  );
}
