"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  cardVariants,
  buttonVariants,
  useMotionPreference,
} from "@/utils/animations";

interface SuggestionCardProps {
  title: string;
  suggestion: string;
  explanation?: string;
  selected: boolean;
  onToggle: (suggestion: string) => void;
  isApplied?: boolean;
  isGenerating?: boolean;
  delay?: number;
}

const InfoIcon = ({ className }: { className?: string }) => (
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
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

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

const ChevronDownIcon = ({ className }: { className?: string }) => (
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
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const ToggleSwitch = ({
  checked,
  onChange,
  id,
  ariaLabel,
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  id: string;
  ariaLabel: string;
  disabled?: boolean;
}) => {
  const reducedMotion = useMotionPreference();

  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onChange();
        }
      }}
      className={`relative inline-flex items-center h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${checked ? "bg-primary" : "bg-base-300"}`}
    >
      <span className="sr-only">{ariaLabel}</span>
      <motion.span
        animate={{
          x: checked ? 20 : 2,
        }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 700, damping: 30 }
        }
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out`}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center h-full w-full"
          >
            <CheckIcon className="h-2.5 w-2.5 text-primary" />
          </motion.div>
        )}
      </motion.span>
    </button>
  );
};

const ExplanationArea = ({
  explanation,
  isExpanded,
  isApplied = false,
}: {
  explanation: string;
  isExpanded: boolean;
  isApplied?: boolean;
}) => {
  const t = useTranslations("Components.SuggestionCard");
  const reducedMotion = useMotionPreference();

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
          animate={
            reducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }
          }
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 400, damping: 30 }
          }
          className="overflow-hidden"
        >
          <div className="pt-4 sm:pt-5 border-t border-base-300/50 mt-4">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div
                className={`flex-shrink-0 w-7 h-7 sm:w-6 sm:h-6 ${
                  isApplied ? "bg-success/10" : "bg-primary/10"
                } rounded-full flex items-center justify-center mt-0.5`}
              >
                <InfoIcon
                  className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${
                    isApplied ? "text-success" : "text-primary"
                  }`}
                />
              </div>
              <div className="flex-1">
                <h4
                  className={`text-sm sm:text-sm font-medium ${
                    isApplied ? "text-success" : "text-primary"
                  } mb-3 sm:mb-2`}
                >
                  {t("whyRecommendation")}
                </h4>
                <p className="text-sm sm:text-sm text-base-content/70 leading-relaxed">
                  {explanation}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SuggestionCard = ({
  title,
  suggestion,
  explanation,
  selected,
  onToggle,
  isApplied = false,
  isGenerating = false,
  delay = 0,
}: SuggestionCardProps) => {
  const t = useTranslations("Components.SuggestionCard");
  const [showExplanation, setShowExplanation] = useState(false);
  const reducedMotion = useMotionPreference();
  const cardId = `suggestion-${title.toLowerCase().replace(/\s+/g, "-")}`;
  const toggleId = `toggle-${cardId}`;

  const handleToggle = useCallback(() => {
    if (!isApplied && !isGenerating) {
      onToggle(suggestion);
    }
  }, [onToggle, suggestion, isApplied, isGenerating]);

  const toggleExplanation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowExplanation((prev) => !prev);
  }, []);

  return (
    <motion.div
      variants={reducedMotion ? {} : cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={reducedMotion ? {} : "hover"}
      whileTap={reducedMotion ? {} : "tap"}
      transition={{ delay }}
      className={`group p-5 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ease-out relative ${
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
      aria-expanded={showExplanation}
    >
      {/* Applied Badge */}
      {isApplied && (
        <div className="absolute -top-2 -right-2 px-3 py-1 bg-success text-success-content text-xs font-semibold rounded-full shadow-sm z-10 whitespace-nowrap">
          ✓ {t("applied")}
        </div>
      )}

      {/* Header - Improved mobile layout */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
        {/* Title and Description Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3
              id={`${cardId}-title`}
              className="text-lg sm:text-xl font-semibold text-base-content leading-tight flex-1"
            >
              {title}
            </h3>

            {/* Toggle Switch - Show on mobile for all cards */}
            {!isApplied && (
              <div className="flex-shrink-0 sm:hidden">
                <ToggleSwitch
                  checked={selected}
                  onChange={handleToggle}
                  id={toggleId}
                  ariaLabel={`${title} ${
                    selected ? t("deactivate") : t("activate")
                  }`}
                  disabled={isGenerating}
                />
              </div>
            )}
          </div>

          <p
            id={`${cardId}-description`}
            className="text-base-content/60 text-sm sm:text-base leading-relaxed mb-3"
          >
            {suggestion}
          </p>

          {/* Warum Button - Better mobile positioning */}
          {explanation && (
            <motion.button
              variants={reducedMotion ? {} : buttonVariants}
              whileHover={reducedMotion ? {} : "hover"}
              whileTap={reducedMotion ? {} : "tap"}
              onClick={toggleExplanation}
              className={`inline-flex items-center space-x-2 text-sm font-medium transition-all duration-200 ease-out rounded-lg px-3 py-2 ${
                isApplied
                  ? showExplanation
                    ? "text-success bg-success/10 hover:bg-success/15"
                    : "text-success hover:text-success hover:bg-success/5"
                  : showExplanation
                  ? "text-primary bg-primary/10 hover:bg-primary/15"
                  : "text-base-content/50 hover:text-primary hover:bg-primary/5"
              } focus:outline-none focus:ring-2 ${
                isApplied ? "focus:ring-success/30" : "focus:ring-primary/30"
              } focus:ring-offset-0`}
              aria-label={`${t("explanationFor", { title })} ${
                showExplanation ? t("hide") : t("show")
              }`}
              aria-expanded={showExplanation}
            >
              <InfoIcon
                className={`w-4 h-4 ${isApplied ? "text-success" : ""}`}
              />
              <span>{showExplanation ? t("less") : t("why")}</span>
              <motion.div
                animate={{ rotate: showExplanation ? 180 : 0 }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 400, damping: 30 }
                }
              >
                <ChevronDownIcon
                  className={`w-3 h-3 ${isApplied ? "text-success" : ""}`}
                />
              </motion.div>
            </motion.button>
          )}
        </div>

        {/* Toggle Switch - Desktop only, when we have explanation */}
        {!isApplied && explanation && (
          <div className="hidden sm:block flex-shrink-0">
            <ToggleSwitch
              checked={selected}
              onChange={handleToggle}
              id={`${toggleId}-desktop`}
              ariaLabel={`${title} ${selected ? "deaktivieren" : "aktivieren"}`}
              disabled={isGenerating}
            />
          </div>
        )}

        {/* Toggle Switch - Desktop only, when no explanation */}
        {!isApplied && !explanation && (
          <div className="hidden sm:block flex-shrink-0">
            <ToggleSwitch
              checked={selected}
              onChange={handleToggle}
              id={`${toggleId}-desktop-no-exp`}
              ariaLabel={`${title} ${selected ? "deaktivieren" : "aktivieren"}`}
              disabled={isGenerating}
            />
          </div>
        )}
      </div>

      {/* Explanation Area */}
      {explanation && (
        <ExplanationArea
          explanation={explanation}
          isExpanded={showExplanation}
          isApplied={isApplied}
        />
      )}
    </motion.div>
  );
};

export default SuggestionCard;
