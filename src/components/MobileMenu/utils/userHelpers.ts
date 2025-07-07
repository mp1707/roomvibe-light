import type { User } from "@supabase/supabase-js";

export const getUserDisplayName = (user: User): string => {
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Benutzer"
  );
};

export const getUserInitial = (user: User): string => {
  const name =
    user.user_metadata?.full_name?.split(" ")[0] ||
    user.user_metadata?.name?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "U";
  return name.charAt(0).toUpperCase();
};
