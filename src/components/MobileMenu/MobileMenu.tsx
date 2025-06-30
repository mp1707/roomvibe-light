"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { createClient } from "@/utils/supabase/client";
import { Link } from "@/i18n/navigation";
import CreditsDisplay from "../CreditsDisplay";
import ThemeToggle from "../ThemeToggle";
import LanguageSwitch from "../LanguageSwitch";
import {
  HeartIcon,
  UserIcon,
  CurrencyEuroIcon,
  PhotoIcon,
  CogIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";

// Animation variants following design system specifications
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as any },
  },
};

const menuPanelVariants = {
  hidden: {
    x: "100%",
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as any },
  },
  visible: {
    x: 0,
    transition: {
      stiffness: 400,
      damping: 30,
    },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      stiffness: 400,
      damping: 30,
      delay: i * 0.05,
    },
  }),
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const t = useTranslations("Components.MobileMenu");
  const supabase = createClient();

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAuthRedirect = () => {
    handleClose();
    window.location.href = "/auth/login";
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    handleClose();
  };

  const getUserDisplayName = (user: any) => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.email) return user.email.split("@")[0];
    return "Benutzer";
  };

  const getUserInitial = (user: any) => {
    const name = getUserDisplayName(user);
    return name.charAt(0).toUpperCase();
  };

  const getUserAvatarUrl = (user: any) => {
    // Handle different OAuth providers and their avatar URL structures
    if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
    if (user?.user_metadata?.picture) return user.user_metadata.picture; // Google OAuth
    if (user?.user_metadata?.avatar) return user.user_metadata.avatar;
    return null;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  return (
    <div className="lg:hidden">
      {/* Menu Button */}
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="
          flex items-center justify-center w-10 h-10 
          rounded-lg bg-base-200/50 hover:bg-base-300/70 
          transition-colors duration-200 
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 
          border border-base-300/30
        "
        aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <XMarkIcon className="w-5 h-5 text-base-content" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <Bars3Icon className="w-5 h-5 text-base-content" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Menu Overlay - Portal to body */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[9999] lg:hidden">
                {/* Backdrop */}
                <motion.div
                  variants={backdropVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={handleClose}
                />

                {/* Menu Panel */}
                <motion.div
                  variants={menuPanelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="
                    absolute top-0 right-0 h-full w-80 max-w-[85vw]
                    bg-base-100 shadow-2xl
                  "
                >
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-base-300 bg-base-100">
                      <h2 className="text-lg font-semibold text-base-content">
                        Menü
                      </h2>
                      <button
                        onClick={handleClose}
                        className="p-2 rounded-lg hover:bg-base-200 transition-colors"
                        aria-label="Menü schließen"
                      >
                        <XMarkIcon className="w-5 h-5 text-base-content" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto bg-base-100">
                      {/* User Section */}
                      {!loading && (
                        <div className="p-4 border-b border-base-300 bg-base-100">
                          {user ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    {getUserAvatarUrl(user) && !imageError ? (
                                      <img
                                        src={getUserAvatarUrl(user)}
                                        alt={`Profilbild von ${getUserDisplayName(
                                          user
                                        )}`}
                                        className="w-10 h-10 rounded-full object-cover"
                                        onError={handleImageError}
                                        onLoad={handleImageLoad}
                                      />
                                    ) : (
                                      <span className="text-lg font-bold text-primary">
                                        {getUserInitial(user)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-base-content truncate">
                                      {getUserDisplayName(user)}
                                    </p>
                                    <p className="text-xs text-base-content/60 truncate">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={handleSignOut}
                                  className="p-2 rounded-full hover:bg-base-200 transition-colors flex-shrink-0"
                                  aria-label="Abmelden"
                                >
                                  <ArrowRightEndOnRectangleIcon className="w-5 h-5 text-base-content/70" />
                                </button>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-base-content/60 mb-1">
                                  Verfügbares Guthaben
                                </p>
                                <CreditsDisplay className="flex" />
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={handleAuthRedirect}
                              className="w-full bg-primary hover:bg-primary-focus text-primary-content h-12 rounded-xl font-semibold text-base transition-colors"
                            >
                              Anmelden
                            </button>
                          )}
                        </div>
                      )}

                      {/* Navigation */}
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="p-4 space-y-2 bg-base-100"
                      >
                        {user && (
                          <motion.div variants={menuItemVariants} custom={0}>
                            <Link
                              href="/upload"
                              onClick={handleClose}
                              className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary font-semibold rounded-lg transition-colors duration-200 hover:bg-primary/20 w-full"
                            >
                              <PhotoIcon className="w-5 h-5 flex-shrink-0" />
                              <span>Foto hochladen</span>
                            </Link>
                          </motion.div>
                        )}

                        <motion.div variants={menuItemVariants} custom={1}>
                          <Link
                            href="/inspiration"
                            onClick={handleClose}
                            className="flex items-center gap-3 px-4 py-3 text-base-content hover:bg-base-200 rounded-lg transition-colors w-full"
                          >
                            <HeartIcon className="w-5 h-5 text-base-content/70 flex-shrink-0" />
                            <span>Inspiration</span>
                          </Link>
                        </motion.div>

                        {user && (
                          <motion.div variants={menuItemVariants} custom={2}>
                            <Link
                              href="/private"
                              onClick={handleClose}
                              className="flex items-center gap-3 px-4 py-3 text-base-content hover:bg-base-200 rounded-lg transition-colors w-full"
                            >
                              <UserIcon className="w-5 h-5 text-base-content/70 flex-shrink-0" />
                              <span>Mein Bereich</span>
                            </Link>
                          </motion.div>
                        )}

                        <motion.div variants={menuItemVariants} custom={3}>
                          <Link
                            href="/buy-credits"
                            onClick={handleClose}
                            className="flex items-center gap-3 px-4 py-3 text-base-content hover:bg-base-200 rounded-lg transition-colors w-full"
                          >
                            <CurrencyEuroIcon className="w-5 h-5 text-base-content/70 flex-shrink-0" />
                            <span>Guthaben kaufen</span>
                          </Link>
                        </motion.div>
                      </motion.div>

                      {/* Settings */}
                      <div className="p-4 bg-base-200/30 border-t border-base-300 space-y-4">
                        <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider">
                          Einstellungen
                        </h3>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-base-content">
                            Design
                          </span>
                          <ThemeToggle />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-base-content">
                            Sprache
                          </span>
                          <LanguageSwitch />
                        </div>

                        <Link
                          href="/settings"
                          onClick={handleClose}
                          className="flex items-center gap-3 p-2 text-base-content hover:bg-base-200/50 rounded-lg transition-colors w-full"
                        >
                          <CogIcon className="w-5 h-5 text-base-content/70 flex-shrink-0" />
                          <span className="text-sm font-medium">
                            Entwickler-Einstellungen
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};

export default MobileMenu;
