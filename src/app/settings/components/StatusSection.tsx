"use client";

import { motion } from "framer-motion";

interface StatusSectionProps {
  mockImageAnalysis: boolean;
  mockImageGeneration: boolean;
  mockFileUpload: boolean;
}

interface StatusItemProps {
  label: string;
  isMockMode: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  hover: { scale: 1.02, y: -2 },
};

// Pure functions
const getStatusColor = (isMockMode: boolean): string => {
  return isMockMode ? "text-warning" : "text-success";
};

const getStatusText = (isMockMode: boolean): string => {
  return isMockMode ? "Mock-Modus" : "Live API";
};

const StatusItem = ({ label, isMockMode }: StatusItemProps) => (
  <div className="flex justify-between">
    <span className="text-base-content/60">{label}:</span>
    <span className={`font-medium ${getStatusColor(isMockMode)}`}>
      {getStatusText(isMockMode)}
    </span>
  </div>
);

export const StatusSection = ({
  mockImageAnalysis,
  mockImageGeneration,
  mockFileUpload,
}: StatusSectionProps) => {
  return (
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
};
