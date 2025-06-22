import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { z } from "zod";

// Input validation schema
const generateImageSchema = z.object({
  imageUrl: z.string().url("Invalid image URL"),
  suggestions: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        suggestion: z.string(),
        explanation: z.string(),
        category: z.string(),
      })
    )
    .min(1, "At least one suggestion is required"),
});

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Function to convert image URL to base64
async function imageUrlToBase64(imageUrl: string): Promise<string> {
  try {
    console.log("Fetching image from URL:", imageUrl);
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    // Determine content type from response headers or URL
    const contentType = response.headers.get("content-type") || "image/jpeg";

    console.log(
      `Image fetched successfully, size: ${buffer.length} bytes, type: ${contentType}`
    );
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error("Error converting image URL to base64:", error);
    throw new Error(
      `Failed to process image from URL: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Type for handling Replicate response variations
interface ReplicateResponse {
  url?: string;
  images?: string[];
  data?: string[];
  [key: string]: any;
}

// Type guard for ReadableStream
function isReadableStream(obj: any): obj is ReadableStream {
  return obj && typeof obj === "object" && typeof obj.getReader === "function";
}

// Function to create a detailed prompt from suggestions
function createDetailedPrompt(
  suggestions: Array<{
    id: string;
    title: string;
    suggestion: string;
    explanation: string;
    category: string;
  }>
): string {
  // Group suggestions by category for better organization
  const suggestionsByCategory = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = [];
    }
    acc[suggestion.category].push(suggestion);
    return acc;
  }, {} as Record<string, typeof suggestions>);

  // Create detailed prompt sections
  const promptSections = Object.entries(suggestionsByCategory).map(
    ([category, categorySuggestions]) => {
      const categoryPrompts = categorySuggestions
        .map((s) => `${s.suggestion} (${s.explanation.split(".")[0]})`)
        .join("; ");

      return `${category}: ${categoryPrompts}`;
    }
  );

  // Build the complete prompt
  const detailedPrompt = `Transform this interior space by implementing the following specific improvements while maintaining the original room layout and overall style:

${promptSections.join("\n\n")}

Requirements:
- Keep the same room layout, furniture positioning, and architectural elements
- Maintain the current lighting conditions and perspective
- Apply changes realistically and tastefully
- Ensure all modifications blend naturally with the existing interior design
- Focus on enhancing the space while preserving its character and functionality

The result should show a refined version of the same room with these specific improvements applied.`;

  return detailedPrompt;
}

export async function POST(req: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "Das REPLICATE_API_TOKEN ist nicht konfiguriert." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    // Validate the input
    const validatedData = generateImageSchema.parse(body);
    const { imageUrl, suggestions } = validatedData;

    // Create a detailed prompt based on the suggestions
    const detailedPrompt = createDetailedPrompt(suggestions);

    console.log("Generated detailed prompt:", detailedPrompt);

    const prediction = await replicate.predictions.create({
      model: "black-forest-labs/flux-kontext-pro",
      input: {
        input_image: imageUrl,
        prompt: detailedPrompt,
      },
    });

    return NextResponse.json(prediction, { status: 201 });
  } catch (error) {
    console.error("Fehler beim Aufruf der Replicate API:", error);

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
      { error: "Bildgenerierung konnte nicht gestartet werden." },
      { status: 500 }
    );
  }
}
