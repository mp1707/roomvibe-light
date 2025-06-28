// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    <html className="bg-base-100" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
        {children}
      </body>
    </html>
  );
}
