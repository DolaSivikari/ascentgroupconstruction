/**
 * Design System Components
 * Central export for all design system primitives and patterns
 */

// Base Card System
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";

// Card Families
export { CapabilityCard } from "./CapabilityCard";
export { ProofCard } from "./ProofCard";
export { SegmentCard } from "./SegmentCard";
export { DetailCard } from "./DetailCard";
export type { DetailCardProps, DetailCardStat } from "./DetailCard";

// Section Patterns
export { SectionHeader } from "./SectionHeader";
export { ProofStrip } from "./ProofStrip";
export { CTABand } from "./CTABand";
export { TrustRibbon } from "./TrustRibbon";
export type { TrustRibbonProps, TrustRibbonItem } from "./TrustRibbon";
export { RelatedLinksGrid } from "./RelatedLinksGrid";
export type { RelatedLinksGridProps, RelatedLink } from "./RelatedLinksGrid";

// Page Organizers
export { TabbedSections } from "./TabbedSections";
export type { TabbedSectionsProps, TabbedSection } from "./TabbedSections";
export { StickyPageNav } from "./StickyPageNav";
export type { StickyPageNavProps } from "./StickyPageNav";

// FAQ
export { FAQAccordion } from "./FAQAccordion";
export type { FAQAccordionProps, FAQItem } from "./FAQAccordion";
