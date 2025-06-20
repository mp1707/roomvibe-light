"use client";

import { useAppState } from "@/utils/store";
import { useImageModalStore } from "@/utils/useImageModalStore";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Loader from "./components/Loader";
import ResultDisplay from "./components/ResultDisplay";
import ActionButtons from "./components/ActionButtons";

const inspirationalTexts = [
  "Ihr neuer Raum wird gestaltet...",
  "Magie wird gewirkt...",
  "Die Pinsel werden geschwungen...",
  "Fast fertig...",
];

const ResultPage = () => {
  const { localImageUrl } = useAppState();
  const { openModal } = useImageModalStore();
  const [loading, setLoading] = useState(true);
  const [loaderTextIdx, setLoaderTextIdx] = useState(0);

  useEffect(() => {
    setLoading(true);
    setLoaderTextIdx(0);
    const interval = setInterval(() => {
      setLoaderTextIdx((idx) => (idx + 1) % inspirationalTexts.length);
    }, 1200);
    const timeout = setTimeout(() => {
      setLoading(false);
      clearInterval(interval);
    }, 2500);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [localImageUrl]);

  const generatedImageUrl =
    "https://img.daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a-blur.webp";

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="flex flex-col gap-8 items-center justify-center w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center" variants={itemVariants}>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Dein Raum, neu erfunden.
        </h2>
        <p className="text-gray-500 mt-2">
          Bewege den Regler, um den Zauber zu sehen!
        </p>
      </motion.div>

      {loading ? (
        <Loader loaderTextIdx={loaderTextIdx} />
      ) : (
        <>
          {localImageUrl && (
            <ResultDisplay
              localImageUrl={localImageUrl}
              generatedImageUrl={generatedImageUrl}
              openModal={openModal}
              itemVariants={itemVariants}
            />
          )}
          <ActionButtons itemVariants={itemVariants} />
        </>
      )}
    </motion.div>
  );
};

export default ResultPage;
