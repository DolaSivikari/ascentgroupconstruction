import { Helmet } from "react-helmet-async";
import { useAggregateRating } from "@/hooks/useAggregateRating";
import { useMemo } from "react";
import { SITE_URL, COMPANY_NAME, COMPANY_PHONE_E164, COMPANY_EMAIL, COMPANY_ADDRESS } from "@/constants/company";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile" | "book" | "product";
  canonical?: string;
  structuredData?: object | object[];
  includeRating?: boolean;
  noindex?: boolean;
  articleMeta?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

const SEO = ({
  title,
  description = "Self-performing specialty contractor delivering building envelope, façade, masonry, EIFS and parking garage restoration across the GTA and Ontario.",
  keywords,
  ogImage = "/og-image.png",
  ogType = "website",
  canonical,
  structuredData,
  includeRating = false,
  noindex = false,
  articleMeta,
}: SEOProps) => {

  const fullTitle = title ? `${title} | ${COMPANY_NAME}` : `${COMPANY_NAME} — Envelope & Restoration`;

  // Fetch real aggregate rating from database
  const { aggregateRating, hasRatings } = useAggregateRating();

  const cleanPath = window.location.pathname;
  const currentUrl = canonical || `${SITE_URL}${cleanPath}`;

  // Enhanced organization schema with comprehensive service catalog + AEO/GEO optimization
  const defaultSchema = useMemo(() => {
    const schema: any = {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: COMPANY_NAME,
    alternateName: "Ascent Group",
    slogan: "Envelope & Restoration Contractor — Ontario & GTA",
    description: description,
    url: SITE_URL,
    telephone: COMPANY_PHONE_E164,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/ascent-logo.png`,
      width: "250",
      height: "60"
    },
    image: `${SITE_URL}/og-image.png`,
    email: COMPANY_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_ADDRESS.street,
      addressLocality: COMPANY_ADDRESS.city,
      addressRegion: COMPANY_ADDRESS.province,
      postalCode: COMPANY_ADDRESS.postalCode,
      addressCountry: COMPANY_ADDRESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "43.7615",
      longitude: "-79.4111"
    },
    areaServed: [
      {
        "@type": "City",
        name: "Toronto",
        "@id": "https://en.wikipedia.org/wiki/Toronto"
      },
      {
        "@type": "City",
        name: "Mississauga",
        "@id": "https://en.wikipedia.org/wiki/Mississauga"
      },
      {
        "@type": "City",
        name: "Brampton",
        "@id": "https://en.wikipedia.org/wiki/Brampton"
      },
      {
        "@type": "City",
        name: "Vaughan",
        "@id": "https://en.wikipedia.org/wiki/Vaughan"
      },
      {
        "@type": "City",
        name: "Markham",
        "@id": "https://en.wikipedia.org/wiki/Markham,_Ontario"
      },
      {
        "@type": "State",
        name: "Ontario",
        "@id": "https://en.wikipedia.org/wiki/Ontario"
      }
    ],
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
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: COMPANY_PHONE_E164,
      email: COMPANY_EMAIL,
      availableLanguage: ["English"],
      areaServed: "CA"
    },
    priceRange: "$$-$$$",
    paymentAccepted: ["Cash", "Check", "Credit Card", "Bank Transfer", "Financing Available"],
    currenciesAccepted: "CAD",
    foundingDate: "2025",
    knowsAbout: [
      "Building Envelope Systems",
      "Façade Remediation",
      "Waterproofing Systems",
      "EIFS & Stucco Systems",
      "Masonry Restoration",
      "Cladding Systems",
      "Protective Coatings",
      "Commercial Painting",
      "Interior Finishing"
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Building Envelope & Specialty Trade Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Building Envelope Solutions",
            description: "Façade remediation, waterproofing, and exterior envelope systems for commercial and multi-family buildings"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "EIFS & Stucco Systems",
            description: "Professional EIFS and stucco installation, repair, and restoration"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Masonry Restoration",
            description: "Brick repair, stone restoration, tuckpointing, and structural masonry work"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Metal Cladding",
            description: "Professional metal cladding installation and finishing"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Parking Garage Restoration",
            description: "Concrete repair, waterproofing membrane, traffic coatings, and structural rehabilitation"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Protective & Architectural Coatings",
            description: "Commercial painting and protective coating systems for building exteriors and interiors"
          }
        }
      ]
    }
  };

  // Add aggregate rating if includeRating is true and there are real ratings
  if (includeRating && hasRatings && parseInt(aggregateRating.reviewCount) > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: aggregateRating.bestRating,
      worstRating: aggregateRating.worstRating
    };
  }

  return schema;
}, [description, includeRating, hasRatings, aggregateRating]);

  // Combine schemas if custom structured data is provided
  const schemas = structuredData
    ? Array.isArray(structuredData)
      ? [defaultSchema, ...structuredData]
      : [defaultSchema, structuredData]
    : [defaultSchema];

  // Enforce social-preview length constraints
  const ogTitle = fullTitle.length > 60 ? `${fullTitle.slice(0, 57).trimEnd()}…` : fullTitle;
  const ogDescription = description.length > 160 ? `${description.slice(0, 157).trimEnd()}…` : description;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={`${SITE_URL}${ogImage}`} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image:alt" content={`${ogTitle} - Visual Preview`} />

      {/* Article-specific Open Graph metadata */}
      {ogType === "article" && articleMeta?.publishedTime && (
        <meta property="article:published_time" content={articleMeta.publishedTime} />
      )}
      {ogType === "article" && articleMeta?.modifiedTime && (
        <meta property="article:modified_time" content={articleMeta.modifiedTime} />
      )}
      {ogType === "article" && articleMeta?.author && (
        <meta property="article:author" content={articleMeta.author} />
      )}
      {ogType === "article" && articleMeta?.section && (
        <meta property="article:section" content={articleMeta.section} />
      )}
      {ogType === "article" && articleMeta?.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card - Enhanced */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={`${SITE_URL}${ogImage}`} />
      <meta name="twitter:image:alt" content={`${ogTitle} - Visual Preview`} />

      {/* PHASE 1 FIX: Single Canonical URL - Prevents duplicate content penalty */}
      <link rel="canonical" href={currentUrl} />

      {/* Structured Data */}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
