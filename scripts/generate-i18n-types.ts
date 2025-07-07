#!/usr/bin/env node
/**
 * Script to generate TypeScript types from internationalization message files
 * Provides type safety, autocompletion, and validation for translation keys
 */

import fs from 'fs';
import path from 'path';

interface MessageObject {
  [key: string]: string | MessageObject;
}

interface TranslationStats {
  totalKeys: number;
  missingKeys: string[];
  extraKeys: string[];
  locale: string;
}

class I18nTypeGenerator {
  private messagesDir: string;
  private outputDir: string;
  private locales: string[];
  private baseLocale: string;

  constructor(messagesDir: string, outputDir: string, baseLocale: string = 'de') {
    this.messagesDir = messagesDir;
    this.outputDir = outputDir;
    this.baseLocale = baseLocale;
    this.locales = this.getAvailableLocales();
  }

  private getAvailableLocales(): string[] {
    try {
      const files = fs.readdirSync(this.messagesDir);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    } catch (error) {
      console.error('Error reading messages directory:', error);
      return [];
    }
  }

  private loadMessages(locale: string): MessageObject {
    const filePath = path.join(this.messagesDir, `${locale}.json`);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error loading messages for locale ${locale}:`, error);
      return {};
    }
  }

  private flattenObject(obj: MessageObject, prefix: string = ''): string[] {
    const keys: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string') {
        keys.push(fullKey);
      } else if (typeof value === 'object' && value !== null) {
        keys.push(...this.flattenObject(value, fullKey));
      }
    }
    
    return keys;
  }

  private generateKeyPaths(obj: MessageObject, prefix: string = ''): string[] {
    const paths: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string') {
        paths.push(`"${fullKey}"`);
      } else if (typeof value === 'object' && value !== null) {
        paths.push(...this.generateKeyPaths(value, fullKey));
      }
    }
    
    return paths;
  }

  private generateNamespaceType(obj: MessageObject): string {
    const generateNestedType = (obj: MessageObject, indent: string = '  '): string => {
      const entries = Object.entries(obj).map(([key, value]) => {
        if (typeof value === 'string') {
          return `${indent}${key}: string;`;
        } else if (typeof value === 'object' && value !== null) {
          return `${indent}${key}: {\n${generateNestedType(value, indent + '  ')}\n${indent}};`;
        }
        return '';
      }).filter(Boolean);
      
      return entries.join('\n');
    };

    return `{\n${generateNestedType(obj)}\n}`;
  }

  private validateTranslations(): TranslationStats[] {
    const baseMessages = this.loadMessages(this.baseLocale);
    const baseKeys = this.flattenObject(baseMessages);
    const stats: TranslationStats[] = [];

    for (const locale of this.locales) {
      const messages = this.loadMessages(locale);
      const keys = this.flattenObject(messages);
      
      const missingKeys = baseKeys.filter(key => !keys.includes(key));
      const extraKeys = keys.filter(key => !baseKeys.includes(key));
      
      stats.push({
        locale,
        totalKeys: keys.length,
        missingKeys,
        extraKeys
      });
    }

    return stats;
  }

  public generateTypes(): void {
    console.log('🚀 Generating i18n TypeScript types...');
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // Load base messages for type generation
    const baseMessages = this.loadMessages(this.baseLocale);
    const allKeys = this.generateKeyPaths(baseMessages);
    const namespaceType = this.generateNamespaceType(baseMessages);

    // Generate main types file
    const typesContent = `// Auto-generated file - do not edit manually
// Generated at: ${new Date().toISOString()}
// Base locale: ${this.baseLocale}

declare namespace Intl {
  interface Messages extends Record<string, unknown> {
${this.generateNamespaceType(baseMessages).slice(2, -2)} // Remove outer braces
  }
}

// Union type of all available translation keys
export type TranslationKey = ${allKeys.join(' | ')};

// Type-safe translation key validation
export type ValidateTranslationKey<T extends string> = T extends TranslationKey ? T : never;

// Helper type for nested key access
export type NestedKeyOf<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? K extends string
      ? \`\${K}.\${NestedKeyOf<T[K]>}\`
      : never
    : K extends string
    ? K
    : never;
}[keyof T];

// Translation namespace type
export type TranslationNamespace = ${namespaceType};

// Available locales
export type Locale = ${this.locales.map(locale => `"${locale}"`).join(' | ')};

// Type-safe useTranslations hook
export interface TypedUseTranslations {
  <T extends TranslationKey>(key: T): string;
  <T extends keyof TranslationNamespace>(namespace: T): {
    [K in keyof TranslationNamespace[T]]: TranslationNamespace[T][K] extends Record<string, unknown>
      ? TypedUseTranslations
      : string;
  };
}

// Export for module augmentation
export {};
`;

    // Write types file
    const typesPath = path.join(this.outputDir, 'i18n-types.ts');
    fs.writeFileSync(typesPath, typesContent);

    // Generate validation results
    const validationStats = this.validateTranslations();
    const validationContent = `// Auto-generated translation validation report
// Generated at: ${new Date().toISOString()}

export interface TranslationValidationReport {
  locale: string;
  totalKeys: number;
  missingKeys: string[];
  extraKeys: string[];
  isValid: boolean;
}

export const translationValidationReport: TranslationValidationReport[] = ${JSON.stringify(
      validationStats.map(stat => ({
        ...stat,
        isValid: stat.missingKeys.length === 0
      })), 
      null, 
      2
    )};

// Summary
export const translationSummary = {
  totalLocales: ${this.locales.length},
  baseLocale: "${this.baseLocale}",
  totalKeys: ${this.flattenObject(baseMessages).length},
  localesWithMissingKeys: ${validationStats.filter(s => s.missingKeys.length > 0).length},
  localesWithExtraKeys: ${validationStats.filter(s => s.extraKeys.length > 0).length},
  lastGenerated: "${new Date().toISOString()}"
};
`;

    const validationPath = path.join(this.outputDir, 'validation-report.ts');
    fs.writeFileSync(validationPath, validationContent);

    // Create index file
    const indexContent = `// Auto-generated i18n types index
export * from './i18n-types';
export * from './validation-report';
`;

    const indexPath = path.join(this.outputDir, 'index.ts');
    fs.writeFileSync(indexPath, indexContent);

    console.log('✅ TypeScript types generated successfully!');
    console.log(`   📁 Output directory: ${this.outputDir}`);
    console.log(`   📄 Generated files:`);
    console.log(`      - i18n-types.ts (${allKeys.length} translation keys)`);
    console.log(`      - validation-report.ts`);
    console.log(`      - index.ts`);
    
    // Log validation summary
    console.log('\n📊 Translation Validation Summary:');
    validationStats.forEach(stat => {
      const status = stat.missingKeys.length === 0 ? '✅' : '❌';
      console.log(`   ${status} ${stat.locale}: ${stat.totalKeys} keys${stat.missingKeys.length > 0 ? ` (${stat.missingKeys.length} missing)` : ''}`);
    });

    // Log warnings if any
    const hasIssues = validationStats.some(stat => stat.missingKeys.length > 0 || stat.extraKeys.length > 0);
    if (hasIssues) {
      console.log('\n⚠️  Translation Issues Found:');
      validationStats.forEach(stat => {
        if (stat.missingKeys.length > 0) {
          console.log(`   Missing keys in ${stat.locale}:`, stat.missingKeys.slice(0, 5).join(', '));
          if (stat.missingKeys.length > 5) {
            console.log(`     ... and ${stat.missingKeys.length - 5} more`);
          }
        }
        if (stat.extraKeys.length > 0) {
          console.log(`   Extra keys in ${stat.locale}:`, stat.extraKeys.slice(0, 5).join(', '));
          if (stat.extraKeys.length > 5) {
            console.log(`     ... and ${stat.extraKeys.length - 5} more`);
          }
        }
      });
    }
  }
}

// Main execution
const messagesDir = path.join(process.cwd(), 'messages');
const outputDir = path.join(process.cwd(), 'src', 'types', 'i18n');

const generator = new I18nTypeGenerator(messagesDir, outputDir, 'de');
generator.generateTypes();