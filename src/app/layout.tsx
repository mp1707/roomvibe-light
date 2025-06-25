// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StateGuard } from "@/app/components/StateGuard";
import { ImageModal } from "@/app/components/ImageModal";
import { ConfirmationModal } from "@/app/components/ConfirmationModal";
import Link from "next/link";
import Logo from "./components/Logo";
import ThemeToggle from "./components/ThemeToggle";
import AuthButton from "@/components/AuthButton";
import { Toaster } from "react-hot-toast";
import MockModeIndicator from "./components/MockModeIndicator";
import CreditsDisplay from "./components/CreditsDisplay";

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
                <div className="flex items-center gap-4 ml-auto">
                  <CreditsDisplay className="hidden sm:flex" />
                  <AuthButton />
                  <Link
                    href="/settings"
                    className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-base-content/60 hover:text-base-content transition-colors rounded-lg hover:bg-base-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Einstellungen
                  </Link>
                  <ThemeToggle />
                </div>
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
                <div className=" overflow-visible">
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

        <MockModeIndicator />
        <ImageModal />
        <ConfirmationModal />
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 5000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
