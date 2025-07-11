import { useState, useCallback, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAppState } from "@/utils/store";
import { useSettingsStore } from "@/utils/settingsStore";
import { useImageModalStore } from "@/utils/useImageModalStore";
import { smartOptimizeImage } from "@/utils/resizeImage";
import toast from "react-hot-toast";

// Constants
const MOCK_ROOM_IMAGE_URL =
  "https://media.istockphoto.com/id/2175713816/de/foto/elegantes-wohnzimmer-mit-beigem-sofa-und-kamin.jpg?s=2048x2048&w=is&k=20&c=E9JrU7zYWFLQsEJQf0fXJyiVECM6tsIyKgSNNp-cEkc%3D";

const SUPPORTED_TYPES = ["image/"];

// Pure functions for file validation
export const validateFileType = (file: File): boolean => {
  return SUPPORTED_TYPES.some((type) => file.type.startsWith(type));
};

export const validateFile = (
  file: File
): { isValid: boolean; error?: string } => {
  if (!validateFileType(file)) {
    return { isValid: false, error: "Bitte wählen Sie eine Bilddatei aus." };
  }

  // Check for extremely large files that can't be reasonably optimized
  const maxReasonableSize = 20 * 1024 * 1024; // 20MB - anything larger is unreasonable
  if (file.size > maxReasonableSize) {
    return {
      isValid: false,
      error: `Das Bild ist zu groß (${(file.size / 1024 / 1024).toFixed(
        1
      )}MB). Bitte wählen Sie ein Bild unter 20MB.`,
    };
  }

  return { isValid: true };
};

// Custom hook for file upload logic
export const useFileUpload = () => {
  const { setLocalImageUrl, setHostedImageUrl, resetForNewImage } =
    useAppState();
  const { mockFileUpload } = useSettingsStore();
  const { reset: resetImageModal } = useImageModalStore();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [supabase] = useState(() => createClient());

  // Get current user on mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  // Reset state when component mounts
  useEffect(() => {
    resetForNewImage();
    resetImageModal();
  }, [resetForNewImage, resetImageModal]);

  const simulateUpload = useCallback(async (file: File): Promise<string> => {
    return new Promise<string>((resolve) => {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return Math.round(prev + Math.random() * 15);
        });
      }, 150);

      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        resolve(MOCK_ROOM_IMAGE_URL);
      }, 2000 + Math.random() * 1000);
    });
  }, []);

  const uploadToSupabase = useCallback(
    async (file: File): Promise<string> => {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return Math.round(prev + Math.random() * 15);
        });
      }, 100);

      try {
        // Create FormData to send the file
        const formData = new FormData();
        formData.append("file", file);

        // Upload using the updated API with user-specific folder structure
        const response = await fetch(
          `/api/uploadImage?filename=${encodeURIComponent(
            file.name
          )}&folder=original&userId=${user.id}`,
          {
            method: "POST",
            body: file,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          // Handle specific 413 error (Request Entity Too Large)
          if (response.status === 413) {
            throw new Error(
              "Das Bild ist zu groß für den Upload (Server-Limit erreicht). Bitte wählen Sie ein Bild mit weniger Details oder niedrigerer Auflösung."
            );
          }

          throw new Error(errorData.error || "Upload failed");
        }

        const result = await response.json();

        setUploadProgress(100);
        clearInterval(progressInterval);
        return result.url;
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      }
    },
    [user]
  );

  const handleFileUpload = useCallback(
    async (file: File) => {
      // Reset state
      resetForNewImage();
      resetImageModal();

      // Validate authentication (skip in mock mode)
      if (!mockFileUpload && !user) {
        toast.error("Sie müssen angemeldet sein, um Bilder hochzuladen.");
        router.push("/auth/login");
        return;
      }

      // Validate file
      const validation = validateFile(file);
      if (!validation.isValid) {
        toast.error(validation.error!);
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Consistent optimization for all environments - what customers see
        const targetSize = 0.8; // Consistent 0.8MB for optimal Vercel compatibility
        const optimizedFile = await smartOptimizeImage(file, targetSize);

        // Consistent size check for all environments
        const maxUploadSize = 1 * 1024 * 1024; // 1MB limit everywhere
        if (optimizedFile.size > maxUploadSize) {
          throw new Error(
            `Das Bild konnte nicht ausreichend komprimiert werden (${(
              optimizedFile.size /
              1024 /
              1024
            ).toFixed(
              1
            )}MB von 1MB maximal). Bitte wählen Sie ein Bild mit weniger Details oder niedrigerer Auflösung.`
          );
        }

        let publicUrl: string;

        if (mockFileUpload) {
          console.log("🎭 Mock file upload enabled - simulating upload...");
          publicUrl = await simulateUpload(optimizedFile);

          // Create mock file for local storage using optimized version
          try {
            const response = await fetch(publicUrl, {
              mode: "cors",
              headers: { Accept: "image/*" },
            });

            if (response.ok) {
              const blob = await response.blob();
              const mockFile = new File([blob], "elegantes-wohnzimmer.jpg", {
                type: "image/jpeg",
              });
              setLocalImageUrl(mockFile);
            } else {
              throw new Error(`Failed to fetch mock image: ${response.status}`);
            }
          } catch (error) {
            console.warn("Could not create mock file object:", error);
            // Use the optimized file as fallback instead of empty placeholder
            setLocalImageUrl(optimizedFile);
          }
        } else {
          publicUrl = await uploadToSupabase(optimizedFile);
          setLocalImageUrl(optimizedFile);
        }

        setHostedImageUrl(publicUrl);

        // Navigate to analysis
        setTimeout(() => {
          router.push("/select-mode");
        }, 500);
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Upload fehlgeschlagen. Bitte versuchen Sie es erneut.");
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [
      mockFileUpload,
      user,
      router,
      resetForNewImage,
      resetImageModal,
      setLocalImageUrl,
      setHostedImageUrl,
      simulateUpload,
      uploadToSupabase,
    ]
  );

  return {
    isUploading,
    uploadProgress,
    handleFileUpload,
  };
};
