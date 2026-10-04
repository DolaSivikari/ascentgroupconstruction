import { useState, type ReactNode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import HomepageBuilder from "./HomepageBuilder";

vi.mock("@/components/admin/AdminPageLayout", () => ({
  AdminPageLayout: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock("./HeroSlidesManager", () => ({
  default: function HeroEditor() {
    const [headline, setHeadline] = useState("");
    const guard = useUnsavedChanges({ hasUnsavedChanges: !!headline });
    return (
      <>
        <input
          aria-label="Hero headline"
          value={headline}
          onChange={(event) => setHeadline(event.target.value)}
        />
        <ConfirmDialog
          open={guard.showDialog}
          onOpenChange={guard.cancelNavigation}
          onConfirm={guard.confirmNavigation}
          title="Unsaved changes"
          description={guard.message}
          confirmText="Leave"
          cancelText="Stay"
        />
      </>
    );
  },
}));
vi.mock("@/components/admin/WhyChooseUsManager", () => ({
  WhyChooseUsManager: () => <p>Why choose editor</p>,
}));
afterEach(cleanup);

it("keeps the dirty homepage editor mounted until tab navigation is confirmed", async () => {
  const router = createMemoryRouter(
    [{ path: "*", element: <HomepageBuilder /> }],
    { initialEntries: ["/admin/homepage-builder"] },
  );
  render(<RouterProvider router={router} />);
  fireEvent.change(screen.getByLabelText("Hero headline"), {
    target: { value: "Unsaved headline" },
  });
  const switchTab = () =>
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Why Choose Us" }), {
      button: 0,
      ctrlKey: false,
    });
  switchTab();
  fireEvent.click(await screen.findByRole("button", { name: "Stay" }));
  expect(screen.getByLabelText("Hero headline")).toHaveValue(
    "Unsaved headline",
  );
  expect(router.state.location.search).toBe("");
  switchTab();
  fireEvent.click(await screen.findByRole("button", { name: "Leave" }));
  expect(await screen.findByText("Why choose editor")).toBeInTheDocument();
  expect(router.state.location.search).toBe("?tab=why-choose");
});
