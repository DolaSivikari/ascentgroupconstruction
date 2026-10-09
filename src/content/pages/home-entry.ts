import { structuredContent } from "../structured";

export const homeEntry = {
  title: "What kind of property are you planning work on?",
  commercial: {
    title: "Commercial & Multi-Residential",
    description:
      "Building envelope, restoration and interior trade work for property managers, condo boards and construction teams.",
    href: "/commercial-clients",
    action: "Explore commercial services",
  },
  residential: {
    title: "Your Home",
    description:
      "Exterior repairs, painting, tile, flooring and finishing for homeowners planning a repair or renovation.",
    href: "/homeowners",
    action: "Explore homeowner services",
  },
  faqTitle: "Planning your project",
  faqs: [
    {
      question: "Does Ascent work on commercial properties and homes?",
      answer:
        "Yes. Commercial and multi-residential work includes building envelope restoration and interior trades. Homeowner services include exterior repairs, painting, tile, flooring and finishing. Choose the property type above to find the relevant services.",
    },
    {
      question: "How do I request an estimate or invite Ascent to bid?",
      answer:
        "Use Request an Estimate for a planned repair or renovation. Use Submit an RFP when you have a bid package, drawings or specifications. Include the project address, scope and any available drawings or photographs so the team can understand the work.",
    },
    {
      question: "Which areas does Ascent serve?",
      answer:
        "Ascent serves Toronto and the surrounding GTA, including Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Burlington, Hamilton, Ajax, Whitby, Oshawa, Pickering, Newmarket, Aurora, Milton and King City. Check the service-area pages or contact the team about another Ontario location.",
    },
    {
      question: "Where can I see examples of completed work?",
      answer:
        "The Projects section includes residential, commercial, hospitality and institutional work. Each project page displays the scope, photographs and project details that have been published for that job.",
    },
  ],
};

export default structuredContent("home-entry", homeEntry);
