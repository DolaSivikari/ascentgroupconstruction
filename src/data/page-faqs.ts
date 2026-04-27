/**
 * Page-level FAQ datasets used by FAQAccordion / PeopleAlsoAsk components.
 * Each list emits FAQPage JSON-LD for AEO/voice-search coverage.
 */

import type { FAQItem } from "@/design-system/components/FAQAccordion";

export const marketsFaqs: FAQItem[] = [
  {
    question: "Which sectors does Ascent Group serve?",
    answer:
      "We serve property managers, commercial owners, homeowners, developers, and general contractors across Ontario and the GTA — with deep specialization in building envelope, restoration, and interior trade scopes.",
  },
  {
    question: "Do you work as a sub-trade for general contractors?",
    answer:
      "Yes. We are a reliable specialty trade partner for GCs, providing self-performed envelope, masonry, EIFS, painting, and interior finishing scopes with full safety documentation, daily reporting, and accountable site leadership.",
  },
  {
    question: "Can property managers schedule recurring envelope maintenance?",
    answer:
      "Absolutely. We support multi-year capital plans for property managers — sealant renewal cycles, envelope inspections, parking-garage repair programs, and balcony/cladding restoration with minimal tenant disruption.",
  },
  {
    question: "Do you take on residential projects?",
    answer:
      "Yes. Homeowners can engage us for interior renovations, painting, tile and flooring, and exterior finishing. We bring the same documented process and crew accountability used on our commercial projects.",
  },
];

export const servicesFaqs: FAQItem[] = [
  {
    question: "What are Ascent Group's core service categories?",
    answer:
      "Three categories: Building Envelope (EIFS, masonry, sealants, cladding, waterproofing), Restoration (concrete, parking garages, balconies), and Interior Trades (painting, tile, drywall, finishes).",
  },
  {
    question: "Are you certified by major envelope-system manufacturers?",
    answer:
      "Yes. We are a Sto Canada Listed Installer (Modules SCL-001 through SCL-010) and execute Dryvit, Parex, Benjamin Moore, and Sherwin-Williams systems to manufacturer specifications.",
  },
  {
    question: "Do you self-perform or sub-contract the work?",
    answer:
      "We self-perform approximately 85% of every scope. We only sub-trade specialized equipment work (e.g. swing-stage rigging) and maintain direct oversight on sub-trade activities.",
  },
  {
    question: "How do I get pricing for a defined scope?",
    answer:
      "Request an estimate with your scope, drawings, or RFP. We respond with a detailed line-item proposal including specifications, schedule, and exclusions — typically within 2-5 business days.",
  },
];

export const aboutFaqs: FAQItem[] = [
  {
    question: "When was Ascent Group Construction founded?",
    answer:
      "Ascent Group Construction was formalized in 2025 to bring 15+ years of combined building envelope and interior trade experience directly to clients without subcontractor markup layers.",
  },
  {
    question: "What is Ascent Group's approach to safety?",
    answer:
      "We are WSIB compliant with $2M commercial general liability coverage, follow site-specific safety plans on every job, and conduct toolbox talks before mobilization. Safety documentation is available on request.",
  },
  {
    question: "Who founded Ascent Group?",
    answer:
      "Hebun Isik founded Ascent Group Construction in 2025 after 15+ years delivering envelope restoration, EIFS installation, masonry repair, and interior finishing across the GTA.",
  },
];

export const contactFaqs: FAQItem[] = [
  {
    question: "How quickly does Ascent Group respond to inquiries?",
    answer:
      "We typically respond to inquiries within one business day. For urgent envelope issues (active leaks, storm damage), we aim to attend the site within 48–72 hours.",
  },
  {
    question: "Where is Ascent Group based?",
    answer:
      "Our office is at 2 Jody Ave, North York, ON M3N 1H1. We serve the City of Toronto, Mississauga, Brampton, Vaughan, Markham, Oakville, Burlington, Hamilton, and broader Ontario.",
  },
  {
    question: "What's the best way to send drawings, specs, or an RFP?",
    answer:
      "Use our Submit RFP form to upload drawings, specs, and tender documents directly to our project team. For general questions, the contact form is the fastest route.",
  },
];

