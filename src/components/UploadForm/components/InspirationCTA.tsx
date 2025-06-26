import { useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { buttonVariants, useMotionPreference } from "@/utils/animations";

export const InspirationCTA = () => {
  const router = useRouter();
  const reducedMotion = useMotionPreference();

  const handleInspirationClick = useCallback(() => {
    router.push("/inspiration");
  }, [router]);

  return (
    <motion.div className="flex flex-col items-center space-y-4 md:space-y-6">
      <div className="flex items-center space-x-4 text-base-content/40">
        <div className="h-px bg-base-300 w-12 md:w-16" />
        <span className="text-sm font-medium">oder</span>
        <div className="h-px bg-base-300 w-12 md:w-16" />
      </div>

      <motion.button
        variants={reducedMotion ? {} : buttonVariants}
        whileHover={reducedMotion ? {} : "hover"}
        whileTap={reducedMotion ? {} : "tap"}
        onClick={handleInspirationClick}
        className="group flex items-center space-x-3 px-6 md:px-8 py-3 md:py-4 bg-base-100/60 hover:bg-base-100/80 backdrop-blur-sm rounded-xl md:rounded-2xl border border-base-300/50 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <svg
          className="w-5 h-5 text-base-content/60 group-hover:text-primary transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="font-semibold text-sm md:text-base text-base-content/70 group-hover:text-primary transition-colors">
          KI-Transformationen entdecken
        </span>
      </motion.button>
    </motion.div>
  );
};
