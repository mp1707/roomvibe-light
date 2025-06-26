import { motion } from "framer-motion";
import { useMemo } from "react";
import CostIndicator from "@/components/CostIndicator";
import { useMotionPreference, buttonVariants } from "@/utils/animations";
import { useCreditsStore } from "@/utils/creditsStore";
import { CREDIT_COSTS } from "@/types/credits";

interface ActionBarProps {
  selectedSuggestion: string | null;
  selectedSuggestionTitle: string | undefined;
  isSubmitting: boolean;
  isGenerating: boolean;
  onCancel: () => void;
  onApply: () => void;
}

const ActionBar = ({
  selectedSuggestion,
  selectedSuggestionTitle,
  isSubmitting,
  isGenerating,
  onCancel,
  onApply,
}: ActionBarProps) => {
  const reducedMotion = useMotionPreference();
  const { canApplySuggestion } = useCreditsStore();

  // Memoize the button states to prevent unnecessary re-renders
  const buttonStates = useMemo(() => {
    const canApply = canApplySuggestion();
    const isDisabled = isSubmitting || isGenerating || !canApply;

    return {
      canApply,
      isDisabled,
      buttonText:
        isSubmitting || isGenerating
          ? "Wird angewendet..."
          : !canApply
          ? "Nicht genügend Credits"
          : "Vorschlag anwenden",
    };
  }, [isSubmitting, isGenerating, canApplySuggestion]);

  // Early return if no suggestion is selected
  if (!selectedSuggestion) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-base-100/95 backdrop-blur-sm border-t border-base-300/50 shadow-2xl z-50"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-sm text-base-content/60">
              Vorschlag ausgewählt:
            </p>
            <p className="font-semibold text-base-content">
              {selectedSuggestionTitle}
            </p>
            {/* Cost indicator */}
            <div className="mt-2">
              <CostIndicator
                cost={CREDIT_COSTS.APPLY_SUGGESTION}
                action="Vorschlag anwenden"
                disabled={isGenerating}
                showUpgradePrompt={false}
                className="justify-center sm:justify-start"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={onCancel}
              variants={reducedMotion ? {} : buttonVariants}
              whileHover={reducedMotion ? {} : "hover"}
              whileTap={reducedMotion ? {} : "tap"}
              disabled={isGenerating}
              className={`px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl ${
                isGenerating
                  ? "text-base-content/30 cursor-not-allowed"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              Abbrechen
            </motion.button>

            <motion.button
              onClick={onApply}
              disabled={buttonStates.isDisabled}
              variants={reducedMotion ? {} : buttonVariants}
              whileHover={
                !buttonStates.isDisabled && !reducedMotion ? "hover" : undefined
              }
              whileTap={
                !buttonStates.isDisabled && !reducedMotion ? "tap" : undefined
              }
              className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                buttonStates.canApply && !isSubmitting && !isGenerating
                  ? "bg-primary hover:bg-primary-focus text-primary-content hover:shadow-xl"
                  : "bg-base-300 text-base-content/60"
              }`}
            >
              {(isSubmitting || isGenerating) && (
                <div className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin" />
              )}
              {buttonStates.buttonText}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActionBar;
