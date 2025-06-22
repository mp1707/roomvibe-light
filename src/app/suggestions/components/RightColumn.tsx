"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import SuggestionCard from "../../components/SuggestionCard";
import {
  staggerContainer,
  staggerItem,
  useMotionPreference,
  buttonVariants,
} from "@/utils/animations";
import { useAppState } from "@/utils/store";

// Empty state component
const EmptyState = () => {
  const router = useRouter();
  const reducedMotion = useMotionPreference();

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-base-300 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-base-content/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.5a7.966 7.966 0 00-6-.5 7.966 7.966 0 00-6 .5v.5a8 8 0 0012 0V6.5z"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-base-content mb-3">
          Keine Vorschläge verfügbar
        </h3>

        <p className="text-base-content/70 mb-6 leading-relaxed">
          Es konnten keine Design-Vorschläge generiert werden. Bitte versuchen
          Sie es mit einem anderen Bild eines Innenraums.
        </p>

        <motion.button
          variants={reducedMotion ? {} : buttonVariants}
          whileHover={reducedMotion ? {} : "hover"}
          whileTap={reducedMotion ? {} : "tap"}
          onClick={handleGoBack}
          className="px-6 py-3 bg-primary hover:bg-primary-focus text-primary-content font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Neues Bild hochladen
        </motion.button>
      </motion.div>
    </div>
  );
};

interface RightColumnProps {
  selectedSuggestions: Record<string, boolean>;
  onToggleSuggestion: (suggestionId: string) => void;
}

const RightColumn: React.FC<RightColumnProps> = ({
  selectedSuggestions,
  onToggleSuggestion,
}) => {
  const reducedMotion = useMotionPreference();
  const { suggestions } = useAppState();

  // Show empty state if no suggestions available
  if (!suggestions || suggestions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col h-full overflow-visible">
      {/* Header - Only sticky on large screens */}
      <div className="lg:sticky lg:top-16 bg-base-100 lg:z-20 pb-4 sm:pb-6 border-b border-base-300 lg:-mx-4 lg:px-4">
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="pt-2 sm:pt-4"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-base-content mb-2 sm:mb-3 text-center">
            Design-Vorschläge
          </h2>
          <p className="text-base sm:text-lg text-base-content/60 max-w-md mx-auto text-center px-4 sm:px-0">
            Wählen Sie die Verbesserungen aus, die Ihnen gefallen. Unsere KI
            erklärt Ihnen gerne das Warum.
          </p>
        </motion.div>
      </div>

      {/* Scrollable Suggestion Cards */}
      <motion.div
        variants={reducedMotion ? {} : staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex-1 space-y-3 sm:space-y-4 py-4 sm:py-6 overflow-visible"
      >
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            variants={reducedMotion ? {} : staggerItem}
            custom={index}
            className="overflow-visible"
          >
            <SuggestionCard
              title={suggestion.title}
              suggestion={suggestion.suggestion}
              explanation={suggestion.explanation}
              selected={!!selectedSuggestions[suggestion.id]}
              onToggle={() => onToggleSuggestion(suggestion.id)}
              delay={index * 0.1}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RightColumn;
