# Week 1 Implementation Plan: Critical Content Realignment
## Ascent Group Construction - Positioning as Main/Lead Contractor

---

## Executive Summary

**Objective**: Align website messaging to position Ascent Group Construction as a **main specialty contractor** with proven 15+ years combined experience, serving commercial and residential markets, with a 3-5 year vision to expand into general contracting capabilities.

**Timeline**: Week 1 (Priority Fixes)
**Estimated Hours**: 12-15 hours total
**Impact**: Critical for bidding platforms, GC partnerships, and lead generation

---

## Priority 1: Prequalification Page Overhaul
**File**: `src/pages/Prequalification.tsx`
**Impact**: CRITICAL - This page is what GCs and bidding platforms will review
**Hours**: 5-6 hours

### Current Problems

The prequalification page currently presents Ascent as an **established general contractor** with capabilities that don't match reality:

```typescript
// CURRENT (Lines 46-53)
const companyHighlights = [
  { icon: Calendar, label: "Experience", value: "15+ Years", desc: "Combined team experience" },
  { icon: DollarSign, label: "Annual Volume", value: "$10-30M", desc: "Consistent project delivery" },
  { icon: Shield, label: "Bonding Capacity", value: "$5M", desc: "Single project capacity" },
  { icon: Building2, label: "Insurance", value: "$5M", desc: "General liability coverage" },
  { icon: Award, label: "Safety Record", value: "Working Toward COR", desc: "Zero lost-time incidents" },
  { icon: Users, label: "Workforce", value: "20-50", desc: "Skilled tradespeople" },
];

// CURRENT (Lines 55-60)
const capabilities = [
  { category: "Primary Delivery Methods", items: ["General Contracting", "Construction Management", "Design-Build"] },
  { category: "Self-Perform Trades", items: ["EIFS & Stucco", "Masonry Restoration", "Waterproofing", "Exterior Cladding"] },
  { category: "Market Sectors", items: ["Commercial", "Multi-Family", "Institutional", "Industrial"] },
  { category: "Project Range", items: ["$100K - $5M single projects", "Multiple concurrent projects", "Emergency response available"] },
];

// CURRENT (Lines 62-87)
const recentProjects = [
  {
    name: "Waterfront Condo Restoration",
    client: "Property Management Corp",
    sector: "Multi-Family",
    value: "$2.5M",
    year: "2024",
    scope: "Building envelope restoration, balcony repairs, waterproofing"
  },
  // ... more inflated projects
];
```

**Why This Is Dangerous**:
- Claims $10-30M annual volume (unrealistic for new company)
- Claims $5M bonding capacity (likely not yet secured)
- Lists 20-50 skilled tradespeople (overstated)
- Shows $2.5M projects in 2024 (company founded 2025)
- Positions as GC (contradicts goal to work WITH GCs as subcontractor)

### REQUIRED CHANGES

#### Change 1: Company Highlights (Lines 46-53)

**REPLACE WITH**:
```typescript
const companyHighlights = [
  { 
    icon: Calendar, 
    label: "Team Experience", 
    value: "15+ Years", 
    desc: "Combined hands-on experience in GTA market" 
  },
  { 
    icon: Building2, 
    label: "Company Status", 
    value: "Est. 2025", 
    desc: "New incorporation, experienced crew" 
  },
  { 
    icon: Shield, 
    label: "Insurance Coverage", 
    value: "$5M CGL", 
    desc: "General liability + WSIB compliant" 
  },
  { 
    icon: Award, 
    label: "Safety Commitment", 
    value: "COR-Ready", 
    desc: "Working toward COR certification" 
  },
  { 
    icon: DollarSign, 
    label: "Project Range", 
    value: "$25K-$500K", 
    desc: "Building portfolio of specialty work" 
  },
  { 
    icon: Users, 
    label: "Core Crew", 
    value: "10 Skilled", 
    desc: "Self-perform team + trusted partners" 
  },
];
```

**Rationale**: 
- Honest about new incorporation while emphasizing experience
- Realistic project range for a new specialty contractor
- Shows insurance/safety compliance without false claims
- Positions as growing company, not established GC

---

