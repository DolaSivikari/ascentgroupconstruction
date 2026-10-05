import { defineContent } from "../types";
export const defaults = {
  f001: "Our Commitment",
  f002: "We Protect & Improve the Buildings People Depend On",
  f003: "From envelope restoration to interior finishing — self-performed trades, accountable delivery, and documentation you can hand to your client.",
};
export const meta = {
  f001: {
    label: "Our Commitment",
    section: "Page copy",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f002: {
    label: "We Protect & Improve the Buildings People Depend On",
    section: "Page copy",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f003: {
    label:
      "From envelope restoration to interior finishing — self-performed trade",
    section: "Page copy",
    kind: "text",
    maxLength: 423,
    locked: false,
  },
} as const;
const module = defineContent("home-parallax", defaults, meta);
export const schema = module.schema;
export default module;
