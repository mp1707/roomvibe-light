/**
 * Type-safe i18n helper functions with pluralization support
 */

import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { TranslationKey } from '@/types/i18n';

// Pluralization options
export interface PluralOptions {
  zero?: string;
  one?: string;
  few?: string;
  many?: string;
  other: string;
}

// Type-safe pluralization function
export function getPlural(count: number, options: PluralOptions): string {
  if (count === 0 && options.zero) return options.zero;
  if (count === 1 && options.one) return options.one;
  if (count > 1 && count < 5 && options.few) return options.few;
  if (count >= 5 && options.many) return options.many;
  return options.other;
}

// German plural rules
export function getGermanPlural(count: number, options: PluralOptions): string {
  if (count === 0 && options.zero) return options.zero;
  if (count === 1 && options.one) return options.one;
  return options.other;
}

// English plural rules
export function getEnglishPlural(count: number, options: PluralOptions): string {
  if (count === 0 && options.zero) return options.zero;
  if (count === 1 && options.one) return options.one;
  return options.other;
}

// Type-safe translation hook with pluralization
export function useTypedTranslations<T extends keyof IntlMessages>(namespace: T) {
  const t = useTranslations(namespace);
  
  return {
    // Standard translation
    t: <K extends keyof IntlMessages[T]>(key: K, values?: Record<string, unknown>) => {
      return t(key as string, values);
    },
    
    // Pluralization with ICU message format
    plural: (
      key: keyof IntlMessages[T],
      count: number,
      values?: Record<string, unknown>
    ) => {
      return t(key as string, { count, ...values });
    },
    
    // Rich text support
    rich: <K extends keyof IntlMessages[T]>(
      key: K,
      values?: Record<string, unknown>
    ) => {
      return t.rich(key as string, values);
    }
  };
}

// Server component version
export async function getTypedTranslations<T extends keyof IntlMessages>(namespace: T) {
  const t = await getTranslations(namespace);
  
  return {
    // Standard translation
    t: <K extends keyof IntlMessages[T]>(key: K, values?: Record<string, unknown>) => {
      return t(key as string, values);
    },
    
    // Pluralization with ICU message format
    plural: (
      key: keyof IntlMessages[T],
      count: number,
      values?: Record<string, unknown>
    ) => {
      return t(key as string, { count, ...values });
    },
    
    // Rich text support
    rich: <K extends keyof IntlMessages[T]>(
      key: K,
      values?: Record<string, unknown>
    ) => {
      return t.rich(key as string, values);
    }
  };
}

// Type-safe key validation
export function isValidTranslationKey(key: string): key is TranslationKey {
  // This would be enhanced with runtime validation in development
  return typeof key === 'string' && key.includes('.');
}

// Dynamic key builder with type safety
export function buildTranslationKey<T extends keyof IntlMessages>(
  namespace: T,
  key: keyof IntlMessages[T]
): `${T}.${keyof IntlMessages[T] & string}` {
  return `${namespace}.${key as string}` as const;
}

// Interpolation helper with type safety
export function interpolateTranslation(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{([^}]+)\}/g, (match, key) => {
    const value = values[key];
    return value !== undefined ? String(value) : match;
  });
}

// Format number with locale
export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

// Format date with locale
export function formatDate(
  value: Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, options).format(value);
}

// Format relative time
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: string,
  options?: Intl.RelativeTimeFormatOptions
): string {
  return new Intl.RelativeTimeFormat(locale, options).format(value, unit);
}

// Currency formatting
export function formatCurrency(
  value: number,
  locale: string,
  currency: string
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
}

// List formatting
export function formatList(
  items: string[],
  locale: string,
  options?: Intl.ListFormatOptions
): string {
  return new Intl.ListFormat(locale, options).format(items);
}

// Common pluralization patterns for German
export const germanPlurals = {
  items: (count: number) => getGermanPlural(count, {
    zero: 'keine Artikel',
    one: 'ein Artikel',
    other: `${count} Artikel`
  }),
  
  files: (count: number) => getGermanPlural(count, {
    zero: 'keine Dateien',
    one: 'eine Datei',
    other: `${count} Dateien`
  }),
  
  users: (count: number) => getGermanPlural(count, {
    zero: 'keine Benutzer',
    one: 'ein Benutzer',
    other: `${count} Benutzer`
  }),
  
  messages: (count: number) => getGermanPlural(count, {
    zero: 'keine Nachrichten',
    one: 'eine Nachricht',
    other: `${count} Nachrichten`
  })
};

// Common pluralization patterns for English
export const englishPlurals = {
  items: (count: number) => getEnglishPlural(count, {
    zero: 'no items',
    one: 'one item',
    other: `${count} items`
  }),
  
  files: (count: number) => getEnglishPlural(count, {
    zero: 'no files',
    one: 'one file',
    other: `${count} files`
  }),
  
  users: (count: number) => getEnglishPlural(count, {
    zero: 'no users',
    one: 'one user',
    other: `${count} users`
  }),
  
  messages: (count: number) => getEnglishPlural(count, {
    zero: 'no messages',
    one: 'one message',
    other: `${count} messages`
  })
};

// Error handling for missing translations
export class TranslationError extends Error {
  constructor(
    public key: string,
    public namespace: string,
    public locale: string
  ) {
    super(`Missing translation: ${namespace}.${key} for locale ${locale}`);
    this.name = 'TranslationError';
  }
}

// Development-only validation
export function validateTranslationInDev(
  key: string,
  namespace: string,
  locale: string
): void {
  if (process.env.NODE_ENV === 'development') {
    // This would be enhanced with runtime validation
    if (!isValidTranslationKey(`${namespace}.${key}`)) {
      console.warn(`⚠️ Invalid translation key: ${namespace}.${key}`);
    }
  }
}