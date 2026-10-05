import { usePageSettings } from "@/lib/content/pageSettings";
import { usePublicSettings } from "@/hooks/usePublicSettings";
import { httpsSocialLinks } from "@/lib/publicSettings";
import { Helmet } from "react-helmet-async";
import { useMemo } from "react";
import {
  SITE_URL,
  COMPANY_NAME,
  COMPANY_PHONE_E164,
  COMPANY_EMAIL,
  COMPANY_ADDRESS,
} from "@/constants/company";
import { serviceAreaCities } from "@/data/service-area-cities";
import { pageTitle, publicImageUrl } from "@/utils/seo/metadata";

const DEFAULT_DESCRIPTION =
  "Self-performing specialty contractor delivering building envelope, façade, masonry, EIFS and parking garage restoration across the GTA and Ontario.";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile" | "book" | "product";
  canonical?: string;
  structuredData?: object | object[];
  /** Retained for caller compatibility; business review stars are not emitted. */
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
  description: requestedDescription,
  ogImage = "/og-image.png",
  ogType = "website",
  canonical,
  structuredData,
  noindex = false,
  articleMeta,
}: SEOProps) => {
  const pageSettings = usePageSettings();
  const { data: siteSettings } = usePublicSettings<{
    meta_title?: string;
    meta_description?: string;
    social_links?: unknown;
  }>("site_settings");
  const { data: footerSettings } = usePublicSettings<{
    social_media?: unknown;
  }>("footer_settings");
  const socials = useMemo(
    () =>
      Object.values({
        ...httpsSocialLinks(siteSettings?.social_links),
        ...httpsSocialLinks(footerSettings?.social_media),
      }),
    [siteSettings?.social_links, footerSettings?.social_media],
  );
  const description =
    pageSettings.seo.description ||
    requestedDescription ||
    siteSettings?.meta_description?.trim() ||
    DEFAULT_DESCRIPTION;
  const fullTitle = pageTitle(
    pageSettings.seo.title || title || siteSettings?.meta_title?.trim(),
  );
  const imageUrl = publicImageUrl(pageSettings.seo.image || ogImage);

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
      description: DEFAULT_DESCRIPTION,
      url: SITE_URL,
      telephone: COMPANY_PHONE_E164,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/ascent-logo.png`,
        width: "250",
        height: "60",
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
        longitude: "-79.4111",
      },
      areaServed: [
        ...serviceAreaCities.map((name) => ({ "@type": "City", name })),
        {
          "@type": "State",
          name: "Ontario",
          "@id": "https://en.wikipedia.org/wiki/Ontario",
        },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "09:00",
          closes: "16:00",
        },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: COMPANY_PHONE_E164,
        email: COMPANY_EMAIL,
        availableLanguage: ["English"],
        areaServed: "CA",
      },
      priceRange: "$$-$$$",
      paymentAccepted: [
        "Cash",
        "Check",
        "Credit Card",
        "Bank Transfer",
        "Financing Available",
      ],
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
        "Interior Finishing",
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
              description:
                "Façade remediation, waterproofing, and exterior envelope systems for commercial and multi-family buildings",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "EIFS & Stucco Systems",
              description:
                "Professional EIFS and stucco installation, repair, and restoration",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Masonry Restoration",
              description:
                "Brick repair, stone restoration, tuckpointing, and structural masonry work",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Metal Cladding",
              description:
                "Professional metal cladding installation and finishing",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Parking Garage Restoration",
              description:
                "Concrete repair, waterproofing membrane, traffic coatings, and structural rehabilitation",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Protective & Architectural Coatings",
              description:
                "Commercial painting and protective coating systems for building exteriors and interiors",
            },
          },
        ],
      },
    };

    // Self-serving LocalBusiness ratings are not eligible for Google's review stars.
    // Visible reviews stay in their own components; SEO performs no review queries.
    if (socials.length) schema.sameAs = [...new Set(socials)];
    return schema;
  }, [socials]);

  // Combine schemas if custom structured data is provided
  const schemas = structuredData
    ? Array.isArray(structuredData)
      ? [defaultSchema, ...structuredData]
      : [defaultSchema, structuredData]
    : [defaultSchema];

  // Keep the complete title for social previews; platforms choose their display length.
  const ogTitle = fullTitle;
  const ogDescription =
    description.length > 160
      ? `${description.slice(0, 157).trimEnd()}…`
      : description;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={
          noindex || pageSettings.seo.noindex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image:alt" content={`${ogTitle} - Visual Preview`} />

      {/* Article-specific Open Graph metadata */}
      {ogType === "article" && articleMeta?.publishedTime && (
        <meta
          property="article:published_time"
          content={articleMeta.publishedTime}
        />
      )}
      {ogType === "article" && articleMeta?.modifiedTime && (
        <meta
          property="article:modified_time"
          content={articleMeta.modifiedTime}
        />
      )}
      {ogType === "article" && articleMeta?.author && (
        <meta property="article:author" content={articleMeta.author} />
      )}
      {ogType === "article" && articleMeta?.section && (
        <meta property="article:section" content={articleMeta.section} />
      )}
      {ogType === "article" &&
        articleMeta?.tags?.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      {/* Twitter Card - Enhanced */}
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={imageUrl} />
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
