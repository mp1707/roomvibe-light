import { motion } from "framer-motion";
import { staggerItem } from "@/utils/animations";
import { ProcessStep } from "./ProcessStep";
import { CallToAction } from "./CallToAction";
import { getProcessSteps } from "../utils/constants";
import { useTranslations } from "next-intl";

interface HeroContentProps {
  onGetStarted: () => void;
  onViewInspiration: () => void;
  reducedMotion: boolean;
  user: any;
  loading: boolean;
}

export const HeroContent = ({
  onGetStarted,
  onViewInspiration,
  reducedMotion,
  user,
  loading,
}: HeroContentProps) => {
  const t = useTranslations("Components.HeroContent");
  const tSteps = useTranslations("Components.ProcessSteps");

  return (
    <motion.div
      variants={reducedMotion ? {} : staggerItem}
      className="space-y-8 lg:pr-8"
    >
      {/* Main Headline */}
      <div className="space-y-8">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95] text-base-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("mainHeadline")}
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-x">
            {t("mainHeadlineHighlight")}
          </span>
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-base-content/70 leading-relaxed max-w-2xl font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {t("description")}
        </motion.p>
        
        {/* Value Proposition Cards */}
        <motion.div
          className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {[
            { icon: "⚡", text: t("valueProps.fast") },
            { icon: "🎨", text: t("valueProps.personalized") },
            { icon: "🤖", text: t("valueProps.aiPowered") },
          ].map((prop, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-base-200/50 backdrop-blur-sm rounded-full border border-base-300/20"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <span className="text-base sm:text-lg">{prop.icon}</span>
              <span className="text-xs sm:text-sm font-medium text-base-content/80">
                {prop.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Process Steps */}
      <motion.div
        variants={reducedMotion ? {} : staggerItem}
        className="space-y-4"
      >
        {getProcessSteps(tSteps).map((step, index) => (
          <ProcessStep key={index} {...step} />
        ))}
      </motion.div>

      {/* Call to Action */}
      <CallToAction
        onGetStarted={onGetStarted}
        onViewInspiration={onViewInspiration}
        reducedMotion={reducedMotion}
        user={user}
        loading={loading}
      />
    </motion.div>
  );
};

export default HeroContent;
