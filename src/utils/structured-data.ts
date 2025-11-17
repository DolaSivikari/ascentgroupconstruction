interface OrganizationSchemaOptions {
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
}

export const organizationSchema = (options?: OrganizationSchemaOptions) => {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: options?.name || "Ascent Group Construction",
    description: options?.description || "Professional construction management services in Ontario. Specializing in commercial, industrial, and institutional projects with LEED certification support.",
    url: options?.url || siteUrl,
    logo: options?.logo || `${siteUrl}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "2 Jody Ave",
      addressLocality: "North York",
      addressRegion: "ON",
      postalCode: "M3N 1H1",
      addressCountry: "CA",
    },
    areaServed: {
      "@type": "State",
      name: "Ontario",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-647-528-6804",
      contactType: "customer service",
      email: "info@ascentgroupconstruction.com",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://www.linkedin.com/company/ascent-group-construction",
    ],
    priceRange: "$$$$",
  };
};

interface ServiceSchemaOptions {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
  url?: string;
}

export const serviceSchema = (options: ServiceSchemaOptions) => {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: options.name,
    description: options.description,
    provider: {
      "@type": "Organization",
      name: options.provider || "Ascent Group Construction",
      url: siteUrl,
    },
    areaServed: {
      "@type": "State",
      name: options.areaServed || "Ontario",
    },
    url: options.url || siteUrl,
  };
};

interface ArticleSchemaOptions {
  title: string;
  description: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url?: string;
}

export const articleSchema = (options: ArticleSchemaOptions) => {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.title,
    description: options.description,
    author: {
      "@type": "Organization",
      name: options.author || "Ascent Group Construction",
    },
    publisher: {
      "@type": "Organization",
      name: "Ascent Group Construction",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: options.datePublished,
    dateModified: options.dateModified || options.datePublished,
    image: options.image || `${siteUrl}/og-image.jpg`,
    url: options.url || (typeof window !== "undefined" ? window.location.href : ""),
  };
};

interface FAQItem {
  question: string;
  answer: string;
}

export const faqSchema = (faqs: FAQItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

export const breadcrumbSchema = (items: BreadcrumbItem[]) => {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
};

interface ProjectSchemaOptions {
  name: string;
  description: string;
  category: string;
  location: string;
  startDate?: string;
  endDate?: string;
  image?: string;
}

export const projectSchema = (options: ProjectSchemaOptions) => {
  return {
    "@context": "https://schema.org",
    "@type": "Project",
    name: options.name,
    description: options.description,
    category: options.category,
    location: {
      "@type": "Place",
      name: options.location,
    },
    startDate: options.startDate,
    endDate: options.endDate,
    image: options.image,
  };
};

interface ReviewSchemaOptions {
  author: string;
  reviewRating: number;
  reviewBody: string;
  datePublished: string;
  itemReviewed?: {
    name: string;
    type: string;
  };
  publisher?: {
    name: string;
    type: "Person" | "Organization";
  };
  url?: string;
  inLanguage?: string;
}

export const reviewSchema = (options: ReviewSchemaOptions) => {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: options.author,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: options.reviewRating,
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: options.reviewBody,
    datePublished: options.datePublished,
    inLanguage: options.inLanguage || "en-CA",
    itemReviewed: {
      "@type": options.itemReviewed?.type || "LocalBusiness",
      name: options.itemReviewed?.name || "Ascent Group Construction",
      provider: {
        "@type": "LocalBusiness",
        name: "Ascent Group Construction",
        url: siteUrl,
      },
    },
    ...(options.publisher && {
      publisher: {
        "@type": options.publisher.type,
        name: options.publisher.name,
      },
    }),
    ...(options.url && { url: options.url }),
  };
};

interface AggregateReviewsOptions {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export const aggregateReviewSchema = (options: AggregateReviewsOptions) => {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    ratingValue: options.ratingValue.toString(),
    reviewCount: options.reviewCount.toString(),
    bestRating: (options.bestRating || 5).toString(),
    worstRating: (options.worstRating || 1).toString(),
  };
};

interface VideoSchemaOptions {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string; // ISO 8601 format: PT1M30S
}

export const videoSchema = (options: VideoSchemaOptions) => {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: options.name,
    description: options.description,
    thumbnailUrl: options.thumbnailUrl,
    uploadDate: options.uploadDate,
    contentUrl: options.contentUrl,
    embedUrl: options.embedUrl,
    duration: options.duration,
  };
};
