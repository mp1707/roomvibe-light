import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  progress: number;
}

export const ProgressIndicator = ({ progress }: ProgressIndicatorProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm rounded-3xl"
  >
    <motion.div
      className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-4 text-sm font-medium text-base-content/70"
    >
      {progress < 100
        ? `Wird hochgeladen... ${progress}%`
        : "Upload abgeschlossen!"}
    </motion.p>
  </motion.div>
);
