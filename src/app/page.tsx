"use client";
import { motion } from "motion/react";

import UploadForm from "@/app/components/UploadForm";
import Image from "next/image";
import heroImage from "@/assets/images/hero.png";
import { useState } from "react";

export default function Home() {
	return (
		<div className="w-full h-full flex flex-col">
			<UploadForm />
			{/* <div className="w-full flex gap-20">
				<Image src={heroImage} alt="Hero Image" className="w-1/2" />
				<h2 className="font-bold text-2xl">Design-Vorschläge</h2>
			</div> */}
		</div>
	);
}
