"use client";

import { motion } from "framer-motion";
import { useSettingsStore } from "@/utils/settingsStore";
export default function MockModeIndicator() {
  const { mockImageAnalysis, mockImageGeneration } = useSettingsStore();

  // Only show if at least one mock mode is active
  const showIndicator = mockImageAnalysis || mockImageGeneration;

  if (!showIndicator) return null;

  const activeMocks = [];
  if (mockImageAnalysis) activeMocks.push("Analyse");
  if (mockImageGeneration) activeMocks.push("Generierung");

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-20 right-4 z-50 bg-warning/90 text-warning-content px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm border border-warning/20"
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <svg
          className="w-4 h-4"
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
        <span>Mock-Modus: {activeMocks.join(", ")}</span>
      </div>
    </motion.div>
  );
}
