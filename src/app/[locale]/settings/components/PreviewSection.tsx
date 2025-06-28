"use client";

import { motion, AnimatePresence } from "framer-motion";

interface PreviewSectionProps {
  isVisible: boolean;
  title: string;
  icon: React.ReactNode;
  images: Array<{ src: string; alt: string }>;
  isMultiple?: boolean;
}

const previewVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const PreviewSection = ({
  isVisible,
  title,
  icon,
  images,
  isMultiple = false,
}: PreviewSectionProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={previewVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="bg-base-200/50 rounded-lg border border-base-300/50 p-3 ml-4"
        >
          <h4 className="text-sm font-medium text-base-content mb-2 flex items-center gap-2">
            {icon}
            {title}
          </h4>
          <div className="flex gap-2">
            {images.map((image, index) => (
              <div
                key={index}
                className="w-16 h-16 rounded-lg overflow-hidden border border-base-300"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
