import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

// Input validation schema
const generatePromptSchema = z.object({
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
          .optional()
          .transform((val) => val || ""),
        category: z.string().min(1, "Suggestion category cannot be empty"),
      })
    )
    .min(1, "At least one suggestion is required"),
});

// Output validation schema for OpenAI response
const openAIResponseSchema = z.object({
  prompt: z
    .string()
    .min(10, "Generated prompt must be at least 10 characters long"),
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Das OPENAI_API_KEY ist nicht konfiguriert." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    // Validate the input
    const validatedData = generatePromptSchema.parse(body);
    const { imageUrl, suggestions } = validatedData;

    // Group suggestions by category for better organization
    const suggestionsByCategory = suggestions.reduce((acc, suggestion) => {
      if (!acc[suggestion.category]) {
        acc[suggestion.category] = [];
      }
      acc[suggestion.category].push(suggestion);
      return acc;
    }, {} as Record<string, typeof suggestions>);

    // Create formatted suggestions text
    const formattedSuggestions = Object.entries(suggestionsByCategory)
      .map(([category, categorySuggestions]) => {
        const categoryItems = categorySuggestions
          .map((s) => `- ${s.title}: ${s.suggestion} (${s.explanation})`)
          .join("\n");
        return `${category.toUpperCase()}:\n${categoryItems}`;
      })
      .join("\n\n");

    // Create the system prompt with Replicate best practices
    const systemPrompt = `You are an expert prompt engineer for AI image editing models. Your task is to create a perfect English prompt for the Replicate "flux-kontext-pro" model that will transform an interior design image based on user suggestions.

REPLICATE PROMPTING BEST PRACTICES:

1. BE SPECIFIC:
   - Use clear, detailed language with exact colors and descriptions
   - Avoid vague terms like "make it better"
   - Name subjects directly and precisely
   - Include specific materials, textures, and finishes

2. PRESERVE INTENTIONALLY:
   - Specify what should stay the same: "while keeping the same room layout"
   - Use "maintain the original composition" to preserve overall structure
   - For element changes: "Change the wall color to warm beige while keeping all furniture in the exact same positions"

3. STYLE TRANSFER:
   - Be specific about design styles: "Scandinavian minimalist" not just "modern"
   - Reference known movements: "mid-century modern" or "contemporary industrial"
   - Describe key traits: "clean lines, natural materials, neutral color palette"

4. COMPLEX EDITS:
   - Break into clear, actionable steps
   - Use descriptive action verbs for more control
   - Be specific about placement and proportions

You must respond with a JSON object containing only a "prompt" field with the generated English prompt. The prompt should be optimized for interior design transformations while preserving the room's essential character.`;

    const userPrompt = `Based on these interior design suggestions, create a perfect English prompt for the Replicate flux-kontext-pro model:

SELECTED SUGGESTIONS:
${formattedSuggestions}

REQUIREMENTS:
- Transform the interior space while maintaining the original room layout and architectural elements
- Apply changes realistically and tastefully
- Ensure all modifications blend naturally with the existing design
- Focus on enhancing the space while preserving its character and functionality
- Use specific, detailed language following Replicate's best practices
- Include exact colors, materials, and design elements mentioned in suggestions
- Specify what should be preserved vs. what should be changed

Return a JSON object with a single "prompt" field containing the optimized English prompt.`;

    console.log("Calling OpenAI with suggestions:", formattedSuggestions);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent results
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("OpenAI returned empty response");
    }

    console.log("OpenAI raw response:", responseContent);

    // Parse and validate the OpenAI response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (parseError) {
      console.error("Failed to parse OpenAI JSON response:", parseError);
      throw new Error("OpenAI returned invalid JSON");
    }

    const validatedResponse = openAIResponseSchema.parse(parsedResponse);

    console.log("Generated prompt:", validatedResponse.prompt);

    return NextResponse.json(validatedResponse, { status: 200 });
  } catch (error) {
    console.error("Fehler beim Aufruf der OpenAI API:", error);

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

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `OpenAI API Fehler: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Prompt-Generierung konnte nicht gestartet werden." },
      { status: 500 }
    );
  }
}
