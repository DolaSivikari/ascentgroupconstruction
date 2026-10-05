import { defineContent } from "../types";
export const defaults = {
  f001: "Why Property Owners Choose Us",
  f002: "Our team brings 15+ years of combined experience in building envelope and interior trades across Ontario, delivering exceptional construction results through licensed professionals, complete services, and unwavering commitment to quality.",
  f003: "Loading...",
  f004: "Ready to Start Your Project?",
  f005: "Get a detailed proposal for your construction project with transparent pricing and comprehensive scope documentation.",
  f006: "Request a Proposal",
  f007: "View Portfolio",
  f008: "Licensed & Certified",
  f009: "Envelope & Trades Expertise",
  f010: "Trusted Manufacturer Brands",
  f011: "Reliable Delivery",
  f012: "Expert Team",
  f013: "Quality Standards",
};
export const meta = {
  f001: {
    label: "Why Property Owners Choose Us",
    section: "Page copy",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f002: {
    label:
      "Our team brings 15+ years of combined experience in building envelope ",
    section: "Page copy",
    kind: "text",
    maxLength: 714,
    locked: false,
  },
  f003: {
    label: "Loading...",
    section: "Page copy",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f004: {
    label: "Ready to Start Your Project?",
    section: "Page copy",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f005: {
    label:
      "Get a detailed proposal for your construction project with transparent",
    section: "Page copy",
    kind: "text",
    maxLength: 351,
    locked: false,
  },
  f006: {
    label: "Request a Proposal",
    section: "Page copy",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f007: {
    label: "View Portfolio",
    section: "Page copy",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f008: {
    label: "title",
    section: "Sections and structured data",
    kind: "text",
    maxLength: 300,
    locked: true,
    help: "Protected company claim: owner review required.",
  },
  f009: {
    label: "title",
    section: "Sections and structured data",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f010: {
    label: "title",
    section: "Sections and structured data",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f011: {
    label: "title",
    section: "Sections and structured data",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f012: {
    label: "title",
    section: "Sections and structured data",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f013: {
    label: "title",
    section: "Sections and structured data",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
} as const;
const module = defineContent("home-why-choose-us", defaults, meta);
export const schema = module.schema;
export default module;
