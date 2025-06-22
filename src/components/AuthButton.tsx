"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { signOut } from "@/app/auth/login/actions";

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client before doing any auth-related rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isClient]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest("[data-dropdown]")) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Show loading state until client-side hydration is complete
  if (!isClient || loading) {
    return (
      <div className="h-9 px-4 bg-base-200 rounded-xl flex items-center animate-pulse">
        <div className="w-16 h-4 bg-base-300 rounded"></div>
      </div>
    );
  }

  if (!user) {
    const handleSignIn = () => {
      window.location.href = "/auth/login";
    };

    return (
      <button
        onClick={handleSignIn}
        className="btn btn-primary h-9 px-4 min-h-0 rounded-xl font-medium text-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100"
        aria-label="Sign in to your account"
      >
        Sign In
      </button>
    );
  }

  // Extract first name or fallback to email
  const displayName =
    user.user_metadata?.full_name?.split(" ")[0] ||
    user.user_metadata?.name?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <div className="relative" data-dropdown>
      {/* User Info Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 h-9 px-3 bg-base-200 hover:bg-base-300 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
        aria-label={`Account menu for ${displayName}`}
      >
        {/* Avatar */}
        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <span className="text-xs font-medium text-primary">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Name - Hidden on mobile */}
        <span className="hidden sm:block text-sm font-medium text-base-content truncate max-w-24">
          {displayName}
        </span>

        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-base-content/60 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-base-100 rounded-xl shadow-lg border border-base-300 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-base-300">
            <p className="text-sm font-medium text-base-content truncate">
              {user.user_metadata?.full_name || displayName}
            </p>
            <p className="text-xs text-base-content/60 truncate">
              {user.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <a
              href="/private"
              className="flex items-center px-4 py-2 text-sm text-base-content hover:bg-base-200 transition-colors duration-150"
            >
              <svg
                className="w-4 h-4 mr-3 text-base-content/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile
            </a>
          </div>

          {/* Sign Out */}
          <div className="border-t border-base-300 pt-1">
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors duration-150 focus:outline-none focus:bg-error/10"
              >
                <svg
                  className="w-4 h-4 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
