import { motion } from "framer-motion";

export const HeroSection = () => (
  <motion.div className="mb-8 md:mb-16">
    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-base-content mb-4 md:mb-6 leading-tight">
      Verwandle deinen Raum.
    </h1>
    <p className="text-lg sm:text-xl md:text-2xl text-base-content/60 max-w-2xl mx-auto leading-relaxed">
      Lade ein Foto hoch und lass dich von Designvorschlägen inspirieren.
    </p>
  </motion.div>
);
