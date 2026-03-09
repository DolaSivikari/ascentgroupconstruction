// Import video and poster assets
import buildingVideo from "@/assets/hero-clipchamp.mp4";
import buildingPoster from "@/assets/hero-building-envelope.jpg";

export const enrichedHeroSlides = [
  {
    video: buildingVideo,
    poster: buildingPoster,
    stat: "15+",
    statLabel: "Years Experience",
    headline: "Specialty Contractor for Building Envelope, Restoration & Interior Trade Execution",
    subheadline: "Self-performed and coordinated scopes for commercial, multi-unit, and selected residential projects across the GTA.",
    primaryCTA: {
      label: "Submit RFP",
      href: "/submit-rfp",
    },
    secondaryCTA: {
      label: "Explore Services",
      href: "/services",
    },
  },
  {
    video: buildingVideo,
    poster: buildingPoster,
    stat: "85%",
    statLabel: "Self-Performed",
    headline: "Clear Scopes. Reliable Coordination. Professional Closeout.",
    subheadline: "Occupied-building sensitivity, schedule-aware execution, documented QA/QC, and practical communication from inquiry through closeout.",
    primaryCTA: {
      label: "How We Work",
      href: "/our-process",
    },
    secondaryCTA: {
      label: "For General Contractors",
      href: "/for-general-contractors",
    },
  },
  {
    video: buildingVideo,
    poster: buildingPoster,
    stat: "Free",
    statLabel: "Site Assessments",
    headline: "Built for GCs, Property Managers, Developers & Commercial Clients",
    subheadline: "Envelope repairs, restoration scopes, coatings, interior buildouts, and coordinated trade packages where reliability matters.",
    primaryCTA: {
      label: "View Markets",
      href: "/markets",
    },
    secondaryCTA: {
      label: "Contact Us",
      href: "/contact",
    },
  },
];
