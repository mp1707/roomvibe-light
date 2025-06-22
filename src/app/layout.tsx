// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StateGuard } from "@/app/components/StateGuard";
import { ImageModal } from "@/app/components/ImageModal";
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
    <html data-theme="aura" lang="de" className="bg-white">
      <body className="min-h-screen w-full bg-white text-gray-900">
        <main
          className={`${inter.variable} font-sans min-h-screen w-full antialiased flex flex-col bg-white`}
        >
          {/* Header */}
          <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <Link href="/" className="flex-shrink-0">
                  <Logo />
                </Link>
              </div>
            </div>
          </header>

          {/* Main Content Area - Responsive Layout */}
          <div className="flex-1 bg-gray-50 lg:bg-white min-h-screen overflow-visible">
            {/* Mobile/Tablet: Card-like container */}
            <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-200px)] overflow-visible">
                <div className="p-6 md:p-8 overflow-visible">
                  <StateGuard>{children}</StateGuard>
                </div>
              </div>
            </div>

            {/* Desktop: Full viewport layout */}
            <div className="hidden lg:block overflow-visible">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
                <div className="py-8 overflow-visible">
                  <StateGuard>{children}</StateGuard>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-6 text-sm text-gray-500">
                  <a href="#" className="hover:text-gray-700 transition-colors">
                    Impressum
                  </a>
                  <span className="text-gray-300">|</span>
                  <a href="#" className="hover:text-gray-700 transition-colors">
                    Datenschutz
                  </a>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  © {new Date().getFullYear()} roomvibe. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </main>

        <ImageModal />
      </body>
    </html>
  );
}
