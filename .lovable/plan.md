

# Add Page-Specific Hero Badges Across All Major Pages

## What
Add pill-style trust badges (like the Projects hero's "Quality Craftsmanship / On-Time Delivery / Safety-First Approach") to every major page hero. Each page gets unique, contextually relevant badges.

## How

### 1. Add `badges` prop to PageHero component (`src/components/shared/PageHero.tsx`)

Add a new `badges` prop (array of `{ icon: LucideIcon; text: string }`) alongside the existing single `badge` string prop. Render them in the same frosted-glass pill style as the Projects hero — `bg-[hsl(var(--bg))]/10 backdrop-blur-sm rounded-full px-4 py-2` with an icon + text. Placed after the description, before CTAs, with stagger animation.

### 2. Add page-specific badges to each major page

| Page | Badges |
|---|---|
| **Services** | Self-Performed Work · Licensed & Insured · GTA Coverage |
| **Capabilities** | 85% Self-Performed · Direct Accountability · Flexible Delivery |
| **Our Process** | Transparent Communication · Documented Progress · On-Time Delivery |
| **Contact** | Fast Response · Free Consultations · No Obligation |
| **Markets** | Multi-Sector Experience · Tailored Solutions · Trade Partnerships |
| **Property Managers** | Reserve Fund Aligned · Fast Response · Clear Documentation |
| **Commercial Clients** | After-Hours Available · Minimal Disruption · Fully Insured |
| **Homeowners** | Owner-Operated · Fully Insured · Free Estimates |
| **Emergency Repair** | Same-Day Assessment · 24/7 Available · GTA-Wide |
| **For Architects** | Building Science Focus · Spec Compliance · Field Testing |
| **Blog** | *(skip — not a service page)* |

### 3. Files changed

| File | Change |
|---|---|
| `src/components/shared/PageHero.tsx` | Add `badges` prop (array with icon + text), render as pill row |
| `src/pages/Services.tsx` | Add badges array |
| `src/pages/Capabilities.tsx` | Add badges array |
| `src/pages/OurProcess.tsx` | Add badges array |
| `src/pages/Contact.tsx` | Add badges array |
| `src/pages/Markets.tsx` | Add badges array |
| `src/pages/PropertyManagers.tsx` | Add badges array |
| `src/pages/CommercialClients.tsx` | Add badges array |
| `src/pages/Homeowners.tsx` | Add badges array |
| `src/pages/EmergencyRepair.tsx` | Add badges array |
| `src/pages/ForArchitects.tsx` | Add badges array |

The PremiumProjectHero (Projects page) already has its own badges and is unchanged.

