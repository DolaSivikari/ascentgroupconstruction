import { Link, LinkProps } from "react-router-dom";
import { ReactNode } from "react";
import { ALL_KNOWN_ROUTE_PATTERNS, isKnownRoute } from "@/routes/registry";

interface AppLinkProps extends Omit<LinkProps, "to"> {
  to: string;
  children: ReactNode;
}

/**
 * Safe link wrapper with route validation in dev mode.
 */
export const AppLink = ({ to, children, ...props }: AppLinkProps) => {
  if (import.meta.env.DEV && to.startsWith("/")) {
    const normalized = to.split('#')[0].split('?')[0];
    if (normalized && !isKnownRoute(normalized, ALL_KNOWN_ROUTE_PATTERNS)) {
      console.warn(`[AppLink] Unknown route: ${to}`);
    }
  }

  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  );
};
