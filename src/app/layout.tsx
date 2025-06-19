import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PageTransitionWrapper } from "@/app/components/PageTransitionWrapper";

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
                className={`${inter.variable} font-sans bg-base-100 h-screen w-screen antialiased flex flex-col`}
            >
                <main className="flex-1 p-5 flex flex-col items-center w-full">
                    <h1 className="self-start text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent mb-8">
                        roomvibe
                    </h1>
                    <PageTransitionWrapper>{children}</PageTransitionWrapper>
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