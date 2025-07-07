// TypeScript declarations for next-intl with type safety
// This file extends next-intl types with our generated translation types

import type { TranslationNamespace } from './i18n';

declare global {
  // Augment the global namespace for next-intl
  interface IntlMessages extends TranslationNamespace {}
}

// Module augmentation for next-intl
declare module 'next-intl' {
  interface IntlMessages extends TranslationNamespace {}
  
  // Standard useTranslations hook (keep existing functionality)
  export function useTranslations(): (key: string, values?: any) => string;
  export function useTranslations(namespace: string): (key: string, values?: any) => string;
}

// Module augmentation for next-intl/server
declare module 'next-intl/server' {
  // Standard getTranslations hook (keep existing functionality)
  export function getTranslations(): Promise<(key: string, values?: any) => string>;
  export function getTranslations(namespace: string): Promise<(key: string, values?: any) => string>;
}

// Type-safe useTranslations hook override
declare module 'next-intl' {
  export function useTranslations<T extends keyof IntlMessages>(
    namespace?: T
  ): T extends keyof IntlMessages 
    ? {
        <K extends keyof IntlMessages[T]>(
          key: K
        ): IntlMessages[T][K] extends string 
          ? string 
          : IntlMessages[T][K] extends Record<string, unknown>
          ? never
          : string;
        
        // Support for nested keys with dot notation
        <K extends string>(
          key: K
        ): K extends `${infer P}.${infer S}` 
          ? P extends keyof IntlMessages[T]
            ? IntlMessages[T][P] extends Record<string, unknown>
              ? S extends keyof IntlMessages[T][P]
                ? IntlMessages[T][P][S] extends string
                  ? string
                  : never
                : never
              : never
            : never
          : K extends keyof IntlMessages[T]
          ? IntlMessages[T][K] extends string
            ? string
            : never
          : never;
      }
    : {
        <K extends keyof IntlMessages>(key: K): string;
        <K extends string>(key: K): string;
      };
}

// Type-safe getTranslations for server components
declare module 'next-intl/server' {
  export function getTranslations<T extends keyof IntlMessages>(
    namespace?: T
  ): Promise<T extends keyof IntlMessages 
    ? {
        <K extends keyof IntlMessages[T]>(
          key: K
        ): IntlMessages[T][K] extends string 
          ? string 
          : IntlMessages[T][K] extends Record<string, unknown>
          ? never
          : string;
        
        // Support for nested keys with dot notation
        <K extends string>(
          key: K
        ): K extends `${infer P}.${infer S}` 
          ? P extends keyof IntlMessages[T]
            ? IntlMessages[T][P] extends Record<string, unknown>
              ? S extends keyof IntlMessages[T][P]
                ? IntlMessages[T][P][S] extends string
                  ? string
                  : never
                : never
              : never
            : never
          : K extends keyof IntlMessages[T]
          ? IntlMessages[T][K] extends string
            ? string
            : never
          : never;
      }
    : {
        <K extends keyof IntlMessages>(key: K): string;
        <K extends string>(key: K): string;
      }>;
}

// Additional type safety for useFormatter
declare module 'next-intl' {
  export function useFormatter(): {
    dateTime: (value: Date | number, options?: Intl.DateTimeFormatOptions) => string;
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