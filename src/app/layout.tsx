// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StateGuard } from "@/app/components/StateGuard";
import { ImageModal } from "@/app/components/ImageModal"; // <-- Importieren
import Link from "next/link";
import Logo from "./components/Logo";

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
      <body className="h-screen w-screen">
        <main
          className={`${inter.variable} font-sans bg-base-100 h-screen w-screen antialiased flex flex-col`}
        >
          <div className="flex-1 flex flex-col items-center w-full justify-center">
            <header className="w-full flex items-center justify-start py-4 px-8">
              <Link href="/">
                <Logo />
              </Link>
            </header>
            <div className="flex-1 flex flex-col w-full sm:w-3/4 md:w-2/3 lg:w-3/5 mx-auto justify-center p-2 md:p-4">
              <StateGuard>{children}</StateGuard>
            </div>
          </div>
          <footer className="w-full flex flex-col items-center gap-2 pb-6">
            <div className="flex gap-4 text-sm text-gray-500">
              <a href="#" className="hover:underline">
                Impressum
              </a>
              <span>|</span>
              <a href="#" className="hover:underline">
                Datenschutz
              </a>
            </div>
            <p className="text-center text-xs text-gray-400">
              © {new Date().getFullYear()} roomvibe. All rights reserved.
            </p>
          </footer>
        </main>

        <ImageModal />
      </body>
    </html>
  );
}
