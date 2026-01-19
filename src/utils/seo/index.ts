/**
 * SEO Utilities - Central Export
 */

// Structured Data (Schema.org)
export {
  organizationSchema,
  localBusinessSchema,
  generateServiceSchema,
  generateProjectSchema,
  generateFAQSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateHowToSchema,
  generateAggregateRatingSchema,
  generateSpeakableSchema,
  generateLocationSchema,
  getFullSchemaGraph,
  COMPANY,
} from './structured-data';

// Meta Tag Generation
export {
  generateMetaTags,
  defaultMeta,
  formatPageTitle,
  truncateDescription,
  extractKeywords,
  type PageMeta,
  type MetaTag,
} from './meta-generator';

// AI/LLM Content
export {
  COMPANY_FACTS,
  AI_PAGE_DESCRIPTIONS,
  VOICE_OPTIMIZED_FAQS,
  CITABLE_CONTENT,
  SERVICE_AREAS,
  generateLocationContent,
} from './ai-content';
