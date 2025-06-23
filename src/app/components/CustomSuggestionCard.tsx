"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import {
  cardVariants,
  buttonVariants,
  useMotionPreference,
} from "@/utils/animations";

interface CustomSuggestionCardProps {
  id: string;
  title: string;
  suggestion: string;
  explanation: string;
  selected: boolean;
  onToggle: (suggestion: string) => void;
  onEdit: (
    id: string,
    data: { title: string; suggestion: string; explanation: string }
  ) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

const CheckIcon = ({ className }: { className?: string }) => (
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
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const EditIcon = ({ className }: { className?: string }) => (
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
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const DeleteIcon = ({ className }: { className?: string }) => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const ToggleSwitch = ({
  checked,
  onChange,
  id,
  ariaLabel,
}: {
  checked: boolean;
  onChange: () => void;
  id: string;
  ariaLabel: string;
}) => {
  const reducedMotion = useMotionPreference();

  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        checked ? "bg-primary" : "bg-base-300"
      }`}
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

const EditForm = ({
  initialTitle,
  initialSuggestion,
  initialExplanation,
  onSave,
  onCancel,
}: {
  initialTitle: string;
  initialSuggestion: string;
  initialExplanation: string;
  onSave: (data: {
    title: string;
    suggestion: string;
    explanation: string;
  }) => void;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [suggestion, setSuggestion] = useState(initialSuggestion);
  const [explanation, setExplanation] = useState(initialExplanation);
  const reducedMotion = useMotionPreference();

  const handleSave = () => {
    if (title.trim() && suggestion.trim()) {
      onSave({
        title: title.trim(),
        suggestion: suggestion.trim(),
        explanation: explanation.trim(),
      });
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
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-base-content mb-2"
        >
          Titel
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="z.B. Wärmere Beleuchtung"
          className="w-full px-3 py-2 rounded-lg border border-base-300 focus:border-primary focus:ring-1 focus:ring-primary bg-base-100 text-base-content transition-colors duration-200"
          autoFocus
        />
      </div>

      <div>
        <label
          htmlFor="suggestion"
          className="block text-sm font-medium text-base-content mb-2"
        >
          Vorschlag
        </label>
        <textarea
          id="suggestion"
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          placeholder="Beschreiben Sie Ihren Design-Vorschlag..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-base-300 focus:border-primary focus:ring-1 focus:ring-primary bg-base-100 text-base-content transition-colors duration-200 resize-none"
        />
      </div>

      <div>
        <label
          htmlFor="explanation"
          className="block text-sm font-medium text-base-content mb-2"
        >
          Begründung (optional)
        </label>
        <textarea
          id="explanation"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Warum ist diese Änderung sinnvoll?"
          rows={2}
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
          Abbrechen
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
          Speichern
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
  delay = 0,
}: CustomSuggestionCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const reducedMotion = useMotionPreference();
  const cardId = `custom-suggestion-${id}`;
  const toggleId = `toggle-${cardId}`;

  const handleToggle = useCallback(() => {
    onToggle(suggestion);
  }, [onToggle, suggestion]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(
    (data: { title: string; suggestion: string; explanation: string }) => {
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
          initialExplanation={explanation}
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
      className={`relative group p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-200 ease-out ${
        selected
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
          : "border-base-300 bg-base-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
      }`}
      onClick={handleToggle}
      role="article"
      aria-labelledby={`${cardId}-title`}
      aria-describedby={`${cardId}-description`}
    >
      {/* Custom badge */}
      <div className="absolute -top-2 -left-2 px-2 py-1 bg-accent text-accent-content text-xs font-semibold rounded-full">
        Eigener Vorschlag
      </div>

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
          {explanation && (
            <p className="text-base-content/50 text-xs mt-2 italic">
              {explanation}
            </p>
          )}
        </div>

        {/* Toggle Switch */}
        <div className="ml-3 sm:ml-4 flex-shrink-0">
          <ToggleSwitch
            checked={selected}
            onChange={handleToggle}
            id={toggleId}
            ariaLabel={`${title} ${selected ? "deaktivieren" : "aktivieren"}`}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <motion.button
          variants={reducedMotion ? {} : buttonVariants}
          whileHover={reducedMotion ? {} : "hover"}
          whileTap={reducedMotion ? {} : "tap"}
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
          className="p-2 text-base-content/50 hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
          aria-label={`${title} bearbeiten`}
        >
          <EditIcon className="w-4 h-4" />
        </motion.button>

        <motion.button
          variants={reducedMotion ? {} : buttonVariants}
          whileHover={reducedMotion ? {} : "hover"}
          whileTap={reducedMotion ? {} : "tap"}
          onClick={handleDelete}
          className="p-2 text-base-content/50 hover:text-error transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 rounded-lg"
          aria-label={`${title} löschen`}
        >
          <DeleteIcon className="w-4 h-4" />
        </motion.button>
      </div>

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
