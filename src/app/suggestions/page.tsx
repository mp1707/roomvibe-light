"use client";

import { useAppState } from "@/utils/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Card from "../components/Card";

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
	const router = useRouter();

	const onAccept = () => router.push("/result");
	const showContinueButton = suggestionsToApply.size > 0;

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.15 },
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { stiffness: 100 } },
	};

	return (
		<div className="flex-1 w-full flex flex-col md:flex-row gap-10 p-2 md:p-4">
			<div className="w-full md:w-1/2 flex flex-col gap-4">
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
			</div>
			<motion.div
				className="w-full md:w-1/2 flex flex-col gap-4"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				<h2 className="font-bold text-2xl text-center">Design-Vorschläge</h2>
				<div className="flex flex-col gap-4">
					{cardMockData.map((card) => (
						<motion.div key={card.title} variants={itemVariants}>
							<Card title={card.title} text={card.text} />
						</motion.div>
					))}
				</div>
				<motion.div
					initial={false}
					animate={{
						y: showContinueButton ? 0 : 50,
						opacity: showContinueButton ? 1 : 0,
					}}
					transition={{ type: "spring", stiffness: 200, damping: 20 }}
				>
					<button
						type="button"
						className="btn btn-primary w-full rounded-xl"
						onClick={onAccept}
					>
						{suggestionsToApply.size} Vorschl
						{suggestionsToApply.size === 1 ? "ag" : "äge"} übernehmen
						<ContinueIcon />
					</button>
				</motion.div>
			</motion.div>
		</div>
	);
}
