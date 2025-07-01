import { motion } from "framer-motion";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import CostIndicator from "@/components/CostIndicator";
import {
  springConfig,
  buttonVariants,
  useMotionPreference,
} from "@/utils/animations";
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

  // Truncate long titles for better responsive design
  const truncatedTitle = useMemo(() => {
    if (!selectedItemTitle) return "";

    // Different truncation lengths for different breakpoints
    const mobileMaxLength = 35;
    const tabletMaxLength = 50;

    if (selectedItemTitle.length <= mobileMaxLength) {
      return selectedItemTitle;
    }

    return {
      mobile:
        selectedItemTitle.length > mobileMaxLength
          ? `${selectedItemTitle.slice(0, mobileMaxLength)}...`
          : selectedItemTitle,
      tablet:
        selectedItemTitle.length > tabletMaxLength
          ? `${selectedItemTitle.slice(0, tabletMaxLength)}...`
          : selectedItemTitle,
      full: selectedItemTitle,
    };
  }, [selectedItemTitle]);

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
        shadow-lg rounded-xl sm:rounded-2xl
        transition-all duration-300
      "
    >
      <div className="max-w-4xl mx-auto">
        {/* Mobile Layout (< sm) */}
        <div className="sm:hidden px-4 py-4">
          <div className="flex flex-col gap-3">
            {/* Title and Selection Info */}
            <div className="text-center">
              <p className="text-xs text-base-content/60 uppercase tracking-wide font-medium mb-1">
                {mode === "styles" ? "Stil ausgewählt" : "Vorschlag ausgewählt"}
              </p>
              <p className="font-semibold text-base-content text-base leading-tight">
                {typeof truncatedTitle === "string"
                  ? truncatedTitle
                  : truncatedTitle.mobile}
              </p>
            </div>

            {/* Cost Indicator */}
            <div className="flex justify-center">
              <CostIndicator
                cost={CREDIT_COSTS.APPLY_SUGGESTION}
                action={getActionText()}
                disabled={isGenerating}
                showUpgradePrompt={false}
                className="justify-center"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={onCancel}
                whileHover={{ scale: 1.02 }}
                transition={springConfig}
                disabled={isGenerating}
                className={`
                  flex-1 px-4 py-3 font-medium rounded-xl
                  transition-colors duration-300
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${
                    isGenerating
                      ? "text-base-content/30 cursor-not-allowed"
                      : "text-base-content/70 hover:text-base-content hover:bg-base-200/50 border border-base-300"
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
                  !buttonStates.isDisabled && !reducedMotion
                    ? "hover"
                    : undefined
                }
                whileTap={
                  !buttonStates.isDisabled && !reducedMotion ? "tap" : undefined
                }
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  buttonStates.canApply && !isSubmitting && !isGenerating
                    ? "bg-primary hover:bg-primary-focus text-primary-content hover:shadow-xl"
                    : "bg-base-300 text-base-content/60"
                }`}
              >
                {(isSubmitting || isGenerating) && (
                  <div className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin" />
                )}
                <span className="text-center">{buttonStates.buttonText}</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Tablet Layout (sm to lg) */}
        <div className="hidden sm:block lg:hidden px-4 py-4">
          <div className="flex flex-col gap-3">
            {/* Info Section */}
            <div className="text-center">
              <p className="text-sm text-base-content/60">
                {getSelectionText()}
              </p>
              <p className="font-semibold text-base-content text-lg leading-tight">
                {typeof truncatedTitle === "string"
                  ? truncatedTitle
                  : truncatedTitle.tablet}
              </p>
            </div>

            {/* Cost and Actions Row */}
            <div className="flex items-center justify-between">
              <CostIndicator
                cost={CREDIT_COSTS.APPLY_SUGGESTION}
                action={getActionText()}
                disabled={isGenerating}
                showUpgradePrompt={false}
                className="justify-start"
              />

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
                    !buttonStates.isDisabled && !reducedMotion
                      ? "hover"
                      : undefined
                  }
                  whileTap={
                    !buttonStates.isDisabled && !reducedMotion
                      ? "tap"
                      : undefined
                  }
                  className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
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
        </div>

        {/* Desktop Layout (lg+) */}
        <div className="hidden lg:block px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-base-content/60">
                {getSelectionText()}
              </p>
              <p className="font-semibold text-base-content text-xl leading-tight">
                {typeof truncatedTitle === "string"
                  ? truncatedTitle
                  : truncatedTitle.full}
              </p>
              {/* Cost indicator */}
              <div className="mt-2">
                <CostIndicator
                  cost={CREDIT_COSTS.APPLY_SUGGESTION}
                  action={getActionText()}
                  disabled={isGenerating}
                  showUpgradePrompt={false}
                  className="justify-start"
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
                  !buttonStates.isDisabled && !reducedMotion
                    ? "hover"
                    : undefined
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
      </div>
    </motion.div>
  );
};

export default ActionBar;
