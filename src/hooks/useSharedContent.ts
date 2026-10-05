import { useResolvedContent } from "@/lib/content/store";
import { faqModules, faqDefaults, waveModules } from "@/content/shared/modules";
import { restoreStructured } from "@/content/structured";
import { WAVE1_PAGES } from "@/content/shared/wave1-defaults";
export function useSharedFaqs(key: keyof typeof faqDefaults) {
  const values = useResolvedContent(faqModules[key]);
  return restoreStructured(faqDefaults[key], values);
}
export function useWaveContent(slug: keyof typeof WAVE1_PAGES) {
  const values = useResolvedContent(waveModules[slug]);
  return restoreStructured(WAVE1_PAGES[slug], values);
}
