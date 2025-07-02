import { motion } from "framer-motion";
import DiffSlider from "../../DiffSlider";
import { FloatingElements } from "./FloatingElements";
import { useTranslations } from "next-intl";

export const InteractiveDemo = () => {
  const t = useTranslations("Components.DiffSlider");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Feature Badge with Glass Effect */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.6,
          type: "spring",
          stiffness: 400,
          damping: 30
        }}
        whileHover={{ scale: 1.05, y: -2 }}
        className="absolute -top-4 left-4 z-20 bg-primary/90 backdrop-blur-sm text-primary-content px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg border border-primary/20"
      >
        <span className="flex items-center gap-2">
          ✨ Live Demo
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-2 h-2 bg-primary-content/60 rounded-full"
          />
        </span>
      </motion.div>

      {/* AI Confidence Indicator */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute top-4 right-4 z-20 bg-base-100/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-base-300/20 shadow-lg"
      >
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-base-content/80 font-medium">98% Confidence</span>
        </div>
      </motion.div>

      {/* Processing Time Indicator */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-4 left-4 z-20 bg-base-100/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-base-300/20 shadow-lg"
      >
        <div className="flex items-center gap-2 text-sm">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-accent rounded-full"
          />
          <span className="text-base-content/80 font-medium">~30s</span>
        </div>
      </motion.div>

      {/* Main Demo Container with Enhanced Glass Effect */}
      <motion.div 
        className="relative rounded-3xl overflow-hidden shadow-2xl border border-base-300/30 bg-gradient-to-br from-base-100/10 to-base-200/20 backdrop-blur-sm"
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <DiffSlider
          beforeImageUrl="/assets/images/inspirationBefore.png"
          afterImageUrl="/assets/images/inspirationAfter.png"
          beforeLabel={t("before")}
          afterLabel={t("after")}
          aspectRatio="aspect-[4/3]"
          showInstructionText={true}
          className="shadow-lg"
        />
      </motion.div>

      <FloatingElements />
    </motion.div>
  );
};

export default InteractiveDemo;