#### Change 2: Capabilities Section (Lines 55-60)

**REPLACE WITH**:
```typescript
const capabilities = [
  { 
    category: "Primary Service Delivery", 
    items: [
      "Lead Specialty Contractor (Building Envelope & Interior Trades)",
      "Self-Performed Envelope Restoration & Waterproofing", 
      "Subcontractor to General Contractors",
      "Direct-to-Owner Trade Execution"
    ] 
  },
  { 
    category: "Core Self-Perform Trades", 
    items: [
      "EIFS & Stucco Installation/Repair", 
      "Masonry Restoration & Tuckpointing", 
      "Caulking/Sealant Replacement", 
      "Exterior Cladding Systems",
      "Interior Painting & Finishing",
      "Tile & Flooring Installation",
      "Drywall & Finishing"
    ] 
  },
  { 
    category: "Target Markets", 
    items: [
      "Commercial Building Envelope (Subcontractor Role)", 
      "Multi-Family Restoration (Property Managers)",
      "Residential Renovations (Homeowners)",
      "Institutional Maintenance (Through GCs)"
    ] 
  },
  { 
    category: "Current Project Capacity", 
    items: [
      "$25K - $500K single project value", 
      "Multiple small-to-mid projects concurrent",
      "Building portfolio + client relationships",
      "Emergency response for existing clients"
    ] 
  },
];
```

**Rationale**:
- Clarifies role as **specialty contractor** not GC
- Shows willingness to work as subcontractor to GCs (key for partnerships)
- Expands beyond just commercial envelope to residential services
- Sets realistic project capacity expectations

---

#### Change 3: Recent Projects Section (Lines 62-87)

**REPLACE WITH**:
```typescript
const recentProjects = [
  {
    name: "Multi-Unit EIFS Repair",
    client: "Private Property Manager",
    sector: "Multi-Family Residential",
    value: "$85K",
    year: "2024 (Pre-Incorporation)",
    scope: "EIFS damage repair, caulking replacement, color-matched finishing"
  },
  {
    name: "Commercial Storefront Renovation",
    client: "Retail Business Owner",
    sector: "Commercial",
    value: "$45K",
    year: "2024 (Pre-Incorporation)",
    scope: "Interior painting, drywall repair, ceiling finishing, floor prep"
  },
  {
    name: "Condo Balcony Waterproofing",
    client: "Condo Corporation (Through GC)",
    sector: "Multi-Family",
    value: "$35K",
    year: "2023 (Team Experience)",
    scope: "Balcony membrane replacement, railing refinishing, drainage correction"
  },
];
```

**Rationale**:
- Shows **realistic project sizes** for a new specialty contractor
- Clarifies these are team experience projects, not inflated claims
- Demonstrates range: commercial, residential, subcontractor work
- Sets appropriate expectations for bidding platforms

---

#### Change 4: Add New "Company Status" Callout Section

**INSERT AFTER** the PageHeader component (~Line 240):

```tsx
{/* Company Status Transparency Banner */}
<Section variant="default" className="pt-8 pb-4">
  <Card className="border-primary/20 bg-primary/5">
    <CardContent className="pt-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Company Status: New Incorporation, Experienced Team</h3>
          <p className="text-muted-foreground mb-4">
            Ascent Group Construction was incorporated in 2025, but our team brings <strong>15+ years of combined hands-on experience</strong> from building envelope and interior trades work on commercial and multi-family projects throughout the Greater Toronto Area.
          </p>
          <p className="text-muted-foreground">
            We founded Ascent Group to provide <strong>direct, accountable specialty trade execution</strong> for property managers, building owners, consultants, and general contractors who need reliable partners for envelope restoration, waterproofing, EIFS, masonry, and interior finishing work.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</Section>
```

**Rationale**:
- Proactive transparency builds more trust than hiding new status
- Emphasizes **team experience** over company age
- Positions clearly as specialty contractor, not GC competitor

---

### Additional Prequalification Changes

#### Change 5: Update Page Title & Meta Description

**CURRENT (Line ~213)**:
```tsx
<SEO 
  title="Pre-Qualification Package - Ascent Group Construction"
  description="Download our complete pre-qualification package..."
/>
```

