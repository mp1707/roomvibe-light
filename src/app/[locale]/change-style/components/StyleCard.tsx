"use client";

import { motion } from "framer-motion";
import { useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { cardVariants, useMotionPreference } from "@/utils/animations";
import { InteriorStyle } from "@/types/suggestions";

interface StyleCardProps {
  style: InteriorStyle;
  selected: boolean;
  onToggle: (styleId: string) => void;
  isApplied?: boolean;
  isGenerating?: boolean;
  delay?: number;
}

const StyleCard = ({
  style,
  selected,
  onToggle,
  isApplied = false,
  isGenerating = false,
  delay = 0,
}: StyleCardProps) => {
  const t = useTranslations("Components.StyleCard");
  const reducedMotion = useMotionPreference();
  const cardId = `style-${style.id}`;

  const handleToggle = useCallback(() => {
    if (!isApplied && !isGenerating) {
      onToggle(style.id);
    }
  }, [onToggle, style.id, isApplied, isGenerating]);

  return (
    <motion.div
      variants={reducedMotion ? {} : cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={reducedMotion ? {} : "hover"}
      whileTap={reducedMotion ? {} : "tap"}
      transition={{ delay }}
      className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ease-out cursor-pointer ${
        isApplied
          ? "border-success bg-success/10 shadow-lg shadow-success/10 cursor-default"
          : isGenerating
          ? "border-base-300 bg-base-100 cursor-not-allowed opacity-60"
          : selected
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
          : "border-base-300 bg-base-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
      }`}
      onClick={handleToggle}
      role="button"
      aria-pressed={selected}
      aria-labelledby={`${cardId}-title`}
      aria-describedby={`${cardId}-description`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      {/* Applied Badge */}
      {isApplied && (
        <div className="absolute top-3 right-3 px-3 py-1 bg-success text-success-content text-xs font-semibold rounded-full shadow-sm z-10 whitespace-nowrap">
          ✓ {t("applied")}
        </div>
      )}

      {/* Style Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={style.imageUrl}
          alt={t("styleExampleAlt", { styleName: style.name })}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Selection indicator */}
        {selected && !isApplied && (
          <div className="absolute top-3 left-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-4 h-4 text-primary-content"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3
          id={`${cardId}-title`}
          className="text-lg sm:text-xl font-semibold text-base-content mb-2 leading-tight"
        >
          {style.name}
        </h3>

        <p
          id={`${cardId}-description`}
          className="text-base-content/60 text-sm sm:text-base leading-relaxed"
        >
          {style.description}
        </p>
      </div>

      {/* Hover effect overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          selected && !isApplied
            ? "bg-primary/5 opacity-100"
            : "bg-primary/5 opacity-0 group-hover:opacity-100"
        }`}
      />
    </motion.div>
  );
};

export default StyleCard;
