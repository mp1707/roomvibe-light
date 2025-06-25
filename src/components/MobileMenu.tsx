"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CreditsDisplay from "./CreditsDisplay";
import ThemeToggle from "./ThemeToggle";
import { createClient } from "@/utils/supabase/client";
import { signOut } from "@/app/auth/login/actions";

interface MobileMenuProps {
  className?: string;
}

const MobileMenu = ({ className = "" }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [buttonPosition, setButtonPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + 8, // 8px gap (mt-2)
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(!isOpen);
  };

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent scrolling when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        stiffness: 400,
        damping: 30,
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        stiffness: 400,
        damping: 30,
      },
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

  return (
    <>
      {/* Backdrop - Portal to body for full-screen coverage */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={backdropVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed inset-0 bg-black/50 backdrop-blur-lg z-[998]"
                onClick={toggleMenu}
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
          onClick={toggleMenu}
          onKeyDown={handleKeyDown}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-base-200/50 hover:bg-base-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border border-base-300/30"
          aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={isOpen}
        >
          <svg
            className="w-5 h-5 text-base-content"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </motion.button>
      </div>

      {/* Menu Content - Portal to body */}
      {typeof window !== "undefined" &&
        buttonPosition &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
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
              >
                <div className="p-4 space-y-4">
                  {/* User Section */}
                  {!loading && (
                    <div className="pb-4 border-b border-base-300/50">
                      {user ? (
                        <div className="space-y-3">
                          {/* User Info */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                              {user.user_metadata?.avatar_url ? (
                                <img
                                  src={user.user_metadata.avatar_url}
                                  alt=""
                                  className="w-10 h-10 rounded-xl object-cover"
                                />
                              ) : (
                                <span className="text-sm font-semibold text-primary">
                                  {(
                                    user.user_metadata?.full_name?.split(
                                      " "
                                    )[0] ||
                                    user.user_metadata?.name?.split(" ")[0] ||
                                    user.email?.split("@")[0] ||
                                    "U"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-base-content truncate">
                                {user.user_metadata?.full_name ||
                                  user.user_metadata?.name ||
                                  user.email?.split("@")[0] ||
                                  "Benutzer"}
                              </p>
                              <p className="text-xs text-base-content/60 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          {/* Credits Display */}
                          <div>
                            <p className="text-xs font-medium text-base-content/60 mb-2">
                              Verfügbares Guthaben
                            </p>
                            <CreditsDisplay className="flex" />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-2">
                          <button
                            onClick={() => {
                              toggleMenu();
                              window.location.href = "/auth/login";
                            }}
                            className="w-full btn btn-primary h-10 rounded-lg font-semibold text-sm"
                          >
                            Anmelden
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation Links */}
                  <nav className="space-y-2">
                    <Link
                      href="/inspiration"
                      onClick={toggleMenu}
                      className="flex items-center gap-3 px-3 py-3 text-base-content hover:bg-base-200/50 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors">
                        <svg
                          className="w-4 h-4 text-base-content/70"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">Inspiration</span>
                    </Link>

                    {user && (
                      <Link
                        href="/private"
                        onClick={toggleMenu}
                        className="flex items-center gap-3 px-3 py-3 text-base-content hover:bg-base-200/50 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors">
                          <svg
                            className="w-4 h-4 text-base-content/70"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <span className="font-medium">Mein Bereich</span>
                      </Link>
                    )}

                    <Link
                      href="/buy-credits"
                      onClick={toggleMenu}
                      className="flex items-center gap-3 px-3 py-3 text-primary hover:bg-primary/10 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                        {/* Euro Symbol - Updated from Dollar */}
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5m-5 3h5m6.75-1.5a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">Guthaben kaufen</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={toggleMenu}
                      className="flex items-center gap-3 px-3 py-3 text-base-content hover:bg-base-200/50 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors">
                        <svg
                          className="w-4 h-4 text-base-content/70"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">Einstellungen</span>
                    </Link>
                  </nav>

                  {/* Bottom Section */}
                  <div className="pt-3 border-t border-base-300/50 space-y-3">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-base-200">
                          <svg
                            className="w-4 h-4 text-base-content/70"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                          </svg>
                        </div>
                        <span className="font-medium text-base-content">
                          Dark Mode
                        </span>
                      </div>
                      <ThemeToggle />
                    </div>

                    {/* Sign Out */}
                    {user && (
                      <form action={signOut}>
                        <button
                          type="submit"
                          onClick={toggleMenu}
                          className="flex items-center gap-3 px-3 py-3 w-full text-error hover:bg-error/10 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-error/20 group-hover:bg-error/30 transition-colors">
                            <svg
                              className="w-4 h-4 text-error"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                          </div>
                          <span className="font-medium">Abmelden</span>
                        </button>
                      </form>
                    )}
                  </div>
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
