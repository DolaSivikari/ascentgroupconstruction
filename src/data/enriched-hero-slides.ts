// Import video and poster assets
import buildingVideo from "@/assets/hero-clipchamp.mp4";
import buildingPoster from "@/assets/hero-building-envelope.jpg";

export const enrichedHeroSlides = [
  {
    video: buildingVideo,
    poster: buildingPoster,
    stat: "15+",
    statLabel: "Years Experience",
    headline: "Envelope & Restoration Specialists",
    subheadline: "Self-performed trades. Clear accountability. Building trust across Ontario.",
    primaryCTA: {
      label: "Get Free Quote",
      href: "/contact",
    },
  },
  {
    video: buildingVideo,
    poster: buildingPoster,
    stat: "Free",
    statLabel: "Estimates",
    headline: "Quality Home Services",
    subheadline: "Professional painting, renovations, tile & flooring. Commercial-grade quality for homeowners.",
    primaryCTA: {
      label: "Get Free Estimate",
      href: "/homeowners",
    },
  },
  {
    video: buildingVideo,
    poster: buildingPoster,
    stat: "85%",
    statLabel: "Self-Performed",
    headline: "One Team. One Contact.",
    subheadline: "No subcontractor layers. Direct execution on sealants, EIFS, masonry, and waterproofing.",
    primaryCTA: {
      label: "Request Quote",
      href: "/contact",
    },
  },
];
