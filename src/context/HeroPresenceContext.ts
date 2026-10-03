import { createContext } from "react";

interface HeroPresenceContextValue {
  hasHero: boolean;
  register: () => () => void;
}

export const HeroPresenceContext = createContext<HeroPresenceContextValue | null>(null);