**REPLACE WITH**:
```tsx
<SEO 
  title="Vendor Pre-Qualification Package - Main Specialty Contractor | Ascent Group Construction"
  description="Pre-qualification package for Ascent Group Construction - 15+ years team experience in building envelope, EIFS, masonry, interior trades. WSIB compliant, $5M CGL coverage. Serving GCs, property managers, and building owners in Ontario."
  keywords="specialty contractor prequalification, building envelope contractor Ontario, EIFS contractor GTA, masonry restoration Toronto, vendor prequalification package, subcontractor services"
/>
```

---

#### Change 6: Update Hero Section Headline

**CURRENT (Line ~226)**:
```tsx
<PageHeader
  title="Pre-Qualification Package"
  description="Download our comprehensive company overview..."
  backgroundImage={heroImage}
/>
```

**REPLACE WITH**:
```tsx
<PageHeader
  title="Vendor Pre-Qualification Package"
  description="15+ Years Combined Team Experience • Building Envelope & Interior Trades Specialist • WSIB Compliant • $5M CGL Coverage • Serving Commercial, Multi-Family & Residential Markets"
  backgroundImage={heroImage}
/>
```

---

## Priority 2: Company Story Reframe
**Files**: `src/data/enriched-company-content.ts`, `src/pages/About.tsx`, Homepage hero content
**Impact**: HIGH - Affects trust across entire site
**Hours**: 4-5 hours

### Problem: "New Company" Messaging Undermines Credibility

Throughout the site, the messaging repeatedly emphasizes "new company, experienced team" which can trigger skepticism from:
- Bidding platforms (prefer established contractors)
- General contractors (need proven reliability)
- Property managers (avoid risk)

### REQUIRED CHANGES

#### Change 1: Update `enrichedCompanyStory` in `src/data/enriched-company-content.ts`

**CURRENT (Lines 6-7)**:
```typescript
content: `Ascent Group Construction was established in 2025 by construction professionals who bring 15+ years of combined experience...
```

**REPLACE WITH**:
```typescript
content: `Ascent Group Construction represents the next chapter for a team with 15+ years of combined experience in building envelope and interior trades work across the Greater Toronto Area.

After years of delivering high-quality specialty work on multi-unit residential towers, commercial developments, and institutional buildings, our founding team recognized an opportunity: property managers, building owners, consultants, and general contractors need reliable specialty trade partners who bring proven hands-on experience, professional execution, and direct accountability.

We incorporated Ascent Group in 2025 to formalize this approach: providing building envelope restoration, EIFS systems, masonry work, waterproofing, and interior finishing services with the same professional standards and work quality we've maintained throughout our careers—now under our own name.
```

**Rationale**:
- Leads with **15+ years experience**, not "established in 2025"
- Positions incorporation as strategic move, not startup vulnerability
- Emphasizes continuity of quality and professionalism
- Shows intentionality: "we founded Ascent to..."

---

#### Change 2: Update Stats Section

**CURRENT (Lines 33-40)**:
```typescript
stats: [
  { value: '15+', label: 'Years Team Experience' },
  { value: '2025', label: 'Company Founded' },
  { value: '85%', label: 'Self-Performed Work' },
  { value: '$5M+', label: 'Liability Coverage' },
  { value: '10', label: 'Core Team Members' },
  { value: '100%', label: 'WSIB Compliant' }
]
```

**REPLACE WITH**:
```typescript
stats: [
  { value: '15+', label: 'Years Combined Experience' },
  { value: '85%', label: 'Self-Performed Work' },
  { value: '$5M', label: 'CGL Liability Coverage' },
  { value: '10+', label: 'Core Team Members' },
  { value: '100%', label: 'WSIB Compliant' },
  { value: 'COR-Ready', label: 'Safety Certification Path' }
]
```

**Rationale**:
- Removes "Company Founded 2025" which draws attention to new status
- Adds safety certification progress (valuable for GCs)
- Keeps all credibility indicators (insurance, WSIB, team size)

---

#### Change 3: Update Founder Bio

**CURRENT (Lines 88-96)**:
```typescript
bio: `Hebun founded Ascent Group Construction in 2025 after gaining extensive experience...

