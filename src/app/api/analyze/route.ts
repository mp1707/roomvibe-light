import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { AnalysisResponse } from "@/types/suggestions";

// Zod schema for suggestion validation
const SuggestionSchema = z.object({
  id: z.string().min(1, "ID cannot be empty"),
  title: z.string().min(1, "Title cannot be empty"),
  suggestion: z.string().min(1, "Suggestion cannot be empty"),
  explanation: z.string().min(1, "Explanation cannot be empty"),
  category: z.string().min(1, "Category cannot be empty"),
});

const AnalysisResponseSchema = z.object({
  isInteriorSpace: z.boolean(),
  suggestions: z.array(SuggestionSchema),
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log("=== ANALYZE API START ===");
  console.log("Environment:", process.env.NODE_ENV);
  console.log("Vercel Region:", process.env.VERCEL_REGION);
  console.log("OpenAI Key exists:", !!process.env.OPENAI_API_KEY);

  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not configured");
    return NextResponse.json(
      {
        error: "OpenAI API key is not configured",
        details: "Please check your environment variables configuration",
        environment: process.env.NODE_ENV,
      },
      { status: 500 }
    );
  }

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
Du bist ein professioneller Innenarchitekt mit über 15 Jahren Erfahrung. Analysiere dieses Bild eines Innenraums und erstelle präzise, umsetzbare Verbesserungsvorschläge.

WICHTIGE REGEL: Analysiere NUR Bilder von Innenräumen (Wohnzimmer, Schlafzimmer, Küche, Bad, Büro, etc.).

Antworte im folgenden JSON-Format:

Wenn das Bild einen Innenraum zeigt:
{
  "isInteriorSpace": true,
  "suggestions": [
    {
      "id": "eindeutige-id-mit-bindestrichen",
      "title": "Prägnanter Titel (max. 3 Wörter)",
      "suggestion": "Sehr spezifischer, umsetzbarer Vorschlag mit konkreten Details (z.B. 'Wände in warmem Salbeigrün (RAL 6021) streichen für beruhigende Atmosphäre')",
      "explanation": "Detaillierte 2-3 Sätze Erklärung WARUM dieser Vorschlag funktioniert und WIE er den Raum visuell/funktional verbessert",
      "category": "Exakte Kategorie"
    }
  ]
}

Wenn das Bild KEINEN Innenraum zeigt:
{
  "isInteriorSpace": false,
  "suggestions": []
}

WICHTIGE ANALYSE-KRITERIEN für Innenräume:
1. Erkenne den Raumtyp (Wohnzimmer, Schlafzimmer, Küche, etc.)
2. Bewerte Beleuchtung, Farbschema, Raumaufteilung, Möbelstellung
3. Identifiziere Stil-Potentiale und Problembereiche

VORSCHLAG-KATEGORIEN (verwende genau diese):
- "Wandgestaltung" (Farbe, Tapeten, Wandkunst)
- "Beleuchtung" (Lampen, Lichtquellen, Atmosphäre)
- "Möbelanordnung" (Platzierung, Ergonomie)
- "Farbkonzept" (Harmonie, Akzente)
- "Dekoration" (Accessoires, Pflanzen, Textilien)
- "Raumaufteilung" (Zonierung, Verkehrswege)
- "Materialien" (Oberflächen, Texturen)
- "Aufbewahrung" (Organisation, Stauraum)

QUALITÄTS-ANFORDERUNGEN:
- 8-12 Vorschläge je nach Raum-Komplexität
- Jeder Vorschlag muss SEHR spezifisch und umsetzbar sein
- Berücksichtige bestehenden Stil und Budget-Realismus
- Fokus auf visuell wahrnehmbare Veränderungen
- Verwende konkrete Farbnamen, Materialien, Maße wenn möglich
- Erklärungen müssen Design-Prinzipien (Proportionen, Kontrast, Balance) erwähnen

Antworte NUR mit dem JSON-Format!
`;

    console.log("File info:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Call OpenAI Vision API
    console.log("Calling OpenAI API...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Du bist ein erfahrener Innenarchitekt und Design-Experte. Analysiere Bilder präzise und erstelle nur umsetzbare, spezifische Verbesserungsvorschläge. Antworte AUSSCHLIESSLICH im angeforderten JSON-Format ohne zusätzlichen Text. Bei Nicht-Innenräumen: isInteriorSpace=false, suggestions=[]. Fokussiere auf visuell wahrnehmbare, realistische Veränderungen mit konkreten Details.",
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

    console.log("OpenAI API call completed");
    const responseContent = completion.choices[0]?.message?.content;
    console.log("Response content exists:", !!responseContent);
    console.log("Response content length:", responseContent?.length || 0);

    if (!responseContent) {
      throw new Error("Keine Antwort von OpenAI erhalten");
    }

    // Parse and validate JSON response
    let parsedResponse;
    let cleanedContent = responseContent.trim(); // Move to broader scope
    try {
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

      // Ensure all suggestions have required fields and generate IDs if missing
      parsedResponse.suggestions = parsedResponse.suggestions
        .map((suggestion: any, index: number) => {
          return {
            id: suggestion.id || `suggestion-${Date.now()}-${index}`,
            title: String(suggestion.title || `Vorschlag ${index + 1}`),
            suggestion: String(suggestion.suggestion || ""),
            explanation: String(suggestion.explanation || ""),
            category: String(suggestion.category || "Allgemein"),
          };
        })
        .filter(
          (suggestion: any) =>
            suggestion.suggestion.length > 0 &&
            suggestion.explanation.length > 0 &&
            suggestion.title.length > 0
        );
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Original response content:", responseContent);
      console.error("Response content length:", responseContent?.length);

      // If JSON parsing completely fails, assume it's not an interior space
      console.log("JSON parsing failed - assuming non-interior image");
      parsedResponse = {
        isInteriorSpace: false,
        suggestions: [],
      };
    }

    // Validate with Zod
    let validatedResponse;
    try {
      validatedResponse = AnalysisResponseSchema.parse(parsedResponse);
    } catch (validationError) {
      console.error("=== PRODUCTION DEBUG INFO ===");
      console.error("Environment:", process.env.NODE_ENV);
      console.error("Vercel Region:", process.env.VERCEL_REGION);
      console.error("OpenAI API Key exists:", !!process.env.OPENAI_API_KEY);
      console.error("Original OpenAI response:", responseContent);
      console.error("Cleaned content:", cleanedContent);
      console.error(
        "Parsed response:",
        JSON.stringify(parsedResponse, null, 2)
      );
      console.error("Zod validation error:", validationError);
      console.error("=== END DEBUG INFO ===");

      if (validationError instanceof z.ZodError) {
        const errorDetails = validationError.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join("; ");

        // More specific error handling for production debugging
        const isPatternError = validationError.errors.some(
          (err) =>
            err.message.includes("string did not match") ||
            err.message.includes("pattern")
        );

        if (isPatternError) {
          console.error(
            "PATTERN ERROR DETECTED - this will trigger Datenformat-Fehler"
          );
          console.error("Validation error details:", errorDetails);

          return NextResponse.json(
            {
              error: `string did not match pattern: ${errorDetails}`,
              details: errorDetails,
              originalResponse: parsedResponse,
              rawResponse: responseContent,
              environment: process.env.NODE_ENV,
            },
            { status: 500 }
          );
        }

        return NextResponse.json(
          {
            error: "Die KI-Antwort entspricht nicht dem erwarteten Format",
            details: errorDetails,
            originalResponse: parsedResponse,
          },
          { status: 500 }
        );
      }

      throw validationError;
    }

    console.log("=== ANALYZE SUCCESS ===");
    console.log("Processing time:", Date.now() - startTime, "ms");
    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.log("=== ANALYZE ERROR ===");
    console.error("Analyse-Fehler:", error);
    console.log("Processing time:", Date.now() - startTime, "ms");

    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API Error details:", {
        status: error.status,
        message: error.message,
        code: error.code,
        type: error.type,
      });
      return NextResponse.json(
        {
          error: `OpenAI API Fehler: ${error.message}`,
          details: `Status: ${error.status}, Code: ${error.code}`,
        },
        { status: 500 }
      );
    }

    if (error instanceof z.ZodError) {
      const errorDetails = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("; ");

      return NextResponse.json(
        {
          error: "Validierungsfehler bei OpenAI Antwort",
          details: errorDetails,
        },
        { status: 500 }
      );
    }

    // For any other error, provide more debug info
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      type: error instanceof Error ? error.constructor.name : typeof error,
    });

    return NextResponse.json(
      {
        error: "Fehler bei der Bildanalyse",
        details: errorMessage,
        environment: process.env.NODE_ENV,
      },
      { status: 500 }
    );
  }
}
