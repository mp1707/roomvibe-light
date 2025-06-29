"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CogIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export const SettingsHeader = () => {
  const t = useTranslations("SettingsPage");
  return (
    <div className="mb-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-base-content/60 hover:text-base-content transition-colors mb-4 group"
      >
        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {t("backToHome")}
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <CogIcon className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-base-content">
          {t("developerSettings")}
        </h1>
      </div>

      <p className="text-base-content/60 leading-relaxed">
        {t("settingsDescription")}
      </p>
    </div>
  );
};
