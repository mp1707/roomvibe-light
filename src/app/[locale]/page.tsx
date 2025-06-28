"use client";

import WelcomeScreen from "@/components/WelcomeScreen/WelcomeScreen";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div>
      {/* Simple translation test */}
      {/* <div className="text-center mb-4 p-4 bg-info/10 border border-info/20 rounded-lg">
        <h1 className="text-2xl font-bold text-info mb-2">{t("title")}</h1>
        <p className="text-info/80">{t("subtitle")}</p>
        <p className="text-xs text-info/60 mt-2">
          🌐 Internationalization is working! This text changes based on locale.
        </p>
      </div> */}

      {/* Always show welcome screen regardless of authentication state */}
      <WelcomeScreen />
    </div>
  );
}
