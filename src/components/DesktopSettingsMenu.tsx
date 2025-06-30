"use client";

import { useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitch from "./LanguageSwitch";

const DesktopSettingsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Components.DesktopSettingsMenu");

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Settings Button */}
      <button
        onClick={handleToggle}
        className="
          flex items-center justify-center w-10 h-10 
          rounded-lg bg-base-200/50 hover:bg-base-300/70 
          transition-all duration-200 
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 
          border border-base-300/30
        "
        aria-label={t("settings")}
      >
        <Cog6ToothIcon className="w-5 h-5 text-base-content" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close menu */}
          <div className="fixed inset-0 z-10" onClick={handleClose} />

          {/* Menu Content */}
          <div
            className="
            absolute right-0 top-12 w-80 z-20
            bg-base-100 rounded-2xl shadow-lg border border-base-300/50
            p-4
          "
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-base-content">
                  {t("design")}
                </span>
                <ThemeToggle />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-base-content">
                  {t("language")}
                </span>
                <LanguageSwitch variant="icon" />
              </div>

              <hr className="border-base-300/30" />

              <Link
                href="/settings"
                onClick={handleClose}
                className="
                  flex items-center gap-2 p-2
                  text-base-content/60 hover:text-base-content
                  transition-all duration-200
                  rounded-lg hover:bg-base-200/50
                  group w-full
                "
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {t("developerSettings")}
                </span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DesktopSettingsMenu;
