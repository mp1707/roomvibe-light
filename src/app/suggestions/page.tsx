"use client";

import { motion } from "motion/react";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import LeftColumn from "./components/LeftColumn";
import RightColumn from "./components/RightColumn";
import AnimatedButton from "../components/AnimatedButton";
import { ContinueIcon } from "../components/Icons";
import { buttonVariants, useMotionPreference } from "@/utils/animations";
import { useAppState } from "@/utils/store";
import toast from "react-hot-toast";

export default function SuggestionsPage() {
  const [selectedSuggestions, setSelectedSuggestions] = useState<
    Record<string, boolean>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const reducedMotion = useMotionPreference();

  const {
    suggestions,
    hostedImageUrl,
    isGenerating,
    setPrediction,
    setIsGenerating,
    setGenerationError,
  } = useAppState();

  const handleToggleSuggestion = useCallback((suggestionId: string) => {
    setSelectedSuggestions((prev) => ({
      ...prev,
      [suggestionId]: !prev[suggestionId],
    }));
  }, []);

  const selectedCount =
    Object.values(selectedSuggestions).filter(Boolean).length;
  const isActionActive = selectedCount > 0;

  const handleContinue = useCallback(async () => {
    if (!isActionActive || isSubmitting || isGenerating) {
      return;
    }

    setIsSubmitting(true);
    setIsGenerating(true);
    setGenerationError(null);

    const selected = suggestions.filter((s) => selectedSuggestions[s.id]);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: hostedImageUrl,
          suggestions: selected,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Die Bildgenerierung ist fehlgeschlagen."
        );
      }

      const prediction = await response.json();
      setPrediction(prediction);
      toast.success("Dein neues Bild wird generiert...");
      router.push("/result");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ein unbekannter Fehler ist aufgetreten.";
      console.error("Fehler bei der Bildgenerierung:", errorMessage);
      setGenerationError(errorMessage);
      toast.error(errorMessage);
      setIsGenerating(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isActionActive,
    isSubmitting,
    isGenerating,
    hostedImageUrl,
    suggestions,
    selectedSuggestions,
    router,
    setPrediction,
    setIsGenerating,
    setGenerationError,
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.2, staggerChildren: 0.15 },
    },
  };

  return (
    <div className="flex-1 w-full flex flex-col relative min-h-screen pb-24 sm:pb-28 lg:pb-0">
      {/* Main content area with sticky columns */}
      <motion.div
        className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column - Sticky only on large screens */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-16 lg:h-[calc(100vh-8rem)] lg:self-start">
          <LeftColumn />
        </div>

        {/* Right Column - Scrollable suggestions with conditionally sticky header */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-0 overflow-visible">
          <RightColumn
            selectedSuggestions={selectedSuggestions}
            onToggleSuggestion={handleToggleSuggestion}
          />
        </div>
      </motion.div>

      {/* Redesigned Summary Section - Fixed at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 bg-base-100/95 backdrop-blur-sm border-t border-base-300/50 shadow-2xl z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between">
            {/* Left: Selection Summary */}
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-base-content/60">
                Ausgewählt:
              </div>
              <motion.div
                key={selectedCount}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 25,
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                  selectedCount > 0
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content/50"
                }`}
              >
                {selectedCount}{" "}
                {selectedCount === 1 ? "Vorschlag" : "Vorschläge"}
              </motion.div>

              {selectedCount > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => setSelectedSuggestions({})}
                  className="text-sm text-base-content/50 hover:text-base-content/70 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-3 py-1.5"
                >
                  Alle abwählen
                </motion.button>
              )}
            </div>

            {/* Right: Continue Button */}
            <motion.button
              onClick={handleContinue}
              disabled={!isActionActive || isSubmitting || isGenerating}
              variants={reducedMotion ? {} : buttonVariants}
              whileHover={
                isActionActive &&
                !isSubmitting &&
                !isGenerating &&
                !reducedMotion
                  ? "hover"
                  : undefined
              }
              whileTap={
                isActionActive &&
                !isSubmitting &&
                !isGenerating &&
                !reducedMotion
                  ? "tap"
                  : undefined
              }
              className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-semibold text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isActionActive
                  ? "bg-primary hover:bg-primary-focus text-primary-content shadow-lg hover:shadow-xl focus:ring-primary transform hover:scale-105 active:scale-95"
                  : "bg-base-200 text-base-content/40 cursor-not-allowed"
              } ${isSubmitting || isGenerating ? "cursor-wait" : ""}`}
            >
              <span>
                {isSubmitting || isGenerating
                  ? "Wird vorbereitet..."
                  : isActionActive
                  ? `${selectedCount} ${
                      selectedCount === 1 ? "Vorschlag" : "Vorschläge"
                    } anwenden`
                  : "Vorschlag auswählen"}
              </span>
              {isActionActive && !isSubmitting && !isGenerating && (
                <ContinueIcon />
              )}
            </motion.button>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Selection Summary */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-base-content/60">
                  Ausgewählt:
                </div>
                <motion.div
                  key={selectedCount}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 25,
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedCount > 0
                      ? "bg-primary text-primary-content"
                      : "bg-base-200 text-base-content/50"
                  }`}
                >
                  {selectedCount}{" "}
                  {selectedCount === 1 ? "Vorschlag" : "Vorschläge"}
                </motion.div>
              </div>

              {selectedCount > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => setSelectedSuggestions({})}
                  className="text-xs text-base-content/50 hover:text-base-content/70 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
                >
                  Alle abwählen
                </motion.button>
              )}
            </div>

            {/* Continue Button - Full width on mobile */}
            <motion.button
              onClick={handleContinue}
              disabled={!isActionActive || isSubmitting || isGenerating}
              variants={reducedMotion ? {} : buttonVariants}
              whileHover={
                isActionActive &&
                !isSubmitting &&
                !isGenerating &&
                !reducedMotion
                  ? "hover"
                  : undefined
              }
              whileTap={
                isActionActive &&
                !isSubmitting &&
                !isGenerating &&
                !reducedMotion
                  ? "tap"
                  : undefined
              }
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isActionActive
                  ? "bg-primary hover:bg-primary-focus text-primary-content shadow-lg hover:shadow-xl focus:ring-primary transform hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-base-200 text-base-content/40 cursor-not-allowed"
              } ${isSubmitting || isGenerating ? "cursor-wait" : ""}`}
            >
              <span>
                {isSubmitting || isGenerating
                  ? "Wird vorbereitet..."
                  : isActionActive
                  ? `${selectedCount} ${
                      selectedCount === 1 ? "Vorschlag" : "Vorschläge"
                    } anwenden`
                  : "Wählen Sie mindestens einen Vorschlag aus"}
              </span>
              {isActionActive && !isSubmitting && !isGenerating && (
                <ContinueIcon />
              )}
            </motion.button>
          </div>

          {/* Hint - Only show on mobile */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-base-content/40 mt-3 lg:hidden"
          >
            Sie können Ihre Auswahl später noch anpassen
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