export const capabilitiesFaqs: FAQItem[] = [
  {
    question: "What does it mean that Ascent Group self-performs 85% of work?",
    answer:
      "85% of every project scope is executed by our own crew — not subcontractors. This eliminates markup layers, ensures consistent quality, and gives clients direct accountability with the people on site.",
  },
  {
    question: "What size projects can Ascent Group handle?",
    answer:
      "Our current sweet spot is $25K to $500K — ranging from emergency repairs through multi-phase restoration programs for property managers and general contractors.",
  },
  {
    question: "What insurance and bonding does Ascent Group carry?",
    answer:
      "Active WSIB clearance and $2M commercial general liability coverage. Bonding capacity is being formally established as project value scales. All documents are available for prequalification packages.",
  },
];

export const ourProcessFaqs: FAQItem[] = [
  {
    question: "How long does the full Ascent Group process take?",
    answer:
      "From inquiry through closeout, a typical mid-sized project takes 3–8 weeks depending on scope. Inquiry-to-proposal averages 1–2 weeks; mobilization through closeout depends on scope size and access constraints.",
  },
  {
    question: "What documents do I receive at closeout?",
    answer:
      "A full closeout binder including punch-list resolution, manufacturer warranty certificates, product data sheets, daily progress photos, weekly reports, and lien releases.",
  },
  {
    question: "Do you offer warranty service after the project ends?",
    answer:
      "Yes. We provide warranty service for deficiency claims, maintenance guidance, priority scheduling for follow-up scopes, and emergency response for active leaks or storm damage.",
  },
];

// ─── Tier 2: Audience pages ─────────────────────────────────────────────

export const propertyManagersFaqs: FAQItem[] = [
  {
    question: "Do you work in occupied condominium and rental buildings?",
    answer:
      "Yes — most of our property-management work is in occupied 10–30 storey buildings. We phase scopes around tenant access, run after-hours sealant and balcony work where required, and coordinate notice letters with the property manager before mobilization.",
  },
  {
    question: "Is your work aligned with reserve fund study recommendations?",
    answer:
      "Yes. We scope and quote envelope, parking-garage, and balcony work in line with reserve fund study (RFS) line items and provide documentation suitable for board approval and capital planning.",
  },
  {
    question: "How fast can you respond to an active leak or facade issue?",
    answer:
      "We aim for a 48–72 hour site visit on active water intrusion or urgent facade conditions for property managers in the GTA, followed by temporary containment and a written remediation plan.",
  },
  {
    question: "Can you handle multi-property maintenance contracts?",
    answer:
      "Yes. We support portfolio-level programs — recurring sealant cycles, balcony inspections, common-area refresh — with consistent crew leads, predictable scheduling, and volume pricing for repeated scopes.",
  },
  {
    question: "What documentation do property managers receive at closeout?",
    answer:
      "A closeout package suited to board reporting: scope confirmation, daily progress photos, manufacturer warranties (Sto, Dryvit, Sika, etc.), product data sheets, WSIB clearance, and CGL certificate.",
  },
];

export const commercialClientsFaqs: FAQItem[] = [
  {
    question: "Do you work after hours and on weekends?",
    answer:
      "Yes. For office buildings, retail, and hospitality clients we routinely schedule painting, coatings, and finishing work after hours and on weekends to avoid disrupting business operations.",
  },
  {
    question: "Are your materials safe for occupied commercial spaces?",
    answer:
      "We default to low-VOC and zero-odor product lines for occupied environments — including healthcare and education — and follow manufacturer ventilation guidance during application and cure.",
  },
  {
    question: "Can you phase work around tenant operations?",
    answer:
      "Yes. We deliver phased execution by floor, suite, or zone with daily walkdowns and dust/odor controls so the building stays operational throughout the project.",
  },
  {
    question: "What insurance do you carry for commercial properties?",
    answer:
      "Active WSIB clearance and $2M commercial general liability coverage. COIs naming the building owner / property manager as additional insured are issued within 24 hours of request.",
  },
];

