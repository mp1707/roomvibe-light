import { useImageStore } from "@/utils/store";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type DragEvent } from "react";

const UploadForm = () => {
	const { setLocalImageUrl } = useImageStore();
	const router = useRouter();
	const [isDragging, setIsDragging] = useState(false);

	function handleDrop(e: DragEvent<HTMLDivElement>): void {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}

	function handleDragEvents(e: DragEvent<HTMLDivElement>): void {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setIsDragging(true);
		} else if (e.type === "dragleave") {
			setIsDragging(false);
		}
	}

	function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
		const file = event.target.files?.[0];
		if (file) {
			setLocalImageUrl(file);
		} else {
			setLocalImageUrl(null);
		}
		router.push("/suggestions");
	}

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

						<div
							// size={48}
							className={`transition-colors ${isDragging ? "text-primary-content" : "text-neutral-content"}`}
						/>
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

// import type React from "react";
// import { useRef, useState, type FormEvent } from "react";
// import resizeImage from "@/utils/resizeImage";
// import type { PutBlobResult } from "@vercel/blob";
// import Image from "next/image";
// import { motion } from "motion/react";

// const UploadForm = () => {
// 	const inputFileRef = useRef<HTMLInputElement>(null);
// 	const [blob, setBlob] = useState<PutBlobResult | null>(null);
// 	const [selectedImage, setSelectedImage] = useState<string | null>(null);

// 	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
// 		event.preventDefault();
// 		if (!inputFileRef.current?.files) {
// 			throw new Error("No file selected");
// 		}
// 		const file = inputFileRef.current.files[0];
// 		const resizedImage = await resizeImage(file, 1000, 1000, 0.8);
// 		const response = await fetch(`/api/uploadImage?filename=${file.name}`, {
// 			method: "POST",
// 			body: resizedImage,
// 		});
// 		const newBlob = (await response.json()) as PutBlobResult;
// 		setBlob(newBlob);
// 	};

// 	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// 		const file = event.target.files?.[0];
// 		if (file) {
// 			const reader = new FileReader();
// 			reader.onload = () => {
// 				setSelectedImage(reader.result as string);
// 			};
// 			reader.readAsDataURL(file);
// 		}
// 	};

// 	return (
// 		<motion.section className="" layout>
// 			{selectedImage && (
// 				<motion.div
// 					initial={{ opacity: 0, scale: 0 }}
// 					animate={{ opacity: 1, scale: 1 }}
// 					transition={{ duration: 0.2, delay: 0.2 }}
// 					className="relative w-full h-64 mb-6"
// 				>
// 					<Image
// 						src={selectedImage}
// 						alt="Selected Image"
// 						layout="fill"
// 						objectFit="cover"
// 						className="rounded-lg shadow-md"
// 					/>
// 				</motion.div>
// 			)}
// 			<h1 className="text-2xl font-bold mb-6 text-center">
// 				Upload Your Avatar
// 			</h1>
// 			<form
// 				className="flex flex-col gap-4"
// 				onSubmit={handleSubmit}
// 				aria-label="Upload avatar image"
// 			>
// 				<fieldset className="border border-base-300 rounded p-4">
// 					<legend className="font-semibold text-base mb-2">Select Image</legend>
// 					<input
// 						name="file"
// 						ref={inputFileRef}
// 						type="file"
// 						accept="image/jpeg, image/png, image/webp"
// 						required
// 						className="file-input file-input-bordered w-full max-w-xs"
// 						aria-label="Choose image file"
// 						onChange={handleFileChange}
// 					/>
// 				</fieldset>
// 				<button type="submit" className="btn btn-primary w-full mt-2">
// 					Upload
// 				</button>
// 			</form>
// 			{blob && (
// 				<div className="alert alert-success mt-6">
// 					<span>
// 						Uploaded! Blob url:{" "}
// 						<a
// 							href={blob.url}
// 							className="link link-primary break-all"
// 							target="_blank"
// 							rel="noopener noreferrer"
// 						>
// 							{blob.url}
// 						</a>
// 					</span>
// 				</div>
// 			)}
// 		</motion.section>
// 	);
// };

// export default UploadForm;
