"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "./hooks/useAuth";
import { useMenuState } from "./hooks/useMenuState";
import { UserSection } from "./components/UserSection";
import { NavigationSection } from "./components/NavigationSection";
import { BottomSection } from "./components/BottomSection";

interface MobileMenuProps {
  className?: string;
}

const MenuIcon = ({ isOpen }: { isOpen: boolean }) => {
  const IconComponent = isOpen ? XMarkIcon : Bars3Icon;
  return <IconComponent className="w-5 h-5 text-base-content" />;
};

const MobileMenu = ({ className = "" }: MobileMenuProps) => {
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

  // Animation variants
  const menuVariants = {
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
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // Server-side rendering fallback
  if (typeof window === "undefined") {
    return (
      <div className={`relative ${className}`}>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-base-200/50 hover:bg-base-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border border-base-300/30"
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
      {/* Backdrop - Portal to body for full-screen coverage */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 bg-black/50 backdrop-blur-lg z-[998]"
              onClick={handleToggleMenu}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          )}
        </AnimatePresence>,
        document.body
      )}

      <div ref={menuRef} className={`relative ${className}`}>
        {/* Menu Button */}
        <motion.button
          ref={buttonRef}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleToggleMenu}
          onKeyDown={handleKeyDown}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-base-200/50 hover:bg-base-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border border-base-300/30"
          aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={isOpen}
        >
          <MenuIcon isOpen={isOpen} />
        </motion.button>
      </div>

      {/* Menu Content - Portal to body */}
      {buttonPosition &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={menuContentRef}
                variants={menuVariants}
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
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default MobileMenu;
