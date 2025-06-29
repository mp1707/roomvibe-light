import React from "react";
import { useTranslations } from "next-intl";
import ThemeToggle from "../../ThemeToggle";
import LanguageSwitch from "../../LanguageSwitch";
import { CogIcon, MoonIcon } from "@heroicons/react/24/outline";
import { Link } from "@/i18n/navigation";

export const SettingsSection = () => {
  const t = useTranslations("Components.MobileMenu");

  return (
    <div className="pt-4 border-t border-base-300/50 space-y-2">
      <h3 className="px-3 text-xs font-semibold text-base-content/60 uppercase tracking-wider">
        {t("settings")}
      </h3>
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-3">
          <MoonIcon className="w-5 h-5 text-base-content/70" />
          <span className="font-medium text-base-content">
            {t("darkMode")}
          </span>
        </div>
        <ThemeToggle />
      </div>
      <div className="px-3 py-2">
        <LanguageSwitch />
      </div>
      <Link
        href="/settings"
        className="flex items-center gap-3 px-3 py-2 hover:bg-base-200/50 rounded-lg transition-colors"
      >
        <CogIcon className="w-5 h-5 text-base-content/70" />
        <span className="font-medium text-base-content">
          {t("generalSettings")}
        </span>
      </Link>
    </div>
  );
};
