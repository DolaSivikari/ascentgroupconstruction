import * as LucideIcons from "lucide-react";
import { ChevronRight } from "lucide-react";

/**
 * Resolve a Lucide icon component by name string.
 * Returns ChevronRight as fallback if the icon name is not found.
 */
export const getIcon = (iconName?: string) => {
  if (!iconName) return ChevronRight;
  const Icon = (LucideIcons as any)[iconName];
  return Icon || ChevronRight;
};
