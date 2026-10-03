/**
 * Structured Data Generators (Schema.org JSON-LD)
 * Comprehensive schemas for SEO and AI discoverability
 */

import { publicImageUrl } from "./metadata";
import { SITE_URL, COMPANY_NAME, COMPANY_PHONE_E164, COMPANY_EMAIL } from '@/constants/company';

// Company constants
export const COMPANY = {
  name: COMPANY_NAME,
  alternateName: 'Ascent Group',
  description: 'Specialty contractor in Ontario & GTA delivering building envelope, façade remediation, waterproofing, and restoration services.',
  slogan: 'Envelope & Restoration Specialists',
  phone: COMPANY_PHONE_E164,
  email: COMPANY_EMAIL,
  foundingDate: '2025',
  founder: 'Hebun Isik',
  address: {
    streetAddress: '2 Jody Ave',
    addressLocality: 'North York',
    addressRegion: 'ON',
    postalCode: 'M3N 1H1',
    addressCountry: 'CA',
  },
  geo: {
    latitude: 43.7615,
    longitude: -79.4111,
  },
  serviceAreas: [
    'Toronto',
    'North York',
    'Scarborough',
    'Etobicoke',
    'Mississauga',
    'Brampton',
    'Vaughan',
    'Markham',
    'Richmond Hill',
    'Oakville',
    'Burlington',
    'Hamilton',
  ],
  services: [
    'Building Envelope Solutions',
    'Façade Remediation',
    'Waterproofing Systems',
    'EIFS & Stucco Systems',
    'Masonry Restoration',
    'Cladding Systems',
    'Parking Garage Restoration',
    'Protective & Architectural Coatings',
    'Commercial Painting',
    'Interior Finishing',
  ],
};

// 1. ORGANIZATION SCHEMA (Site-wide)
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  "name": COMPANY.name,
  "alternateName": [COMPANY.alternateName, "Ascent Construction"],
  "url": SITE_URL,
  "logo": {
    "@type": "ImageObject",
    "url": `${SITE_URL}/ascent-logo.png`,
    "width": 250,
    "height": 60
  },
  "image": `${SITE_URL}/og-image.jpg`,
  "description": COMPANY.description,
  "foundingDate": COMPANY.foundingDate,
  "founders": [{
    "@type": "Person",
    "name": COMPANY.founder
  }],
  "address": {
    "@type": "PostalAddress",
    ...COMPANY.address
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": COMPANY.geo.latitude,
    "longitude": COMPANY.geo.longitude
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": COMPANY.phone,
      "contactType": "sales",
      "availableLanguage": ["English", "Turkish", "Kurdish"]
    },
    {
      "@type": "ContactPoint",
      "telephone": COMPANY.phone,
      "contactType": "customer service",
      "email": COMPANY.email,
      "availableLanguage": ["English"]
    }
  ],
  "email": COMPANY.email,
  "telephone": COMPANY.phone,
  "sameAs": [
    // Add social profiles when available
  ],
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": COMPANY.geo.latitude,
      "longitude": COMPANY.geo.longitude
    },
    "geoRadius": "150000"
  },
  "knowsAbout": COMPANY.services,
  "slogan": COMPANY.slogan,
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "license",
      "name": "WSIB Clearance Certificate"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "certification",
      "name": "$2M Commercial General Liability Insurance"
    }
  ]
};

// 2. LOCAL BUSINESS SCHEMA
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${SITE_URL}/#localbusiness`,
  "name": COMPANY.name,
  "image": `${SITE_URL}/og-image.jpg`,
  "url": SITE_URL,
  "telephone": COMPANY.phone,
  "email": COMPANY.email,
  "priceRange": "$$-$$$",
  "address": {
    "@type": "PostalAddress",
    ...COMPANY.address
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": COMPANY.geo.latitude,
    "longitude": COMPANY.geo.longitude
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "14:00"
    }
  ],
  "areaServed": COMPANY.serviceAreas.map(city => ({
    "@type": "City",
    "name": city
  })),
  "serviceType": COMPANY.services,
  "paymentAccepted": ["Cash", "Check", "Credit Card", "Bank Transfer"],
  "currenciesAccepted": "CAD"
};

