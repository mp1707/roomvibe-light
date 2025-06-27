import React from "react";
import {
  HeartIcon,
  UserIcon,
  CurrencyEuroIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
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
      icon={<HeartIcon className="w-4 h-4 text-base-content/70" />}
      label="Inspiration"
    />

    {user && (
      <NavigationLink
        href="/private"
        onClick={onNavigationClick}
        icon={<UserIcon className="w-4 h-4 text-base-content/70" />}
        label="Mein Bereich"
      />
    )}

    <NavigationLink
      href="/buy-credits"
      onClick={onNavigationClick}
      icon={<CurrencyEuroIcon className="w-5 h-5 text-primary" />}
      label="Guthaben kaufen"
      variant="primary"
    />

    <NavigationLink
      href="/settings"
      onClick={onNavigationClick}
      icon={<CogIcon className="w-4 h-4 text-base-content/70" />}
      label="Einstellungen"
    />
  </nav>
);
