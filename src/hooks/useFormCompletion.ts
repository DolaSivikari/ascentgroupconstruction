import { useMemo } from 'react';

interface FieldRule {
  field: string;
  required: boolean;
  minLength?: number;
  validator?: (value: any) => boolean;
}

interface TabCompletion {
  total: number;
  completed: number;
  percentage: number;
  missing: string[];
}

const requiredFields: Record<string, FieldRule[]> = {
  basic: [
    { field: 'title', required: true, minLength: 3 },
    { field: 'slug', required: true, minLength: 3 },
    { field: 'summary', required: true, minLength: 10 },
    { field: 'category', required: true },
  ],
  images: [
    { field: 'featured_image', required: true },
  ],
  details: [
    { field: 'year', required: true },
    { field: 'project_size', required: true },
  ],
  services: [
    { 
      field: 'service_ids', 
      required: true,
      validator: (value: any[]) => Array.isArray(value) && value.length > 0
    },
  ],
  metrics: [
    { field: 'project_value', required: false },
    { field: 'your_role', required: false },
  ],
  seo: [
    { field: 'seo_title', required: true, minLength: 10 },
    { field: 'seo_description', required: true, minLength: 50 },
    { field: 'publish_state', required: true },
  ],
};

export const useFormCompletion = (formData: any) => {
  const checkField = (rule: FieldRule): boolean => {
    const value = formData[rule.field];
    
    if (!rule.required) return true;
    
    // Check if value exists
    if (value === null || value === undefined || value === '') return false;
    
    // Check custom validator
    if (rule.validator) {
      return rule.validator(value);
    }
    
    // Check min length for strings
    if (rule.minLength && typeof value === 'string') {
      return value.length >= rule.minLength;
    }
    
    // Check arrays
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    
    return true;
  };

  const getTabCompletion = (tabKey: string): TabCompletion => {
    const rules = requiredFields[tabKey] || [];
    const total = rules.filter(r => r.required).length;
    const completed = rules.filter(r => r.required && checkField(r)).length;
    const missing = rules
      .filter(r => r.required && !checkField(r))
      .map(r => r.field);
    
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 100,
      missing,
    };
  };

  const completion = useMemo(() => {
    const tabs = Object.keys(requiredFields);
    const tabCompletions: Record<string, TabCompletion> = {};
    
    tabs.forEach(tab => {
      tabCompletions[tab] = getTabCompletion(tab);
    });
    
    // Calculate overall completion
    const totalRequired = tabs.reduce((sum, tab) => sum + tabCompletions[tab].total, 0);
    const totalCompleted = tabs.reduce((sum, tab) => sum + tabCompletions[tab].completed, 0);
    const overallPercentage = totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 100;
    
    return {
      tabs: tabCompletions,
      overall: {
        total: totalRequired,
        completed: totalCompleted,
        percentage: overallPercentage,
      },
      isComplete: overallPercentage === 100,
    };
  }, [formData]);

  return completion;
};
