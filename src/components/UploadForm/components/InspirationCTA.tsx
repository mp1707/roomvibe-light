import { motion } from "framer-motion";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

interface InspirationCTAProps {
  onExploreInspiration: () => void;
}

export const InspirationCTA = ({
  onExploreInspiration,
}: InspirationCTAProps) => {
  const t = useTranslations("Components.InspirationCTA");

  return (
    <motion.div className="flex flex-col items-center space-y-4 md:space-y-6">
      <div className="flex items-center space-x-4 text-base-content/40">
        <div className="h-px bg-base-300 w-12 md:w-16" />
        <span className="text-sm font-medium">{t("or")}</span>
        <div className="h-px bg-base-300 w-12 md:w-16" />
      </div>

      <motion.button
        onClick={onExploreInspiration}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group flex items-center space-x-3 px-6 md:px-8 py-3 md:py-4 bg-base-100/60 hover:bg-base-100/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-base-300/50 transition-all duration-300 hover:shadow-lg hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <EyeIcon
          className="w-5 h-5 text-base-content/60 group-hover:text-primary transition-colors"
          aria-hidden="true"
        />
        <div className="flex flex-col items-start">
          <span className="font-semibold text-sm md:text-base text-base-content/70 group-hover:text-primary transition-colors">
            {t("discoverInspiration")}
          </span>
          <span className="text-xs text-base-content/50">
            {t("viewExamples")}
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
};
