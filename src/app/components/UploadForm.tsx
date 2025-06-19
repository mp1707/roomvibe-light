"use client";

import { useAppState } from "@/utils/store";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, useCallback, type ChangeEvent, type DragEvent } from "react";

const UploadIcon = ({ isDragging }: { isDragging: boolean }) => (
	<motion.svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5} // Etwas dickere Linie für bessere Sichtbarkeit
		stroke="currentColor"
		className="size-16 md:size-20 text-gray-400"
		variants={{
			initial: { scale: 1, y: 0 },
			dragging: { scale: 1.1, y: -5 },
		}}
		animate={isDragging ? "dragging" : "initial"}
		transition={{ type: "spring", stiffness: 300, damping: 20 }}
	>
		<title>Upload Icon</title>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
		/>
	</motion.svg>
);

const UploadForm = () => {
	const { setLocalImageUrl } = useAppState();
	const router = useRouter();
	const [isDragging, setIsDragging] = useState(false);
	// Neuer State, um den Upload-Prozess zu steuern und die Exit-Animation auszulösen
	const [isUploading, setIsUploading] = useState(false);

	const handleFileSelect = useCallback(
		(file: File | null) => {
			if (file) {
				// Lokale URL für eine schnelle Vorschau setzen (optional, aber gute UX)
				setLocalImageUrl(file);
				// Start der Exit-Animation
				setIsUploading(true);

				// Wir warten, bis die Exit-Animation (ca. 500ms) abgeschlossen ist, bevor wir navigieren.
				// AnimatePresence (auf der Layout/Page-Ebene) ist die robusteste Lösung hierfür.
				// Ein Timeout ist ein einfacher Weg, dies auf Komponentenebene zu simulieren.
				setTimeout(() => {
					router.push("/suggestions");
				}, 500);
			}
		},
		[setLocalImageUrl, router],
	);

	const handleFileChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0] || null;
			handleFileSelect(file);
		},
		[handleFileSelect],
	);

	const handleDrop = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
			const file = e.dataTransfer?.files?.[0] || null;
			handleFileSelect(file);
		},
		[handleFileSelect],
	);

	const handleDragEvents = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setIsDragging(true);
		} else if (e.type === "dragleave") {
			setIsDragging(false);
		}
	}, []);

	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15, // Kinder erscheinen nacheinander
				delayChildren: 0.2,
			},
		},
		exit: {
			opacity: 0,
			y: -20,
			transition: { duration: 0.5, ease: "easeInOut" },
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { type: "spring", stiffness: 100 },
		},
	};

	return (
		<div className="w-full h-full flex items-center justify-center">
			{/* AnimatePresence sorgt dafür, dass die Exit-Animation abgespielt wird,
                bevor die Komponente aus dem DOM entfernt wird. */}
			<AnimatePresence>
				{!isUploading && (
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="w-full max-w-xl flex flex-col items-center text-center p-4"
					>
						<motion.h1
							variants={itemVariants}
							className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800"
						>
							Verwandeln Sie Ihren Raum.
						</motion.h1>
						<motion.p
							variants={itemVariants}
							className="mt-4 text-lg text-gray-600"
						>
							Laden Sie ein Foto hoch und lassen Sie sich von KI-gestützten
							Designvorschlägen inspirieren.
						</motion.p>
						<motion.div
							variants={itemVariants}
							className="w-full mt-10 md:mt-12"
						>
							<motion.div
								onDrop={handleDrop}
								onDragEnter={handleDragEvents}
								onDragOver={handleDragEvents}
								onDragLeave={handleDragEvents}
								// Anstatt CSS-Transitions nutzen wir die `animate`-Prop von Framer Motion für weichere Animationen
								animate={{
									scale: isDragging ? 1.05 : 1,
									borderColor: isDragging
										? "rgb(0 122 255 / 0.5)"
										: "rgb(209 213 219)",
									backgroundColor: isDragging
										? "rgb(0 122 255 / 0.05)"
										: "transparent",
								}}
								transition={{ type: "spring", stiffness: 200, damping: 25 }}
								className={
									`relative p-10 md:p-16 border-2 rounded-2xl cursor-pointer
                                    ${isDragging ? "border-solid" : "border-dashed"}` // Ändert den Border-Style wie im Konzept
								}
							>
								<input
									type="file"
									id="file-upload"
									className="hidden"
									onChange={handleFileChange}
									accept="image/*"
								/>
								<motion.label
									htmlFor="file-upload"
									className="flex flex-col items-center justify-center space-y-4 cursor-pointer"
									whileTap={{ scale: 0.98 }}
								>
									<UploadIcon isDragging={isDragging} />
									<p className="font-semibold text-lg text-gray-700">
										Foto auswählen oder hierher ziehen
									</p>
									<p className="text-sm text-gray-400">
										PNG, JPG, WEBP bis 10MB
									</p>
								</motion.label>
							</motion.div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default UploadForm;
