import { useResolvedContent } from "@/lib/content/store";
import type { ContentModule } from "@/content/types";
export function usePageContent<T extends ContentModule>(module: T) {
  return useResolvedContent<Record<string, string>>(module);
}
