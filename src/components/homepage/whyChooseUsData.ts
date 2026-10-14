import type { WhyChooseUsItem } from "@/hooks/useWhyChooseUs";

export type BenefitAudience = "clients" | "owners";
export interface Benefit {
  id: string;
  audience: BenefitAudience;
  icon: string;
  title: string;
  description: string;
  badge: string;
}
export interface BenefitSlide {
  audience: BenefitAudience;
  items: Benefit[];
}

export function clientBenefits(c: Record<string, string>): Benefit[] {
  const benefits = [
    {
      title: c.f025,
      desc: "One team, one contract, one responsible point of contact.",
    },
    {
      title: c.f026,
      desc: "Sealants/caulking, EIFS & stucco, masonry repairs, waterproofing & protective coatings, concrete and parking‑garage rehabilitation, commercial painting, interior buildouts.",
    },
    {
      title: c.f027,
      desc: "We build to drawings and specs, submit materials, and document compliance.",
    },
    {
      title: c.f028,
      desc: "Photo logs, inspection records (ITPs when requested), clear punch‑list closeout.",
    },
    {
      title: c.f029,
      desc: "Safe access, phasing, tenant coordination, off‑hours where needed.",
    },
    {
      title: c.f030,
      desc: "48–72‑hour site walks, fast submittals, and unit pricing for GC trade packages.",
    },
    {
      title: c.f031,
      desc: "Toronto, Mississauga, Brampton, Vaughan/Markham, Oakville/Burlington, Hamilton.",
    },
  ];
  return benefits.map((item, i) => ({
    id: `client-${i}`,
    audience: "clients",
    icon: "CheckCircle2",
    title: item.title,
    description: item.desc,
    badge: "",
  }));
}

export function ownerBenefits(
  c: Record<string, string>,
  saved?: WhyChooseUsItem[],
): Benefit[] {
  const fallbackDifferentiators = [
    {
      icon: "Shield",
      title: c.f008,
      desc: "Fully licensed and insured with $2M CGL liability coverage, active WSIB registration, and working toward COR certification. Professional execution backed by comprehensive insurance and safety protocols.",
      stats: "$2M CGL Insured",
    },
    {
      icon: "Building",
      title: c.f009,
      desc: "Specialty services from building envelope restoration to interior trades. Single point of contact eliminates coordination complexity and streamlines project delivery.",
      stats: "Self-Performed Core Scopes",
    },
    {
      icon: "Award",
      title: c.f010,
      desc: "Working with trusted manufacturer brands including Benjamin Moore and Sherwin-Williams, with extended warranties. Proven installation methods ensure lasting quality and performance.",
      stats: "Extended Warranties",
    },
    {
      icon: "Calendar",
      title: c.f011,
      desc: "Dedicated project management with transparent pricing and detailed estimates. Our systematic approach and self-performed work keep projects on track.",
      stats: "WSIB Compliant",
    },
    {
      icon: "HardHat",
      title: c.f012,
      desc: "Certified safety-trained crews with continuous training and comprehensive safety protocols backed by full liability coverage on every project.",
      stats: "Ontario Safety Standards",
    },
    {
      icon: "Hammer",
      title: c.f013,
      desc: "Rigorous quality control processes and proven best practices ensure exceptional results. Every project meets or exceeds regulatory requirements and client expectations.",
      stats: "",
    },
  ];
  return saved?.length
    ? saved.map((item) => ({
        id: `owner-${item.id}`,
        audience: "owners",
        icon: item.icon_name || "BadgeCheck",
        title: item.title,
        description: item.description,
        badge: item.stats_badge || "",
      }))
    : fallbackDifferentiators.map((item, i) => ({
        id: `owner-${i}`,
        audience: "owners",
        icon: item.icon,
        title: item.title,
        description: item.desc,
        badge: item.stats,
      }));
}

/** Balance each audience across pages, avoiding a lone last card on desktop. */
export function benefitSlides(
  clients: Benefit[],
  owners: Benefit[],
  size: number,
): BenefitSlide[] {
  const slides: BenefitSlide[] = [];
  for (const items of [clients, owners]) {
    let start = 0;
    let remainingPages = Math.ceil(items.length / Math.max(1, size));
    while (remainingPages > 0) {
      const count = Math.ceil((items.length - start) / remainingPages);
      slides.push({
        audience: items[start].audience,
        items: items.slice(start, start + count),
      });
      start += count;
      remainingPages--;
    }
  }
  return slides;
}
