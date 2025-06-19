"use client";

import { useAppState } from "@/utils/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import Card from "../components/Card";
import AnimatedButton from "@/app/components/AnimatedButton";

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
		text: "Verwende hellere, harmonische Farben, um eine entspannte Atmosphäre zu erschaffen.",
	},
];
const BackIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={2}
		stroke="currentColor"
		className="size-4 mt-0.5"
	>
		<title>back</title>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
		/>
	</svg>
);

const ContinueIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={2}
		stroke="currentColor"
		className="size-4 mt-0.5"
	>
		<title>continue</title>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
		/>
	</svg>
);

export default function SuggestionsPage() {
	const { localImageUrl, suggestionsToApply } = useAppState();
	const selectionCount = suggestionsToApply.size;
	const isActionActive = selectionCount > 0;
	const router = useRouter();

	const onAccept = () => router.push("/result");
	const showContinueButton = suggestionsToApply.size > 0;

	// Container-Varianten für die Kaskaden-Animation der Inhalte
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				delayChildren: 0.2, // Beginnt, nachdem die Seiten-Animation fast fertig ist
				staggerChildren: 0.15,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 15 },
		visible: { opacity: 1, y: 0, transition: { stiffness: 100 } },
	};

	return (
		<motion.div
			className="flex-1 w-full flex flex-col md:flex-row gap-10 p-2 md:p-4"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			{/* Linke Spalte */}
			<motion.div
				className="w-full md:w-1/2 flex flex-col gap-4"
				variants={itemVariants}
			>
				<h2 className="font-bold text-2xl text-center">Ihr Originalbild</h2>
				<Image
					src={localImageUrl || "/placeholder.png"}
					className="w-full h-auto object-cover rounded-lg shadow-xl aspect-[4/3]"
					width={800}
					height={600}
					alt="Original uploaded image"
				/>
				<Link
					href="/"
					className="flex justify-center items-center gap-1.5 group"
				>
					<BackIcon />
					<span className="text-gray-500 group-hover:text-gray-800 transition-colors">
						Anderes Bild hochladen
					</span>
				</Link>
			</motion.div>

			{/* Rechte Spalte */}
			<motion.div
				className="w-full md:w-1/2 flex flex-col gap-4"
				variants={itemVariants}
			>
				<h2 className="font-bold text-2xl text-center">Design-Vorschläge</h2>
				<div className="flex flex-col gap-4">
					{cardMockData.map((card) => (
						<motion.div key={card.title} variants={itemVariants}>
							<Card title={card.title} text={card.text} />
						</motion.div>
					))}
				</div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="h-14 flex items-center justify-center"> {/* Feste Höhe für die Leiste, um Sprünge zu vermeiden */}
                        <AnimatePresence mode="wait">
                            {!isActionActive ? (
                                // Zustand 1: Inaktiver Zustand mit Hilfetext
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
                                // Zustand 2: Aktiver Button
                                <AnimatedButton
                                    
                                    color="blue"
                                    onClick={onAccept}
                                >
                                    {selectionCount} Vorschl{selectionCount === 1 ? 'ag' : 'äge'} übernehmen
                                    <ContinueIcon />
                                </AnimatedButton>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
			</motion.div>
		</motion.div>
	);
}
