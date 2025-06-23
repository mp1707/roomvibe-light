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
    vercelRegion: process.env.VERCEL_REGION || "unknown",
    openaiKeyExists: !!process.env.OPENAI_API_KEY,
    openaiKeyLength: process.env.OPENAI_API_KEY?.length || 0,
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
    runtime: "nodejs",
    // Don't expose actual keys, just check their presence
    envVars: {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
    },
  });
}
