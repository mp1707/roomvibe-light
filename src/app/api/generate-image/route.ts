import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { z } from "zod";

// Input validation schema
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
    const { imageUrl, prompt } = validatedData;

    console.log("Using pre-generated prompt:", prompt);
    console.log(
      `🎨 [GENERATE] Creating image with Flux model using optimized input image`
    );

    const prediction = await replicate.predictions.create({
      model: "black-forest-labs/flux-kontext-pro",
      input: {
        input_image: imageUrl,
        prompt: prompt,
      },
    });

    console.log(`✅ [GENERATE] Prediction created with ID: ${prediction.id}`);
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
