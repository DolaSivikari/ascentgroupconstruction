/**
 * Schema Injection Utility for AEO/GEO Optimization
 * Provides reusable functions for injecting structured data
 */

export const injectSchemas = (...schemas: object[]) => {
  return schemas.map((schema, i) => ({
    type: 'application/ld+json',
    innerHTML: JSON.stringify(schema)
  }));
};

export const createHowToSchema = (options: {
  name: string;
  description: string;
  steps: Array<{ position: number; name: string; text: string }>;
  estimatedCost?: { min: number; max: number };
  totalTime?: string;
}) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: options.name,
    description: options.description,
    step: options.steps.map(step => ({
      "@type": "HowToStep",
      position: step.position,
      name: step.name,
      text: step.text
    }))
  };

  if (options.estimatedCost) {
    schema.estimatedCost = {
      "@type": "MonetaryAmount",
      currency: "CAD",
      value: `${options.estimatedCost.min}-${options.estimatedCost.max}`
    };
  }

  if (options.totalTime) {
    schema.totalTime = options.totalTime;
  }

  return schema;
};

export const createQASchema = (question: string, answer: string) => ({
  "@context": "https://schema.org",
  "@type": "Question",
  name: question,
  acceptedAnswer: {
    "@type": "Answer",
    text: answer
  }
});

export const createServiceSchema = (options: {
  serviceType: string;
  areaServed: string[];
  priceRange: string;
  subServices?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: options.serviceType,
  provider: {
    "@type": "LocalBusiness",
    name: "Ascent Group Construction"
  },
  areaServed: options.areaServed.map(city => ({
    "@type": "City",
    name: city
  })),
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    priceRange: options.priceRange,
    priceCurrency: "CAD"
  },
  ...(options.subServices && {
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: options.serviceType,
      itemListElement: options.subServices.map((service, i) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service
        }
      }))
    }
  })
});

export const createSiteSearchSchema = (baseUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: baseUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${baseUrl}/services?search={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
});
