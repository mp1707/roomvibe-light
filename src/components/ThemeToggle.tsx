"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const SunIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const t = useTranslations("Components.ThemeToggle");
  const [theme, setTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by handling theme after mount
  useEffect(() => {
    setMounted(true);

    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    // Set theme attribute after component mounts to avoid hydration mismatch
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Don't render until mounted to prevent SSR issues
  if (!mounted) {
    return <div className={`w-14 h-8 bg-base-300 rounded-full ${className}`} />;
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative inline-flex items-center w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100 ${
        theme === "dark" ? "bg-primary" : "bg-base-300"
      } ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`${t("toggleTheme")} - ${
        theme === "light" ? t("darkMode") : t("lightMode")
      }`}
    >
      <motion.div
        className="absolute inset-0.5 w-7 h-7 bg-base-100 rounded-full shadow-lg flex items-center justify-center"
        animate={{
          x: theme === "dark" ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      >
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 180 }}
          transition={{ duration: 0.2 }}
        >
          {theme === "dark" ? (
            <MoonIcon className="w-4 h-4 text-primary" />
          ) : (
            <SunIcon className="w-4 h-4 text-warning" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
