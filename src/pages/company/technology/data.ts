import {
  BarChart3,
  Camera,
  CheckCircle,
  ClipboardList,
  FileSearch,
  FileText,
  FolderCheck,
  HardHat,
  type LucideIcon,
  Search,
  Users,
  Zap,
} from 'lucide-react';

export interface ScrollytellingPhase {
  number: string;
  label: string;
  title: string;
  body: string;
  icon: LucideIcon;
  stat: string;
  statLabel: string;
}

export const SCROLLYTELLING_PHASES: ScrollytellingPhase[] = [
  {
    number: '01',
    label: 'Site Assessment',
    title: 'Every project starts on the ground.',
    body: 'Before a single number is written, our team walks the site. We assess conditions, photograph existing deficiencies, and build a scope based on what we actually see — not assumptions.',
    icon: Search,
    stat: '100%',
    statLabel: 'of projects begin with an in-person site assessment',
  },
  {
    number: '02',
    label: 'Digital Estimating',
    title: 'Accurate takeoffs. Documented quantities.',
    body: 'We use Bluebeam and PlanSwift to perform digital takeoffs directly on plan sets. Every measurement is documented and stored — so when a scope change comes, we can show exactly what changed and why.',
    icon: FileSearch,
    stat: 'Bluebeam',
    statLabel: 'PDF markup and coordinated plan review across our estimating team',
  },
  {
    number: '03',
    label: 'Crew Briefing',
    title: 'Foremen receive a digital package before they mobilize.',
    body: 'Before crews arrive on site, foremen receive digital briefing packages — plan markups, scope summaries, safety requirements, and access details. No surprises. No verbal-only instructions.',
    icon: HardHat,
    stat: 'Day 1',
    statLabel: 'briefing documentation issued before mobilization on every project',
  },
  {
    number: '04',
    label: 'Live Reporting',
    title: 'What happens on site is documented, daily.',
    body: 'Our field teams submit digital daily reports covering labour, materials, weather, progress, and any site issues. Progress photos are systematic and organized by phase — not a random collection.',
    icon: Camera,
    stat: 'Daily',
    statLabel: 'field reports with progress photos on every active project',
  },
  {
    number: '05',
    label: 'Digital Closeout',
    title: 'A complete package when we hand over the keys.',
    body: 'Warranty certificates, product data sheets, as-built records, lien releases — assembled into an organized digital closeout package. Not a pile of paper. A deliverable.',
    icon: FolderCheck,
    stat: '100%',
    statLabel: 'of projects receive a complete digital closeout package',
  },
];

export interface ToolNode {
  id: string;
  label: string;
  sublabel: string;
  x: string;
  y: string;
  description: string;
}

export const TOOLS: ToolNode[] = [
  {
    id: 'bluebeam',
    label: 'Bluebeam',
    sublabel: 'Plan Markup & Review',
    x: '15%',
    y: '35%',
    description:
      'Digital plan sets, takeoff markup, collaborative document review, and coordinated changes across estimating and project teams.',
  },
  {
    id: 'procore',
    label: 'Procore',
    sublabel: 'Project Management',
    x: '50%',
    y: '12%',
    description:
      'When GC projects require it, we integrate with Procore for document management, RFI submissions, and submittal coordination.',
  },
  {
    id: 'planswift',
    label: 'PlanSwift',
    sublabel: 'Quantity Takeoff',
    x: '82%',
    y: '30%',
    description:
      'Accurate digital quantity takeoffs directly from plan sets. Every measurement documented and reproducible.',
  },
  {
    id: 'zztakeoff',
    label: 'ZZTAKEOFF',
    sublabel: 'Specialty Estimating',
    x: '75%',
    y: '65%',
    description:
      'Specialized takeoff software calibrated for building envelope and cladding scopes — more granular than standard construction tools.',
  },
  {
    id: 'autocad',
    label: 'AutoCAD / DWG',
    sublabel: 'Drawing Coordination',
    x: '20%',
    y: '70%',
    description:
      'Our team reads and interprets DWG files, coordinates with architectural sets, and works from IFC exports when BIM models are provided.',
  },
  {
    id: 'bim',
    label: 'BIM 360',
    sublabel: 'Model Coordination',
    x: '50%',
    y: '85%',
    description:
      'BIM coordination capability for GC-led projects. We receive, interpret, and work from 3D models and collaborate within cloud-based BIM environments.',
  },
];

