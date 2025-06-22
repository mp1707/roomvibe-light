"use client";

import React from "react";
import { motion } from "framer-motion";
import SuggestionCard from "../../components/SuggestionCard";
import {
  staggerContainer,
  staggerItem,
  useMotionPreference,
} from "@/utils/animations";

// Enhanced suggestions with AI explanations (XAI)
const suggestionCategories = [
  {
    category: "Wandfarbe",
    suggestions: [
      {
        id: "sage-green-walls",
        title: "Wandfarbe",
        suggestion: "Wände in Salbeigrün streichen",
        explanation:
          "Salbeigrün ergänzt das natürliche Licht aus dem Fenster und schafft eine beruhigende Atmosphäre, die die Raumtiefe optisch vergrößert.",
      },
      {
        id: "sand-accent-wall",
        title: "Akzentwand",
        suggestion: "Akzentwand in Sandbeige gestalten",
        explanation:
          "Ein warmer Sandbeigeton als Akzentwand verleiht dem Raum Tiefe und Wärme, ohne zu dominant zu wirken.",
      },
    ],
  },
  {
    category: "Möbel",
    suggestions: [
      {
        id: "minimalist-bookshelf",
        title: "Bücherregal",
        suggestion: "Ein minimalistisches Bücherregal hinzufügen",
        explanation:
          "Ein schlichtes Bücherregal bietet Stauraum und schafft visuelle Struktur, ohne den Raum zu überladen.",
      },
      {
        id: "multifunctional-sofa",
        title: "Sofa",
        suggestion: "Multifunktionales Sofa integrieren",
        explanation:
          "Ein Sofa mit Stauraum maximiert die Funktionalität in kleineren Räumen und bietet gleichzeitig Komfort.",
      },
    ],
  },
  {
    category: "Beleuchtung",
    suggestions: [
      {
        id: "dimmable-floor-lamp",
        title: "Stehlampe",
        suggestion: "Dimmbare Stehlampe platzieren",
        explanation:
          "Dimmbare Beleuchtung ermöglicht es, die Stimmung je nach Tageszeit anzepassen und schafft gemütliche Akzente.",
      },
      {
        id: "led-spots",
        title: "LED-Spots",
        suggestion: "LED-Spots für indirektes Licht installieren",
        explanation:
          "Indirektes Licht von LED-Spots sorgt für eine gleichmäßige Ausleuchtung ohne harte Schatten und spart Energie.",
      },
    ],
  },
  {
    category: "Dekoration",
    suggestions: [
      {
        id: "large-wall-art",
        title: "Wandbild",
        suggestion: "Großes Wandbild aufhängen",
        explanation:
          "Ein großes Kunstwerk fungiert als Blickfang und kann die Farbpalette des Raumes harmonisch zusammenführen.",
      },
      {
        id: "plants",
        title: "Pflanzen",
        suggestion: "Pflanzen für mehr Frische aufstellen",
        explanation:
          "Pflanzen verbessern die Luftqualität und bringen Leben in den Raum, während sie natürliche Akzente setzen.",
      },
    ],
  },
];

interface RightColumnProps {
  selectedSuggestions: Record<string, boolean>;
  onToggleSuggestion: (suggestionId: string) => void;
}

const RightColumn: React.FC<RightColumnProps> = ({
  selectedSuggestions,
  onToggleSuggestion,
}) => {
  const reducedMotion = useMotionPreference();

  // Flatten all suggestions for easy rendering
  const allSuggestions = suggestionCategories.flatMap((category) =>
    category.suggestions.map((suggestion) => ({
      ...suggestion,
      category: category.category,
    }))
  );

  return (
    <div className="flex flex-col h-full overflow-visible">
      {/* Header - Only sticky on large screens */}
      <div className="lg:sticky lg:top-16 bg-base-100 lg:z-20 pb-4 sm:pb-6 border-b border-base-300 lg:-mx-4 lg:px-4">
        <motion.div
          variants={reducedMotion ? {} : staggerItem}
          className="pt-2 sm:pt-4"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-base-content mb-2 sm:mb-3 text-center">
            Design-Vorschläge
          </h2>
          <p className="text-base sm:text-lg text-base-content/60 max-w-md mx-auto text-center px-4 sm:px-0">
            Wählen Sie die Verbesserungen aus, die Ihnen gefallen. Unsere KI
            erklärt Ihnen gerne das Warum.
          </p>
        </motion.div>
      </div>

      {/* Scrollable Suggestion Cards */}
      <motion.div
        variants={reducedMotion ? {} : staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex-1 space-y-3 sm:space-y-4 py-4 sm:py-6 overflow-visible"
      >
        {allSuggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            variants={reducedMotion ? {} : staggerItem}
            custom={index}
            className="overflow-visible"
          >
            <SuggestionCard
              title={suggestion.title}
              suggestion={suggestion.suggestion}
              explanation={suggestion.explanation}
              selected={!!selectedSuggestions[suggestion.id]}
              onToggle={() => onToggleSuggestion(suggestion.id)}
              delay={index * 0.1}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RightColumn;
