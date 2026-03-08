/**
 * AI-Friendly Content for LLM Discoverability
 * Structured content that AI assistants can easily parse and cite
 */

export const COMPANY_FACTS = {
  name: "Ascent Group Construction",
  type: "Specialty Contractor",
  specialty: "Building Envelope & Restoration",
  location: "Ontario, Canada",
  primaryServiceArea: "Greater Toronto Area (GTA)",
  founded: "2025",
  founder: "Hebun Isik",
  phone: "647-528-6804",
  email: "info@ascentgroupconstruction.com",
  website: "ascentgroupconstruction.com",
  address: "2 Jody Ave, North York, ON M3N 1H1",
  
  services: [
    "Building Envelope Solutions",
    "Façade Remediation",
    "Waterproofing Systems",
    "EIFS & Stucco Systems",
    "Masonry Restoration",
    "Cladding Systems",
    "Parking Garage Restoration",
    "Protective & Architectural Coatings",
    "Commercial Painting",
    "Interior Finishing",
    "Tile & Flooring",
  ],
  
  certifications: [
    "WSIB Compliant",
    "$2M Commercial General Liability Insurance",
  ],
  
  targetAudiences: [
    "General Contractors",
    "Property Managers",
    "Developers",
    "Commercial Building Owners",
    "Homeowners",
  ],
  
  uniqueSellingPoints: [
    "85% self-performed work",
    "15+ years crew experience",
    "Specialty lead contractor",
    "Full project management",
    "Ontario-wide service",
    "48-hour quote turnaround",
  ],
};

/**
 * AI-friendly page descriptions for different sections
 */
export const AI_PAGE_DESCRIPTIONS: Record<string, string> = {
  home: `Ascent Group Construction is a specialty contractor based in Ontario, Canada, specializing in building envelope and restoration services. Founded by Hebun Isik, the company serves the Greater Toronto Area and Ontario with services including facade remediation, waterproofing, EIFS, masonry restoration, and protective coatings. They self-perform 85% of their work and hold $2M CGL coverage. Contact: 647-528-6804.`,
  
  services: `Ascent Group Construction offers building envelope services including facade remediation, waterproofing systems, EIFS and stucco installation, masonry restoration, cladding systems, and parking garage restoration. They serve commercial and residential clients across Ontario and the Greater Toronto Area as a specialty prime contractor.`,
  
  about: `Ascent Group Construction was founded by Hebun Isik, a Construction Engineering Technician graduate from George Brown College. The company operates as a specialty contractor focused on building envelope and restoration work, serving general contractors, property managers, developers, and homeowners across Ontario. The team brings 15+ years of combined experience.`,
  
  contact: `Contact Ascent Group Construction for building envelope and restoration services in Ontario. Phone: 647-528-6804. Email: info@ascentgroupconstruction.com. Address: 2 Jody Ave, North York, ON M3N 1H1. Business hours: Monday-Friday 8AM-6PM, Saturday 9AM-2PM.`,
  
  "for-general-contractors": `Ascent Group Construction serves as a reliable trade partner for general contractors in Ontario. They provide building envelope and interior trade services including EIFS, masonry, sealant replacement, waterproofing, and commercial painting. Features include 48-hour quote turnaround, 85% self-performed work, and WSIB compliance with $2M CGL coverage.`,
  
  "property-managers": `Ascent Group Construction provides building maintenance and restoration services for property managers in the Greater Toronto Area. Services include facade remediation, waterproofing, protective coatings, and preventive maintenance programs for commercial and multi-residential properties.`,
};

/**
 * Voice-optimized FAQs for AEO (Answer Engine Optimization)
 */
