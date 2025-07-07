#!/usr/bin/env node
/**
 * Script to find unused translation keys in the codebase
 * Scans TypeScript/JavaScript files for translation key usage
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface UnusedTranslationResult {
  totalKeys: number;
  usedKeys: number;
  unusedKeys: string[];
  suspiciousKeys: string[];
  dynamicKeys: string[];
  report: string;
}

interface MessageObject {
  [key: string]: string | MessageObject;
}

interface KeyUsage {
  key: string;
  file: string;
  line: number;
  context: string;
}

class UnusedTranslationFinder {
  private messagesDir: string;
  private sourceDir: string;
  private baseLocale: string;
  private excludePatterns: string[];
  private includePatterns: string[];

  constructor(
    messagesDir: string,
    sourceDir: string,
    baseLocale: string = 'de',
    excludePatterns: string[] = ['node_modules', '.next', '.git', 'dist', 'build'],
    includePatterns: string[] = ['**/*.{ts,tsx,js,jsx}']
  ) {
    this.messagesDir = messagesDir;
    this.sourceDir = sourceDir;
    this.baseLocale = baseLocale;
    this.excludePatterns = excludePatterns;
    this.includePatterns = includePatterns;
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

  private async getSourceFiles(): Promise<string[]> {
    const files: string[] = [];
    
    for (const pattern of this.includePatterns) {
      const globPattern = path.join(this.sourceDir, pattern);
      try {
        const matchedFiles = await glob(globPattern, {
          ignore: this.excludePatterns.map(p => path.join(this.sourceDir, p, '**'))
        } as any);
        if (Array.isArray(matchedFiles)) {
          files.push(...matchedFiles);
        }
      } catch (error) {
        console.warn(`Warning: Could not glob pattern ${globPattern}:`, error);
      }
    }
    
    return [...new Set(files)]; // Remove duplicates
  }

  private findKeyUsages(content: string, filePath: string): KeyUsage[] {
    const usages: KeyUsage[] = [];
    const lines = content.split('\n');
    
    // Patterns to match translation key usage
    const patterns = [
      // useTranslations("namespace")("key")
      /useTranslations\s*\(\s*['"]([\w.]+)['"]\s*\)\s*\(\s*['"]([\w.]+)['"]\s*\)/g,
      // t("key")
      /\bt\s*\(\s*['"]([\w.]+)['"]\s*\)/g,
      // getTranslations("namespace")("key")
      /getTranslations\s*\(\s*['"]([\w.]+)['"]\s*\)\s*\(\s*['"]([\w.]+)['"]\s*\)/g,
      // Direct key references in strings
      /['"]([\w.]+(?:\.[\w.]+)+)['"]/g,
      // Dynamic key construction
      /['"]([\w.]+)\$\{[^}]+\}([\w.]*)['"]/g,
      // Template literal keys
      /`([\w.]+(?:\.[\w.]+)*)`/g
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const fullMatch = match[0];
        const key = match[1] + (match[2] ? `.${match[2]}` : '');
        const lineIndex = content.substring(0, match.index).split('\n').length - 1;
        const line = lines[lineIndex];
        
        usages.push({
          key,
          file: filePath,
          line: lineIndex + 1,
          context: line.trim()
        });
      }
    });

    return usages;
  }

  private findDynamicKeys(content: string): string[] {
    const dynamicKeys: string[] = [];
    
    // Look for dynamic key patterns
    const patterns = [
      // Template literals with variables
      /`([^`]*\$\{[^}]+\}[^`]*)`/g,
      // String concatenation
      /['"]([\w.]+)['"]\s*\+\s*[\w.]+/g,
      // Variable-based keys
      /\bt\s*\(\s*(\w+)\s*\)/g
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        dynamicKeys.push(match[1]);
      }
    });

    return dynamicKeys;
  }

  private isKeyLikelyUsed(key: string, dynamicKeys: string[]): boolean {
    // Check if key might be used dynamically
    const keyParts = key.split('.');
    
    for (const dynamicKey of dynamicKeys) {
      // Check if any part of the key matches a dynamic pattern
      if (dynamicKey.includes(keyParts[0]) || 
          keyParts.some(part => dynamicKey.includes(part))) {
        return true;
      }
    }
    
    return false;
  }

  private generateNamespaceKeys(allKeys: string[]): string[] {
    const namespaces = new Set<string>();
    
    allKeys.forEach(key => {
      const parts = key.split('.');
      for (let i = 1; i < parts.length; i++) {
        namespaces.add(parts.slice(0, i).join('.'));
      }
    });
    
    return Array.from(namespaces);
  }

  public async findUnusedKeys(): Promise<UnusedTranslationResult> {
    console.log('🔍 Finding unused translation keys...');
    console.log(`📁 Messages directory: ${this.messagesDir}`);
    console.log(`📁 Source directory: ${this.sourceDir}`);
    console.log(`🌐 Base locale: ${this.baseLocale}`);
    console.log('');

    // Load all translation keys
    const baseMessages = this.loadMessages(this.baseLocale);
    const allKeys = this.flattenObject(baseMessages);
    const namespaceKeys = this.generateNamespaceKeys(allKeys);
    const allKeysWithNamespaces = [...allKeys, ...namespaceKeys];

    console.log(`📋 Total translation keys: ${allKeys.length}`);
    console.log(`📋 Total keys with namespaces: ${allKeysWithNamespaces.length}`);

    // Get all source files
    const sourceFiles = await this.getSourceFiles();
    console.log(`📁 Source files to scan: ${sourceFiles.length}`);

    // Find key usages
    const allUsages: KeyUsage[] = [];
    const allDynamicKeys: string[] = [];
    
    for (const filePath of sourceFiles) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const usages = this.findKeyUsages(content, filePath);
        const dynamicKeys = this.findDynamicKeys(content);
        
        allUsages.push(...usages);
        allDynamicKeys.push(...dynamicKeys);
      } catch (error) {
        console.warn(`⚠️ Warning: Could not read file ${filePath}:`, error);
      }
    }

    // Extract used keys
    const usedKeys = new Set(allUsages.map(usage => usage.key));
    console.log(`📊 Keys found in code: ${usedKeys.size}`);

    // Find unused keys
    const unusedKeys = allKeys.filter(key => !usedKeys.has(key));
    const suspiciousKeys = unusedKeys.filter(key => 
      this.isKeyLikelyUsed(key, allDynamicKeys)
    );

    console.log(`📊 Unused keys: ${unusedKeys.length}`);
    console.log(`📊 Suspicious keys (possibly dynamic): ${suspiciousKeys.length}`);

    // Generate report
    const report = this.generateReport(
      allKeys,
      usedKeys,
      unusedKeys,
      suspiciousKeys,
      allDynamicKeys,
      allUsages
    );

    return {
      totalKeys: allKeys.length,
      usedKeys: usedKeys.size,
      unusedKeys: unusedKeys.filter(key => !suspiciousKeys.includes(key)),
      suspiciousKeys,
      dynamicKeys: allDynamicKeys,
      report
    };
  }

  private generateReport(
    allKeys: string[],
    usedKeys: Set<string>,
    unusedKeys: string[],
    suspiciousKeys: string[],
    dynamicKeys: string[],
    allUsages: KeyUsage[]
  ): string {
    let report = '';
    report += '# Unused Translation Keys Report\n\n';
    report += `**Generated:** ${new Date().toISOString()}\n`;
    report += `**Base Locale:** ${this.baseLocale}\n`;
    report += `**Source Directory:** ${this.sourceDir}\n\n`;
    
    report += '## Summary\n\n';
    report += `- **Total Keys:** ${allKeys.length}\n`;
    report += `- **Used Keys:** ${usedKeys.size}\n`;
    report += `- **Unused Keys:** ${unusedKeys.length}\n`;
    report += `- **Suspicious Keys:** ${suspiciousKeys.length}\n`;
    report += `- **Usage Rate:** ${((usedKeys.size / allKeys.length) * 100).toFixed(1)}%\n\n`;

    if (unusedKeys.length > 0) {
      report += '## Unused Keys\n\n';
      report += '*Keys that appear to be completely unused:*\n\n';
      unusedKeys
        .filter(key => !suspiciousKeys.includes(key))
        .forEach(key => {
          report += `- \`${key}\`\n`;
        });
      report += '\n';
    }

    if (suspiciousKeys.length > 0) {
      report += '## Suspicious Keys\n\n';
      report += '*Keys that might be used dynamically (review manually):*\n\n';
      suspiciousKeys.forEach(key => {
        report += `- \`${key}\`\n`;
      });
      report += '\n';
    }

    if (dynamicKeys.length > 0) {
      report += '## Dynamic Key Patterns\n\n';
      report += '*Patterns that suggest dynamic key usage:*\n\n';
      [...new Set(dynamicKeys)].forEach(pattern => {
        report += `- \`${pattern}\`\n`;
      });
      report += '\n';
    }

    // Most used keys
    const keyUsageCount = new Map<string, number>();
    allUsages.forEach(usage => {
      keyUsageCount.set(usage.key, (keyUsageCount.get(usage.key) || 0) + 1);
    });

    const mostUsedKeys = Array.from(keyUsageCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    if (mostUsedKeys.length > 0) {
      report += '## Most Used Keys\n\n';
      mostUsedKeys.forEach(([key, count]) => {
        report += `- \`${key}\` (${count} usages)\n`;
      });
      report += '\n';
    }

    return report;
  }
}

// Main execution
const messagesDir = path.join(process.cwd(), 'messages');
const sourceDir = path.join(process.cwd(), 'src');
const baseLocale = 'de';

const finder = new UnusedTranslationFinder(messagesDir, sourceDir, baseLocale);

finder.findUnusedKeys().then(result => {
  console.log('\n📊 Final Results:');
  console.log(`   Total Keys: ${result.totalKeys}`);
  console.log(`   Used Keys: ${result.usedKeys}`);
  console.log(`   Unused Keys: ${result.unusedKeys.length}`);
  console.log(`   Suspicious Keys: ${result.suspiciousKeys.length}`);
  console.log(`   Usage Rate: ${((result.usedKeys / result.totalKeys) * 100).toFixed(1)}%`);

  if (result.unusedKeys.length > 0) {
    console.log('\n🗑️ Unused Keys Found:');
    result.unusedKeys.slice(0, 10).forEach(key => {
      console.log(`   - ${key}`);
    });
    if (result.unusedKeys.length > 10) {
      console.log(`   ... and ${result.unusedKeys.length - 10} more`);
    }
  }

  if (result.suspiciousKeys.length > 0) {
    console.log('\n🤔 Suspicious Keys (may be dynamic):');
    result.suspiciousKeys.slice(0, 5).forEach(key => {
      console.log(`   - ${key}`);
    });
    if (result.suspiciousKeys.length > 5) {
      console.log(`   ... and ${result.suspiciousKeys.length - 5} more`);
    }
  }

  // Save report
  const reportPath = path.join(process.cwd(), 'unused-translations-report.md');
  fs.writeFileSync(reportPath, result.report);
  console.log(`\n📄 Report saved to: ${reportPath}`);

  if (result.unusedKeys.length > 0) {
    console.log('\n💡 Recommendation: Review unused keys and remove them to keep translations clean.');
  }
  
  console.log('\n✅ Unused translation analysis complete!');
}).catch(error => {
  console.error('❌ Error during analysis:', error);
  process.exit(1);
});