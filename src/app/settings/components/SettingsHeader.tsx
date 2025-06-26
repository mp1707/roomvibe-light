"use client";

import Link from "next/link";
import { SettingsIcon, BackIconSmall } from "@/components/Icons";

export const SettingsHeader = () => {
  return (
    <div className="mb-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-base-content/60 hover:text-base-content transition-colors mb-4 group"
      >
        <BackIconSmall />
        Zurück zur Startseite
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <SettingsIcon />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-base-content">
          Entwickler-Einstellungen
        </h1>
      </div>

      <p className="text-base-content/60 leading-relaxed">
        Konfiguriere Mock-APIs für die Entwicklung, um Kosten bei häufigen Tests
        zu sparen.
      </p>
    </div>
  );
};
