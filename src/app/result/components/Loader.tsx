"use client";
import { motion } from "framer-motion";

const inspirationalTexts = [
  "Ihr neuer Raum wird gestaltet...",
  "Magie wird gewirkt...",
  "Die Pinsel werden geschwungen...",
  "Fast fertig...",
];

interface LoaderProps {
  loaderTextIdx: number;
}

const Loader: React.FC<LoaderProps> = ({ loaderTextIdx }) => {
  return (
    <div className="w-full max-w-3xl">
      <motion.div
        className="diff aspect-16/9 rounded-xl relative bg-gray-200 animate-pulse"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="diff-item-1">
          <div className="bg-gray-300 w-full h-full" />
        </div>
        <div className="diff-item-2">
          <div className="bg-gray-400 w-full h-full" />
        </div>
        <div className="diff-resizer" />
      </motion.div>
      <motion.p
        className="text-lg text-blue-600 font-medium mt-4 text-center"
        key={loaderTextIdx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
      >
        {inspirationalTexts[loaderTextIdx]}
      </motion.p>
    </div>
  );
};

export default Loader;
