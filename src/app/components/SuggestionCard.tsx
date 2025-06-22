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

const ToggleSwitch = ({
  checked,
  onChange,
  id,
  ariaLabel,
}: {
  checked: boolean;
  onChange: () => void;
  id: string;
  ariaLabel: string;
}) => {
  const reducedMotion = useMotionPreference();

  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        checked ? "bg-primary" : "bg-gray-200"
      }`}
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

const ExplanationTooltip = ({
  explanation,
  isVisible,
  onClose,
}: {
  explanation: string;
  isVisible: boolean;
  onClose: () => void;
}) => {
  const reducedMotion = useMotionPreference();

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998]"
            onClick={onClose}
          />

          {/* Tooltip */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, scale: 0.95, y: -10 }}
            animate={reducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? {} : { opacity: 0, scale: 0.95, y: -10 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.2,
            }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-[9999] w-72 max-w-xs"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200/50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <InfoIcon className="w-3 h-3 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {explanation}
                  </p>
                </div>
              </div>

              {/* Arrow pointing up */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="w-4 h-4 bg-white/95 border border-gray-200/50 transform rotate-45"></div>
              </div>
            </div>
          </motion.div>
        </>
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
  delay = 0,
}: SuggestionCardProps) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const reducedMotion = useMotionPreference();
  const cardId = `suggestion-${title.toLowerCase().replace(/\s+/g, "-")}`;
  const toggleId = `toggle-${cardId}`;

  const handleToggle = useCallback(() => {
    onToggle(suggestion);
  }, [onToggle, suggestion]);

  const toggleExplanation = useCallback(() => {
    setShowExplanation((prev) => !prev);
  }, []);

  const closeExplanation = useCallback(() => {
    setShowExplanation(false);
  }, []);

  return (
    <motion.div
      variants={reducedMotion ? {} : cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={reducedMotion ? {} : "hover"}
      whileTap={reducedMotion ? {} : "tap"}
      transition={{ delay }}
      className={`relative group p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ease-out ${
        selected
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
          : "border-gray-200 bg-white hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
      }`}
      onClick={handleToggle}
      role="article"
      aria-labelledby={`${cardId}-title`}
      aria-describedby={`${cardId}-description`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3
            id={`${cardId}-title`}
            className="text-lg font-semibold text-gray-800 mb-1"
          >
            {title}
          </h3>
          <p
            id={`${cardId}-description`}
            className="text-gray-600 text-sm leading-relaxed"
          >
            {suggestion}
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="ml-4 flex-shrink-0">
          <ToggleSwitch
            checked={selected}
            onChange={handleToggle}
            id={toggleId}
            ariaLabel={`${title} ${selected ? "deaktivieren" : "aktivieren"}`}
          />
        </div>
      </div>

      {/* Footer with explanation */}
      {explanation && (
        <div className="flex items-center justify-between">
          <div className="flex-1"></div>

          <div className="relative">
            <motion.button
              variants={reducedMotion ? {} : buttonVariants}
              whileHover={reducedMotion ? {} : "hover"}
              whileTap={reducedMotion ? {} : "tap"}
              onClick={(e) => {
                e.stopPropagation();
                toggleExplanation();
              }}
              className="flex items-center space-x-2 text-xs text-gray-500 hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-2 py-1"
              aria-label={`Erklärung für ${title} ${
                showExplanation ? "ausblenden" : "anzeigen"
              }`}
            >
              <InfoIcon className="w-4 h-4" />
              <span className="font-medium">Warum?</span>
            </motion.button>

            <ExplanationTooltip
              explanation={explanation}
              isVisible={showExplanation}
              onClose={closeExplanation}
            />
          </div>
        </div>
      )}

      {/* Selection Indicator */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg"
          >
            <CheckIcon className="w-3.5 h-3.5 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SuggestionCard;
