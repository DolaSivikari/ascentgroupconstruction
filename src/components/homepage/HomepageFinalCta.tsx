import { Link } from "react-router-dom";
import { MessageSquare, FolderOpen, ClipboardList, FileText, Calculator, ArrowRight } from "lucide-react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ctaCards = [
  {
    icon: FileText,
    title: "Submit an RFP",
    description: "Send us your project documents for a detailed scope review and pricing proposal.",
    cta: "Submit RFP",
    href: "/submit-rfp",
  },
  {
    icon: Calculator,
    title: "Request an Estimate",
    description: "Get a preliminary estimate for your commercial, multi-unit, or residential scope.",
    cta: "Get Estimate",
    href: "/estimate",
  },
  {
    icon: MessageSquare,
    title: "Contact Our Team",
    description: "Reach our project team to discuss timelines, capabilities, or general inquiries.",
    cta: "Contact Us",
    href: "/contact",
  },
  {
    icon: ClipboardList,
    title: "Request a Proposal",
    description: "Tell us about your project and get a detailed, itemised estimate with transparent pricing.",
    cta: "Start a Conversation",
    href: "/contact",
  },
  {
    icon: FolderOpen,
    title: "View Our Portfolio",
    description: "Browse completed building envelope, restoration, and specialty trade projects across Ontario.",
    cta: "See Our Work",
    href: "/projects",
  },
  {
    icon: ClipboardList,
    title: "Get Prequalified",
    description: "General contractors: download our prequalification package and add us to your approved trade list.",
    cta: "Download Package",
    href: "/prequalification",
  },
];

export const HomepageFinalCta = () => {
  const prefersReducedMotion = useReducedMotion();
  const { ref: headerRef, isVisible: headerVisible, skipAnimation: headerSkip } = useScrollFadeIn();
  const { ref: gridRef, isVisible: gridVisible, skipAnimation: gridSkip } = useScrollFadeIn({ threshold: 0.1 });
  const delays = useStaggerAnimation({ itemCount: ctaCards.length, staggerDelay: 80 });

  const showHeader = headerVisible || headerSkip || prefersReducedMotion;
  const showGrid = gridVisible || gridSkip || prefersReducedMotion;

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-12"
          style={{
            opacity: showHeader ? 1 : 0,
            transform: showHeader ? "translateY(0)" : "translateY(24px)",
            transition: prefersReducedMotion ? "none" : "opacity 300ms ease-out, transform 300ms ease-out",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Ready to Discuss Your Project?
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Whether you have drawings ready or need to discuss scope, we're here to help move your project forward.
          </p>
        </div>

        {/* 6-card grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {ctaCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={index}
                to={card.href}
                className="group flex flex-col items-center text-center p-8 rounded-[var(--radius-lg)] bg-card border hover:border-primary/50 hover:shadow-[var(--shadow-lg)] transition-all"
                style={{
                  opacity: showGrid ? 1 : 0,
                  transform: showGrid ? "translateY(0)" : "translateY(24px)",
                  transition: prefersReducedMotion
                    ? "none"
                    : "opacity 300ms ease-out, transform 300ms ease-out",
                  transitionDelay: showGrid ? `${delays[index] ?? 0}ms` : "0ms",
                }}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-5 flex-1">{card.description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                  {card.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
