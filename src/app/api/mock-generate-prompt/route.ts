import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Input validation schema (same as real API) - now expects a single suggestion
const generatePromptSchema = z.object({
  imageUrl: z.string().min(1, "Image URL is required"),
  suggestion: z.object({
    id: z.string().min(1, "Suggestion ID cannot be empty"),
    title: z.string().min(1, "Suggestion title cannot be empty"),
    suggestion: z.string().min(1, "Suggestion text cannot be empty"),
    explanation: z
      .string()
      .optional()
      .transform((val) => val || ""),
    category: z.string().min(1, "Suggestion category cannot be empty"),
  }),
});

export async function POST(req: Request) {
  console.log("=== MOCK GENERATE-PROMPT API START ===");

  try {
    const body = await req.json();

    // Validate the input
    const validatedData = generatePromptSchema.parse(body);
    const { imageUrl, suggestion } = validatedData;

    console.log("Mock prompt generation request:", {
      imageUrlLength: imageUrl.length,
      suggestionTitle: suggestion.title,
      suggestionCategory: suggestion.category,
    });

    // Simulate API delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Create a mock prompt based on the suggestion
    const mockPrompt = `Transform this interior space by applying the following change: ${suggestion.suggestion}. Maintain the original room layout and architectural elements while making realistic and tasteful improvements that enhance the space's character and functionality.`;

    console.log("Mock prompt generated:", mockPrompt);

    const response = {
      prompt: mockPrompt,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Mock generate-prompt API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Ungültige Eingabedaten oder OpenAI-Antwort.",
          details: error.errors.map(
            (err) => `${err.path.join(".")}: ${err.message}`
          ),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Mock Prompt-Generierung konnte nicht gestartet werden." },
      { status: 500 }
    );
  }
}
