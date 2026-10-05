import { defineContent } from "../types";
export const defaults = {
  f001: "Loading projects...",
  f002: "Recent Work",
  f003: "Featured Projects",
  f004: "Selected projects demonstrating our scope of work across Ontario.",
  f005: "View all projects",
  f006: "View All Projects ",
};
export const meta = {
  f001: {
    label: "Loading projects...",
    section: "Page copy",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f002: {
    label: "Recent Work",
    section: "Page copy",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f003: {
    label: "Featured Projects",
    section: "Page copy",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f004: {
    label: "Selected projects demonstrating our scope of work across Ontario.",
    section: "Page copy",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f005: {
    label: "View all projects",
    section: "Page copy",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
  f006: {
    label: "View All Projects ",
    section: "Page copy",
    kind: "text",
    maxLength: 300,
    locked: false,
  },
} as const;
const module = defineContent("home-projects", defaults, meta);
export const schema = module.schema;
export default module;
