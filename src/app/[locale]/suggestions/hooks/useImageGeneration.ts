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
import { uploadImageFromUrl, getCurrentUserId } from "@/utils/imageUploadUtils";

// Constants
const POLLING_INTERVAL = 1000;
const MAX_POLLING_TIME = 10 * 60 * 1000;

// Progress steps for better tracking
const PROGRESS_STEPS = {
  INIT: 0,
  PROMPT_START: 10,
  PROMPT_COMPLETE: 30,
  IMAGE_START: 50,
  IMAGE_PROCESSING: 60,
  IMAGE_PROCESSING_ADVANCED: 80,
  COMPLETE: 100,
} as const;

// Types
interface PredictionStatus {
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  error?: string;
  id?: string;
  output?: unknown;
}

interface UseImageGenerationReturn {
  isSubmitting: boolean;
  generationProgress: number;
  generateImage: (suggestionId: string) => Promise<void>;
}

// Utility functions
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const createGenerationError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "Ein unbekannter Fehler ist aufgetreten.";
};

const validateBaseImage = (
  currentImage: string | null,
  hostedImage: string | null
): string => {
  const baseImageUrl = currentImage || hostedImage;

  if (!baseImageUrl) {
    throw new Error(
      "Kein Basisbild verfügbar. Bitte laden Sie zunächst ein Bild hoch."
    );
  }

  return baseImageUrl;
};

const findSuggestionById = (
  suggestionId: string,
  suggestions: any[],
  customSuggestions: any[]
) => {
  const allSuggestions = [...suggestions, ...customSuggestions];
  const suggestion = allSuggestions.find((s) => s.id === suggestionId);

  if (!suggestion) {
    throw new Error(`Vorschlag mit ID ${suggestionId} nicht gefunden.`);
  }

  return suggestion;
};

