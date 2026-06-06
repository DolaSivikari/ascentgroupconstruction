/**
 * Wave 1 AEO/GEO service pages — drafted content payload.
 *
 * One file, four pages. All copy is citation-ready (ChatGPT / Perplexity / Google AI Overviews).
 * Do not paraphrase or shorten without re-reading .lovable/plan.md — these strings drive
 * <title>, <meta description>, Direct Answer paragraphs, FAQ JSON-LD, and the trust strip.
 *
 * Trust language rules (locked):
 *   - "$2M commercial general liability" — verify against current policy
 *   - "15+ years of combined hands-on experience" — refers to crew, never company age
 *   - "Sto Canada Listed Installer" — no certificate ID until confirmed
 */

export interface Wave1FAQ {
  question: string;
  answer: string;
}

export interface Wave1Section {
  heading: string;
  audience: string;
  bullets: string[];
}

export interface Wave1ServicePage {
  slug: string;
  title: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  h1: string;
  eyebrow: string;
  heroAlt: string;
  directAnswer: string;
  scopeHeading: string;
  scopeBullets: string[];
  /** Optional split sections (used for fire-retardant page) */
  splitSections?: Wave1Section[];
  materialsHeading?: string;
  materials?: string[];
  faqs: Wave1FAQ[];
  ctaSlug: string;
  /** Related sibling pages (slugs) */
  related: string[];
  /** Known trade-off note rendered as an HTML comment in source */
  knownTradeoff?: string;
}

const TRUST_LINE =
  "We self-perform, carry $2M commercial general liability and full WSIB coverage, and our crew brings 15+ years of combined hands-on experience.";

