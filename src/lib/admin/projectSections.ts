export const PROJECT_EDITOR_SECTIONS = [
  { id: "project-basics", path: "overview", title: "Overview" },
  { id: "project-content", path: "content", title: "Description & tags" },
  { id: "project-scope", path: "scope", title: "Scope of work" },
  { id: "project-challenge", path: "challenge", title: "Challenge" },
  { id: "project-results", path: "results", title: "Results" },
  { id: "project-images", path: "images", title: "Images" },
  { id: "project-details", path: "details", title: "Project details" },
  {
    id: "project-performance",
    path: "performance",
    title: "Performance & team",
  },
  { id: "project-services", path: "services", title: "Services & process" },
  { id: "project-seo", path: "seo", title: "SEO" },
] as const;

export function projectEditorPaths(id: string) {
  const base = `/admin/projects/${encodeURIComponent(id)}`;
  return [
    base,
    ...PROJECT_EDITOR_SECTIONS.map((section) => `${base}/${section.path}`),
  ];
}
