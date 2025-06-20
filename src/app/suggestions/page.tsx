"use client";

import { motion } from "motion/react";
import LeftColumn from "./components/LeftColumn";
import RightColumn from "./components/RightColumn";

export default function SuggestionsPage() {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { delayChildren: 0.2, staggerChildren: 0.15 },
		},
	};

	return (
		<motion.div
			className="flex-1 w-full flex flex-col md:flex-row gap-10"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			<LeftColumn />
			<RightColumn />
		</motion.div>
	);
}
