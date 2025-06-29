"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  hover: { scale: 1.02, y: -2 },
};

export const ToggleSwitch = ({
  enabled,
  onChange,
  label,
  description,
  icon,
}: ToggleSwitchProps) => {
  const t = useTranslations("SettingsPage");
  return (
    <motion.div
      variants={cardVariants}
      className="bg-base-100 rounded-lg border border-base-300 p-6 hover:shadow-soft transition-shadow duration-200"
      whileHover="hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {icon && (
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <label className="text-lg font-semibold tracking-tight text-base-content cursor-pointer">
              {label}
            </label>
            <p className="text-sm text-base-content/60 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <motion.button
          onClick={() => onChange(!enabled)}
          className={`relative w-11 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 ${
            enabled ? "bg-primary" : "bg-base-300"
          }`}
          whileTap={{ scale: 0.95 }}
          aria-label={`${enabled ? t("disable") : t("enable")} ${label}`}
        >
          <motion.div
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
            animate={{
              x: enabled ? 22 : 2,
            }}
            transition={{
              type: "spring",
              stiffness: 700,
              damping: 30,
            }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
};
