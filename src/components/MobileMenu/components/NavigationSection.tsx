import React from "react";
import Link from "next/link";
import {
  HeartIcon,
  UserIcon,
  CurrencyEuroIcon,
  CogIcon,
  PhotoIcon,
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
    {/* Main Upload Button - Prominent styling for authenticated users */}
    {user && (
      <div className="relative mb-4">
        <Link
          href="/upload"
          onClick={onNavigationClick}
          className="flex items-center gap-3 px-4 py-4 bg-primary hover:bg-primary-focus text-primary-content font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-primary-content/20 rounded-lg">
            <PhotoIcon className="w-5 h-5 text-primary-content" />
          </div>
          <span className="font-semibold">Foto hochladen</span>
          <svg
            className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-content/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        </Link>
      </div>
    )}

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
