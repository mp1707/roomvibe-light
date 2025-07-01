"use client";

import type React from "react";
import { motion } from "framer-motion";
import { useAppState } from "@/utils/store";
import { cardVariants, useMotionPreference } from "@/utils/animations";

interface Props {
  title: string;
  text: string;
  className?: string;
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const Card = ({ title, text, className }: Props) => {
  const { appliedSuggestions, toggleAppliedSuggestion } = useAppState();
  const active = appliedSuggestions.has(title);
  const reducedMotion = useMotionPreference();

  const handleToggle = () => {
    toggleAppliedSuggestion(title);
  };

  return (
    <motion.div
      variants={reducedMotion ? {} : cardVariants}
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      whileHover={reducedMotion ? {} : "hover"}
      whileTap={reducedMotion ? {} : "tap"}
      className={`group p-5 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ease-out relative ${
        active
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 cursor-pointer"
          : "border-base-300 bg-base-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
      }`}
      onClick={handleToggle}
      style={{ cursor: "pointer" }}
    >
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{
            type: "spring",
            stiffness: 900,
            damping: 40,
            mass: 0.5,
          }}
          className="absolute top-5 right-5 z-20 bg-white rounded-full p-0.5 shadow-md border border-gray-200"
        >
          <CheckIcon className="h-4 w-4 text-primary" />
        </motion.div>
      )}
      <div className="card-body relative z-10 bg-transparent px-8 py-7 flex flex-col gap-2">
        <h2
          className="card-title text-lg sm:text-xl font-semibold text-base-content leading-tight flex-1"
        >
          {title}
        </h2>
        <p
          className="text-base-content/60 text-sm sm:text-base leading-relaxed mb-3"
        >
          {text}
        </p>
      </div>
    </motion.div>
  );
};

export default Card;
