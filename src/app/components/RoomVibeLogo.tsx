"use client";
import { useRouter } from "next/navigation";
import React from "react";

const RoomVibeLogo = () => {
	const router = useRouter();
	return (
		<button
			type="button"
			onClick={() => router.push("/")}
			className="btn bg-transparent border-none hover:shadow-lg flex flex-col items-start justify-center gap-2 py-8"
		>
			<h1 className="self-start text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
				roomvibe
			</h1>
		</button>
	);
};

export default RoomVibeLogo;
