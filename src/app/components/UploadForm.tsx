"use client";

import { useAppState } from "@/utils/store";
import { useSettingsStore } from "@/utils/settingsStore";
import { useImageModalStore } from "@/utils/useImageModalStore";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ChangeEvent,
  type DragEvent,
} from "react";
import InspirationGallery from "./InspirationGallery";
import {
  staggerContainer,
  staggerItem,
  dragVariants,
  buttonVariants,
  useMotionPreference,
} from "@/utils/animations";
import { UploadIcon } from "./Icons";

// Mock image URL for development
const MOCK_ROOM_IMAGE_URL =
  "https://media.istockphoto.com/id/2175713816/de/foto/elegantes-wohnzimmer-mit-beigem-sofa-und-kamin.jpg?s=2048x2048&w=is&k=20&c=E9JrU7zYWFLQsEJQf0fXJyiVECM6tsIyKgSNNp-cEkc%3D";

const ProgressIndicator = ({ progress }: { progress: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm rounded-3xl "
  >
    <motion.div
      className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-4 text-sm font-medium text-base-content/70"
    >
      {progress < 100
        ? `Wird hochgeladen... ${progress}%`
        : "Upload abgeschlossen!"}
    </motion.p>
  </motion.div>
);

const UploadForm = () => {
  const { setLocalImageUrl, setHostedImageUrl, resetForNewImage } =
    useAppState();
  const { mockFileUpload } = useSettingsStore();
  const { reset: resetImageModal } = useImageModalStore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showInspiration, setShowInspiration] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [supabase] = useState(() => createClient());
  const reducedMotion = useMotionPreference();

  // Check for gallery parameter on mount and reset state for fresh start
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("gallery") === "true") {
      setShowInspiration(true);
    }

    // Reset state when component mounts to ensure clean slate
    // This handles page refreshes and direct navigation to upload page
    resetForNewImage();
    resetImageModal();
  }, [resetForNewImage, resetImageModal]);

  // Get current user on component mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  // Mock upload simulation
  const simulateUpload = useCallback(async (file: File) => {
    return new Promise<string>((resolve) => {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 150);

      // Simulate upload time (2-3 seconds)
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);

        // Use the stock image URL for mock mode
        const mockPublicUrl = MOCK_ROOM_IMAGE_URL;
        resolve(mockPublicUrl);
      }, 2000 + Math.random() * 1000);
    });
  }, []);

  const handleFileSelect = useCallback(
    async (file: File | null) => {
      if (!file) return;

      // Reset all state when starting a new upload to prevent interference
      resetForNewImage();
      resetImageModal();

      // Check if user is authenticated (skip in mock mode)
      if (!mockFileUpload && !user) {
        alert("Sie müssen angemeldet sein, um Bilder hochzuladen.");
        router.push("/auth/login");
        return;
      }

      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        alert("Bitte wählen Sie eine Bilddatei aus.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert("Die Datei ist zu groß. Bitte wählen Sie ein Bild unter 10MB.");
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        let publicUrl: string;

        if (mockFileUpload) {
          // Use mock upload simulation
          console.log("🎭 Mock file upload enabled - simulating upload...");
          publicUrl = await simulateUpload(file);

          // For mock mode, create a mock file object that represents the stock image
          // This ensures both the local preview and analysis step work properly
          try {
            console.log("🎭 Fetching mock image for local storage...");
            const response = await fetch(publicUrl, {
              mode: "cors",
              headers: {
                Accept: "image/*",
              },
            });

            if (!response.ok) {
              throw new Error(`Failed to fetch mock image: ${response.status}`);
            }

            const blob = await response.blob();
            const mockFile = new File([blob], "elegantes-wohnzimmer.jpg", {
              type: "image/jpeg",
            });

            console.log("🎭 Mock file created:", mockFile.size, "bytes");
            setLocalImageUrl(mockFile); // Set mock file for local preview
          } catch (error) {
            console.warn("Could not create mock file object:", error);
            // In case of CORS or other issues, create a placeholder
            const placeholderFile = new File([""], "mock-placeholder.jpg", {
              type: "image/jpeg",
            });
            setLocalImageUrl(placeholderFile);
          }
        } else {
          // Real Supabase upload
          // Simulate upload progress for better UX
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              if (prev >= 90) {
                clearInterval(progressInterval);
                return prev;
              }
              return prev + Math.random() * 15;
            });
          }, 100);

          // Generate unique filename with user ID and timestamp
          const fileExt = file.name.split(".").pop();
          const fileName = `${user.id}/${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;

          // Upload file to Supabase Storage
          const { data, error } = await supabase.storage
            .from("room-images")
            .upload(fileName, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (error) {
            throw error;
          }

          // Get the public URL for the uploaded file
          const {
            data: { publicUrl: realPublicUrl },
          } = supabase.storage.from("room-images").getPublicUrl(data.path);

          setUploadProgress(100);
          clearInterval(progressInterval);
          publicUrl = realPublicUrl;
        }

        // Store both local and hosted URLs
        if (!mockFileUpload) {
          setLocalImageUrl(file); // Keep local URL for immediate preview (only if not mock)
        }
        setHostedImageUrl(publicUrl); // Store hosted/mock URL for API calls

        // Small delay to show completion
        setTimeout(() => {
          router.push("/analyze");
        }, 500);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload fehlgeschlagen. Bitte versuchen Sie es erneut.");
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [
      setLocalImageUrl,
      setHostedImageUrl,
      resetForNewImage,
      resetImageModal,
      router,
      user,
      supabase,
      mockFileUpload,
      simulateUpload,
    ]
  );

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer?.files || []);
      const imageFile = files.find((file) => file.type.startsWith("image/"));

      if (imageFile) {
        handleFileSelect(imageFile);
      } else if (files.length > 0) {
        alert("Bitte ziehen Sie eine Bilddatei hierher.");
      }
    },
    [handleFileSelect]
  );

  const handleDragEvents = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      // Check if we're actually leaving the drop zone
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;

      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        setIsDragging(false);
      }
    }
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const toggleInspiration = useCallback(() => {
    const newShowInspiration = !showInspiration;
    setShowInspiration(newShowInspiration);

    // Update URL without page refresh
    const url = new URL(window.location.href);
    if (newShowInspiration) {
      url.searchParams.set("gallery", "true");
    } else {
      url.searchParams.delete("gallery");
    }
    window.history.replaceState({}, "", url.toString());
  }, [showInspiration]);

  if (showInspiration) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <InspirationGallery onClose={toggleInspiration} />
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center">
      <motion.div
        variants={reducedMotion ? {} : staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl flex flex-col items-center text-center px-4 sm:px-6 py-8 sm:py-12 md:py-20"
      >
        {/* Hero Section */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="mb-8 md:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-base-content mb-4 md:mb-6 leading-tight">
            Verwandle deinen Raum.
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-base-content/60 max-w-2xl mx-auto leading-relaxed">
            Lade ein Foto hoch und lass dich von Designvorschlägen inspirieren.
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="w-full max-w-2xl mb-8 md:mb-12"
        >
          <motion.div
            variants={dragVariants}
            animate={isDragging ? "dragging" : "idle"}
            onDrop={handleDrop}
            onDragEnter={handleDragEvents}
            onDragOver={handleDragEvents}
            onDragLeave={handleDragEvents}
            className={`relative min-h-[280px] sm:min-h-[320px] md:min-h-[420px] flex flex-col items-center justify-center border-2 border-dashed rounded-3xl cursor-pointer select-none group transition-all duration-300 hover:shadow-lg ${
              isDragging
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-base-content/20 hover:border-base-content/30 hover:bg-base-200/50"
            }`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            aria-label="Klicken Sie hier oder ziehen Sie ein Bild hierher zum Hochladen"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              accept="image/*"
              aria-describedby="file-upload-description"
            />

            <AnimatePresence mode="wait">
              {isUploading ? (
                <ProgressIndicator progress={uploadProgress} />
              ) : (
                <motion.div
                  key="upload-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center p-4 space-y-6 md:space-y-8"
                >
                  <UploadIcon isDragging={isDragging} />

                  <div className="space-y-2 md:space-y-4">
                    <p className="font-semibold text-xl sm:text-2xl text-base-content">
                      <span className="text-primary">Foto auswählen</span> oder
                      hierher ziehen
                    </p>
                    <p
                      id="file-upload-description"
                      className="text-sm text-base-content/40"
                    >
                      PNG, JPG, WEBP bis 10MB
                    </p>
                    {mockFileUpload && (
                      <div className="flex items-center justify-center gap-2 mt-2 px-3 py-1 bg-warning/10 border border-warning/20 rounded-lg">
                        <svg
                          className="w-4 h-4 text-warning"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-xs font-medium text-warning">
                          Mock-Modus aktiv
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Inspiration CTA */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="flex flex-col items-center space-y-4 md:space-y-6"
        >
          <div className="flex items-center space-x-4 text-base-content/40">
            <div className="h-px bg-base-300 w-12 md:w-16"></div>
            <span className="text-sm font-medium">oder</span>
            <div className="h-px bg-base-300 w-12 md:w-16"></div>
          </div>

          <motion.button
            variants={reducedMotion ? {} : buttonVariants}
            whileHover={reducedMotion ? {} : "hover"}
            whileTap={reducedMotion ? {} : "tap"}
            onClick={toggleInspiration}
            className="group flex items-center space-x-3 px-6 md:px-8 py-3 md:py-4 bg-base-100/60 hover:bg-base-100/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-base-300/50 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <svg
              className="w-5 h-5 text-base-content/60 group-hover:text-primary transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-semibold text-sm md:text-base text-base-content/70 group-hover:text-primary transition-colors">
              KI-Transformationen entdecken
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UploadForm;