export const WAVE1_PAGES: Record<string, Wave1ServicePage> = {
  "commercial-painting-gta": {
    slug: "commercial-painting-gta",
    title: "Commercial Painting Contractor GTA | Ascent Group",
    metaDescription:
      "Self-performed commercial painting across the GTA — offices, warehouses, ICI, multi-tenant. WSIB-covered, $2M CGL, off-hours scheduling available.",
    primaryKeyword: "commercial painting contractor GTA",
    secondaryKeywords: [
      "office painting Toronto",
      "warehouse painting Mississauga",
      "ICI painting subcontractor",
      "multi-tenant repaint",
      "commercial repaint contractor Ontario",
    ],
    h1: "Commercial Painting Contractor — Greater Toronto Area",
    eyebrow: "Commercial Painting",
    heroAlt:
      "Commercial painting by Ascent Group Construction — Greater Toronto Area",
    directAnswer:
      "Ascent Group Construction is a self-performing commercial painting contractor serving the Greater Toronto Area, including Toronto, Mississauga, Brampton, Vaughan, and Markham. We deliver interior and exterior repaints for offices, warehouses, ICI facilities, retail plazas, and multi-tenant buildings — including after-hours and weekend scheduling to avoid tenant disruption. Every project is executed by our own crew, not subcontracted out. We carry $2M commercial general liability, full WSIB coverage, and our crew brings 15+ years of combined hands-on experience applying Benjamin Moore, Sherwin-Williams, and PPG systems.",
    scopeHeading: "What we deliver",
    scopeBullets: [
      "Office interiors, common corridors, and lobbies",
      "Warehouse interiors, ceilings, and line-marking prep",
      "Exterior commercial repaints (stucco, EIFS, metal, masonry)",
      "Multi-tenant residential corridor and stairwell repaints",
      "Retail and plaza facade refresh",
      "Surface prep: pressure wash, sanding, priming, caulk renewal",
      "Off-hours and weekend scheduling to avoid tenant disruption",
      "Daily site clean and tenant-safe protection plans",
    ],
    materialsHeading: "Coating systems we apply",
    materials: [
      "Benjamin Moore Ultra Spec and Aura",
      "Sherwin-Williams ProMar and ProIndustrial",
      "PPG SPEEDHIDE",
    ],
    faqs: [
      {
        question: "How much does commercial painting cost in the GTA?",
        answer:
          "Most commercial repaints in the GTA run $2.50–$6.50 per square foot of wall area, depending on prep condition, ceiling height, surface type, and whether work is daytime or off-hours. After a site walkthrough we provide a fixed-price proposal with scope, schedule, and exclusions in writing.",
      },
      {
        question: "Do you do off-hours and weekend work?",
        answer:
          "Yes. For occupied offices, retail, and multi-tenant properties we routinely schedule evenings, weekends, and shutdown windows so tenants are not disrupted.",
      },
      {
        question: "Are you licensed, insured, and WSIB-covered?",
        answer:
          "Yes. We carry $2M commercial general liability and full WSIB coverage. Certificates are provided before site mobilization.",
      },
      {
        question: "Do you self-perform or subcontract?",
        answer:
          "We self-perform. Our painters are direct employees, which keeps quality, scheduling, and accountability under one roof. No broker layers.",
      },
      {
        question: "What surfaces do you paint?",
        answer:
          "Drywall, plaster, concrete block, exposed structure, metal, masonry, stucco, EIFS, and previously-coated substrates. We confirm coating compatibility before quoting.",
      },
      {
        question: "What paint brands do you use?",
        answer:
          "Benjamin Moore Ultra Spec and Aura, Sherwin-Williams ProMar and ProIndustrial, and PPG SPEEDHIDE — selected per substrate and exposure. We match client-specified systems on request.",
      },
      {
        question: "How quickly can you start?",
        answer:
          "For most commercial scopes under 5,000 sq ft we mobilize within 1–2 weeks of accepted proposal. Larger or phased projects are scheduled to the client's milestone dates.",
      },
    ],
    ctaSlug: "commercial-painting-gta",
    related: ["exterior-painting-toronto", "caulking-sealants-toronto"],
  },

  "fire-retardant-coatings-ontario": {
    slug: "fire-retardant-coatings-ontario",
    title: "Fire Retardant & Intumescent Coatings Ontario | Ascent",
    metaDescription:
      "Intumescent coatings on structural steel and fire-rated interior paint across Ontario. Spec-driven application for GCs, architects, and property managers.",
    primaryKeyword: "intumescent coating contractor Ontario",
    secondaryKeywords: [
      "fire retardant paint Toronto",
      "fire-rated coating application",
      "structural steel fire protection GTA",
      "condo corridor fire-rated paint",
    ],
    h1: "Fire Retardant & Intumescent Coatings — Ontario",
    eyebrow: "Fire Protection Coatings",
    heroAlt:
      "Fire retardant and intumescent coating application by Ascent Group Construction — Ontario",
    directAnswer:
      "Ascent Group Construction applies fire retardant and intumescent coating systems across Ontario for two distinct markets: spec-driven intumescent coatings on structural steel for general contractors, architects, and ICI projects; and fire-rated interior paint systems for condo corridors, multi-residential buildings, and property managers. Every application follows the manufacturer's tested assembly — Sherwin-Williams Firetex, AkzoNobel Interchar, and Carboline systems — with documented mil-thickness readings and Ontario Building Code compliance. We self-perform, carry $2M CGL and WSIB coverage, and provide stamped product data and application records for AHJ submission.",
    knownTradeoff:
      "Two distinct intents on one URL (intumescent/steel for GCs vs. fire-rated paint for property managers). Acceptable for Wave 1 to consolidate citation signal. Split into two pages later if either section earns its own ranking traction.",
    scopeHeading: "Two delivery tracks",
    scopeBullets: [],
    splitSections: [
      {
        heading: "Intumescent Coatings on Structural Steel",
        audience: "General Contractors • Architects • ICI Spec Work",
        bullets: [
          "Cellulosic and hydrocarbon fire ratings",
          "Beam, column, and connection application",
          "WFT/DFT verification with documented mil readings",
          "Tested assemblies: UL, ULC, Intertek",
          "Shop-applied or site-applied",
          "Submittal package: product data, certifications, application records",
        ],
      },
      {
        heading: "Fire-Rated Interior Paint",
        audience: "Property Managers • Condo Boards • Multi-Residential",
        bullets: [
          "Condo corridor and stairwell fire-rated repaints",
          "Smoke and flame-spread rated coatings (ULC-S102)",
          "Off-hours scheduling to avoid resident disruption",
          "Existing-coating compatibility assessment",
          "Annual maintenance and touch-up programs",
        ],
      },
    ],
    materialsHeading: "Systems we apply",
    materials: [
      "Sherwin-Williams Firetex",
      "AkzoNobel Interchar",
      "Carboline intumescent systems",
      "PPG fire-protective coatings",
    ],
    faqs: [
      {
        question:
          "What's the difference between fire retardant paint and intumescent coating?",
        answer:
          "Fire retardant paint slows flame spread on combustible surfaces and is rated under ULC-S102. Intumescent coating is a structural fire-protection system: when exposed to fire it expands into a thick insulating char that protects steel for a rated period (typically 1–3 hours).",
      },
      {
        question: "Do you apply intumescent coatings on structural steel?",
        answer:
          "Yes. We apply Sherwin-Williams Firetex, AkzoNobel Interchar, and Carboline intumescent systems on beams, columns, and connections, with documented mil readings and submittal-ready records.",
      },
      {
        question: "Are your applications Ontario Building Code compliant?",
        answer:
          "Yes. We apply to tested UL/ULC/Intertek assemblies and supply product data, certifications, and application records for AHJ review.",
      },
      {
        question: "Can you handle condo corridor fire-rated repaints?",
        answer:
          "Yes. This is a frequent property-manager scope. We use ULC-S102-rated coatings, schedule evenings and weekends, and protect resident access throughout.",
      },
      {
        question: "Do you provide WFT and DFT readings?",
        answer:
          "Yes. We log wet- and dry-film thickness readings during application and provide them at project closeout.",
      },
      {
        question: "Which manufacturers do you work with?",
        answer:
          "Sherwin-Williams (Firetex), AkzoNobel (Interchar), Carboline, and PPG. System selection is based on the rated assembly the project requires.",
      },
      {
        question: "Shop application or site-only?",
        answer:
          "Both. Shop application is faster and cleaner for new steel; site application is standard for retrofits and existing structures.",
      },
      {
        question: "Are you licensed and insured for fire-rated work?",
        answer:
          "Yes. $2M CGL and WSIB coverage. Certificates and product data are sent before mobilization.",
      },
    ],
    ctaSlug: "fire-retardant-coatings-ontario",
    related: ["commercial-painting-gta", "exterior-painting-toronto"],
  },

  "exterior-painting-toronto": {
    slug: "exterior-painting-toronto",
    title: "Exterior Painting Toronto | Stucco & EIFS Recoats",
    metaDescription:
      "Exterior painting across the GTA — stucco repaints, EIFS recoats, brick, siding, metal. Weather-window scheduling, manufacturer systems, $2M CGL coverage.",
    primaryKeyword: "exterior painting Toronto",
    secondaryKeywords: [
      "stucco repainting GTA",
      "EIFS recoat Toronto",
      "brick painting contractor",
      "commercial exterior repaint Mississauga",
    ],
    h1: "Exterior Painting — Toronto & GTA",
    eyebrow: "Exterior Painting",
    heroAlt:
      "Exterior painting and stucco recoat by Ascent Group Construction — Greater Toronto Area",
    directAnswer:
      "Ascent Group Construction provides exterior painting and coating services across the Greater Toronto Area, including Toronto, Mississauga, Brampton, Vaughan, and Markham. We specialize in stucco repaints, EIFS recoats, brick and masonry coatings, metal siding, and commercial exterior refresh. Every project is self-performed by our own crew using manufacturer-specified elastomeric, acrylic, and weatherproof systems from Sherwin-Williams, Benjamin Moore, and Sto. We carry $2M commercial general liability, full WSIB coverage, and our crew brings 15+ years of combined building-envelope experience.",
    scopeHeading: "What we deliver",
    scopeBullets: [
      "Stucco and EIFS recoats (Sto, Dryvit, Parex compatible)",
      "Brick and concrete masonry coatings",
      "Metal siding, fascia, and soffit repaints",
      "Commercial and multi-residential exterior refresh",
      "Elastomeric and acrylic weatherproof coatings",
      "Power wash, prep, and substrate repair before coating",
      "Caulk and sealant renewal as part of the recoat scope",
      "Lift, swing-stage, and ladder-access work",
    ],
    materialsHeading: "Coating systems we apply",
    materials: [
      "Sto, Dryvit, Parex (EIFS-compatible recoats)",
      "Sherwin-Williams Loxon, SuperPaint Exterior",
      "Benjamin Moore Aura Exterior",
      "Mineral-silicate masonry coatings",
    ],
    faqs: [
      {
        question: "How much does exterior painting cost in Toronto?",
        answer:
          "Exterior repaints in the GTA typically run $3–$8 per square foot of wall area, depending on substrate (stucco, brick, EIFS, metal), prep condition, access (ladder vs. swing-stage), and coating system specified. We provide a fixed-price proposal after a site walkthrough.",
      },
      {
        question: "Can you paint over EIFS and stucco?",
        answer:
          "Yes. We apply manufacturer-compatible elastomeric and acrylic recoat systems from Sto, Dryvit, and Parex. Substrate is assessed for cracks, delamination, and moisture before specifying the system.",
      },
      {
        question: "What's the best time of year for exterior painting in the GTA?",
        answer:
          "Mid-April through late October, with surface and air temperatures above the manufacturer minimum (typically 10°C) and a 24–48 hour dry window after application. We schedule around weather.",
      },
      {
        question: "Do you do brick and masonry painting?",
        answer:
          "Yes. We use breathable mineral-silicate or acrylic masonry coatings appropriate for the substrate. We will recommend against painting brick when it's the wrong call — preserving original masonry is often the right answer.",
      },
      {
        question: "Do you repair stucco and EIFS before painting?",
        answer:
          "Yes. Substrate repair is part of the scope: crack routing, mesh-and-base patching, sealant renewal, and primer application before topcoat.",
      },
      {
        question: "Are you licensed and insured?",
        answer:
          "Yes. $2M CGL and WSIB coverage. Certificates issued before mobilization.",
      },
      {
        question: "Do you work on commercial and multi-residential buildings?",
        answer:
          "Yes. Office buildings, retail plazas, condos, townhomes, and ICI facilities are our core market.",
      },
    ],
    ctaSlug: "exterior-painting-toronto",
    related: ["commercial-painting-gta", "caulking-sealants-toronto"],
  },

  "caulking-sealants-toronto": {
    slug: "caulking-sealants-toronto",
    title: "Caulking & Sealant Contractor Toronto | Ascent Group",
    metaDescription:
      "Building envelope caulking and sealant renewal across the GTA — window perimeter, expansion joints, control joints. Sika, Tremco, Dow systems applied.",
    primaryKeyword: "caulking contractor Toronto",
    secondaryKeywords: [
      "building envelope sealant GTA",
      "window caulking Toronto",
      "expansion joint sealing",
      "sealant replacement contractor Ontario",
    ],
    h1: "Caulking & Building Envelope Sealants — Toronto & GTA",
    eyebrow: "Caulking & Sealants",
    heroAlt:
      "Building envelope caulking and sealant renewal by Ascent Group Construction — Greater Toronto Area",
    directAnswer:
      "Ascent Group Construction is a building envelope caulking and sealant contractor serving the Greater Toronto Area. We deliver window perimeter caulking, expansion and control joint sealing, curtain wall and panel joint renewal, and full-building sealant replacement programs for property managers, condo boards, and commercial owners. Every joint is prepped, primed, and installed to manufacturer specification using Sika, Tremco, Dow Corning, and Pecora systems. We self-perform, carry $2M commercial general liability and WSIB coverage, and provide warranty documentation on completed scopes.",
    scopeHeading: "What we deliver",
    scopeBullets: [
      "Window and door perimeter caulking",
      "Expansion and control joint sealing",
      "Curtain wall, panel, and precast joint renewal",
      "Full-building sealant replacement programs",
      "Backer rod installation and bond-breaker prep",
      "Sika, Tremco, Dow Corning, Pecora systems",
      "Swing-stage, lift, and bosun's chair access",
      "Warranty documentation on installed systems",
    ],
    materialsHeading: "Sealant systems we apply",
    materials: [
      "Sika (Sikaflex, Sikasil)",
      "Tremco (Spectrem, Dymonic)",
      "Dow Corning (795, 791)",
      "Pecora (890NST, 895NST)",
    ],
    faqs: [
      {
        question: "When should building sealants be replaced?",
        answer:
          "Most exterior building sealants have a 10–20 year service life depending on product class and exposure. Visible signs to replace: cracking, loss of adhesion, hardening, gapping, or water infiltration. Property managers typically program a full envelope sealant replacement every 15 years.",
      },
      {
        question: "How much does caulking cost per linear foot?",
        answer:
          "Window perimeter and expansion joint caulking in the GTA typically runs $4–$9 per linear foot, depending on joint width, depth, access (ladder vs. swing-stage), and sealant grade. Full-building programs are scoped per joint type.",
      },
      {
        question: "What sealants do you use?",
        answer:
          "Sika (Sikaflex, Sikasil), Tremco (Spectrem, Dymonic), Dow Corning (795, 791), and Pecora (890NST, 895NST). System selection depends on joint movement, substrate, and exposure.",
      },
      {
        question: "Do you remove the old sealant?",
        answer:
          "Yes. Sealant renewal includes full removal of existing material, joint cleaning, primer application where required, backer rod installation, and tooled finish. Cap-bead-only work is only used when explicitly accepted by the owner.",
      },
      {
        question: "Can you do swing-stage and high-rise work?",
        answer:
          "Yes. We operate swing-stages, boom lifts, and bosun's chairs; crews carry working-at-heights and fall-protection certification.",
      },
      {
        question: "Do you do window perimeter caulking on residential homes?",
        answer:
          "Yes, as part of envelope and exterior repaint scopes. Standalone single-home caulking is available case by case.",
      },
      {
        question: "Are you licensed and insured?",
        answer:
          "Yes. $2M CGL and WSIB coverage. Certificates issued before mobilization.",
      },
    ],
    ctaSlug: "caulking-sealants-toronto",
    related: ["exterior-painting-toronto", "commercial-painting-gta"],
  },
};

/** Pretty display name for the `?service=` query param echoed on the estimate form */
export const WAVE1_PRETTY_NAMES: Record<string, string> = {
  "commercial-painting-gta": "Commercial Painting (GTA)",
  "fire-retardant-coatings-ontario": "Fire Retardant & Intumescent Coatings",
  "exterior-painting-toronto": "Exterior Painting (Toronto / GTA)",
  "caulking-sealants-toronto": "Caulking & Building Envelope Sealants",
};

export { TRUST_LINE };
