import React from "react";
import { Link } from "@/i18n/navigation";
import {
  HeartIcon,
  UserIcon,
  CurrencyEuroIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { NavigationLink } from "./NavigationLink";
import { useTranslations } from "next-intl";
import type { User } from "../hooks/useAuth";

interface NavigationSectionProps {
  user: User | null;
  onNavigationClick: () => void;
}

export const NavigationSection = ({ user, onNavigationClick }: NavigationSectionProps) => {
  const t = useTranslations("Components.MobileMenu");

  return (
    <nav className="space-y-1">
      {user && (
        <Link
          href="/upload"
          onClick={onNavigationClick}
          className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary font-semibold rounded-lg transition-colors duration-200 hover:bg-primary/20 mb-2"
        >
          <PhotoIcon className="w-5 h-5" />
          <span>{t("uploadPhoto")}</span>
        </Link>
      )}
      <NavigationLink
        href="/inspiration"
        onClick={onNavigationClick}
        icon={<HeartIcon className="w-5 h-5 text-base-content/70" />}
        label={t("inspiration")}
      />
      {user && (
        <NavigationLink
          href="/private"
          onClick={onNavigationClick}
          icon={<UserIcon className="w-5 h-5 text-base-content/70" />}
          label={t("myArea")}
        />
      )}
      <NavigationLink
        href="/buy-credits"
        onClick={onNavigationClick}
        icon={<CurrencyEuroIcon className="w-5 h-5 text-base-content/70" />}
        label={t("buyBalance")}
      />
    </nav>
  );
};