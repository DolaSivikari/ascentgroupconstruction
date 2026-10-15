import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/home-final-cta";
import { TYPOGRAPHY_STYLES } from "@/design-system/constants";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  FolderOpen,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

export const HomepageFinalCta = () => {
  const c = usePageContent(contentModule);
  const paths = [
    {
      icon: MessageSquare,
      title: c.f003,
      description: c.f004,
      label: c.f009,
      href: "/contact",
    },
    {
      icon: FolderOpen,
      title: c.f005,
      description: c.f006,
      label: c.f010,
      href: "/projects",
    },
    {
      icon: ClipboardList,
      title: c.f007,
      description: c.f008,
      label: c.f011,
      href: "/prequalification",
    },
  ];

  return (
    <section
      aria-labelledby="homepage-ending-heading"
      data-homepage-ending
      className="border-t border-border bg-muted/30 py-12 md:py-16"
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="mb-8 max-w-2xl">
          <h2
            id="homepage-ending-heading"
            className={`${TYPOGRAPHY_STYLES.subsectionTitle} mb-3 tracking-tight`}
          >
            {c.f001}
          </h2>
          <p className="leading-relaxed text-muted-foreground">{c.f002}</p>
        </div>
        <ul
          role="list"
          className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-10"
        >
          {paths.map(({ icon: Icon, title, description, label, href }) => (
            <li
              key={href}
              className="flex min-w-0 flex-col items-start border-t border-border pt-6"
            >
              <span className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              <Link
                to={href}
                className="mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {label}
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
