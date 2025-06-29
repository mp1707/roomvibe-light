
"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { memo, useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitch from "./LanguageSwitch";
import { Cog6ToothIcon } from "@heroicons/react/24/outline"; // Using a different cog icon for clarity

interface DesktopSettingsMenuProps {
  className?: string;
}

const MenuIcon = memo(({ isOpen }: { isOpen: boolean }) => {
  return <Cog6ToothIcon className="w-5 h-5 text-base-content" />;
});

MenuIcon.displayName = "MenuIcon";

const DesktopSettingsMenu = memo(({ className = "" }: DesktopSettingsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<DOMRect | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Components.Header"); // Using Header translations for now

  const handleToggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Escape" && isOpen) {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  }, [isOpen]);

  const updateButtonPosition = useCallback(() => {
    if (buttonRef.current) {
      setButtonPosition(buttonRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    updateButtonPosition();
    window.addEventListener("resize", updateButtonPosition);
    return () => window.removeEventListener("resize", updateButtonPosition);
  }, [updateButtonPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuContentRef.current &&
        !menuContentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Animation variants from design system (copied from MobileMenu)
  const animationVariants = useMemo(
    () => ({
      menuVariants: {
        closed: {
          opacity: 0,
          scale: 0.95,
          y: -10,
          transition: { type: "spring" as const, stiffness: 400, damping: 30 },
        },
        open: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { type: "spring" as const, stiffness: 400, damping: 30 },
        },
      },
      backdropVariants: {
        closed: {
          opacity: 0,
          transition: { duration: 0.2 },
        },
        open: {
          opacity: 1,
          transition: { duration: 0.3 },
        },
      },
      buttonVariants: {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 },
      },
    }),
    []
  );

  // Button classes using design system tokens (copied from MobileMenu)
  const buttonClasses = useMemo(
    () =>
      "flex items-center justify-center w-10 h-10 rounded-lg bg-base-200/50 hover:bg-base-300/70 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border border-base-300/30",
    []
  );

  // Server-side rendering fallback
  if (typeof window === "undefined") {
    return (
      <div className={`relative ${className}`}>
        <motion.button
          variants={animationVariants.buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className={buttonClasses}
          aria-label={t("settings")}
          aria-expanded={false}
        >
          <MenuIcon isOpen={false} />
        </motion.button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop with glass effect */}
      <AnimatePresence>
        {isOpen &&
          createPortal(
            <motion.div
              variants={animationVariants.backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="
              fixed inset-0
              bg-base-100/60 dark:bg-base-100/50
              backdrop-blur-md
              z-[998]
            "
              onClick={handleToggleMenu}
            />,
            document.body
          )}
      </AnimatePresence>

      <div ref={menuRef} className={`relative ${className}`}>
        {/* Menu Button */}
        <motion.button
          ref={buttonRef}
          variants={animationVariants.buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleToggleMenu}
          onKeyDown={handleKeyDown}
          className={buttonClasses}
          aria-label={isOpen ? t("closeMenu") : t("settings")}
          aria-expanded={isOpen}
        >
          <MenuIcon isOpen={isOpen} />
        </motion.button>
      </div>

      {/* Menu Content */}
      <AnimatePresence>
        {isOpen &&
          buttonPosition &&
          createPortal(
            <motion.div
              ref={menuContentRef}
              variants={animationVariants.menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="
              fixed w-80
              bg-base-100/90 dark:bg-base-100/80
              backdrop-blur-md
              border border-base-300/50 dark:border-base-300/30
              rounded-2xl shadow-lg
              z-[999] overflow-hidden
            "
              style={{
                position: "absolute", // Changed to absolute for positioning relative to button
                top: buttonPosition.bottom + 8, // Position below the button
                right: window.innerWidth - buttonPosition.right, // Align to the right of the button
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="divide-y divide-base-300/30 dark:divide-base-300/20">
                {/* Settings Section */}
                <div className="p-4 bg-base-200/50 dark:bg-base-200/30">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-base-content">{t("theme")}</span>
                      <ThemeToggle />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-base-content">{t("language")}</span>
                      <LanguageSwitch variant="icon" />
                    </div>
                    <Link
                      href="/settings"
                      className="
                        flex items-center gap-2 p-2
                        text-base-content/60 hover:text-base-content
                        transition-all duration-200
                        rounded-lg hover:bg-base-200/50
                        group
                      "
                      aria-label={t("settings")}
                      onClick={handleToggleMenu} // Close menu on navigation
                    >
                      <Cog6ToothIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                      <span className="text-sm font-medium">{t("devSettings")}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>,
            document.body
          )}
      </AnimatePresence>
    </>
  );
});

DesktopSettingsMenu.displayName = "DesktopSettingsMenu";

export default DesktopSettingsMenu;
