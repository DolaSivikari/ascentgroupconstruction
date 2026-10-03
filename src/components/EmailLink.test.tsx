import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EmailLink } from "./EmailLink";
import { useContactClickAnalytics } from "@/hooks/useContactClickAnalytics";
const mock = vi.hoisted(() => ({ email: vi.fn(), phone: vi.fn() }));
vi.mock("@/lib/analytics", () => ({ trackEmailClick: mock.email, trackPhoneClick: mock.phone }));
function LinkWithTracking() {
  useContactClickAnalytics();
  return <EmailLink encoded={btoa("private@example.invalid")} />;
}
afterEach(() => { cleanup(); vi.clearAllMocks(); });
describe("obfuscated contact links", () => {
  it("tracks each reveal/click once without forwarding the email address", async () => {
    render(<LinkWithTracking />);
    const link = await screen.findByRole("link", { name: "Send email" });
    fireEvent.click(link);
    expect(mock.email).toHaveBeenCalledExactlyOnceWith(window.location.pathname);
    expect(link).toHaveAttribute("href", "mailto:private@example.invalid");
    fireEvent.click(link);
    expect(mock.email).toHaveBeenCalledTimes(2);
    expect(mock.email.mock.calls.flat()).not.toContain("private@example.invalid");
  });
});
