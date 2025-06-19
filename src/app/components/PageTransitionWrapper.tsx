"use client";

import { motion, AnimatePresence, type Variants } from "motion/react";
import { usePathname } from "next/navigation";

const pageTransitionVariants: Variants = {
	hidden: {
		opacity: 0,
		y: 20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			stiffness: 100,
			damping: 20,
			duration: 0.6,
		},
	},
	exit: {
		opacity: 0,
		y: -20,
		transition: {
			ease: "anticipate",
			duration: 0.4,
		},
	},
};

export const PageTransitionWrapper = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const pathname = usePathname();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={pathname}
				variants={pageTransitionVariants}
				initial="hidden"
				animate="visible"
				exit="exit"
				className="flex-1 flex flex-col w-full sm:w-3/4 md:w-2/3 lg:w-3/5 mx-auto"
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};
