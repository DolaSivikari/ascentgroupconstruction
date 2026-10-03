import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAdminAuth } from "./useAdminAuth";

interface TestSession { user: { id: string; email: string } }

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  role: vi.fn(),
  unsubscribe: vi.fn(),
  from: vi.fn(),
  eq: vi.fn(),
  in: vi.fn(),
  abortSignal: vi.fn(),
  authChanged: undefined as ((event: string, session?: TestSession | null) => void) | undefined,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: mocks.getSession,
      onAuthStateChange: (callback: (event: string, session?: TestSession | null) => void) => {
        mocks.authChanged = callback;
        return { data: { subscription: { unsubscribe: mocks.unsubscribe } } };
      },
    },
    from: mocks.from,
  },
}));
const session = { user: { id: "admin-id", email: "owner@example.test" } };

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  sessionStorage.clear();
  const query = {
    select: vi.fn().mockReturnThis(),
    eq: mocks.eq.mockReturnThis(),
    in: mocks.in.mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    abortSignal: mocks.abortSignal.mockReturnThis(),
    maybeSingle: mocks.role,
  };
  mocks.from.mockReturnValue(query);
  mocks.getSession.mockResolvedValue({ data: { session }, error: null });
  mocks.role.mockResolvedValue({ data: { role: "super_admin" }, error: null });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const settle = () => act(async () => { await Promise.resolve(); });

