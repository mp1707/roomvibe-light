"use client";

import { useAppState } from "@/utils/store";
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
  const { setLocalImageUrl, setHostedImageUrl } = useAppState();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showInspiration, setShowInspiration] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [supabase] = useState(() => createClient());
  const reducedMotion = useMotionPreference();

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

  const handleFileSelect = useCallback(
    async (file: File | null) => {
      if (!file) return;

      // Check if user is authenticated
      if (!user) {
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

      try {
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
          data: { publicUrl },
        } = supabase.storage.from("room-images").getPublicUrl(data.path);

        setUploadProgress(100);

        // Store both local and hosted URLs
        setLocalImageUrl(file); // Keep local URL for immediate preview
        setHostedImageUrl(publicUrl); // Store hosted URL for API calls

        // Small delay to show completion
        setTimeout(() => {
          router.push("/suggestions");
        }, 500);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload fehlgeschlagen. Bitte versuchen Sie es erneut.");
        setIsUploading(false);
        setUploadProgress(0);
        clearInterval(progressInterval);
      }
    },
    [setLocalImageUrl, setHostedImageUrl, router, user, supabase]
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
    setShowInspiration((prev) => !prev);
  }, []);

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
            Verwandeln Sie Ihren Raum.
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-base-content/60 max-w-2xl mx-auto leading-relaxed">
            Laden Sie ein Foto hoch und lassen Sie sich von KI-gestützten
            Designvorschlägen inspirieren.
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
              Inspiration-Galerie durchsuchen
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UploadForm;
