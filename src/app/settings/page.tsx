"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/utils/settingsStore";
import { useState } from "react";
import Link from "next/link";

// Animation variants following design system
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  hover: { scale: 1.02, y: -2 },
};

const containerVariants = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

// Toggle Switch Component following design system
interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

function ToggleSwitch({
  enabled,
  onChange,
  label,
  description,
  icon,
}: ToggleSwitchProps) {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-base-100 rounded-lg border border-base-300 p-6 hover:shadow-soft transition-shadow duration-200"
      whileHover="hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {icon && (
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <label className="text-lg font-semibold tracking-tight text-base-content cursor-pointer">
              {label}
            </label>
            <p className="text-sm text-base-content/60 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <motion.button
          onClick={() => onChange(!enabled)}
          className={`relative w-11 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 ${
            enabled ? "bg-primary" : "bg-base-300"
          }`}
          whileTap={{ scale: 0.95 }}
          aria-label={`${enabled ? "Deaktiviere" : "Aktiviere"} ${label}`}
        >
          <motion.div
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
            animate={{
              x: enabled ? 22 : 2,
            }}
            transition={{
              type: "spring",
              stiffness: 700,
              damping: 30,
            }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function SettingsPage() {
  const {
    mockImageAnalysis,
    mockImageGeneration,
    mockFileUpload,
    setMockImageAnalysis,
    setMockImageGeneration,
    setMockFileUpload,
    resetSettings,
  } = useSettingsStore();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    if (showResetConfirm) {
      resetSettings();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base-content/60 hover:text-base-content transition-colors mb-4 group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Zurück zur Startseite
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-base-content">
            Entwickler-Einstellungen
          </h1>
        </div>

        <p className="text-base-content/60 leading-relaxed">
          Konfiguriere Mock-APIs für die Entwicklung, um Kosten bei häufigen
          Tests zu sparen.
        </p>
      </div>

      {/* Settings Cards */}
      <motion.div
        className="space-y-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ToggleSwitch
          enabled={mockImageAnalysis}
          onChange={setMockImageAnalysis}
          label="Mock Bildanalyse"
          description="Verwendet Mock-Daten anstelle der OpenAI Vision API für die Raumanalyse. Spart API-Kosten während der Entwicklung."
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          }
        />

        <ToggleSwitch
          enabled={mockImageGeneration}
          onChange={setMockImageGeneration}
          label="Mock Bildgenerierung"
          description="Verwendet vorhandene Beispielbilder anstelle der Replicate API für die Bildgenerierung. Spart API-Kosten während der Entwicklung."
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
        />

        <ToggleSwitch
          enabled={mockFileUpload}
          onChange={setMockFileUpload}
          label="Mock Datei-Upload"
          description="Simuliert das Hochladen von Dateien ohne tatsächlich Supabase Storage zu verwenden. Spart API-Kosten und ermöglicht Offline-Entwicklung."
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          }
        />

        {/* Mock Image Preview */}
        <AnimatePresence>
          {mockFileUpload && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-base-200/50 rounded-lg border border-base-300/50 p-4 ml-4"
            >
              <h4 className="text-sm font-medium text-base-content mb-3 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Beispielbild wird verwendet:
              </h4>
              <div className="flex items-start gap-3">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-base-300 flex-shrink-0">
                  <img
                    src="https://media.istockphoto.com/id/2175713816/de/foto/elegantes-wohnzimmer-mit-beigem-sofa-und-kamin.jpg?s=2048x2048&w=is&k=20&c=E9JrU7zYWFLQsEJQf0fXJyiVECM6tsIyKgSNNp-cEkc%3D"
                    alt="Mock Beispielbild"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-base-content/60 leading-relaxed">
                    <strong>Elegantes Wohnzimmer</strong>
                    <br />
                    Ein helles, minimalistisches Wohnzimmer mit beigem Sofa,
                    modernem Kamin und abstrakter Kunst. Große Fenster lassen
                    natürliches Licht herein und schaffen eine gemütliche, aber
                    elegante Atmosphäre.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Status Info */}
      <motion.div
        variants={cardVariants}
        className="bg-base-200 rounded-lg border border-base-300 p-4 mb-6"
      >
        <h3 className="font-medium text-base-content mb-2">Aktueller Status</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-base-content/60">Bildanalyse:</span>
            <span
              className={`font-medium ${
                mockImageAnalysis ? "text-warning" : "text-success"
              }`}
            >
              {mockImageAnalysis ? "Mock-Modus" : "Live API"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">Bildgenerierung:</span>
            <span
              className={`font-medium ${
                mockImageGeneration ? "text-warning" : "text-success"
              }`}
            >
              {mockImageGeneration ? "Mock-Modus" : "Live API"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/60">Datei-Upload:</span>
            <span
              className={`font-medium ${
                mockFileUpload ? "text-warning" : "text-success"
              }`}
            >
              {mockFileUpload ? "Mock-Modus" : "Live API"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div variants={cardVariants} className="flex gap-3">
        <motion.button
          onClick={handleReset}
          className={`px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
            showResetConfirm
              ? "bg-error text-error-content border-error hover:bg-error/90"
              : "bg-base-100 text-base-content border-base-300 hover:bg-base-200"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {showResetConfirm
            ? "Bestätigen: Zurücksetzen"
            : "Alle Einstellungen zurücksetzen"}
        </motion.button>
      </motion.div>

      {/* Development Notice */}
      <motion.div
        variants={cardVariants}
        className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-lg"
      >
        <p className="text-sm text-base-content/70">
          <strong>Hinweis:</strong> Diese Einstellungen sind nur für die
          Entwicklung gedacht. Im Produktionsmodus sollten immer die echten APIs
          verwendet werden.
        </p>
      </motion.div>
    </motion.div>
  );
}
