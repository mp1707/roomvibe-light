/**
 * Downloads an image from a URL to the user's device
 * @param imageUrl - The URL of the image to download
 * @param filename - Optional filename for the downloaded image
 */
export async function downloadImage(
  imageUrl: string,
  filename?: string
): Promise<void> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the image blob
    const blob = await response.blob();

    // Create a blob URL
    const blobUrl = window.URL.createObjectURL(blob);

    // Create a temporary download link
    const downloadLink = document.createElement("a");
    downloadLink.style.display = "none";
    downloadLink.href = blobUrl;

    // Set filename - use provided name or generate one
    const imageFilename =
      filename ||
      `roomvibe-design-${new Date()
        .toISOString()
        .slice(0, 10)}-${Date.now()}.jpg`;
    downloadLink.download = imageFilename;

    // Add to DOM, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Clean up the blob URL
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error(
      "Das Bild konnte nicht heruntergeladen werden. Bitte versuchen Sie es erneut."
    );
  }
}

/**
 * Checks if the download feature is supported in the current browser
 */
export function isDownloadSupported(): boolean {
  return (
    typeof document !== "undefined" && "download" in document.createElement("a")
  );
}
