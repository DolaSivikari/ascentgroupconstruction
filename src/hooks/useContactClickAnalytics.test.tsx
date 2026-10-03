import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useContactClickAnalytics } from "./useContactClickAnalytics";
const mock = vi.hoisted(() => ({ phone: vi.fn(), email: vi.fn() }));
vi.mock("@/lib/analytics", () => ({
  trackPhoneClick: mock.phone,
  trackEmailClick: mock.email,
}));
function Links() {
  useContactClickAnalytics();
  return (
    <>
      <a href="tel:+16475286804">
        <span>Call</span>
      </a>
      <a href="mailto:private@example.com?subject=Private">Email</a>
      <a href="/services">Services</a>
    </>
  );
}
beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);
describe("contact link measurement", () => {
  it("tracks nested native contact links once without their addresses", () => {
    const view = render(<Links />);
    fireEvent.click(view.getByText("Call"));
    fireEvent.click(view.getByText("Email"));
    fireEvent.click(view.getByText("Services"));
    expect(mock.phone).toHaveBeenCalledExactlyOnceWith(
      window.location.pathname,
    );
    expect(mock.email).toHaveBeenCalledExactlyOnceWith(
      window.location.pathname,
    );
  });
  it("removes its listener on unmount", () => {
    const view = render(<Links />);
    const link = view.getByText("Call").closest("a")!;
    view.unmount();
    document.body.appendChild(link);
    fireEvent.click(link);
    expect(mock.phone).not.toHaveBeenCalled();
    link.remove();
  });
});