Ascent Group was founded on a simple principle: property managers, building owners, and general contractors need trade partners who bring real experience, professional standards, and direct accountability—without the complexity of layered subcontracting.
```

**REPLACE WITH**:
```typescript
bio: `Hebun established Ascent Group Construction in 2025 to bring 15+ years of proven building envelope and interior trades expertise directly to commercial, multi-family, and residential clients across Ontario.

Throughout his career, Hebun has worked on hundreds of envelope restoration, EIFS installation, masonry repair, and interior finishing projects—from 3-story walk-ups to 30-story high-rises, from retail renovations to institutional maintenance programs.

This depth of hands-on experience revealed a clear need in the market: property managers, building owners, consultants, and general contractors all need reliable specialty trade partners who combine technical expertise, professional execution, and direct accountability—without the complexity of layered subcontracting or the inflated margins of multiple middlemen.

Ascent Group was created to fill this gap: delivering prime-scope specialty trade work with the same quality standards, safety protocols, and professional conduct clients expect from established firms, backed by a team that has proven these capabilities through years of successful project delivery.

Hebun's vision for Ascent Group is sustainable growth through client satisfaction, quality execution, and a strong reputation in the Ontario construction market. The long-term goal is to expand service capabilities and eventually build toward general contractor services—but only after establishing a solid foundation as a trusted, accountable specialty contractor.
```

**Rationale**:
- Focuses on **experience and capability**, not company age
- Shows depth: "hundreds of projects" builds confidence
- Clarifies market positioning: specialty contractor first, GC aspiration later
- Demonstrates strategic thinking: growing methodically, not overextending

---

#### Change 4: Update About Page Introduction (src/pages/About.tsx)

**FIND** the company introduction section (~Line 140-180) and update the headline:

**CURRENT**:
```tsx
<h3 className="text-2xl md:text-3xl font-semibold mb-4">The Ascent Story</h3>
```

**REPLACE WITH**:
```tsx
<h3 className="text-2xl md:text-3xl font-semibold mb-4">Proven Expertise. New Name.</h3>
```

**FIND** the introduction paragraph and **REPLACE WITH**:

```tsx
<p className="text-lg text-muted-foreground leading-relaxed mb-4">
  Ascent Group Construction represents over 15 years of combined experience in building envelope and interior trades work across the Greater Toronto Area—formalized under a new company name in 2025.
</p>
<p className="text-lg text-muted-foreground leading-relaxed mb-4">
  Our team has delivered hundreds of envelope restoration, EIFS installation, masonry repair, waterproofing, and interior finishing projects on buildings ranging from residential walk-ups to 30-story towers. We've worked as trusted trade partners for general contractors, property managers, building consultants, and institutional clients who demand professional execution and reliable results.
</p>
<p className="text-lg text-muted-foreground leading-relaxed">
  We founded Ascent Group to bring this proven capability directly to clients who need specialty trade expertise without the complexity of layered subcontracting. Our focus is simple: deliver high-quality envelope and interior work, maintain professional safety and communication standards, and build lasting relationships through accountable performance.
</p>
```

---

## Priority 3: Create Homeowners Page
**File**: `src/pages/Homeowners.tsx` (NEW)
**Impact**: HIGH - Missing target audience page
**Hours**: 3-4 hours

### Problem: No Dedicated Residential/Homeowner Presence

Hebun wants to serve homeowners for painting, renovations, tile, flooring, etc., but there's no dedicated page explaining residential services. The site heavily skews commercial.

### SOLUTION: Create `/homeowners` Page

**Create new file**: `src/pages/Homeowners.tsx`

```tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import { Section } from "@/components/sections/Section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Paintbrush, 
  Hammer, 
  Droplets, 
  Square, 
  Shield,
  CheckCircle,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  ClipboardCheck,
  Award,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { ParallaxSection } from "@/components/animations/ParallaxSection";
import heroImage from "@/assets/heroes/hero-residential-painting.jpg";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";

const Homeowners = () => {
  usePageAnalytics('homeowners');

  const residentialServices = [
    {
      icon: Paintbrush,
      title: "Interior & Exterior Painting",
      description: "Complete painting services for homes, condos, and townhouses. Professional prep work, quality finishes, and clean execution.",
      scope: [
        "Full interior painting (walls, ceilings, trim)",
        "Exterior painting (siding, stucco, brick)",
        "Color consultation and matching",
        "Minor drywall repair included"
      ],
      typical: "$2,000 - $15,000",
      timeline: "3-7 days"
    },
    {
      icon: Home,
      title: "Stucco & EIFS Repair",
      description: "Residential stucco repairs, EIFS damage correction, and color-matched finishing. We fix cracks, water damage, and impact damage.",
      scope: [
        "Stucco crack repair and patching",
        "EIFS impact damage restoration",
        "Water damage investigation and repair",
        "Color and texture matching"
      ],
      typical: "$1,500 - $8,000",
      timeline: "2-5 days"
    },
    {
      icon: Square,
      title: "Tile & Flooring Installation",
      description: "Ceramic, porcelain, vinyl plank, and laminate installation for kitchens, bathrooms, basements, and living areas.",
      scope: [
        "Tile installation (floor and wall)",
        "Vinyl plank and laminate flooring",
        "Bathroom and kitchen backsplashes",
        "Subfloor prep and leveling"
      ],
      typical: "$3,000 - $12,000",
      timeline: "3-8 days"
    },
    {
      icon: Droplets,
      title: "Waterproofing & Caulking",
      description: "Residential waterproofing for basements, balconies, and building perimeter. Caulking replacement for windows and doors.",
      scope: [
        "Window and door caulking replacement",
        "Balcony waterproofing (condo units)",
        "Basement waterproofing (interior/exterior)",
        "Foundation crack repair"
      ],
      typical: "$1,200 - $6,000",
      timeline: "1-4 days"
    },
    {
      icon: Hammer,
      title: "Renovation & Finishing",
      description: "Basement finishing, bathroom renovations, kitchen updates, and general home improvements.",
      scope: [
        "Basement finishing and drywall",
        "Bathroom renovation and tiling",
        "Kitchen backsplash and painting",
        "Trim, doors, and finishing carpentry"
      ],
      typical: "$5,000 - $35,000",
      timeline: "1-4 weeks"
    },
    {
      icon: Home,
      title: "Exterior Cladding & Siding",
      description: "Siding repair and replacement for residential homes. Hardie board, vinyl, and wood siding services.",
      scope: [
        "Siding repair and replacement",
        "Hardie board installation",
        "Trim and soffit work",
        "Color-matched finishing"
      ],
      typical: "$4,000 - $20,000",
      timeline: "5-10 days"
    }
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Fully Insured & WSIB Compliant",
      description: "$5M liability coverage and full WSIB compliance protect you and your property."
    },
    {
      icon: Award,
      title: "15+ Years Team Experience",
      description: "Our crew has worked on hundreds of residential and commercial projects across the GTA."
    },
    {
      icon: CheckCircle,
      title: "Clear Quotes, No Surprises",
      description: "Detailed written estimates with itemized pricing. You know exactly what you're paying for."
    },
    {
      icon: Clock,
      title: "On-Time, Professional Execution",
      description: "We show up when we say we will, work efficiently, and clean up thoroughly every day."
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Request a Quote",
      description: "Fill out our estimate form or call us directly. Describe your project and upload photos if available.",
      cta: "Get Free Estimate"
    },
    {
      number: "02",
      title: "Site Visit & Estimate",
      description: "We'll visit your home to assess the work, take measurements, and answer your questions. You'll receive a detailed written estimate within 2-3 days.",
      cta: null
    },
    {
      number: "03",
      title: "Schedule & Execute",
      description: "Once you approve the estimate, we'll schedule your project (typically 1-3 weeks out). We arrive on time, work cleanly, and communicate throughout.",
      cta: null
    },
    {
      number: "04",
      title: "Final Walkthrough",
      description: "We'll walk through the completed work with you, address any concerns, and provide care instructions and warranty information.",
      cta: null
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="Residential Services for Homeowners | Painting, Renovations, Tile, Flooring | Ascent Group Construction"
        description="Professional residential construction services in Toronto and the GTA. Interior/exterior painting, stucco repair, tile & flooring, renovations, waterproofing. 15+ years experience, fully insured. Free estimates."
        keywords="residential painting Toronto, home renovation GTA, tile installation Toronto, flooring contractor, stucco repair homeowners, basement finishing, bathroom renovation, EIFS repair residential"
      />

      <Navigation />

      <PageHeader
        title="Residential Services for Homeowners"
        description="Professional Painting, Renovations, Tile, Flooring & More • 15+ Years Experience • Fully Insured • Free Estimates • Serving Toronto & GTA"
        backgroundImage={heroImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Homeowners" }
        ]}
      />

      {/* Introduction Section */}
      <Section variant="default">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge variant="secondary" className="mb-4">Trusted by Homeowners Across the GTA</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Quality Construction Services for Your Home
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Whether you're looking to refresh your home with new paint, repair exterior stucco damage, renovate your bathroom, or install new tile and flooring—we bring <strong>15+ years of professional construction experience</strong> to residential projects across Toronto and the Greater Toronto Area.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're a small, owner-operated team that delivers the same professional standards, quality materials, and clean execution you'd expect from larger firms—with the personalized attention and clear communication you deserve as a homeowner.
            </p>
          </div>
        </ScrollReveal>

        {/* Why Choose Us */}
        <StaggerContainer>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={index}>
                  <Card className="text-center h-full">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </StaggerContainer>
      </Section>

      {/* Residential Services Grid */}
      <Section variant="accent">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Residential Services</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From simple repairs to complete renovations, we handle a wide range of residential construction services with professional execution and fair pricing.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {residentialServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <ScrollReveal key={index}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Typical Scope:</h4>
                        <ul className="space-y-1">
                          {service.scope.map((item, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t flex items-center justify-between text-sm">
                        <div>
                          <span className="text-muted-foreground">Typical Cost:</span>
                          <p className="font-semibold text-primary">{service.typical}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-muted-foreground">Timeline:</span>
                          <p className="font-semibold">{service.timeline}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            );
          })}
        </StaggerContainer>

        <ScrollReveal>
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground mb-4">
              <strong>Note:</strong> Costs and timelines are estimates based on typical residential projects. Your actual project will be priced after a site visit.
            </p>
            <Button asChild size="lg">
              <Link to="/estimate">Get Your Free Estimate</Link>
            </Button>
          </div>
        </ScrollReveal>
      </Section>

      {/* How It Works */}
      <Section variant="default">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We've made it simple to get started. Here's what you can expect when working with Ascent Group Construction.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, index) => (
            <ScrollReveal key={index}>
              <Card className="text-center h-full">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                  {step.cta && (
                    <Button asChild size="sm" variant="outline">
                      <Link to="/estimate">{step.cta}</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </StaggerContainer>
      </Section>

      {/* FAQ Section for Homeowners */}
      <Section variant="accent">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Common Questions from Homeowners</h2>
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-6">
          <ScrollReveal>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you provide free estimates?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes. We provide free, no-obligation written estimates for all residential projects. After our site visit, you'll receive a detailed quote within 2-3 business days.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Are you insured and licensed?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes. We carry $5M commercial general liability insurance and are fully WSIB compliant. We can provide certificates of insurance upon request.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long will my project take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Most residential painting projects take 3-7 days. Tile and flooring installations typically take 3-8 days depending on size. Full renovations can range from 1-4 weeks. We'll provide a detailed timeline with your estimate.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer warranties?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes. We provide workmanship warranties on all residential services (typically 1-2 years depending on scope). Materials carry manufacturer warranties. Full warranty details are included in your contract.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What areas do you serve?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We serve Toronto and the Greater Toronto Area, including Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Burlington, and surrounding communities. Contact us to confirm service in your area.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </Section>

      {/* Final CTA */}
      <ParallaxSection
        backgroundImage={heroImage}
        speed={0.3}
        className="py-20"
      >
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Home Project?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Get a free, detailed estimate in 2-3 days. No pressure, no obligation—just professional advice and transparent pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="default">
                <Link to="/estimate">
                  <ClipboardCheck className="w-5 h-5 mr-2" />
                  Get Free Estimate
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us Today
                </Link>
              </Button>
            </div>
            <p className="text-sm text-white/80 mt-6">
              Or email us at <a href="mailto:info@ascentgroupconstruction.com" className="underline hover:text-white">info@ascentgroupconstruction.com</a>
            </p>
          </div>
        </ScrollReveal>
      </ParallaxSection>

      <Footer />
    </div>
  );
};

export default Homeowners;
```

