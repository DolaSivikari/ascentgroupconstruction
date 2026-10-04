import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  loadNotifications,
  markNotificationsRead,
  notificationDestination,
  type InboxNotification,
} from "./notifications";
const mock = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: mock.from },
}));
const notification: InboxNotification = {
  id: "notice",
  notification_type: "rfp",
  reference_id: "lead-1",
  user_id: "admin-1",
  title: "New RFP",
  message: "Fixture",
  is_read: false,
  created_at: "2026-10-02T15:00:00Z",
};
beforeEach(() => vi.clearAllMocks());
describe("inbox notifications", () => {
  it("links to the relevant tab and highlights the submitted request", () => {
    expect(notificationDestination(notification)).toBe(
      "/admin/inbox?tab=leads&highlight=lead-1&source=rfp",
    );
    expect(
      notificationDestination({
        ...notification,
        notification_type: "unknown",
      }),
    ).toBe("/admin/inbox?tab=all&highlight=lead-1");
  });
  it("counts all unread notifications separately from the latest ten", async () => {
    const eqCalls: unknown[][] = [];
    mock.from.mockImplementation(() => {
      let count = false;
      const query = {
        select: (_fields: string, options?: { head: boolean }) => {
          count = !!options?.head;
          return query;
        },
        eq: (...args: unknown[]) => {
          eqCalls.push(args);
          return query;
        },
        order: () => query,
        limit: () =>
          Promise.resolve({ data: Array(10).fill(notification), error: null }),
        then: (resolve: (result: unknown) => unknown) =>
          Promise.resolve(resolve({ count: count ? 27 : null, error: null })),
      };
      return query;
    });
    const result = await loadNotifications("admin-1");
    expect(result.recent).toHaveLength(10);
    expect(result.unread).toBe(27);
    expect(eqCalls.filter((call) => call[0] === "user_id")).toEqual([
      ["user_id", "admin-1"],
      ["user_id", "admin-1"],
    ]);
  });
  it("reports load failures instead of claiming zero unread", async () => {
    const query = {
      select: () => query,
      eq: () => query,
      order: () => query,
      limit: async () => ({ data: null, error: new Error("offline") }),
      then: (resolve: (result: unknown) => unknown) =>
        Promise.resolve(resolve({ count: null, error: new Error("offline") })),
    };
    mock.from.mockReturnValue(query);
    await expect(loadNotifications("admin-1")).rejects.toThrow(
      "Notifications unavailable",
    );
  });
  it("scopes read updates to the signed-in user and unread records, and propagates errors", async () => {
    const eq = vi.fn(() => query);
    const query = {
      update: vi.fn(() => query),
      eq,
      then: (resolve: (result: unknown) => unknown) =>
        Promise.resolve(resolve({ error: new Error("denied") })),
    };
    mock.from.mockReturnValue(query);
    await expect(markNotificationsRead("admin-1", "notice")).rejects.toThrow(
      "denied",
    );
    expect(eq.mock.calls).toEqual([
      ["user_id", "admin-1"],
      ["is_read", false],
      ["id", "notice"],
    ]);
  });
});
