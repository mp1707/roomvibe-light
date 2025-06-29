import React from "react";
import CreditsDisplay from "../../CreditsDisplay";
import type { User } from "../hooks/useAuth";
import { getUserDisplayName, getUserInitial } from "../utils/userHelpers";
import { useTranslations } from "next-intl";

interface UserSectionProps {
  user: User | null;
  onAuthClick: () => void;
}

export const UserSection = ({ user, onAuthClick }: UserSectionProps) => {
  const t = useTranslations("Components.MobileMenu");

  return (
    <div className="pb-4 border-b border-base-300/50">
      {user ? (
        <div className="space-y-3">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-primary">
                  {getUserInitial(user)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-base-content truncate">
                {getUserDisplayName(user)}
              </p>
              <p className="text-xs text-base-content/60 truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Credits Display */}
          <div>
            <p className="text-xs font-medium text-base-content/60 mb-2">
              {t("availableBalance")}
            </p>
            <CreditsDisplay className="flex" />
          </div>
        </div>
      ) : (
        <div className="text-center py-2">
          <button
            onClick={onAuthClick}
            className="w-full btn btn-primary h-10 rounded-lg font-semibold text-sm"
          >
            {t("signIn")}
          </button>
        </div>
      )}
    </div>
  );
};
