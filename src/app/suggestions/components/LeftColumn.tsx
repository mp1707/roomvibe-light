import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ResetIcon, BackIcon } from "../../components/Icons";
import { useAppState } from "@/utils/store";
import { useImageModalStore } from "@/utils/useImageModalStore";

const LeftColumn = () => {
  const { localImageUrl } = useAppState();
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const { openModal } = useImageModalStore();

  if (!localImageUrl) return null;

  const handleImageClick = () => {
    if (localImageUrl) {
      openModal(localImageUrl);
    }
  };

  return (
    <motion.div
      className="w-full flex flex-col gap-6 p-4 lg:p-6"
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <h2 className="font-bold text-3xl lg:text-4xl text-gray-900 text-center mb-2">
        Ihr Originalbild
      </h2>

      <button
        type="button"
        className="cursor-pointer relative rounded-2xl shadow-xl overflow-hidden w-full"
        onClick={handleImageClick}
      >
        <motion.div
          animate={{
            filter: isDeleteHovered
              ? "blur(4px) grayscale(50%)"
              : "blur(0px) grayscale(0%)",
            scale: isDeleteHovered ? 1.03 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full"
        >
          <Image
            src={localImageUrl}
            className="w-full h-auto object-cover aspect-[4/3] rounded-2xl"
            width={800}
            height={600}
            alt="Original uploaded image"
            priority
          />
        </motion.div>

        <AnimatePresence>
          {isDeleteHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl"
            >
              <ResetIcon />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <Link
        href="/"
        onMouseEnter={() => setIsDeleteHovered(true)}
        onMouseLeave={() => setIsDeleteHovered(false)}
        className="flex justify-center"
      >
        <motion.span
          animate={{ scale: isDeleteHovered ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
        >
          <BackIcon />
          <span className="font-medium">Anderes Bild hochladen</span>
        </motion.span>
      </Link>
    </motion.div>
  );
};

export default LeftColumn;
