"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCreditsStore } from "@/utils/creditsStore";
import { createClient } from "@/utils/supabase/client";

interface CreditsDisplayProps {
  className?: string;
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ className = "" }) => {
  const { credits, isLoading, fetchCredits, error } = useCreditsStore();

  useEffect(() => {
    const checkAuthAndFetchCredits = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await fetchCredits();
      } else {
        // Reset credits if no user session
        useCreditsStore.getState().reset();
      }
    };

    checkAuthAndFetchCredits();

    // Listen for auth state changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        useCreditsStore.getState().reset();
      } else if (event === "SIGNED_IN" && session?.user) {
        fetchCredits();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchCredits]);

  // Additional auth check to ensure we have a valid session
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user && credits !== null) {
        // If no session but credits exist, reset them
        useCreditsStore.getState().reset();
      }
    };

    checkAuth();
  }, [credits]);

  // Don't render if user is not authenticated (credits is null and not loading)
  if (credits === null && !isLoading) {
    return null;
  }

  const displayCredits = credits ?? 0;

  return (
    <Link
      href="/buy-credits"
      className={`group flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-base-200 ${className}`}
    >
      <motion.div
        className="flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Star Icon */}
        <motion.svg
          className="w-5 h-5 text-warning"
          fill="currentColor"
          viewBox="0 0 24 24"
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 15 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </motion.svg>

        {/* Credits Count */}
        <span className="text-base-content group-hover:text-primary transition-colors">
          {isLoading ? (
            <span className="inline-block w-8 h-4 bg-base-300 rounded animate-pulse" />
          ) : (
            <motion.span
              key={displayCredits} // Re-animate when credits change
              initial={{ scale: 1.2, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {displayCredits.toLocaleString()}
            </motion.span>
          )}
        </span>

        {/* Plus icon for buying more */}
        <motion.svg
          className="w-4 h-4 text-base-content/40 group-hover:text-primary transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </motion.svg>
      </motion.div>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-base-content text-base-100 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
        Credits kaufen
      </div>

      {/* Error indicator */}
      {error && (
        <motion.div
          className="w-2 h-2 bg-error rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          title={error}
        />
      )}
    </Link>
  );
};

export default CreditsDisplay;
