/**
 * Development-only runtime validation for i18n
 * Provides helpful error messages and validation during development
 */

import { translationValidationReport } from '@/types/i18n';

// Development validation state
let validationCache: Map<string, boolean> = new Map();
let missingKeysSet: Set<string> = new Set();
let reportedErrors: Set<string> = new Set();

// Initialize validation data
function initializeValidation() {
  if (process.env.NODE_ENV === 'development') {
    // Load validation report and cache missing keys
    translationValidationReport.forEach(report => {
      report.missingKeys.forEach(key => {
        missingKeysSet.add(`${report.locale}:${key}`);
      });
    });
  }
}

// Call initialization
initializeValidation();

// Validation levels
export enum ValidationLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

// Validation configuration
export interface ValidationConfig {
  level: ValidationLevel;
  logMissingKeys: boolean;
  logUnusedKeys: boolean;
  logInterpolationErrors: boolean;
  logPluralizationIssues: boolean;
  throwOnMissingKeys: boolean;
  enableStackTrace: boolean;
}

// Default configuration
const defaultConfig: ValidationConfig = {
  level: ValidationLevel.WARN,
  logMissingKeys: true,
  logUnusedKeys: false,
  logInterpolationErrors: true,
  logPluralizationIssues: true,
  throwOnMissingKeys: false,
  enableStackTrace: false
};

// Current configuration
let currentConfig: ValidationConfig = { ...defaultConfig };

// Configure validation
export function configureI18nValidation(config: Partial<ValidationConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

// Reset validation state
export function resetValidationState(): void {
  validationCache.clear();
  reportedErrors.clear();
}

// Get validation statistics
export function getValidationStats(): {
  totalValidations: number;
  missingKeys: number;
  reportedErrors: number;
  cacheHits: number;
} {
  return {
    totalValidations: validationCache.size,
    missingKeys: missingKeysSet.size,
    reportedErrors: reportedErrors.size,
    cacheHits: validationCache.size
  };
}

// Log validation message
function logValidationMessage(
  level: ValidationLevel,
  message: string,
  key?: string,
  namespace?: string,
  locale?: string
): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  const prefix = `[i18n-validation]`;
  const context = key && namespace ? ` ${namespace}.${key}` : '';
  const localeInfo = locale ? ` (${locale})` : '';
  const fullMessage = `${prefix}${context}${localeInfo}: ${message}`;
  
  switch (level) {
    case ValidationLevel.ERROR:
      console.error(fullMessage);
      break;
    case ValidationLevel.WARN:
      console.warn(fullMessage);
      break;
    case ValidationLevel.INFO:
      console.info(fullMessage);
      break;
    case ValidationLevel.DEBUG:
      console.debug(fullMessage);
      break;
  }
  
  if (currentConfig.enableStackTrace && level === ValidationLevel.ERROR) {
    console.trace('Stack trace:');
  }
}

// Validate translation key exists
export function validateTranslationKey(
  key: string,
  namespace: string,
  locale: string
): boolean {
  if (process.env.NODE_ENV !== 'development') return true;
  
  const fullKey = `${namespace}.${key}`;
  const cacheKey = `${locale}:${fullKey}`;
  
  // Check cache first
  if (validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey)!;
  }
  
  // Check if key is missing
  const isMissing = missingKeysSet.has(cacheKey);
  
  if (isMissing && currentConfig.logMissingKeys) {
    const errorKey = `missing:${cacheKey}`;
    if (!reportedErrors.has(errorKey)) {
      logValidationMessage(
        ValidationLevel.ERROR,
        `Missing translation key`,
        key,
        namespace,
        locale
      );
      reportedErrors.add(errorKey);
      
      if (currentConfig.throwOnMissingKeys) {
        throw new Error(`Missing translation: ${fullKey} for locale ${locale}`);
      }
    }
  }
  
  // Cache result
  validationCache.set(cacheKey, !isMissing);
  return !isMissing;
}

// Validate interpolation parameters
export function validateInterpolationParams(
  template: string,
  params: Record<string, unknown>,
  key: string,
  namespace: string
): boolean {
  if (process.env.NODE_ENV !== 'development') return true;
  
  if (!currentConfig.logInterpolationErrors) return true;
  
  // Extract required parameters from template
  const requiredParams = new Set<string>();
  const paramRegex = /\{([^}]+)\}/g;
  let match;
  
  while ((match = paramRegex.exec(template)) !== null) {
    requiredParams.add(match[1]);
  }
  
  // Check for missing parameters
  const providedParams = new Set(Object.keys(params));
  const missingParams = Array.from(requiredParams).filter(
    param => !providedParams.has(param)
  );
  
  if (missingParams.length > 0) {
    logValidationMessage(
      ValidationLevel.WARN,
      `Missing interpolation parameters: ${missingParams.join(', ')}`,
      key,
      namespace
    );
    return false;
  }
  
  // Check for extra parameters
  const extraParams = Array.from(providedParams).filter(
    param => !requiredParams.has(param)
  );
  
  if (extraParams.length > 0) {
    logValidationMessage(
      ValidationLevel.INFO,
      `Extra interpolation parameters: ${extraParams.join(', ')}`,
      key,
      namespace
    );
  }
  
  return true;
}

