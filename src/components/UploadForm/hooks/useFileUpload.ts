import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAppState } from "@/utils/store";
import { useSettingsStore } from "@/utils/settingsStore";
import { useImageModalStore } from "@/utils/useImageModalStore";
import toast from "react-hot-toast";

// Constants
const MOCK_ROOM_IMAGE_URL =
  "https://media.istockphoto.com/id/2175713816/de/foto/elegantes-wohnzimmer-mit-beigem-sofa-und-kamin.jpg?s=2048x2048&w=is&k=20&c=E9JrU7zYWFLQsEJQf0fXJyiVECM6tsIyKgSNNp-cEkc%3D";

const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB
const SUPPORTED_TYPES = ["image/"];

// Pure functions for file validation
export const validateFileType = (file: File): boolean => {
  return SUPPORTED_TYPES.some((type) => file.type.startsWith(type));
};

export const validateFileSize = (file: File): boolean => {
  return file.size <= FILE_SIZE_LIMIT;
};

export const validateFile = (
  file: File
): { isValid: boolean; error?: string } => {
  if (!validateFileType(file)) {
    return { isValid: false, error: "Bitte wählen Sie eine Bilddatei aus." };
  }

  if (!validateFileSize(file)) {
    return {
      isValid: false,
      error: "Die Datei ist zu groß. Bitte wählen Sie ein Bild unter 10MB.",
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
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("room-images")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from("room-images").getPublicUrl(data.path);

        setUploadProgress(100);
        clearInterval(progressInterval);
        return publicUrl;
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      }
    },
    [user, supabase]
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
        let publicUrl: string;

        if (mockFileUpload) {
          console.log("🎭 Mock file upload enabled - simulating upload...");
          publicUrl = await simulateUpload(file);

          // Create mock file for local storage
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
            const placeholderFile = new File([""], "mock-placeholder.jpg", {
              type: "image/jpeg",
            });
            setLocalImageUrl(placeholderFile);
          }
        } else {
          publicUrl = await uploadToSupabase(file);
          setLocalImageUrl(file);
        }

        setHostedImageUrl(publicUrl);

        // Navigate to analysis
        setTimeout(() => {
          router.push("/analyze");
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
