import { useEffect, useState, type ReactNode } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UnifiedAdminLayout } from "./UnifiedAdminLayout";

interface TestSession { user: { id: string; email: string } }
const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  role: vi.fn(),
  unsubscribe: vi.fn(),
  from: vi.fn(),
  editorUnmounted: vi.fn(),
  authChanged: undefined as ((event: string, session?: TestSession | null) => void) | undefined,
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: {
  auth: {
    getSession: mocks.getSession,
    onAuthStateChange: (callback: (event: string, session?: TestSession | null) => void) => {
      mocks.authChanged = callback;
      return { data: { subscription: { unsubscribe: mocks.unsubscribe } } };
    },
  },
  from: mocks.from,
} }));
vi.mock("./UnifiedSidebar", () => ({ UnifiedSidebar: () => <aside>Admin sidebar</aside> }));
vi.mock("./NotificationBellInbox", () => ({ NotificationBellInbox: () => null }));
vi.mock("@/components/animations/PageTransition", () => ({ PageTransition: ({ children }: { children: ReactNode }) => <>{children}</> }));

const session = { user: { id: "owner-id", email: "owner@example.test" } };
const Editor = () => {
  const [draft, setDraft] = useState("");
  useEffect(() => () => { mocks.editorUnmounted(); }, []);
  return <input aria-label="Project draft" value={draft} onChange={event => setDraft(event.target.value)} />;
};
const Harness = () => <HelmetProvider><MemoryRouter initialEntries={["/admin/projects/project-1"]}>
  <Routes><Route path="/admin" element={<UnifiedAdminLayout />}><Route path="projects/:id" element={<Editor />} /></Route></Routes>
</MemoryRouter></HelmetProvider>;
const settle = () => act(async () => { await Promise.resolve(); });

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  sessionStorage.clear();
  localStorage.setItem("admin-onboarding-complete", "true");
  const query = {
    select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(), limit: vi.fn().mockReturnThis(),
    abortSignal: vi.fn().mockReturnThis(), maybeSingle: mocks.role,
  };
  mocks.from.mockReturnValue(query);
  mocks.getSession.mockResolvedValue({ data: { session }, error: null });
  mocks.role.mockResolvedValue({ data: { role: "super_admin" }, error: null });
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("admin editor session lifecycle", () => {
  it("keeps an actual editor mounted through role revalidation, then removes it if the role is revoked", async () => {
    render(<Harness />);
    await settle();
    const editor = screen.getByRole("textbox", { name: "Project draft" });
    fireEvent.change(editor, { target: { value: "An unsaved project description" } });
    let resolveRole: (value: { data: { role: string }; error: null }) => void;
    mocks.role.mockImplementationOnce(() => new Promise(resolve => { resolveRole = resolve; }));
    act(() => mocks.authChanged?.("TOKEN_REFRESHED", session));
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    expect(screen.getByRole("textbox", { name: "Project draft" })).toBe(editor);
    expect(editor).toHaveValue("An unsaved project description");
    expect(mocks.editorUnmounted).not.toHaveBeenCalled();
    await act(async () => { resolveRole({ data: { role: "super_admin" }, error: null }); });
    expect(screen.getByRole("textbox", { name: "Project draft" })).toBe(editor);
    expect(mocks.editorUnmounted).not.toHaveBeenCalled();

    mocks.role.mockResolvedValue({ data: null, error: null });
    act(() => mocks.authChanged?.("TOKEN_REFRESHED", session));
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    expect(screen.getByRole("heading", { name: "Admin access required" })).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "Project draft" })).not.toBeInTheDocument();
    expect(mocks.editorUnmounted).toHaveBeenCalledOnce();
  });

  it("does not carry one account's draft into another account's newly verified editor", async () => {
    render(<Harness />);
    await settle();
    fireEvent.change(screen.getByRole("textbox", { name: "Project draft" }), { target: { value: "First user's draft" } });
    const nextSession = { user: { id: "second-admin-id", email: "second@example.test" } };
    mocks.getSession.mockResolvedValue({ data: { session: nextSession }, error: null });
    let resolveRole: (value: { data: { role: string }; error: null }) => void;
    mocks.role.mockImplementationOnce(() => new Promise(resolve => { resolveRole = resolve; }));
    act(() => mocks.authChanged?.("SIGNED_IN", nextSession));
    expect(screen.queryByRole("textbox", { name: "Project draft" })).not.toBeInTheDocument();
    expect(mocks.editorUnmounted).toHaveBeenCalledOnce();
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    await act(async () => { resolveRole({ data: { role: "admin" }, error: null }); });
    expect(screen.getByRole("textbox", { name: "Project draft" })).toHaveValue("");
  });
});
