"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppState } from "@/utils/store";
import {
  staggerContainer,
  staggerItem,
  cardVariants,
} from "@/utils/animations";

interface InspirationImage {
  id: string;
  src: string;
  alt: string;
  style: string;
}

// Curated inspiration images - in production, these would come from a CMS or API
const inspirationImages: InspirationImage[] = [
  {
    id: "modern-living",
    src: "/assets/images/hero.png",
    alt: "Modern minimalist living room with clean lines",
    style: "Moderner Minimalismus",
  },
  {
    id: "cozy-bedroom",
    src: "/assets/images/hero2.png",
    alt: "Cozy bedroom with warm lighting",
    style: "Gemütliches Schlafzimmer",
  },
  {
    id: "scandinavian-kitchen",
    src: "/assets/images/hero3.png",
    alt: "Scandinavian kitchen with natural materials",
    style: "Skandinavische Küche",
  },
  {
    id: "industrial-loft",
    src: "/assets/images/hero4.jpeg",
    alt: "Industrial loft with exposed brick",
    style: "Industrial Loft",
  },
  {
    id: "boho-living",
    src: "/assets/images/hero5.jpeg",
    alt: "Bohemian living space with plants",
    style: "Bohemian Stil",
  },
  {
    id: "luxury-bathroom",
    src: "/assets/images/hero6.jpeg",
    alt: "Luxury bathroom with marble finishes",
    style: "Luxus Badezimmer",
  },
];

interface InspirationCardProps {
  image: InspirationImage;
  onSelect: (image: InspirationImage) => void;
}

const InspirationCard = ({ image, onSelect }: InspirationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-shadow duration-300 hover:shadow-xl"
      onClick={() => onSelect(image)}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Liquid Glass Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center"
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
            className="px-6 py-3 bg-white/90 backdrop-blur-sm rounded-xl font-semibold text-gray-800 border border-white/20 shadow-lg hover:bg-white/95 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(image);
            }}
          >
            Diesen Stil verwenden
          </motion.button>
        </motion.div>
      </div>

      {/* Style Label */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-center text-sm">
          {image.style}
        </h3>
      </div>
    </motion.div>
  );
};

interface InspirationGalleryProps {
  onClose?: () => void;
}

const InspirationGallery = ({ onClose }: InspirationGalleryProps) => {
  const router = useRouter();
  const { setLocalImageUrl } = useAppState();

  const handleImageSelect = async (image: InspirationImage) => {
    try {
      // Convert the inspiration image to a blob for consistent handling
      const response = await fetch(image.src);
      const blob = await response.blob();
      const file = new File([blob], `inspiration-${image.id}.jpg`, {
        type: blob.type,
      });

      setLocalImageUrl(file);
      router.push("/suggestions");
    } catch (error) {
      console.error("Failed to load inspiration image:", error);
      // Fallback: navigate directly with the URL
      router.push("/suggestions");
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl mx-auto"
    >
      <motion.div variants={staggerItem} className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800 mb-4">
          Lassen Sie sich inspirieren
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Wählen Sie einen Stil aus unserer kuratierten Galerie und sehen Sie,
          wie KI Ihren Raum verwandeln kann.
        </p>
      </motion.div>

      <motion.div
        variants={staggerItem}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {inspirationImages.map((image) => (
          <InspirationCard
            key={image.id}
            image={image}
            onSelect={handleImageSelect}
          />
        ))}
      </motion.div>

      {onClose && (
        <motion.div variants={staggerItem} className="text-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-4 py-2"
          >
            ← Zurück zum Upload
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InspirationGallery;