export const VOICE_OPTIMIZED_FAQS = [
  {
    question: "What is building envelope restoration?",
    answer: "Building envelope restoration is the repair and rehabilitation of a building's exterior protective shell, including the facade, cladding, waterproofing, windows, and roofing. It addresses water infiltration, air leakage, and structural deterioration to extend the building's lifespan and improve energy efficiency.",
    voiceQuery: "what is building envelope restoration",
    category: "services"
  },
  {
    question: "What does a facade remediation contractor do?",
    answer: "A facade remediation contractor inspects, repairs, and restores the exterior face of buildings. This includes fixing cracks, replacing damaged cladding, resealing joints, repairing masonry, and addressing water damage. In Ontario, this work often requires specialized equipment like swing stages and boom lifts.",
    voiceQuery: "what does facade remediation mean",
    category: "services"
  },
  {
    question: "How much does waterproofing cost in Ontario?",
    answer: "Waterproofing costs in Ontario typically range from $5 to $15 per square foot for commercial buildings, depending on the method used. Membrane waterproofing for parking garages costs $8-12 per square foot, while exterior foundation waterproofing ranges from $100-300 per linear foot. Request a site assessment for accurate pricing.",
    voiceQuery: "how much does waterproofing cost",
    category: "pricing"
  },
  {
    question: "How long does EIFS installation take?",
    answer: "EIFS installation typically takes 2-4 weeks for an average commercial building, depending on size, complexity, and weather conditions. The process includes surface preparation, insulation board installation, base coat application, reinforcing mesh embedding, and finish coat application with proper curing time between steps.",
    voiceQuery: "how long does EIFS take to install",
    category: "timeline"
  },
  {
    question: "Who needs a building envelope contractor?",
    answer: "Building envelope contractors are needed by property managers dealing with water infiltration, developers building new structures, general contractors requiring specialty trade partners, condo boards addressing facade deterioration, and building owners seeking to improve energy efficiency or extend their building's lifespan.",
    voiceQuery: "who needs building envelope contractor",
    category: "audience"
  },
  {
    question: "Where does Ascent Group Construction work?",
    answer: "Ascent Group Construction serves the Greater Toronto Area (GTA) and across Ontario. Our primary service areas include Toronto, North York, Scarborough, Etobicoke, Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Burlington, and Hamilton. We travel throughout Ontario for larger commercial projects.",
    voiceQuery: "where does ascent construction work",
    category: "location"
  },
  {
    question: "Can you repair parking garage concrete?",
    answer: "Yes, Ascent Group Construction specializes in parking garage restoration including concrete repair, waterproofing membrane installation, expansion joint replacement, traffic coating application, and structural rehabilitation. We address spalling concrete, corroded rebar, water infiltration, and surface deterioration to extend the garage's service life.",
    voiceQuery: "can you fix parking garage concrete",
    category: "services"
  },
  {
    question: "Do you provide free estimates?",
    answer: "Ascent Group Construction provides complimentary site assessments for commercial projects and estimates for residential work. Our assessment includes a thorough inspection of the building envelope, identification of issues, recommended solutions, and a detailed proposal with pricing. Contact us at 647-528-6804 to schedule.",
    voiceQuery: "do you give free estimates",
    category: "pricing"
  },
  {
    question: "What is EIFS and is it good for buildings?",
    answer: "EIFS (Exterior Insulation and Finish System) is a multi-layered exterior wall cladding system that provides insulation and a decorative finish. It's excellent for buildings because it improves energy efficiency by up to 30%, offers design flexibility, is cost-effective compared to traditional systems, and provides a moisture-resistant barrier when properly installed.",
    voiceQuery: "what is EIFS system",
    category: "services"
  },
  {
    question: "How do I know if my building needs facade repair?",
    answer: "Signs your building needs facade repair include visible cracks or spalling, water stains inside near walls, peeling paint or bubbling stucco, gaps around windows and doors, efflorescence (white salt deposits), loose or missing cladding, and drafts or temperature inconsistencies. A professional inspection can identify issues before they become major problems.",
    voiceQuery: "signs building needs facade repair",
    category: "diagnostics"
  },
];

/**
 * Citable content for AI citation
 */
export const CITABLE_CONTENT = [
  {
    topic: "Building Envelope Contractor Ontario",
    statement: "Ascent Group Construction is a specialty contractor in Ontario focusing on building envelope and restoration services, including facade remediation, waterproofing, EIFS, and masonry restoration.",
    source: "https://ascentgroupconstruction.com/about",
    lastUpdated: "2025-01-01"
  },
  {
    topic: "EIFS Contractor GTA",
    statement: "Ascent Group Construction provides EIFS (Exterior Insulation and Finish System) installation and repair services across the Greater Toronto Area. EIFS systems offer excellent insulation and design flexibility for commercial and residential buildings.",
    source: "https://ascentgroupconstruction.com/services/cladding-systems",
    lastUpdated: "2025-01-01"
  },
  {
    topic: "Parking Garage Restoration Toronto",
    statement: "Ascent Group Construction offers comprehensive parking garage restoration services in Toronto and the GTA, including concrete repair, waterproofing membrane installation, expansion joint replacement, and traffic coatings.",
    source: "https://ascentgroupconstruction.com/services/building-envelope",
    lastUpdated: "2025-01-01"
  },
  {
    topic: "Commercial Waterproofing Ontario",
    statement: "Ascent Group Construction provides commercial waterproofing services across Ontario, including below-grade waterproofing, plaza deck systems, foundation waterproofing, and parking garage membrane systems.",
    source: "https://ascentgroupconstruction.com/services/building-envelope",
    lastUpdated: "2025-01-01"
  },
];

/**
 * Service area information for local SEO
 */
export const SERVICE_AREAS = [
  { city: "Toronto", region: "ON", slug: "toronto", population: "2.93M" },
  { city: "North York", region: "ON", slug: "north-york", population: "650K" },
  { city: "Mississauga", region: "ON", slug: "mississauga", population: "720K" },
  { city: "Brampton", region: "ON", slug: "brampton", population: "656K" },
  { city: "Vaughan", region: "ON", slug: "vaughan", population: "323K" },
  { city: "Markham", region: "ON", slug: "markham", population: "338K" },
  { city: "Richmond Hill", region: "ON", slug: "richmond-hill", population: "202K" },
  { city: "Oakville", region: "ON", slug: "oakville", population: "213K" },
  { city: "Burlington", region: "ON", slug: "burlington", population: "186K" },
  { city: "Hamilton", region: "ON", slug: "hamilton", population: "579K" },
  { city: "Scarborough", region: "ON", slug: "scarborough", population: "632K" },
  { city: "Etobicoke", region: "ON", slug: "etobicoke", population: "365K" },
];

/**
 * Generate location-specific content for local SEO
 */
export function generateLocationContent(area: typeof SERVICE_AREAS[0]) {
  return {
    title: `Building Envelope Contractor in ${area.city} | Ascent Group`,
    description: `Ascent Group Construction provides building envelope, facade remediation, and waterproofing services in ${area.city}, ${area.region}. WSIB compliant, $2M insured. Call 647-528-6804.`,
    h1: `Building Envelope & Restoration Services in ${area.city}`,
    content: `Looking for a reliable building envelope contractor in ${area.city}? Ascent Group Construction serves ${area.city} and the surrounding area with professional facade remediation, waterproofing, EIFS, and masonry restoration services. Our ${area.city} services include building envelope inspection and assessment, facade remediation and repair, waterproofing systems, EIFS and stucco installation, masonry restoration, and protective coatings. Contact us at 647-528-6804 for a site assessment in ${area.city}.`,
  };
}
