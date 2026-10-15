import { defineContent } from "../types";
export const defaults = {
  f001: "Prefer another way to start?",
  f002: "Choose the option that fits where you are.",
  f003: "Request a Proposal",
  f004: "Tell us about your project and get a detailed, itemised estimate with transparent pricing.",
  f005: "View Our Portfolio",
  f006: "Browse completed building envelope, restoration, and specialty trade projects across Ontario.",
  f007: "Get Prequalified",
  f008: "General contractors: download our prequalification package and add us to your approved trade list.",
  f009: "Contact us",
  f010: "See our work",
  f011: "See prequalification details",
};
export const meta = {
  f001: {
    label: "Ready to Start Your Project?",
    section: "Page copy",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f002: {
    label:
      "Whether you need a trade partner, a detailed estimate, or just want to",
    section: "Page copy",
    kind: "text",
    maxLength: 351,
    locked: false,
  },
  f003: {
    label: "title",
    section: "Sections and structured data",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f004: {
    label: "description",
    section: "Sections and structured data",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f005: {
    label: "title",
    section: "Sections and structured data",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f006: {
    label: "description",
    section: "Sections and structured data",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f007: {
    label: "title",
    section: "Sections and structured data",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f008: {
    label: "description",
    section: "Sections and structured data",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f009: {
    label: "Contact path link",
    section: "Page copy",
    kind: "text",
    maxLength: 60,
    locked: false,
  },
  f010: {
    label: "Portfolio path link",
    section: "Page copy",
    kind: "text",
    maxLength: 60,
    locked: false,
  },
  f011: {
    label: "Prequalification path link",
    section: "Page copy",
    kind: "text",
    maxLength: 60,
    locked: false,
  },
} as const;
const module = defineContent("home-final-cta", defaults, meta);
export const schema = module.schema;
export default module;
