import type React from "react";
import { useRef, useState, type FormEvent } from "react";
import resizeImage from "@/utils/resizeImage";
import type { PutBlobResult } from "@vercel/blob";
import Image from "next/image";
import { motion } from "motion/react";

const UploadForm = () => {
	const inputFileRef = useRef<HTMLInputElement>(null);
	const [blob, setBlob] = useState<PutBlobResult | null>(null);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!inputFileRef.current?.files) {
			throw new Error("No file selected");
		}
		const file = inputFileRef.current.files[0];
		const resizedImage = await resizeImage(file, 1000, 1000, 0.8);
		const response = await fetch(`/api/uploadImage?filename=${file.name}`, {
			method: "POST",
			body: resizedImage,
		});
		const newBlob = (await response.json()) as PutBlobResult;
		setBlob(newBlob);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setSelectedImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<motion.section className="" layout>
			{selectedImage && (
				<motion.div
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.2, delay: 0.2 }}
					className="relative w-full h-64 mb-6"
				>
					<Image
						src={selectedImage}
						alt="Selected Image"
						layout="fill"
						objectFit="cover"
						className="rounded-lg shadow-md"
					/>
				</motion.div>
			)}
			<h1 className="text-2xl font-bold mb-6 text-center">
				Upload Your Avatar
			</h1>
			<form
				className="flex flex-col gap-4"
				onSubmit={handleSubmit}
				aria-label="Upload avatar image"
			>
				<fieldset className="border border-base-300 rounded p-4">
					<legend className="font-semibold text-base mb-2">Select Image</legend>
					<input
						name="file"
						ref={inputFileRef}
						type="file"
						accept="image/jpeg, image/png, image/webp"
						required
						className="file-input file-input-bordered w-full max-w-xs"
						aria-label="Choose image file"
						onChange={handleFileChange}
					/>
				</fieldset>
				<button type="submit" className="btn btn-primary w-full mt-2">
					Upload
				</button>
			</form>
			{blob && (
				<div className="alert alert-success mt-6">
					<span>
						Uploaded! Blob url:{" "}
						<a
							href={blob.url}
							className="link link-primary break-all"
							target="_blank"
							rel="noopener noreferrer"
						>
							{blob.url}
						</a>
					</span>
				</div>
			)}
		</motion.section>
	);
};

export default UploadForm;
