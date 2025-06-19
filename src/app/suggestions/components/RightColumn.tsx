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
			className="w-full md:w-1/2 flex flex-col gap-4"
			variants={{
				hidden: { opacity: 0, y: 15 },
				visible: { opacity: 1, y: 0 },
			}}
		>
			<h2 className="font-bold text-2xl text-center">Design-Vorschläge</h2>
			<div className="flex-1 flex flex-col gap-4 pr-2">
				{cardMockData.map((card) => (
					<motion.div
						key={card.title}
						variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
					>
						<Card title={card.title} text={card.text} />
					</motion.div>
				))}
			</div>
			<div className="mt-4 pt-4 border-t border-gray-200">
				<div className="h-14 flex items-center justify-center">
					<AnimatePresence mode="wait">
						{!isActionActive ? (
							<motion.p
								key="text-prompt"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2, ease: "easeInOut" }}
								className="text-gray-500 text-center"
							>
								Wähle Vorschläge zur Anwendung aus.
							</motion.p>
						) : (
							<AnimatedButton color="blue" onClick={onAccept}>
								{selectionCount} Vorschl{selectionCount === 1 ? "ag" : "äge"}{" "}
								übernehmen
								<ContinueIcon />
							</AnimatedButton>
						)}
					</AnimatePresence>
				</div>
			</div>
		</motion.div>
	);
};

export default RightColumn;
