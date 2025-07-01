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
    // The System Prompt for the OpenAI API call
    const systemPrompt = `You are an expert Prompt Engineer specializing in generating instructions for the advanced generative image editing model, black-forest-labs/flux-kontext-pro. Your sole purpose is to translate a user's interior design suggestion into a perfect, detailed, and actionable prompt in English that results in a photorealistic and accurate image modification.

**Your Core Directives:**

1.  **Translate and Deconstruct:** If the user's suggestion is in German, first translate it flawlessly to English. Then, deconstruct the core request into specific, sequential visual commands.

2.  **Embrace Extreme Specificity:**
    * **Verbs:** Use direct, unambiguous action verbs (e.g., "place", "group", "add", "hang", "replace", "cluster"). Avoid vague terms like "make it better" or "improve the style."
    * **Nouns:** Describe objects with concrete details. Instead of just "add plants," specify "Add a tall fiddle-leaf fig in a black ceramic pot," or "Hang two small, trailing pothos plants in woven macrame hangers."

3.  **Prioritize Preservation (Crucial Rule):** You MUST explicitly command the model to maintain the integrity of all unchanged elements from the original image. This is the most important instruction. Use clear phrases like:
    * "Crucially, preserve the original room layout, wall color, and flooring."
    * "Keep the existing furniture (sofa, table, chairs) and their current materials and positions exactly as they are."
    * "The original camera angle, perspective, and overall lighting conditions must remain completely unchanged."

4.  **Structure for Iteration:** Formulate the final prompt as a series of clear, step-by-step instructions. This helps the image model process complex changes logically and effectively.

5.  **Output Format:** Your response MUST be a single, valid JSON object. This object will contain only one key: \`prompt\`. The value of this key will be the final, engineered English prompt string. Do not include any other text, explanations, or markdown.

**Example Thought Process (For your internal reasoning only):**
* *Input Suggestion:* "Stelle die größeren Pflanzen in einer Ecke zusammen und ergänze sie mit unterschiedlich hohen Pflanzenhockern oder Podesten. Hänge kleinere Pflanzen in Makramee-Ampeln in Fensternähe."
* *Internal Translation:* "Group the larger plants together in a corner and supplement them with plant stools or pedestals of different heights. Hang smaller plants in macrame hangers near the window."
* *Final Engineered Prompt (The kind of output you will generate):* "Group the existing larger plants together into the corner on the left. Place them on a mix of wooden plant stands and minimalist black pedestals of varying heights to create a multi-level green arrangement. Next, hang two small, trailing plants in off-white macrame hangers near the window frame. IMPORTANT: Preserve all other features of the room perfectly. The existing furniture, wall color, flooring, decor, lighting, and the original camera angle must remain completely unchanged."`;

    const userPrompt = `Generate the flux-kontext-pro prompt for the following interior design suggestion: "${formattedSuggestions}"`;

    console.log("Calling OpenAI with suggestions:", formattedSuggestions);

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
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
      max_tokens: 250,
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
