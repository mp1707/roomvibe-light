import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StateGuard } from "@/app/components/StateGuard";
import RoomVibeLogo from "@/app/components/RoomVibeLogo";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "roomvibe | AI Interior Design",
	description: "Verwandeln Sie Ihren Raum mit KI-gestützten Designvorschlägen.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html data-theme="light" lang="de">
			<body
				className={`${inter.variable} font-sans bg-base-300 h-screen w-screen antialiased flex flex-col`}
			>
				<main className="flex-1 p-5 flex flex-col items-start w-full">
					<RoomVibeLogo />
					<div className="flex-1 flex flex-col w-full sm:w-3/4 md:w-2/3 lg:w-3/5 mx-auto">
						<StateGuard>{children}</StateGuard>
					</div>
				</main>
				<footer className="w-full">
					<p className="text-center text-sm text-gray-500 pb-5">
						© {new Date().getFullYear()} roomvibe. All rights reserved.
					</p>
				</footer>
			</body>
		</html>
	);
}
