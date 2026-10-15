import { structuredContent } from "../structured";

export const homeRepairGuide = {
  eyebrow: "Start with the building problem",
  title: "What's happening at your building?",
  introduction:
    "You can start with what you've noticed. A clear repair scope begins with the conditions, the affected areas and how the work can be accessed.",
  discussion: { label: "Discuss a building repair", href: "/contact" },
  bid: { label: "Send a scope for pricing", href: "/submit-rfp" },
  checkLabel: "What needs checking",
  prepareLabel: "Helpful for the first discussion",
  problems: [
    {
      id: "water",
      title: "Water around windows or joints",
      summary: "Understand the affected area before choosing a repair.",
      check:
        "Joint condition, surrounding materials and drainage details. The visible entry point alone does not establish the cause.",
      prepare:
        "The building address, photographs, when the leak occurs and any previous repair information.",
      action: "Explore sealant repairs",
      href: "/services/sealant-programs",
    },
    {
      id: "facade",
      title: "Cracked or deteriorating finishes",
      summary: "Define which areas need repair and how they connect.",
      check:
        "The extent of cracking or loose finishes, the underlying assembly and transitions around openings. A surface patch may leave underlying issues unresolved.",
      prepare:
        "Wide and close-up photographs, affected elevations and any available drawings or condition reports.",
      action: "Explore facade restoration",
      href: "/services/facade-remediation",
    },
    {
      id: "concrete",
      title: "Damaged parking-garage concrete",
      summary:
        "Consider the concrete, joints and protective surfaces together.",
      check:
        "Deterioration, exposed reinforcement, water paths and existing coatings. Structural concerns need assessment by the appropriate professional.",
      prepare:
        "The garage level and repair locations, existing reports, parking restrictions and access requirements.",
      action: "Explore garage restoration",
      href: "/services/parking-garage-restoration",
    },
    {
      id: "occupied",
      title: "Repairs around occupied spaces",
      summary: "Plan the work around the people using the building.",
      check:
        "Access, protection, work hours and sequencing alongside the repair itself. These conditions influence the scope and coordination.",
      prepare:
        "The areas in use, permitted work hours, access limitations and the person coordinating the building.",
      action: "Explore our process",
      href: "/our-process",
    },
  ],
  documents: {
    eyebrow: "From the scope to the handover",
    title: "Know what's being repaired, before work begins",
    introduction:
      "A price alone doesn't tell you where the work stops, how changes are handled or what records you'll receive. Follow one window-joint repair through the scope, the site record and the handover to see how those questions can be answered.",
    sampleLabel: "Worked example · Window perimeter sealant",
    drawingLabel:
      "Close-up example of separation at the joint between a window frame and an exterior wall",
    drawingCaption:
      "AI-generated reference image showing a possible joint condition. Not an Ascent project photograph or a diagnosis of water entry.",
    exampleTitle: "Start with a specific location",
    exampleIntroduction:
      "In this example, a property manager notices water near a window. The visible gap is a starting point for investigation; it does not establish the source of the leak.",
    legend: [
      "Location: south elevation, window W-01",
      "Observed: separation at the perimeter joint",
      "Confirm: condition, extent and safe access on site",
    ],
    exampleNote:
      "Example only. Quantities, materials, access and required records must be confirmed for the actual building and agreed scope.",
    tabsLabel: "Follow the repair from scope to handover",
    recordLabel: "Example record · W-01",
    decisionLabel: "What this helps you decide",
    stages: [
      {
        id: "before",
        label: "Before work",
        title: "Agree exactly what is included",
        description:
          "Turn the observed issue into a location-specific scope. The owner should be able to see which joints are included, what preparation is proposed and what still needs confirming before comparing prices.",
        recordTitle: "Scope outline",
        detailLabel: "Read the scope checklist",
        recordItems: [
          { label: "Work area", value: "W-01 · agreed perimeter joints only" },
          {
            label: "Proposed work",
            value: "Remove, prepare and replace sealant",
          },
          {
            label: "To confirm",
            value: "Extent, substrate condition and access",
          },
        ],
        groups: [
          {
            title: "Define the work",
            items: [
              "Mark the repair locations and confirm joint lengths and dimensions on site.",
              "Describe removal, joint preparation, backer rod where required and compatible replacement sealant.",
              "Agree access, protection of occupied areas, work hours and the records required at handover.",
            ],
          },
          {
            title: "Set the boundaries",
            items: [
              "Window replacement and concealed wall repairs are outside this example.",
              "If opening the joint reveals additional damage, record it and obtain written direction before expanding the work.",
            ],
          },
        ],
        decision:
          "Are the quotations covering the same locations, preparation, access and exclusions?",
        note: "This is a scope example, not a repair specification. The actual repair method depends on the assembly, site findings and applicable product requirements.",
      },
      {
        id: "during",
        label: "During work",
        title: "Keep the work connected to the scope",
        description:
          "Use the same location reference in the site record. That makes it easier to understand what was done, see the supporting photographs and separate agreed work from an unresolved change.",
        recordTitle: "Field record outline",
        detailLabel: "Read the progress checklist",
        recordItems: [
          { label: "Reference", value: "W-01 · same location as the scope" },
          {
            label: "Record",
            value: "Preparation and installation photographs",
          },
          {
            label: "Open item",
            value: "Additional damage requires written direction",
          },
        ],
        groups: [
          {
            title: "Record the agreed work",
            items: [
              "Identify the date, repair location and activity in each progress entry.",
              "Link photographs of the exposed joint, preparation and installed sealant to W-01.",
              "Record relevant product information and installation checks required by the agreed scope.",
            ],
          },
          {
            title: "Keep changes visible",
            items: [
              "Describe additional damage with its location and supporting photographs.",
              "Record the proposed change, cost or schedule implications and written direction separately from completed work.",
            ],
          },
        ],
        decision:
          "What has been completed, what evidence supports it and does anything need my approval?",
        note: "This is an example of the information a field record can contain. It is not a live job update, completed inspection or approved change order.",
      },
      {
        id: "completion",
        label: "At completion",
        title: "Hand over records the next person can use",
        description:
          "Bring the location references, completion photographs and outstanding items together. A useful handover lets the building team find what was repaired without reconstructing the project from scattered emails.",
        recordTitle: "Closeout index outline",
        detailLabel: "Read the handover checklist",
        recordItems: [
          {
            label: "Repair record",
            value: "W-01 · scope and approved changes",
          },
          { label: "Evidence", value: "Photographs and deficiency status" },
          { label: "Reference", value: "Product and maintenance information" },
        ],
        groups: [
          {
            title: "Review completion",
            items: [
              "Match the agreed repair locations and approved changes to the completion record.",
              "Review the deficiency list: identify open items and record their completion status.",
              "Organize before, during and completion photographs by repair location.",
            ],
          },
          {
            title: "Keep the useful references",
            items: [
              "Index product data, maintenance information and marked-up repair records required by the scope.",
              "Applicable warranty documents",
              "Retain approved changes and relevant correspondence with the closeout records.",
            ],
          },
        ],
        decision:
          "Can the building team find what was repaired, any open items and the information needed to maintain it?",
        note: "The required documents and applicable warranties are confirmed for each project's products and agreed scope.",
      },
    ],
    action: "Explore the documentation examples",
    href: "/company/technology",
    discussion: { label: "Discuss your repair scope", href: "/contact" },
  },
  process: {
    title: "Your first project with Ascent",
    steps: [
      {
        title: "Discuss the issue",
        body: "Share the location, what you've noticed and any available information.",
      },
      {
        title: "Review the site",
        body: "Identify conditions, access requirements and the information needed for a scope.",
      },
      {
        title: "Agree the scope",
        body: "Review inclusions, exclusions and how additional work will be approved.",
      },
      {
        title: "Complete and document",
        body: "Follow the agreed work through progress records and project closeout.",
      },
    ],
    action: "See the project process",
    href: "/our-process",
  },
};

export default structuredContent("home-repair-guide", homeRepairGuide);
