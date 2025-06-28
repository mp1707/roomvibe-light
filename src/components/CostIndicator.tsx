"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useCreditsStore } from "@/utils/creditsStore";

interface CostIndicatorProps {
  cost: number;
  action: string;
  disabled?: boolean;
  className?: string;
  showUpgradePrompt?: boolean;
}

const CostIndicator: React.FC<CostIndicatorProps> = ({
  cost,
  action,
  disabled = false,
  className = "",
  showUpgradePrompt = true,
}) => {
  const { credits, hasEnoughCredits } = useCreditsStore();
  const hasCredits = hasEnoughCredits(cost);
  const currentCredits = credits ?? 0;

  if (disabled) {
    return (
      <div
        className={`flex items-center gap-2 text-sm text-base-content/40 ${className}`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span>{cost} Credits</span>
      </div>
    );
  }

  // If user has enough credits, show simple cost
  if (hasCredits) {
    return (
      <motion.div
        className={`flex items-center gap-2 text-sm text-base-content/70 ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <svg
          className="w-4 h-4 text-warning"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span>{cost} Credits</span>
      </motion.div>
    );
  }

  // If user doesn't have enough credits, show warning with upgrade option
  return (
    <motion.div
      className={`space-y-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Cost display with warning */}
      <div className="flex items-center gap-2 text-sm text-error">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span>{cost} Credits benötigt</span>
        <span className="text-xs text-base-content/50">
          (Sie haben {currentCredits})
        </span>
      </div>

      {/* Upgrade prompt */}
      {showUpgradePrompt && (
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            href="/buy-credits"
            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-focus transition-colors"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Credits kaufen
          </Link>
          <span className="text-xs text-base-content/50">
            um "{action}" zu verwenden
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CostIndicator;
