"use client";

import { useImageStore } from "@/utils/store";
import Image from "next/image";
import Collapsible from "../components/Collapsible";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
	const { localImageUrl } = useImageStore();
	const router = useRouter();

	const onAccept = () => {
		router.push("/result");
	};
	return (
		<main className="flex-1 flex flex-col md:flex-row gap-10">
			<div className="flex-1 flex flex-col gap-4">
				<h2 className="font-bold text-2xl text-center">Ihr Originalbild</h2>
				<Image
					src={localImageUrl || "/placeholder.png"}
					className="w-full h-64 object-cover rounded-lg shadow-xl"
					width={800}
					height={800}
					alt={""}
				/>
				<Link href={"/"} className="flex justify-center items-center gap-1.5">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-4 mt-1 text-base-content/40"
					>
						<title>back</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
						/>
					</svg>

					<p className="text-base-content/40 text-center">
						anderes Bild hochladen
					</p>
				</Link>
			</div>
			<div className="flex-1 flex flex-col gap-4">
				<h2 className="font-bold text-2xl text-center">Design-Vorschläge</h2>
				<div className="join join-vertical bg-base-100 rounded-xl shadow-xl">
					<Collapsible title="Beleuchtung" name="my-accordion-4" defaultChecked>
						<div className="flex">
							Bringe mehr Licht in deinen Raum mit warmen, einladenden Farben.
							<input
								type="checkbox"
								defaultChecked
								className="toggle toggle-sm"
							/>
						</div>
					</Collapsible>
					<div className="border-b-1 border-neutral-content mx-4" />
					<Collapsible title="Möbel" name="my-accordion-4">
						<div className="flex">
							Optimiere den Raum mit multifunktionalen Möbeln für mehr Platz.
							<input
								type="checkbox"
								defaultChecked
								className="toggle toggle-sm"
							/>
						</div>
					</Collapsible>
					<div className="border-b-1 border-neutral-content mx-4" />
					<Collapsible title="Farbgestaltung" name="my-accordion-4">
						<div className="flex">
							Verwende helle, harmonische Farben, um eine entspannte Atmosphäre
							zu erschaffen.
							<input
								type="checkbox"
								defaultChecked
								className="toggle toggle-sm"
							/>
						</div>
					</Collapsible>
				</div>
				<button
					type="button"
					className="btn btn-primary rounded-xl join-item"
					onClick={onAccept}
				>
					Vorschläge übernehmen
				</button>
			</div>
		</main>
	);
}
