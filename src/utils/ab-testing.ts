// A/B Testing Framework
interface ABTest {
  id: string;
  name: string;
  variants: string[];
  activeVariant?: string;
}

interface ABTestResult {
  testId: string;
  variant: string;
  converted: boolean;
  timestamp: Date;
}

class ABTestingFramework {
  private tests: Map<string, ABTest> = new Map();
  private results: ABTestResult[] = [];

  /**
   * Create a new A/B test
   */
  createTest(test: ABTest): void {
    this.tests.set(test.id, test);
  }

  /**
   * Get variant for a user (uses localStorage for persistence)
   */
  getVariant(testId: string): string {
    const test = this.tests.get(testId);
    if (!test) {
      console.warn(`Test ${testId} not found`);
      return 'control';
    }

    // Check if user already has a variant assigned
    const storageKey = `ab_test_${testId}`;
    const storedVariant = localStorage.getItem(storageKey);
    
    if (storedVariant && test.variants.includes(storedVariant)) {
      return storedVariant;
    }

    // Assign random variant
    const variant = test.variants[Math.floor(Math.random() * test.variants.length)];
    localStorage.setItem(storageKey, variant);
    
    // Track assignment
    this.trackEvent(testId, variant, 'assigned');
    
    return variant;
  }

  /**
   * Track conversion for a test
   */
  trackConversion(testId: string): void {
    const storageKey = `ab_test_${testId}`;
    const variant = localStorage.getItem(storageKey) || 'control';
    
    const result: ABTestResult = {
      testId,
      variant,
      converted: true,
      timestamp: new Date(),
    };
    
    this.results.push(result);
    this.trackEvent(testId, variant, 'converted');
  }

  /**
   * Track any event for analytics
   */
  private trackEvent(testId: string, variant: string, action: string): void {
    // Send to analytics platform (Google Analytics, Mixpanel, etc.)
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'ab_test_event',
        test_id: testId,
        variant: variant,
        action: action,
      });
    }
  }

  /**
   * Get results for a specific test
   */
  getResults(testId: string): ABTestResult[] {
    return this.results.filter(r => r.testId === testId);
  }

  /**
   * Calculate conversion rate for each variant
   */
  getConversionRates(testId: string): Record<string, number> {
    const results = this.getResults(testId);
    const variantCounts: Record<string, { total: number; converted: number }> = {};

    results.forEach(result => {
      if (!variantCounts[result.variant]) {
        variantCounts[result.variant] = { total: 0, converted: 0 };
      }
      variantCounts[result.variant].total++;
      if (result.converted) {
        variantCounts[result.variant].converted++;
      }
    });

    const rates: Record<string, number> = {};
    Object.entries(variantCounts).forEach(([variant, counts]) => {
      rates[variant] = counts.total > 0 ? counts.converted / counts.total : 0;
    });

    return rates;
  }
}

// Export singleton instance
export const abTesting = new ABTestingFramework();

// Example test definitions
export const initializeTests = () => {
  abTesting.createTest({
    id: 'hero_headline',
    name: 'Hero Section Headline',
    variants: ['control', 'variant_a', 'variant_b'],
  });

  abTesting.createTest({
    id: 'cta_button',
    name: 'CTA Button Text',
    variants: ['Get Free Quote', 'Request Estimate', 'Start Your Project'],
  });

  abTesting.createTest({
    id: 'pricing_display',
    name: 'Pricing Display Method',
    variants: ['range', 'starting_from', 'contact_us'],
  });
};
