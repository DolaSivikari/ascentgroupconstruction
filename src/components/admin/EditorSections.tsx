import type { ReactNode } from "react";
export interface EditorSection {
  id: string;
  title: string;
  content: ReactNode;
}
export function EditorSections({ sections }: { sections: EditorSection[] }) {
  return (
    <div className="grid lg:grid-cols-[170px_minmax(0,1fr)] gap-6 min-w-0">
      <nav aria-label="Editor sections" className="admin-editor-outline">
        <label className="sr-only" htmlFor="editor-section-selector">
          Jump to section
        </label>
        <select
          id="editor-section-selector"
          className="lg:hidden w-full border rounded-lg bg-background px-3 py-2"
          defaultValue=""
          onChange={(event) =>
            document
              .getElementById(event.target.value)
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        >
          <option value="" disabled>
            Jump to section
          </option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.title}
            </option>
          ))}
        </select>
        <ul className="hidden lg:block space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                href={`#${section.id}`}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="space-y-8 min-w-0">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="admin-editor-section rounded-lg border bg-card p-4 sm:p-6 space-y-4"
          >
            <h2 className="text-xl font-semibold">{section.title}</h2>
            {section.content}
          </section>
        ))}
      </div>
    </div>
  );
}
