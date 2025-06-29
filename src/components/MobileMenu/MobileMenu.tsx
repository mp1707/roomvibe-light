"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { memo, useMemo } from "react";
import { useAuth } from "./hooks/useAuth";
import { useMenuState } from "./hooks/useMenuState";
import { UserSection } from "./components/UserSection";
import { NavigationSection } from "./components/NavigationSection";
import { SettingsSection } from "./components/SettingsSection";
import { useTranslations } from "next-intl";

interface MobileMenuProps {
  className?: string;
}

const MenuIcon = memo(({ isOpen }: { isOpen: boolean }) => {
  const IconComponent = isOpen ? XMarkIcon : Bars3Icon;
  return <IconComponent className="w-5 h-5 text-base-content" />;
});

MenuIcon.displayName = "MenuIcon";

const MobileMenu = memo(({ className = "" }: MobileMenuProps) => {
  const { user, loading } = useAuth();
  const {
    isOpen,
    buttonPosition,
    menuRef,
    buttonRef,
    menuContentRef,
    handleToggleMenu,
    handleKeyDown,
    handleNavigationClick,
    handleAuthRedirect,
  } = useMenuState();
  const t = useTranslations("Components.MobileMenu");

  // Animation variants from design system
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

  // Button classes using design system tokens
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
          aria-label={t("openMenu")}
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
          aria-label={isOpen ? t("closeMenu") : t("openMenu")}
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
                position: "fixed",
                top: buttonPosition.top + 8,
                right: buttonPosition.right,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="divide-y divide-base-300/30 dark:divide-base-300/20">
                {/* User Section */}
                {!loading && (
                  <div className="p-4">
                    <UserSection user={user} onAuthClick={handleAuthRedirect} />
                  </div>
                )}

                {/* Navigation Links */}
                <div className="p-4">
                  <NavigationSection
                    user={user}
                    onNavigationClick={handleNavigationClick}
                  />
                </div>

                {/* SettingsSection */}
                <div className="p-4 bg-base-200/50 dark:bg-base-200/30">
                  <SettingsSection />
                </div>
              </div>
            </motion.div>,
            document.body
          )}
      </AnimatePresence>
    </>
  );
});

MobileMenu.displayName = "MobileMenu";

export default MobileMenu;
