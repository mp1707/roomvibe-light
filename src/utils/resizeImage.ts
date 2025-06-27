/**
 * Resizes an image file using the Canvas API.
 *
 * @param file The original image file.
 * @param maxWidth The maximum desired width.
 * @param maxHeight The maximum desired height.
 * @param quality The quality for JPEG compression (0 to 1). Ignored for PNG/GIF.
 * @param outputFormat Override the output format ('image/jpeg', 'image/png', 'image/webp')
 * @returns A Promise that resolves with the resized image as a Blob,
 * or rejects with an error.
 */
const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality = 0.8, // Default quality for JPEG
  outputFormat?: string
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Ensure the file is an image
    if (!file.type.startsWith("image/")) {
      return reject(new Error("File is not an image."));
    }

    const reader = new FileReader();

    // Read the file as a Data URL
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return reject(new Error("Failed to get canvas context."));
        }

        const { width, height } = img;

        // Calculate the aspect ratio
        const ratio = Math.min(maxWidth / width, maxHeight / height);

        // Don't scale up if the image is already smaller than max dimensions
        const newWidth =
          width > maxWidth || height > maxHeight
            ? Math.round(width * ratio)
            : width;
        const newHeight =
          width > maxWidth || height > maxHeight
            ? Math.round(height * ratio)
            : height;

        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Use better image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw the scaled image onto the canvas
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert canvas to Blob
        // Use the specified output format or determine from original file type
        let mimeType = outputFormat;
        if (!mimeType) {
          mimeType = ["image/jpeg", "image/png", "image/webp"].includes(
            file.type
          )
            ? file.type
            : "image/jpeg";
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas to Blob conversion failed."));
            }
          },
          mimeType,
          quality // Pass quality setting for JPEG/WEBP
        );
      };

      img.onerror = (error) => {
        reject(new Error(`Image loading failed: ${error}`));
      };
    };

    reader.onerror = (error) => {
      reject(new Error(`File reading failed: ${error}`));
    };
  });
};

/**
 * Smart image optimization that only compresses if file exceeds target size.
 * Maintains premium quality while ensuring reasonable file sizes.
 *
 * @param file The original image file
 * @param targetSizeMB Target file size in MB (default: 4MB)
 * @returns The optimized file or original if no optimization needed
 */
export const smartOptimizeImage = async (
  file: File,
  targetSizeMB: number = 2
): Promise<File> => {
  const targetBytes = targetSizeMB * 1024 * 1024;
  const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);

  console.log("originalSizeMB", originalSizeMB);
  console.log("targetSizeMB", targetSizeMB);


  // Return original file if already within target size
  if (file.size <= targetBytes) {
    // Development-only logging (will be stripped in production builds)
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ [CLIENT-OPTIMIZE] File ${file.name} (${originalSizeMB} MB) is within ${targetSizeMB}MB limit - no optimization needed`
      );
    }
    return file;
  }

  // Development-only logging for optimization
  if (process.env.NODE_ENV === "development") {
    console.log(
      `⚡ [CLIENT-OPTIMIZE] Optimizing ${file.name} from ${originalSizeMB} MB (exceeds ${targetSizeMB}MB limit)`
    );
  }

  // Smart compression settings for premium quality
  const maxWidth = 2048; // Higher resolution for premium feel
  const maxHeight = 1536; // Maintain aspect ratios well
  const quality = 0.92; // High quality (92%)

  // Determine best output format
  const outputFormat = file.type === "image/png" ? "image/png" : "image/jpeg";

  // Perform single optimization
  const optimizedBlob = await resizeImage(
    file,
    maxWidth,
    maxHeight,
    quality,
    outputFormat
  );

  // Development-only logging for results
  if (process.env.NODE_ENV === "development") {
    const optimizedSizeMB = (optimizedBlob.size / 1024 / 1024).toFixed(2);
    const compressionRatio = Math.round(
      (1 - optimizedBlob.size / file.size) * 100
    );
    console.log(
      `✅ [CLIENT-OPTIMIZE] ${file.name} optimized: ${originalSizeMB} MB → ${optimizedSizeMB} MB (${compressionRatio}% reduction)`
    );
  }

  // Create optimized File object
  return new File([optimizedBlob], file.name, {
    type: optimizedBlob.type,
    lastModified: Date.now(),
  });
};

export default resizeImage;
