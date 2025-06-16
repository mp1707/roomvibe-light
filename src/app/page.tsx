"use client";
import { motion } from "motion/react";

import UploadForm from "@/app/components/UploadForm";
import Image from "next/image";
import heroImage from "@/assets/images/hero.png";
import { useState } from "react";

export default function Home() {
	return (
		<main className="w-full h-full flex flex-col p-10">
			<motion.h1
				initial={{ opacity: 0, y: -160, scale: 0.9 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ type: "spring", delay: 0.5 }}
				className="self-start text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight mb-8"
			>
				roomvibe
			</motion.h1>
			<UploadForm />
			{/* <div className="w-full flex gap-20">
				<Image src={heroImage} alt="Hero Image" className="w-1/2" />
				<h2 className="font-bold text-2xl">Design-Vorschläge</h2>
			</div> */}
		</main>
	);
}
