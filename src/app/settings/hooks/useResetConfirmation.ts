import { useState } from "react";
import { useSettingsStore } from "@/utils/settingsStore";

export const useResetConfirmation = () => {
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
