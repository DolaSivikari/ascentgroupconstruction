import { useEffect } from "react";
import { trackEmailClick, trackPhoneClick } from "@/lib/analytics";

/** Cover native contact links across desktop/mobile navigation and page content. */
export function useContactClickAnalytics() {
  useEffect(() => {
    const track = (event: MouseEvent) => {
      if (event.defaultPrevented || !(event.target instanceof Element)) return;
      const href = event.target.closest("a")?.getAttribute("href")?.trim();
      // Report the page only; never include the email address or telephone number.
      if (href?.toLowerCase().startsWith("tel:"))
        trackPhoneClick(window.location.pathname);
      if (href?.toLowerCase().startsWith("mailto:"))
        trackEmailClick(window.location.pathname);
    };
    document.addEventListener("click", track);
    return () => document.removeEventListener("click", track);
  }, []);
}