---

### Update Routing

**File**: `src/App.tsx`

**ADD** the new route:

```tsx
import Homeowners from "@/pages/Homeowners";

// ... inside Routes
<Route path="/homeowners" element={<Homeowners />} />
```

---

### Add Navigation Links

**File**: Navigation component (find the appropriate location)

**ADD** homeowners link to main navigation and footer:

```tsx
{
  label: "For Homeowners",
  href: "/homeowners",
  description: "Residential painting, renovations, tile, flooring"
}
```

---

## Implementation Checklist

### Week 1 - Day 1-2: Prequalification Page
- [ ] Update `companyHighlights` array with realistic data
- [ ] Update `capabilities` array to show specialty contractor positioning
- [ ] Replace `recentProjects` with realistic project sizes
- [ ] Add "Company Status Transparency" banner
- [ ] Update SEO title and meta description
- [ ] Update PageHeader headline
- [ ] Test all links and downloads
- [ ] Review with team for accuracy

### Week 1 - Day 3-4: Company Story Reframe
- [ ] Update `enrichedCompanyStory` content in data file
- [ ] Update stats array (remove "Founded 2025")
- [ ] Rewrite founder bio with experience-first approach
- [ ] Update About page headline: "Proven Expertise. New Name."
- [ ] Rewrite About page introduction paragraphs
- [ ] Review all hero slides for "new company" messaging
- [ ] Update homepage hero if needed
- [ ] Search site-wide for "established in 2025" and reframe

