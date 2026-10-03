import { useContext, useLayoutEffect } from "react";
import { HeroPresenceContext } from "@/context/HeroPresenceContext";

/** Unregistered, plain, loading and error pages always use a solid navigation bar. */
export const useHeroPresence = () => useContext(HeroPresenceContext)?.hasHero ?? false;

/** Register only a mounted hero whose background supports white navigation text. */
export const useHeroRegistration = (enabled = true) => {
  const register = useContext(HeroPresenceContext)?.register;
  useLayoutEffect(() => {
    if (enabled && register) return register();
  }, [enabled, register]);
};
