import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { HeroPresenceContext } from "@/context/HeroPresenceContext";
import { useHeroRegistration } from "@/hooks/useHeroPresence";

export const HeroPresenceProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const routeKey = location.key;
  const [heroes, setHeroes] = useState<Map<string, Set<symbol>>>(() => new Map());

  // Each registration belongs to this navigation, so an old page cannot make a
  // plain page transparent while its replacement is loading or rendering.
  const register = useCallback(() => {
    const token = Symbol("hero");
    setHeroes(current => {
      const next = new Map(current);
      next.set(routeKey, new Set([...(current.get(routeKey) ?? []), token]));
      return next;
    });
    return () => {
      setHeroes(current => {
        const next = new Map(current);
        const remaining = new Set(current.get(routeKey));
        remaining.delete(token);
        if (remaining.size) next.set(routeKey, remaining);
        else next.delete(routeKey);
        return next;
      });
    };
  }, [routeKey]);

  const hasHero = (heroes.get(routeKey)?.size ?? 0) > 0;
  const value = useMemo(() => ({ hasHero, register }), [hasHero, register]);
  return <HeroPresenceContext.Provider value={value}>{children}</HeroPresenceContext.Provider>;
};

/** Registers an existing custom hero without adding a wrapper or changing layout. */
export const HeroSurface = ({ children }: { children: ReactNode }) => {
  useHeroRegistration();
  return <>{children}</>;
};