export const TOOL_CONNECTIONS: ReadonlyArray<readonly [number, number]> = [
  [0, 1], [0, 2], [1, 5], [2, 3], [3, 5], [4, 5], [0, 4],
];

export const BEFORE_AFTER = {
  before: {
    label: 'Industry Standard',
    items: [
      'Paper drawing sets — updated by reprint',
      'Email threads for RFIs and change orders',
      'Verbal progress updates to clients',
      'Physical closeout binder at project end',
    ],
  },
  after: {
    label: 'Ascent Standard',
    items: [
      'Bluebeam digital markup — live coordinated set',
      'Documented RFI process through project system',
      'Digital daily reports with progress photography',
      'Organized digital closeout package on completion',
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
    label: 'General Contractors',
    icon: Users,
    headline: 'We work inside your systems.',
    body: "We integrate with Procore, BIM 360, and other PM platforms when required. Our teams submit RFIs, upload progress photos, and manage submittals through your preferred platform. We receive and work from BIM models. We don't need you to translate — we speak the workflow.",
    points: [
      'Procore and BIM 360 integration',
      'RFI and submittal coordination',
      'Digital progress documentation',
      'BIM model interpretation',
    ],
  },
  {
    label: 'Developers & Owners',
    icon: BarChart3,
    headline: "You see what's happening. Every day.",
    body: "Daily reports with organized progress photography. Scope tracking against original estimate. Issues flagged in writing before they become problems. And when we're done, a complete digital closeout package so your building records are organized from day one.",
    points: [
      'Daily digital field reports',
      'Systematic progress photography',
      'Scope change documentation',
      'Complete digital closeout package',
    ],
  },
  {
    label: 'Complex Scopes',
    icon: Zap,
    headline: 'Multi-phase. Multi-system. Still documented.',
    body: 'Large envelope restoration programs with multiple phases, multiple products, and multiple building faces. We track it all digitally — phased documentation, coordinated plan markups, and systematic as-built records so every phase is accounted for.',
    points: [
      'Phased digital documentation',
      'Multi-building coordination',
      'Product compatibility tracking',
      'Phase-by-phase as-built records',
    ],
  },
];

export interface TimelineNode {
  phase: string;
  title: string;
  detail: string;
  icon: LucideIcon;
}

export const TIMELINE_NODES: TimelineNode[] = [
  {
    phase: 'Pre-Mobilization',
    title: 'Plans distributed. Scope confirmed.',
    detail:
      'Coordinated plan set issued in Bluebeam. Crew briefing package assembled and delivered to foremen. Site access, sequencing, and safety requirements documented before a single tool hits the site.',
    icon: FileText,
  },
  {
    phase: 'Day 1',
    title: 'Site established. Documentation begins.',
    detail:
      'Existing conditions photographed systematically. Initial site report submitted. Digital daily log activated. The record of this project starts on day one — not retroactively.',
    icon: Camera,
  },
  {
    phase: 'Field Operations',
    title: 'Daily. Documented. Accountable.',
    detail:
      'Every working day: field report submitted, progress photos uploaded and organized, labour and materials tracked. Issues logged in writing the day they arise.',
    icon: ClipboardList,
  },
  {
    phase: 'Substantial Completion',
    title: 'QA walkthrough. Deficiency list issued.',
    detail:
      'Formal site walkthrough against scope. Deficiency list issued in writing. Photos of outstanding items. Completion confirmed only when documentation matches physical progress.',
    icon: CheckCircle,
  },
  {
    phase: 'Closeout',
    title: 'A complete package. Every time.',
    detail:
      'Warranty certificates, product data sheets, as-built markups, lien releases — organized into a single digital closeout package. Delivered, not mentioned.',
    icon: FolderCheck,
  },
];
