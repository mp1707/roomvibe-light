import React from "react";
import ThemeToggle from "../../ThemeToggle";
import {
  MoonIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "@/app/auth/login/actions";
import type { User } from "../hooks/useAuth";

interface BottomSectionProps {
  user: User | null;
  onNavigationClick: () => void;
}

export const BottomSection = ({
  user,
  onNavigationClick,
}: BottomSectionProps) => (
  <div className="pt-3 border-t border-base-300/50 space-y-3">
    {/* Theme Toggle */}
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-base-200">
          <MoonIcon className="w-4 h-4 text-base-content/70" />
        </div>
        <span className="font-medium text-base-content">Dark Mode</span>
      </div>
      <ThemeToggle />
    </div>

    {/* Sign Out */}
    {user && (
      <form action={signOut}>
        <button
          type="submit"
          onClick={onNavigationClick}
          className="flex items-center gap-3 px-3 py-3 w-full text-error hover:bg-error/10 rounded-lg transition-colors group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-error/20 group-hover:bg-error/30 transition-colors">
            <ArrowRightOnRectangleIcon className="w-4 h-4 text-error" />
          </div>
          <span className="font-medium">Abmelden</span>
        </button>
      </form>
    )}
  </div>
);
