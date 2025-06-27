import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");
    const folder = searchParams.get("folder") || "original"; // Default to 'original'
    const userId = searchParams.get("userId");

    if (!request.body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Convert request body to buffer to check file size
    const buffer = await request.arrayBuffer();
    const file = new Uint8Array(buffer);
    const fileSizeMB = (file.length / 1024 / 1024).toFixed(2);

    console.log(
      `📂 [UPLOAD] Receiving ${folder} image: ${filename} (${fileSizeMB} MB) for user ${userId.substring(
        0,
        8
      )}...`
    );

    // Initialize Supabase client
    const supabase = await createClient();

    // Create the file path: userId/folder/timestamp-filename
    const fileExt = filename?.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const fileName = `${userId}/${folder}/${timestamp}-${randomId}.${fileExt}`;

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from("room-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: `image/${fileExt === "jpg" ? "jpeg" : fileExt}`,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("room-images").getPublicUrl(data.path);

    console.log(
      `✅ [UPLOAD] Successfully stored ${folder} image (${fileSizeMB} MB) → ${data.path}`
    );

    return NextResponse.json({
      url: publicUrl,
      path: data.path,
      fullPath: data.fullPath,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
