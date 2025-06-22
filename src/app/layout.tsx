// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StateGuard } from "@/app/components/StateGuard";
import { ImageModal } from "@/app/components/ImageModal";
import Link from "next/link";
import Logo from "./components/Logo";
import ThemeToggle from "./components/ThemeToggle";

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
    <html lang="de" className="bg-base-100">
      <body className="min-h-screen w-full bg-base-100 text-base-content">
        <main
          className={`${inter.variable} font-sans min-h-screen w-full antialiased flex flex-col bg-base-100`}
        >
          {/* Header */}
          <header className="w-full bg-base-100 border-b border-base-300 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <Link href="/" className="flex-shrink-0">
                  <Logo />
                </Link>
                <ThemeToggle className="ml-auto" />
              </div>
            </div>
          </header>

          {/* Main Content Area - Responsive Layout */}
          <div className="flex-1 bg-base-200 lg:bg-base-100 min-h-screen overflow-visible">
            {/* Mobile/Tablet: Card-like container */}
            <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 min-h-[calc(100vh-200px)] overflow-visible">
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
          <footer className="bg-base-100 border-t border-base-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-6 text-sm text-base-content/60">
                  <a
                    href="#"
                    className="hover:text-base-content transition-colors"
                  >
                    Impressum
                  </a>
                  <span className="text-base-content/30">|</span>
                  <a
                    href="#"
                    className="hover:text-base-content transition-colors"
                  >
                    Datenschutz
                  </a>
                </div>
                <p className="text-xs text-base-content/40 text-center">
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
