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
    subheadline: "Prime contractor for facade remediation, parking garage restoration & sealant programs across Ontario.",
    primaryCTA: {
      label: "Request a Proposal",
      href: "/contact",
    },
  },
  {
    video: buildingVideo,
    poster: buildingPoster,
    stat: "Free",
    statLabel: "Consultations",
    headline: "Quality Home Services",
    subheadline: "Professional painting, renovations, tile & flooring. Commercial-grade quality for homeowners.",
    primaryCTA: {
      label: "Start Your Project",
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
      label: "Request Proposal",
      href: "/contact",
    },
  },
];
