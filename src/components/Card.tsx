"use client";

import type React from "react";
import { motion } from "framer-motion";
import { useAppState } from "@/utils/store";

interface Props {
  title: string;
  text: string;
  className?: string;
}

const colors = {
  highlight: "#34D399",
  initial: "#ffffffcc",
  activeText: "#111827",
  initialText: "#374151",
  glow: "rgba(52, 211, 153, 0.18)",
};

const regularShadow =
  "0 2px 8px 0 rgba(0,0,0,0.04), 0 1.5px 3px 0 rgba(0,0,0,0.03)";
const activeGlow = `0 0 0 2px ${colors.glow}`;

const Card = ({ title, text, className }: Props) => {
  const { appliedSuggestions, toggleAppliedSuggestion } = useAppState();
  const active = appliedSuggestions.has(title);

  const toggleActive = () => {
    toggleAppliedSuggestion(title);
  };

  const cardVariants = {
    initial: {
      boxShadow: regularShadow,
      border: "1.5px solid rgba(200,200,200,0.18)",
      scale: 1,
      background: "linear-gradient(135deg, #f8fafc 80%, #e0f7ef 100%)",
    },
    active: {
      boxShadow: `${regularShadow}, ${activeGlow}`,
      border: `1.5px solid ${colors.highlight}`,
      scale: 1.035,
      background: "linear-gradient(135deg, #f8fafc 70%, #d1fae5 100%)",
    },
    hover: {
      scale: 1.025,
      boxShadow: `${regularShadow}, 0 2px 16px 0 rgba(52,211,153,0.08)`,
    },
  };

  return (
    <motion.div
      className={`card relative rounded-3xl w-full overflow-hidden border transition-all duration-100 ${
        className || ""
      }`}
      initial="initial"
      animate={active ? "active" : "initial"}
      {...(active ? {} : { whileHover: "hover" })}
      whileTap={{ scale: 0.98 }}
      variants={cardVariants}
      transition={{ duration: 0.12, ease: [0.0, 0.0, 0.2, 1] }}
      onClick={toggleActive}
      style={{ cursor: "pointer" }}
    >
      {/* Minimal checkmark overlay when selected */}
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
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="9" fill="white" />
            <path
              d="M6.5 10.5L9 13L14 8"
              stroke="#34D399"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}
      <div className="card-body relative z-10 bg-transparent px-8 py-7 flex flex-col gap-2">
        <motion.h2
          className="card-title text-2xl font-bold text-gray-900 tracking-tight mb-1"
          style={{ fontFamily: "SF Pro Display, Inter, sans-serif" }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-gray-600 text-base font-light leading-relaxed"
          style={{ fontFamily: "SF Pro Display, Inter, sans-serif" }}
        >
          {text}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Card;
