"use client";

import { useAppState } from "@/utils/store";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { motion } from "motion/react";
import ReusableButton from "@/app/components/AnimatedButton";
import { useImageModalStore } from "@/utils/useImageModalStore";
import { useRef, useState, useEffect } from "react";
import { DownloadIcon, EditIcon, StartOverIcon } from "@/app/components/Icons";

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
  const figureRef = useRef<HTMLDivElement>(null);

  // Simulate loading for 2.5s
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

  // Modal click logic for before/after
  const handleFigureClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const figure = figureRef.current;
    if (!figure) return;
    // DaisyUI diff uses grid-template-columns for the divider
    const gtc = getComputedStyle(figure).getPropertyValue(
      "grid-template-columns"
    );
    const dividerPosition = Number.parseFloat(gtc.split(" ")[0]);
    const clickX = e.clientX - figure.getBoundingClientRect().left;
    if (clickX < dividerPosition) {
      if (localImageUrl) openModal(localImageUrl);
    } else {
      openModal(generatedImageUrl);
    }
  };

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
      ) : (
        <>
          {localImageUrl && (
            <motion.figure
              className="diff aspect-16/9 rounded-xl relative"
              variants={itemVariants}
              ref={figureRef}
              onClick={handleFigureClick}
            >
				  <div className="absolute left-4 top-4 z-10 px-3 py-1.5 rounded-full bg-white/80 text-gray-700 text-xs font-medium shadow-sm select-none pointer-events-none">
                Vorher
              </div>
              <div className="absolute right-4 top-4 z-10 px-3 py-1.5 rounded-full bg-white/80 text-gray-700 text-xs font-medium shadow-sm select-none pointer-events-none">
                Nachher
              </div>
              <div className="diff-item-1" role="img">
                <Image
                  width={800}
                  height={800}
                  alt="daisy"
                  src={localImageUrl}
                />
              </div>
              <div className="diff-item-2" role="img">
                <img
                  alt="daisy"
                  src="https://img.daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a-blur.webp"
                />
              </div>
              <div className="diff-resizer" />
            </motion.figure>
          )}

          <motion.div
            className="flex flex-col md:flex-row gap-4 items-evenly justify-center"
            variants={itemVariants}
          >
            <ReusableButton color={"blue"}>
              <DownloadIcon />
              Bild herunterladen
            </ReusableButton>
            <Link href="/suggestions" className="btn btn-ghost rounded-lg h-14">
              <EditIcon />
              Vorschläge bearbeiten
            </Link>
            <Link href="/" className="btn btn-ghost rounded-lg h-14">
              <StartOverIcon />
              Neu beginnen
            </Link>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default ResultPage;
