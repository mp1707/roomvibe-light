import { motion } from "framer-motion";
import { buttonVariants, staggerItem } from "@/utils/animations";

interface CallToActionProps {
  onGetStarted: () => void;
  onViewInspiration: () => void;
  reducedMotion: boolean;
}

export const CallToAction = ({
  onGetStarted,
  onViewInspiration,
  reducedMotion,
}: CallToActionProps) => (
  <motion.div variants={reducedMotion ? {} : staggerItem} className="space-y-4">
    <motion.button
      variants={reducedMotion ? {} : buttonVariants}
      whileHover={reducedMotion ? {} : "hover"}
      whileTap={reducedMotion ? {} : "tap"}
      onClick={onGetStarted}
      className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary-focus text-primary-content font-semibold text-lg rounded-2xl transition-colors duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full sm:w-auto justify-center"
    >
      <svg
        className="w-5 h-5 mr-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      Jetzt kostenlos starten
    </motion.button>

    <div className="flex items-center justify-center sm:justify-start">
      <motion.button
        variants={reducedMotion ? {} : buttonVariants}
        whileHover={reducedMotion ? {} : "hover"}
        whileTap={reducedMotion ? {} : "tap"}
        onClick={onViewInspiration}
        className="inline-flex items-center px-4 py-2 text-base-content/70 hover:text-base-content font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Inspiration ansehen
      </motion.button>
    </div>

    <p className="text-xs text-base-content/40 max-w-sm">
      Keine Kreditkarte erforderlich. Starte mit kostenlosen Credits und erlebe
      die Zukunft des Interior Designs.
    </p>
  </motion.div>
);

export default CallToAction;
