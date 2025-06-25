"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  staggerContainer,
  staggerItem,
  cardVariants,
  buttonVariants,
  useMotionPreference,
} from "@/utils/animations";
import Image from "next/image";

const WelcomeScreen = () => {
  const router = useRouter();
  const reducedMotion = useMotionPreference();

  const handleGetStarted = () => {
    router.push("/auth/login");
  };

  const handleViewInspiration = () => {
    router.push("/inspiration");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
      <motion.div
        variants={reducedMotion ? {} : staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
      >
        {/* Hero Section */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-base-content mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Verwandle jeden Raum
            <br />
            <span className="text-primary">mit KI-Power.</span>
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl md:text-3xl text-base-content/60 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Lade ein Foto hoch. Erhalte personalisierte Designvorschläge.
            <br />
            Verwandle dein Zuhause in wenigen Klicks.
          </motion.p>
        </motion.div>

        {/* Visual Process Steps */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16"
        >
          {/* Step 1: Upload */}
          <motion.div
            variants={reducedMotion ? {} : cardVariants}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg
                className="w-10 h-10 md:w-12 md:h-12 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-base-content mb-2">
                1. Foto hochladen
              </h3>
              <p className="text-base-content/60 leading-relaxed">
                Einfach ein Bild deines Raumes aufnehmen oder hochladen
              </p>
            </div>
          </motion.div>

          {/* Step 2: AI Analysis */}
          <motion.div
            variants={reducedMotion ? {} : cardVariants}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-accent/10 flex items-center justify-center">
              <svg
                className="w-10 h-10 md:w-12 md:h-12 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-base-content mb-2">
                2. KI analysiert
              </h3>
              <p className="text-base-content/60 leading-relaxed">
                Unsere KI erkennt Stil, Farben und Potenzial deines Raumes
              </p>
            </div>
          </motion.div>

          {/* Step 3: Transform */}
          <motion.div
            variants={reducedMotion ? {} : cardVariants}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-success/10 flex items-center justify-center">
              <svg
                className="w-10 h-10 md:w-12 md:h-12 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-base-content mb-2">
                3. Transformation
              </h3>
              <p className="text-base-content/60 leading-relaxed">
                Erhalte personalisierte Designvorschläge und neue Versionen
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Preview Image */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="mb-12 md:mb-16"
        >
          <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
            <div className="aspect-[16/10] relative">
              <Image
                src="/assets/images/inspirationAfter.png"
                alt="RoomVibe KI-Transformation Beispiel"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            {/* Before/After Badge */}
            <div className="absolute top-4 left-4 bg-base-100/90 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-sm font-semibold text-base-content">
                ✨ KI-Transformation
              </span>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="text-center space-y-6"
        >
          <motion.button
            variants={reducedMotion ? {} : buttonVariants}
            whileHover={reducedMotion ? {} : "hover"}
            whileTap={reducedMotion ? {} : "tap"}
            onClick={handleGetStarted}
            className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary-focus text-primary-content font-semibold text-lg rounded-2xl transition-colors duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Jetzt kostenlos starten
          </motion.button>

          <div className="flex items-center justify-center space-x-4 text-base-content/40">
            <div className="h-px bg-base-300 w-16" />
            <span className="text-sm font-medium">oder</span>
            <div className="h-px bg-base-300 w-16" />
          </div>

          <motion.button
            variants={reducedMotion ? {} : buttonVariants}
            whileHover={reducedMotion ? {} : "hover"}
            whileTap={reducedMotion ? {} : "tap"}
            onClick={handleViewInspiration}
            className="inline-flex items-center px-6 py-3 bg-base-100/60 hover:bg-base-100/80 backdrop-blur-sm text-base-content border border-base-300/50 font-medium rounded-xl transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Inspiration ansehen
          </motion.button>

          <p className="text-sm text-base-content/40 max-w-lg mx-auto">
            Keine Kreditkarte erforderlich. Starte mit kostenlosen Credits und
            erlebe die Zukunft des Interior Designs.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
