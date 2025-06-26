import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useAppState } from "@/utils/store";
import { useCreditsStore } from "@/utils/creditsStore";
import { CREDIT_COSTS } from "@/types/credits";
import {
  getGenerateImageEndpoint,
  getGeneratePromptEndpoint,
  getPredictionEndpoint,
} from "@/utils/apiHelpers";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const MAX_POLLING_TIME = 10 * 60 * 1000;

interface UseImageGenerationReturn {
  isSubmitting: boolean;
  generationProgress: number;
  generateImage: (suggestionId: string) => Promise<void>;
}

export const useImageGeneration = (): UseImageGenerationReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const {
    hostedImageUrl,
    setPrediction,
    setIsGenerating,
    setGenerationError,
    suggestions,
    customSuggestions,
    currentGeneratedImage,
    addAppliedSuggestion,
  } = useAppState();

  const { deductCredits } = useCreditsStore();

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

  const generateImage = useCallback(
    async (suggestionId: string) => {
      const allSuggestions = [...suggestions, ...customSuggestions];
      const suggestionToApply = allSuggestions.find(
        (s) => s.id === suggestionId
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
          throw new Error(
            "Keine Prediction ID erhalten von der Bildgenerierung"
          );
        }

        // Deduct credits for applying suggestion
        try {
          await deductCredits(
            CREDIT_COSTS.APPLY_SUGGESTION,
            `Vorschlag angewendet: ${suggestionToApply.title}`,
            `apply-suggestion-${suggestionId}-${Date.now()}`
          );
          toast.success(
            `${CREDIT_COSTS.APPLY_SUGGESTION} Credits für Vorschlag abgezogen`
          );
        } catch (error) {
          console.error("Credits deduction failed:", error);
          toast.error(
            "Fehler beim Abziehen der Credits, aber Vorschlag wurde angewendet"
          );
        }

        // Mark suggestion as applied
        addAppliedSuggestion(suggestionId);
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
    },
    [
      suggestions,
      customSuggestions,
      currentGeneratedImage,
      hostedImageUrl,
      setPrediction,
      setIsGenerating,
      setGenerationError,
      checkStatus,
      addAppliedSuggestion,
      deductCredits,
    ]
  );

  return {
    isSubmitting,
    generationProgress,
    generateImage,
  };
};
