import { useAppState } from "@/utils/store";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, useCallback, type ChangeEvent, type DragEvent } from "react";

const UploadForm = () => {
	const { setLocalImageUrl } = useAppState();
	const router = useRouter();
	const [isDragging, setIsDragging] = useState(false);

	const setImageAndRoute = useCallback(
		(file: File | null) => {
			if (file) {
				setLocalImageUrl(file);
			} else {
				setLocalImageUrl(null);
			}
			router.push("/suggestions");
		},
		[setLocalImageUrl, router],
	);

	const handleFileChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0] || null;
			setImageAndRoute(file);
		},
		[setImageAndRoute],
	);
	const handleDrop = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
			const file = e.dataTransfer?.files?.[0] || null;
			setImageAndRoute(file);
		},
		[setImageAndRoute],
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

	return (
		<div className="flex flex-col items-center justify-center text-center mt-20 md:mt-32">
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.2, duration: 0.5 }}
				className="max-w-xl flex flex-col items-center gap-10"
			>
				<h2 className="text-4xl md:text-5xl font-bold tracking-tight">
					Verwandle deine Welt
				</h2>
				<p className="text-lg text-base-content">
					Lade ein Foto von deinem Zimmer hoch und lass dich inspirieren.
				</p>
				<div
					onDrop={handleDrop}
					onDragEnter={handleDragEvents}
					onDragOver={handleDragEvents}
					onDragLeave={handleDragEvents}
					className={`mt-10 w-full p-10 md:p-16 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${isDragging ? "border-primary/40 bg-primary-content/40 scale-105" : "border-gray-300 hover:border-gray-400"}`}
				>
					<input
						type="file"
						id="file-upload"
						className="hidden"
						onChange={handleFileChange}
						accept="image/*"
					/>
					<label
						htmlFor="file-upload"
						className="flex flex-col items-center justify-center space-y-4 cursor-pointer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1}
							stroke="currentColor"
							className={`size-20 transition-colors ${isDragging ? "text-primary/40" : "text-neutral-content"}`}
						>
							<title>Upload Icon</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
							/>
						</svg>
						<p className="font-semibold text-lg">
							Foto auswählen oder hierher ziehen
						</p>
						<p className="text-sm text-base-content/40">
							PNG, JPG, WEBP bis 10MB
						</p>
					</label>
				</div>
			</motion.div>
		</div>
	);
};
export default UploadForm;
