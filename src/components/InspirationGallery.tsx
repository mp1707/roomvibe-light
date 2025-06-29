"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { useAppState } from "@/utils/store";
import { useTranslations } from "next-intl";
import {
  staggerContainer,
  staggerItem,
  cardVariants,
  useMotionPreference,
} from "@/utils/animations";

interface InspirationExample {
  id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
  category: string;
  style: string;
  description: string;
}

interface InspirationCardProps {
  example: InspirationExample;
  onSelect: (example: InspirationExample) => void;
}

const InspirationCard = ({ example, onSelect }: InspirationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const t = useTranslations("Components.InspirationGallery");

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer overflow-hidden rounded-2xl bg-base-100 shadow-sm border border-base-300 transition-shadow duration-300 hover:shadow-xl"
      onClick={() => onSelect(example)}
    >
      {/* Split Preview Container */}
      <div className="aspect-[4/3] relative overflow-hidden">
        {/* After Image (Right Side) */}
        <div className="absolute inset-0">
          <Image
            src={example.afterImage}
            alt={`${example.title} - ${t("after")}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Before Image (Left Side) with clip-path */}
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          }}
        >
          <Image
            src={example.beforeImage}
            alt={`${example.title} - ${t("before")}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Split Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/60 shadow-sm z-10"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        />

        {/* Before/After Labels */}
        <div className="absolute top-3 left-3 z-20">
          <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md backdrop-blur-sm">
            {t("before")}
          </span>
        </div>
        <div className="absolute top-3 right-3 z-20">
          <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md backdrop-blur-sm">
            {t("after")}
          </span>
        </div>

        {/* Liquid Glass Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-30"
        >
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: isHovered ? 1 : 0.8,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              delay: 0.1,
            }}
            className="px-6 py-3 bg-base-100/90 backdrop-blur-sm rounded-xl font-semibold text-base-content border border-base-100/20 shadow-lg hover:bg-base-100/95 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(example);
            }}
          >
            {t("transformationButton")}
          </motion.button>
        </motion.div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base-content text-sm">
            {example.title}
          </h3>
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg">
            {example.style}
          </span>
        </div>
        <p className="text-xs text-base-content/60 leading-relaxed">
          {example.description}
        </p>
      </div>
    </motion.div>
  );
};

interface InspirationGalleryProps {
  onClose?: () => void;
}

const InspirationGallery = ({ onClose }: InspirationGalleryProps) => {
  const router = useRouter();
  const reducedMotion = useMotionPreference();
  const t = useTranslations("Components.InspirationGallery");

  // Mock inspiration examples - using translations for data
  const inspirationExamples: InspirationExample[] = [
    {
      id: "modern-living-1",
      title: t("examples.modernLiving1.title"),
      beforeImage: "/assets/images/inspirationBefore.png",
      afterImage: "/assets/images/inspirationAfter.png",
      category: t("examples.modernLiving1.category"),
      style: t("examples.modernLiving1.style"),
      description: t("examples.modernLiving1.description"),
    },
    {
      id: "modern-living-2",
      title: t("examples.modernLiving2.title"),
      beforeImage: "/assets/images/inspirationBefore.png",
      afterImage: "/assets/images/inspirationAfter.png",
      category: t("examples.modernLiving2.category"),
      style: t("examples.modernLiving2.style"),
      description: t("examples.modernLiving2.description"),
    },
    {
      id: "modern-living-3",
      title: t("examples.modernLiving3.title"),
      beforeImage: "/assets/images/inspirationBefore.png",
      afterImage: "/assets/images/inspirationAfter.png",
      category: t("examples.modernLiving3.category"),
      style: t("examples.modernLiving3.style"),
      description: t("examples.modernLiving3.description"),
    },
    {
      id: "modern-living-4",
      title: t("examples.modernLiving4.title"),
      beforeImage: "/assets/images/inspirationBefore.png",
      afterImage: "/assets/images/inspirationAfter.png",
      category: t("examples.modernLiving4.category"),
      style: t("examples.modernLiving4.style"),
      description: t("examples.modernLiving4.description"),
    },
    {
      id: "modern-living-5",
      title: t("examples.modernLiving5.title"),
      beforeImage: "/assets/images/inspirationBefore.png",
      afterImage: "/assets/images/inspirationAfter.png",
      category: t("examples.modernLiving5.category"),
      style: t("examples.modernLiving5.style"),
      description: t("examples.modernLiving5.description"),
    },
    {
      id: "modern-living-6",
      title: t("examples.modernLiving6.title"),
      beforeImage: "/assets/images/inspirationBefore.png",
      afterImage: "/assets/images/inspirationAfter.png",
      category: t("examples.modernLiving6.category"),
      style: t("examples.modernLiving6.style"),
      description: t("examples.modernLiving6.description"),
    },
  ];

  const handleExampleSelect = (example: InspirationExample) => {
    router.push(`/inspiration/${example.id}`);
  };

  return (
    <motion.div
      variants={reducedMotion ? {} : staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto"
    >
      <motion.div
        variants={reducedMotion ? {} : staggerItem}
        className="text-center mb-8 md:mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-base-content mb-4">
          {t("title")}
        </h2>
        <p className="text-lg text-base-content/60 max-w-3xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
      </motion.div>

      <motion.div
        variants={reducedMotion ? {} : staggerItem}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {inspirationExamples.map((example, index) => (
          <motion.div
            key={example.id}
            variants={reducedMotion ? {} : staggerItem}
            custom={index}
          >
            <InspirationCard example={example} onSelect={handleExampleSelect} />
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        variants={reducedMotion ? {} : staggerItem}
        className="text-center space-y-6"
      >
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 md:p-8 border border-primary/10">
          <h3 className="text-xl md:text-2xl font-bold text-base-content mb-3">
            {t("readyTitle")}
          </h3>
          <p className="text-base-content/60 mb-4 max-w-2xl mx-auto">
            {t("readySubtitle")}
          </p>
          <motion.button
            onClick={() => router.push("/")}
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-focus text-primary-content font-semibold rounded-xl transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
              />
            </svg>
            {t("uploadImageButton")}
          </motion.button>
        </div>

        <motion.button
          onClick={() => router.push("/")}
          className="text-base-content/60 hover:text-base-content font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-4 py-2"
          whileHover={{ x: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          ← {t("backToHome")}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default InspirationGallery;
