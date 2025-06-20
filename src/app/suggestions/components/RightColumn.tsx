import React from "react";
import { AnimatePresence, motion } from "motion/react";
import Card from "../../components/Card";
import AnimatedButton from "../../components/AnimatedButton";
import { ContinueIcon } from "../../components/Icons";
import { useAppState } from "@/utils/store";
import { useRouter } from "next/navigation";

type CardData = {
  title: string;
  text: string;
};

const cardMockData: CardData[] = [
  {
    title: "Beleuchtung",
    text: "Bringe mehr Licht in deinen Raum mit warmen, einladenden Farben.",
  },
  {
    title: "Möbel",
    text: "Optimiere den Raum mit multifunktionalen Möbeln für mehr Platz.",
  },
  {
    title: "Farbgestaltung",
    text: "Verwende helle, harmonische Farben, um eine entspannte Atmosphäre zu erschaffen.",
  },
];

const RightColumn = () => {
  const { suggestionsToApply } = useAppState();
  const selectionCount = suggestionsToApply.size;
  const isActionActive = selectionCount > 0;
  const router = useRouter();

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
      <div className="flex-1 flex flex-col gap-6 pr-0">
        {cardMockData.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * idx, duration: 0.32, ease: "easeOut" }}
          >
            <Card title={card.title} text={card.text} />
          </motion.div>
        ))}
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
                  className="px-8 py-4 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-lg tracking-tight border-0 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                >
                  {selectionCount} Vorschl{selectionCount === 1 ? "ag" : "äge"}{" "}
                  übernehmen
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
