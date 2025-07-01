import { motion } from "framer-motion";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import CostIndicator from "@/components/CostIndicator";
import { springConfig, buttonVariants, useMotionPreference } from "@/utils/animations";
import { useCreditsStore } from "@/utils/creditsStore";
import { CREDIT_COSTS } from "@/types/credits";

interface ActionBarProps {
  selectedItemId: string | null;
  selectedItemTitle: string | undefined;
  isSubmitting: boolean;
  isGenerating: boolean;
  onCancel: () => void;
  onApply: () => void;
  mode?: "suggestions" | "styles"; // Determines text and cost
}

const ActionBar = ({
  selectedItemId,
  selectedItemTitle,
  isSubmitting,
  isGenerating,
  onCancel,
  onApply,
  mode = "suggestions",
}: ActionBarProps) => {
  const t = useTranslations("Components.ActionBar");
  const reducedMotion = useMotionPreference();
  const { canApplySuggestion } = useCreditsStore();

  // Memoize the button states to prevent unnecessary re-renders
  const buttonStates = useMemo(() => {
    const canApply = canApplySuggestion();
    const isDisabled = isSubmitting || isGenerating || !canApply;

    const actionText =
      mode === "styles" ? t("applyStyle") : t("applySuggestion");
    const applyingText = mode === "styles" ? t("applyingStyle") : t("applying");

    return {
      canApply,
      isDisabled,
      buttonText:
        isSubmitting || isGenerating
          ? applyingText
          : !canApply
          ? t("notEnoughCredits")
          : actionText,
    };
  }, [isSubmitting, isGenerating, canApplySuggestion, mode, t]);

  const getSelectionText = () => {
    if (mode === "styles") {
      return t("styleSelected");
    }
    return t("suggestionSelected");
  };

  const getActionText = () => {
    if (mode === "styles") {
      return t("applyStyle");
    }
    return t("applySuggestion");
  };

  // Early return if no item is selected
  if (!selectedItemId) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={springConfig}
      className="
        fixed bottom-4 left-4 right-4 z-50
        bg-base-100/70 dark:bg-base-100/60
        backdrop-blur-md
        border border-base-300/30 dark:border-base-300/20
        shadow-lg rounded-2xl
        transition-all duration-300
      "
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-sm text-base-content/60">{getSelectionText()}</p>
            <p className="font-semibold text-base-content">
              {selectedItemTitle}
            </p>
            {/* Cost indicator */}
            <div className="mt-2">
              <CostIndicator
                cost={CREDIT_COSTS.APPLY_SUGGESTION}
                action={getActionText()}
                disabled={isGenerating}
                showUpgradePrompt={false}
                className="justify-center sm:justify-start"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              transition={springConfig}
              disabled={isGenerating}
              className={`
                px-4 py-2 font-medium rounded-xl
                transition-colors duration-300
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${
                  isGenerating
                    ? "text-base-content/30 cursor-not-allowed"
                    : "text-base-content/60 hover:text-base-content hover:bg-base-200/50"
                }
              `}
            >
              {t("cancel")}
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
