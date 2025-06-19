import { motion } from "motion/react";
import type {
	TargetAndTransition,
	VariantLabels,
	Transition,
} from "motion/react";
import type { ReactNode } from "react";

type Props = {
	key?: string;
	initial?: boolean | TargetAndTransition | VariantLabels;
	animate?: boolean | TargetAndTransition | VariantLabels;
	exit?: TargetAndTransition | VariantLabels;
	whileHover?: TargetAndTransition | VariantLabels;
	whileTap?: TargetAndTransition | VariantLabels;
	transition?: Transition;
	type?: "button" | "submit" | "reset";
	className?: string;
	color: "green" | "blue";
	onClick?: () => void;
	children: ReactNode;
};

const defaultAnimations = {
	initial: { opacity: 0, scale: 0.9 },
	animate: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 0.9 },
	whileHover: { scale: 1.03 },
	whileTap: { scale: 0.98 },
	transition: { duration: 0.2, ease: "easeOut" as const }, // Changed ease to a valid string literal
};

const AnimatedButton: React.FC<Props> = ({
	key,
	type = "button",
	className,
	color,
	onClick,
	children,
}) => {
	const backgroundColor = color === "green" ? "#10B981" : "#432ad6"; // Green or popping blue

	return (
		<motion.button
			key={key}
			{...defaultAnimations}
			type={type}
			className="btn rounded-xl h-14 text-lg font-bold shadow-lg"
			style={{ backgroundColor, color: "white" }}
			onClick={onClick}
		>
			{children}
		</motion.button>
	);
};

export default AnimatedButton;
