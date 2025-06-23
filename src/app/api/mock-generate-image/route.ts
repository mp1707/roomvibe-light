import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Input validation schema (same as real API)
const generateImageSchema = z.object({
  imageUrl: z
    .string()
    .min(1, "Image URL is required")
    .refine((url) => {
      try {
        // Check if it's a data URL (base64)
        if (url.startsWith("data:image/")) {
          return true;
        }
        // Check if it's a valid HTTP/HTTPS URL
        const urlObj = new URL(url);
        return urlObj.protocol === "http:" || urlObj.protocol === "https:";
      } catch {
        return false;
      }
    }, "Must be a valid image URL or data URL"),
  suggestions: z
    .array(
      z.object({
        id: z.string().min(1, "Suggestion ID cannot be empty"),
        title: z.string().min(1, "Suggestion title cannot be empty"),
        suggestion: z.string().min(1, "Suggestion text cannot be empty"),
        explanation: z
          .string()
          .min(1, "Suggestion explanation cannot be empty"),
        category: z.string().min(1, "Suggestion category cannot be empty"),
      })
    )
    .min(1, "At least one suggestion is required"),
});

// Mock generated images - using sample room images from public assets
const mockGeneratedImages = [
  "/assets/images/hero2.png",
  "/assets/images/hero3.png",
  "/assets/images/hero4.jpeg",
  "/assets/images/hero5.jpeg",
];

// Generate a unique prediction ID
function generatePredictionId(): string {
  return `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(req: Request) {
  console.log("=== MOCK GENERATE-IMAGE API START ===");

  try {
    const body = await req.json();

    // Validate the input
    const validatedData = generateImageSchema.parse(body);
    const { imageUrl, suggestions } = validatedData;

    console.log("Mock generation request:", {
      imageUrlLength: imageUrl.length,
      suggestionsCount: suggestions.length,
      categories: suggestions.map((s) => s.category),
    });

    // Simulate API delay for realism
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return a mock prediction object that matches Replicate's format
    const mockPrediction = {
      id: generatePredictionId(),
      model: "mock-flux-kontext-pro",
      version: "mock-version",
      input: {
        input_image: imageUrl,
        prompt: "Mock prompt generated from suggestions",
      },
      output: null, // Will be populated later via polling
      status: "starting",
      created_at: new Date().toISOString(),
      urls: {
        get: `/api/predictions/${generatePredictionId()}`,
        cancel: `/api/predictions/${generatePredictionId()}/cancel`,
      },
    };

    console.log("Mock prediction created:", mockPrediction.id);

    return NextResponse.json(mockPrediction, { status: 201 });
  } catch (error) {
    console.error("Mock generate-image API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Ungültige Eingabedaten.",
          details: error.errors.map(
            (err) => `${err.path.join(".")}: ${err.message}`
          ),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Mock Bildgenerierung konnte nicht gestartet werden." },
      { status: 500 }
    );
  }
}

// Helper function to get a random mock image
export function getRandomMockImage(): string {
  const randomIndex = Math.floor(Math.random() * mockGeneratedImages.length);
  return mockGeneratedImages[randomIndex];
}
