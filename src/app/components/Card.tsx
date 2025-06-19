"use client";

import type React from "react";
import { motion } from "motion/react";
import { useAppState } from "@/utils/store";

interface Props {
	title: string;
	text: string;
	className?: string;
}

const colors = {
	highlight: "#10B981",
	initial: "#ffffff",
	activeText: "#ffffff",
	initialText: "#374151",
	glow: "rgba(16, 185, 129, 0.6)",
};

const regularShadow =
	"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)";
const activeGlow = `0 0 25px ${colors.glow}`;

const Card = ({ title, text, className }: Props) => {
	const { suggestionsToApply, setSuggestionsToApply } = useAppState();
	const active = suggestionsToApply.has(title);

	const toggleActive = () => {
		const newSet = new Set(suggestionsToApply);
		active ? newSet.delete(title) : newSet.add(title);
		setSuggestionsToApply(newSet);
	};

	const cardVariants = {
		initial: {
			"--gradient-stop": "0%",
			boxShadow: regularShadow,
		},
		active: {
			"--gradient-stop": "100%",
			boxShadow: `${regularShadow}, ${activeGlow}`,
		},
		hover: {
			scale: 1.03,
			transition: { stiffness: 300, damping: 15 },
		},
	};

	const textVariants = {
		initial: { color: colors.initialText },
		active: { color: colors.activeText },
	};

	return (
		<motion.div
			className={`card rounded-2xl w-full shadow-md overflow-hidden ${className || ""}`}
			style={
				{
					backgroundImage:
						"linear-gradient(to right, var(--highlight-color) var(--gradient-stop), var(--initial-color) var(--gradient-stop))",
					"--highlight-color": colors.highlight,
					"--initial-color": colors.initial,
				} as React.CSSProperties
			}
			initial="initial"
			animate={active ? "active" : "initial"}
			whileHover="hover"
			variants={cardVariants}
			transition={{ duration: 0.4, ease: "easeInOut" }}
			onClick={toggleActive}
		>
			<div className="card-body relative z-10 bg-transparent cursor-pointer">
				<motion.h2 className="card-title" variants={textVariants}>
					{title}
				</motion.h2>
				<motion.p variants={textVariants}>{text}</motion.p>

				<div className="card-actions justify-end items-center">
					<motion.span className="mr-2 font-medium" variants={textVariants}>
						Vorschlag anwenden
					</motion.span>
					<input
						type="checkbox"
						className="toggle toggle-sm toggle-accent"
						checked={active}
						readOnly
					/>
				</div>
			</div>
		</motion.div>
	);
};

export default Card;
