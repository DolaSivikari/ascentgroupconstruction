import { Link, LinkProps } from "react-router-dom";
import { ReactNode } from "react";
import { ALL_KNOWN_ROUTE_PATTERNS, isKnownRoute } from "@/routes/registry";

// Known route patterns - add more as routes are added
const KNOWN_ROUTES = [
  "/",
  "/about",
  "/services",
  "/services/:slug",
  "/services/building-envelope",
  "/services/cladding-systems",
  "/services/protective-coatings",
  "/services/interior-buildouts",
  "/services/painting-services",
  "/services/tile-flooring",
  "/services/sustainable-construction",
  "/projects",
  
  "/blog",
  "/blog/:slug",
  "/contact",
  "/estimate",
  "/careers",
  "/faq",
  "/prequalification",
  "/capabilities",
  "/sustainability",
  "/our-process",
  "/why-specialty-contractor",
  "/service-selector",
  "/insights",
  "/privacy",
  "/terms",
  "/accessibility",
  "/submit-rfp",
  "/commercial-clients",
  "/property-managers",
  "/for-general-contractors",
  "/homeowners",
  "/company/certifications-insurance",
  "/company/equipment-resources",
  "/company/developers",
  "/resources/service-areas",
  "/resources/contractor-portal",
  "/tekev",
  "/admin",
];

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
  // Validate internal links in development
  if (import.meta.env.DEV && to.startsWith("/")) {
    const isKnown = KNOWN_ROUTES.some(route => {
      const pattern = route.replace(/:[\w]+/g, "[^/]+");
      return new RegExp(`^${pattern}$`).test(to);
    });
    
    if (!isKnown) {
      console.warn(`[AppLink] Unknown route: ${to}`);
    }
  }

  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  );
};
