// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StateGuard } from "@/components/StateGuard";
import { ImageModal } from "@/components/ImageModal";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import MockModeIndicator from "../components/MockModeIndicator";

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
  const themeInitializerScript = `
    (function() {
      try {
        const theme = localStorage.getItem('theme');
        if (theme) {
          document.documentElement.setAttribute('data-theme', theme);
        }
      } catch (e) {
        // Silently fail if localStorage is not available
      }
    })();
  `;
  return (
    <html lang="de" className="bg-base-100" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
        <main
          className={`${inter.variable} font-sans min-h-screen w-full antialiased flex flex-col bg-base-100`}
        >
          <Header />

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
