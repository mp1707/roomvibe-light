import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Only allow this in development or with specific headers for security
  const isDev = process.env.NODE_ENV === "development";
  const debugHeader = request.headers.get("x-debug-token");

  if (!isDev && debugHeader !== "roomvibe-debug-2024") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    vercelRegion: process.env.VERCEL_REGION,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    openAIKeyLength: process.env.OPENAI_API_KEY?.length || 0,
    hasReplicateToken: !!process.env.REPLICATE_API_TOKEN,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    timestamp: new Date().toISOString(),
  });
}
