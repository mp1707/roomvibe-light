"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { memo, useMemo } from "react";
import { useAuth } from "./hooks/useAuth";
import { useMenuState } from "./hooks/useMenuState";
import { UserSection } from "./components/UserSection";
import { NavigationSection } from "./components/NavigationSection";
import { BottomSection } from "./components/BottomSection";

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

  // Memoize animation variants to prevent recreation on each render
  const animationVariants = useMemo(
    () => ({
      menuVariants: {
        closed: {
          opacity: 0,
          scale: 0.95,
          y: -10,
          transition: { stiffness: 400, damping: 30 },
        },
        open: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { stiffness: 400, damping: 30 },
        },
      },
      backdropVariants: {
        closed: { opacity: 0 },
        open: { opacity: 1 },
      },
      buttonVariants: {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 },
      },
    }),
    []
  );

  // Memoize button classes
  const buttonClasses = useMemo(
    () =>
      "flex items-center justify-center w-10 h-10 rounded-lg bg-base-200/50 hover:bg-base-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border border-base-300/30",
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
          aria-label="Menü öffnen"
          aria-expanded={false}
        >
          <MenuIcon isOpen={false} />
        </motion.button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop - Only render when open */}
      {isOpen &&
        createPortal(
          <motion.div
            variants={animationVariants.backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/50 backdrop-blur-lg z-[998]"
            onClick={handleToggleMenu}
          />,
          document.body
        )}

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
          aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={isOpen}
        >
          <MenuIcon isOpen={isOpen} />
        </motion.button>
      </div>

      {/* Menu Content - Only render when open and buttonPosition exists */}
      {isOpen &&
        buttonPosition &&
        createPortal(
          <motion.div
            ref={menuContentRef}
            variants={animationVariants.menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed w-80 bg-base-100/90 backdrop-blur-sm border border-base-300/50 rounded-xl shadow-lg z-[999] overflow-hidden"
            style={{
              position: "fixed",
              top: buttonPosition.top,
              right: buttonPosition.right,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 space-y-4">
              {/* User Section */}
              {!loading && (
                <UserSection user={user} onAuthClick={handleAuthRedirect} />
              )}

              {/* Navigation Links */}
              <NavigationSection
                user={user}
                onNavigationClick={handleNavigationClick}
              />

              {/* Bottom Section */}
              <BottomSection
                user={user}
                onNavigationClick={handleNavigationClick}
              />
            </div>
          </motion.div>,
          document.body
        )}
    </>
  );
});

MobileMenu.displayName = "MobileMenu";

export default MobileMenu;
