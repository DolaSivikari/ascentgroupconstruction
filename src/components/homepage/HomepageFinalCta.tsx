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
import { motion } from "framer-motion";
import { GRID } from "@/design-system/layouts";
import { Button } from "@/ui/Button";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const HomepageFinalCta = () => {
  const c = usePageContent(contentModule);
  const ctaCards = [
    {
      icon: MessageSquare,
      title: c.f003,
      description: c.f004,
      cta: "Start a Conversation",
      href: "/contact",
      primary: true,
    },
    {
      icon: FolderOpen,
      title: c.f005,
      description: c.f006,
      cta: "See Our Work",
      href: "/projects",
      primary: false,
    },
    {
      icon: ClipboardList,
      title: c.f007,
      description: c.f008,
      cta: "Download Package",
      href: "/prequalification",
      primary: false,
    },
  ];

  const rm = useReducedMotion();
  const {
    ref: headerRef,
    isVisible: headerVisible,
    skipAnimation: headerSkip,
  } = useScrollFadeIn();

  const showHeader = headerVisible || headerSkip || rm;

  return (
    <>
      {/* Fine separator */}
      <div className="border-t border-border/30" />

      <section
        className="relative py-20 md:py-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.92) 100%)",
        }}
      >
        {/* Subtle dot pattern overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
          {/* Header */}
          <div
            ref={headerRef}
            className="text-center mb-14"
            style={{
              opacity: showHeader ? 1 : 0,
              transform: showHeader ? "translateY(0)" : "translateY(24px)",
              transition: rm
                ? "none"
                : "opacity 300ms ease-out, transform 300ms ease-out",
            }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
              {c.f001}
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              {c.f002}
            </p>
          </div>

          {/* CTA cards */}
          <div className={GRID.cards3}>
            {ctaCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={index}
                  initial={rm ? false : { opacity: 0, scale: 0.95, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={
                    rm
                      ? { duration: 0 }
                      : { delay: index * 0.08, duration: 0.4 }
                  }
                  whileHover={
                    rm
                      ? {}
                      : {
                          y: -4,
                          transition: {
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        }
                  }
                  className="flex flex-col p-6 rounded-[var(--card-border-radius)] bg-white/10 border border-white/15 hover:bg-white/15 hover:border-white/25 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3
                    className={`${TYPOGRAPHY_STYLES.cardTitle} text-white mb-3`}
                  >
                    {card.title}
                  </h3>
                  <p className="text-base text-white/75 leading-relaxed flex-1 mb-6">
                    {card.description}
                  </p>
                  <Button
                    asChild
                    size="default"
                    variant={card.primary ? "primary" : "outline"}
                    className={
                      card.primary
                        ? "w-full justify-center"
                        : "w-full justify-center border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                    }
                  >
                    <Link
                      to={card.href}
                      className="inline-flex items-center gap-2"
                    >
                      {card.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
