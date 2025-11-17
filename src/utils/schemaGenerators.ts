/**
 * Schema.org structured data generators for SEO
 * Generates service-specific, FAQ, and breadcrumb schemas
 */

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  provider: string;
  areaServed: string[];
  serviceType?: string;
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
}

interface FAQItem {
  question: string;
  answer: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export const generateServiceSchema = ({
  name,
  description,
  url,
  provider,
  areaServed,
  serviceType,
  offers
}: ServiceSchemaProps) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${url}#service`,
  name,
  description,
  provider: {
    "@type": "Organization",
    name: provider,
    url: window.location.origin
  },
  serviceType: serviceType || name,
  areaServed: areaServed.map(area => ({
    "@type": "City",
    name: area
  })),
  url,
  ...(offers && {
    offers: {
      "@type": "Offer",
      priceCurrency: offers.priceCurrency || "CAD",
      price: offers.price || "0",
      availability: offers.availability || "https://schema.org/InStock"
    }
  })
});

export const generateFAQSchema = (faqs: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(faq => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
});

export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    ...(index < items.length - 1 && { item: item.url })
  }))
});

export const generateProjectSchema = ({
  name,
  description,
  location,
  completionDate,
  client,
  value
}: {
  name: string;
  description: string;
  location: string;
  completionDate?: string;
  client?: string;
  value?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Project",
  name,
  description,
  location: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: location
    }
  },
  ...(completionDate && { endDate: completionDate }),
  ...(client && { client: { "@type": "Organization", name: client } }),
  ...(value && { budget: { "@type": "MonetaryAmount", value } })
});

export const generateLocalBusinessSchema = () => {
  const siteUrl = window.location.origin;
  
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${siteUrl}/#localbusiness`,
    name: "Ascent Group Construction",
    image: `${siteUrl}/og-image.jpg`,
    telephone: "+1-647-123-4567",
    email: "info@ascentgroupconstruction.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Greater Toronto Area",
      addressLocality: "Toronto",
      addressRegion: "ON",
      postalCode: "M5H 2N2",
      addressCountry: "CA"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "43.6532",
      longitude: "-79.3832"
    },
    url: siteUrl,
    priceRange: "$$-$$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "16:00"
      }
    ],
    areaServed: [
      { "@type": "City", name: "Toronto" },
      { "@type": "City", name: "Mississauga" },
      { "@type": "City", name: "Brampton" },
      { "@type": "City", name: "Vaughan" },
      { "@type": "City", name: "Markham" },
      { "@type": "State", name: "Ontario" }
    ]
  };
};

// Service-specific schema configurations
export const SERVICE_SCHEMAS = {
  "general-contracting": {
    name: "General Contracting Services",
    description: "Full-service general contracting with single-source accountability, fixed-price certainty, and proven delivery across commercial, multi-family, and institutional projects.",
    serviceType: "GeneralContractor",
    areaServed: ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Ontario"]
  },
  "building-envelope": {
    name: "Building Envelope Systems",
    description: "Comprehensive building envelope solutions including façade restoration, weatherproofing, and thermal performance optimization for commercial and residential buildings.",
    serviceType: "ConstructionService",
    areaServed: ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Ontario"]
  },
  "construction-management": {
    name: "Construction Management Services",
    description: "Professional construction management providing schedule control, budget oversight, and quality assurance for projects of all sizes.",
    serviceType: "ConstructionService",
    areaServed: ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Ontario"]
  },
  "design-build": {
    name: "Design-Build Services",
    description: "Integrated design-build delivery combining architectural design, engineering, and construction under one contract for streamlined project execution.",
    serviceType: "ConstructionService",
    areaServed: ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Ontario"]
  },
  "eifs-stucco": {
    name: "EIFS & Stucco Services",
    description: "Expert EIFS and stucco installation, repair, and restoration for commercial and residential buildings throughout the GTA.",
    serviceType: "ConstructionService",
    areaServed: ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Ontario"]
  },
  "masonry-restoration": {
    name: "Masonry Restoration Services",
    description: "Historic and modern masonry restoration including brick repair, stone restoration, tuckpointing, and structural masonry work.",
    serviceType: "ConstructionService",
    areaServed: ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Ontario"]
  },
  "metal-cladding": {
    name: "Metal Cladding Services",
    description: "Professional metal cladding installation, repair, and finishing for commercial buildings including aluminum, steel, and composite panels.",
    serviceType: "ConstructionService",
    areaServed: ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Ontario"]
  },
  "waterproofing": {
    name: "Waterproofing Services",
    description: "Comprehensive waterproofing solutions for foundations, roofs, parkades, and building envelopes using advanced membrane and coating systems.",
    serviceType: "ConstructionService",
    areaServed: ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Ontario"]
  },
  "parking-rehabilitation": {
    name: "Parking Structure Rehabilitation",
    description: "Complete parking garage restoration including concrete repair, waterproofing, traffic coatings, and structural rehabilitation.",
    serviceType: "ConstructionService",
    areaServed: ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Ontario"]
  }
};
