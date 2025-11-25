export interface DiagramNode {
  id: string;
  label: string;
  subtitle?: string;
  type: 'owner' | 'contractor' | 'consultant' | 'ascent' | 'subtrade' | 'gc';
  position: { x: number; y: number };
  highlighted?: boolean;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface DiagramConfig {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface PartnershipModel {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  shortDescription: string;
  diagram: DiagramConfig;
  bestFor: string[];
  typicalClients: string[];
  valuePropositions: string[];
  cta: { text: string; link: string };
}

export const partnershipModels: PartnershipModel[] = [
  {
    id: "prime-contractor",
    title: "Prime Contractor (Envelope Lead)",
    shortTitle: "Prime Contractor",
    description: "We serve as the prime contractor with direct accountability for building envelope restoration scopes. Working under consultant direction, we coordinate all envelope-related activities including access equipment, safety protocols, and subtrade coordination. This model suits property managers and building owners executing reserve fund studies or capital envelope projects.",
    shortDescription: "Direct accountability for envelope restoration scopes with consultant coordination",
    diagram: {
      nodes: [
        { id: "owner", label: "Owner", type: "owner", position: { x: 50, y: 12 } },
        { id: "consultant", label: "Consultant", type: "consultant", position: { x: 50, y: 32 } },
        { id: "ascent", label: "ASCENT GROUP", subtitle: "Prime Contractor", type: "ascent", position: { x: 50, y: 58 }, highlighted: true },
        { id: "access", label: "Access", type: "subtrade", position: { x: 20, y: 88 } },
        { id: "materials", label: "Materials", type: "subtrade", position: { x: 50, y: 88 } },
        { id: "qa", label: "QA/QC", type: "subtrade", position: { x: 80, y: 88 } },
      ],
      edges: [
        { from: "owner", to: "consultant" },
        { from: "consultant", to: "ascent" },
        { from: "ascent", to: "access" },
        { from: "ascent", to: "materials" },
        { from: "ascent", to: "qa" },
      ],
    },
    bestFor: [
      "Property managers with capital restoration projects",
      "Building owners executing reserve fund studies",
      "Condominium corporations with envelope remediation needs",
    ],
    typicalClients: [
      "Multi-family residential properties",
      "Commercial property management firms",
      "Condominium boards",
    ],
    valuePropositions: [
      "Prime accountability for envelope scopes",
      "Self-performed core trades (no sub-tier markup)",
      "Consultant/EOR-aligned execution",
      "Documented QA/QC and warranty delivery",
    ],
    cta: { text: "Request Site Assessment", link: "/contact" },
  },
  {
    id: "trade-partner",
    title: "Trade Partner (GC Relationship)",
    shortTitle: "Trade Partner",
    description: "We partner with general contractors as a specialty trade contractor for envelope-specific scopes. Our team executes EIFS, stucco, masonry, waterproofing, and protective coatings as a subcontractor, coordinating with the GC's schedule and site logistics. This model provides GCs with a reliable envelope specialist delivering consistent quality and documentation.",
    shortDescription: "Specialty envelope contractor partnering with general contractors on larger projects",
    diagram: {
      nodes: [
        { id: "owner", label: "Owner", type: "owner", position: { x: 50, y: 15 } },
        { id: "gc", label: "General Contractor", type: "gc", position: { x: 50, y: 42 } },
        { id: "ascent", label: "ASCENT GROUP", subtitle: "Trade Partner", type: "ascent", position: { x: 35, y: 72 }, highlighted: true },
        { id: "other", label: "Other Trades", type: "subtrade", position: { x: 65, y: 72 } },
      ],
      edges: [
        { from: "owner", to: "gc" },
        { from: "gc", to: "ascent" },
        { from: "gc", to: "other" },
      ],
    },
    bestFor: [
      "General contractors needing envelope specialists",
      "New construction projects with envelope scope",
      "Renovation projects requiring coordinated trades",
    ],
    typicalClients: [
      "General contractors",
      "Construction managers",
      "Design-build firms",
    ],
    valuePropositions: [
      "Unit pricing packages for predictable costs",
      "Self-performed work with direct crew accountability",
      "Proven GC coordination experience",
      "Complete envelope trade package delivery",
    ],
    cta: { text: "Discuss Trade Partnership", link: "/contact" },
  },
  {
    id: "consultant-led",
    title: "Consultant-Led Restoration",
    shortTitle: "Consultant-Led",
    description: "Engineering firms and building science consultants direct the restoration strategy while we execute the physical work. This model is common in reserve fund implementations, capital planning projects, and warranty claim resolutions where technical oversight is required. We maintain ITP documentation, respond to RFIs, and deliver work aligned with consultant specifications.",
    shortDescription: "Engineer/consultant directs strategy, we execute under technical oversight",
    diagram: {
      nodes: [
        { id: "owner", label: "Strata / Owner", type: "owner", position: { x: 50, y: 18 } },
        { id: "consultant", label: "Engineer", type: "consultant", position: { x: 50, y: 48 } },
        { id: "ascent", label: "ASCENT GROUP", subtitle: "Execution", type: "ascent", position: { x: 50, y: 78 }, highlighted: true },
      ],
      edges: [
        { from: "owner", to: "consultant" },
        { from: "consultant", to: "ascent" },
      ],
    },
    bestFor: [
      "Reserve fund study implementations",
      "Capital planning projects requiring EOR oversight",
      "Warranty claim resolutions with technical documentation",
    ],
    typicalClients: [
      "Engineering consultants",
      "Building science firms",
      "Property managers with consultant relationships",
    ],
    valuePropositions: [
      "ITP documentation and RFI response protocols",
      "EOR compliance and specification adherence",
      "Detailed progress reporting and photo documentation",
      "Consultant coordination experience",
    ],
    cta: { text: "Review Technical Capabilities", link: "/capabilities" },
  },
  {
    id: "direct-service",
    title: "Direct Service (Residential/Small Commercial)",
    shortTitle: "Direct Service",
    description: "For residential and small commercial projects, we provide complete project management from assessment through warranty. This model offers property owners a single point of contact for envelope and interior work without requiring separate consultants or general contractors. Ideal for straightforward restoration, renovation, or improvement projects.",
    shortDescription: "Complete project management for residential and small commercial clients",
    diagram: {
      nodes: [
        { id: "owner", label: "Property Owner", type: "owner", position: { x: 50, y: 25 } },
        { id: "ascent", label: "ASCENT GROUP", subtitle: "Full Service", type: "ascent", position: { x: 50, y: 60 }, highlighted: true },
        { id: "execution", label: "Execution", type: "subtrade", position: { x: 50, y: 88 } },
      ],
      edges: [
        { from: "owner", to: "ascent" },
        { from: "ascent", to: "execution" },
      ],
    },
    bestFor: [
      "Residential property owners",
      "Small commercial building owners",
      "Direct restoration or renovation projects",
    ],
    typicalClients: [
      "Homeowners",
      "Small commercial property owners",
      "Property investors",
    ],
    valuePropositions: [
      "Single point of contact and accountability",
      "Bundled envelope and interior services",
      "Warranty-backed delivery",
      "Transparent pricing and project management",
    ],
    cta: { text: "Start Your Project", link: "/contact" },
  },
];
