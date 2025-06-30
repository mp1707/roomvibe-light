import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabase] = useState(() => createClient());

  // Debug when user state changes
  useEffect(() => {
    console.log(
      "👤 User state changed:",
      user?.id || "null",
      "isAuthenticated:",
      !!user
    );
  }, [user]);

  const refreshUser = useCallback(async () => {
    console.log("🔄 refreshUser called");
    try {
      setError(null);

      // First check if there's an active session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("❌ Error getting session:", sessionError);
        setError(sessionError.message);
        setUser(null);
        return;
      }

      // If no session, user is logged out (this is normal, not an error)
      if (!session) {
        console.log("🚫 No session found - user logged out");
        setUser(null);
        return;
      }

      console.log(
        "✅ Session found, getting user details for:",
        session.user?.id
      );

      // If there's a session, get the user details
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("❌ Error getting user:", authError);
        setError(authError.message);
        setUser(null);
      } else {
        console.log("✅ User data retrieved:", user?.id);
        setUser(user);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown authentication error";
      console.error("❌ Error in refreshUser:", err);
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    console.log("🚀 useAuth hook initializing");

    // Check if there's already a session (important after login redirects)
    const checkInitialSession = async () => {
      console.log("🔍 Checking for existing session on mount");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log(
        "📋 Initial session check:",
        session?.user?.id || "no session"
      );
    };

    checkInitialSession();

    // Initial user state
    refreshUser();

    // Listen for auth state changes
    console.log("👂 Setting up auth state listener");
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        "🔐 Auth state changed:",
        event,
        "User ID:",
        session?.user?.id,
        "Session exists:",
        !!session
      );

      // Handle different auth events
      switch (event) {
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
          console.log("✅ Setting user from session:", session?.user?.id);
          setUser(session?.user ?? null);
          setError(null);
          setLoading(false);
          break;
        case "SIGNED_OUT":
          console.log("🚪 User signed out, clearing user state");
          setUser(null);
          setError(null);
          setLoading(false);
          break;
        case "PASSWORD_RECOVERY":
        case "USER_UPDATED":
          console.log("🔄 Refreshing user data for event:", event);
          await refreshUser();
          break;
        default:
          console.log("📝 Default case - setting user:", session?.user?.id);
          setUser(session?.user ?? null);
          setError(null);
          setLoading(false);
      }
    });

    return () => {
      console.log("🧹 Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [supabase, refreshUser]);

  return {
    user,
    loading,
    error,
    refreshUser,
    isAuthenticated: !!user,
  };
};
