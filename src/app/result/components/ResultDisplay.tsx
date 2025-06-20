"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { EnlargeIcon } from "@/app/components/Icons";

interface ResultDisplayProps {
  localImageUrl: string;
  generatedImageUrl: string;
  openModal: (url: string) => void;
  itemVariants: any;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  localImageUrl,
  generatedImageUrl,
  openModal,
  itemVariants,
}) => {
  return (
    <motion.figure
      className="diff aspect-16/9 rounded-xl relative"
      variants={itemVariants}
    >
      <motion.div
        className="absolute left-4 top-4 z-10 cursor-pointer select-none rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm flex items-center gap-1"
        onClick={() => localImageUrl && openModal(localImageUrl)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <EnlargeIcon />
        Vorher
      </motion.div>
      <motion.div
        className="absolute right-4 top-4 z-10 cursor-pointer select-none rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm flex items-center gap-1"
        onClick={() => openModal(generatedImageUrl)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <EnlargeIcon />
        Nachher
      </motion.div>
      <div className="diff-item-1" role="img">
        <Image width={800} height={800} alt="daisy" src={localImageUrl} />
      </div>
      <div className="diff-item-2" role="img">
        <img alt="daisy" src={generatedImageUrl} />
      </div>
      <div className="diff-resizer" />
    </motion.figure>
  );
};

export default ResultDisplay;
