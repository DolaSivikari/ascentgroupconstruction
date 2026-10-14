import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Droplets,
  Building2,
  Car,
  Users,
} from "lucide-react";
import { Button } from "@/ui/Button";
import contentModule, {
  homeRepairGuide,
} from "@/content/pages/home-repair-guide";
import { restoreStructured } from "@/content/structured";
import { useResolvedContent } from "@/lib/content/store";

const icons = [Droplets, Building2, Car, Users];

export function HomepageRepairGuide() {
  const c = restoreStructured(
    homeRepairGuide,
    useResolvedContent(contentModule),
  );
  return (
    <section
      aria-labelledby="repair-guide-heading"
      className="border-y border-border bg-muted/30 py-12 md:py-16"
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
              {c.eyebrow}
            </p>
            <h2
              id="repair-guide-heading"
              className="mb-4 text-3xl font-bold tracking-tight md:text-4xl"
            >
              {c.title}
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              {c.introduction}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3">
            <Button asChild>
              <Link to={c.discussion.href}>
                {c.discussion.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Link
              to={c.bid.href}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {c.bid.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="grid items-start gap-4 md:grid-cols-2">
          {c.problems.map((problem, index) => {
            const Icon = icons[index];
            return (
              <details
                key={problem.id}
                className="group rounded-xl border border-border bg-background open:border-primary/40"
              >
                <summary className="flex cursor-pointer list-none items-start gap-4 rounded-xl p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    {Icon && (
                      <Icon
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold">
                      {problem.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {problem.summary}
                    </span>
                  </span>
                  <ChevronDown
                    className="mt-2 h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </summary>
                <div className="space-y-4 border-t border-border px-5 py-5 text-sm leading-relaxed">
                  <div>
                    <h3 className="mb-1 font-semibold">{c.checkLabel}</h3>
                    <p className="text-muted-foreground">{problem.check}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">{c.prepareLabel}</h3>
                    <p className="text-muted-foreground">{problem.prepare}</p>
                  </div>
                  <Link
                    to={problem.href}
                    className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {problem.action}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
