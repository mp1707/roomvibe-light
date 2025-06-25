"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMotionPreference } from "@/utils/animations";
import { useAppState } from "@/utils/store";
import { useEffect } from "react";
import Image from "next/image";

interface AILoadingScreenProps {
	progress: number;
	steps: string[];
	title: string;
	subtitle: string;
	hint?: string;
	mode: "analyze" | "generate";
	currentGeneratedImage?: string | null;
}

const AnalysisEffect = () => {
	const reducedMotion = useMotionPreference();

	if (reducedMotion) {
		return (
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-pulse" />
		);
	}

	return (
		<>
			{/* Main scanning laser */}
			<motion.div
				className="absolute inset-0 pointer-events-none"
				initial={{ x: "-120%" }}
				animate={{ x: "120%" }}
				transition={{
					duration: 12,
					repeat: Number.POSITIVE_INFINITY,
					ease: [0.22, 1, 0.36, 1], // Apple easing from design system
					repeatType: "loop",
					repeatDelay: 2,
				}}
			>
				<div className="relative w-full h-full">
					{/* Scanning line - more subtle */}
					<div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/80 shadow-[0_0_12px_theme(colors.primary/0.4)] dark:shadow-[0_0_16px_theme(colors.primary/0.5)] transform -translate-x-1/2" />

					{/* Scanning gradient - softer */}
					<div className="absolute left-1/2 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-primary/15 dark:via-primary/20 to-transparent transform -translate-x-1/2" />

					{/* Leading glow - more subtle */}
					<div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/30 dark:bg-primary/40 blur-sm transform -translate-x-1/2" />
				</div>
			</motion.div>

			{/* Grid overlay for futuristic feel - more subtle */}
			<div
				className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
				style={{
					backgroundImage: `
            linear-gradient(rgba(0,122,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,122,255,0.05) 1px, transparent 1px)
          `,
					backgroundSize: "40px 40px",
				}}
			/>

			{/* Scanning overlay effect - gentle trailing glow */}
			<motion.div
				className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/4 dark:via-primary/6 to-transparent pointer-events-none"
				initial={{ x: "-80%" }}
				animate={{ x: "180%" }}
				transition={{
					duration: 14,
					repeat: Number.POSITIVE_INFINITY,
					ease: [0.4, 0, 0.2, 1], // Apple ease-in-out from design system
					repeatType: "loop",
					repeatDelay: 2.5,
				}}
				style={{ width: "80%" }}
			/>

			{/* Very subtle breathing effect on the whole overlay */}
			<motion.div
				className="absolute inset-0 bg-primary/2 dark:bg-primary/3 pointer-events-none"
				animate={{
					opacity: [0, 1, 0],
				}}
				transition={{
					duration: 6,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
					repeatType: "reverse",
				}}
			/>
		</>
	);
};

