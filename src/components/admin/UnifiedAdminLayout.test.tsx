import { act, useEffect, useState, type ReactNode } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UnifiedAdminLayout } from "./UnifiedAdminLayout";
import type { AdminAccessStatus } from "@/hooks/useAdminAuth";

const mocks = vi.hoisted(() => ({
  status: "denied" as AdminAccessStatus,
  user: { id: "viewer", email: "viewer@example.test" } as { id: string; email: string } | null,
  retry: vi.fn(),
  signOut: vi.fn(),
  isVerifying: false,
  editorUnmounted: vi.fn(),
}));
vi.mock("@/hooks/useAdminAuth", () => ({ useAdminAuth: () => ({
  status: mocks.status,
  isLoading: mocks.status === "loading",
  isAdmin: mocks.status === "allowed",
  user: mocks.user,
  retry: mocks.retry,
  isVerifying: mocks.isVerifying,
}) }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth: { signOut: mocks.signOut } } }));
vi.mock("./UnifiedSidebar", () => ({ UnifiedSidebar: () => <aside>Admin sidebar</aside> }));
vi.mock("./NotificationBellInbox", () => ({ NotificationBellInbox: () => <button>Notifications</button> }));
vi.mock("@/components/animations/PageTransition", () => ({ PageTransition: ({ children }: { children: ReactNode }) => <>{children}</> }));
vi.mock("@/components/admin/OnboardingTour", () => ({ OnboardingTour: () => <div>Admin onboarding</div> }));
const SignIn = () => {
  const location = useLocation();
  return <p>Sign in destination: {new URLSearchParams(location.search).get("next")}</p>;
};
const Editor = () => {
  const [draft, setDraft] = useState("");
  useEffect(() => () => { mocks.editorUnmounted(); }, []);
  return <><p>Private inbox contents</p><input aria-label="Unsaved draft" value={draft} onChange={event => setDraft(event.target.value)} /></>;
};
const Harness = () => <HelmetProvider><MemoryRouter initialEntries={["/admin/inbox?type=rfp#lead"]}>
  <Routes>
    <Route path="/admin" element={<UnifiedAdminLayout />}>
      <Route path="inbox" element={<Editor />} />
    </Route>
    <Route path="/tekev" element={<SignIn />} />
    <Route path="/" element={<p>Public website</p>} />
  </Routes>
</MemoryRouter></HelmetProvider>;

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  mocks.status = "denied";
  mocks.user = { id: "viewer", email: "viewer@example.test" };
  mocks.signOut.mockResolvedValue({ error: null });
  mocks.isVerifying = false;
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("admin access screens", () => {
  it("does not automatically start the unsupported tour for a new admin", async () => {
    vi.useFakeTimers(); mocks.status = "allowed";
    render(<Harness />); await act(async () => { await vi.advanceTimersByTimeAsync(3000); });
    expect(screen.getByText("Private inbox contents")).toBeInTheDocument(); expect(screen.queryByText("Admin onboarding")).toBeNull();
  });
  it("keeps signed-in non-admins on an explicit no-access screen with safe actions", () => {
    render(<Harness />);
    expect(screen.getByRole("heading", { name: "Admin access required" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return to website" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
    expect(screen.queryByText("Private inbox contents")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin sidebar")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin onboarding")).not.toBeInTheDocument();
  });

  it("returns unsigned visitors to sign-in while preserving only their local admin destination", async () => {
    mocks.status = "signed-out";
    mocks.user = null;
    render(<Harness />);
    expect(await screen.findByText("Sign in destination: /admin/inbox?type=rfp#lead")).toBeInTheDocument();
    expect(screen.queryByText("Private inbox contents")).not.toBeInTheDocument();
  });

  it("offers a retry for a verification failure without rendering private children", () => {
    mocks.status = "error";
    mocks.user = null;
    render(<Harness />);
    expect(screen.getByRole("heading", { name: "Unable to verify admin access" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(mocks.retry).toHaveBeenCalledOnce();
    expect(screen.queryByText("Private inbox contents")).not.toBeInTheDocument();
  });

  it("signs out from the denial screen and returns to the public site", async () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(await screen.findByText("Public website")).toBeInTheDocument();
    expect(mocks.signOut).toHaveBeenCalledOnce();
  });

  it("shows a failed sign-out instead of implying it succeeded", async () => {
    mocks.signOut.mockResolvedValue({ error: new Error("Disconnected") });
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not sign out");
    await waitFor(() => expect(screen.getByRole("button", { name: "Sign out" })).not.toBeDisabled());
    expect(screen.getByRole("heading", { name: "Admin access required" })).toBeInTheDocument();
  });

  it("renders admin children only after successful role verification", () => {
    mocks.status = "allowed";
    render(<Harness />);
    expect(screen.getByText("Private inbox contents")).toBeInTheDocument();
    expect(screen.getByText("Admin sidebar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open admin navigation" })).toBeInTheDocument();
  });

  it("preserves a mounted editor and its draft during same-user background verification", () => {
    mocks.status = "allowed";
    const { rerender } = render(<Harness />);
    const draft = screen.getByRole("textbox", { name: "Unsaved draft" });
    fireEvent.change(draft, { target: { value: "A draft not yet saved" } });
    mocks.isVerifying = true;
    rerender(<Harness />);
    expect(screen.getByRole("textbox", { name: "Unsaved draft" })).toBe(draft);
    expect(draft).toHaveValue("A draft not yet saved");
    expect(mocks.editorUnmounted).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("Verifying admin access");
    mocks.isVerifying = false;
    rerender(<Harness />);
    expect(draft).toHaveValue("A draft not yet saved");
    expect(mocks.editorUnmounted).not.toHaveBeenCalled();
  });

  it.each(["denied", "error"] as const)("unmounts an editor when background verification finishes with %s", status => {
    mocks.status = "allowed";
    const { rerender } = render(<Harness />);
    mocks.status = status;
    rerender(<Harness />);
    expect(screen.queryByRole("textbox", { name: "Unsaved draft" })).not.toBeInTheDocument();
    expect(mocks.editorUnmounted).toHaveBeenCalledOnce();
  });
});
