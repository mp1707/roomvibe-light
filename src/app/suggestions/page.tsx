"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SuggestionCard from "../components/SuggestionCard";
import CustomSuggestionCard from "../components/CustomSuggestionCard";
import AddSuggestionCard from "../components/AddSuggestionCard";
import AILoadingScreen from "../components/AILoadingScreen";
import DiffSlider from "../components/DiffSlider";
import { BackIcon } from "../components/Icons";
import {
  buttonVariants,
  useMotionPreference,
  staggerContainer,
  staggerItem,
} from "@/utils/animations";
import { useAppState } from "@/utils/store";
import { useImageModalStore } from "@/utils/useImageModalStore";
import {
  getGenerateImageEndpoint,
  getGeneratePromptEndpoint,
  getPredictionEndpoint,
} from "@/utils/apiHelpers";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const MAX_POLLING_TIME = 10 * 60 * 1000;

export default function SuggestionsPage() {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const router = useRouter();
  const reducedMotion = useMotionPreference();
  const { openModal } = useImageModalStore();

  const {
    localImageUrl,
    hostedImageUrl,
    isGenerating,
    setPrediction,
    setIsGenerating,
    setGenerationError,
    generationError,
    suggestions,
    customSuggestions,
    addCustomSuggestion,
    editCustomSuggestion,
    removeCustomSuggestion,
    currentGeneratedImage,
    appliedSuggestions,
    addAppliedSuggestion,
  } = useAppState();

  const allSuggestions = [...suggestions, ...customSuggestions];

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

  const checkStatus = useCallback(
    async (predictionId: string) => {
      if (!predictionId) return;

      const startTime = Date.now();

      while (Date.now() - startTime < MAX_POLLING_TIME) {
        try {
          const endpointUrl = getPredictionEndpoint(predictionId);
          console.log("📊 Checking prediction status:", {
            predictionId,
            endpointUrl,
          });

          const response = await fetch(endpointUrl);
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Status check failed:", {
              status: response.status,
              statusText: response.statusText,
              body: errorText,
            });
            throw new Error(
              `Status check failed: ${response.status} ${response.statusText}`
            );
          }

          const prediction = await response.json();
          console.log("📊 Prediction status:", prediction.status);

          // Update progress based on status
          if (prediction.status === "starting") {
            setGenerationProgress(60);
          } else if (prediction.status === "processing") {
            setGenerationProgress(80);
          } else if (prediction.status === "succeeded") {
            setGenerationProgress(100);
            setPrediction(prediction);

            // Image will be automatically set by setPrediction in store

            setIsGenerating(false);
            return;
          } else if (
            prediction.status === "failed" ||
            prediction.status === "canceled"
          ) {
            throw new Error(prediction.error || "Generation failed");
          }

          await sleep(1000);
        } catch (error) {
          console.error("Error checking status:", error);
          setGenerationError(
            error instanceof Error ? error.message : "Status check failed"
          );
          setIsGenerating(false);
          return;
        }
      }

      setGenerationError("Generation timed out");
      setIsGenerating(false);
    },
    [setPrediction, setIsGenerating, setGenerationError]
  );

  const handleApplySuggestion = useCallback(async () => {
    if (!selectedSuggestion || isSubmitting || isGenerating) {
      return;
    }

    const suggestionToApply = allSuggestions.find(
      (s) => s.id === selectedSuggestion
    );
    if (!suggestionToApply) return;

    setIsSubmitting(true);
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationProgress(0);

    try {
      // Step 1: Generate optimized prompt using OpenAI
      console.log("=== STEP 1: GENERATE PROMPT ===");
      setGenerationProgress(10);

      const baseImageUrl = currentGeneratedImage || hostedImageUrl;

      // Validate that we have a base image URL
      if (!baseImageUrl) {
        throw new Error(
          "Kein Basisbild verfügbar. Bitte laden Sie zunächst ein Bild hoch."
        );
      }

      console.log("🖼️ Image generation using:", {
        baseImageUrl: baseImageUrl.substring(0, 50) + "...",
        usingGeneratedImage: !!currentGeneratedImage,
        suggestionTitle: suggestionToApply.title,
      });

      const promptResponse = await fetch(getGeneratePromptEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: baseImageUrl,
          suggestions: [suggestionToApply],
        }),
      });

      if (!promptResponse.ok) {
        const errorData = await promptResponse.json();
        throw new Error(
          errorData.error || "Die Prompt-Generierung ist fehlgeschlagen."
        );
      }

      const { prompt } = await promptResponse.json();
      setGenerationProgress(30);

      // Step 2: Generate image using the optimized prompt
      console.log("=== STEP 2: GENERATE IMAGE ===");

      const imageResponse = await fetch(getGenerateImageEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: baseImageUrl,
          prompt: prompt,
        }),
      });

      if (!imageResponse.ok) {
        const errorData = await imageResponse.json();
        throw new Error(
          errorData.error || "Die Bildgenerierung ist fehlgeschlagen."
        );
      }

      const predictionData = await imageResponse.json();
      console.log("📷 Image generation response:", {
        id: predictionData.id,
        status: predictionData.status,
        hasOutput: !!predictionData.output,
      });

      setGenerationProgress(50);
      setPrediction(predictionData);

      // Start polling for status
      if (predictionData.id) {
        console.log("🔄 Starting status polling for:", predictionData.id);
        await checkStatus(predictionData.id);
      } else {
        throw new Error("Keine Prediction ID erhalten von der Bildgenerierung");
      }

      // Mark suggestion as applied and clear selection
      addAppliedSuggestion(selectedSuggestion);
      setSelectedSuggestion(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ein unbekannter Fehler ist aufgetreten.";
      console.error("Fehler bei der Bildgenerierung:", errorMessage);
      setGenerationError(errorMessage);
      setIsGenerating(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedSuggestion,
    isSubmitting,
    isGenerating,
    allSuggestions,
    currentGeneratedImage,
    hostedImageUrl,
    setPrediction,
    setIsGenerating,
    setGenerationError,
    checkStatus,
    addAppliedSuggestion,
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

  const handleImageClick = useCallback(
    (imageUrl: string) => {
      openModal(imageUrl);
    },
    [openModal]
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.1, staggerChildren: 0.1 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  // Check if we have any suggestions
  if (!localImageUrl) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      >
        <h2 className="text-2xl font-semibold text-base-content/60 mb-4">
          Kein Bild gefunden
        </h2>
        <p className="text-base-content/50 mb-6">
          Bitte laden Sie zunächst ein Bild hoch.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-primary text-primary-content rounded-xl font-semibold hover:bg-primary-focus transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Bild hochladen
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex-1 w-full flex flex-col gap-6 sm:gap-8 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Image Section */}
      <motion.div variants={imageVariants} className="w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <AILoadingScreen
                progress={generationProgress}
                steps={[
                  "Plane die gewünschten Anpassungen...",
                  "Bereite Bildgenerierung vor...",
                  "Generiere dein neues Bild...",
                ]}
                title="Dein Vorschlag wird angewendet"
                subtitle="Wir arbeiten an deiner personalisierten Raumtransformation..."
                hint="Die Generierung dauert in der Regel 30-60 Sekunden"
              />
            </motion.div>
          ) : currentGeneratedImage ? (
            <motion.div
              key="diff-slider"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
                  Ihr Raum, Schritt für Schritt transformiert
                </h2>
                <p className="text-base-content/60">
                  Bewegen Sie den Regler, um die Veränderungen zu sehen
                </p>
              </div>

              <DiffSlider
                beforeImageUrl={localImageUrl}
                afterImageUrl={currentGeneratedImage!}
                beforeLabel="Original"
                afterLabel="Aktuell"
                onBeforeImageClick={() => handleImageClick(localImageUrl)}
                onAfterImageClick={() =>
                  handleImageClick(currentGeneratedImage!)
                }
                className="shadow-xl rounded-2xl"
                aspectRatio="aspect-[4/3]"
                showInstructionText={true}
              />
            </motion.div>
          ) : (
            <motion.div
              key="original-image"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-4">
                Ihr Originalbild
              </h2>
              <button
                type="button"
                className="cursor-pointer relative rounded-2xl shadow-xl overflow-hidden w-full max-w-2xl mx-auto"
                onClick={() => handleImageClick(localImageUrl)}
              >
                <Image
                  src={localImageUrl}
                  className="w-full h-auto object-cover aspect-[4/3] rounded-2xl"
                  width={800}
                  height={600}
                  alt="Original uploaded image"
                  priority
                />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Suggestions Section */}
      <motion.div
        variants={staggerItem}
        className="w-full max-w-4xl mx-auto px-4 sm:px-6"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
            Design-Vorschläge
          </h3>
          <p className="text-base-content/60 max-w-2xl mx-auto">
            Wählen Sie einen Vorschlag aus und wenden Sie ihn an. Sie können
            Schritt für Schritt weitere Verbesserungen hinzufügen.
          </p>
        </div>

        {allSuggestions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-base-content/50 mb-6">
              Keine Vorschläge verfügbar. Fügen Sie eigene Ideen hinzu!
            </p>
            <AddSuggestionCard onAdd={handleAddCustomSuggestion} />
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            className="space-y-5 sm:space-y-4 pt-3"
          >
            {/* AI Suggestions */}
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                variants={staggerItem}
                className={`relative ${
                  appliedSuggestions.has(suggestion.id) ? "opacity-60" : ""
                }`}
              >
                <SuggestionCard
                  title={suggestion.title}
                  suggestion={suggestion.suggestion}
                  explanation={suggestion.explanation}
                  selected={selectedSuggestion === suggestion.id}
                  onToggle={() => handleToggleSuggestion(suggestion.id)}
                  isApplied={appliedSuggestions.has(suggestion.id)}
                  isGenerating={isGenerating}
                  delay={index * 0.1}
                />
              </motion.div>
            ))}

            {/* Custom Suggestions */}
            {customSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                variants={staggerItem}
                className={`relative ${
                  appliedSuggestions.has(suggestion.id) ? "opacity-60" : ""
                }`}
              >
                <CustomSuggestionCard
                  id={suggestion.id}
                  title={suggestion.title}
                  suggestion={suggestion.suggestion}
                  selected={selectedSuggestion === suggestion.id}
                  onToggle={() => handleToggleSuggestion(suggestion.id)}
                  onEdit={handleEditCustomSuggestion}
                  onDelete={handleDeleteCustomSuggestion}
                  isApplied={appliedSuggestions.has(suggestion.id)}
                  isGenerating={isGenerating}
                  delay={(suggestions.length + index) * 0.1}
                />
              </motion.div>
            ))}

            {/* Add Custom Suggestion Card */}
            <motion.div variants={staggerItem}>
              <AddSuggestionCard onAdd={handleAddCustomSuggestion} />
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Action Section */}
      {selectedSuggestion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-base-100/95 backdrop-blur-sm border-t border-base-300/50 shadow-2xl z-50"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-sm text-base-content/60">
                  Vorschlag ausgewählt:
                </p>
                <p className="font-semibold text-base-content">
                  {
                    allSuggestions.find((s) => s.id === selectedSuggestion)
                      ?.title
                  }
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setSelectedSuggestion(null)}
                  variants={reducedMotion ? {} : buttonVariants}
                  whileHover={reducedMotion ? {} : "hover"}
                  whileTap={reducedMotion ? {} : "tap"}
                  disabled={isGenerating}
                  className={`px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl ${
                    isGenerating
                      ? "text-base-content/30 cursor-not-allowed"
                      : "text-base-content/60 hover:text-base-content"
                  }`}
                >
                  Abbrechen
                </motion.button>
                <motion.button
                  onClick={handleApplySuggestion}
                  disabled={isSubmitting || isGenerating}
                  variants={reducedMotion ? {} : buttonVariants}
                  whileHover={
                    !isSubmitting && !isGenerating && !reducedMotion
                      ? "hover"
                      : undefined
                  }
                  whileTap={
                    !isSubmitting && !isGenerating && !reducedMotion
                      ? "tap"
                      : undefined
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-focus text-primary-content font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin" />
                      Wird angewendet...
                    </>
                  ) : (
                    "Vorschlag anwenden"
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <motion.div variants={staggerItem} className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base-content/60 hover:text-base-content transition-colors group"
        >
          <BackIcon />
          <span className="font-medium">Anderes Bild hochladen</span>
        </Link>
      </motion.div>

      {/* Error Display */}
      {generationError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-error text-error-content px-4 py-3 rounded-xl shadow-lg max-w-sm"
        >
          <p className="text-sm font-medium">Fehler:</p>
          <p className="text-sm">{generationError}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
