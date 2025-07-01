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
      className={`group rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ease-out relative antialiased
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4
        ${
          isApplied
            ? "border-success bg-success/10 shadow-lg shadow-success/10 cursor-default"
            : isGenerating
            ? "border-base-300 bg-base-100 cursor-not-allowed opacity-60"
            : selected
            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 cursor-pointer"
            : "border-base-300 bg-base-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
        }`}
      onClick={handleToggle}
      role="article"
      aria-labelledby={`${cardId}-title`}
      aria-describedby={`${cardId}-description`}
      aria-pressed={selected}
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
        <div className="absolute -top-2 -right-2 px-3 py-1 bg-success text-success-content text-xs font-semibold rounded-full shadow-sm z-10 whitespace-nowrap">
          ✓ {t("applied")}
        </div>
      )}

      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl sm:rounded-t-xl">
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
          <div className="absolute top-3 left-3 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <CheckIcon className="w-4 h-4 text-primary-content" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 pt-4 px-5 sm:px-6 pb-5 sm:pb-6">
        <h3
          id={`${cardId}-title`}
          className="text-lg sm:text-xl font-semibold text-base-content leading-tight"
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
    </motion.div>
  );
};

export default StyleCard;
