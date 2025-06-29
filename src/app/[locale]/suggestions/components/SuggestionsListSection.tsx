import { motion } from "framer-motion";
import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import SuggestionCard from "@/components/SuggestionCard";
import CustomSuggestionCard from "@/components/CustomSuggestionCard";
import AddSuggestionCard from "@/components/AddSuggestionCard";
import { staggerContainer, staggerItem } from "@/utils/animations";
import { useAppState } from "@/utils/store";

interface SuggestionsListSectionProps {
  selectedSuggestion: string | null;
  isGenerating: boolean;
  onToggleSuggestion: (suggestionId: string) => void;
  onAddCustomSuggestion: (data: {
    title: string;
    suggestion: string;
    category: string;
  }) => void;
  onEditCustomSuggestion: (
    id: string,
    data: { title: string; suggestion: string }
  ) => void;
  onDeleteCustomSuggestion: (id: string) => void;
}

const SuggestionsListSection = ({
  selectedSuggestion,
  isGenerating,
  onToggleSuggestion,
  onAddCustomSuggestion,
  onEditCustomSuggestion,
  onDeleteCustomSuggestion,
}: SuggestionsListSectionProps) => {
  const t = useTranslations("Components.SuggestionsListSection");
  const { suggestions, customSuggestions, appliedSuggestions } = useAppState();

  // Memoize all suggestions to prevent unnecessary re-computations
  const allSuggestions = useMemo(
    () => [...suggestions, ...customSuggestions],
    [suggestions, customSuggestions]
  );

  const handleAddCustomSuggestion = useCallback(
    (data: { title: string; suggestion: string; category: string }) => {
      onAddCustomSuggestion(data);
    },
    [onAddCustomSuggestion]
  );

  const handleEditCustomSuggestion = useCallback(
    (id: string, data: { title: string; suggestion: string }) => {
      onEditCustomSuggestion(id, data);
    },
    [onEditCustomSuggestion]
  );

  const handleDeleteCustomSuggestion = useCallback(
    (id: string) => {
      onDeleteCustomSuggestion(id);
    },
    [onDeleteCustomSuggestion]
  );

  // Early return for empty suggestions with focused UI
  if (allSuggestions.length === 0) {
    return (
      <motion.div
        variants={staggerItem}
        className="w-full max-w-4xl mx-auto px-4 sm:px-6"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
            {t("designSuggestions")}
          </h3>
          <p className="text-base-content/60 max-w-2xl mx-auto">
            {t("suggestionInstructions")}
          </p>
        </div>

        <div className="text-center py-8">
          <p className="text-base-content/50 mb-6">
            {t("noSuggestionsAvailable")}
          </p>
          <AddSuggestionCard onAdd={handleAddCustomSuggestion} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerItem}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
          {t("designSuggestions")}
        </h3>
        <p className="text-base-content/60 max-w-2xl mx-auto">
          {t("suggestionInstructions")}
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        className="space-y-5 sm:space-y-4 pt-3"
      >
        {/* AI Suggestions */}
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            variants={staggerItem}
            className={`relative ${
              appliedSuggestions.has(suggestion.id) ? "opacity-60" : ""
            }`}
          >
            <SuggestionCard
              title={suggestion.title}
              suggestion={suggestion.suggestion}
              explanation={suggestion.explanation}
              selected={selectedSuggestion === suggestion.id}
              onToggle={() => onToggleSuggestion(suggestion.id)}
              isApplied={appliedSuggestions.has(suggestion.id)}
              isGenerating={isGenerating}
              delay={index * 0.1}
            />
          </motion.div>
        ))}

        {/* Custom Suggestions */}
        {customSuggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            variants={staggerItem}
            className={`relative ${
              appliedSuggestions.has(suggestion.id) ? "opacity-60" : ""
            }`}
          >
            <CustomSuggestionCard
              id={suggestion.id}
              title={suggestion.title}
              suggestion={suggestion.suggestion}
              selected={selectedSuggestion === suggestion.id}
              onToggle={() => onToggleSuggestion(suggestion.id)}
              onEdit={handleEditCustomSuggestion}
              onDelete={handleDeleteCustomSuggestion}
              isApplied={appliedSuggestions.has(suggestion.id)}
              isGenerating={isGenerating}
              delay={(suggestions.length + index) * 0.1}
            />
          </motion.div>
        ))}

        {/* Add Custom Suggestion Card */}
        <motion.div variants={staggerItem}>
          <AddSuggestionCard onAdd={handleAddCustomSuggestion} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SuggestionsListSection;
