"use client";

import WelcomeScreen from "@/components/WelcomeScreen/WelcomeScreen";

export default function Home() {
  // Always show welcome screen regardless of authentication state
  return <WelcomeScreen />;
}
