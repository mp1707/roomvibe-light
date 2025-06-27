"use client";

import Link from "next/link";
import { CogIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export const SettingsHeader = () => {
  return (
    <div className="mb-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-base-content/60 hover:text-base-content transition-colors mb-4 group"
      >
        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Zurück zur Startseite
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <CogIcon className="w-6 h-6 text-primary" />
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
