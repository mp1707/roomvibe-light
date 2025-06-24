import { NextRequest, NextResponse } from "next/server";

// Mock generated images - using multiple images from assets for variety
const mockGeneratedImages = [
  "/assets/images/mockResult.png",
  "/assets/images/hero.png",
  "/assets/images/hero2.png",
  "/assets/images/hero3.png",
];

// Helper to convert relative paths to full URLs
function getFullImageUrl(relativePath: string, request: NextRequest): string {
  const baseUrl = new URL(request.url).origin;
  return `${baseUrl}${relativePath}`;
}

// In-memory store for mock predictions (in production this would be a database)
const mockPredictions = new Map<string, any>();

// Helper to get a random mock image
function getRandomMockImage(): string {
  const randomIndex = Math.floor(Math.random() * mockGeneratedImages.length);
  return mockGeneratedImages[randomIndex];
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const predictionId = params.id;

  console.log("=== MOCK PREDICTION POLLING ===", predictionId);

  // If this is a mock prediction ID, handle it
  if (predictionId.startsWith("mock_")) {
    // Get or create prediction state
    let prediction = mockPredictions.get(predictionId);

    if (!prediction) {
      // Initialize a new mock prediction
      prediction = {
        id: predictionId,
        model: "mock-flux-kontext-pro",
        version: "mock-version",
        input: {
          input_image: "mock-input-image",
          prompt: "Mock prompt generated from suggestions",
        },
        output: null,
        status: "starting",
        created_at: new Date().toISOString(),
        urls: {
          get: `/api/mock-predictions/${predictionId}`,
          cancel: `/api/mock-predictions/${predictionId}/cancel`,
        },
      };
      mockPredictions.set(predictionId, prediction);
    }

    // Simulate progression through states
    const now = Date.now();
    const created = new Date(prediction.created_at).getTime();
    const elapsed = now - created;

    // Status progression based on elapsed time
    if (elapsed < 3000) {
      // First 3 seconds: starting
      prediction.status = "starting";
    } else if (elapsed < 8000) {
      // Next 5 seconds: processing
      prediction.status = "processing";
    } else {
      // After 8 seconds: succeeded with output
      prediction.status = "succeeded";

      if (!prediction.output) {
        // Return multiple mock result images for variety with full URLs
        const fullImageUrls = mockGeneratedImages
          .slice(0, 2)
          .map((path) => getFullImageUrl(path, request));
        prediction.output = fullImageUrls;
        console.log("Mock prediction output set to:", prediction.output);
      }
    }

    // Update the stored prediction
    mockPredictions.set(predictionId, prediction);

    console.log("Mock prediction status:", prediction.status);

    return NextResponse.json(prediction);
  }

  // If not a mock prediction, return not found
  return NextResponse.json({ error: "Prediction not found" }, { status: 404 });
}
