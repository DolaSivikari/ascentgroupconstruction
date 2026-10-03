import { Suspense, lazy, useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { Download } from "lucide-react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeroPresenceProvider, HeroSurface } from "./HeroPresenceProvider";
import { PageHero } from "./PageHero";
import Navigation from "@/components/Navigation";
import { PremiumProjectHero } from "@/components/projects/PremiumProjectHero";

vi.mock("@/hooks/useCompanySettings", () => ({ useCompanySettings: () => ({ settings: null }) }));
vi.mock("@/hooks/useAdminRoleCheck", () => ({ useAdminRoleCheck: () => ({ isAdmin: false }) }));
vi.mock("@/hooks/useScrollDirection", () => ({ useScrollDirection: () => ({ scrollDirection: "up", isAtTop: true }) }));
vi.mock("@/components/navigation/MegaMenuWithSections", () => ({ MegaMenuWithSections: () => null }));
vi.mock("@/components/navigation/MobileNavSheet", () => ({ MobileNavSheet: () => null }));
vi.mock("@/components/ui/ThemeToggle", () => ({ ThemeToggle: () => null }));

const LoadingPage = lazy(() => new Promise<{ default: () => JSX.Element }>(() => {}));
const LaterHero = () => {
  const [loaded, setLoaded] = useState(false);
  return loaded
    ? <PageHero title="Loaded service" />
    : <button onClick={() => setLoaded(true)}>Load hero</button>;
};
const Harness = ({ initial = "/services/example" }: { initial?: string }) => (
  <MemoryRouter initialEntries={[initial]}>
    <HeroPresenceProvider>
      <Navigation />
      <div>
        {["/services/example", "/privacy", "/terms", "/accessibility", "/resources/new-plain", "/projects/missing", "/loading", "/later", "/projects", "/"].map(path => (
          <Link key={path} to={path}>{path}</Link>
        ))}
      </div>
      <Suspense fallback={<p>Loading page</p>}>
        <Routes>
          <Route path="/services/example" element={<PageHero title="A service" />} />
          <Route path="/privacy" element={<p>Privacy policy</p>} />
          <Route path="/terms" element={<p>Terms of service</p>} />
          <Route path="/accessibility" element={<p>Accessibility policy</p>} />
          <Route path="/resources/new-plain" element={<p>Plain resource</p>} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/later" element={<LaterHero />} />
          <Route path="/projects" element={<PremiumProjectHero featuredProjects={[]} />} />
          <Route path="/" element={<main><HeroSurface><section>Custom home hero</section></HeroSurface></main>} />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </Suspense>
    </HeroPresenceProvider>
  </MemoryRouter>
);

afterEach(cleanup);
const header = (container: HTMLElement) => container.querySelector("nav.fixed") as HTMLElement;

describe("navigation hero presence", () => {
  it("uses the actual mounted hero, then restores readable legal and plain headers without resizing", () => {
    const { container } = render(<Harness />);
    expect(header(container)).toHaveClass("bg-transparent");
    const dimensions = header(container).querySelector(".hidden.md\\:flex")?.className;
    expect(screen.getByRole("link", { name: "Contact" })).toHaveClass("text-white");
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveClass("text-white");
    for (const path of ["/privacy", "/terms", "/accessibility", "/resources/new-plain", "/projects/missing"]) {
      fireEvent.click(screen.getByRole("link", { name: path }));
      expect(header(container)).toHaveClass("bg-background/95");
      expect(header(container)).not.toHaveClass("bg-transparent");
      expect(screen.getByRole("link", { name: "Contact" })).toHaveClass("text-foreground");
      expect(screen.getByRole("button", { name: "Open menu" })).toHaveClass("text-foreground");
      expect(header(container).querySelector(".hidden.md\\:flex")?.className).toBe(dimensions);
    }
  });

  it("does not leak the previous hero while a lazy route is loading", () => {
    const { container } = render(<Harness />);
    fireEvent.click(screen.getByRole("link", { name: "/loading" }));
    expect(screen.getByText("Loading page")).toBeInTheDocument();
    expect(header(container)).toHaveClass("bg-background/95");
  });

  it("stays solid until asynchronous content renders its hero", () => {
    const { container } = render(<Harness initial="/later" />);
    expect(header(container)).toHaveClass("bg-background/95");
    fireEvent.click(screen.getByRole("button", { name: "Load hero" }));
    expect(header(container)).toHaveClass("bg-transparent");
    fireEvent.click(screen.getByRole("link", { name: "/privacy" }));
    expect(header(container)).toHaveClass("bg-background/95");
  });

  it("registers both existing custom heroes without introducing layout wrappers", () => {
    const { container } = render(<Harness initial="/" />);
    expect(header(container)).toHaveClass("bg-transparent");
    expect(container.querySelector("main")?.children).toHaveLength(1);
    expect(container.querySelector("main")?.firstElementChild?.tagName).toBe("SECTION");
    fireEvent.click(screen.getByRole("link", { name: "/projects" }));
    expect(screen.getByRole("heading", { level: 1, name: "Our Projects" })).toBeInTheDocument();
    expect(header(container)).toHaveClass("bg-transparent");
  });

  it("keeps fragment CTAs as native anchors with button styling and their optional icons", () => {
    render(<MemoryRouter><HeroPresenceProvider><PageHero
      title="Contractor portal"
      primaryCta={{ text: "Download packet", href: "#download-section", icon: Download }}
      secondaryCta={{ text: "Request rates", href: "#unit-rate-form" }}
    /></HeroPresenceProvider></MemoryRouter>);
    const download = screen.getByRole("link", { name: "Download packet" });
    expect(download).toHaveAttribute("href", "#download-section");
    expect(download).toHaveClass("inline-flex", "gap-2");
    expect(download.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("link", { name: "Request rates" })).toHaveAttribute("href", "#unit-rate-form");
  });
});
