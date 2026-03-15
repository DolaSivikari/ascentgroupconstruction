/**
 * Unified Component Library
 * Export all unified components for consistent usage across the site
 */

// Client/Audience Cards (legacy)
export { WhoWeServeCard } from "./WhoWeServeCard";
export { WhoWeServeSection } from "./WhoWeServeSection";
export { ClientSegmentCard } from "./ClientSegmentCard";
export type { WhoWeServeCardProps } from "./WhoWeServeCard";

// Feature & Benefit Cards (legacy — prefer CapabilityCard for new work)
export { BenefitCard } from './BenefitCard';
export { FeatureCard } from './FeatureCard';

// Process Cards
export { ProcessStepCard } from './ProcessStepCard';

// Tools
export { ServiceSelector } from '../tools/ServiceSelector';

// Design System Card Families (canonical — use these for new work)
export { CapabilityCard } from '@/design-system/components/CapabilityCard';
export { ProofCard } from '@/design-system/components/ProofCard';
export { SegmentCard } from '@/design-system/components/SegmentCard';

// Design System Section Patterns
export { SectionHeader } from '@/design-system/components/SectionHeader';
export { ProofStrip } from '@/design-system/components/ProofStrip';
export { CTABand } from '@/design-system/components/CTABand';
