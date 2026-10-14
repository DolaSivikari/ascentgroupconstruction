import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import contentModule, {
  homeRepairGuide,
} from "@/content/pages/home-repair-guide";
import { restoreStructured } from "@/content/structured";
import { useResolvedContent } from "@/lib/content/store";
import { Elevation } from "@/pages/company/technology/sections/Drawings";

export function HomepageDocumentationPreview() {
  const { documents: c, process } = restoreStructured(
    homeRepairGuide,
    useResolvedContent(contentModule),
  );
  return (
    <section
      aria-labelledby="documentation-preview-heading"
      className="py-12 md:py-16"
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            {c.eyebrow}
          </p>
          <h2
            id="documentation-preview-heading"
            className="mb-4 text-3xl font-bold tracking-tight md:text-4xl"
          >
            {c.title}
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {c.introduction}
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
            <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
            {c.sampleLabel}
          </div>
          <div className="grid lg:grid-cols-2">
            <figure className="min-w-0 border-b border-border bg-muted/30 p-5 md:p-7 lg:border-b-0 lg:border-r">
              <div
                role="img"
                aria-label={c.drawingLabel}
                className="[--primary:210_100%_20%]"
              >
                <div aria-hidden="true">
                  <Elevation>
                    <g fill="none" stroke="#c2410c" strokeWidth="4">
                      <path d="M278 91V286M461 91V286" />
                      <rect
                        x="345"
                        y="190"
                        width="60"
                        height="54"
                        strokeDasharray="6 4"
                      />
                    </g>
                    <g fill="#003366">
                      <circle cx="278" cy="155" r="12" />
                      <circle cx="375" cy="217" r="12" />
                      <circle cx="545" cy="335" r="12" />
                    </g>
                    <g
                      fill="white"
                      fontSize="12"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      <text x="278" y="159">
                        1
                      </text>
                      <text x="375" y="221">
                        2
                      </text>
                      <text x="545" y="339">
                        3
                      </text>
                    </g>
                  </Elevation>
                </div>
              </div>
              <ol className="mt-3 space-y-2 text-sm">
                {c.legend.map((label, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                    >
                      {index + 1}
                    </span>
                    {label}
                  </li>
                ))}
              </ol>
              <figcaption className="mt-4 text-xs leading-relaxed text-muted-foreground">
                {c.drawingCaption}
              </figcaption>
            </figure>
            <Tabs defaultValue="before" className="min-w-0 p-5 md:p-7">
              <TabsList
                aria-label={c.tabsLabel}
                className="grid h-auto w-full grid-cols-3 gap-1 p-1"
              >
                {c.stages.map((stage) => (
                  <TabsTrigger
                    key={stage.id}
                    value={stage.id}
                    className="min-h-11 whitespace-normal px-2 py-2 leading-tight"
                  >
                    {stage.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {c.stages.map((stage) => (
                <TabsContent key={stage.id} value={stage.id} className="mt-6">
                  <h3 className="mb-2 text-xl font-semibold">{stage.title}</h3>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                    {stage.description}
                  </p>
                  <div className="space-y-5">
                    {stage.groups.map((group, index) => (
                      <div key={index}>
                        <h4 className="mb-2 text-sm font-semibold">
                          {group.title}
                        </h4>
                        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                          {group.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                    {stage.note}
                  </p>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
        <Link
          to={c.href}
          className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {c.action}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <div className="mt-10 border-t border-border pt-8">
          <h3 className="mb-6 text-xl font-semibold">{process.title}</h3>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.steps.map((step, index) => (
              <li key={index}>
                <p className="mb-2 flex items-center gap-2 font-semibold">
                  <span aria-hidden="true" className="text-sm text-primary">
                    0{index + 1}
                  </span>
                  {step.title}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
          <Link
            to={process.href}
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {process.action}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
