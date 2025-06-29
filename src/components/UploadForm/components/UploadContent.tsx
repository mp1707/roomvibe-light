import { motion } from "framer-motion";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

interface UploadContentProps {
  isDragging: boolean;
  mockFileUpload: boolean;
}

const UploadIcon = ({ isDragging }: { isDragging: boolean }) => (
  <motion.div
    animate={isDragging ? "dragging" : "initial"}
    variants={{
      initial: { scale: 1, y: 0 },
      dragging: {
        scale: 1.1,
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      },
    }}
    aria-hidden="true"
  >
    <CloudArrowUpIcon className="size-12 sm:size-16 md:size-20 text-base-content/40" />
  </motion.div>
);

export const UploadContent = ({
  isDragging,
  mockFileUpload,
}: UploadContentProps) => {
  const t = useTranslations("Components.UploadContent");

  return (
    <motion.div
      key="upload-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-4 space-y-6 md:space-y-8"
    >
      <UploadIcon isDragging={isDragging} />

      <div className="space-y-2 md:space-y-4">
        <p className="font-semibold text-xl sm:text-2xl text-base-content">
          <span className="text-primary">{t("selectPhoto")}</span>{" "}
          {t("orDragHere")}
        </p>
        <p
          id="file-upload-description"
          className="text-sm text-base-content/40"
        >
          {t("supportedFormats")}
        </p>
        {mockFileUpload && (
          <div className="flex items-center justify-center gap-2 mt-2 px-3 py-1 bg-warning/10 border border-warning/20 rounded-lg">
            <svg
              className="w-4 h-4 text-warning"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>Mock Mode Icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs font-medium text-warning">
              {t("mockModeActive")}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
