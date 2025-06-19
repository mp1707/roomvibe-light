"use client";

import { useAppState } from "@/utils/store";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { motion } from "motion/react";
import ReusableButton from "@/app/components/AnimatedButton";
import { useImageModalStore } from "@/utils/useImageModalStore";
import { useRef } from "react";
import { DownloadIcon, EditIcon, StartOverIcon } from "@/app/suggestions/Icons";



const ResultPage = () => {
	const { localImageUrl } = useAppState();
	const { openModal } = useImageModalStore();
	const figureRef = useRef<HTMLDivElement>(null);

	const generatedImageUrl =
		"https://img.daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a-blur.webp";

	const handleFigureClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const figure = figureRef.current;
		if (!figure) return;

		// Die `diff`-Komponente funktioniert über `grid-template-columns`.
		// Wir lesen den berechneten Stil aus, um die Position des Trenners zu finden.
		const gtc = getComputedStyle(figure).getPropertyValue(
			"grid-template-columns",
		);
		const dividerPosition = Number.parseFloat(gtc.split(" ")[0]);

		// Klickposition relativ zum Element
		const clickX = e.clientX - figure.getBoundingClientRect().left;

		if (clickX < dividerPosition) {
			// Klick war links vom Trenner -> Originalbild
			if (localImageUrl) openModal(localImageUrl);
		} else {
			// Klick war rechts vom Trenner -> Generiertes Bild
			openModal(generatedImageUrl);
		}
	};

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.3,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<motion.div
			className="flex flex-col gap-8 items-center justify-center w-full"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			<motion.div className="text-center" variants={itemVariants}>
				<h2 className="text-3xl md:text-5xl font-bold tracking-tight">
					Dein Raum, neu erfunden.
				</h2>
				<p className="text-gray-500 mt-2">
					Bewege den Regler, um den Zauber zu sehen!
				</p>
			</motion.div>

			{localImageUrl && (
				<motion.figure
					className="diff aspect-16/9 rounded-xl"
					variants={itemVariants}
					ref={figureRef}
					onClick={handleFigureClick}
				>
					<div className="diff-item-1" role="img">
						<Image width={800} height={800} alt="daisy" src={localImageUrl} />
					</div>
					<div className="diff-item-2" role="img">
						<img
							alt="daisy"
							src="https://img.daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a-blur.webp"
						/>
					</div>
					<div className="diff-resizer" />
				</motion.figure>
			)}

			<motion.div
				className="flex flex-col md:flex-row gap-4 items-evenly justify-center"
				variants={itemVariants}
			>
				<ReusableButton color={"blue"}>
					<DownloadIcon />
					Bild herunterladen
				</ReusableButton>
				<Link href="/suggestions" className="btn btn-ghost rounded-lg h-14">
					<EditIcon />
					Vorschläge bearbeiten
				</Link>
				<Link href="/" className="btn btn-ghost rounded-lg h-14">
					<StartOverIcon />
					Neu beginnen
				</Link>
			</motion.div>
		</motion.div>
	);
};

export default ResultPage;