describe("admin access verification", () => {
  it("checks the current session and allowed backend roles before granting access", async () => {
    const { result } = renderHook(() => useAdminAuth());
    expect(result.current.isLoading).toBe(true);
    await settle();
    expect(result.current.status).toBe("allowed");
    expect(result.current.user?.id).toBe("admin-id");
    expect(mocks.eq).toHaveBeenCalledWith("user_id", "admin-id");
    expect(mocks.in).toHaveBeenCalledWith("role", ["admin", "super_admin"]);
    expect(mocks.abortSignal).toHaveBeenCalledWith(expect.any(AbortSignal));
  });

  it("ignores a positive browser cache when the signed-in account has no admin role", async () => {
    sessionStorage.setItem("admin-auth-verified", JSON.stringify({ isAdmin: true, timestamp: Date.now() }));
    mocks.role.mockResolvedValue({ data: null, error: null });
    const { result } = renderHook(() => useAdminAuth());
    await settle();
    expect(result.current.status).toBe("denied");
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.user?.email).toBe("owner@example.test");
    expect(mocks.role).toHaveBeenCalledOnce();
  });

  it("does not query private roles when there is no signed-in session", async () => {
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: null });
    const { result } = renderHook(() => useAdminAuth());
    await settle();
    expect(result.current.status).toBe("signed-out");
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("keeps access blocked during bounded retries, then offers a fresh manual retry", async () => {
    mocks.role.mockResolvedValue({ data: null, error: new Error("Network unavailable") });
    const { result } = renderHook(() => useAdminAuth());
    await settle();
    expect(result.current.status).toBe("loading");
    await act(async () => { await vi.advanceTimersByTimeAsync(7000); });
    expect(mocks.role).toHaveBeenCalledTimes(4);
    expect(result.current.status).toBe("error");
    expect(vi.getTimerCount()).toBe(0);
    mocks.role.mockResolvedValue({ data: { role: "admin" }, error: null });
    act(() => result.current.retry());
    await settle();
    expect(result.current.isAdmin).toBe(true);
    expect(mocks.role).toHaveBeenCalledTimes(5);
  });

  it("finishes repeated timeouts without an infinite retry loop", async () => {
    mocks.getSession.mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useAdminAuth());
    await act(async () => { await vi.advanceTimersByTimeAsync(47000); });
    expect(mocks.getSession).toHaveBeenCalledTimes(4);
    expect(result.current.status).toBe("error");
    expect(result.current.isAdmin).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("discards a role response arriving after sign-out", async () => {
    let resolveRole: (value: { data: { role: string }; error: null }) => void;
    mocks.role.mockImplementation(() => new Promise(resolve => { resolveRole = resolve; }));
    const { result } = renderHook(() => useAdminAuth());
    await settle();
    act(() => mocks.authChanged?.("SIGNED_OUT"));
    await act(async () => { resolveRole({ data: { role: "admin" }, error: null }); });
    expect(result.current.status).toBe("signed-out");
    expect(result.current.isAdmin).toBe(false);
    expect(sessionStorage.getItem("admin-auth-verified")).toBeNull();
  });

  it("cancels scheduled retries and unsubscribes when the page unmounts", async () => {
    mocks.role.mockResolvedValue({ data: null, error: new Error("Network unavailable") });
    const { unmount } = renderHook(() => useAdminAuth());
    await settle();
    unmount();
    await act(async () => { await vi.advanceTimersByTimeAsync(60000); });
    expect(mocks.role).toHaveBeenCalledOnce();
    expect(mocks.unsubscribe).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("preserves verified same-user access while refreshing roles in the background", async () => {
    const { result } = renderHook(() => useAdminAuth());
    await settle();
    let resolveRole: (value: { data: { role: string }; error: null }) => void;
    mocks.role.mockImplementation(() => new Promise(resolve => { resolveRole = resolve; }));
    act(() => mocks.authChanged?.("TOKEN_REFRESHED", session));
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isVerifying).toBe(true);
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    expect(mocks.role).toHaveBeenCalledTimes(2);
    await act(async () => { resolveRole({ data: { role: "super_admin" }, error: null }); });
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isVerifying).toBe(false);
  });

  it("removes access when background verification confirms the role was revoked", async () => {
    const { result } = renderHook(() => useAdminAuth());
    await settle();
    mocks.role.mockResolvedValue({ data: null, error: null });
    act(() => mocks.authChanged?.("TOKEN_REFRESHED", session));
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    expect(result.current.status).toBe("denied");
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isVerifying).toBe(false);
  });

  it("blocks a changed account immediately and discards the previous account's pending response", async () => {
    const { result } = renderHook(() => useAdminAuth());
    await settle();
    let resolveOldRole: (value: { data: { role: string }; error: null }) => void;
    mocks.role.mockImplementationOnce(() => new Promise(resolve => { resolveOldRole = resolve; }));
    act(() => mocks.authChanged?.("TOKEN_REFRESHED", session));
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    const otherSession = { user: { id: "viewer-id", email: "viewer@example.test" } };
    mocks.getSession.mockResolvedValue({ data: { session: otherSession }, error: null });
    mocks.role.mockResolvedValue({ data: null, error: null });
    act(() => mocks.authChanged?.("SIGNED_IN", otherSession));
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.status).toBe("loading");
    await act(async () => {
      resolveOldRole({ data: { role: "admin" }, error: null });
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.status).toBe("denied");
    expect(result.current.user?.id).toBe("viewer-id");
  });

  it("clears same-user access immediately on sign-out during background verification", async () => {
    const { result } = renderHook(() => useAdminAuth());
    await settle();
    mocks.role.mockImplementation(() => new Promise(() => {}));
    act(() => mocks.authChanged?.("TOKEN_REFRESHED", session));
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    act(() => mocks.authChanged?.("SIGNED_OUT", null));
    await settle();
    expect(result.current.status).toBe("signed-out");
    expect(result.current.isAdmin).toBe(false);
    await act(async () => { await vi.advanceTimersByTimeAsync(60000); });
    expect(mocks.role).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe("signed-out");
  });

  it("fails closed after bounded background retries even when duplicate refresh events arrive", async () => {
    const { result } = renderHook(() => useAdminAuth());
    await settle();
    mocks.role.mockResolvedValue({ data: null, error: new Error("Network unavailable") });
    act(() => mocks.authChanged?.("TOKEN_REFRESHED", session));
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    expect(result.current.isAdmin).toBe(true);
    act(() => mocks.authChanged?.("TOKEN_REFRESHED", session));
    await act(async () => { await vi.advanceTimersByTimeAsync(7000); });
    expect(mocks.role).toHaveBeenCalledTimes(5); // initial verification + four attempts
    expect(result.current.status).toBe("error");
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isVerifying).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
});
