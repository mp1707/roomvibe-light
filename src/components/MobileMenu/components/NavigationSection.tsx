import React from "react";
import { HeartIcon, UserIcon, EuroIcon, SettingsIconSmall } from "../../Icons";
import { NavigationLink } from "./NavigationLink";
import type { User } from "../hooks/useAuth";

interface NavigationSectionProps {
  user: User | null;
  onNavigationClick: () => void;
}

export const NavigationSection = ({
  user,
  onNavigationClick,
}: NavigationSectionProps) => (
  <nav className="space-y-2">
    <NavigationLink
      href="/inspiration"
      onClick={onNavigationClick}
      icon={<HeartIcon />}
      label="Inspiration"
    />

    {user && (
      <NavigationLink
        href="/private"
        onClick={onNavigationClick}
        icon={<UserIcon />}
        label="Mein Bereich"
      />
    )}

    <NavigationLink
      href="/buy-credits"
      onClick={onNavigationClick}
      icon={<EuroIcon />}
      label="Guthaben kaufen"
      variant="primary"
    />

    <NavigationLink
      href="/settings"
      onClick={onNavigationClick}
      icon={<SettingsIconSmall />}
      label="Einstellungen"
    />
  </nav>
);
