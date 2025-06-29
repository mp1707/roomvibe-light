import { motion } from "framer-motion";
import DiffSlider from "../../DiffSlider";
import { FloatingElements } from "./FloatingElements";
import { useTranslations } from "next-intl";

export const InteractiveDemo = () => {
  const t = useTranslations("Components.DiffSlider");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Feature Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute -top-4 left-4 z-20 bg-primary text-primary-content px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
      >
        ✨ Live Demo
      </motion.div>

      {/* Diff Slider Demo */}
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-base-300/20">
        <DiffSlider
          beforeImageUrl="/assets/images/inspirationBefore.png"
          afterImageUrl="/assets/images/inspirationAfter.png"
          beforeLabel={t("before")}
          afterLabel={t("after")}
          aspectRatio="aspect-[4/3]"
          showInstructionText={true}
          className="shadow-lg"
        />
      </div>

      <FloatingElements />
    </motion.div>
  );
};

export default InteractiveDemo;
