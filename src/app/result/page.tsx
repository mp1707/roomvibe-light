"use client";

import { useImageStore } from "@/utils/store";
import Image from "next/image";
import React from "react";

const page = () => {
	const { localImageUrl } = useImageStore();
	return (
		<div className="flex flex-col gap-10 md:gap-5 items-center justify-center mt-10 md:mt-20">
			<div>
				<h2 className="text-3xl md:text-5xl font-bold tracking-tight">
					Dein Raum, neu erfunden.
				</h2>
				<p className="text-base-content/60 text-center mt-2">Bewege den Regler!</p>
			</div>
			{/*  diff image  */}
			{localImageUrl && (
				<figure className="diff aspect-16/9 rounded-xl">
					<div className="diff-item-1" role="img">
						<Image width={800} height={800} alt="daisy" src={localImageUrl} />
					</div>
					<div className="diff-item-2" role="img">
						<img
							alt="daisy"
							src="https://img.daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a-blur.webp"
						/>
					</div>
					<div className="diff-resizer" />
				</figure>
			)}
			<div className="flex flex-col md:flex-row gap-4">
				<button type="button" className="btn btn-primary">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-4 text-base-100"
					>
						<title>download</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
						/>
					</svg>
					Bild herunterladen
				</button>
				<button type="button" className="btn text-base-content/70">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-4 text-base-content/70"
					>
						<title>edit</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
						/>
					</svg>
					Vorschläge bearbeiten
				</button>
				<button type="button" className="btn text-base-content/70">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-4 text-base-content/70"
					>
						<title>start over</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
						/>
					</svg>
					Neu beginnen
				</button>
			</div>
		</div>
	);
};

export default page;
