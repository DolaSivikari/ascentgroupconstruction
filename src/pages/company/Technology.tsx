import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/constants/company";
import SEO from "@/components/SEO";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CTABand } from "@/design-system/components/CTABand";
import { PageHero } from "@/components/shared/PageHero";
import { companyHeroes } from "@/data/hero-images";
import {
  ArrowRight,
  ArrowDown,
  CheckCircle,
  FileSearch,
  Camera,
  ClipboardList,
  FolderCheck,
  Box,
  MonitorSmartphone,
  Search,
  FileText,
  HardHat,
  ChevronRight,
  Zap,
  Shield,
  Users,
  BarChart3,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const SCROLLYTELLING_PHASES = [
  {
    number: "01",
    label: "Site Assessment",
    title: "Every project starts on the ground.",
    body: "Before a single number is written, our team walks the site. We assess conditions, photograph existing deficiencies, and build a scope based on what we actually see — not assumptions.",
    icon: Search,
    stat: "100%",
    statLabel: "of projects begin with an in-person site assessment",
  },
  {
    number: "02",
    label: "Digital Estimating",
    title: "Accurate takeoffs. Documented quantities.",
    body: "We use Bluebeam and PlanSwift to perform digital takeoffs directly on plan sets. Every measurement is documented and stored — so when a scope change comes, we can show exactly what changed and why.",
    icon: FileSearch,
    stat: "Bluebeam",
    statLabel: "PDF markup and coordinated plan review across our estimating team",
  },
  {
    number: "03",
    label: "Crew Briefing",
    title: "Foremen receive a digital package before they mobilize.",
    body: "Before crews arrive on site, foremen receive digital briefing packages — plan markups, scope summaries, safety requirements, and access details. No surprises. No verbal-only instructions.",
    icon: HardHat,
    stat: "Day 1",
    statLabel: "briefing documentation issued before mobilization on every project",
  },
  {
    number: "04",
    label: "Live Reporting",
    title: "What happens on site is documented, daily.",
    body: "Our field teams submit digital daily reports covering labour, materials, weather, progress, and any site issues. Progress photos are systematic and organized by phase — not a random collection.",
    icon: Camera,
    stat: "Daily",
    statLabel: "field reports with progress photos on every active project",
  },
  {
    number: "05",
    label: "Digital Closeout",
    title: "A complete package when we hand over the keys.",
    body: "Warranty certificates, product data sheets, as-built records, lien releases — assembled into an organized digital closeout package. Not a pile of paper. A deliverable.",
    icon: FolderCheck,
    stat: "100%",
    statLabel: "of projects receive a complete digital closeout package",
  },
];

const TOOLS = [
  {
    id: "bluebeam",
    label: "Bluebeam",
    sublabel: "Plan Markup & Review",
    x: "15%",
    y: "35%",
    description: "Digital plan sets, takeoff markup, collaborative document review, and coordinated changes across estimating and project teams.",
  },
  {
    id: "procore",
    label: "Procore",
    sublabel: "Project Management",
    x: "50%",
    y: "12%",
    description: "When GC projects require it, we integrate with Procore for document management, RFI submissions, and submittal coordination.",
  },
  {
    id: "planswift",
    label: "PlanSwift",
    sublabel: "Quantity Takeoff",
    x: "82%",
    y: "30%",
    description: "Accurate digital quantity takeoffs directly from plan sets. Every measurement documented and reproducible.",
  },
  {
    id: "zztakeoff",
    label: "ZZTAKEOFF",
    sublabel: "Specialty Estimating",
    x: "75%",
    y: "65%",
    description: "Specialized takeoff software calibrated for building envelope and cladding scopes — more granular than standard construction tools.",
  },
  {
    id: "autocad",
    label: "AutoCAD / DWG",
    sublabel: "Drawing Coordination",
    x: "20%",
    y: "70%",
    description: "Our team reads and interprets DWG files, coordinates with architectural sets, and works from IFC exports when BIM models are provided.",
  },
  {
    id: "bim",
    label: "BIM 360",
    sublabel: "Model Coordination",
    x: "50%",
    y: "85%",
    description: "BIM coordination capability for GC-led projects. We receive, interpret, and work from 3D models and collaborate within cloud-based BIM environments.",
  },
];

const TOOL_CONNECTIONS = [
  [0, 1], [0, 2], [1, 5], [2, 3], [3, 5], [4, 5], [0, 4],
];

const BEFORE_AFTER = {
  before: {
    label: "Industry Standard",
    items: [
      "Paper drawing sets — updated by reprint",
      "Email threads for RFIs and change orders",
      "Verbal progress updates to clients",
      "Physical closeout binder at project end",
    ],
  },
  after: {
    label: "Ascent Standard",
    items: [
      "Bluebeam digital markup — live coordinated set",
      "Documented RFI process through project system",
      "Digital daily reports with progress photography",
      "Organized digital closeout package on completion",
    ],
  },
};

const AUDIENCE_TABS = [
  {
    label: "General Contractors",
    icon: Users,
    headline: "We work inside your systems.",
    body: "We integrate with Procore, BIM 360, and other PM platforms when required. Our teams submit RFIs, upload progress photos, and manage submittals through your preferred platform. We receive and work from BIM models. We don't need you to translate — we speak the workflow.",
    points: [
      "Procore and BIM 360 integration",
      "RFI and submittal coordination",
      "Digital progress documentation",
      "BIM model interpretation",
    ],
  },
  {
    label: "Developers & Owners",
    icon: BarChart3,
    headline: "You see what's happening. Every day.",
    body: "Daily reports with organized progress photography. Scope tracking against original estimate. Issues flagged in writing before they become problems. And when we're done, a complete digital closeout package so your building records are organized from day one.",
    points: [
      "Daily digital field reports",
      "Systematic progress photography",
      "Scope change documentation",
      "Complete digital closeout package",
    ],
  },
  {
    label: "Complex Scopes",
    icon: Zap,
    headline: "Multi-phase. Multi-system. Still documented.",
    body: "Large envelope restoration programs with multiple phases, multiple products, and multiple building faces. We track it all digitally — phased documentation, coordinated plan markups, and systematic as-built records so every phase is accounted for.",
    points: [
      "Phased digital documentation",
      "Multi-building coordination",
      "Product compatibility tracking",
      "Phase-by-phase as-built records",
    ],
  },
];

const TIMELINE_NODES = [
  {
    phase: "Pre-Mobilization",
    title: "Plans distributed. Scope confirmed.",
    detail: "Coordinated plan set issued in Bluebeam. Crew briefing package assembled and delivered to foremen. Site access, sequencing, and safety requirements documented before a single tool hits the site.",
    icon: FileText,
  },
  {
    phase: "Day 1",
    title: "Site established. Documentation begins.",
    detail: "Existing conditions photographed systematically. Initial site report submitted. Digital daily log activated. The record of this project starts on day one — not retroactively.",
    icon: Camera,
  },
  {
    phase: "Field Operations",
    title: "Daily. Documented. Accountable.",
    detail: "Every working day: field report submitted, progress photos uploaded and organized, labour and materials tracked. Issues logged in writing the day they arise.",
    icon: ClipboardList,
  },
  {
    phase: "Substantial Completion",
    title: "QA walkthrough. Deficiency list issued.",
    detail: "Formal site walkthrough against scope. Deficiency list issued in writing. Photos of outstanding items. Completion confirmed only when documentation matches physical progress.",
    icon: CheckCircle,
  },
  {
    phase: "Closeout",
    title: "A complete package. Every time.",
    detail: "Warranty certificates, product data sheets, as-built markups, lien releases — organized into a single digital closeout package. Delivered, not mentioned.",
    icon: FolderCheck,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — SCROLLYTELLING (light theme)
// ─────────────────────────────────────────────────────────────────────────────

const ScrollytellingSection = ({ rm }: { rm: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setActivePhase(Math.min(4, Math.floor(latest * 5)));
    });
  }, [scrollYProgress]);

  const phase = SCROLLYTELLING_PHASES[activePhase];
  const PhaseIcon = phase.icon;

  const dur = rm ? 0 : 0.35;

  return (
    <div ref={containerRef} className={`relative ${rm ? "h-auto" : "h-[500vh]"}`}>
      {/* Sticky wrapper */}
      <div className={rm ? "" : "sticky top-0 h-screen"}>
        <div className="relative h-full flex items-center overflow-hidden bg-muted/30">

          {/* Phase progress indicator — left rail */}
          <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            {SCROLLYTELLING_PHASES.map((p, i) => (
              <button
                key={i}
                onClick={rm ? () => setActivePhase(i) : undefined}
                aria-label={`Phase ${i + 1}: ${p.label}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activePhase
                    ? "bg-primary scale-150"
                    : "bg-foreground/20 hover:bg-foreground/40"
                }`}
              />
            ))}
          </div>

          {/* Progress bar — top */}
          <motion.div
            className="absolute top-0 left-0 h-0.5 bg-primary origin-left z-20"
            style={{ scaleX: rm ? 1 : scrollYProgress }}
          />

          {/* Content area */}
          <div className="w-full max-w-6xl mx-auto px-8 md:px-16 lg:px-20">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

              {/* Left — phase number + stat */}
              <div className="order-2 md:order-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`stat-${activePhase}`}
                    initial={rm ? false : { opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={rm ? undefined : { opacity: 0, x: 30 }}
                    transition={{ duration: dur }}
                  >
                    <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">
                      {phase.number} / 05
                    </p>
                    <p className="text-6xl md:text-8xl font-bold text-foreground/10 leading-none mb-4">
                      {phase.stat}
                    </p>
                    <p className="text-sm text-muted-foreground max-w-xs">{phase.statLabel}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right — phase content */}
              <div className="order-1 md:order-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`content-${activePhase}`}
                    initial={rm ? false : { opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={rm ? undefined : { opacity: 0, y: -20 }}
                    transition={{ duration: dur }}
                    className="space-y-6"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-primary/30 bg-primary/10">
                      <PhaseIcon className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-primary font-medium uppercase tracking-wider">
                        {phase.label}
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                      {phase.title}
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      {phase.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Scroll hint — only first phase */}
          <AnimatePresence>
            {activePhase === 0 && !rm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-8 right-10 hidden md:flex items-center gap-2 text-xs text-muted-foreground"
              >
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                Scroll to advance
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reduced motion: show all phases stacked */}
      {rm && (
        <div className="bg-muted/50 rounded-lg max-w-3xl mx-auto px-8 py-10 space-y-10 mt-8">
          {SCROLLYTELLING_PHASES.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="border-l-2 border-primary/30 pl-6">
                <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                  {p.number} / 05 — {p.label}
                </p>
                <h3 className="text-xl font-bold text-foreground mb-2">{p.title}</h3>
                <p className="text-muted-foreground">{p.body}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — CONSTELLATION
// ─────────────────────────────────────────────────────────────────────────────

const ConstellationSection = ({ rm }: { rm: boolean }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const nodeCoords = TOOLS.map((t) => ({
    cx: parseFloat(t.x),
    cy: parseFloat(t.y),
  }));

  return (
    <Section size="major" disableAnimation>
      <SectionHeader
        badge="Our Digital Toolkit"
        title="Tools. Not excuses."
        description="The software we actually use — and why each one earns its place in our workflow."
        align="center"
      />

      {/* Constellation (desktop) / Grid (mobile) */}
      {isMobile ? (
        <div className="grid grid-cols-2 gap-4">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={rm ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: rm ? 0 : i * 0.08, duration: 0.4 }}
              className="p-4 rounded-lg border border-border bg-muted/30"
            >
              <p className="font-bold text-foreground text-sm">{tool.label}</p>
              <p className="text-xs text-primary mb-2">{tool.sublabel}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="relative w-full" style={{ aspectRatio: "16/7" }}>
          <svg
            viewBox="0 0 100 56"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Connection lines */}
            {TOOL_CONNECTIONS.map(([a, b], i) => {
              const ax = nodeCoords[a].cx;
              const ay = nodeCoords[a].cy * 0.56;
              const bx = nodeCoords[b].cx;
              const by = nodeCoords[b].cy * 0.56;
              return (
                <motion.line
                  key={i}
                  x1={ax}
                  y1={ay}
                  x2={bx}
                  y2={by}
                  stroke="hsl(var(--border))"
                  strokeWidth="0.2"
                  initial={rm ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.6 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                />
              );
            })}

            {/* Animated pulses along connections */}
            {!rm &&
              TOOL_CONNECTIONS.map(([a, b], i) => {
                const ax = nodeCoords[a].cx;
                const ay = nodeCoords[a].cy * 0.56;
                const bx = nodeCoords[b].cx;
                const by = nodeCoords[b].cy * 0.56;
                return (
                  <motion.circle
                    key={`pulse-${i}`}
                    r={0.5}
                    fill="hsl(var(--primary))"
                    animate={{
                      cx: [ax, bx, ax],
                      cy: [ay, by, ay],
                      opacity: [0, 0.9, 0.9, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      delay: 1 + i * 0.4,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                      ease: "easeInOut",
                    }}
                  />
                );
              })}

            {/* Tool nodes */}
            {TOOLS.map((tool, i) => {
              const cx = nodeCoords[i].cx;
              const cy = nodeCoords[i].cy * 0.56;
              const isHovered = hovered === i;
              return (
                <g
                  key={tool.id}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 4.5 : 3}
                    fill="hsl(var(--primary) / 0.12)"
                    stroke="hsl(var(--primary))"
                    strokeWidth="0.15"
                    initial={rm ? false : { scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                  />
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={1.2}
                    fill="hsl(var(--primary))"
                    initial={rm ? false : { scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ delay: 0.6 + i * 0.12, duration: 0.3, type: "spring" }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                  />
                  <motion.text
                    x={cx}
                    y={cy + 5.5}
                    textAnchor="middle"
                    fill="hsl(var(--foreground))"
                    fontSize="1.8"
                    fontWeight="600"
                    initial={rm ? false : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                  >
                    {tool.label}
                  </motion.text>
                  <motion.text
                    x={cx}
                    y={cy + 7.5}
                    textAnchor="middle"
                    fill="hsl(var(--muted-foreground))"
                    fontSize="1.4"
                    initial={rm ? false : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ delay: 0.9 + i * 0.1, duration: 0.3 }}
                  >
                    {tool.sublabel}
                  </motion.text>
                </g>
              );
            })}
          </svg>

          {/* Hover tooltip */}
          <AnimatePresence>
            {hovered !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 p-4 bg-card text-card-foreground rounded-lg shadow-lg border border-border pointer-events-none z-30"
              >
                <p className="font-bold text-sm mb-0.5">{TOOLS[hovered].label}</p>
                <p className="text-xs text-primary mb-2">{TOOLS[hovered].sublabel}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {TOOLS[hovered].description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — BEFORE / AFTER SLIDER
// ─────────────────────────────────────────────────────────────────────────────

const BeforeAfterSlider = ({ rm }: { rm: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  useEffect(() => {
    const onUp = () => { isDragging.current = false; };
    document.addEventListener("pointermove", handlePointerMove as EventListener);
    document.addEventListener("pointerup", onUp);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove as EventListener);
      document.removeEventListener("pointerup", onUp);
    };
  }, [handlePointerMove]);

  return (
    <div ref={sectionRef}>
    <Section size="major" className="bg-muted/30" disableAnimation>
      <SectionHeader
        badge="The Difference"
        title="Industry standard vs. Ascent standard."
        description="Drag to compare. Both approaches finish the job. Only one documents it."
        align="center"
      />

      {/* Slider */}
      <motion.div
        initial={rm ? false : { opacity: 0, scale: 0.98 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        ref={containerRef}
        onPointerDown={() => { isDragging.current = true; }}
        className="relative h-80 md:h-96 rounded-lg overflow-hidden border border-border select-none cursor-col-resize"
        style={{ touchAction: "none" }}
      >
        {/* Left panel — Industry Standard */}
        <div className="absolute inset-0 bg-muted flex flex-col justify-center">
          <div className="w-1/2 px-8 md:px-12">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-5">
              Industry Standard
            </p>
            <ul className="space-y-3">
              {BEFORE_AFTER.before.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/70">
                  <span className="w-4 h-4 rounded-full border border-border flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right panel — Ascent Standard (clipped) */}
        <div
          className="absolute inset-0 bg-primary flex flex-col justify-center"
          style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
        >
          <div className="absolute inset-0 flex flex-col justify-center items-end">
            <div className="w-1/2 px-8 md:px-12">
              <p className="text-sm font-medium text-primary-foreground/80 uppercase tracking-wider mb-5">
                Ascent Standard
              </p>
              <ul className="space-y-3">
                {BEFORE_AFTER.after.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-primary-foreground/90">
                    <CheckCircle className="w-4 h-4 text-primary-foreground flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary z-20"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg cursor-col-resize">
            <div className="flex gap-0.5">
              <ChevronRight className="w-3 h-3 text-primary-foreground rotate-180" />
              <ChevronRight className="w-3 h-3 text-primary-foreground" />
            </div>
          </div>
        </div>
      </motion.div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Drag the handle to compare approaches
      </p>
    </Section>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — AUDIENCE TABS
// ─────────────────────────────────────────────────────────────────────────────

const AudienceTabs = ({ rm }: { rm: boolean }) => {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const tab = AUDIENCE_TABS[activeTab];
  const TabIcon = tab.icon;

  return (
    <div ref={sectionRef}>
    <Section size="major" disableAnimation>
      <SectionHeader
        badge="Who We Work With"
        title="Digital coordination, tailored to your role."
        align="center"
      />

      {/* Tab bar */}
      <motion.div
        initial={rm ? false : { opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex flex-wrap justify-center gap-2 mb-10"
        role="tablist"
      >
        {AUDIENCE_TABS.map((t, i) => {
          const Icon = t.icon;
          return (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeTab}
              onClick={() => setActiveTab(i)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                i === activeTab
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={rm ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={rm ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: rm ? 0 : 0.3 }}
          className="grid md:grid-cols-2 gap-10 items-center"
        >
          {/* Left — headline + body */}
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-6">
              <TabIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
              {tab.headline}
            </h3>
            <p className="text-muted-foreground leading-relaxed">{tab.body}</p>
          </div>

          {/* Right — checklist */}
          <div className="bg-muted/40 rounded-lg p-8 border border-border/60">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-5">
              What this means for you
            </p>
            <ul className="space-y-4">
              {tab.points.map((point, i) => (
                <motion.li
                  key={i}
                  initial={rm ? false : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: rm ? 0 : 0.1 + i * 0.08, duration: 0.3 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{point}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </Section>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6 — TIMELINE (light theme)
// ─────────────────────────────────────────────────────────────────────────────

const TimelineSection = ({ rm }: { rm: boolean }) => {
  return (
    <Section size="major" className="bg-muted/30">
      <SectionHeader
        badge="Project Timeline"
        title="Every phase. Documented."
        description="From pre-mobilization through closeout, every stage is backed by a clear documentation standard."
        align="left"
      />

      {/* Timeline grid */}
      <div className="grid md:grid-cols-5 gap-0 md:gap-0 border border-border rounded-lg overflow-hidden bg-background">
        {TIMELINE_NODES.map((node, i) => {
          const Icon = node.icon;
          const isLast = i === TIMELINE_NODES.length - 1;
          return (
            <motion.div
              key={i}
              initial={rm ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: rm ? 0 : i * 0.08, duration: 0.4 }}
              className={`relative p-6 md:p-5 lg:p-6 ${!isLast ? "border-b md:border-b-0 md:border-r border-border" : ""}`}
            >
              {/* Step number */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-foreground/10 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 h-px bg-border" />
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-primary" />
                </div>
              </div>

              {/* Phase label */}
              <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1.5">
                {node.phase}
              </p>

              {/* Title */}
              <h3 className="text-sm font-bold text-foreground mb-2 leading-snug">
                {node.title}
              </h3>

              {/* Detail */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {node.detail}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-8 flex items-center gap-4">
        <Button asChild size="lg">
          <Link to="/our-process">
            View Our Process <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
        <span className="text-sm text-muted-foreground">
          See how this maps to our 7-step delivery process.
        </span>
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CROSS-LINKS
// ─────────────────────────────────────────────────────────────────────────────

const CrossLinks = () => (
  <Section size="subsection" className="bg-muted/30 border-t border-border/50">
    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {[
        {
          title: "Our Delivery Process",
          body: "See how digital tools integrate at each stage of our 5-step delivery process.",
          href: "/our-process",
          label: "View Process",
        },
        {
          title: "Prequalification",
          body: "Download our capability statement, WSIB certificate, and insurance docs.",
          href: "/prequalification",
          label: "Get Pre-Qual Docs",
        },
        {
          title: "For General Contractors",
          body: "How we work as a specialty trade partner on GC-led projects.",
          href: "/for-general-contractors",
          label: "Learn More",
        },
      ].map((card, i) => (
        <div key={i} className="p-6 bg-background rounded-lg border border-border hover:shadow-md transition-shadow">
          <h3 className="font-bold text-foreground mb-2">{card.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{card.body}</p>
          <Link
            to={card.href}
            className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
          >
            {card.label} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ))}
    </div>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const Technology = () => {
  const rm = useReducedMotion();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Company", item: `${SITE_URL}/about` },
      { "@type": "ListItem", position: 3, name: "Technology & Digital Tools" },
    ],
  };

  return (
    <>
      <SEO
        title="Technology & Digital Tools"
        description="Ascent Group Construction uses Bluebeam, Procore, BIM 360, and digital documentation workflows to deliver coordinated, accountable specialty trade projects across the GTA."
        keywords="construction technology, Bluebeam, Procore, BIM coordination, digital closeout, specialty contractor documentation, GTA construction"
        structuredData={[breadcrumbSchema]}
      />
      <Navigation />

      <main>
        {/* ── HERO — Standard PageHero ─────────────────────────────────── */}
        <PageHero
          eyebrow="Technology & Documentation"
          title="Built on Digital Precision"
          description="From the first site assessment to the final closeout package — every step of our process is documented, coordinated, and accountable. No verbal-only updates, no retroactive records."
          image={companyHeroes["our-process"]}
          imageAlt="Ascent Group digital construction technology"
          height="medium"
          overlay="gradient"
          stats={[
            { value: "100%", label: "Projects Site-Assessed" },
            { value: "Daily",  label: "Field Reports" },
            { value: "100%", label: "Digital Closeout" },
          ]}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Company", href: "/about" },
            { label: "Technology & Digital Tools" },
          ]}
          primaryCta={{ text: "Request a Site Assessment", href: "/contact" }}
          secondaryCta={{ text: "Our Delivery Process", href: "/our-process" }}
        />

        {/* ── TOOL STRIP ──────────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--ink))] py-6 border-b border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm">
              <span className="text-white/40 uppercase tracking-wider text-xs font-medium">Tools we use</span>
              {["Bluebeam", "PlanSwift", "ZZTAKEOFF", "Procore", "AutoCAD / DWG", "BIM 360"].map((tool) => (
                <span key={tool} className="text-white/70 font-medium hover:text-white transition-colors">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── SCROLLYTELLING ──────────────────────────────────────────── */}
        <ScrollytellingSection rm={rm} />

        {/* ── CONSTELLATION ───────────────────────────────────────────── */}
        <ConstellationSection rm={rm} />

        {/* ── BEFORE / AFTER SLIDER ───────────────────────────────────── */}
        <BeforeAfterSlider rm={rm} />

        {/* ── AUDIENCE TABS ───────────────────────────────────────────── */}
        <AudienceTabs rm={rm} />

        {/* ── TIMELINE ────────────────────────────────────────────────── */}
        <TimelineSection rm={rm} />

        {/* ── CTA BAND ────────────────────────────────────────────────── */}
        <CTABand
          title="The Ascent Standard"
          description="We assess before we estimate. We document before we mobilize. We report every day we're on site. We close out with a full digital package."
          primaryCta={{ text: "Start A Conversation", href: "/contact" }}
          secondaryCta={{ text: "Get Prequalified", href: "/prequalification" }}
          variant="dark"
        />

        {/* ── CROSS-LINKS ─────────────────────────────────────────────── */}
        <CrossLinks />
      </main>

      <Footer />
    </>
  );
};

export default Technology;
