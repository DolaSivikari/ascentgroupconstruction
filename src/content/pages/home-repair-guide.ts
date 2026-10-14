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
    title: "See what a clear repair scope looks like",
    introduction:
      "Explore an example of joint sealant replacement and localized EIFS repair, using the same documentation approach shown on our Technology page.",
    sampleLabel: "Illustrative sample — not a completed project",
    drawingLabel: "Illustrative south elevation with sample repair locations",
    drawingCaption:
      "Example locations only. Actual quantities, access and repair details are established for the specific building.",
    legend: [
      "Joint sealant locations",
      "Localized EIFS repair",
      "Access to be confirmed",
    ],
    tabsLabel: "Sample project documentation",
    stages: [
      {
        id: "before",
        label: "Before work",
        title: "A scope you can review",
        description:
          "Locations, preparation and exclusions make quotations easier to understand and compare.",
        groups: [
          {
            title: "Included in this example",
            items: [
              "Joint removal, preparation, backer rod and new sealant",
              "Localized EIFS mesh, base-coat and finish repairs",
              "Access setups, field reports and digital closeout",
            ],
          },
          {
            title: "Outside this example",
            items: [
              "Window replacement",
              "Hazardous material abatement",
              "Concrete repairs unless separately agreed",
            ],
          },
        ],
        note: "Clarification: confirm work hours and access arrangements before mobilization; review variations in writing.",
      },
      {
        id: "during",
        label: "During work",
        title: "A progress record you can follow",
        description:
          "A sample field report links the work area, completed activities and open issues.",
        groups: [
          {
            title: "Sample progress entry",
            items: [
              "Location: south elevation, joint SL-01",
              "Activity: joint preparation recorded before new sealant",
              "Evidence: photographs linked to the repair location",
            ],
          },
          {
            title: "Sample open issue",
            items: [
              "Additional finish damage found beside the joint",
              "Proposed scope variation recorded for review",
              "Status: awaiting written direction",
            ],
          },
        ],
        note: "Example entry only. No live job status, site photographs or approved change order is represented here.",
      },
      {
        id: "completion",
        label: "At completion",
        title: "An organized handover",
        description:
          "A sample closeout index helps the building team find the records associated with the agreed work.",
        groups: [
          {
            title: "Completion records",
            items: [
              "Repair locations and photographs by phase",
              "Deficiency list and completion status",
              "Approved scope changes and marked-up records",
            ],
          },
          {
            title: "Handover index",
            items: [
              "Product data and maintenance information",
              "Applicable warranty documents",
              "Project correspondence and closeout records",
            ],
          },
        ],
        note: "The required documents and applicable warranties are confirmed for each project's products and agreed scope.",
      },
    ],
    action: "Explore the full documentation examples",
    href: "/company/technology",
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
