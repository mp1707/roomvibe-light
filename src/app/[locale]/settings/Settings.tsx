"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSettingsStore } from "@/utils/settingsStore";
import {
  EyeIcon,
  PhotoIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";

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
  const t = useTranslations("SettingsPage");
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
          label={t("mockImageAnalysis")}
          description={t("mockImageAnalysisDesc")}
          icon={<EyeIcon className="w-5 h-5" />}
        />

        <ToggleSwitch
          enabled={mockImageGeneration}
          onChange={setMockImageGeneration}
          label={t("mockImageGeneration")}
          description={t("mockImageGenerationDesc")}
          icon={<PhotoIcon className="w-5 h-5" />}
        />

        <PreviewSection
          isVisible={mockImageGeneration}
          title={t("exampleImagesGenerated")}
          icon={<PhotoIcon className="w-5 h-5" />}
          images={mockGenerationImages}
          isMultiple={true}
        />

        <ToggleSwitch
          enabled={mockFileUpload}
          onChange={setMockFileUpload}
          label={t("mockFileUpload")}
          description={t("mockFileUploadDesc")}
          icon={<CloudArrowUpIcon className="w-5 h-5" />}
        />

        <PreviewSection
          isVisible={mockFileUpload}
          title={t("exampleImageUsed")}
          icon={<CloudArrowUpIcon className="w-5 h-5" />}
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
