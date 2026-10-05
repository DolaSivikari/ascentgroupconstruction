import { lazy, Suspense } from "react";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DeferredBoundary } from "./DeferredBoundary";
const mock = vi.hoisted(() => ({ log: vi.fn() }));
vi.mock("@/utils/errorLogger", () => ({ logError: mock.log }));
beforeEach(() => {
  mock.log.mockClear();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
describe("deferred feature isolation", () => {
  it("preserves the page and entered form values when a lazy import rejects", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("Failed to fetch dynamically imported module");
    const Broken = lazy(() => Promise.reject(error));
    render(
      <>
        <h1>Homepage</h1>
        <input aria-label="Inquiry details" />
        <DeferredBoundary name="Featured projects">
          <Suspense fallback={null}>
            <Broken />
          </Suspense>
        </DeferredBoundary>
        <footer>Contact us</footer>
      </>,
    );
    fireEvent.change(screen.getByLabelText("Inquiry details"), {
      target: { value: "Keep my request" },
    });
    expect(
      await screen.findByText("Featured projects could not load."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Homepage" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Inquiry details")).toHaveValue(
      "Keep my request",
    );
    expect(screen.getByText("Contact us")).toBeInTheDocument();
    expect(mock.log).toHaveBeenCalledWith(
      error,
      expect.objectContaining({ feature: "Featured projects" }),
    );
  });
  it("lets optional controls fail without replacing page content", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const Broken = lazy(() => Promise.reject(new Error("Missing chunk")));
    render(
      <>
        <p>Page content</p>
        <DeferredBoundary name="Scroll to top" optional>
          <Suspense fallback={null}>
            <Broken />
          </Suspense>
        </DeferredBoundary>
      </>,
    );
    await vi.waitFor(() => expect(mock.log).toHaveBeenCalled());
    expect(screen.getByText("Page content")).toBeInTheDocument();
    expect(screen.queryByRole("status")).toBeNull();
  });
});
