import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WhoIsOnSite from "@/pages/capabilities/WhoIsOnSite";
import PartnershipOrgChart from "@/pages/capabilities/PartnershipOrgChart";
import CapabilityMatrix from "@/pages/capabilities/CapabilityMatrix";
import AccessPlanner from "@/pages/capabilities/AccessPlanner";
import { accessLabel } from "@/pages/capabilities/access-data";
import InspectionTestPlan from "@/pages/capabilities/InspectionTestPlan";
import InteractiveModels from "@/pages/company/technology/sections/InteractiveModels";
import ClientDeliverables from "@/pages/company/technology/sections/ClientDeliverables";
import ProcessExplorer from "@/pages/company/technology/sections/ProcessExplorer";
import { measureShape } from "@/pages/company/technology/takeoff";
import { DeferredContent } from "./DeferredContent";

let reduced = false;
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => reduced,
}));

beforeEach(() => {
  reduced = false;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
const router = (component: React.ReactNode) =>
  render(<MemoryRouter>{component}</MemoryRouter>);

describe("Capabilities interactions", () => {
  it.each([
    ["prime-contractor", "Prime Contractor"],
    ["trade-partner", "Trade Partner"],
    ["consultant-led", "Consultant-Led"],
    ["direct-service", "Direct Service"],
  ])("preserves the existing #%s partnership deep link", (anchor, label) => {
    render(
      <MemoryRouter initialEntries={[`/capabilities#${anchor}`]}>
        <PartnershipOrgChart />
      </MemoryRouter>,
    );
    expect(screen.getByRole("tab", { name: label })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
  it("switches model counters and completes a site question without animation under reduced motion", () => {
    reduced = true;
    render(<WhoIsOnSite />);
    expect(
      screen.getByRole("button", { name: "Ascent model" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByText("Markup layers").nextElementSibling,
    ).toHaveTextContent("0");
    fireEvent.click(
      screen.getByRole("button", { name: "Typical broker model" }),
    );
    expect(
      screen.getByText("Markup layers").nextElementSibling,
    ).toHaveTextContent("2");
    expect(screen.getByText("Hand-offs").nextElementSibling).toHaveTextContent(
      "4",
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Show how a site question travels" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "reached Installer crew",
    );
  });
  it("offers linked, labelled partnership panels and keyboard tab navigation", async () => {
    router(<PartnershipOrgChart />);
    const tab = screen.getByRole("tab", { name: "Prime Contractor" });
    tab.focus();
    fireEvent.keyDown(tab, { key: "ArrowRight" });
    await waitFor(() =>
      expect(
        screen.getByRole("tab", { name: "Trade Partner" }),
      ).toHaveAttribute("aria-selected", "true"),
    );
    expect(
      screen.getByRole("link", { name: "Discuss this structure" }),
    ).toHaveAttribute("href", "/contact");
    fireEvent.keyDown(screen.getByRole("tab", { name: "Trade Partner" }), {
      key: "End",
    });
    await waitFor(() =>
      expect(
        screen.getByRole("tab", { name: "Direct Service" }),
      ).toHaveAttribute("aria-selected", "true"),
    );
  });
  it("filters the matrix, exposes expanded records and links to existing services", () => {
    router(<CapabilityMatrix />);
    fireEvent.change(screen.getByLabelText("Scope category"), {
      target: { value: "envelope" },
    });
    expect(screen.getByRole("status")).toHaveTextContent("4 scopes");
    fireEvent.click(
      screen.getByRole("button", { name: "Expand Joint sealants" }),
    );
    expect(
      screen.getByRole("button", { name: "Collapse Joint sealants" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/ASTM C1521/)).toBeVisible();
    expect(
      screen.getByRole("link", { name: "View service details →" }),
    ).toHaveAttribute("href", "/services/caulking-sealants-toronto");
    fireEvent.change(screen.getByLabelText("Building type"), {
      target: { value: "high-rise" },
    });
    expect(screen.getByRole("status")).toHaveTextContent("3 scopes");
    expect(
      screen.queryByRole("link", { name: "View service details →" }),
    ).not.toBeInTheDocument();
  });
  it.each([
    [3, "lower levels only, to about 6 m", "covers the full height"],
    [8, "lower levels only, to about 6 m", "covers the full height"],
    [20, "lower levels only, to about 6 m", "lower levels only, to about 24 m"],
  ])("labels access reach at %i storeys", (height, ladder, boom) => {
    expect(accessLabel("ladder", Number(height))).toBe(ladder);
    expect(accessLabel("boom", Number(height))).toBe(boom);
  });
  it("resets an unavailable access method when the height goes below its minimum", () => {
    render(<AccessPlanner />);
    fireEvent.change(screen.getByLabelText(/Building height/), {
      target: { value: "3" },
    });
    expect(screen.getByRole("button", { name: /Swing stage/ })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Ladders & platforms/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("img")).toHaveAccessibleName(
      /3-storey building, 9 metres/,
    );
  });
  it("navigates the ITP and clears a sample decision between inspections", () => {
    render(<InspectionTestPlan />);
    fireEvent.click(screen.getByLabelText("Accepted"));
    fireEvent.click(screen.getByRole("button", { name: "Next inspection" }));
    expect(
      screen.queryByRole("group", { name: "Sample release form" }),
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Previous inspection" }),
    );
    expect(screen.getByLabelText("Accepted")).not.toBeChecked();
    expect(screen.getByText("Step 4 of 7 · Hold point")).toBeVisible();
  });
});

describe("Technology interactions", () => {
  it("builds immediately with reduced motion, resets and exposes selected wall layers", () => {
    reduced = true;
    render(<InteractiveModels />);
    fireEvent.click(screen.getByRole("button", { name: "Build it" }));
    expect(
      screen.getByRole("slider", { name: "Blueprint build progress" }),
    ).toHaveValue("100");
    fireEvent.click(screen.getByRole("button", { name: "Reset view" }));
    expect(
      screen.getByRole("slider", { name: "Blueprint build progress" }),
    ).toHaveValue("0");
    fireEvent.mouseDown(
      screen.getByRole("tab", { name: "Stucco & EIFS wall section" }),
      { button: 0, ctrlKey: false },
    );
    fireEvent.click(
      screen.getByRole("button", { name: "3. Glass-mat sheathing" }),
    );
    expect(
      screen.getByRole("heading", { name: /3. Glass-mat sheathing/ }),
    ).toBeVisible();
  });
  it("highlights the sheets produced by a tool and qualifies GC system use", () => {
    const { container } = render(<InteractiveModels />);
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Project record" }), {
      button: 0,
      ctrlKey: false,
    });
    fireEvent.click(screen.getByRole("button", { name: "Procore" }));
    expect(screen.getByRole("button", { name: "Procore" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      container.querySelectorAll('[data-highlighted="true"]'),
    ).toHaveLength(2);
    expect(screen.getByText("Used when the GC requires it")).toBeVisible();
  });
  it("changes process tabs with Home/End and Previous/Next", async () => {
    render(<ProcessExplorer />);
    const tab = screen.getByRole("tab", { name: "1. Site assessment" });
    tab.focus();
    fireEvent.keyDown(tab, { key: "End" });
    await waitFor(() =>
      expect(
        screen.getByRole("heading", {
          name: "One organized package at handover.",
        }),
      ).toBeVisible(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Previous step" }));
    expect(
      screen.getByRole("heading", {
        name: "Progress recorded every working day.",
      }),
    ).toBeVisible();
  });
  it("computes calibrated line lengths and polygon areas independently of winding", () => {
    expect(
      measureShape("length", [
        { x: 0, y: 0 },
        { x: 183, y: 0 },
      ]),
    ).toBeCloseTo(10);
    const points = [
      { x: 0, y: 0 },
      { x: 183, y: 0 },
      { x: 183, y: 183 },
      { x: 0, y: 183 },
    ];
    expect(measureShape("area", points)).toBeCloseTo(100);
    expect(measureShape("area", [...points].reverse())).toBeCloseTo(100);
    expect(measureShape("count", points)).toBe(4);
  });
  it("allows a keyboard takeoff, undo and clear without modifying backend data", () => {
    render(<ClientDeliverables />);
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Digital takeoff" }), {
      button: 0,
      ctrlKey: false,
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Measure window perimeters" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("252.0 m");
    expect(within(screen.getByRole("table")).getByText("A-301")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(screen.getByRole("status")).toHaveTextContent("0.0 m");
    fireEvent.click(
      screen.getByRole("button", { name: "Quick sample takeoff" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("146.0 m");
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByRole("status")).toHaveTextContent("0.0 m");
  });
  it("does not mount deferred controls until they approach the viewport", () => {
    render(
      <DeferredContent>
        <button>Deferred control</button>
      </DeferredContent>,
    );
    expect(
      screen.queryByRole("button", { name: "Deferred control" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "loads as you approach",
    );
  });
});
