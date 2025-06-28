"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import { useImageModalStore } from "@/utils/useImageModalStore";
import DiffSlider from "@/components/DiffSlider";
import {
  staggerContainer,
  staggerItem,
  useMotionPreference,
} from "@/utils/animations";

interface InspirationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Mock inspiration data - in production, this would come from an API or CMS
const getInspirationData = (id: string) => {
  return {
    id,
    title: "Moderne Wohnzimmer-Transformation",
    description:
      "Sehen Sie, wie KI einen traditionellen Raum in einen modernen, minimalistischen Wohnbereich verwandelt. Diese Transformation zeigt das Potenzial von intelligenten Designvorschlägen.",
    beforeImage: "/assets/images/inspirationBefore.png",
    afterImage: "/assets/images/inspirationAfter.png",
    category: "Wohnzimmer",
    style: "Moderner Minimalismus",
    aiFeatures: [
      "Farbharmonie-Analyse",
      "Möbel-Platzierung",
      "Beleuchtungsoptimierung",
      "Raumaufteilung",
    ],
    insights: [
      "Die KI erkannte die bestehende Architektur und bewahrte den Charme des Raumes",
      "Warme Akzentfarben wurden beibehalten, während die Gesamtpalette modernisiert wurde",
      "Die Möbelanordnung wurde für besseren Lichteinfall optimiert",
    ],
  };
};

const InspirationDetailPage = ({ params }: InspirationDetailPageProps) => {
  const router = useRouter();
  const { openModal } = useImageModalStore();
  const reducedMotion = useMotionPreference();

  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);
  const inspiration = getInspirationData(resolvedParams.id);

  const handleBackToGallery = () => {
    router.push("/?gallery=true");
  };

  const handleStartOwnTransformation = () => {
    router.push("/");
  };

  return (
    <motion.div
      variants={reducedMotion ? {} : staggerContainer}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-base-100 py-8 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="text-center mb-8 md:mb-12"
        >
          <motion.button
            onClick={handleBackToGallery}
            className="inline-flex items-center text-base-content/60 hover:text-base-content font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-4 py-2 mb-6"
            whileHover={{ x: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Zurück zur Galerie
          </motion.button>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-base-content mb-4">
            {inspiration.title}
          </h1>
          <p className="text-lg text-base-content/60 max-w-3xl mx-auto leading-relaxed">
            {inspiration.description}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium text-sm">
              {inspiration.category}
            </span>
            <span className="px-4 py-2 bg-base-200 text-base-content/70 rounded-xl font-medium text-sm">
              {inspiration.style}
            </span>
          </div>
        </motion.div>

        {/* Main Diff Slider */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="mb-12"
        >
          <DiffSlider
            beforeImageUrl={inspiration.beforeImage}
            afterImageUrl={inspiration.afterImage}
            beforeLabel="Vorher"
            afterLabel="Nachher"
            onBeforeImageClick={openModal}
            onAfterImageClick={openModal}
            className="max-w-4xl mx-auto shadow-xl"
            aspectRatio="aspect-[4/3]"
            showInstructionText={true}
          />
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* AI Features */}
          <motion.div
            variants={reducedMotion ? {} : staggerItem}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-base-content">
              KI-Features in Aktion
            </h2>
            <div className="space-y-4">
              {inspiration.aiFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={reducedMotion ? {} : staggerItem}
                  className="flex items-center gap-3 p-4 bg-base-200/50 rounded-xl border border-base-300/50"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-base-content">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Insights */}
          <motion.div
            variants={reducedMotion ? {} : staggerItem}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-base-content">
              Design-Einblicke
            </h2>
            <div className="space-y-4">
              {inspiration.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  variants={reducedMotion ? {} : staggerItem}
                  className="p-4 bg-base-100 rounded-xl border border-base-300 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-base-content/80 leading-relaxed">
                      {insight}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="text-center mt-12 lg:mt-16"
        >
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
            <h3 className="text-2xl font-bold text-base-content mb-4">
              Bereit für Ihre eigene Transformation?
            </h3>
            <p className="text-base-content/60 mb-6 max-w-2xl mx-auto">
              Laden Sie ein Foto Ihres Raumes hoch und entdecken Sie, wie unsere
              KI Ihren Wohntraum verwirklichen kann.
            </p>
            <motion.button
              onClick={handleStartOwnTransformation}
              className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary-focus text-primary-content font-semibold rounded-xl transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Jetzt eigenes Bild hochladen
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InspirationDetailPage;