export const homeownersFaqs: FAQItem[] = [
  {
    question: "Do you charge for residential estimates?",
    answer:
      "No. Residential estimates are no-obligation and free. After a site visit we deliver a detailed written quote — typically within 2–3 business days — including itemized scope, materials, and timeline.",
  },
  {
    question: "Are you fully insured for residential work?",
    answer:
      "Yes. We carry $2M commercial general liability insurance and active WSIB clearance — the same coverage we use on commercial sites. COIs are available on request.",
  },
  {
    question: "How long do typical residential projects take?",
    answer:
      "Most painting projects run 3–7 days, tile and flooring 3–8 days, and full renovations 1–4 weeks. You'll receive a project-specific timeline with your written estimate.",
  },
  {
    question: "Do you offer warranty on residential workmanship?",
    answer:
      "Yes. Workmanship warranties typically run 1–2 years depending on scope, plus full manufacturer warranties on materials. Warranty terms are written into every contract.",
  },
  {
    question: "Which areas do you serve for residential work?",
    answer:
      "Toronto and the broader GTA — including Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, and Burlington. Contact us to confirm coverage in your community.",
  },
];

export const generalContractorsFaqs: FAQItem[] = [
  {
    question: "How fast is your bid turnaround for trade packages?",
    answer:
      "Standard envelope and finish packages typically receive unit pricing within 48 hours. Larger or complex tenders with mock-up requirements may take 3–5 business days.",
  },
  {
    question: "Which trade packages do you self-perform?",
    answer:
      "EIFS / stucco, masonry restoration, sealant programs, balcony waterproofing, protective coatings, painting, and tile / flooring — approximately 85% executed by our own crew without sub-tier markups.",
  },
  {
    question: "Are you on bidding platforms like DataBid and ConstructConnect?",
    answer:
      "Yes. We are active on DataBid, ConstructConnect, and accept direct invitations to tender. Send tender documents to projects@ascentgroupconstruction.com to add us to your bidders list.",
  },
  {
    question: "Can you provide a complete prequalification package?",
    answer:
      "Yes. Our prequalification package includes WSIB clearance, $2M CGL certificate, safety policies, COR-aligned training records, references, and project experience — available through the Contractor Portal.",
  },
  {
    question: "Do you handle daily reporting and RFI turnaround on GC projects?",
    answer:
      "A dedicated project lead is assigned to every job, providing daily photo updates, schedule tracking, and 24-hour RFI turnaround so your superintendent stays ahead.",
  },
];

export const architectsFaqs: FAQItem[] = [
  {
    question: "Are you familiar with hygrothermal modeling and WUFI assumptions?",
    answer:
      "Yes. We coordinate detailing with the consultant's WUFI inputs — vapor permeance, dew point location, drainage plane continuity — so the as-built assembly matches the modeled performance.",
  },
  {
    question: "Which envelope standards do you build to?",
    answer:
      "OBC SB-10/SB-12, ASHRAE 90.1, CSA A371, CCMC EIFS evaluations, ABAA air barrier details, and ASTM testing protocols (E1105, E2178, C1363) referenced in your specifications.",
  },
  {
    question: "Can you support field testing and mock-up reviews?",
    answer:
      "Yes. We coordinate ASTM E1105 and AAMA 501.2 field water tests, build full-assembly mock-ups, and align our schedule to your envelope consultant's review milestones.",
  },
  {
    question: "Do you provide submittals, shop drawings, and product data?",
    answer:
      "Yes. Submittals are formatted to your specification division, with shop drawings, product data sheets, samples, and warranty information packaged for review prior to mobilization.",
  },
];

export const emergencyRepairFaqs: FAQItem[] = [
  {
    question: "How fast can you get a crew on-site for an active leak?",
    answer:
      "We aim for same-day site assessment for active water infiltration and facade failures across the GTA. After triage by phone, a crew lead attends to document conditions and apply temporary containment.",
  },
  {
    question: "Do you handle insurance documentation for storm and water damage?",
    answer:
      "Yes. We document existing conditions with photos, provide written assessments, and coordinate scope and pricing in formats suitable for insurance claims and adjuster review.",
  },
  {
    question: "Can you provide temporary containment before permanent repair?",
    answer:
      "Yes. Tarping, temporary sealant, water diversion, and shoring are deployed first to stop ongoing damage while we scope, price, and schedule the permanent envelope or restoration repair.",
  },
  {
    question: "What areas do you cover for emergency response?",
    answer:
      "All of Toronto and the broader GTA — Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Burlington, Hamilton, and surrounding municipalities.",
  },
];

