import { Suspense } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { lazyPage } from "./lazyPage";
const mock = vi.hoisted(() => ({ logError: vi.fn() }));
vi.mock("@/utils/errorLogger", () => mock);
it("keeps the original error and retries the import after a temporary failure", async () => {
  const error = new Error("Chunk unavailable");
  const importer = vi
    .fn()
    .mockRejectedValueOnce(error)
    .mockResolvedValueOnce({ default: () => <h1>Loaded page</h1> });
  const Page = lazyPage(importer, "Example");
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  try {
    render(
      <Suspense fallback={<p>Loading</p>}>
        <Page />
      </Suspense>,
    );
    fireEvent.click(await screen.findByText("Try again"));
    expect(await screen.findByText("Loaded page")).toBeInTheDocument();
    expect(importer).toHaveBeenCalledTimes(2);
    expect(mock.logError).toHaveBeenCalledWith(error, {
      feature: "Page: Example",
    });
  } finally {
    consoleError.mockRestore();
  }
});
