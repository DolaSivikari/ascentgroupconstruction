import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useLocalDraft } from "./useLocalDraft";
beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());
it("coalesces typing and preserves the latest draft on unmount", () => {
  const hook = renderHook(
    ({ text }) => useLocalDraft({ text }, "draft", true),
    { initialProps: { text: "a" } },
  );
  hook.rerender({ text: "ab" });
  hook.rerender({ text: "abc" });
  expect(localStorage.getItem("draft")).toBeNull();
  act(() => {
    vi.advanceTimersByTime(500);
  });
  expect(JSON.parse(localStorage.getItem("draft")!).data.text).toBe("abc");
  hook.rerender({ text: "abcd" });
  hook.unmount();
  expect(JSON.parse(localStorage.getItem("draft")!).data.text).toBe("abcd");
});
it("does not recreate a cleared draft from a pending timer or unmount", () => {
  const hook = renderHook(() =>
    useLocalDraft({ text: "saved" }, "draft", true),
  );
  act(() => hook.result.current.clearLocalStorage());
  act(() => {
    vi.advanceTimersByTime(500);
  });
  hook.unmount();
  expect(localStorage.getItem("draft")).toBeNull();
});
it("flushes pending content under the old key when switching projects", () => {
  const hook = renderHook(
    ({ key, text }) => useLocalDraft({ text }, key, true),
    { initialProps: { key: "old", text: "old content" } },
  );
  hook.rerender({ key: "new", text: "new content" });
  expect(JSON.parse(localStorage.getItem("old")!).data.text).toBe(
    "old content",
  );
  hook.unmount();
  expect(JSON.parse(localStorage.getItem("new")!).data.text).toBe(
    "new content",
  );
});
