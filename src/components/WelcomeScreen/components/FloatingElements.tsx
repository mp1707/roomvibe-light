import { motion } from "framer-motion";
import { FeatureIndicator } from "./FeatureIndicator";
import { getFeatureIndicators } from "../utils/constants";
import { useTranslations } from "next-intl";

export const FloatingElements = () => {
  const t = useTranslations("Components.FeatureIndicators");

  return (
    <>
      {/* Right side floating card */}
      <motion.div
        className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden xl:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="bg-base-100/90 backdrop-blur-sm border border-base-300/30 rounded-2xl p-4 shadow-lg">
          <div className="space-y-2">
            <FeatureIndicator label={t("aiAnalysis")} color="bg-success" />
            {getFeatureIndicators(t)
              .slice(1)
              .map((indicator, index) => (
                <FeatureIndicator
                  key={index}
                  label={indicator.label}
                  color={indicator.color}
                />
              ))}
          </div>
        </div>
      </motion.div>

      {/* Left side floating badge */}
      <motion.div
        className="absolute -left-4 bottom-8 hidden xl:block"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="bg-base-100/90 backdrop-blur-sm border border-base-300/30 rounded-2xl p-3 shadow-lg">
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-base-content">
              {t("premium")}
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FloatingElements;
