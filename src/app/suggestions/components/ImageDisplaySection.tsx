import { motion, AnimatePresence } from "framer-motion";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
}

const ImageDisplaySection = ({
  generationProgress,
}: ImageDisplaySectionProps) => {
  const router = useRouter();
  const reducedMotion = useMotionPreference();
  const { openModal, reset: resetImageModal } = useImageModalStore();

  const {
    localImageUrl,
    isGenerating,
    currentGeneratedImage,
    resetForNewImage,
  } = useAppState();

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
    if (!currentGeneratedImage) return;

    try {
      const fileName = `roomvibe-design-${new Date()
        .toISOString()
        .slice(0, 10)}-${Date.now()}.jpg`;
      await downloadImage(currentGeneratedImage, fileName);
      toast.success("Bild wurde erfolgreich heruntergeladen");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(
        "Das Bild konnte nicht heruntergeladen werden. Bitte versuchen Sie es erneut."
      );
    }
  }, [currentGeneratedImage]);

  // Early return for missing image
  if (!localImageUrl) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      >
        <h2 className="text-2xl font-semibold text-base-content/60 mb-4">
          Kein Bild gefunden
        </h2>
        <p className="text-base-content/50 mb-6">
          Bitte laden Sie zunächst ein Bild hoch.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-primary text-primary-content rounded-xl font-semibold hover:bg-primary-focus transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Bild hochladen
        </Link>
      </motion.div>
    );
  }

  const imageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
              steps={[
                "Plane die gewünschten Anpassungen...",
                "Bereite Bildgenerierung vor...",
                "Generiere dein neues Bild...",
              ]}
              title="Dein Vorschlag wird angewendet"
              subtitle="Wir arbeiten an deiner personalisierten Raumtransformation..."
              hint="Die Generierung dauert in der Regel 30-60 Sekunden"
              mode="generate"
              currentGeneratedImage={currentGeneratedImage}
            />
          </motion.div>
        ) : currentGeneratedImage ? (
          <motion.div
            key="diff-slider"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
                Dein Raum, Schritt für Schritt transformiert
              </h2>
              <p className="text-base-content/60">
                Bewege den Regler, um die Veränderungen zu sehen
              </p>
            </div>

            <DiffSlider
              beforeImageUrl={localImageUrl}
              afterImageUrl={currentGeneratedImage}
              beforeLabel="Original"
              afterLabel="Aktuell"
              onBeforeImageClick={() => handleImageClick(localImageUrl)}
              onAfterImageClick={() => handleImageClick(currentGeneratedImage)}
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
                disabled={!currentGeneratedImage || !isDownloadSupported()}
                variants={reducedMotion ? {} : buttonVariants}
                whileHover={reducedMotion ? {} : "hover"}
                whileTap={reducedMotion ? {} : "tap"}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-content font-semibold rounded-xl shadow-lg transition-all duration-300 hover:bg-primary-focus hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px] justify-center"
                aria-label="Transformiertes Bild herunterladen"
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
                Bild herunterladen
              </motion.button>

              <motion.button
                onClick={handleNavigateToUpload}
                variants={reducedMotion ? {} : buttonVariants}
                whileHover={reducedMotion ? {} : "hover"}
                whileTap={reducedMotion ? {} : "tap"}
                className="flex items-center gap-2 px-6 py-3 bg-base-200 text-base-content font-semibold rounded-xl border border-base-300 transition-all duration-300 hover:bg-base-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[160px] justify-center"
                aria-label="Neues Bild hochladen"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Neues Bild
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
            <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-4">
              Ihr Originalbild
            </h2>
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
                aria-label="Neues Bild hochladen"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Neues Bild
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageDisplaySection;
