"use client";

import { useTranslations } from "next-intl";

export default function UploadLoading() {
  const t = useTranslations("LoadingPage");

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Loading Animation */}
        <div className="mb-6">
          <div className="w-12 h-12 mx-auto animate-spin">
            <svg
              className="w-full h-full text-primary"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-xl font-semibold text-base-content mb-2 animate-pulse">
          {t("title")}
        </h2>

        <p className="text-base-content/60 animate-pulse">{t("subtitle")}</p>
      </div>
    </div>
  );
}