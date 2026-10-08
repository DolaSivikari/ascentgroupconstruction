import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

export interface AdminSectionItem {
  id: string;
  title: string;
}
const SectionContext = createContext<{
  active: string;
  href: (id: string) => string;
} | null>(null);

/** Each focused screen has a URL; its controls remain mounted to retain pending edits. */
export function AdminSectionWorkspace({
  items,
  children,
  label = "Editor sections",
  queryKey = "section",
}: {
  items: AdminSectionItem[];
  children: ReactNode;
  label?: string;
  queryKey?: string;
}) {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const requested = params.get(queryKey);
  const active =
    items.find((item) => item.id === requested)?.id || items[0]?.id || "";
  const selector = useId();
  const root = useRef<HTMLDivElement>(null);
  const previous = useRef(active);
  const href = (id: string) => {
    const next = new URLSearchParams(params);
    next.set(queryKey, id);
    return `${location.pathname}?${next}${location.hash}`;
  };
  useEffect(() => {
    if (previous.current === active) return;
    root.current
      ?.closest<HTMLElement>(
        "[data-request-detail-scroll], .business-page-content",
      )
      ?.scrollTo?.({ top: 0, behavior: "instant" });
    const heading = root.current?.querySelector<HTMLElement>(
      "[data-admin-section]:not([hidden]) h2",
    );
    if (heading) heading.tabIndex = -1;
    (
      heading ||
      root.current?.querySelector<HTMLElement>('a[aria-current="page"]')
    )?.focus({ preventScroll: true });
    previous.current = active;
  }, [active]);
  return (
    <SectionContext.Provider value={{ active, href }}>
      <div className="admin-section-workspace space-y-5 min-w-0" ref={root}>
        <nav
          aria-label={label}
          className="admin-workspace-section-nav sticky top-0 z-20 bg-background py-3 border-b"
        >
          <label className="sr-only" htmlFor={selector}>
            {label}
          </label>
          <select
            id={selector}
            className="sm:hidden w-full rounded-lg border bg-background px-3 py-2"
            value={active}
            onChange={(event) => {
              const next = new URLSearchParams(params);
              next.set(queryKey, event.target.value);
              setParams(next);
            }}
          >
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <ul className="hidden sm:flex flex-wrap gap-2">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  to={href(item.id)}
                  aria-current={active === item.id ? "page" : undefined}
                  className="admin-section-page-link block rounded-md border px-3 py-2 text-sm hover:bg-muted"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {children}
      </div>
    </SectionContext.Provider>
  );
}

export function AdminSectionScreen({
  id,
  children,
  title,
}: {
  id: string;
  children: ReactNode;
  title?: string;
}) {
  const workspace = useContext(SectionContext);
  return (
    <section
      hidden={workspace ? workspace.active !== id : false}
      data-admin-section={id}
      data-editor-section-href={workspace?.href(id)}
      className="admin-section-screen space-y-5 min-w-0"
    >
      {title && (
        <h2 className="text-xl font-semibold" tabIndex={-1}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
