"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to your error reporting service
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto text-center"
      >
        <div className="bg-base-100 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-error/10 to-warning/10 px-6 py-4 border-b border-base-200">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-error/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-error"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-base-content">
                Etwas ist schiefgelaufen
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <p className="text-base-content/70 leading-relaxed mb-6">
              Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es
              erneut.
            </p>

            {process.env.NODE_ENV === "development" && (
              <details className="mb-4 text-left">
                <summary className="text-sm text-base-content/50 cursor-pointer hover:text-base-content/70">
                  Fehlerdetails (Development)
                </summary>
                <pre className="mt-2 text-xs bg-base-200 rounded p-2 overflow-auto">
                  {error.message}
                </pre>
              </details>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-base-50 border-t border-base-200 space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={reset}
              className="w-full px-4 py-3 bg-primary hover:bg-primary-focus text-primary-content font-medium rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Erneut versuchen
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/")}
              className="w-full px-4 py-3 bg-base-200 hover:bg-base-300 text-base-content font-medium rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Zur Startseite
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
