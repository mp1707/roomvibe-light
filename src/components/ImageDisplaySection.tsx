import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import toast from "react-hot-toast";
import AILoadingScreen from "@/components/AILoadingScreen";
import DiffSlider from "@/components/DiffSlider";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useMotionPreference, buttonVariants } from "@/utils/animations";
import { useAppState } from "@/utils/store";
import { useImageModalStore } from "@/utils/useImageModalStore";
import { downloadImage, isDownloadSupported } from "@/utils/downloadUtils";

interface ImageDisplaySectionProps {
  generationProgress: number;
  mode?: "suggestions" | "styles"; // Determines loading steps and messages
  currentImage?: string | null; // Override for current generated image (for styles)
}

const ImageDisplaySection = ({
  generationProgress,
  mode = "suggestions",
  currentImage,
}: ImageDisplaySectionProps) => {
  const t = useTranslations("Components.ImageDisplaySection");
  const router = useRouter();
  const reducedMotion = useMotionPreference();
  const { openModal, reset: resetImageModal } = useImageModalStore();

  const {
    localImageUrl,
    isGenerating,
    currentGeneratedImage,
    resetForNewImage,
  } = useAppState();

  // Use currentImage prop if provided, otherwise fall back to store value
  const displayImage = useMemo(() => {
    if (currentImage !== undefined) {
      return currentImage;
    }
    return currentGeneratedImage;
  }, [currentImage, currentGeneratedImage]);

  const handleNavigateToUpload = useCallback(() => {
    resetForNewImage();
    resetImageModal();
    router.push("/");
  }, [router, resetForNewImage, resetImageModal]);

  const handleImageClick = useCallback(
    (imageUrl: string) => {
      openModal(imageUrl);
    },
    [openModal]
  );

  const handleDownloadImage = useCallback(async () => {
    if (!displayImage) return;

    try {
      const fileName = `roomvibe-design-${new Date()
        .toISOString()
        .slice(0, 10)}-${Date.now()}.jpg`;
      await downloadImage(displayImage, fileName);
      toast.success(t("downloadSuccess"));
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(t("downloadError"));
    }
  }, [displayImage, t]);

  // Early return for missing image
  if (!localImageUrl) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4"
      >
        <p className="text-base-content/50 mb-6">{t("pleaseUploadImage")}</p>
        <Link
          href="/"
          className="px-6 py-3 bg-primary text-primary-content rounded-xl font-semibold hover:bg-primary-focus transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {t("uploadImage")}
        </Link>
      </motion.div>
    );
  }

  const imageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Loading steps based on mode
  const getLoadingSteps = () => {
    if (mode === "styles") {
      return [
        t("planningStyleTransformation"),
        t("preparingGeneration"),
        t("generatingStyleImage"),
      ];
    }
    return [
      t("planningAdjustments"),
      t("preparingGeneration"),
      t("generatingImage"),
    ];
  };

  return (
    <motion.div variants={imageVariants} className="w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <AILoadingScreen
              progress={generationProgress}
              steps={getLoadingSteps()}
              hint={t("generationHint")}
              mode="generate"
              currentGeneratedImage={displayImage}
            />
          </motion.div>
        ) : displayImage ? (
          <motion.div
            key="diff-slider"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <div className="text-center mb-4">
              <p className="text-base-content/60">{t("sliderInstruction")}</p>
            </div>

            <DiffSlider
              beforeImageUrl={localImageUrl}
              afterImageUrl={displayImage}
              beforeLabel={t("originalLabel")}
              afterLabel={t("currentLabel")}
              onBeforeImageClick={() => handleImageClick(localImageUrl)}
              onAfterImageClick={() => handleImageClick(displayImage)}
              className="shadow-xl rounded-2xl"
              aspectRatio="aspect-[4/3]"
              showInstructionText={true}
            />

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6"
            >
              <motion.button
                onClick={handleDownloadImage}
                disabled={!displayImage || !isDownloadSupported()}
                variants={reducedMotion ? {} : buttonVariants}
                whileHover={reducedMotion ? {} : "hover"}
                whileTap={reducedMotion ? {} : "tap"}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-content font-semibold rounded-xl shadow-lg transition-all duration-300 hover:bg-primary-focus hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px] justify-center"
                aria-label={t("downloadImageAria")}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {t("downloadImageText")}
              </motion.button>

              <motion.button
                onClick={handleNavigateToUpload}
                variants={reducedMotion ? {} : buttonVariants}
                whileHover={reducedMotion ? {} : "hover"}
                whileTap={reducedMotion ? {} : "tap"}
                className="flex items-center gap-2 px-6 py-3 bg-base-200 text-base-content font-semibold rounded-xl border border-base-300 transition-all duration-300 hover:bg-base-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[160px] justify-center"
                aria-label={t("newImageAria")}
              >
                <ArrowLeftIcon className="w-5 h-5" />
                {t("newImageText")}
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="original-image"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full text-center"
          >
            <button
              type="button"
              className="cursor-pointer relative rounded-2xl shadow-xl overflow-hidden w-full max-w-2xl mx-auto"
              onClick={() => handleImageClick(localImageUrl)}
            >
              <Image
                src={localImageUrl}
                className="w-full h-auto object-cover aspect-[4/3] rounded-2xl"
                width={800}
                height={600}
                alt="Original uploaded image"
                priority
              />
            </button>

            {/* Action Buttons for Original Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6"
            >
              <motion.button
                onClick={handleNavigateToUpload}
                variants={reducedMotion ? {} : buttonVariants}
                whileHover={reducedMotion ? {} : "hover"}
                whileTap={reducedMotion ? {} : "tap"}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-content font-semibold rounded-xl shadow-lg transition-all duration-300 hover:bg-primary-focus hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[160px] justify-center"
                aria-label={t("newImageAria")}
              >
                <ArrowLeftIcon className="w-5 h-5" />
                {t("newImageText")}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageDisplaySection;