// 3. SERVICE SCHEMA GENERATOR
export function generateServiceSchema(service: {
  name: string;
  description: string;
  slug: string;
  image?: string;
  path?: string;
  areaServed?: string;
}) {
  const url = `${SITE_URL}${service.path || `/services/${service.slug}`}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    "name": service.name,
    "description": service.description,
    "url": url,
    "image": publicImageUrl(service.image),
    "provider": {
      "@id": `${SITE_URL}/#organization`
    },
    "areaServed": {
      "@type": service.areaServed ? "City" : "AdministrativeArea",
      "name": service.areaServed || "Ontario, Canada"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": service.name,
      "itemListElement": [{
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.name
        }
      }]
    }
  };
}

// 4. PROJECT SCHEMA GENERATOR
export function generateProjectSchema(project: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  completionDate?: string;
  location?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "url": `${SITE_URL}/projects/${project.slug}`,
    "image": project.image,
    "dateCreated": project.completionDate,
    "creator": {
      "@id": `${SITE_URL}/#organization`
    },
    "locationCreated": project.location ? {
      "@type": "Place",
      "name": project.location
    } : undefined
  };
}

// 5. FAQ SCHEMA GENERATOR
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// 6. ARTICLE SCHEMA GENERATOR
export function generateArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  section?: string;
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image || `${SITE_URL}/og-image.jpg`,
    "url": `${SITE_URL}/blog/${article.slug}`,
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "author": {
      "@type": "Person",
      "name": article.authorName || COMPANY.founder
    },
    "publisher": {
      "@id": `${SITE_URL}/#organization`
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${article.slug}`
    },
    "articleSection": article.section,
    "keywords": article.tags?.join(', ')
  };
}

// 7. BREADCRUMB SCHEMA GENERATOR
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`
    }))
  };
}

// 8. HOW-TO SCHEMA GENERATOR
export function generateHowToSchema(process: {
  name: string;
  description: string;
  steps: { name: string; text: string; image?: string }[];
  totalTime?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": process.name,
    "description": process.description,
    "totalTime": process.totalTime,
    "step": process.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "image": step.image
    }))
  };
}

// 9. AGGREGATE RATING SCHEMA
export function generateAggregateRatingSchema(rating: {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "ratingValue": rating.ratingValue,
    "reviewCount": rating.reviewCount,
    "bestRating": rating.bestRating || 5,
    "worstRating": rating.worstRating || 1
  };
}

// 10. SPEAKABLE SCHEMA (for voice assistants)
export function generateSpeakableSchema(content: {
  headline: string;
  summary: string;
  cssSelectors?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": content.cssSelectors || [".hero-description", ".page-summary"]
    },
    "headline": content.headline,
    "description": content.summary
  };
}

// 11. LOCAL BUSINESS WITH LOCATION SCHEMA
export function generateLocationSchema(location: {
  city: string;
  region: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": `${COMPANY.name} - ${location.city}`,
    "url": `${SITE_URL}/service-areas/${location.city.toLowerCase().replace(/\s+/g, '-')}`,
    "telephone": COMPANY.phone,
    "email": COMPANY.email,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location.city,
      "addressRegion": location.region,
      "addressCountry": "CA"
    },
    "areaServed": {
      "@type": "City",
      "name": location.city
    },
    "parentOrganization": {
      "@id": `${SITE_URL}/#organization`
    }
  };
}

// Combined graph for complete entity relationships
export function getFullSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      localBusinessSchema,
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#founder`,
        "name": COMPANY.founder,
        "jobTitle": "Founder & Owner",
        "worksFor": { "@id": `${SITE_URL}/#organization` },
        "alumniOf": {
          "@type": "CollegeOrUniversity",
          "name": "George Brown College",
          "department": "Construction Engineering Technology"
        },
        "knowsAbout": [
          "Construction Management",
          "Building Envelope",
          "Project Coordination"
        ]
      }
    ]
  };
}
