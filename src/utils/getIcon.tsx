import { lazy, Suspense, type ComponentType } from "react";
import {
  AlertTriangle,
  Award,
  BadgeCheck,
  Briefcase,
  Building,
  Building2,
  Calculator,
  Calendar,
  Car,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  FileCheck,
  FileText,
  Flame,
  FolderOpen,
  GitBranch,
  Grid2X2,
  Hammer,
  HardHat,
  HelpCircle,
  Home,
  Info,
  Landmark,
  Laptop,
  Layers,
  Layout,
  Leaf,
  Mail,
  MapPin,
  Paintbrush,
  Phone,
  Ruler,
  Shield,
  ShieldCheck,
  Square,
  Star,
  Users,
  Wrench,
  type LucideProps,
} from "lucide-react";
const icons: Record<string, ComponentType<LucideProps>> = {
  AlertTriangle,
  Award,
  BadgeCheck,
  Briefcase,
  Building,
  Building2,
  Calculator,
  Calendar,
  Car,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  FileCheck,
  FileText,
  Flame,
  FolderOpen,
  GitBranch,
  Grid2X2,
  Hammer,
  HardHat,
  HelpCircle,
  Home,
  Info,
  Landmark,
  Laptop,
  Layers,
  Layout,
  Leaf,
  Mail,
  MapPin,
  Paintbrush,
  Phone,
  Ruler,
  Shield,
  ShieldCheck,
  Square,
  Star,
  Users,
  Wrench,
};
type IconComponent = ComponentType<LucideProps>;
const deferred = new Map<string, Map<IconComponent | null, IconComponent>>();
/** Navigation and common CMS icons stay synchronous; rare CMS icons load on demand. */
export function getIcon(
  iconName?: string,
  fallback: ComponentType<LucideProps> | null = ChevronRight,
): ComponentType<LucideProps> | null {
  if (!iconName) return fallback;
  if (icons[iconName]) return icons[iconName];
  let variants = deferred.get(iconName);
  if (!variants) {
    variants = new Map();
    deferred.set(iconName, variants);
  }
  const cached = variants.get(fallback);
  if (cached) return cached;
  const LazyIcon = lazy(async () => {
    const { loadIcon } = await import("./loadIcon");
    const Loaded = await loadIcon(iconName);
    return { default: Loaded || fallback || (() => null) };
  });
  function DeferredIcon(props: LucideProps) {
    const Fallback = fallback;
    return (
      <Suspense fallback={Fallback ? <Fallback {...props} /> : null}>
        <LazyIcon {...props} />
      </Suspense>
    );
  }
  variants.set(fallback, DeferredIcon);
  return DeferredIcon;
}