// Validate pluralization
export function validatePluralization(
  count: number,
  template: string,
  key: string,
  namespace: string
): boolean {
  if (process.env.NODE_ENV !== 'development') return true;
  
  if (!currentConfig.logPluralizationIssues) return true;
  
  // Check if template looks like it should handle pluralization
  const hasPluralizationPattern = /\{count\}/.test(template);
  const hasSelectPattern = /\{count,\s*select/.test(template);
  const hasPluralPattern = /\{count,\s*plural/.test(template);
  
  if (hasPluralizationPattern && !hasSelectPattern && !hasPluralPattern) {
    logValidationMessage(
      ValidationLevel.WARN,
      `Potential pluralization issue: template contains {count} but no plural/select syntax`,
      key,
      namespace
    );
    return false;
  }
  
  return true;
}

// Validate namespace usage
export function validateNamespace(namespace: string): boolean {
  if (process.env.NODE_ENV !== 'development') return true;
  
  // Check if namespace follows naming conventions
  const validNamespacePattern = /^[A-Z][a-zA-Z0-9]*(?:\.[A-Z][a-zA-Z0-9]*)*$/;
  
  if (!validNamespacePattern.test(namespace)) {
    logValidationMessage(
      ValidationLevel.WARN,
      `Namespace '${namespace}' doesn't follow naming conventions (should be PascalCase)`
    );
    return false;
  }
  
  return true;
}

// Enhanced useTranslations hook with validation
export function useValidatedTranslations(namespace: string) {
  if (process.env.NODE_ENV === 'development') {
    validateNamespace(namespace);
  }
  
  // This would be used to wrap the actual useTranslations hook
  // returning validation-enhanced version
  return {
    t: (key: string, params?: Record<string, unknown>) => {
      if (process.env.NODE_ENV === 'development') {
        validateTranslationKey(key, namespace, 'current-locale');
        
        if (params) {
          // We would need access to the actual template to validate interpolation
          // This is a placeholder for the validation logic
          console.debug(`[i18n-validation] Translation called: ${namespace}.${key}`);
        }
      }
      
      // Return actual translation result
      return `${namespace}.${key}`;
    }
  };
}

// Performance monitoring
export function measureTranslationPerformance<T>(
  operation: () => T,
  key: string,
  namespace: string
): T {
  if (process.env.NODE_ENV !== 'development') {
    return operation();
  }
  
  const start = performance.now();
  const result = operation();
  const end = performance.now();
  const duration = end - start;
  
  if (duration > 10) { // Log slow translations (> 10ms)
    logValidationMessage(
      ValidationLevel.DEBUG,
      `Slow translation detected: ${duration.toFixed(2)}ms`,
      key,
      namespace
    );
  }
  
  return result;
}

// Development helper: List all available keys for a namespace
export function getAvailableKeys(): string[] {
  if (process.env.NODE_ENV !== 'development') return [];
  
  // This would be populated from the validation report
  // For now, return a placeholder
  return ['placeholder'];
}

// Development helper: Get translation statistics
export function getTranslationStatistics(): {
  totalKeys: number;
  missingKeys: number;
  locales: string[];
  coverage: Record<string, number>;
} {
  if (process.env.NODE_ENV !== 'development') {
    return {
      totalKeys: 0,
      missingKeys: 0,
      locales: [],
      coverage: {}
    };
  }
  
  const coverage: Record<string, number> = {};
  
  translationValidationReport.forEach(report => {
    const missingPercent = (report.missingKeys.length / report.totalKeys) * 100;
    coverage[report.locale] = 100 - missingPercent;
  });
  
  return {
    totalKeys: translationValidationReport[0]?.totalKeys || 0,
    missingKeys: translationValidationReport.reduce(
      (sum, report) => sum + report.missingKeys.length,
      0
    ),
    locales: translationValidationReport.map(report => report.locale),
    coverage
  };
}

// Development helper: Export validation report
export function exportValidationReport(): string {
  if (process.env.NODE_ENV !== 'development') return '';
  
  const stats = getTranslationStatistics();
  const validationStats = getValidationStats();
  
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    translationStats: stats,
    validationStats,
    config: currentConfig
  }, null, 2);
}

// Cleanup function
export function cleanupValidation(): void {
  validationCache.clear();
  missingKeysSet.clear();
  reportedErrors.clear();
}