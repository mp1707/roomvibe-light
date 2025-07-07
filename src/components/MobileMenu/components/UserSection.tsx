import React from "react";
import CreditsDisplay from "../../CreditsDisplay";
import type { User } from "@supabase/supabase-js";
import { getUserDisplayName, getUserInitial } from "../utils/userHelpers";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { signOut } from "@/app/[locale]/auth/login/actions";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

interface UserSectionProps {
  user: User | null;
  onAuthClick: () => void;
}

export const UserSection = ({ user, onAuthClick }: UserSectionProps) => {
  const t = useTranslations("Components.MobileMenu");

  return (
    <div className="pb-4 border-b border-base-300/50">
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
              <div>
                <p className="font-semibold text-base-content">
                  {getUserDisplayName(user)}
                </p>
                <p className="text-xs text-base-content/60">{user.email}</p>
              </div>
            </div>
            <form action={signOut}>
              <button type="submit" className="p-2 rounded-full hover:bg-base-200/50 transition-colors">
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-base-content/70" />
              </button>
            </form>
          </div>
          <div>
            <p className="text-xs font-medium text-base-content/60 mb-1">
              {t("availableBalance")}
            </p>
            <CreditsDisplay className="flex" />
          </div>
        </div>
      ) : (
        <motion.div whileTap={{ scale: 0.95 }}>
          <button
            onClick={onAuthClick}
            className="w-full btn btn-primary h-12 rounded-xl font-semibold text-base"
          >
            {t("signIn")}
          </button>
        </motion.div>
      )}
    </div>
  );
};