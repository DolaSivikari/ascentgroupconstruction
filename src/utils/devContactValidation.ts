/**
 * Development Mode Contact Information Validation
 * 
 * This utility runs only in development mode and logs warnings when
 * hardcoded contact information is detected in components.
 * 
 * Purpose: Help prevent future contact information inconsistencies
 */

const isDevelopment = import.meta.env.DEV;

// Patterns that indicate hardcoded contact information
const HARDCODED_PATTERNS = {
  phones: [
    /416[-\s]?555/gi,
    /\(416\)\s*555/gi,
    /647[-\s]?528[-\s]?6804/gi, // Our real phone shouldn't be hardcoded
    /\+1[-\s]?416[-\s]?555/gi,
    /tel:\+?1?416/gi,
  ],
  emails: [
    /info@ascengroup\.ca/gi,
    /info@ascentbuilders\.com/gi,
    /@ascengroup/gi,
  ],
  addresses: [
    /123\s+(construction|business)\s+way/gi,
    /M5H\s*2N2/gi,
    /M1M\s*1M1/gi,
  ],
  companyNames: [
    /ascen\s+group(?!\s+construction)/gi, // "Ascen Group" without "Construction"
  ]
};

interface ValidationWarning {
  type: 'phone' | 'email' | 'address' | 'companyName';
  pattern: string;
  context: string;
  suggestion: string;
}

/**
 * Scans a string for hardcoded contact information patterns
 */
export function scanForHardcodedValues(
  content: string,
  componentName: string
): ValidationWarning[] {
  if (!isDevelopment) return [];

  const warnings: ValidationWarning[] = [];

  // Check for hardcoded phones
  HARDCODED_PATTERNS.phones.forEach(pattern => {
    if (pattern.test(content)) {
      warnings.push({
        type: 'phone',
        pattern: pattern.source,
        context: `Component: ${componentName}`,
        suggestion: 'Use useCompanySettings() hook to get phone from database'
      });
    }
  });

  // Check for hardcoded emails
  HARDCODED_PATTERNS.emails.forEach(pattern => {
    if (pattern.test(content)) {
      warnings.push({
        type: 'email',
        pattern: pattern.source,
        context: `Component: ${componentName}`,
        suggestion: 'Use useCompanySettings() hook to get email from database'
      });
    }
  });

  // Check for hardcoded addresses
  HARDCODED_PATTERNS.addresses.forEach(pattern => {
    if (pattern.test(content)) {
      warnings.push({
        type: 'address',
        pattern: pattern.source,
        context: `Component: ${componentName}`,
        suggestion: 'Use useCompanySettings() hook to get address from database'
      });
    }
  });

  // Check for company name issues
  HARDCODED_PATTERNS.companyNames.forEach(pattern => {
    if (pattern.test(content)) {
      warnings.push({
        type: 'companyName',
        pattern: pattern.source,
        context: `Component: ${componentName}`,
        suggestion: 'Fix typo: "Ascen" should be "Ascent". Use useCompanySettings() for company name.'
      });
    }
  });

  return warnings;
}

/**
 * Logs validation warnings to console
 */
export function logContactValidationWarnings(warnings: ValidationWarning[]): void {
  if (!isDevelopment || warnings.length === 0) return;

  console.groupCollapsed(
    `%c⚠️ Contact Validation: ${warnings.length} hardcoded value(s) detected`,
    'color: #f59e0b; font-weight: bold; font-size: 12px;'
  );

  warnings.forEach((warning, index) => {
    console.group(`${index + 1}. ${warning.type.toUpperCase()} - ${warning.context}`);
    console.log('%cPattern:', 'font-weight: bold;', warning.pattern);
    console.log('%cSuggestion:', 'color: #10b981; font-weight: bold;', warning.suggestion);
    console.groupEnd();
  });

  console.log(
    '%cℹ️ To fix these warnings, use the useCompanySettings hook:',
    'color: #3b82f6; font-weight: bold;'
  );
  console.log(`
import { useCompanySettings } from '@/hooks/useCompanySettings';

const MyComponent = () => {
  const { settings } = useCompanySettings();
  
  // Use settings.phone, settings.email, settings.address, etc.
  return <a href={\`tel:\${settings.phone}\`}>{settings.phone}</a>;
};
  `);

  console.groupEnd();
}

/**
 * Validates component props for hardcoded contact information
 */
export function validateComponentProps(
  componentName: string,
  props: Record<string, any>
): void {
  if (!isDevelopment) return;

  const propsString = JSON.stringify(props);
  const warnings = scanForHardcodedValues(propsString, componentName);
  
  if (warnings.length > 0) {
    logContactValidationWarnings(warnings);
  }
}

/**
 * React Hook to validate component for hardcoded values on mount
 */
export function useContactValidation(componentName: string, dependencies: any[] = []): void {
  if (!isDevelopment) return;

  // In development, check for hardcoded values in the component's dependencies
  const depsString = JSON.stringify(dependencies);
  const warnings = scanForHardcodedValues(depsString, componentName);
  
  if (warnings.length > 0) {
    logContactValidationWarnings(warnings);
  }
}

/**
 * Validates entire component tree (for testing)
 */
export function validateContactInfo(
  html: string,
  componentName: string = 'Unknown'
): boolean {
  if (!isDevelopment) return true;

  const warnings = scanForHardcodedValues(html, componentName);
  
  if (warnings.length > 0) {
    logContactValidationWarnings(warnings);
    return false;
  }

  return true;
}