export const projectsFaqs: FAQItem[] = [
  {
    question: "How does Ascent Group select projects to feature?",
    answer:
      "Featured projects span our three core service categories — building envelope, restoration, and interior trades — across commercial, multi-residential, institutional, and industrial sectors throughout the GTA.",
  },
  {
    question: "Can I request a similar project to one in your portfolio?",
    answer:
      "Yes. Use our Submit RFP form or request an estimate referencing the project type, and we'll respond with scope confirmation, schedule options, and detailed pricing within 2-5 business days.",
  },
  {
    question: "Do you publish before-and-after photography for restoration projects?",
    answer:
      "When client approvals allow, we publish before-and-after photo documentation on project case studies — particularly for façade restoration, masonry repair, and balcony waterproofing scopes.",
  },
];

// ─── Tier 3: Supporting & dynamic templates ─────────────────────────────

export const careersFaqs: FAQItem[] = [
  {
    question: "What roles does Ascent Group typically hire for?",
    answer:
      "Envelope and coatings installers (EIFS, stucco, sealants, waterproofing), restoration and masonry trades, painters and interior finishers, project coordinators, and estimators. We hire year-round as projects scale.",
  },
  {
    question: "Do I need formal certifications to apply?",
    answer:
      "Working at Heights certification is an asset for field roles. Valid Ontario driver's licence is preferred for site-mobile positions. We invest in additional certifications (WHMIS, fall protection refreshers) for the right candidates.",
  },
  {
    question: "What is the hiring process like?",
    answer:
      "Submit your resume — every submission is reviewed. Shortlisted candidates are invited for a phone screen, then a working interview or site visit so both sides can confirm fit before any offer.",
  },
  {
    question: "Do you hire apprentices or entry-level tradespeople?",
    answer:
      "Yes. We pair junior tradespeople with experienced crew leads on real scopes — envelope, restoration, painting, and finishing — so growth happens on the tools, not in a classroom.",
  },
];

export const technologyFaqs: FAQItem[] = [
  {
    question: "What software does Ascent Group use day-to-day?",
    answer:
      "Bluebeam Revu and PlanSwift for takeoffs and markups, ZZTAKEOFF for envelope quantities, Procore and BIM 360 for project coordination, and AutoCAD/DWG for shop drawings and detail review.",
  },
  {
    question: "Do you provide digital closeout packages?",
    answer:
      "Yes. Every project closes with a digital binder: punch-list resolution, manufacturer warranty certificates, product data sheets, daily progress photos, weekly reports, and lien releases.",
  },
  {
    question: "Can you integrate with our project management platform?",
    answer:
      "Yes. We routinely operate inside client-hosted Procore, BIM 360, Aconex, and SharePoint environments — uploading dailies, RFIs, submittals, and closeout documentation directly to your system of record.",
  },
];

export const certificationsFaqs: FAQItem[] = [
  {
    question: "What insurance does Ascent Group carry?",
    answer:
      "$2,000,000 Commercial General Liability coverage and full WSIB compliance. Certificates of Insurance naming the building owner or general contractor as additional insured are issued within 24 hours of request.",
  },
  {
    question: "Are you bonded?",
    answer:
      "Bonding capacity is being formally established with our surety partners as project value scales. Payment and performance bonds can be arranged for projects requiring them.",
  },
  {
    question: "Which manufacturer certifications do you hold?",
    answer:
      "Sto Canada Listed Installer (Modules SCL-001 through SCL-010). We also execute Dryvit, Parex, Sika, Benjamin Moore, and Sherwin-Williams systems to manufacturer specifications.",
  },
  {
    question: "How do I request your prequalification package?",
    answer:
      "Visit our Contractor Portal to download the vendor packet — WSIB clearance, $2M CGL certificate, safety policies, training records, references, and project experience — formatted for procurement review.",
  },
];

export const developersFaqs: FAQItem[] = [
  {
    question: "Do you work with developers on new construction?",
    answer:
      "Yes. We partner with developers on envelope and interior trade scopes for new mid-rise and commercial developments — coordinating directly with the construction manager or general contractor on the project.",
  },
  {
    question: "Can you support phased deliveries on multi-building projects?",
    answer:
      "Yes. We sequence crew deployment, materials, and inspections across phased releases — keeping pace with the construction schedule without compromising envelope detailing or warranty integrity.",
  },
  {
    question: "Do you provide budget input during pre-construction?",
    answer:
      "Yes. We support pre-construction with envelope assembly costing, value-engineering options, and constructability reviews so design decisions land on budget before tender.",
  },
];

