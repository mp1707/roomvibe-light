import { motion } from "framer-motion";
import { staggerItem } from "@/utils/animations";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";

interface CallToActionProps {
  onGetStarted: () => void;
  onViewInspiration: () => void;
  reducedMotion: boolean;
  user: any;
  loading: boolean;
}

export const CallToAction = ({
  onGetStarted,
  onViewInspiration,
  reducedMotion,
  user,
  loading,
}: CallToActionProps) => {
  const t = useTranslations("Components.CallToAction");

  // Determine button text based on authentication state
  const getButtonText = () => {
    if (loading) return t("loading");
    return user ? t("startNow") : t("startFree");
  };

  // Determine subtitle text based on authentication state
  const getSubtitleText = () => {
    if (user) {
      return t("subtitleLoggedIn");
    }
    return t("subtitleLoggedOut");
  };

  return (
    <motion.div
      variants={reducedMotion ? {} : staggerItem}
      className="space-y-4"
    >
      <Button
        onClick={onGetStarted}
        disabled={loading}
        variant="primary"
        size="lg"
        fullWidth
        leftIcon={
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        }
        className="w-full sm:w-auto shadow-lg hover:shadow-xl"
      >
        {getButtonText()}
      </Button>

      <div className="flex items-center justify-center sm:justify-start">
        <Button
          onClick={onViewInspiration}
          variant="ghost"
          size="sm"
          leftIcon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
              />
            </svg>
          }
        >
          {t("viewInspiration")}
        </Button>
      </div>

      <p className="text-xs text-base-content/40 max-w-sm">
        {getSubtitleText()}
      </p>
    </motion.div>
  );
};

export default CallToAction;
