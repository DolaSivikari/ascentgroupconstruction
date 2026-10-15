import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, FileText, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import contentModule, {
  homeRepairGuide,
} from "@/content/pages/home-repair-guide";
import { restoreStructured } from "@/content/structured";
import { useResolvedContent } from "@/lib/content/store";
import windowJointExample from "@/assets/documentation/window-joint-example.webp";

export function HomepageDocumentationPreview() {
  const { documents: c, process } = restoreStructured(
    homeRepairGuide,
    useResolvedContent(contentModule),
  );
  return (
    <section
      aria-labelledby="documentation-preview-heading"
      className="py-12 md:py-16"
      data-repair-walkthrough
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
        <div className="overflow-hidden rounded-2xl border border-border bg-background">
          <div className="flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
            <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
            {c.sampleLabel}
          </div>
          <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <figure className="min-w-0 border-b border-border bg-muted/30 lg:border-b-0 lg:border-r">
              <img
                src={windowJointExample}
                alt={c.drawingLabel}
                width={1536}
                height={1024}
                loading="lazy"
                decoding="async"
                className="aspect-[3/2] w-full object-cover"
              />
              <figcaption className="border-b border-border px-5 py-3 text-xs leading-relaxed text-muted-foreground md:px-7">
                {c.drawingCaption}
              </figcaption>
              <div className="p-5 md:p-7">
                <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold">
                  <MapPin
                    className="h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  {c.exampleTitle}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  {c.exampleIntroduction}
                </p>
                <ul className="space-y-3 text-sm">
                  {c.legend.map((label, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {label}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                  {c.exampleNote}
                </p>
              </div>
            </figure>
            <Tabs defaultValue="before" className="min-w-0 p-5 md:p-7">
              <TabsList
                aria-label={c.tabsLabel}
                className="grid h-auto w-full grid-cols-3 gap-1 p-1"
              >
                {c.stages.map((stage, index) => (
                  <TabsTrigger
                    key={stage.id}
                    value={stage.id}
                    className="min-h-11 whitespace-normal px-2 py-2 leading-tight"
                  >
                    <span>
                      <span
                        className="mb-1 block text-xs opacity-70"
                        aria-hidden="true"
                      >
                        0{index + 1}
                      </span>
                      {stage.label}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
              {c.stages.map((stage) => (
                <TabsContent key={stage.id} value={stage.id} className="mt-6">
                  <h3 className="mb-2 text-xl font-semibold">{stage.title}</h3>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                    {stage.description}
                  </p>
                  <div className="mb-6 overflow-hidden rounded-lg border border-primary/20 bg-muted/20">
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {c.recordLabel}
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {stage.recordTitle}
                      </p>
                    </div>
                    <dl className="divide-y divide-border px-4">
                      {stage.recordItems.map((item) => (
                        <div
                          key={item.label}
                          className="grid gap-1 py-3 text-sm sm:grid-cols-[7rem_1fr] sm:gap-3"
                        >
                          <dt className="font-semibold">{item.label}</dt>
                          <dd className="text-muted-foreground">
                            {item.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <details className="group border-y border-border">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                      {stage.detailLabel}
                      <ChevronDown
                        className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="space-y-5 pb-5">
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
                  </details>
                  <div className="mt-6 border-l-2 border-accent bg-muted/30 p-4">
                    <h4 className="mb-1 text-sm font-semibold">
                      {c.decisionLabel}
                    </h4>
                    <p className="text-sm leading-relaxed">{stage.decision}</p>
                  </div>
                  <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                    {stage.note}
                  </p>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            to={c.discussion.href}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {c.discussion.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to={c.href}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {c.action}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-10 border-t border-border pt-8">
          <details className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
              {process.title}
              <ChevronDown
                className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </summary>
            <div className="pt-6">
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
            </div>
          </details>
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
