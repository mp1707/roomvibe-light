"use client";

import { motion, AnimatePresence, type Variants } from "motion/react";
import { usePathname } from "next/navigation";

// Diese Varianten steuern die Animation der gesamten Seite
const pageTransitionVariants: Variants = {
	hidden: {
		opacity: 0,
		y: 20, // Seite kommt leicht von unten
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			stiffness: 100,
			damping: 20,
			duration: 0.7,
		},
	},
	exit: {
		opacity: 0,
		y: -20, // Seite verschwindet leicht nach oben
		transition: {
			ease: "anticipate", // Eine elegante "Anticipation"-Kurve
			duration: 0.4,
		},
	},
};

export const PageTransitionWrapper = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	// Der usePathname Hook gibt uns den aktuellen URL-Pfad.
	// Dies ist der Schlüssel, damit AnimatePresence eine Seitenänderung erkennt.
	const pathname = usePathname();

	return (
		<AnimatePresence
			// mode="wait" ist entscheidend: Die alte Seite animiert erst komplett raus,
			// bevor die neue Seite rein animiert. Das verhindert visuelles Überlappen.
			mode="wait"
		>
			<motion.div
				// Der key={pathname} teilt AnimatePresence mit, DASS sich die Seite geändert hat.
				key={pathname}
				variants={pageTransitionVariants}
				initial="hidden"
				animate="visible"
				exit="exit"
				className="flex-1 flex flex-col sm:w-3/4 md:w-2/3 lg:w-3/5 mx-auto" // Sorgt dafür, dass der Container den Platz ausfüllt
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};
