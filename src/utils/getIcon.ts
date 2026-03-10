import * as LucideIcons from "lucide-react";
import { ChevronRight } from "lucide-react";

/**
 * Resolve a Lucide icon component by name string.
 * Pass a custom fallback (or null to suppress rendering) if ChevronRight isn't appropriate.
 */
export const getIcon = (
  iconName?: string,
  fallback: React.ComponentType<any> | null = ChevronRight
): React.ComponentType<any> | null => {
  if (!iconName) return fallback;
  const Icon = (LucideIcons as any)[iconName];
  return Icon || fallback;
};
