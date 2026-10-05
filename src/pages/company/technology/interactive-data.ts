export const PROCESS_STEPS = [
  {
    label: "Site assessment",
    title: "Every project starts on the ground.",
    body: "We walk the site, assess existing conditions and photograph deficiencies before developing a scope.",
    tools: ["Site photography", "Plan review"],
    deliverables: [
      "Existing-condition photo log",
      "Written scope and access considerations",
    ],
  },
  {
    label: "Digital estimate",
    title: "Measured quantities. A documented scope.",
    body: "Digital takeoffs link quantities to the drawings, making scope changes traceable and reproducible.",
    tools: ["Bluebeam", "PlanSwift", "ZZTAKEOFF"],
    deliverables: [
      "Marked-up takeoff",
      "Scope inclusions, exclusions and clarifications",
      "Bid package",
    ],
  },
  {
    label: "Crew briefing",
    title: "A package before day one.",
    body: "Foremen receive the coordinated plan set, scope, access details and safety requirements before mobilization.",
    tools: ["Bluebeam", "AutoCAD / DWG"],
    deliverables: [
      "Coordinated plan markups",
      "Sequence, access and safety briefing",
    ],
  },
  {
    label: "Daily reporting",
    title: "Progress recorded every working day.",
    body: "Field reports bring labour, weather, quantities, progress photos and open issues together in one record.",
    tools: ["Digital field reports", "Procore when required"],
    deliverables: [
      "Daily report and progress photography",
      "Issue log with actions and status",
    ],
  },
  {
    label: "Digital closeout",
    title: "One organized package at handover.",
    body: "Warranty certificates, product data, as-built records and completion documentation are assembled into a digital package.",
    tools: ["Bluebeam", "GC project system when required"],
    deliverables: [
      "Warranty and product documents",
      "As-built records and photos by phase",
      "Deficiency and closeout records",
    ],
  },
] as const;

export const RECORD_SHEETS = [
  { id: "photos", code: "EX-001", label: "Site photo log" },
  { id: "takeoff", code: "TK-101", label: "Takeoff & quantities" },
  { id: "details", code: "A-501", label: "Coordinated details" },
  { id: "report", code: "DR-0412", label: "Daily field report" },
  { id: "closeout", code: "CO-900", label: "Closeout package" },
] as const;
export type SheetId = (typeof RECORD_SHEETS)[number]["id"];

export const RECORD_TOOLS: {
  label: string;
  role: string;
  usage: "every" | "when_required";
  produces: SheetId[];
  description: string;
}[] = [
  {
    label: "Bluebeam",
    role: "Plan markup & review",
    usage: "every",
    produces: ["takeoff", "details", "closeout"],
    description:
      "Digital takeoffs, coordinated plan markups and as-built records in one working drawing set.",
  },
  {
    label: "PlanSwift",
    role: "Quantity takeoff",
    usage: "every",
    produces: ["takeoff"],
    description: "Saved digital measurements linked to the plan set.",
  },
  {
    label: "ZZTAKEOFF",
    role: "Envelope quantities",
    usage: "every",
    produces: ["takeoff"],
    description:
      "Specialty takeoffs for sealant lengths, EIFS areas and cladding scopes.",
  },
  {
    label: "AutoCAD / DWG",
    role: "Drawing coordination",
    usage: "every",
    produces: ["details"],
    description:
      "Drawing interpretation and coordination with architectural sets and provided IFC models.",
  },
  {
    label: "Procore",
    role: "Project management",
    usage: "when_required",
    produces: ["report", "closeout"],
    description:
      "Reports, RFIs, submittals and closeout records submitted through the general contractor’s system when required.",
  },
  {
    label: "BIM 360",
    role: "Model coordination",
    usage: "when_required",
    produces: ["details"],
    description:
      "Model coordination within the general contractor’s cloud environment when required.",
  },
];

export interface WallLayer {
  name: string;
  mm: number;
  material: string;
  purpose: string;
  check: string;
}
export const WALL_ASSEMBLIES: Record<
  string,
  { name: string; layers: WallLayer[] }
> = {
  eifs: {
    name: "EIFS with drainage",
    layers: [
      {
        name: "Gypsum board",
        mm: 16,
        material: "gypsum",
        purpose: "Interior finish.",
        check: "Shown for context; not part of the exterior scope.",
      },
      {
        name: "Steel stud + batt insulation",
        mm: 152,
        material: "batt",
        purpose: "Wall framing and cavity insulation.",
        check: "Confirm framing and fastener locations against the drawings.",
      },
      {
        name: "Glass-mat sheathing",
        mm: 13,
        material: "sheathing",
        purpose: "Exterior substrate supporting the system.",
        check: "Review soundness, dryness and fastening before covering.",
      },
      {
        name: "Air & water barrier",
        mm: 1,
        material: "barrier",
        purpose: "Air and water control layer.",
        check: "Document continuity, laps and penetration details.",
      },
      {
        name: "Vertical adhesive ribbons",
        mm: 6,
        material: "adhesive",
        purpose: "Bond insulation while maintaining drainage paths.",
        check: "Follow system requirements for ribbons and drainage.",
      },
      {
        name: "EPS insulation",
        mm: 50,
        material: "insulation",
        purpose: "Continuous exterior insulation.",
        check: "Review joints, board attachment and terminations.",
      },
      {
        name: "Base coat + fibreglass mesh",
        mm: 3,
        material: "mesh",
        purpose: "Reinforcement and impact resistance.",
        check: "Review mesh embedment, laps and corner details.",
      },
      {
        name: "Textured finish",
        mm: 2,
        material: "finish",
        purpose: "Final coloured surface.",
        check: "Confirm application conditions and approved texture.",
      },
    ],
  },
  stucco: {
    name: "Three-coat stucco",
    layers: [
      {
        name: "Gypsum board",
        mm: 13,
        material: "gypsum",
        purpose: "Interior finish.",
        check: "Shown for context; not part of the exterior scope.",
      },
      {
        name: "Wood stud + batt insulation",
        mm: 140,
        material: "batt",
        purpose: "Wall framing and cavity insulation.",
        check: "Confirm framing and fastener locations.",
      },
      {
        name: "OSB / plywood sheathing",
        mm: 11,
        material: "sheathing",
        purpose: "Structural substrate.",
        check: "Review substrate condition before covering.",
      },
      {
        name: "Two layers of building paper",
        mm: 2,
        material: "barrier",
        purpose: "Water-resistive barrier.",
        check: "Review laps and flashing integration.",
      },
      {
        name: "Expanded metal lath",
        mm: 3,
        material: "mesh",
        purpose: "Supports the plaster coats.",
        check: "Confirm laps and fastening per specification.",
      },
      {
        name: "Scratch coat",
        mm: 10,
        material: "adhesive",
        purpose: "First coat and key for the next layer.",
        check: "Review lath embedment and scoring.",
      },
      {
        name: "Brown coat",
        mm: 10,
        material: "sheathing",
        purpose: "Levels the wall.",
        check: "Follow specified thickness and curing requirements.",
      },
      {
        name: "Finish coat",
        mm: 3,
        material: "finish",
        purpose: "Final coloured surface.",
        check: "Review approved texture and application conditions.",
      },
    ],
  },
};

// Populate with approved, redacted project imagery later. Never substitute hero art.
export const SITE_PHOTOS: { id: string; src: string; alt: string }[] = [];
export const SAMPLE_JOB = {
  name: "Sample Condo Facade Renewal",
  number: "AGC-26-014",
  gc: "Sample General Contractor Ltd.",
  consultant: "Sample Building Science Consultant",
  date: "2026-04-14",
};
