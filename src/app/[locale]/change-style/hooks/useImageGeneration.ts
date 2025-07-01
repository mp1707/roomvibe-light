import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useAppState } from "@/utils/store";
import { useCreditsStore } from "@/utils/creditsStore";
import { CREDIT_COSTS } from "@/types/credits";
import { getStyleById } from "@/utils/interiorStyles";
import {
  getGenerateImageEndpoint,
  getPredictionEndpoint,
} from "@/utils/apiHelpers";
import { uploadImageFromUrl, getCurrentUserId } from "@/utils/imageUploadUtils";

// Constants
const POLLING_INTERVAL = 1000;
const MAX_POLLING_TIME = 10 * 60 * 1000;

// Progress steps for better tracking
const PROGRESS_STEPS = {
  INIT: 0,
  STYLE_START: 10,
  IMAGE_START: 30,
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

interface UseStyleGenerationReturn {
  isSubmitting: boolean;
  generationProgress: number;
  generateStyleImage: (styleId: string) => Promise<void>;
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
  // Always prefer the hosted image URL if available
  if (hostedImage) {
    return hostedImage;
  }

  // If we only have a local image URL, throw an error
  if (currentImage?.startsWith("blob:")) {
    throw new Error(
      "Das Bild wurde noch nicht auf den Server hochgeladen. Bitte warten Sie einen Moment."
    );
  }

  if (!currentImage && !hostedImage) {
    throw new Error(
      "Kein Basisbild verfügbar. Bitte laden Sie zunächst ein Bild hoch."
    );
  }

  return currentImage!;
};

const findStyleById = (styleId: string) => {
  const style = getStyleById(styleId);
  if (!style) {
    throw new Error(`Stil mit ID ${styleId} nicht gefunden.`);
  }
  return style;
};

const logStyleGenerationStart = (baseImageUrl: string, styleName: string) => {
  console.log("🎨 Style generation using:", {
    baseImageUrl: baseImageUrl.substring(0, 50) + "...",
    styleName,
  });
};

export const useImageGeneration = (): UseStyleGenerationReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const {
    hostedImageUrl,
    localImageUrl,
    setPrediction,
    setIsGenerating,
    setGenerationError,
    setStyleGenerationProgress,
    appliedStyles,
    addAppliedStyle,
    setLastAppliedStyleId,
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

  const generateImageFromStyle = useCallback(
    async (baseImageUrl: string, stylePrompt: string): Promise<any> => {
      console.log("=== STYLE GENERATION ===", {
        baseImageUrl,
        stylePrompt,
      });

      if (
        !baseImageUrl.startsWith("http") &&
        !baseImageUrl.startsWith("https")
      ) {
        throw new Error("Invalid image URL. Must be a hosted URL.");
      }

      const response = await fetch(getGenerateImageEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: baseImageUrl,
          prompt: stylePrompt,
        }),
      });

      const predictionData = await handleApiResponse(
        response,
        "Die Stil-Transformation ist fehlgeschlagen."
      );

      console.log("🎨 Style generation response:", {
        id: predictionData.id,
        status: predictionData.status,
        hasOutput: !!predictionData.output,
      });

      if (!predictionData.id) {
        throw new Error(
          "Keine Prediction ID erhalten von der Stil-Generierung"
        );
      }

      setPrediction(predictionData);
      return predictionData;
    },
    [setPrediction]
  );

  // Upload generated image to Supabase storage
  const uploadGeneratedImageToStorage = useCallback(
    async (prediction: PredictionStatus): Promise<string | null> => {
      try {
        // Get the current user ID
        const userId = await getCurrentUserId();
        if (!userId) {
          console.warn("No user ID available for image upload");
          return null;
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
          return null;
        }

        console.log(
          "🔄 Uploading generated style image to Supabase storage..."
        );

        // Upload the generated image to userid/generated folder
        const uploadedUrl = await uploadImageFromUrl(
          generatedImageUrl,
          userId,
          "generated",
          `roomvibe-style-${Date.now()}.jpg`
        );

        console.log(
          "✅ Generated style image uploaded to Supabase:",
          uploadedUrl
        );
        return uploadedUrl;
      } catch (error) {
        console.error("Failed to upload generated image to storage:", error);
        return null;
      }
    },
    []
  );

  // Extracted status checking logic
  const checkPredictionStatus = useCallback(
    async (predictionId: string): Promise<PredictionStatus> => {
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
            setStyleGenerationProgress(PROGRESS_STEPS.IMAGE_PROCESSING);
          } else if (prediction.status === "processing") {
            setGenerationProgress(PROGRESS_STEPS.IMAGE_PROCESSING_ADVANCED);
            setStyleGenerationProgress(
              PROGRESS_STEPS.IMAGE_PROCESSING_ADVANCED
            );
          } else if (prediction.status === "succeeded") {
            setGenerationProgress(PROGRESS_STEPS.COMPLETE);
            setStyleGenerationProgress(PROGRESS_STEPS.COMPLETE);
            setPrediction(prediction);
            setIsGenerating(false);

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
              throw new Error(
                "No generated image URL found in prediction output"
              );
            }

            // Upload generated image to Supabase storage
            const uploadedUrl = await uploadGeneratedImageToStorage(prediction);

            // Use the uploaded URL if available, otherwise use the original generated URL
            const finalImageUrl = uploadedUrl || generatedImageUrl;

            // Store the image URL in the appliedStyles Map
            if (selectedStyle) {
              addAppliedStyle(selectedStyle, finalImageUrl);
            }

            return prediction;
          } else if (
            prediction.status === "failed" ||
            prediction.status === "canceled"
          ) {
            throw new Error(prediction.error || "Style generation failed");
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

      const timeoutError = "Style generation timed out";
      setGenerationError(timeoutError);
      setIsGenerating(false);
      throw new Error(timeoutError);
    },
    [
      setPrediction,
      setIsGenerating,
      setGenerationError,
      setStyleGenerationProgress,
      uploadGeneratedImageToStorage,
      selectedStyle,
      addAppliedStyle,
    ]
  );

  // Extracted credits deduction logic
  const deductCreditsForStyle = useCallback(
    async (styleId: string, styleName: string): Promise<void> => {
      try {
        await deductCredits(
          CREDIT_COSTS.APPLY_SUGGESTION, // Using same cost as suggestions
          `Stil angewendet: ${styleName}`,
          `apply-style-${styleId}-${Date.now()}`
        );
        toast.success(
          `${CREDIT_COSTS.APPLY_SUGGESTION} Credits für Stil abgezogen`
        );
      } catch (error) {
        console.error("Credits deduction failed:", error);
        toast.error(
          "Fehler beim Abziehen der Credits, aber Stil wurde angewendet"
        );
      }
    },
    [deductCredits]
  );

  // Main generation function for styles
  const generateStyleImage = useCallback(
    async (styleId: string): Promise<void> => {
      // Store the style ID for use in checkPredictionStatus
      setSelectedStyle(styleId);

      // Initialize generation state
      setIsSubmitting(true);
      setIsGenerating(true);
      setGenerationError(null);
      setGenerationProgress(PROGRESS_STEPS.INIT);

      try {
        const style = getStyleById(styleId);
        if (!style) {
          throw new Error("Invalid style ID");
        }

        // Ensure we have a hosted image URL
        if (!hostedImageUrl) {
          throw new Error("Please wait for the image to finish uploading");
        }

        // Always use the hosted URL for API calls
        const baseImageUrl = hostedImageUrl;

        console.log("Starting style generation with:", {
          styleId,
          styleName: style.name,
          baseImageUrl,
        });

        // Generate image with style
        const predictionData = await generateImageFromStyle(
          baseImageUrl,
          style.prompt
        );

        // Poll for completion
        await checkPredictionStatus(predictionData.id);

        // Set the last applied style ID
        setLastAppliedStyleId(styleId);

        // Deduct credits
        await deductCreditsForStyle(styleId, style.name);
      } catch (error) {
        const errorMessage = createGenerationError(error);
        console.error("Style generation failed:", errorMessage);
        setGenerationError(errorMessage);
        setIsGenerating(false);
      } finally {
        setIsSubmitting(false);
        setSelectedStyle(null); // Clear the selected style
      }
    },
    [
      hostedImageUrl,
      generateImageFromStyle,
      checkPredictionStatus,
      setIsGenerating,
      setGenerationError,
      deductCreditsForStyle,
    ]
  );

  return {
    isSubmitting,
    generationProgress,
    generateStyleImage,
  };
};
