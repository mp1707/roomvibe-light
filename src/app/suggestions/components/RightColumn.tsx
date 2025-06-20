import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import AnimatedButton from "../../components/AnimatedButton";
import { ContinueIcon } from "../../components/Icons";
import { useRouter } from "next/navigation";

// Mocked categorized suggestions
const suggestionCategories = [
  {
    category: "Wandfarbe",
    suggestions: [
      "Wände in Salbeigrün streichen",
      "Akzentwand in Sandbeige gestalten",
    ],
  },
  {
    category: "Möbel",
    suggestions: [
      "Ein minimalistisches Bücherregal hinzufügen",
      "Multifunktionales Sofa integrieren",
    ],
  },
  {
    category: "Beleuchtung",
    suggestions: [
      "Dimmbare Stehlampe platzieren",
      "LED-Spots für indirektes Licht installieren",
    ],
  },
  {
    category: "Dekoration",
    suggestions: [
      "Großes Wandbild aufhängen",
      "Pflanzen für mehr Frische aufstellen",
    ],
  },
];

// SuggestionItem: Toggleable suggestion switch
const SuggestionItem = ({
  suggestion,
  selected,
  onToggle,
}: {
  suggestion: string;
  selected: boolean;
  onToggle: (suggestion: string) => void;
}) => (
  <motion.li
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className="flex items-center justify-between gap-4 px-4 py-2 rounded-lg hover:bg-base-100 transition-colors"
  >
    <span className="text-gray-700 text-base flex-1">{suggestion}</span>
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onToggle(suggestion)}
      className={`relative min-w-[44px] w-11 h-6 flex items-center flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
        selected ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute left-0 top-0 w-11 h-6 rounded-full transition-colors duration-200 ${
          selected ? "bg-blue-600/30" : "bg-gray-300/30"
        }`}
      />
      <span
        className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
          selected ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  </motion.li>
);

// SuggestionCategory: Collapsible category with suggestions
const SuggestionCategory = ({
  category,
  suggestions,
  open,
  onToggleOpen,
  selected,
  onToggleSuggestion,
  selectedCount,
}: {
  category: string;
  suggestions: string[];
  open: boolean;
  onToggleOpen: () => void;
  selected: Record<string, boolean>;
  onToggleSuggestion: (suggestion: string) => void;
  selectedCount: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.32, ease: "easeOut" }}
  >
    <div className="mb-2">
      <button
        className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-base-200 hover:bg-base-300 transition-colors text-lg font-medium text-gray-800 focus:outline-none"
        onClick={onToggleOpen}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span>{category}</span>
          {selectedCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {selectedCount}
            </span>
          )}
        </div>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-2"
        >
          ▶
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <ul className="flex flex-col gap-2 py-2">
              {suggestions.map((sugg, idx) => (
                <SuggestionItem
                  key={sugg}
                  suggestion={sugg}
                  selected={!!selected[sugg]}
                  onToggle={onToggleSuggestion}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
);

const RightColumn = () => {
  // State for which category is open
  const [openCategories, setOpenCategories] = useState<string[]>(() => {
    if (suggestionCategories.length > 0) {
      return [suggestionCategories[0].category];
    }
    return [];
  });
  // State for which suggestions are selected
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // Toggle selection of a suggestion
  const handleToggleSuggestion = (suggestion: string) => {
    setSelected((prev) => ({ ...prev, [suggestion]: !prev[suggestion] }));
  };

  const handleToggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Count of selected suggestions
  const selectionCount = Object.values(selected).filter(Boolean).length;
  const isActionActive = selectionCount > 0;
  const router = useRouter();

  // Accept action handler
  const onAccept = () => router.push("/result");

  return (
    <motion.div
      className="w-full md:w-1/2 flex flex-col gap-8"
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="font-semibold text-3xl text-center mb-2 tracking-tight text-gray-900">
        Design-Vorschläge
      </h2>
      <div className="flex-1 flex flex-col gap-4 pr-0">
        {suggestionCategories.map((cat, catIdx) => {
          const selectedInCategory = cat.suggestions.filter(
            (sugg) => selected[sugg]
          ).length;
          return (
            <SuggestionCategory
              key={cat.category}
              category={cat.category}
              suggestions={cat.suggestions}
              open={openCategories.includes(cat.category)}
              onToggleOpen={() => handleToggleCategory(cat.category)}
              selected={selected}
              onToggleSuggestion={handleToggleSuggestion}
              selectedCount={selectedInCategory}
            />
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isActionActive ? (
              <motion.p
                key="text-prompt"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-gray-400 text-center text-base font-light"
              >
                Wähle Vorschläge zur Anwendung aus.
              </motion.p>
            ) : (
              <motion.div
                key="action-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <AnimatedButton
                  color="blue"
                  onClick={onAccept}
                  className={`px-8 py-4 rounded-full bg-blue-600 text-white font-semibold text-lg tracking-tight border-0 shadow-none hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 ${
                    !isActionActive ? "pointer-events-none opacity-50" : ""
                  }`}
                  aria-disabled={!isActionActive}
                >
                  {selectionCount} Vorschlag{selectionCount === 1 ? "" : "e"}{" "}
                  anwenden
                  <ContinueIcon />
                </AnimatedButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default RightColumn;
