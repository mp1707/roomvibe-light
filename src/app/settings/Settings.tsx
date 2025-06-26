"use client";

import { motion } from "framer-motion";
import { useSettingsStore } from "@/utils/settingsStore";
import { EyeIcon, ImageIcon, UploadIconSmall } from "@/components/Icons";

// Extracted components
import { SettingsHeader } from "./components/SettingsHeader";
import { ToggleSwitch } from "./components/ToggleSwitch";
import { PreviewSection } from "./components/PreviewSection";
import { StatusSection } from "./components/StatusSection";
import { SettingsActions } from "./components/SettingsActions";

// Extracted hooks and utils
import { useResetConfirmation } from "./hooks/useResetConfirmation";
import {
  pageVariants,
  containerVariants,
  mockGenerationImages,
  mockUploadImage,
} from "./utils/constants";

export default function Settings() {
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
      <SettingsHeader />

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

      <SettingsActions
        showResetConfirm={showResetConfirm}
        onReset={handleReset}
      />
    </motion.div>
  );
}
