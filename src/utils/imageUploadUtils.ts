import { createClient } from "@/utils/supabase/client";

/**
 * Downloads an image from a URL and uploads it to Supabase storage
 */
export const uploadImageFromUrl = async (
  imageUrl: string,
  userId: string,
  folder: "original" | "generated" = "generated",
  filename?: string
): Promise<string> => {
  try {
    // Download the image from the URL
    const response = await fetch(imageUrl, {
      mode: "cors",
      headers: { Accept: "image/*" },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    // Get the image as blob
    const blob = await response.blob();

    // Create a filename if not provided
    const fileExtension = blob.type.split("/")[1] || "jpg";
    const finalFilename =
      filename || `generated-image-${Date.now()}.${fileExtension}`;

    // Upload using the uploadImage API
    const uploadResponse = await fetch(
      `/api/uploadImage?filename=${encodeURIComponent(
        finalFilename
      )}&folder=${folder}&userId=${userId}`,
      {
        method: "POST",
        body: blob,
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => ({}));
      throw new Error(errorData.error || "Upload to Supabase failed");
    }

    const result = await uploadResponse.json();
    console.log(`✅ Image uploaded to Supabase: ${result.url}`);

    return result.url;
  } catch (error) {
    console.error("Error uploading image from URL:", error);
    throw error;
  }
};

/**
 * Gets the current authenticated user
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("Error getting user:", error);
      return null;
    }

    return user.id;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
};
