"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
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

  return (
    <div className="lg:hidden">
      {/* Menu Button */}
      <button
        onClick={handleToggle}
        className="
          flex items-center justify-center w-10 h-10 
          rounded-lg bg-base-200/50 hover:bg-base-300/70 
          transition-all duration-200 
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 
          border border-base-300/30
        "
        aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
      >
        {isOpen ? (
          <XMarkIcon className="w-5 h-5 text-base-content" />
        ) : (
          <Bars3Icon className="w-5 h-5 text-base-content" />
        )}
      </button>

      {/* Mobile Menu Overlay - Portal to body */}
      {mounted &&
        isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleClose}
            />

            {/* Menu Panel */}
            <div
              className="
            absolute top-0 right-0 h-full w-80 max-w-[85vw]
            bg-base-100 shadow-2xl
            transform transition-transform duration-300 ease-out
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
                                {user.user_metadata?.avatar_url ? (
                                  <img
                                    src={user.user_metadata.avatar_url}
                                    alt=""
                                    className="w-10 h-10 rounded-full object-cover"
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
                              <ArrowRightOnRectangleIcon className="w-5 h-5 text-base-content/70" />
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
                  <div className="p-4 space-y-2 bg-base-100">
                    {user && (
                      <Link
                        href="/upload"
                        onClick={handleClose}
                        className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary font-semibold rounded-lg transition-colors duration-200 hover:bg-primary/20 w-full"
                      >
                        <PhotoIcon className="w-5 h-5 flex-shrink-0" />
                        <span>Foto hochladen</span>
                      </Link>
                    )}

                    <Link
                      href="/inspiration"
                      onClick={handleClose}
                      className="flex items-center gap-3 px-4 py-3 text-base-content hover:bg-base-200 rounded-lg transition-colors w-full"
                    >
                      <HeartIcon className="w-5 h-5 text-base-content/70 flex-shrink-0" />
                      <span>Inspiration</span>
                    </Link>

                    {user && (
                      <Link
                        href="/private"
                        onClick={handleClose}
                        className="flex items-center gap-3 px-4 py-3 text-base-content hover:bg-base-200 rounded-lg transition-colors w-full"
                      >
                        <UserIcon className="w-5 h-5 text-base-content/70 flex-shrink-0" />
                        <span>Mein Bereich</span>
                      </Link>
                    )}

                    <Link
                      href="/buy-credits"
                      onClick={handleClose}
                      className="flex items-center gap-3 px-4 py-3 text-base-content hover:bg-base-200 rounded-lg transition-colors w-full"
                    >
                      <CurrencyEuroIcon className="w-5 h-5 text-base-content/70 flex-shrink-0" />
                      <span>Guthaben kaufen</span>
                    </Link>
                  </div>

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
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default MobileMenu;
