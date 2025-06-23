import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    console.log("=== TEST ANALYZE START ===");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Vercel Region:", process.env.VERCEL_REGION);
    console.log("Node Version:", process.version);
    console.log("OpenAI Key exists:", !!process.env.OPENAI_API_KEY);
    console.log(
      "Request headers:",
      JSON.stringify(Object.fromEntries(request.headers.entries()), null, 2)
    );

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      console.log("ERROR: No file uploaded");
      return NextResponse.json(
        { error: "Keine Datei hochgeladen" },
        { status: 400 }
      );
    }

    console.log("File info:", {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    });

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const imageUrl = `data:${file.type};base64,${base64}`;

    console.log("Base64 conversion:", {
      originalSize: file.size,
      base64Length: base64.length,
      imageUrlLength: imageUrl.length,
    });

    // Simple prompt for testing
    const prompt = `
Analyze this image and respond ONLY with valid JSON in this exact format:

{
  "isInteriorSpace": true,
  "suggestions": [
    {
      "id": "test-suggestion-1",
      "title": "Test Title",
      "suggestion": "Test suggestion text",
      "explanation": "Test explanation text",
      "category": "Wandgestaltung"
    }
  ]
}

If it's not an interior space, respond with:
{
  "isInteriorSpace": false,
  "suggestions": []
}

RESPOND ONLY WITH VALID JSON, NO OTHER TEXT.
`;

    console.log("Calling OpenAI API...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Respond only with valid JSON as requested.",
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
      max_tokens: 1000,
      temperature: 0.1,
    });

    const responseContent = completion.choices[0]?.message?.content;
    console.log("=== OPENAI RAW RESPONSE ===");
    console.log("Response exists:", !!responseContent);
    console.log("Response length:", responseContent?.length || 0);
    console.log("Response content:", responseContent);
    console.log("=== END RAW RESPONSE ===");

    if (!responseContent) {
      throw new Error("Keine Antwort von OpenAI erhalten");
    }

    // Clean and parse response
    let cleanedContent = responseContent.trim();
    console.log("Cleaned content length:", cleanedContent.length);

    // Try to extract JSON
    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedContent = jsonMatch[0];
      console.log(
        "Extracted JSON from match:",
        cleanedContent.substring(0, 200) + "..."
      );
    }

    // Additional cleanup
    cleanedContent = cleanedContent
      .replace(/```json\s*/, "")
      .replace(/```\s*$/, "")
      .replace(/^\s*```\s*/, "");

    console.log("Final cleaned content:", cleanedContent);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedContent);
      console.log("JSON Parse SUCCESS");
      console.log("Parsed response:", JSON.stringify(parsedResponse, null, 2));
    } catch (parseError) {
      console.log("JSON Parse FAILED");
      console.error("Parse error:", parseError);
      console.error("Content that failed to parse:", cleanedContent);

      return NextResponse.json(
        {
          error: "JSON parsing failed",
          parseError:
            parseError instanceof Error
              ? parseError.message
              : String(parseError),
          originalResponse: responseContent,
          cleanedContent: cleanedContent,
          environment: process.env.NODE_ENV,
          processingTime: Date.now() - startTime,
        },
        { status: 500 }
      );
    }

    // Basic validation
    const isValid =
      parsedResponse &&
      typeof parsedResponse.isInteriorSpace === "boolean" &&
      Array.isArray(parsedResponse.suggestions);

    console.log("Basic validation:", isValid);

    if (!isValid) {
      return NextResponse.json(
        {
          error: "Response validation failed",
          parsedResponse,
          validationInfo: {
            hasIsInteriorSpace: "isInteriorSpace" in parsedResponse,
            isInteriorSpaceType: typeof parsedResponse.isInteriorSpace,
            hasSuggestions: "suggestions" in parsedResponse,
            suggestionsIsArray: Array.isArray(parsedResponse.suggestions),
          },
          environment: process.env.NODE_ENV,
          processingTime: Date.now() - startTime,
        },
        { status: 500 }
      );
    }

    console.log("=== TEST ANALYZE SUCCESS ===");
    console.log("Processing time:", Date.now() - startTime, "ms");

    return NextResponse.json({
      success: true,
      data: parsedResponse,
      processingTime: Date.now() - startTime,
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.log("=== TEST ANALYZE ERROR ===");
    console.error("Error:", error);
    console.log("Processing time:", Date.now() - startTime, "ms");

    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API Error details:", {
        status: error.status,
        message: error.message,
        code: error.code,
        type: error.type,
      });
    }

    return NextResponse.json(
      {
        error: "Test analyze failed",
        errorMessage: error instanceof Error ? error.message : String(error),
        errorType:
          error instanceof Error ? error.constructor.name : typeof error,
        environment: process.env.NODE_ENV,
        processingTime: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}