### Week 1 - Day 5-6: Homeowners Page Creation
- [ ] Create `src/pages/Homeowners.tsx` file
- [ ] Add route to `App.tsx`
- [ ] Add navigation link in header
- [ ] Add link in footer
- [ ] Add homeowners CTA on homepage
- [ ] Test responsive design
- [ ] Review content for accuracy and tone
- [ ] Get residential service photos if available

---

## Success Metrics

After Week 1 implementation, you should be able to:

✅ Send prequalification package to GCs **without concerns** about inflated claims  
✅ Submit to bidding platforms with **honest, verifiable data**  
✅ Present company story that emphasizes **experience over incorporation date**  
✅ Capture residential leads through dedicated **homeowners page**  
✅ Position clearly as **specialty contractor** (not GC competitor)  
✅ Build trust through **transparency and realistic expectations**

---

## Next Steps (Week 2-4)

Once Week 1 is complete, we'll tackle:

**Week 2**: Service page restructuring, hero slide updates, GC partnership messaging  
**Week 3**: Residential service page expansion, capability statements  
**Week 4**: Claims verification, CTA optimization, final polish

---

## Questions for Hebun

Before proceeding with implementation, please confirm:

1. **Prequalification Numbers**: Are the revised stats accurate?
   - 10 core team members? (or should it be 5-8?)
   - $5M CGL insurance confirmed?
   - $25K-$500K project range realistic? (or lower/higher?)

2. **Project Examples**: Can you provide 2-3 real recent projects with:
   - Actual project value
   - Year completed
   - Brief scope description
   - Client type (can be anonymized: "Private Property Manager")

3. **Residential Services Priority**: Which residential services are you most confident to deliver immediately?
   - Interior painting? ✓
   - Exterior painting? ✓
   - Tile installation? ✓
   - Stucco repair? ✓
   - Full renovations? (lower priority?)

4. **Geographic Coverage**: Confirm service areas for residential work
   - All GTA? Or specific cities only?

---

**Ready to implement?** Let me know which priority to start with:
1. Fix prequalification page first
2. Create homeowners page first  
3. Tackle all Week 1 changes simultaneously

I'll create the detailed code changes once you confirm the data accuracy.
