"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  cardVariants,
  buttonVariants,
  useMotionPreference,
} from "@/utils/animations";

const NotFoundPage = () => {
  const router = useRouter();
  const reducedMotion = useMotionPreference();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center px-4">
      <motion.div
        variants={reducedMotion ? {} : cardVariants}
        initial="initial"
        animate="animate"
        className="max-w-md w-full text-center space-y-8"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative"
        >
          <div className="text-9xl font-bold text-primary/20 select-none">
            404
          </div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <svg
              className="w-16 h-16 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h.01M15 8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-base-content">
            Seite nicht gefunden
          </h1>
          <p className="text-base-content/70 leading-relaxed">
            Die angeforderte Seite konnte nicht gefunden werden. Möglicherweise
            wurde sie verschoben oder existiert nicht mehr.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              variants={reducedMotion ? {} : buttonVariants}
              whileHover={reducedMotion ? {} : "hover"}
              whileTap={reducedMotion ? {} : "tap"}
              onClick={handleGoHome}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-focus text-primary-content font-semibold rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Zur Startseite
            </motion.button>

            <motion.button
              variants={reducedMotion ? {} : buttonVariants}
              whileHover={reducedMotion ? {} : "hover"}
              whileTap={reducedMotion ? {} : "tap"}
              onClick={handleGoBack}
              className="inline-flex items-center justify-center px-6 py-3 bg-base-200 hover:bg-base-300 text-base-content font-medium rounded-xl transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Zurück
            </motion.button>
          </div>

          {/* Additional Links */}
          <div className="pt-4 text-sm text-base-content/60">
            <p className="mb-3">Oder besuchen Sie eine dieser Seiten:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/inspiration"
                className="text-primary hover:text-primary-focus transition-colors duration-200 hover:underline"
              >
                Inspiration
              </Link>
              <Link
                href="/auth/login"
                className="text-primary hover:text-primary-focus transition-colors duration-200 hover:underline"
              >
                Anmelden
              </Link>
              <Link
                href="/buy-credits"
                className="text-primary hover:text-primary-focus transition-colors duration-200 hover:underline"
              >
                Credits kaufen
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Decorative Element */}
        <motion.div
          className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
