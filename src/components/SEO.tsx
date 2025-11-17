import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  structuredData?: object | object[];
  includeRating?: boolean;
}

const SEO = ({
  title,
  description = "Protect your building asset value with Ontario's envelope & restoration specialists. We prevent water damage, extend service life 25+ years, and eliminate emergency repair costs for property managers, condo boards, and asset owners across the GTA. 500+ buildings protected since 2009.",
  keywords,
  ogImage = "/og-image.jpg",
  canonical,
  structuredData,
  includeRating = false,
}: SEOProps) => {
  const fullTitle = title ? `${title} | Ascent Group Construction` : 'Ascent Group Construction - Ontario Building Envelope & Restoration Specialists';
  const siteUrl = 'https://ascentgroupconstruction.com';
  
  // PHASE 1 FIX: Ensure single canonical URL (non-www, HTTPS)
  // Remove any www prefix and force HTTPS
  const cleanPath = window.location.pathname;
  const currentUrl = canonical || `${siteUrl}${cleanPath}`;

  // Enhanced organization schema with comprehensive service catalog + AEO/GEO optimization
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: "Ascent Group Construction",
    alternateName: "Ascent Group",
    slogan: "Envelope & Restoration Contractor — Ontario & GTA",
    description: description,
    url: siteUrl,
    telephone: "+1-647-528-6804",
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/ascent-logo.png`,
      width: "250",
      height: "60"
    },
    image: `${siteUrl}/og-image.jpg`,
    email: "info@ascentgroupconstruction.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Greater Toronto Area",
      addressLocality: "Toronto",
      addressRegion: "ON",
      postalCode: "M5H 2N2",
      addressCountry: "CA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "43.6532",
      longitude: "-79.3832"
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
      telephone: "+1-647-528-6804",
      email: "info@ascentgroupconstruction.com",
      availableLanguage: ["English"],
      areaServed: "CA"
    },
    priceRange: "$$-$$$",
    paymentAccepted: ["Cash", "Check", "Credit Card", "Bank Transfer", "Financing Available"],
    currenciesAccepted: "CAD",
    foundingDate: "2009",
    knowsAbout: [
      "Specialty Contracting",
      "Building Envelope Systems",
      "Commercial Construction",
      "Multi-Family Construction",
      "Institutional Construction",
      "Exterior Systems",
      "Interior Construction",
      "Construction Project Management",
      "Sustainable Construction"
    ],
    award: [
      "15+ Years Excellence in Construction Services",
      "WSIB Certified Contractor",
      "Licensed Building Envelope Contractor Ontario"
    ],
    // Aggregate rating removed until verified reviews are collected
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Construction & Building Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Commercial Construction",
            description: "Professional commercial construction services for offices, retail spaces, and industrial facilities"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Residential Construction & Renovation",
            description: "Expert interior and exterior residential construction services"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Multi-Family Building Construction",
            description: "Specialized multi-family and condo building construction services"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Stucco & EIFS",
            description: "Professional stucco and EIFS installation and repair"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Masonry Repair",
            description: "Expert masonry restoration and repair services"
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
            description: "Comprehensive parking garage restoration and waterproofing"
          }
        }
      ]
    }
  };

  // Combine schemas if custom structured data is provided
  const schemas = structuredData
    ? Array.isArray(structuredData)
      ? [defaultSchema, ...structuredData]
      : [defaultSchema, structuredData]
    : [defaultSchema];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image:alt" content={`${fullTitle} - Visual Preview`} />

      {/* Twitter Card - Enhanced */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      <meta name="twitter:image:alt" content={`${fullTitle} - Visual Preview`} />

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
