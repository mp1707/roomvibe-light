/**
 * Resizes an image file using the Canvas API.
 *
 * @param file The original image file.
 * @param maxWidth The maximum desired width.
 * @param maxHeight The maximum desired height.
 * @param quality The quality for JPEG compression (0 to 1). Ignored for PNG/GIF.
 * @returns A Promise that resolves with the resized image as a Blob,
 * or rejects with an error.
 */
const resizeImage = (
	file: File,
	maxWidth: number,
	maxHeight: number,
	quality = 0.8, // Default quality for JPEG
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

				// Draw the scaled image onto the canvas
				ctx.drawImage(img, 0, 0, newWidth, newHeight);

				// Convert canvas to Blob
				// Use the original file type if possible, default to jpeg otherwise
				const mimeType = ["image/jpeg", "image/png", "image/webp"].includes(
					file.type,
				)
					? file.type
					: "image/jpeg";

				canvas.toBlob(
					(blob) => {
						if (blob) {
							resolve(blob);
						} else {
							reject(new Error("Canvas to Blob conversion failed."));
						}
					},
					mimeType,
					quality, // Pass quality setting for JPEG/WEBP
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

export default resizeImage; // Optional: export if you put it in a separate file
