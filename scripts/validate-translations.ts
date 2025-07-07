#!/usr/bin/env node
/**
 * Build-time translation validation script
 * Validates translation completeness and consistency across all locales
 */

import fs from 'fs';
import path from 'path';
import { exit } from 'process';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalLocales: number;
    totalKeys: number;
    missingTranslations: number;
    extraTranslations: number;
    inconsistentValues: number;
  };
}

interface MessageObject {
  [key: string]: string | MessageObject;
}

interface TranslationIssue {
  type: 'missing' | 'extra' | 'inconsistent';
  locale: string;
  key: string;
  details?: string;
}

class TranslationValidator {
  private messagesDir: string;
  private baseLocale: string;
  private locales: string[];
  private strictMode: boolean;

  constructor(messagesDir: string, baseLocale: string = 'de', strictMode: boolean = false) {
    this.messagesDir = messagesDir;
    this.baseLocale = baseLocale;
    this.strictMode = strictMode;
    this.locales = this.getAvailableLocales();
  }

  private getAvailableLocales(): string[] {
    try {
      const files = fs.readdirSync(this.messagesDir);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    } catch (error) {
      console.error('❌ Error reading messages directory:', error);
      return [];
    }
  }

  private loadMessages(locale: string): MessageObject {
    const filePath = path.join(this.messagesDir, `${locale}.json`);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`❌ Error loading messages for locale ${locale}:`, error);
      return {};
    }
  }

  private flattenObject(obj: MessageObject, prefix: string = ''): Record<string, string> {
    const flattened: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string') {
        flattened[fullKey] = value;
      } else if (typeof value === 'object' && value !== null) {
        Object.assign(flattened, this.flattenObject(value, fullKey));
      }
    }
    
    return flattened;
  }

  private validateLocale(locale: string, baseKeys: string[]): TranslationIssue[] {
    const issues: TranslationIssue[] = [];
    const messages = this.loadMessages(locale);
    const flattenedMessages = this.flattenObject(messages);
    const localeKeys = Object.keys(flattenedMessages);

    // Find missing keys
    const missingKeys = baseKeys.filter(key => !localeKeys.includes(key));
    missingKeys.forEach(key => {
      issues.push({
        type: 'missing',
        locale,
        key,
        details: `Translation missing for key: ${key}`
      });
    });

    // Find extra keys (only in strict mode)
    if (this.strictMode) {
      const extraKeys = localeKeys.filter(key => !baseKeys.includes(key));
      extraKeys.forEach(key => {
        issues.push({
          type: 'extra',
          locale,
          key,
          details: `Extra translation key not found in base locale: ${key}`
        });
      });
    }

    // Check for empty or placeholder values
    localeKeys.forEach(key => {
      const value = flattenedMessages[key];
      if (!value || value.trim() === '' || value === 'TODO' || value === 'PLACEHOLDER') {
        issues.push({
          type: 'inconsistent',
          locale,
          key,
          details: `Empty or placeholder value: "${value}"`
        });
      }
    });

    return issues;
  }

  private validatePluralization(): TranslationIssue[] {
    const issues: TranslationIssue[] = [];
    
    // Check for potential pluralization patterns
    const pluralPatterns = [
      /\b(\d+)\s+(item|file|user|message|error)s?\b/gi,
      /\b(no|one|few|many)\s+\w+s?\b/gi
    ];

    for (const locale of this.locales) {
      const messages = this.loadMessages(locale);
      const flattenedMessages = this.flattenObject(messages);

      Object.entries(flattenedMessages).forEach(([key, value]) => {
        pluralPatterns.forEach(pattern => {
          if (pattern.test(value)) {
            issues.push({
              type: 'inconsistent',
              locale,
              key,
              details: `Potential pluralization needed: "${value}"`
            });
          }
        });
      });
    }

    return issues;
  }

  private validateInterpolations(): TranslationIssue[] {
    const issues: TranslationIssue[] = [];
    
    // Check for interpolation consistency across locales
    const interpolationPattern = /\{([^}]+)\}/g;
    const baseMessages = this.loadMessages(this.baseLocale);
    const baseFlattenedMessages = this.flattenObject(baseMessages);

    Object.entries(baseFlattenedMessages).forEach(([key, baseValue]) => {
      const baseInterpolations = Array.from(baseValue.matchAll(interpolationPattern))
        .map(match => match[1])
        .sort();

      for (const locale of this.locales) {
        if (locale === this.baseLocale) continue;

        const messages = this.loadMessages(locale);
        const flattenedMessages = this.flattenObject(messages);
        const localeValue = flattenedMessages[key];

        if (localeValue) {
          const localeInterpolations = Array.from(localeValue.matchAll(interpolationPattern))
            .map(match => match[1])
            .sort();

          if (JSON.stringify(baseInterpolations) !== JSON.stringify(localeInterpolations)) {
            issues.push({
              type: 'inconsistent',
              locale,
              key,
              details: `Interpolation mismatch - Base: [${baseInterpolations.join(', ')}], Locale: [${localeInterpolations.join(', ')}]`
            });
          }
        }
      }
    });

    return issues;
  }

  public validate(): ValidationResult {
    console.log('🔍 Validating translations...');
    console.log(`📁 Messages directory: ${this.messagesDir}`);
    console.log(`🌐 Base locale: ${this.baseLocale}`);
    console.log(`📋 Available locales: ${this.locales.join(', ')}`);
    console.log(`⚡ Strict mode: ${this.strictMode ? 'ON' : 'OFF'}`);
    console.log('');

    const baseMessages = this.loadMessages(this.baseLocale);
    const baseKeys = Object.keys(this.flattenObject(baseMessages));
    
    const allIssues: TranslationIssue[] = [];

    // Validate each locale
    for (const locale of this.locales) {
      if (locale === this.baseLocale) continue;
      const localeIssues = this.validateLocale(locale, baseKeys);
      allIssues.push(...localeIssues);
    }

    // Validate pluralization
    const pluralizationIssues = this.validatePluralization();
    allIssues.push(...pluralizationIssues);

    // Validate interpolations
    const interpolationIssues = this.validateInterpolations();
    allIssues.push(...interpolationIssues);

    // Categorize issues
    const errors: string[] = [];
    const warnings: string[] = [];

    const missingIssues = allIssues.filter(issue => issue.type === 'missing');
    const extraIssues = allIssues.filter(issue => issue.type === 'extra');
    const inconsistentIssues = allIssues.filter(issue => issue.type === 'inconsistent');

    // Missing translations are always errors
    missingIssues.forEach(issue => {
      errors.push(`[${issue.locale}] Missing: ${issue.key}`);
    });

    // Extra translations are warnings unless in strict mode
    extraIssues.forEach(issue => {
      if (this.strictMode) {
        errors.push(`[${issue.locale}] Extra: ${issue.key}`);
      } else {
        warnings.push(`[${issue.locale}] Extra: ${issue.key}`);
      }
    });

    // Inconsistent translations are warnings
    inconsistentIssues.forEach(issue => {
      warnings.push(`[${issue.locale}] ${issue.details}`);
    });

    const summary = {
      totalLocales: this.locales.length,
      totalKeys: baseKeys.length,
      missingTranslations: missingIssues.length,
      extraTranslations: extraIssues.length,
      inconsistentValues: inconsistentIssues.length
    };

    const isValid = errors.length === 0;

    return {
      isValid,
      errors,
      warnings,
      summary
    };
  }

  public generateReport(): string {
    const result = this.validate();
    
    let report = '';
    report += '# Translation Validation Report\n\n';
    report += `**Generated:** ${new Date().toISOString()}\n`;
    report += `**Base Locale:** ${this.baseLocale}\n`;
    report += `**Strict Mode:** ${this.strictMode ? 'ON' : 'OFF'}\n\n`;
    
    report += '## Summary\n\n';
    report += `- **Total Locales:** ${result.summary.totalLocales}\n`;
    report += `- **Total Keys:** ${result.summary.totalKeys}\n`;
    report += `- **Missing Translations:** ${result.summary.missingTranslations}\n`;
    report += `- **Extra Translations:** ${result.summary.extraTranslations}\n`;
    report += `- **Inconsistent Values:** ${result.summary.inconsistentValues}\n`;
    report += `- **Status:** ${result.isValid ? '✅ VALID' : '❌ INVALID'}\n\n`;

    if (result.errors.length > 0) {
      report += '## Errors\n\n';
      result.errors.forEach(error => {
        report += `- ❌ ${error}\n`;
      });
      report += '\n';
    }

    if (result.warnings.length > 0) {
      report += '## Warnings\n\n';
      result.warnings.forEach(warning => {
        report += `- ⚠️ ${warning}\n`;
      });
      report += '\n';
    }

    return report;
  }
}

