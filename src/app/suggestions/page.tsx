"use client";

import { useAppState } from "@/utils/store";
import Image from "next/image";
import Card from "../components/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

type CardData = {
	title: string;
	text: string;
	defaultChecked: boolean;
};

const cardMockData: CardData[] = [
	{
		title: "Beleuchtung",
		text: "Bringe mehr Licht in deinen Raum mit warmen, einladenden Farben.",
		defaultChecked: true,
	},
	{
		title: "Möbel",
		text: "Optimiere den Raum mit multifunktionalen Möbeln für mehr Platz.",
		defaultChecked: false,
	},
	{
		title: "Farbgestaltung",
		text: "Verwende hellere, harmonische Farben, um eine entspannte Atmosphäre zu erschaffen.",
		defaultChecked: false,
	},
];

const BackIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={2}
		stroke="currentColor"
		className="size-4 mt-0.5 text-base-content/40"
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

export default function Page() {
	const { localImageUrl, suggestionsToApply } = useAppState();
	const router = useRouter();

	const onAccept = () => {
		router.push("/result");
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	const showContinueButton = suggestionsToApply.size > 0;

	return (
		<main className="flex-1 flex flex-col md:flex-row gap-10">
			<div className="flex-1 flex flex-col gap-4">
				<h2 className="font-bold text-2xl text-center">Ihr Originalbild</h2>
				<Image
					src={localImageUrl || "/placeholder.png"}
					className="w-full h-64 object-cover rounded-lg shadow-xl"
					width={800}
					height={800}
					alt="Original uploaded image"
				/>
				<Link href={"/"} className="flex justify-center items-center gap-1.5">
					<BackIcon />

					<p className="text-base-content/40 text-center">
						anderes Bild hochladen
					</p>
				</Link>
			</div>
			<div className="flex-1 flex flex-col gap-4">
				<h2 className="font-bold text-2xl text-center">Design-Vorschläge</h2>
				<motion.div
					className="flex flex-col gap-4 flex-1"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{cardMockData.map((card) => (
						<motion.div key={card.title + card.text} variants={cardVariants}>
							<Card title={card.title} text={card.text} className="w-full" />
						</motion.div>
					))}
				</motion.div>
				<motion.button
					type="button"
					className="btn btn-primary rounded-xl join-item"
					onClick={onAccept}
					initial={false}
					animate={{ opacity: showContinueButton ? 1 : 0 }}
					transition={{ duration: 0.3 }}
				>
					<motion.p
						initial={false}
						animate={{
							x: showContinueButton ? 0 : -20,
							opacity: showContinueButton ? 1 : 0,
						}}
						transition={{ duration: 0.3 }}
						className="flex items-center gap-1"
					>
						Vorschläge übernehmen
						<ContinueIcon />
					</motion.p>
				</motion.button>
			</div>
		</main>
	);
}
