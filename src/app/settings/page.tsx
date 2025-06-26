"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/utils/settingsStore";
import { useState } from "react";
import Link from "next/link";
import {
  SettingsIcon,
  EyeIcon,
  ImageIcon,
  UploadIconSmall,
  BackIconSmall,
} from "@/components/Icons";

// Animation variants following design system
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { type: "spring" as const, stiffness: 400, damping: 30 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  hover: { scale: 1.02, y: -2 },
};

const containerVariants = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

// Compact preview variants for mock settings
const previewVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// Pure functions
const getStatusColor = (isMockMode: boolean): string => {
  return isMockMode ? "text-warning" : "text-success";
};

const getStatusText = (isMockMode: boolean): string => {
  return isMockMode ? "Mock-Modus" : "Live API";
};

const createPreviewImage = (src: string, alt: string) => ({
  src,
  alt,
});

// Custom hook for reset confirmation logic
const useResetConfirmation = () => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { resetSettings } = useSettingsStore();

  const handleReset = () => {
    if (showResetConfirm) {
      resetSettings();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  return { showResetConfirm, handleReset };
};

// Preview images data
const mockGenerationImages = [
  createPreviewImage("/assets/images/mockResult.png", "Mock Ergebnis 1"),
  createPreviewImage("/assets/images/hero.png", "Mock Ergebnis 2"),
];

const mockUploadImage = createPreviewImage(
  "https://media.istockphoto.com/id/2175713816/de/foto/elegantes-wohnzimmer-mit-beigem-sofa-und-kamin.jpg?s=2048x2048&w=is&k=20&c=E9JrU7zYWFLQsEJQf0fXJyiVECM6tsIyKgSNNp-cEkc%3D",
  "Mock Upload Beispiel"
);

// Reusable Preview Component
interface PreviewSectionProps {
  isVisible: boolean;
  title: string;
  icon: React.ReactNode;
  images: Array<{ src: string; alt: string }>;
  isMultiple?: boolean;
}

const PreviewSection = ({
  isVisible,
  title,
  icon,
  images,
  isMultiple = false,
}: PreviewSectionProps) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        variants={previewVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.2 }}
        className="bg-base-200/50 rounded-lg border border-base-300/50 p-3 ml-4"
      >
        <h4 className="text-sm font-medium text-base-content mb-2 flex items-center gap-2">
          {icon}
          {title}
        </h4>
        <div className={`flex gap-2 ${isMultiple ? "" : ""}`}>
          {images.map((image, index) => (
            <div
              key={index}
              className="w-16 h-16 rounded-lg overflow-hidden border border-base-300"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Reusable Status Item Component
interface StatusItemProps {
  label: string;
  isMockMode: boolean;
}

const StatusItem = ({ label, isMockMode }: StatusItemProps) => (
  <div className="flex justify-between">
    <span className="text-base-content/60">{label}:</span>
    <span className={`font-medium ${getStatusColor(isMockMode)}`}>
      {getStatusText(isMockMode)}
    </span>
  </div>
);

// Toggle Switch Component following design system
interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

const ToggleSwitch = ({
  enabled,
  onChange,
  label,
  description,
  icon,
}: ToggleSwitchProps) => {
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
};

// Status section component
const StatusSection = ({
  mockImageAnalysis,
  mockImageGeneration,
  mockFileUpload,
}: {
  mockImageAnalysis: boolean;
  mockImageGeneration: boolean;
  mockFileUpload: boolean;
}) => (
  <motion.div
    variants={cardVariants}
    className="bg-base-200 rounded-lg border border-base-300 p-4 mb-6"
  >
    <h3 className="font-medium text-base-content mb-2">Aktueller Status</h3>
    <div className="space-y-1 text-sm">
      <StatusItem label="Bildanalyse" isMockMode={mockImageAnalysis} />
      <StatusItem label="Bildgenerierung" isMockMode={mockImageGeneration} />
      <StatusItem label="Datei-Upload" isMockMode={mockFileUpload} />
    </div>
  </motion.div>
);

export default function SettingsPage() {
  const {
    mockImageAnalysis,
    mockImageGeneration,
    mockFileUpload,
    setMockImageAnalysis,
    setMockImageGeneration,
    setMockFileUpload,
  } = useSettingsStore();

  const { showResetConfirm, handleReset } = useResetConfirmation();

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
          <BackIconSmall />
          Zurück zur Startseite
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <SettingsIcon />
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
          icon={<EyeIcon />}
        />

        <ToggleSwitch
          enabled={mockImageGeneration}
          onChange={setMockImageGeneration}
          label="Mock Bildgenerierung"
          description="Verwendet vorhandene Beispielbilder anstelle der Replicate API für die Bildgenerierung. Spart API-Kosten während der Entwicklung."
          icon={<ImageIcon />}
        />

        <PreviewSection
          isVisible={mockImageGeneration}
          title="Beispielbilder werden generiert"
          icon={<ImageIcon />}
          images={mockGenerationImages}
          isMultiple={true}
        />

        <ToggleSwitch
          enabled={mockFileUpload}
          onChange={setMockFileUpload}
          label="Mock Datei-Upload"
          description="Simuliert das Hochladen von Dateien ohne tatsächlich Supabase Storage zu verwenden. Spart API-Kosten und ermöglicht Offline-Entwicklung."
          icon={<UploadIconSmall />}
        />

        <PreviewSection
          isVisible={mockFileUpload}
          title="Beispielbild wird verwendet"
          icon={<UploadIconSmall />}
          images={[mockUploadImage]}
        />
      </motion.div>

      {/* Status Info */}
      <StatusSection
        mockImageAnalysis={mockImageAnalysis}
        mockImageGeneration={mockImageGeneration}
        mockFileUpload={mockFileUpload}
      />

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
