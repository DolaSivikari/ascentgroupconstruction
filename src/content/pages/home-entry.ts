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
};

export default structuredContent("home-entry", homeEntry);
