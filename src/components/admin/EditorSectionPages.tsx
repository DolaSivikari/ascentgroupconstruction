import { useEffect, useId, useRef, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

interface SectionPage {
  id: string;
  path: string;
  title: string;
  content: ReactNode;
}

/** Linked screens keep their controls mounted so pending uploads and drafts survive. */
export function EditorSectionPages({
  basePath,
  sections,
}: {
  basePath: string;
  sections: SectionPage[];
}) {
  const { section } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const selectorId = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const previousSection = useRef(section);
  const index = section
    ? sections.findIndex((item) => item.path === section)
    : 0;
  const active = sections[index];
  const destination = (path: string) => ({
    pathname: `${basePath}/${path}`,
    search: location.search,
  });

  useEffect(() => {
    if (previousSection.current !== section)
      heading.current?.focus({ preventScroll: true });
    previousSection.current = section;
  }, [section]);

  return (
    <div className="admin-section-pages grid gap-6 min-w-0 lg:grid-cols-[190px_minmax(0,1fr)]">
      <nav aria-label="Project sections" className="admin-section-page-nav">
        <Link
          to="/admin/projects"
          className="block px-3 py-2 text-sm font-semibold mb-3"
        >
          ← All projects
        </Link>
        <label className="sr-only" htmlFor={selectorId}>
          Project section
        </label>
        <select
          id={selectorId}
          className="lg:hidden w-full border rounded-lg bg-background px-3 py-2"
          value={active?.path || ""}
          onChange={(event) => navigate(destination(event.target.value))}
        >
          {!active && (
            <option value="" disabled>
              Choose a section
            </option>
          )}
          {sections.map((item) => (
            <option key={item.id} value={item.path}>
              {item.title}
            </option>
          ))}
        </select>
        <ul className="hidden lg:block space-y-1">
          {sections.map((item) => (
            <li key={item.id}>
              <Link
                to={destination(item.path)}
                aria-current={active?.id === item.id ? "page" : undefined}
                className="admin-section-page-link block rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="min-w-0">
        {!active && (
          <div role="alert" className="rounded-lg border p-6 space-y-3">
            <h2 className="text-xl font-semibold">Project section not found</h2>
            <Link to={destination(sections[0].path)}>Go to Overview</Link>
          </div>
        )}
        {sections.map((item) => (
          <section
            key={item.id}
            id={item.id}
            data-editor-section-path={item.path}
            hidden={active?.id !== item.id}
            aria-labelledby={`${item.id}-title`}
            className="admin-editor-section rounded-lg border bg-card p-4 sm:p-6 space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              Section {index + 1} of {sections.length}
            </p>
            <h2
              id={`${item.id}-title`}
              ref={active?.id === item.id ? heading : undefined}
              tabIndex={-1}
              className="text-xl font-semibold"
            >
              {item.title}
            </h2>
            {item.content}
          </section>
        ))}
        {active && (
          <div
            className="flex flex-wrap items-center justify-between gap-3 mt-6"
            aria-label="Section navigation"
          >
            {index > 0 ? (
              <Link
                className="text-sm font-medium"
                to={destination(sections[index - 1].path)}
              >
                ← {sections[index - 1].title}
              </Link>
            ) : (
              <span />
            )}
            {index < sections.length - 1 && (
              <Link
                className="text-sm font-medium"
                to={destination(sections[index + 1].path)}
              >
                {sections[index + 1].title} →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
