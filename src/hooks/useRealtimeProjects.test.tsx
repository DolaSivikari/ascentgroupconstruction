import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRealtimeProjects } from "./useRealtimeProjects";
const mock = vi.hoisted(() => ({
  on: vi.fn(),
  subscribe: vi.fn(),
  channel: vi.fn(),
  remove: vi.fn(),
  log: vi.fn(),
  event: undefined as undefined | (() => void),
  status: undefined as undefined | ((status: string, error?: Error) => void),
}));
vi.mock("@/utils/errorLogger", () => ({ logError: mock.log }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { channel: mock.channel, removeChannel: mock.remove },
}));
const channel = { on: mock.on, subscribe: mock.subscribe };
beforeEach(() => {
  vi.resetAllMocks();
  mock.event = undefined;
  mock.status = undefined;
  mock.channel.mockReturnValue(channel);
  mock.on.mockImplementation((_event, _filter, callback) => {
    mock.event = callback;
    return channel;
  });
  mock.subscribe.mockImplementation((callback) => {
    mock.status = callback;
    return channel;
  });
  mock.remove.mockResolvedValue("ok");
  mock.log.mockResolvedValue(undefined);
});
afterEach(cleanup);
describe("optional project live updates", () => {
  it("contains invalid WebSocket construction and still cleans up its channel", () => {
    const failure = new Error("WebSocket not available: invalid URL");
    mock.subscribe.mockImplementation(() => {
      throw failure;
    });
    const refresh = vi.fn();
    const hook = renderHook(() => useRealtimeProjects(refresh));
    expect(mock.log).toHaveBeenCalledWith(
      failure,
      expect.objectContaining({ feature: "projects-realtime" }),
    );
    expect(refresh).not.toHaveBeenCalled();
    hook.unmount();
    expect(mock.remove).toHaveBeenCalledWith(channel);
  });
  it("refreshes the current HTTP loader for all row changes without resubscribing", () => {
    const first = vi.fn();
    const second = vi.fn();
    const hook = renderHook(({ refresh }) => useRealtimeProjects(refresh), {
      initialProps: { refresh: first },
    });
    act(() => mock.event?.());
    hook.rerender({ refresh: second });
    act(() => mock.event?.());
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    expect(mock.channel).toHaveBeenCalledTimes(1);
    expect(mock.on.mock.calls[0][1]).not.toHaveProperty("filter");
    hook.unmount();
    act(() => mock.event?.());
    expect(second).toHaveBeenCalledTimes(1);
  });
  it("reports repeated connection failures once until reconnection", () => {
    renderHook(() => useRealtimeProjects(vi.fn()));
    act(() => {
      mock.status?.("CHANNEL_ERROR");
      mock.status?.("TIMED_OUT");
    });
    expect(mock.log).toHaveBeenCalledTimes(1);
    act(() => {
      mock.status?.("SUBSCRIBED");
      mock.status?.("CHANNEL_ERROR");
    });
    expect(mock.log).toHaveBeenCalledTimes(2);
  });
  it("handles a rejected channel cleanup without an unhandled promise", async () => {
    const error = new Error("Cleanup unavailable");
    mock.remove.mockRejectedValue(error);
    const hook = renderHook(() => useRealtimeProjects(vi.fn()));
    hook.unmount();
    await act(async () => {});
    expect(mock.log).toHaveBeenCalledWith(error, {
      feature: "projects-realtime-cleanup",
    });
  });
});
