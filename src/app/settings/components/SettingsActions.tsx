"use client";

import { motion } from "framer-motion";

interface SettingsActionsProps {
  showResetConfirm: boolean;
  onReset: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  hover: { scale: 1.02, y: -2 },
};

export const SettingsActions = ({
  showResetConfirm,
  onReset,
}: SettingsActionsProps) => {
  return (
    <>
      {/* Actions */}
      <motion.div variants={cardVariants} className="flex gap-3">
        <motion.button
          onClick={onReset}
          className={`px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
            showResetConfirm
              ? "bg-error text-error-content border-error hover:bg-error/90"
              : "bg-base-100 text-base-content border-base-300 hover:bg-base-200"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {showResetConfirm
            ? "Bestätigen: Zurücksetzen"
            : "Alle Einstellungen zurücksetzen"}
        </motion.button>
      </motion.div>

      {/* Development Notice */}
      <motion.div
        variants={cardVariants}
        className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-lg"
      >
        <p className="text-sm text-base-content/70">
          <strong>Hinweis:</strong> Diese Einstellungen sind nur für die
          Entwicklung gedacht. Im Produktionsmodus sollten immer die echten APIs
          verwendet werden.
        </p>
      </motion.div>
    </>
  );
};
