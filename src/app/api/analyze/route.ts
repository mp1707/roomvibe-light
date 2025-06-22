import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { AnalysisResponse } from "@/types/suggestions";

// Zod schema for suggestion validation
const SuggestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  suggestion: z.string(),
  explanation: z.string(),
  category: z.string(),
});

const AnalysisResponseSchema = z.object({
  isInteriorSpace: z.boolean(),
  suggestions: z.array(SuggestionSchema),
}) satisfies z.ZodType<AnalysisResponse & { isInteriorSpace: boolean }>;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: "Keine Datei hochgeladen" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const imageUrl = `data:${file.type};base64,${base64}`;

    // German prompt for room analysis
    const prompt = `
Du bist ein professioneller Innenarchitekt. Analysiere dieses Bild auf Innenräume und Raumgestaltung.

WICHTIGE REGEL: Analysiere NUR Bilder von Innenräumen (Wohnzimmer, Schlafzimmer, Küche, Bad, Büro, etc.).

Antworte im folgenden JSON-Format:

Wenn das Bild einen Innenraum zeigt:
{
  "isInteriorSpace": true,
  "suggestions": [
    {
      "id": "eindeutige-id-mit-bindestrichen",
      "title": "Kurzer Titel (z.B. 'Wandfarbe', 'Beleuchtung')",
      "suggestion": "Konkreter Vorschlag (z.B. 'Wände in warmem Beige streichen')",
      "explanation": "Ausführliche Erklärung warum dieser Vorschlag den Raum verbessert",
      "category": "Kategorie (Wandfarbe, Möbel, Beleuchtung, Dekoration, etc.)"
    }
  ]
}

Wenn das Bild KEINEN Innenraum zeigt (Außenbereich, Personen, Objekte, etc.):
{
  "isInteriorSpace": false,
  "suggestions": []
}

REGELN für Innenräume:
- Erstelle 6-10 spezifische, professionelle Verbesserungsvorschläge
- Jede Erklärung soll mindestens 2 Sätze haben
- Alle Texte auf Deutsch
- Fokus auf: Wandfarben, Möbelanordnung, Beleuchtung, Dekoration, Raumaufteilung

Antworte NUR mit dem JSON-Format, keine zusätzlichen Erklärungen!
`;

    // Call OpenAI Vision API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Du bist ein professioneller Innenarchitekt. Antworte immer im angeforderten JSON-Format, niemals in normalem Text. Wenn das Bild keinen Innenraum zeigt, setze isInteriorSpace auf false und suggestions als leeres Array.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 2500,
      temperature: 0.1,
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("Keine Antwort von OpenAI erhalten");
    }

    // Parse and validate JSON response
    let parsedResponse;
    try {
      // Clean the response content
      let cleanedContent = responseContent.trim();

      // Try to extract JSON from response (handles cases where OpenAI adds extra text)
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedContent = jsonMatch[0];
      }

      // Additional cleanup for common issues
      cleanedContent = cleanedContent
        .replace(/```json\s*/, "") // Remove markdown code blocks
        .replace(/```\s*$/, "")
        .replace(/^\s*```\s*/, "");

      parsedResponse = JSON.parse(cleanedContent);

      // Basic validation that suggestions array exists
      if (
        !parsedResponse.suggestions ||
        !Array.isArray(parsedResponse.suggestions)
      ) {
        throw new Error("Response missing suggestions array");
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Original response content:", responseContent);

      // If JSON parsing completely fails, assume it's not an interior space
      console.log("JSON parsing failed - assuming non-interior image");
      parsedResponse = {
        isInteriorSpace: false,
        suggestions: [],
      };
    }

    // Validate with Zod
    const validatedResponse = AnalysisResponseSchema.parse(parsedResponse);

    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error("Analyse-Fehler:", error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API Fehler: ${error.message}` },
        { status: 500 }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validierungsfehler bei OpenAI Antwort",
          details: error.errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Fehler bei der Bildanalyse" },
      { status: 500 }
    );
  }
}
