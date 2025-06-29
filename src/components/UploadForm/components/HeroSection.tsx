import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export const HeroSection = () => {
  const t = useTranslations("Components.HeroSection");

  return (
    <motion.div className="mb-8 md:mb-16">
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-base-content mb-4 md:mb-6 leading-tight">
        {t("title")}
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-base-content/60 max-w-2xl mx-auto leading-relaxed">
        {t("subtitle")}
      </p>
    </motion.div>
  );
};
