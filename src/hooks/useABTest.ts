import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ABTestVariant {
  name: string;
  value: string;
}

interface ABTest {
  test_name: string;
  variants: ABTestVariant[];
}

/**
 * Hook for A/B testing with automatic variant assignment and tracking
 * @param testName - Name of the A/B test (must exist in ab_tests table)
 * @param defaultVariant - Fallback variant if test is not found
 * @returns Current variant value
 */
export const useABTest = (testName: string, defaultVariant: string = 'control'): string => {
  const [variant, setVariant] = useState<string>(defaultVariant);

  useEffect(() => {
    const initializeTest = async () => {
      try {
        // Get user identifier (localStorage-based session ID)
        let userId = localStorage.getItem('ab_test_user_id');
        if (!userId) {
          userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('ab_test_user_id', userId);
        }

      // Check if user already has an assignment for this test
      const { data: existingAssignment } = await supabase
        .from('ab_test_assignments' as any)
        .select('variant')
        .eq('test_name', testName)
        .eq('user_identifier', userId)
        .single();

      if (existingAssignment && 'variant' in existingAssignment) {
        setVariant(existingAssignment.variant as string);
        return;
      }

      // Fetch test configuration
      const { data: testConfig } = await supabase
        .from('ab_tests' as any)
        .select('variants')
        .eq('test_name', testName)
        .eq('is_active', true)
        .single();

      if (!testConfig || !('variants' in testConfig) || !testConfig.variants) {
        console.warn(`A/B test "${testName}" not found or inactive`);
        setVariant(defaultVariant);
        return;
      }

      const variants = Array.isArray(testConfig.variants) 
        ? testConfig.variants as unknown as ABTestVariant[]
        : [];
      
      // Randomly assign variant (equal distribution)
      const randomVariant = variants[Math.floor(Math.random() * variants.length)];
      const assignedVariantValue = randomVariant.value;

      // Save assignment
      await supabase.from('ab_test_assignments' as any).insert({
        test_name: testName,
        variant: randomVariant.name,
        user_identifier: userId,
      });

        setVariant(assignedVariantValue);
      } catch (error) {
        console.error('Error initializing A/B test:', error);
        setVariant(defaultVariant);
      }
    };

    initializeTest();
  }, [testName, defaultVariant]);

  return variant;
};

/**
 * Track conversion for an A/B test
 * @param testName - Name of the A/B test
 * @param conversionValue - Optional monetary value of the conversion
 */
export const trackABTestConversion = async (
  testName: string,
  conversionValue?: number
) => {
  try {
    const userId = localStorage.getItem('ab_test_user_id');
    if (!userId) return;

    await supabase
      .from('ab_test_assignments' as any)
      .update({
        converted_at: new Date().toISOString(),
        conversion_value: conversionValue,
      } as any)
      .eq('test_name', testName)
      .eq('user_identifier', userId)
      .is('converted_at', null); // Only update if not already converted
  } catch (error) {
    console.error('Error tracking A/B test conversion:', error);
  }
};
