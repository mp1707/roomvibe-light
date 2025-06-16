import resizeImage from "@/utils/resizeImage";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");
  const id = randomUUID();
  const uniqueFilename = `${id}-${filename || "default"}`;

  if (!request.body) {
    return NextResponse.json({ error: "Request body is required" }, { status: 400 });
  }

  const blob = await put(uniqueFilename, request.body, {
    access: "public",
  });

  return NextResponse.json(blob);
}
