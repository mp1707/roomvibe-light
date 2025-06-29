"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { buttonVariants } from "@/utils/animations";

interface LanguageSwitchProps {
  variant?: "icon" | "full";
  className?: string;
}

const languages = {
  de: {
    name: "Deutsch",
    flag: "🇩🇪",
    switchText: "Switch to English",
  },
  en: {
    name: "English",
    flag: "🇬🇧",
    switchText: "Zu Deutsch wechseln",
  },
} as const;

const LanguageSwitch = ({
  variant = "full",
  className = "",
}: LanguageSwitchProps) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = languages[locale as keyof typeof languages];
  const nextLang = locale === "de" ? languages.en : languages.de;

  const handleLanguageChange = () => {
    const newLocale = locale === "de" ? "en" : "de";
    router.replace(pathname, { locale: newLocale });
  };

  // Spring animation config from design system
  const springConfig = {
    stiffness: 400,
    damping: 30,
  };

  if (variant === "icon") {
    return (
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        transition={springConfig}
        onClick={handleLanguageChange}
        className={`
          group
          relative
          flex items-center justify-center gap-2
          w-auto px-3 h-10
          rounded-lg
          bg-base-100/70 dark:bg-base-100/50
          backdrop-blur-sm
          border border-base-300/30 dark:border-base-300/20
          text-base-content/80 hover:text-base-content
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${className}
        `}
        aria-label={nextLang.switchText}
      >
        <span className="text-lg leading-none" aria-hidden="true">
          {currentLang.flag}
        </span>
        <span className="text-sm font-semibold tracking-tight antialiased">
          {currentLang.name}
        </span>
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-primary/10 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </motion.button>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-base-200/80 backdrop-blur-sm">
        <span className="text-xl leading-none" aria-hidden="true">
          {currentLang.flag}
        </span>
      </div>
      <motion.button
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={springConfig}
        onClick={handleLanguageChange}
        className="
          flex flex-col items-start
          text-left
          focus:outline-none focus:text-primary
          antialiased
        "
      >
        <span className="font-semibold text-base text-base-content">
          {currentLang.name}
        </span>
        <span className="text-sm text-base-content/60 hover:text-base-content transition-colors duration-200">
          {currentLang.switchText}
        </span>
      </motion.button>
    </div>
  );
};

export default LanguageSwitch;
