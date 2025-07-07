// TypeScript declarations for next-intl with type safety
// This file extends next-intl types with our generated translation types

import type { TranslationNamespace } from "./i18n";

declare global {
  // Augment the global namespace for next-intl
  interface IntlMessages extends TranslationNamespace {}
}

// Module augmentation for next-intl
declare module "next-intl" {
  interface IntlMessages extends TranslationNamespace {}

  // Standard useTranslations hook with proper parameter support
  export function useTranslations(): {
    (key: string, values?: Record<string, unknown>): string;
    rich(key: string, values?: Record<string, unknown>): string;
  };
  export function useTranslations(
    namespace: string
  ): {
    (key: string, values?: Record<string, unknown>): string;
    rich(key: string, values?: Record<string, unknown>): string;
  };
}

// Module augmentation for next-intl/server
declare module "next-intl/server" {
  // Standard getTranslations hook with proper parameter support
  export function getTranslations(): Promise<{
    (key: string, values?: Record<string, unknown>): string;
    rich(key: string, values?: Record<string, unknown>): string;
  }>;
  export function getTranslations(
    namespace: string
  ): Promise<{
    (key: string, values?: Record<string, unknown>): string;
    rich(key: string, values?: Record<string, unknown>): string;
  }>;
}

// Additional type safety for useFormatter
declare module "next-intl" {
  export function useFormatter(): {
    dateTime: (
      value: Date | number,
      options?: Intl.DateTimeFormatOptions
    ) => string;
    number: (value: number, options?: Intl.NumberFormatOptions) => string;
    list: (value: Iterable<string>, options?: Intl.ListFormatOptions) => string;
    relativeTime: (
      value: number,
      unit: Intl.RelativeTimeFormatUnit,
      options?: Intl.RelativeTimeFormatOptions
    ) => string;
  };
}

// Export for module augmentation
export {};
