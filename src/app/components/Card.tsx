"use client";
import type React from "react";
import { motion, easeOut, easeInOut, hover } from "motion/react";
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
	initialToggle: "#374151",
	glow: "rgba(16, 185, 129, 0.6)",
};

const regularShadow =
	"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)";
const activeGlow = `0 0 25px ${colors.glow}`;
const inactiveGlow = `0 0 0px ${colors.glow.replace("0.6", "0")}`;

const mainAnimationConfig = { duration: 0.4, ease: easeOut };
const hoverAnimationConfig = { duration: 0.2, ease: easeInOut };

const Card = ({ title, text, className }: Props) => {
	const { suggestionsToApply, setSuggestionsToApply } = useAppState();
	const active = suggestionsToApply.has(title);

	const toggleActive = () => {
		const newSet = new Set(suggestionsToApply);
		active ? newSet.delete(title) : newSet.add(title);
		setSuggestionsToApply(newSet);
	};

	return (
		<motion.div
			className={`card rounded-2xl w-96 shadow-md overflow-hidden ${className || ""}`}
			style={
				{
					backgroundImage:
						"linear-gradient(to right, var(--highlight-color) var(--gradient-stop), var(--initial-color) var(--gradient-stop))",
					"--highlight-color": colors.highlight,
					"--initial-color": colors.initial,
				} as React.CSSProperties
			}
			initial={false}
			animate={{
				"--gradient-stop": active ? "100%" : "0%",
				boxShadow: active
					? `${regularShadow}, ${activeGlow}`
					: `${regularShadow}, ${inactiveGlow}`,
			}}
			whileHover={{ scale: 1.04 }}
			transition={{
				scale: hoverAnimationConfig,
				default: mainAnimationConfig,
			}}
		>
			<label
				className="card-body relative z-10 bg-transparent cursor-pointer"
				htmlFor={`${title}-toggle`}
			>
				<motion.h2
					className="card-title"
					animate={{ color: active ? colors.activeText : colors.initialText }}
					transition={mainAnimationConfig}
				>
					{title}
				</motion.h2>
				<motion.p
					animate={{ color: active ? colors.activeText : colors.initialText }}
					transition={mainAnimationConfig}
				>
					{text}
				</motion.p>

				<div className="card-actions justify-end items-center cursor-pointer">
					<motion.span
						className="mr-2 font-medium"
						animate={{ color: active ? colors.activeText : colors.initialText }}
						transition={mainAnimationConfig}
					>
						Vorschlag anwenden
					</motion.span>
					<motion.input
						id={`${title}-toggle`}
						type="checkbox"
						className="toggle toggle-sm toggle-accent"
						checked={active}
						onChange={toggleActive}
					/>
				</div>
			</label>
		</motion.div>
	);
};

export default Card;
