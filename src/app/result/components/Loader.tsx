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
    <motion.div
      className="flex flex-col items-center justify-center w-full min-h-[340px] md:min-h-[420px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="rounded-xl border-2 border-dashed border-blue-200 bg-base-100 flex items-center justify-center aspect-16/9 w-full max-w-3xl mb-8"
        initial={{ scale: 0.97, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        <svg
          width="180"
          height="120"
          viewBox="0 0 180 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto"
        >
          <rect
            x="10"
            y="10"
            width="160"
            height="100"
            rx="16"
            stroke="#007AFF"
            strokeWidth="3"
            strokeDasharray="8 6"
            fill="none"
          />
          <rect
            x="40"
            y="40"
            width="100"
            height="40"
            rx="8"
            stroke="#007AFF"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />
        </svg>
      </motion.div>
      <motion.p
        className="text-lg text-blue-600 font-medium mt-2"
        key={loaderTextIdx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
      >
        {inspirationalTexts[loaderTextIdx]}
      </motion.p>
    </motion.div>
  );
};

export default Loader;