export const contractorPortalFaqs: FAQItem[] = [
  {
    question: "What is in the vendor packet?",
    answer:
      "The vendor packet includes WSIB clearance, $2M CGL certificate, safety policies, COR-aligned training records, sample COIs, references, and project experience — everything procurement needs to onboard us.",
  },
  {
    question: "How fast do you respond to RFQs and tender invitations?",
    answer:
      "Standard envelope and finish packages receive unit pricing within 48 hours. Complex tenders with mock-ups or hygrothermal review may take 3–5 business days. Tight deadlines? Call us before sending.",
  },
  {
    question: "Are you on DataBid, ConstructConnect, and BidCentral?",
    answer:
      "Yes — we monitor DataBid and ConstructConnect daily. Send tender documents directly to projects@ascentgroupconstruction.com to add us to your bidders list for upcoming GTA opportunities.",
  },
  {
    question: "Do you have unit rates for common scopes?",
    answer:
      "Yes. Request unit rates through the Contractor Portal form for sealant work, EIFS, balcony waterproofing, masonry repair, and protective coatings — rates returned within 48 hours.",
  },
];

export const serviceAreasFaqs: FAQItem[] = [
  {
    question: "Do you charge travel fees outside the GTA core?",
    answer:
      "No travel fees inside the GTA core (Toronto, Mississauga, Brampton, Vaughan, Markham). Mobilization for outer regions (Hamilton, Kitchener, Barrie) is quoted as a separate line item only when applicable.",
  },
  {
    question: "How fast can you mobilize for emergency calls in the GTA?",
    answer:
      "We aim for same-day site assessment within Toronto and the inner GTA for active leaks and envelope failures, and 48–72 hour response across the broader GTA.",
  },
  {
    question: "Will you take projects outside Southern Ontario?",
    answer:
      "Larger commercial and multi-unit developments are considered province-wide on a case-by-case basis. Contact us with project specifics — we'll confirm coverage and mobilization terms.",
  },
];

export const serviceDetailFaqs: FAQItem[] = [
  {
    question: "Do you provide a written scope and price before starting?",
    answer:
      "Always. Every engagement begins with a written scope, line-item pricing, schedule, and exclusions. No work starts until both parties have signed off on scope and terms.",
  },
  {
    question: "What warranty comes with this service?",
    answer:
      "Workmanship warranties typically run 1–2 years (longer on envelope assemblies), plus full manufacturer warranties on all systems and materials. Warranty terms are written into every contract.",
  },
  {
    question: "How disruptive is the work to building occupants?",
    answer:
      "We design scope phasing around tenant access, building hours, and dust/odor controls. After-hours and weekend execution is available for occupied commercial and multi-residential buildings.",
  },
];

export const projectDetailFaqs: FAQItem[] = [
  {
    question: "Can I get pricing for a project like this one?",
    answer:
      "Yes. Submit an estimate request referencing this project — include your scope, drawings, and timing. We'll respond with line-item pricing and schedule options within 2–5 business days.",
  },
  {
    question: "Do you provide references from similar projects?",
    answer:
      "Yes. Client references are available with our prequalification package. Reach out via the Contractor Portal or contact form to request references aligned with your project type.",
  },
  {
    question: "Who manages a project of this scope?",
    answer:
      "A dedicated project lead is assigned from estimate through closeout — handling daily reports, RFI turnaround, schedule, and direct communication with the owner, GC, or property manager.",
  },
];

export const blogPostFaqs: FAQItem[] = [
  {
    question: "Where can I learn more about this topic?",
    answer:
      "Browse the rest of our insights on the Blog index for related articles on building envelope, restoration, and specialty trades — or contact our team directly for project-specific guidance.",
  },
  {
    question: "Does Ascent Group offer the services discussed in this article?",
    answer:
      "Most likely yes — we self-perform envelope, restoration, and interior trade scopes across the GTA. Contact us with your project specifics for a tailored proposal.",
  },
];
