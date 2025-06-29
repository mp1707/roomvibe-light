"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  cardVariants,
  buttonVariants,
  useMotionPreference,
} from "@/utils/animations";

interface AddSuggestionCardProps {
  onAdd: (data: {
    title: string;
    suggestion: string;
    category: string;
  }) => void;
  delay?: number;
}

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const AddForm = ({
  onSave,
  onCancel,
}: {
  onSave: (data: {
    title: string;
    suggestion: string;
    category: string;
  }) => void;
  onCancel: () => void;
}) => {
  const t = useTranslations("Components.AddSuggestionCard");
  const [title, setTitle] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const reducedMotion = useMotionPreference();

  const handleSave = () => {
    if (title.trim() && suggestion.trim()) {
      onSave({
        title: title.trim(),
        suggestion: suggestion.trim(),
        category: "custom",
      });
      // Reset form
      setTitle("");
      setSuggestion("");
    }
  };

  const isValid = title.trim() && suggestion.trim();

  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={reducedMotion ? {} : { opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="space-y-4"
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-base-content">
          {t("addCustom")}
        </h3>
        <p className="text-sm text-base-content/60">{t("description")}</p>
      </div>

      <div>
        <label
          htmlFor="new-title"
          className="block text-sm font-medium text-base-content mb-2"
        >
          {t("titleLabel")} <span className="text-error">{t("required")}</span>
        </label>
        <input
          id="new-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("titlePlaceholder")}
          className="w-full px-3 py-2 rounded-lg border border-base-300 focus:border-primary focus:ring-1 focus:ring-primary bg-base-100 text-base-content transition-colors duration-200"
          autoFocus
        />
      </div>

      <div>
        <label
          htmlFor="new-suggestion"
          className="block text-sm font-medium text-base-content mb-2"
        >
          {t("suggestionLabel")}{" "}
          <span className="text-error">{t("required")}</span>
        </label>
        <textarea
          id="new-suggestion"
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          placeholder={t("suggestionPlaceholder")}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-base-300 focus:border-primary focus:ring-1 focus:ring-primary bg-base-100 text-base-content transition-colors duration-200 resize-none"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <motion.button
          variants={reducedMotion ? {} : buttonVariants}
          whileHover={reducedMotion ? {} : "hover"}
          whileTap={reducedMotion ? {} : "tap"}
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-base-content/70 hover:text-base-content transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
        >
          {t("cancel")}
        </motion.button>
        <motion.button
          variants={reducedMotion ? {} : buttonVariants}
          whileHover={isValid && !reducedMotion ? "hover" : undefined}
          whileTap={isValid && !reducedMotion ? "tap" : undefined}
          onClick={handleSave}
          disabled={!isValid}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isValid
              ? "bg-primary hover:bg-primary-focus text-primary-content focus:ring-primary"
              : "bg-base-200 text-base-content/40 cursor-not-allowed"
          }`}
        >
          {t("add")}
        </motion.button>
      </div>
    </motion.div>
  );
};

const AddSuggestionCard = ({ onAdd, delay = 0 }: AddSuggestionCardProps) => {
  const t = useTranslations("Components.AddSuggestionCard");
  const [isAdding, setIsAdding] = useState(false);
  const reducedMotion = useMotionPreference();

  const handleAdd = useCallback(() => {
    setIsAdding(true);
  }, []);

  const handleSave = useCallback(
    (data: { title: string; suggestion: string; category: string }) => {
      onAdd(data);
      setIsAdding(false);
    },
    [onAdd]
  );

  const handleCancel = useCallback(() => {
    setIsAdding(false);
  }, []);

  if (isAdding) {
    return (
      <motion.div
        variants={reducedMotion ? {} : cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay }}
        className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-primary/30 bg-primary/5 shadow-lg"
      >
        <AddForm onSave={handleSave} onCancel={handleCancel} />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={reducedMotion ? {} : cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={reducedMotion ? {} : "hover"}
      whileTap={reducedMotion ? {} : "tap"}
      transition={{ delay }}
      className="relative group p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-dashed border-base-300 hover:border-primary/50 bg-base-100 hover:bg-primary/5 cursor-pointer transition-all duration-200 ease-out"
      onClick={handleAdd}
      role="button"
      aria-label={t("ariaLabel")}
    >
      {/* Content */}
      <div className="flex flex-col items-center justify-center text-center py-8">
        <motion.div
          variants={reducedMotion ? {} : buttonVariants}
          whileHover={reducedMotion ? {} : "hover"}
          whileTap={reducedMotion ? {} : "tap"}
          className="w-12 h-12 mb-4 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors duration-200"
        >
          <PlusIcon className="w-6 h-6 text-primary" />
        </motion.div>

        <h3 className="text-base sm:text-lg font-semibold text-base-content mb-2">
          Eigenen Vorschlag hinzufügen
        </h3>

        <p className="text-sm text-base-content/60 leading-relaxed max-w-xs">
          Haben Sie eine eigene Design-Idee? Fügen Sie Ihren persönlichen
          Vorschlag hinzu.
        </p>
      </div>
    </motion.div>
  );
};

export default AddSuggestionCard;
