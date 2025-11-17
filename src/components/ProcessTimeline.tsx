import ProcessTimelineStep from "./ProcessTimelineStep";

const processSteps = [
  {
    step: 1,
    title: "Consultation & Assessment",
    duration: "1-2 days",
    description: "We visit your site to understand your needs, assess the scope, and provide a detailed quote.",
    details: [
      "Comprehensive site inspection and measurement",
      "Surface condition assessment and material identification",
      "Discussion of your goals, timeline, and budget",
      "Identification of any potential challenges or special requirements",
      "Review of color options and material recommendations"
    ],
    deliverables: ["Detailed Quote", "Project Timeline", "Material Samples"],
    image: "/src/assets/team-work.jpg"
  },
  {
    step: 2,
    title: "Preparation & Planning",
    duration: "1-3 days",
    description: "Our team prepares the site and surfaces to ensure the highest quality finish.",
    details: [
      "Complete surface cleaning and preparation",
      "Repair of cracks, holes, and surface imperfections",
      "Priming and sealing as needed",
      "Protection of surrounding areas and property",
      "Setup of equipment and safety measures"
    ],
    deliverables: ["Site Protection", "Surface Repairs", "Quality Primer"],
    image: "/src/assets/project-commercial.jpg"
  },
  {
    step: 3,
    title: "Professional Application",
    duration: "3-10 days",
    description: "Expert application using premium materials and proven techniques for lasting results.",
    details: [
      "Application of high-quality coatings using professional techniques",
      "Multiple coats applied with proper drying time between each",
      "Attention to detail on edges, corners, and transitions",
      "Regular quality checks throughout the process",
      "Daily cleanup and site maintenance"
    ],
    deliverables: ["Premium Finish", "Progress Updates", "Clean Worksite"],
    image: "/src/assets/project-institutional.jpg"
  },
  {
    step: 4,
    title: "Final Inspection & Warranty",
    duration: "1 day",
    description: "We ensure everything meets our high standards and provide comprehensive warranty coverage.",
    details: [
      "Thorough final inspection with you present",
      "Touch-ups and corrections as needed",
      "Complete site cleanup and debris removal",
      "Walkthrough of maintenance recommendations",
      "Provision of warranty documentation and care instructions"
    ],
    deliverables: ["Final Walkthrough", "Warranty Certificate", "Care Guide"],
    image: "/src/assets/project-industrial.jpg"
  }
];

const ProcessTimeline = () => {
  return (
    <div className="w-full py-8">
      {processSteps.map((step) => (
        <ProcessTimelineStep
          key={step.step}
          {...step}
        />
      ))}
    </div>
  );
};

export default ProcessTimeline;