// Main execution
const messagesDir = path.join(process.cwd(), 'messages');
const baseLocale = 'de';
const strictMode = process.argv.includes('--strict');

const validator = new TranslationValidator(messagesDir, baseLocale, strictMode);
const result = validator.validate();

// Display results
console.log('📊 Validation Results:');
console.log(`   Total Locales: ${result.summary.totalLocales}`);
console.log(`   Total Keys: ${result.summary.totalKeys}`);
console.log(`   Missing Translations: ${result.summary.missingTranslations}`);
console.log(`   Extra Translations: ${result.summary.extraTranslations}`);
console.log(`   Inconsistent Values: ${result.summary.inconsistentValues}`);
console.log('');

if (result.errors.length > 0) {
  console.log('❌ Errors found:');
  result.errors.forEach(error => console.log(`   ${error}`));
  console.log('');
}

if (result.warnings.length > 0) {
  console.log('⚠️ Warnings found:');
  result.warnings.forEach(warning => console.log(`   ${warning}`));
  console.log('');
}

console.log(result.isValid ? '✅ All translations are valid!' : '❌ Translation validation failed!');

// Generate report file
const reportPath = path.join(process.cwd(), 'translation-validation-report.md');
fs.writeFileSync(reportPath, validator.generateReport());
console.log(`📄 Report saved to: ${reportPath}`);

// Exit with appropriate code
if (!result.isValid && strictMode) {
  console.log('🚨 Exiting with error code due to validation failures in strict mode');
  exit(1);
}

exit(0);