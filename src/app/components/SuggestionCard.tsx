"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
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
}: {
  explanation: string;
  isExpanded: boolean;
}) => {
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
          <div className="pt-4 border-t border-base-300/50 mt-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                <InfoIcon className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-primary mb-2">
                  Warum diese Empfehlung?
                </h4>
                <p className="text-sm text-base-content/70 leading-relaxed">
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
      className={`group p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ease-out relative ${
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
      {/* Applied Badge - Fixed clipping with proper positioning */}
      {isApplied && (
        <div className="absolute -top-2 -right-2 px-3 py-1 bg-success text-success-content text-xs font-semibold rounded-full shadow-sm z-10 whitespace-nowrap">
          ✓ Angewendet
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-start justify-between mb-2">
            <h3
              id={`${cardId}-title`}
              className="text-base sm:text-lg font-semibold text-base-content flex-1"
            >
              {title}
            </h3>

            {/* Warum Button - Fixed position in header */}
            {explanation && (
              <motion.button
                variants={reducedMotion ? {} : buttonVariants}
                whileHover={reducedMotion ? {} : "hover"}
                whileTap={reducedMotion ? {} : "tap"}
                onClick={toggleExplanation}
                className={`ml-2 flex items-center space-x-1 text-xs font-medium transition-all duration-200 ease-out rounded-lg px-2 py-1 ${
                  showExplanation
                    ? "text-primary bg-primary/10 hover:bg-primary/15"
                    : "text-base-content/50 hover:text-primary hover:bg-primary/5"
                } focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-0`}
                aria-label={`Erklärung für ${title} ${
                  showExplanation ? "ausblenden" : "anzeigen"
                }`}
                aria-expanded={showExplanation}
              >
                <InfoIcon className="w-3 h-3" />
                <span>{showExplanation ? "Weniger" : "Warum?"}</span>
                <motion.div
                  animate={{ rotate: showExplanation ? 180 : 0 }}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 400, damping: 30 }
                  }
                >
                  <ChevronDownIcon className="w-2.5 h-2.5" />
                </motion.div>
              </motion.button>
            )}
          </div>

          <p
            id={`${cardId}-description`}
            className="text-base-content/60 text-sm leading-relaxed"
          >
            {suggestion}
          </p>
        </div>

        {/* Toggle Switch - Hide for applied suggestions */}
        {!isApplied && (
          <div className="flex-shrink-0">
            <ToggleSwitch
              checked={selected}
              onChange={handleToggle}
              id={toggleId}
              ariaLabel={`${title} ${selected ? "deaktivieren" : "aktivieren"}`}
              disabled={isGenerating}
            />
          </div>
        )}
      </div>

      {/* Explanation Area - Expandable inline */}
      {explanation && (
        <ExplanationArea
          explanation={explanation}
          isExpanded={showExplanation}
        />
      )}
    </motion.div>
  );
};

export default SuggestionCard;
