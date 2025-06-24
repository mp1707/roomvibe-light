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
  prompt: z
    .string()
    .min(10, "Generated prompt must be at least 10 characters long"),
});

// Mock generated images - using multiple images from assets for variety
const mockGeneratedImages = [
  "/assets/images/mockResult.png",
  "/assets/images/hero.png",
  "/assets/images/hero2.png",
  "/assets/images/hero3.png",
];

// Helper to convert relative paths to full URLs
function getFullImageUrl(relativePath: string, request: Request): string {
  const baseUrl = new URL(request.url).origin;
  return `${baseUrl}${relativePath}`;
}

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
    const { imageUrl, prompt } = validatedData;

    console.log("Mock generation request:", {
      imageUrlLength: imageUrl.length,
      promptLength: prompt.length,
      prompt: prompt.substring(0, 100) + "...", // Log first 100 chars
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
        prompt: prompt,
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
function getRandomMockImage(): string {
  const randomIndex = Math.floor(Math.random() * mockGeneratedImages.length);
  return mockGeneratedImages[randomIndex];
}