const GenerationEffect = () => {
	const reducedMotion = useMotionPreference();

	if (reducedMotion) {
		return (
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-success/10 to-transparent animate-pulse" />
		);
	}

	return (
		<>
			{/* AI Generation Wave - flowing from bottom to top */}
			<motion.div
				className="absolute inset-0 pointer-events-none"
				initial={{ y: "100%" }}
				animate={{ y: "-100%" }}
				transition={{
					duration: 16,
					repeat: Number.POSITIVE_INFINITY,
					ease: [0.22, 1, 0.36, 1], // Apple easing from design system
					repeatType: "loop",
					repeatDelay: 3,
				}}
			>
				<div className="relative w-full h-full">
					{/* Main generation wave */}
					<div className="absolute left-0 right-0 top-1/2 h-1 bg-success shadow-[0_0_15px_theme(colors.success/0.6)] dark:shadow-[0_0_20px_theme(colors.success/0.7)] transform -translate-y-1/2" />

					{/* Wave gradient */}
					<div className="absolute left-0 right-0 top-1/2 h-20 bg-gradient-to-t from-transparent via-success/20 dark:via-success/25 to-transparent transform -translate-y-1/2" />

					{/* Trailing glow */}
					<div className="absolute left-0 right-0 top-1/2 h-2 bg-success/40 dark:bg-success/50 blur-sm transform -translate-y-1/2" />
				</div>
			</motion.div>

			{/* Pixel generation effect - small squares appearing */}
			<motion.div
				className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-40"
				style={{
					backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(34,197,94,0.1) 2px, transparent 2px),
            radial-gradient(circle at 80% 70%, rgba(34,197,94,0.08) 1px, transparent 1px),
            radial-gradient(circle at 40% 80%, rgba(34,197,94,0.12) 1.5px, transparent 1.5px),
            radial-gradient(circle at 70% 20%, rgba(34,197,94,0.06) 1px, transparent 1px)
          `,
					backgroundSize: "60px 60px, 40px 40px, 80px 80px, 50px 50px",
				}}
				animate={{
					backgroundPosition: [
						"0% 0%, 0% 0%, 0% 0%, 0% 0%",
						"100% 100%, -100% -100%, 100% -100%, -100% 100%",
					],
				}}
				transition={{
					duration: 20,
					repeat: Number.POSITIVE_INFINITY,
					ease: "linear",
				}}
			/>

			{/* Digital mesh overlay */}
			<div
				className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
				style={{
					backgroundImage: `
            linear-gradient(rgba(34,197,94,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.08) 1px, transparent 1px)
          `,
					backgroundSize: "25px 25px",
				}}
			/>

			{/* Flowing data streams - diagonal lines */}
			<motion.div
				className="absolute inset-0 bg-gradient-to-br from-transparent via-success/6 dark:via-success/8 to-transparent pointer-events-none"
				initial={{ x: "-100%", y: "-100%" }}
				animate={{ x: "100%", y: "100%" }}
				transition={{
					duration: 18,
					repeat: Number.POSITIVE_INFINITY,
					ease: [0.4, 0, 0.2, 1], // Apple ease-in-out from design system
					repeatType: "loop",
					repeatDelay: 4,
				}}
				style={{ width: "200%", height: "200%" }}
			/>

			{/* Generation particles floating upward */}
			<div className="absolute inset-0 pointer-events-none">
				{[...Array(8)].map((_, i) => (
					<motion.div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={i}
						className="absolute w-1 h-1 bg-success/40 rounded-full"
						style={{
							left: `${10 + i * 12}%`,
							bottom: "10%",
						}}
						animate={{
							y: [0, -300],
							opacity: [0, 1, 0],
							scale: [0.5, 1, 0.5],
						}}
						transition={{
							duration: 4 + i * 0.5,
							repeat: Number.POSITIVE_INFINITY,
							delay: i * 0.8,
							ease: "easeOut",
						}}
					/>
				))}
			</div>

			{/* Subtle breathing effect */}
			<motion.div
				className="absolute inset-0 bg-success/3 dark:bg-success/4 pointer-events-none"
				animate={{
					opacity: [0, 1, 0],
				}}
				transition={{
					duration: 8,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
					repeatType: "reverse",
				}}
			/>
		</>
	);
};

const ImageDisplay = ({
	progress,
	mode,
	currentGeneratedImage,
}: {
	progress: number;
	mode: "analyze" | "generate";
	currentGeneratedImage?: string | null;
}) => {
	const { localImageUrl, hostedImageUrl } = useAppState();
	const reducedMotion = useMotionPreference();

	// Determine which image to show based on mode
	const displayImageUrl =
		mode === "analyze"
			? localImageUrl || hostedImageUrl
			: currentGeneratedImage || localImageUrl || hostedImageUrl;

	// Color theme based on mode
	const colorTheme = mode === "analyze" ? "primary" : "success";
	const statusText =
		mode === "analyze" ? "KI-Analyse läuft" : "KI-Generierung läuft";

	if (!displayImageUrl) {
		return (
			<div className="w-full aspect-[4/3] rounded-3xl bg-base-200 flex items-center justify-center">
				<div className="text-base-content/40">Kein Bild verfügbar</div>
			</div>
		);
	}
  
	const borderClass =
		colorTheme === "primary"
			? "border-primary/60 dark:border-primary/70"
			: "border-success/60 dark:border-success/70";

	return (
		<div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
			{/* Base image */}
			<Image
				src={displayImageUrl}
				alt={
					mode === "analyze" ? "Bild wird analysiert" : "Bild wird generiert"
				}
				fill
				className="object-cover"
				priority
			/>

			{/* Overlay for better contrast - adjusted based on mode */}
			<div
				className={`absolute inset-0 ${
					mode === "analyze"
						? "bg-black/20 dark:bg-black/40"
						: "bg-black/15 dark:bg-black/25"
				}`}
			/>

			{/* AI Effects based on mode */}
			{mode === "analyze" ? <AnalysisEffect /> : <GenerationEffect />}

			{/* Status indicator */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="absolute bottom-4 left-4 right-4"
			>
				<div className="bg-base-100/90 dark:bg-base-100/95 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20 dark:border-white/10">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<motion.div
								className={`w-2 h-2 bg-${colorTheme} rounded-full`}
								animate={reducedMotion ? {} : { scale: [1, 1.5, 1] }}
								transition={
									reducedMotion
										? {}
										: {
												duration: 1.5,
												repeat: Number.POSITIVE_INFINITY,
												ease: "easeInOut",
											}
								}
							/>
							<span className="text-sm font-medium text-base-content">
								{statusText}
							</span>
						</div>
						<div className="text-xs text-base-content/60 tabular-nums">
							{Math.round(progress)}%
						</div>
					</div>
				</div>
			</motion.div>

			{/* Corner indicators - themed by mode */}
			<div className="absolute top-4 left-4">
				<div
					className={`w-6 h-6 border-l-2 border-t-2 ${borderClass} rounded-tl-lg`}
				/>
			</div>
			<div className="absolute top-4 right-4">
				<div
					className={`w-6 h-6 border-r-2 border-t-2 ${borderClass} rounded-tr-lg`}
				/>
			</div>
			<div className="absolute bottom-20 left-4">
				<div
					className={`w-6 h-6 border-l-2 border-b-2 ${borderClass} rounded-bl-lg`}
				/>
			</div>
			<div className="absolute bottom-20 right-4">
				<div
					className={`w-6 h-6 border-r-2 border-b-2 ${borderClass} rounded-br-lg`}
				/>
			</div>
		</div>
	);
};

export default function AILoadingScreen({
	progress,
	steps,
	title,
	subtitle,
	hint,
	mode,
	currentGeneratedImage,
}: AILoadingScreenProps) {
	const currentStep = Math.min(
		Math.floor((progress / 100) * steps.length),
		steps.length - 1,
	);
	const reducedMotion = useMotionPreference();

	// Scroll to top when component mounts (animation starts)
	useEffect(() => {
		const scrollToTop = () => {
			window.scrollTo({
				top: 0,
				behavior: reducedMotion ? "auto" : "smooth",
			});
		};

		// Small delay to ensure the component is rendered
		const timeoutId = setTimeout(scrollToTop, 100);

		return () => clearTimeout(timeoutId);
	}, [reducedMotion]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="w-full max-w-2xl mx-auto text-center"
		>
			{/* Header */}
			<div className="mb-8 md:mb-12">
				<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-base-content mb-3 md:mb-4">
					{title}
				</h1>
				<p className="text-base sm:text-lg text-base-content/60 max-w-2xl mx-auto">
					{subtitle}
				</p>
			</div>

			{/* Image with AI effects */}
			<div className="mb-8">
				<ImageDisplay
					progress={progress}
					mode={mode}
					currentGeneratedImage={currentGeneratedImage}
				/>
			</div>

			{/* Current step text */}
			<AnimatePresence mode="wait">
				<motion.div
					key={currentStep}
					initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
					animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
					exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
					transition={{ duration: 0.4 }}
					className="mb-6"
				>
					<h3 className="text-lg sm:text-xl font-semibold text-base-content px-4">
						{steps[currentStep]}
					</h3>
				</motion.div>
			</AnimatePresence>

			{/* Processing hint */}
			{hint && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className="text-center"
				>
					<p className="text-xs sm:text-sm text-base-content/40">{hint}</p>
				</motion.div>
			)}

			{/* Accessibility */}
			<div className="sr-only" aria-live="polite" aria-atomic="true">
				{mode === "analyze" ? "Fortschritt" : "Generierung"}:{" "}
				{Math.round(progress)}%. {steps[currentStep]}
			</div>
		</motion.div>
	);
}
