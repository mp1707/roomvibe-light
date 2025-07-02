"use client";

import WelcomeScreen from "@/components/WelcomeScreen/WelcomeScreen";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div>
      <WelcomeScreen />
    </div>
  );
}