const logImageGenerationStart = (
  baseImageUrl: string,
  currentGeneratedImage: string | null,
  suggestionTitle: string
) => {
  console.log("🖼️ Image generation using:", {
    baseImageUrl: baseImageUrl.substring(0, 50) + "...",
    usingGeneratedImage: !!currentGeneratedImage,
    suggestionTitle,
  });
};

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

  const handleApiResponse = async (
    response: Response,
    errorMessage: string
  ) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorMessage);
    }
    return response.json();
  };

  const generateOptimizedPrompt = useCallback(
    async (baseImageUrl: string, suggestion: any): Promise<string> => {
      console.log("=== STEP 1: GENERATE PROMPT ===");
      setGenerationProgress(PROGRESS_STEPS.PROMPT_START);

      const response = await fetch(getGeneratePromptEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: baseImageUrl,
          suggestion: suggestion,
        }),
      });

      const data = await handleApiResponse(
        response,
        "Die Prompt-Generierung ist fehlgeschlagen."
      );

      setGenerationProgress(PROGRESS_STEPS.PROMPT_COMPLETE);
      return data.prompt;
    },
    []
  );

  const generateImageFromPrompt = useCallback(
    async (baseImageUrl: string, prompt: string): Promise<any> => {
      console.log("=== STEP 2: GENERATE IMAGE ===");

      const response = await fetch(getGenerateImageEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: baseImageUrl,
          prompt,
        }),
      });

      const predictionData = await handleApiResponse(
        response,
        "Die Bildgenerierung ist fehlgeschlagen."
      );

      console.log("📷 Image generation response:", {
        id: predictionData.id,
        status: predictionData.status,
        hasOutput: !!predictionData.output,
      });

      if (!predictionData.id) {
        throw new Error("Keine Prediction ID erhalten von der Bildgenerierung");
      }

      setGenerationProgress(PROGRESS_STEPS.IMAGE_START);
      setPrediction(predictionData);

      return predictionData;
    },
    [setPrediction]
  );

  // Upload generated image to Supabase storage
  const uploadGeneratedImageToStorage = useCallback(
    async (prediction: PredictionStatus): Promise<void> => {
      try {
        // Get the current user ID
        const userId = await getCurrentUserId();
        if (!userId) {
          console.warn("No user ID available for image upload");
          return;
        }

        // Extract image URL from prediction output
        let generatedImageUrl: string | null = null;
        if (prediction.output) {
          if (Array.isArray(prediction.output)) {
            generatedImageUrl = prediction.output[0] || null;
          } else if (typeof prediction.output === "string") {
            generatedImageUrl = prediction.output;
          }
        }

        if (!generatedImageUrl) {
          console.warn("No generated image URL found in prediction output");
          return;
        }

        console.log("🔄 Uploading generated image to Supabase storage...");

        // Upload the generated image to userid/generated folder
        const uploadedUrl = await uploadImageFromUrl(
          generatedImageUrl,
          userId,
          "generated",
          `roomvibe-generated-${Date.now()}.jpg`
        );

        console.log("✅ Generated image uploaded to Supabase:", uploadedUrl);

        // Optionally update the store with the new Supabase URL
        // The prediction already contains the original URL, but we could track the Supabase URL too
      } catch (error) {
        console.error("Failed to upload generated image to storage:", error);
        // Don't throw here as this shouldn't break the generation flow
        // The original image URL from the prediction service is still valid
      }
    },
    []
  );

  // Extracted status checking logic
  const checkPredictionStatus = useCallback(
    async (predictionId: string): Promise<void> => {
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

          const prediction: PredictionStatus = await response.json();
          console.log("📊 Prediction status:", prediction.status);

          // Handle different status states
          if (prediction.status === "starting") {
            setGenerationProgress(PROGRESS_STEPS.IMAGE_PROCESSING);
          } else if (prediction.status === "processing") {
            setGenerationProgress(PROGRESS_STEPS.IMAGE_PROCESSING_ADVANCED);
          } else if (prediction.status === "succeeded") {
            setGenerationProgress(PROGRESS_STEPS.COMPLETE);
            setPrediction(prediction);
            setIsGenerating(false);

            // Upload generated image to Supabase storage
            await uploadGeneratedImageToStorage(prediction);

            return;
          } else if (
            prediction.status === "failed" ||
            prediction.status === "canceled"
          ) {
            throw new Error(prediction.error || "Generation failed");
          }

          await sleep(POLLING_INTERVAL);
        } catch (error) {
          console.error("Error checking status:", error);
          const errorMessage = createGenerationError(error);
          setGenerationError(errorMessage);
          setIsGenerating(false);
          throw error;
        }
      }

      const timeoutError = "Generation timed out";
      setGenerationError(timeoutError);
      setIsGenerating(false);
      throw new Error(timeoutError);
    },
    [
      setPrediction,
      setIsGenerating,
      setGenerationError,
      uploadGeneratedImageToStorage,
    ]
  );

  // Extracted credits deduction logic
  const deductCreditsForSuggestion = useCallback(
    async (suggestionId: string, suggestionTitle: string): Promise<void> => {
      try {
        await deductCredits(
          CREDIT_COSTS.APPLY_SUGGESTION,
          `Vorschlag angewendet: ${suggestionTitle}`,
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
    },
    [deductCredits]
  );

  // Main generation function - now much cleaner and focused
  const generateImage = useCallback(
    async (suggestionId: string): Promise<void> => {
      // Early validation
      const suggestion = findSuggestionById(
        suggestionId,
        suggestions,
        customSuggestions
      );
      const baseImageUrl = validateBaseImage(
        currentGeneratedImage,
        hostedImageUrl
      );

      // Initialize generation state
      setIsSubmitting(true);
      setIsGenerating(true);
      setGenerationError(null);
      setGenerationProgress(PROGRESS_STEPS.INIT);

      try {
        logImageGenerationStart(
          baseImageUrl,
          currentGeneratedImage,
          suggestion.title
        );

        // Step 1: Generate optimized prompt
        const prompt = await generateOptimizedPrompt(baseImageUrl, suggestion);

        // Step 2: Generate image
        const predictionData = await generateImageFromPrompt(
          baseImageUrl,
          prompt
        );

        // Step 3: Poll for completion
        await checkPredictionStatus(predictionData.id);

        // Step 4: Handle credits and mark as applied
        await deductCreditsForSuggestion(suggestionId, suggestion.title);
        addAppliedSuggestion(suggestionId);
      } catch (error) {
        const errorMessage = createGenerationError(error);
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
      setIsGenerating,
      setGenerationError,
      addAppliedSuggestion,
      generateOptimizedPrompt,
      generateImageFromPrompt,
      checkPredictionStatus,
      deductCreditsForSuggestion,
    ]
  );

  return {
    isSubmitting,
    generationProgress,
    generateImage,
  };
};
