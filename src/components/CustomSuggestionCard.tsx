"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  cardVariants,
  buttonVariants,
  useMotionPreference,
} from "@/utils/animations";
import {
  CheckIcon as HeroCheckIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface CustomSuggestionCardProps {
  id: string;
  title: string;
  suggestion: string;
  explanation?: string;
  selected: boolean;
  onToggle: (suggestion: string) => void;
  onEdit: (id: string, data: { title: string; suggestion: string }) => void;
  onDelete: (id: string) => void;
  isApplied?: boolean;
  isGenerating?: boolean;
  delay?: number;
}

const CheckIcon = ({ className }: { className?: string }) => (
  <HeroCheckIcon className={className} aria-hidden="true" />
);

const EditIcon = ({ className }: { className?: string }) => (
  <PencilIcon className={className} aria-hidden="true" />
);

const DeleteIcon = ({ className }: { className?: string }) => (
  <TrashIcon className={className} aria-hidden="true" />
);

const ToggleSwitch = ({
  checked,
  onChange,
  id,
  ariaLabel,
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  id: string;
  ariaLabel: string;
  disabled?: boolean;
}) => {
  const reducedMotion = useMotionPreference();

  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onChange();
        }
      }}
      className={`relative inline-flex items-center h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${checked ? "bg-primary" : "bg-base-300"}`}
    >
      <span className="sr-only">{ariaLabel}</span>
      <motion.span
        animate={{
          x: checked ? 20 : 2,
        }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 700, damping: 30 }
        }
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out`}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center h-full w-full"
          >
            <CheckIcon className="h-2.5 w-2.5 text-primary" />
          </motion.div>
        )}
      </motion.span>
    </button>
  );
};

interface EditFormProps {
  initialTitle: string;
  initialSuggestion: string;
  onSave: (data: { title: string; suggestion: string }) => void;
  onCancel: () => void;
}

const EditForm = ({
  initialTitle,
  initialSuggestion,
  onSave,
  onCancel,
}: EditFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [suggestion, setSuggestion] = useState(initialSuggestion);
  const reducedMotion = useMotionPreference();
  const t = useTranslations("Components.CustomSuggestionCard");

  const isValid = title.trim() && suggestion.trim();

  const handleSave = () => {
    if (isValid) {
      onSave({ title: title.trim(), suggestion: suggestion.trim() });
    }
  };

  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={reducedMotion ? {} : { opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="space-y-4"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-base-content mb-2"
        >
          {t("titleLabel")}{" "}
          <span className="text-error">{t("titleRequired")}</span>
        </label>
        <input
          id="title"
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
          htmlFor="suggestion"
          className="block text-sm font-medium text-base-content mb-2"
        >
          {t("suggestionLabel")}{" "}
          <span className="text-error">{t("suggestionRequired")}</span>
        </label>
        <textarea
          id="suggestion"
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
          {t("save")}
        </motion.button>
      </div>
    </motion.div>
  );
};

const CustomSuggestionCard = ({
  id,
  title,
  suggestion,
  explanation,
  selected,
  onToggle,
  onEdit,
  onDelete,
  isApplied = false,
  isGenerating = false,
  delay = 0,
}: CustomSuggestionCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const reducedMotion = useMotionPreference();
  const t = useTranslations("Components.CustomSuggestionCard");
  const cardId = `custom-suggestion-${id}`;
  const toggleId = `toggle-${cardId}`;

  const handleToggle = useCallback(() => {
    if (!isApplied && !isGenerating) {
      onToggle(suggestion);
    }
  }, [onToggle, suggestion, isApplied, isGenerating]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(
    (data: { title: string; suggestion: string }) => {
      onEdit(id, data);
      setIsEditing(false);
    },
    [id, onEdit]
  );

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(id);
    },
    [id, onDelete]
  );

  if (isEditing) {
    return (
      <motion.div
        variants={reducedMotion ? {} : cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay }}
        className="relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-primary/30 bg-base-100 shadow-lg"
      >
        <EditForm
          initialTitle={title}
          initialSuggestion={suggestion}
          onSave={handleSave}
          onCancel={handleCancel}
        />
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
      className={`relative group p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ease-out ${
        isApplied
          ? "border-success bg-success/10 shadow-lg shadow-success/10 cursor-default"
          : isGenerating
          ? "border-base-300 bg-base-100 cursor-not-allowed opacity-60"
          : selected
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 cursor-pointer"
          : "border-base-300 bg-base-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
      }`}
      onClick={handleToggle}
      role="article"
      aria-labelledby={`${cardId}-title`}
      aria-describedby={`${cardId}-description`}
    >
      {/* Custom badge */}
      <div className="absolute -top-2 -left-2 px-2 py-1 bg-accent text-accent-content text-xs font-semibold rounded-full">
        {t("customSuggestion")}
      </div>

      {/* Applied Badge - Fixed clipping with proper positioning */}
      {isApplied && (
        <div className="absolute -top-2 -right-2 px-3 py-1 bg-success text-success-content text-xs font-semibold rounded-full shadow-sm z-10 whitespace-nowrap">
          ✓ {t("applied")}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3
            id={`${cardId}-title`}
            className="text-base sm:text-lg font-semibold text-base-content mb-1"
          >
            {title}
          </h3>
          <p
            id={`${cardId}-description`}
            className="text-base-content/60 text-sm leading-relaxed"
          >
            {suggestion}
          </p>
        </div>

        {/* Toggle Switch - Hide for applied suggestions */}
        {!isApplied && (
          <div className="ml-3 sm:ml-4 flex-shrink-0">
            <ToggleSwitch
              checked={selected}
              onChange={handleToggle}
              id={toggleId}
              ariaLabel={`${title} ${
                selected ? t("deactivate") : t("activate")
              }`}
              disabled={isGenerating}
            />
          </div>
        )}
      </div>

      {/* Action buttons - Hide for applied suggestions */}
      {!isApplied && (
        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            variants={reducedMotion ? {} : buttonVariants}
            whileHover={reducedMotion ? {} : "hover"}
            whileTap={reducedMotion ? {} : "tap"}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            disabled={isGenerating}
            className={`p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg ${
              isGenerating
                ? "text-base-content/30 cursor-not-allowed"
                : "text-base-content/50 hover:text-primary"
            }`}
            aria-label={`${title} ${t("editLabel")}`}
          >
            <EditIcon className="w-4 h-4" />
          </motion.button>

          <motion.button
            variants={reducedMotion ? {} : buttonVariants}
            whileHover={reducedMotion ? {} : "hover"}
            whileTap={reducedMotion ? {} : "tap"}
            onClick={handleDelete}
            disabled={isGenerating}
            className={`p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 rounded-lg ${
              isGenerating
                ? "text-base-content/30 cursor-not-allowed"
                : "text-base-content/50 hover:text-error"
            }`}
            aria-label={`${title} ${t("deleteLabel")}`}
          >
            <DeleteIcon className="w-4 h-4" />
          </motion.button>
        </div>
      )}

      {/* Selection Indicator */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg"
          >
            <CheckIcon className="w-3.5 h-3.5 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomSuggestionCard;
