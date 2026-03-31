import { Link } from "react-router-dom";
import {
  Building2,
  Layers,
  Hammer,
  Droplets,
  Grid3x3,
  Car,
  LayoutDashboard,
  Paintbrush,
  ArrowRight,
  Shield,
  Award,
  FileCheck,
  MapPin,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { GRID } from "@/design-system/layouts";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const services = [
  {
    icon: Building2,
    title: "Façade Remediation",
    description: "Sealant replacement, panel repairs, and full building envelope restoration.",
    detail: "Full-scope envelope rehabilitation: condition assessments, sealant removal and replacement, panel re-anchoring, flashing repairs, and waterproof membrane integration. We coordinate swing-stage access and occupied-building logistics so tenants aren't disrupted.",
    href: "/services/facade-remediation",
  },
  {
    icon: Layers,
    title: "EIFS & Stucco Systems",
    description: "Energy-efficient insulated finish systems and traditional stucco repair.",
    detail: "New EIFS installation and existing system rehabilitation — base-coat repairs, mesh replacement, finish-coat colour matching, and drainage-plane corrections. Installed per manufacturer specs for warranty-eligible assemblies.",
    href: "/services/eifs-stucco-systems",
  },
  {
    icon: Hammer,
    title: "Masonry Restoration",
    description: "Repointing, tuckpointing, and structural stabilisation for brick and stone.",
    detail: "Mortar analysis and compatible repointing, crack stitching, lintel replacement, stone dutchman repairs, and through-wall flashing installation. Heritage-sensitive methods available for designated properties.",
    href: "/services/masonry-restoration",
  },
  {
    icon: Droplets,
    title: "Waterproofing",
    description: "Below-grade, foundation, and deck waterproofing to stop water at the source.",
    detail: "Blind-side, positive-side, and negative-side waterproofing systems. Traffic-bearing membranes for plaza decks, foundation damp-proofing, crack injection, and drainage board installation.",
    href: "/services/waterproofing-systems",
  },
  {
    icon: Grid3x3,
    title: "Metal Cladding",
    description: "Aluminum, steel, and composite panel installation and repairs.",
    detail: "ACM, MCM, and solid-aluminum panel systems — sub-girt layout, panel fabrication coordination, thermal-break detailing, and integration with air/vapour barriers for complete rain-screen assemblies.",
    href: "/services/cladding-systems",
  },
  {
    icon: Car,
    title: "Parking Garage Restoration",
    description: "Concrete repair, traffic coatings, and structural rehab for parkades.",
    detail: "Condition surveys, concrete delamination removal, rebar treatment, shotcrete/form-and-pour repairs, expansion joint replacement, and traffic-bearing polyurethane or MMA coating systems.",
    href: "/services/parking-garage-restoration",
  },
  {
    icon: LayoutDashboard,
    title: "Interior Buildouts",
    description: "Tenant improvements, suite builds, drywall, and finishing trades.",
    detail: "Demising walls, ceiling grids, suite finishing, millwork coordination, and final paint. We handle permit-ready layouts through to deficiency-free handover for commercial and multi-residential interiors.",
    href: "/services/interior-buildouts-finishing",
  },
  {
    icon: Paintbrush,
    title: "Commercial Painting",
    description: "Commercial, condo, and multi-unit painting with premium coatings.",
    detail: "Surface prep, primer systems, and premium finish coats from Benjamin Moore and Sherwin-Williams. Common-area refresh programs, suite turnovers, and high-performance coatings for parking and mechanical rooms.",
    href: "/services/painting-services",
  },
];

const highlights = [
  {
    icon: Shield,
    title: "Complete Services",
    description:
      "Lead specialty contractor with self-perform trades delivering schedule certainty and quality control across envelope, restoration, painting, and interior projects.",
  },
  {
    icon: Award,
    title: "Building Our Track Record",
    description:
      "15+ years combined team experience with on-time, on-budget delivery serving developers, property managers, and institutional clients across the Greater Toronto Area.",
  },
  {
    icon: FileCheck,
    title: "Building Our Credentials",
    description:
      "Licensed business with WSIB registration and insurance in progress. Committed to safety, quality documentation, and professional execution on every project.",
  },
];

const springHover = { type: "spring" as const, stiffness: 300, damping: 20 };

export const HomepageServiceHighlights = () => {
  const rm = useReducedMotion();
  const { ref: introRef, isVisible: introVisible, skipAnimation: introSkip } =
    useScrollFadeIn();
  const { ref: headerRef, isVisible: headerVisible, skipAnimation: headerSkip } =
    useScrollFadeIn();

  const showIntro = introVisible || introSkip || rm;
  const showHeader = headerVisible || headerSkip || rm;

  const fadeStyle = (visible: boolean) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: rm
      ? "none"
      : "opacity 300ms ease-out, transform 300ms ease-out",
  });

  return (
    <section className="pt-12 md:pt-16 pb-20 md:pb-28">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        {/* ── Part 1: Company Introduction ── */}
        <div ref={introRef} style={fadeStyle(showIntro)}>
          {/* Header */}
          <div className="max-w-4xl mb-10">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              About Ascent Group
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight tracking-tight">
              Building Envelope, Restoration &amp; Interior Trades Across Toronto (GTA)
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              Lead contractor for envelope restoration, interior buildouts, painting, and specialty
              trades — planning, self-performing, and delivering accountable results across the GTA
              and Golden Horseshoe.
            </p>
          </div>

          {/* Two-column body */}
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 mb-12">
            <div className="space-y-4">
              <p className="text-base text-muted-foreground leading-relaxed">
                Ascent Group Construction protects and improves buildings — from exterior envelope
                and <span className="font-medium text-foreground">façade restoration</span> to{" "}
                <span className="font-medium text-foreground">interior buildouts</span>,{" "}
                <span className="font-medium text-foreground">painting</span>, and finishing
                trades. We act as the lead contractor, planning access and safety, self-performing
                the core trades, and communicating clearly from site walk to closeout.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                Our foundation is building envelope — but our capability extends across the full
                scope of restoration, interior construction, and specialty trades that commercial
                and multi-unit properties require.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-base text-muted-foreground leading-relaxed">
                We self-perform key trades —{" "}
                <span className="font-medium text-foreground">
                  sealants/caulking, EIFS &amp; stucco, masonry repairs and tuckpointing,
                  waterproofing &amp; protective coatings, concrete and parking-garage
                  rehabilitation, commercial painting, interior buildouts, and tile &amp; flooring
                </span>{" "}
                — coordinating trusted partners only when needed.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                We work safely in occupied buildings, document progress with photo logs, and
                provide applicable manufacturer and workmanship warranties.
              </p>
            </div>
          </div>

          {/* Three highlight cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-5 rounded-lg border border-border/60 bg-card"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Service area + response time */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-14">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              Toronto · Mississauga · Brampton · Vaughan · Markham · GTA &amp; Golden Horseshoe
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              48–72 hour response on new enquiries
            </span>
          </div>

          {/* Divider */}
          <div className="border-b border-border mb-14" />
        </div>

        {/* ── Part 2: Service Cards ── */}
        <div
          ref={headerRef}
          className="max-w-3xl mb-14"
          style={fadeStyle(showHeader)}
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Our Services
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight tracking-tight">
            Specialty Trades, Self-Performed
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Eight core service lines delivered by our own trained crews — no sub-contractor
            hand-offs, full accountability on every project.
          </p>
        </div>

        <div className={GRID.cards4}>
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={rm ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={rm ? { duration: 0 } : { delay: index * 0.08, duration: 0.4 }}
                whileHover={rm ? {} : { y: -6, transition: springHover }}
              >
                <Link
                  to={service.href}
                  className="group/card block p-6 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md focus-within:border-primary/40 focus-within:shadow-md transition-all duration-300 h-full"
                >
                  <motion.div
                    className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover/card:bg-primary/20 transition-colors duration-300"
                    whileHover={rm ? {} : { scale: 1.1 }}
                    transition={springHover}
                  >
                    <Icon className="w-5 h-5 text-primary" />
                  </motion.div>
                  <h3 className="text-base font-bold text-foreground mb-2 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  {/* Hover-reveal detail panel */}
                  <div className="grid grid-rows-[0fr] group-hover/card:grid-rows-[1fr] focus-within:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                    <div className="overflow-hidden">
                      <div className="pt-3 mt-3 border-t border-border/40">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {service.detail}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary">
                          Learn more
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer link */}
        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
          >
            View all services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
