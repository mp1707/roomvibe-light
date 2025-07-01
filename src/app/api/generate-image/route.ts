import { NextResponse } from "next/server";
import Replicate from "replicate";
import { z } from "zod";

// Input validation schema
const generateImageSchema = z.object({
  imageUrl: z
    .string()
    .min(1, "Image URL is required")
    .refine((url) => {
      // Check if it's a data URL (base64)
      if (url.startsWith("data:image/")) {
        return true;
      }
      // Check if it's a valid HTTP/HTTPS URL
      if (url.startsWith("http://") || url.startsWith("https://")) {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }, "Must be a valid HTTP/HTTPS URL or data:image/ URL"),
  prompt: z
    .string()
    .min(10, "Generated prompt must be at least 10 characters long"),
});

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Removed base64 conversion function since Replicate accepts URLs directly

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
      `🎨 [GENERATE] Creating image with Flux model using image URL: ${imageUrl.substring(
        0,
        50
      )}...`
    );

    const prediction = await replicate.predictions.create({
      model: "black-forest-labs/flux-kontext-pro",
      input: {
        input_image: imageUrl,
        prompt: prompt,
        safety_tolerance: 0.5,
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
