import { useRef } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import ownerContent from "@/content/pages/home-why-choose-us";
import clientContent from "@/content/pages/home-audiences";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { getIcon } from "@/utils/getIcon";
import { Link } from "react-router-dom";
import { useWhyChooseUs } from "@/hooks/useWhyChooseUs";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Button } from "@/ui/Button";
import {
  benefitSlides,
  clientBenefits,
  ownerBenefits,
  type BenefitAudience,
} from "./whyChooseUsData";
import { useBenefitCarousel } from "./useBenefitCarousel";
import "./why-choose-carousel.css";

const WhyChooseUs = () => {
  const owners = usePageContent(ownerContent);
  const clients = usePageContent(clientContent);
  const { data: saved } = useWhyChooseUs();
  const reducedMotion = useReducedMotion();
  const clientItems = clientBenefits(clients);
  const ownerItems = ownerBenefits(owners, saved);
  const carousel = useBenefitCarousel(
    clientItems.length,
    ownerItems.length,
    reducedMotion,
  );
  const slides = benefitSlides(clientItems, ownerItems, carousel.cardsPerSlide);
  const audience = slides[carousel.active].audience;
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const title = (group: BenefitAudience) =>
    group === "clients" ? clients.f002 : owners.f001;
  const inactive = (active: boolean) => ({
    "aria-hidden": !active,
    ...(active ? {} : { inert: "" }),
  });
  const actions = {
    clients: [
      { label: clients.f020, href: "/contact" },
      { label: clients.f021, href: "/services" },
      { label: clients.f022, href: "/contact" },
    ],
    owners: [
      { label: owners.f006, href: "/contact" },
      { label: owners.f007, href: "/projects" },
    ],
  };

  return (
    <section
      ref={carousel.ref}
      aria-label="Why choose Ascent"
      aria-roledescription="carousel"
      className="why-choose-carousel"
      data-why-carousel
      onMouseEnter={() => carousel.setHovered(true)}
      onMouseLeave={() => carousel.setHovered(false)}
      onFocusCapture={(event) => {
        carousel.setFocused(true);
        if (!(event.target as HTMLElement).closest("[data-rotation-control]"))
          carousel.setPaused(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          carousel.setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          carousel.select(
            carousel.active + (event.key === "ArrowRight" ? 1 : -1),
          );
        }
      }}
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <span className="border-l-2 border-accent pl-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {clients.f001}
          </span>
          <div className="flex flex-wrap gap-2" aria-label="Choose audience">
            {(["clients", "owners"] as const).map((group) => (
              <button
                key={group}
                type="button"
                aria-pressed={audience === group}
                onClick={() =>
                  carousel.select(
                    slides.findIndex((slide) => slide.audience === group),
                  )
                }
                className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  audience === group
                    ? "border-primary bg-[hsl(var(--navy-surface))] text-white"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                {group === "clients" ? "Clients" : "Property owners"}
              </button>
            ))}
          </div>
        </div>

        <div className="why-carousel-intros mb-8">
          <div
            className="why-carousel-panel max-w-3xl"
            data-active={audience === "clients"}
            {...inactive(audience === "clients")}
          >
            <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              {clients.f002}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {clients.f003}
              <span className="font-semibold text-primary">
                {clients.f004}
              </span>{" "}
              {clients.f005}
            </p>
          </div>
          <div
            className="why-carousel-panel max-w-3xl"
            data-active={audience === "owners"}
            {...inactive(audience === "owners")}
          >
            <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              {owners.f001}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {owners.f002}
            </p>
          </div>
        </div>

        <div
          id="why-benefit-slides"
          className="why-carousel-stage"
          aria-live={carousel.paused ? "polite" : "off"}
          aria-atomic="true"
          onTouchStart={(event) => {
            const touch = event.touches[0];
            touchStart.current = touch
              ? { x: touch.clientX, y: touch.clientY }
              : null;
          }}
          onTouchEnd={(event) => {
            const start = touchStart.current;
            const end = event.changedTouches[0];
            touchStart.current = null;
            if (!start || !end) return;
            const dx = end.clientX - start.x;
            const dy = end.clientY - start.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
              carousel.select(carousel.active + (dx < 0 ? 1 : -1));
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.items[0].id}
              className="why-carousel-panel why-carousel-cards"
              data-active={index === carousel.active}
              data-count={slide.items.length}
              {...inactive(index === carousel.active)}
              role="group"
              aria-roledescription="slide"
              aria-label={`${title(slide.audience)}, ${index + 1} of ${slides.length}`}
            >
              {slide.items.map((item) => {
                const Icon = getIcon(item.icon, BadgeCheck)!;
                return (
                  <article
                    key={item.id}
                    data-benefit-id={item.id}
                    className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-6 md:p-7"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                      <Icon
                        aria-hidden="true"
                        className="h-5 w-5 text-primary"
                      />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold leading-snug text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    {item.badge && (
                      <p className="mt-auto pt-5 text-sm font-semibold text-primary">
                        <span className="border-l-2 border-accent pl-3">
                          {item.badge}
                        </span>
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div
            className="hidden flex-wrap items-center gap-2 sm:flex"
            aria-label="Benefit slides"
          >
            {slides.map((slide, index) => (
              <button
                key={slide.items[0].id}
                type="button"
                aria-label={`Show ${title(slide.audience)}, group ${index + 1}`}
                aria-current={index === carousel.active ? "true" : undefined}
                aria-controls="why-benefit-slides"
                onClick={() => carousel.select(index)}
                className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 rounded-full ${index === carousel.active ? "w-7 bg-accent" : "w-3 bg-primary/30"}`}
                />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-2 text-xs font-medium tabular-nums text-muted-foreground">
              {carousel.active + 1} / {slides.length}
            </span>
            {!reducedMotion && (
              <button
                type="button"
                data-rotation-control
                aria-label={
                  carousel.paused
                    ? "Start automatic benefit rotation"
                    : "Pause automatic benefit rotation"
                }
                onClick={() => {
                  const paused = !carousel.paused;
                  carousel.setPaused(paused);
                  // Explicit Play resumes even if its button retains keyboard focus.
                  if (!paused) carousel.setFocused(false);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-primary hover:bg-muted"
              >
                {carousel.paused ? (
                  <Play aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Pause aria-hidden="true" className="h-4 w-4" />
                )}
              </button>
            )}
            <button
              type="button"
              aria-label="Previous benefits"
              onClick={() => carousel.select(carousel.active - 1)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-primary hover:bg-muted"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next benefits"
              onClick={() => carousel.select(carousel.active + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-primary hover:bg-muted"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="why-carousel-actions mt-6">
          {(["clients", "owners"] as const).map((group) => (
            <div
              key={group}
              data-active={audience === group}
              {...inactive(audience === group)}
              className="why-carousel-panel flex flex-wrap gap-3"
            >
              {actions[group].map((action, index) => (
                <Button
                  key={action.label}
                  asChild
                  size="lg"
                  variant={index === 0 ? "primary" : "outline"}
                  className="max-w-full whitespace-normal text-center"
                >
                  <Link to={action.href}>{action.label}</Link>
                </Button>
              ))}
            </div>
          ))}
        </div>

        <details
          className="mt-6 max-w-4xl text-muted-foreground"
          onToggle={(event) => carousel.setReading(event.currentTarget.open)}
        >
          <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-primary">
            More about our approach
          </summary>
          <div className="space-y-4 pb-4 text-base leading-relaxed">
            <p>
              {clients.f006}
              <strong className="font-semibold text-foreground">
                {clients.f007}
              </strong>{" "}
              {clients.f008}
              <strong className="font-semibold text-foreground">
                {clients.f009}
              </strong>{" "}
              {clients.f010}
              <strong className="font-semibold text-foreground">
                {clients.f011}
              </strong>
              {clients.f012}
              <strong className="font-semibold text-foreground">
                {clients.f013}
              </strong>
              {clients.f014}
              <strong className="font-semibold text-foreground">
                {clients.f015}
              </strong>
              .
            </p>
            <p>
              {clients.f016}
              <strong className="font-semibold text-foreground">
                {clients.f017}
              </strong>
              {clients.f018}
              <strong className="font-semibold text-foreground">
                {clients.f019}
              </strong>
              .
            </p>
            <h3 className="font-semibold text-foreground">{owners.f004}</h3>
            <p>{owners.f005}</p>
          </div>
        </details>
      </div>
    </section>
  );
};

export default WhyChooseUs;
