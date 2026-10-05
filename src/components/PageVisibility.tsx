import type { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { usePageSettings } from "@/lib/content/pageSettings";
export function PageVisibility({ children }: { children: ReactNode }) {
  const settings = usePageSettings();
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin") || !settings.hidden) return <>{children}</>;
  return (
    <main className="min-h-screen grid place-content-center gap-5 p-8 text-center">
      <Helmet>
        <title>Page unavailable | Ascent Group Construction</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <h1 className="text-3xl font-bold">This page is currently unavailable</h1>
      <Link to="/">Return home</Link>
    </main>
  );
}
