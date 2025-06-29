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
      <div className="space-y-6">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-base-content leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("mainHeadline")}
          <br />
          <span className="text-primary">{t("mainHeadlineHighlight")}</span>
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl text-base-content/70 leading-relaxed max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {t("description")}
        </motion.p>
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
