import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Full-bleed parallax image break with bold mission statement.
 * Uses CSS background-attachment: fixed on desktop; static on mobile.
 */
export const HomepageParallaxBreak = () => {
  const rm = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden"
      aria-label="Company mission statement"
    >
      {/* Background layer */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80')",
          backgroundAttachment: rm ? "scroll" : "fixed",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-primary/80" />

      {/* Content */}
      <div className="relative z-10 py-24 md:py-36 lg:py-44 text-center px-6">
        <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground/60 mb-4">
          Our Commitment
        </p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight max-w-4xl mx-auto mb-6 tracking-tight">
          We Protect &amp; Improve the Buildings People Depend On
        </h2>
        <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
          From envelope restoration to interior finishing — self-performed trades,
          accountable delivery, and documentation you can hand to your client.
        </p>
      </div>
    </section>
  );
};
