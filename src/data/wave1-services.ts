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
      "Ascent Group Construction is a specialty contractor that self-performs commercial painting as one of several trade scopes across the Greater Toronto Area, including Toronto, Mississauga, Brampton, Vaughan, and Markham. We deliver interior and exterior repaints for offices, warehouses, ICI facilities, retail plazas, and multi-tenant buildings — including after-hours and weekend scheduling to avoid tenant disruption. Every project is executed by our own crew, not subcontracted out. We carry $2M commercial general liability, full WSIB coverage, and our crew brings 15+ years of combined hands-on experience applying Benjamin Moore, Sherwin-Williams, and PPG systems.",
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
      "Ascent Group Construction is a specialty contractor delivering exterior painting and coating as part of our building-envelope scope across the Greater Toronto Area, including Toronto, Mississauga, Brampton, Vaughan, and Markham. We handle stucco repaints, EIFS recoats, brick and masonry coatings, metal siding, and commercial exterior refresh. Every project is self-performed by our own crew using manufacturer-specified elastomeric, acrylic, and weatherproof systems from Sherwin-Williams, Benjamin Moore, and Sto. We carry $2M commercial general liability, full WSIB coverage, and our crew brings 15+ years of combined building-envelope experience.",
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

  // ===================== WAVE 2 =====================

  "interior-painting-toronto": {
    slug: "interior-painting-toronto",
    title: "Interior Painting Contractor Toronto | Ascent Group",
    metaDescription:
      "Self-performed interior painting across Toronto and the GTA — offices, condos, retail, and homes. Low-VOC systems, off-hours scheduling, $2M CGL, WSIB-covered.",
    primaryKeyword: "interior painting contractor Toronto",
    secondaryKeywords: [
      "office interior painting Toronto",
      "condo unit painting GTA",
      "residential interior painters Toronto",
      "low-VOC interior paint",
    ],
    h1: "Interior Painting Contractor — Toronto & GTA",
    eyebrow: "Interior Painting",
    heroAlt: "Interior painting by Ascent Group Construction — Toronto and Greater Toronto Area",
    directAnswer:
      "Ascent Group Construction is a specialty contractor that self-performs interior painting as one trade within a broader envelope, restoration, and interior-finishes capability across Toronto and the Greater Toronto Area. We deliver interior repaints for offices, retail spaces, condos, multi-residential corridors, and residential homes, using low-VOC and zero-VOC systems from Benjamin Moore, Sherwin-Williams, and PPG. Every project includes full surface prep — patching, sanding, priming, and clean cut-lines — and is executed by our own crew. We carry $2M commercial general liability, full WSIB coverage, and our crew brings 15+ years of combined hands-on painting experience.",
    scopeHeading: "What we deliver",
    scopeBullets: [
      "Office interior repaints and tenant fit-outs",
      "Condo unit, common corridor, and stairwell painting",
      "Residential interior painting (walls, ceilings, trim, doors)",
      "Retail and showroom interiors",
      "Drywall patching, sanding, and prime before topcoat",
      "Low-VOC and zero-VOC systems for occupied spaces",
      "Off-hours and weekend scheduling for occupied units",
      "Furniture protection, daily clean, and dust control",
    ],
    materialsHeading: "Coating systems we apply",
    materials: [
      "Benjamin Moore Aura, Regal Select, Ultra Spec",
      "Sherwin-Williams ProMar 200, Emerald, Cashmere",
      "PPG Manor Hall and SPEEDHIDE interior",
      "Zero-VOC systems for occupied / sensitive environments",
    ],
    faqs: [
      {
        question: "How much does interior painting cost in Toronto?",
        answer:
          "Interior painting in Toronto typically runs $3.50–$7 per square foot of wall area, depending on ceiling height, prep condition, trim scope, and paint grade. A standard condo unit repaint is generally $1,800–$4,500. We provide a fixed-price proposal after a site walkthrough.",
      },
      {
        question: "How long does an interior repaint take?",
        answer:
          "A standard condo unit takes 2–4 days. A single-floor office of 2,000–4,000 sq ft typically takes 3–6 working days including prep. Larger commercial scopes are scheduled in phased zones to keep occupants working.",
      },
      {
        question: "Do you use low-VOC or zero-VOC paint?",
        answer:
          "Yes. For occupied offices, condos, healthcare, and sensitive environments we default to low-VOC systems (Benjamin Moore Aura, Sherwin-Williams Emerald) or zero-VOC options on request.",
      },
      {
        question: "Do you patch and repair drywall before painting?",
        answer:
          "Yes. Nail pops, anchor holes, hairline cracks, and minor drywall damage are patched, sanded, and primed as part of standard interior prep. Larger drywall repair is scoped separately and disclosed in the proposal.",
      },
      {
        question: "Do you paint ceilings and trim?",
        answer:
          "Yes. Ceilings, baseboards, casing, doors, and window trim are all in scope. Ceiling-only and trim-only scopes are also quoted as standalone work.",
      },
      {
        question: "Can you work evenings and weekends for occupied spaces?",
        answer:
          "Yes. Occupied offices, retail, and multi-tenant residential are routinely scheduled evenings and weekends so tenants and staff are not disrupted.",
      },
      {
        question: "Do you self-perform or subcontract?",
        answer:
          "We self-perform. Our painters are direct employees — quality, scheduling, and accountability stay with us.",
      },
      {
        question: "Are you insured and WSIB-covered?",
        answer:
          "Yes. $2M commercial general liability and full WSIB coverage. Certificates are issued before site mobilization.",
      },
    ],
    ctaSlug: "interior-painting-toronto",
    related: ["commercial-painting-gta", "handyman-patching-toronto"],
  },

  "residential-exterior-painting-gta": {
    slug: "residential-exterior-painting-gta",
    title: "Residential Exterior House Painters GTA | Ascent Group",
    metaDescription:
      "Exterior house painting across the GTA — stucco, siding, brick, trim, doors, and garages. Weather-window scheduling, premium exterior systems, $2M CGL, WSIB-covered.",
    primaryKeyword: "exterior house painters GTA",
    secondaryKeywords: [
      "residential exterior painting Toronto",
      "house painters Mississauga",
      "stucco painting homes GTA",
      "front door and trim painting Toronto",
    ],
    h1: "Residential Exterior House Painters — Greater Toronto Area",
    eyebrow: "Residential Exterior Painting",
    heroAlt: "Residential exterior house painting by Ascent Group Construction — Greater Toronto Area",
    directAnswer:
      "Ascent Group Construction is a specialty contractor that self-performs residential exterior painting alongside our commercial envelope, EIFS, and restoration trades across the Greater Toronto Area. For detached homes, townhomes, and semi-detached properties we repaint stucco, fibre-cement and wood siding, brick, fascia, soffits, trim, doors, and garages using premium exterior systems from Sherwin-Williams, Benjamin Moore, and Sto. Every project includes pressure washing, substrate repair, primer where required, and a weather-window schedule to protect cure times. We carry $2M commercial general liability, full WSIB coverage, and our crew brings 15+ years of combined exterior painting experience.",
    scopeHeading: "What we deliver",
    scopeBullets: [
      "Full-house exterior repaints (stucco, siding, brick)",
      "Front door, trim, fascia, soffit, and eavestrough painting",
      "Garage door painting and refinishing",
      "Deck, fence, and railing staining or painting",
      "Pressure wash, scrape, sand, and prep before coating",
      "Substrate repair: minor stucco cracks, caulk renewal, wood repair",
      "Premium exterior systems with 10–25 year manufacturer warranties",
      "Weather-window scheduling and lawn / landscape protection",
    ],
    materialsHeading: "Coating systems we apply",
    materials: [
      "Sherwin-Williams Emerald Exterior, SuperPaint, Loxon (stucco)",
      "Benjamin Moore Aura Exterior, Regal Select Exterior",
      "Sto and Dryvit elastomeric systems for stucco / EIFS recoats",
      "Solid and semi-transparent stains for wood and decks",
    ],
    faqs: [
      {
        question: "How much does it cost to paint the exterior of a house in the GTA?",
        answer:
          "Most full-house exterior repaints in the GTA run $4,500–$14,000 for an average detached home, depending on size, substrate (stucco, siding, brick), prep condition, trim scope, and number of stories. A fixed-price proposal is provided after a site walkthrough.",
      },
      {
        question: "How long does an exterior house repaint take?",
        answer:
          "A typical detached home takes 4–8 working days from pressure wash through final coat, weather permitting. Townhomes and semis are usually 3–5 days.",
      },
      {
        question: "What's the best time of year to paint the exterior in Ontario?",
        answer:
          "Mid-April through late October, with surface and air temperatures above the manufacturer minimum (typically 10°C) and a dry window of 24–48 hours after application. We monitor forecasts and schedule accordingly.",
      },
      {
        question: "Can you paint stucco, siding, and brick?",
        answer:
          "Yes. Stucco gets an elastomeric or acrylic system, siding gets a flexible 100% acrylic exterior, and brick gets a breathable mineral-silicate or masonry acrylic when painting is the right call. We will recommend against painting brick when it isn't.",
      },
      {
        question: "Do you paint front doors, garage doors, and trim?",
        answer:
          "Yes — front door refinishing, garage door painting, fascia, soffit, and trim are all in scope, either as part of a full-house repaint or as standalone work.",
      },
      {
        question: "Do you pressure wash before painting?",
        answer:
          "Yes. Pressure wash, scrape, sand, prime, and minor substrate repair (caulk, cracks, wood) are standard prep before the first coat.",
      },
      {
        question: "Do you protect landscaping and lawns?",
        answer:
          "Yes. We tarp shrubs, protect walkways, and clean up daily. Final walk-through covers any landscape touch-up before sign-off.",
      },
      {
        question: "Are you licensed and insured?",
        answer:
          "Yes. $2M commercial general liability and full WSIB coverage. Certificates issued before mobilization.",
      },
    ],
    ctaSlug: "residential-exterior-painting-gta",
    related: ["exterior-painting-toronto", "interior-painting-toronto"],
  },

  "tile-installation-toronto": {
    slug: "tile-installation-toronto",
    title: "Tile Installation Contractor Toronto | Ascent Group",
    metaDescription:
      "Tile installation across Toronto and the GTA — porcelain, ceramic, stone, and large-format. Schluter and Mapei waterproofing, commercial washrooms, lobbies, and residential bath/kitchen.",
    primaryKeyword: "tile installation contractor Toronto",
    secondaryKeywords: [
      "porcelain tile installation Toronto",
      "bathroom tile contractor GTA",
      "commercial washroom tile",
      "large-format tile installer Toronto",
    ],
    h1: "Tile Installation Contractor — Toronto & GTA",
    eyebrow: "Tile Installation",
    heroAlt: "Tile installation by Ascent Group Construction — Toronto and Greater Toronto Area",
    directAnswer:
      "Ascent Group Construction is a specialty contractor that self-performs tile installation as one of our interior-finishing trades across Toronto and the Greater Toronto Area. We install porcelain, ceramic, natural stone, and large-format tile across commercial washrooms, retail floors, lobbies, residential bathrooms, kitchens, and entryways. Wet areas are waterproofed with Schluter-KERDI or Mapei Mapelastic systems before tile setting, and all installations follow TTMAC and TCNA guidelines. We carry $2M commercial general liability and full WSIB coverage, and our crew brings 15+ years of combined tile and stone installation experience.",
    scopeHeading: "What we deliver",
    scopeBullets: [
      "Porcelain, ceramic, and natural stone tile installation",
      "Large-format tile (24x24, 24x48, slabs) with proper mortar coverage",
      "Schluter-KERDI and Mapei Mapelastic waterproofing for wet areas",
      "Commercial washrooms, lobbies, and retail floors",
      "Residential bathrooms, kitchens, backsplashes, and entryways",
      "Custom shower pans, niches, and curbless / barrier-free showers",
      "Heated floor systems (Schluter DITRA-HEAT, NuHeat)",
      "Grout, sealing, and movement-joint detailing per TCNA",
    ],
    materialsHeading: "Systems we install",
    materials: [
      "Schluter-KERDI waterproofing and DITRA uncoupling membranes",
      "Mapei Mapelastic AquaDefense and Ultracolor Plus FA grout",
      "Laticrete HYDRO BAN and SpectraLOCK epoxy grout",
      "Custom Building Products thin-set and large-format mortars",
    ],
    faqs: [
      {
        question: "How much does tile installation cost in Toronto?",
        answer:
          "Tile installation in the GTA typically runs $9–$22 per square foot for labour, depending on tile size, substrate prep, waterproofing scope, and pattern complexity. Large-format tile and natural stone sit at the higher end. Waterproofing for wet areas is quoted separately. Material is owner-supplied or marked up at cost.",
      },
      {
        question: "Do you waterproof showers and wet areas?",
        answer:
          "Yes. Showers, wet rooms, and steam showers are waterproofed with Schluter-KERDI or Mapei Mapelastic systems applied to manufacturer specification before any tile is set. Flood-test results are documented before tiling.",
      },
      {
        question: "Can you install large-format tile and slabs?",
        answer:
          "Yes. We follow TCNA guidance for large-format installation: proper substrate flatness, large-format mortar, back-buttering, and 80–95% mortar coverage. Slabs and gauged porcelain panels are within scope.",
      },
      {
        question: "Do you do natural stone — marble, travertine, granite?",
        answer:
          "Yes. Natural stone requires specific setting materials, sealing, and crystallization or honing for some finishes. We confirm the substrate, setting system, and sealer before quoting.",
      },
      {
        question: "Do you install heated floor systems?",
        answer:
          "Yes. Schluter DITRA-HEAT and NuHeat electric mat systems are installed under tile in bathrooms, kitchens, and entryways. Thermostat wiring is coordinated with a licensed electrician.",
      },
      {
        question: "Can you remove existing tile?",
        answer:
          "Yes. Tile demolition, substrate assessment, and disposal are in scope. We assess for asbestos in older mortar beds before disturbing pre-1990 installations.",
      },
      {
        question: "Do you handle commercial washroom and lobby tile?",
        answer:
          "Yes — institutional and commercial washroom, kitchen, and lobby tile is a core scope. We work to the architect's spec and provide submittals on request.",
      },
      {
        question: "Are you licensed and insured?",
        answer:
          "Yes. $2M commercial general liability and full WSIB coverage. Certificates issued before mobilization.",
      },
    ],
    ctaSlug: "tile-installation-toronto",
    related: ["flooring-installation-gta", "interior-painting-toronto"],
  },

  "flooring-installation-gta": {
    slug: "flooring-installation-gta",
    title: "Flooring Contractor GTA | LVT, Laminate, Hardwood | Ascent",
    metaDescription:
      "Flooring installation across the GTA — luxury vinyl plank, laminate, engineered hardwood, sheet vinyl, and commercial roll goods. $2M CGL, WSIB-covered, self-performed.",
    primaryKeyword: "flooring contractor GTA",
    secondaryKeywords: [
      "LVT installation Toronto",
      "laminate flooring installer GTA",
      "engineered hardwood Toronto",
      "commercial vinyl flooring contractor",
    ],
    h1: "Flooring Installation Contractor — Greater Toronto Area",
    eyebrow: "Flooring Installation",
    heroAlt: "Flooring installation by Ascent Group Construction — Greater Toronto Area",
    directAnswer:
      "Ascent Group Construction is a specialty contractor that self-performs flooring installation as one of our interior-finishing trades across the Greater Toronto Area. We install luxury vinyl plank (LVP/LVT), laminate, engineered hardwood, sheet vinyl, and commercial vinyl roll goods across offices, retail, condos, multi-residential, and residential homes. Substrate prep — moisture testing, levelling compound, and underlayment — is part of every scope, and installations follow NWFA and CRI guidelines. Hardwood sand-and-refinish work is delivered through a vetted partner crew and identified upfront. We carry $2M commercial general liability and full WSIB coverage.",
    scopeHeading: "What we deliver",
    scopeBullets: [
      "Luxury vinyl plank and tile (LVP/LVT) — click-lock and glue-down",
      "Laminate flooring (residential and light commercial)",
      "Engineered hardwood installation",
      "Sheet vinyl and commercial vinyl roll goods",
      "Underlayment, moisture barrier, and acoustic mat (condo IIC ratings)",
      "Self-levelling compound and substrate prep",
      "Baseboard and quarter-round trim install",
      "Hardwood sand-and-refinish via vetted partner (disclosed in proposal)",
    ],
    materialsHeading: "Brands and systems we install",
    materials: [
      "Shaw, Mohawk, Mannington LVT/LVP",
      "Karndean and COREtec luxury vinyl",
      "Mirage, Lauzon, Preverco engineered hardwood",
      "Armstrong and Tarkett commercial sheet vinyl",
      "Mapei and Ardex self-levellers and adhesives",
    ],
    faqs: [
      {
        question: "How much does flooring installation cost in the GTA?",
        answer:
          "Installation labour in the GTA typically runs: LVP/LVT $2.50–$4.50/sq ft, laminate $2–$3.50/sq ft, engineered hardwood $3.50–$6/sq ft, sheet vinyl $3–$5/sq ft. Substrate prep, levelling, and demolition are quoted separately. Materials are owner-supplied or marked up at cost.",
      },
      {
        question: "Do you do hardwood sanding and refinishing?",
        answer:
          "Hardwood sand-and-refinish is delivered through a vetted partner crew and called out clearly in the proposal — we don't pretend it's in-house. Install of pre-finished engineered hardwood is self-performed.",
      },
      {
        question: "Do you do moisture testing and substrate prep?",
        answer:
          "Yes. Concrete moisture is tested (RH or calcium chloride) before glue-down vinyl or hardwood. Self-levelling compound is applied where the substrate exceeds manufacturer flatness tolerance.",
      },
      {
        question: "Can you install acoustic underlayment for condos?",
        answer:
          "Yes. We install acoustic mats rated to condo IIC/STC requirements (typically IIC 60+) and provide product data for property manager / board approval.",
      },
      {
        question: "Do you handle demolition of existing flooring?",
        answer:
          "Yes. Tear-out and disposal of existing carpet, vinyl, laminate, and hardwood are in scope. Pre-1990 vinyl and adhesive are assessed for asbestos before disturbance.",
      },
      {
        question: "Can you install commercial vinyl in offices and clinics?",
        answer:
          "Yes. Commercial sheet vinyl, heat-welded seams, and integral cove base for clinics, labs, and institutional spaces are within scope.",
      },
      {
        question: "How long does flooring installation take?",
        answer:
          "A standard 1,000 sq ft condo or office takes 2–4 working days including demolition, prep, install, and trim. Larger commercial floors are phased to keep the space partially operational.",
      },
      {
        question: "Are you licensed and insured?",
        answer:
          "Yes. $2M commercial general liability and full WSIB coverage. Certificates issued before mobilization.",
      },
    ],
    ctaSlug: "flooring-installation-gta",
    related: ["tile-installation-toronto", "interior-painting-toronto"],
  },

  "handyman-patching-toronto": {
    slug: "handyman-patching-toronto",
    title: "Drywall Patching & Handyman Services Toronto | Ascent",
    metaDescription:
      "Drywall patching, paint touch-ups, and small-scope handyman services across Toronto and the GTA — turnovers, punch-list, property management. $2M CGL, WSIB-covered.",
    primaryKeyword: "drywall patching and handyman Toronto",
    secondaryKeywords: [
      "drywall repair Toronto",
      "handyman services GTA",
      "tenant turnover repairs Toronto",
      "punch-list contractor commercial",
    ],
    h1: "Drywall Patching & Handyman Services — Toronto & GTA",
    eyebrow: "Patching & Handyman",
    heroAlt: "Drywall patching and handyman services by Ascent Group Construction — Toronto and GTA",
    directAnswer:
      "Ascent Group Construction provides drywall patching and small-scope handyman services across Toronto and the Greater Toronto Area for property managers, condo boards, commercial owners, and homeowners. We handle drywall patching, paint touch-ups, small carpentry, door and lock adjustments, fixture swaps, minor tile and grout repair, and tenant turnover punch-lists. Licensed electrical and plumbing work is referred to qualified trades — we don't pretend otherwise. We self-perform, carry $2M commercial general liability, full WSIB coverage, and our crew brings 15+ years of combined trades experience.",
    scopeHeading: "What we deliver",
    scopeBullets: [
      "Drywall patching: nail pops, anchor holes, hairline cracks, larger patch repairs",
      "Paint touch-ups and small repaint scopes",
      "Small carpentry: trim repair, shelving, baseboard, casing",
      "Door adjustments, hinge replacement, lockset and deadbolt swaps",
      "Fixture swaps: towel bars, blinds, curtain rods, mirrors, accessories",
      "Minor tile and grout repair (replace cracked tiles, regrout joints)",
      "Tenant turnover punch-lists for property managers",
      "Commercial post-construction punch-list resolution",
    ],
    materialsHeading: "Out of scope (handled by licensed trades)",
    materials: [
      "Licensed electrical work — referred to ESA-licensed electrician",
      "Licensed plumbing rough-in — referred to licensed plumber",
      "HVAC repair — referred to TSSA-certified contractor",
      "Gas appliance connection — referred to TSSA-certified contractor",
    ],
    faqs: [
      {
        question: "How much does drywall patching cost in Toronto?",
        answer:
          "Small drywall patches (nail pops, anchor holes, hairline cracks) typically run $250–$500 for a minimum visit. Larger patches (10\"+ holes, water damage, multiple rooms) are quoted by scope. Touch-up painting after patching is included on request.",
      },
      {
        question: "Is there a minimum visit charge?",
        answer:
          "Yes. Our standard minimum is a 2-hour visit. For property managers with multiple units on the same property or street, we bundle visits to reduce per-unit cost.",
      },
      {
        question: "Do you do tenant turnover repairs?",
        answer:
          "Yes — this is a core scope for property managers and condo boards. Standard turnover: full patch, paint touch-up, fixture re-tighten, door adjustments, and a written punch-list report.",
      },
      {
        question: "Do you do electrical or plumbing work?",
        answer:
          "No. Licensed electrical, plumbing, gas, and HVAC work is referred to qualified trades. We handle fixture swaps and finish-level work that doesn't require a permit.",
      },
      {
        question: "Can you match existing paint colour?",
        answer:
          "Yes. Existing paint is colour-matched on a sample or matched to the original product code if known. Sheen and batch variation can leave a visible 'picture frame' on flat finishes — we'll flag that before starting and recommend full-wall touch-up where it matters.",
      },
      {
        question: "Can you handle commercial post-construction punch-lists?",
        answer:
          "Yes. We close out post-construction punch-lists for GCs, owners, and tenants — patching, touch-up, door fit, trim, and hardware adjustments. Sign-off is documented per item.",
      },
      {
        question: "How fast can you respond?",
        answer:
          "Most small-scope visits in the GTA can be scheduled within 5–10 business days. Property manager retainer agreements get priority scheduling.",
      },
      {
        question: "Are you insured and WSIB-covered?",
        answer:
          "Yes. $2M commercial general liability and full WSIB coverage. Certificates issued on request before site work.",
      },
    ],
    ctaSlug: "handyman-patching-toronto",
    related: ["interior-painting-toronto", "tile-installation-toronto"],
  },
};

/** Pretty display name for the `?service=` query param echoed on the estimate form */
export const WAVE1_PRETTY_NAMES: Record<string, string> = {
  "commercial-painting-gta": "Commercial Painting (GTA)",
  "fire-retardant-coatings-ontario": "Fire Retardant & Intumescent Coatings",
  "exterior-painting-toronto": "Exterior Painting (Toronto / GTA)",
  "caulking-sealants-toronto": "Caulking & Building Envelope Sealants",
  "interior-painting-toronto": "Interior Painting (Toronto / GTA)",
  "residential-exterior-painting-gta": "Residential Exterior House Painting (GTA)",
  "tile-installation-toronto": "Tile Installation (Toronto / GTA)",
  "flooring-installation-gta": "Flooring Installation (GTA)",
  "handyman-patching-toronto": "Drywall Patching & Handyman (Toronto / GTA)",
};

export { TRUST_LINE };
