import { BarChart3, Users, Zap, type LucideIcon } from "lucide-react";

export const BEFORE_AFTER = {
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
} as const;

export interface AudienceTab {
  label: string;
  icon: LucideIcon;
  headline: string;
  body: string;
  points: string[];
}

export const AUDIENCE_TABS: AudienceTab[] = [
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
