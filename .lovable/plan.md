

# Fix Navigation Transparency & Scroll Show/Hide Consistency

## Problem 1: Hero transparency missing on some pages
The `heroPages` array is a brittle whitelist. Instead of listing every path, we should use `startsWith` checks for dynamic route prefixes. Currently missing coverage for `/blog/*`, `/projects/*`, and any new `/services/*` slugs added via CMS.

**Fix:** Replace the long whitelist with a simpler approach — treat ALL public pages as hero pages (since they all use `PageHero`), using prefix matching for dynamic routes:

**File: `src/components/Navigation.tsx`** (lines 34–82)

Replace the entire `heroPages` array and `isHeroPage` check with:
```typescript
const heroPagePrefixes = ['/services/', '/service-areas/', '/blog/', '/projects/', '/company/', '/resources/'];
const heroPageExact = new Set([
  '/', '/services', '/about', '/careers', '/capabilities',
  '/contact', '/why-specialty-contractor', '/prequalification',
  '/submit-rfp', '/for-general-contractors', '/property-managers',
  '/commercial-clients', '/homeowners', '/our-process', '/markets',
  '/faq', '/blog', '/estimate', '/projects', '/for-architects',
  '/emergency-repair', '/privacy', '/terms', '/accessibility',
]);
const isHeroPage = heroPageExact.has(location.pathname) ||
  heroPagePrefixes.some(prefix => location.pathname.startsWith(prefix));
```

This eliminates the need to manually add every `/services/...` slug and covers all dynamic routes.

## Problem 2: Scroll direction inconsistent
The `useScrollDirection` hook has a stale closure bug. It includes `scrollDirection` in its `useEffect` dependency array, which means the effect tears down and re-registers on every direction change, resetting `lastScrollY` to the current scroll position. This causes missed or delayed direction detection.

**Fix in `src/hooks/useScrollDirection.ts`:**
- Use a `useRef` for `lastScrollY` so it persists across re-renders without re-running the effect
- Use a `useRef` for `scrollDirection` inside the effect to avoid the dependency
- Remove `scrollDirection` from the dependency array (empty deps = register once)

```typescript
import { useState, useEffect, useRef } from "react";

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      setIsAtTop(scrollY < 100);

      if (Math.abs(scrollY - lastScrollY.current) < 10) {
        ticking = false;
        return;
      }

      setScrollDirection(scrollY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []); // empty deps — register once

  return { scrollDirection, isAtTop };
};
```

## Summary
| File | Change |
|---|---|
| `src/hooks/useScrollDirection.ts` | Fix stale closure bug with refs, empty dependency array |
| `src/components/Navigation.tsx` | Replace brittle heroPages array with Set + prefix matching |

Two files, both small changes. Scroll behavior will be consistent on every page, and all current and future pages with heroes will get transparent nav automatically.

